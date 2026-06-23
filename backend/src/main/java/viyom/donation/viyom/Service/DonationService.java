package viyom.donation.viyom.Service;

import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import viyom.donation.viyom.Entity.Donation;
import viyom.donation.viyom.Entity.Donor;
import viyom.donation.viyom.Entity.DonationPool;
import viyom.donation.viyom.Entity.Sector;
import viyom.donation.viyom.Entity.Milestone;
import viyom.donation.viyom.Entity.PaymentOrder;
import viyom.donation.viyom.Repository.DonationRepository;
import viyom.donation.viyom.blockchain.service.BlockchainService;
import viyom.donation.viyom.dto.CreatePaymentOrderRequest;
import viyom.donation.viyom.dto.CreatePaymentOrderResponse;
import viyom.donation.viyom.dto.VerifyPaymentRequest;
import viyom.donation.viyom.dto.VerifyPaymentResponse;
import viyom.donation.viyom.dto.DonationHistoryResponse;

import java.math.BigDecimal;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DonationService {

    private final DonationRepository donationRepository;
    private final PaymentService paymentService;
    private final AuthService authService;
    private final MilestoneService milestoneService;
    private final NotificationService notificationService;
    private final BlockchainService blockchainService;
    private final viyom.donation.viyom.Repository.PaymentTransactionRepository paymentTransactionRepository;
    private final TemplateService templateService;
    private final viyom.donation.viyom.notification.twilio.WhatsAppService whatsAppService;

    @Autowired
    @Lazy
    private DonationService self;



    public CreatePaymentOrderResponse createOrder(CreatePaymentOrderRequest request, Donor donor) throws RazorpayException {
        PaymentOrder order = paymentService.createOrder(
            request.getAmount(), 
            "INR", 
            "receipt_" + System.currentTimeMillis(), 
            authService.getCurrentUser(), 
            request.getPoolId(),
            request.getAnonymous()
        );

        return CreatePaymentOrderResponse.builder()
                .razorpayOrderId(order.getRazorpayOrderId())
                .currency(order.getCurrency())
                .amount(order.getAmount().toPlainString())
                .build();
    }

    @Transactional
    public VerifyPaymentResponse verifyPayment(VerifyPaymentRequest request) throws RazorpayException, NoSuchAlgorithmException, InvalidKeyException {
        log.info("🔍 Service: Verifying payment for OrderID: {}", request.getRazorpayOrderId());
        boolean isValid = paymentService.verifyPaymentSignature(request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature());

        if (isValid) {
            // Get the payment order to retrieve amount
            PaymentOrder paymentOrder = paymentService.getPaymentOrderByRazorpayOrderId(request.getRazorpayOrderId());
            
            // Save payment transaction and create donation record
            paymentService.savePaymentTransaction(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature(),
                paymentOrder.getAmount(),
                "SUCCESS",
                request.getDonorPhone() // ✅ Use phone from request
            );
            
            // Find the created donation
            Donation donation = donationRepository.findByPaymentOrder_RazorpayOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new RuntimeException("Donation not found after creation"));

            return VerifyPaymentResponse.builder()
                    .status("SUCCESS")
                    .donationId(donation.getDonationId())
                    .message("Payment verified. Recording on blockchain...")
                    .build();
        }

        return VerifyPaymentResponse.builder().status("FAILED").build();
    }

    @Async
    public void recordDonationOnBlockchainAsync(Long donationId) {
        log.info("🚀 Triggering asynchronous post-payment tasks for donation ID: {}", donationId);
        try {
            // Step 1: Record on blockchain
            self.recordDonationOnBlockchainSync(donationId);
            
            // Step 2: Milestone check
            self.triggerMilestoneCheck(donationId);

            // Step 3: Trigger WhatsApp Notification
            self.sendSuccessNotification(donationId);
            
        } catch (Exception e) {
            log.error("❌ Asynchronous tasks encountered a problem for donation ID {}: {}", donationId, e.getMessage());
        }
    }

    /**
     * Sends a rich success notification via WhatsApp in Marathi with blockchain details.
     */
    public void sendSuccessNotification(Long donationId) {
        try {
            Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found for notification: " + donationId));
            
            // Prioritize phone from form, fallback to donor profile
            String phone = (donation.getDonorPhone() != null && !donation.getDonorPhone().isEmpty()) 
                           ? donation.getDonorPhone() 
                           : (donation.getDonor() != null ? donation.getDonor().getPhoneNumber() : null);

            if (phone != null && !phone.equals("NA")) {
                log.info("📱 Triggering WhatsApp Marathi notification for phone: {}", phone);
                
                String donorName = donation.getAnonymous() ? "Kind Donor" : (donation.getDonor().getFullName() != null && !donation.getDonor().getFullName().contains("@") ? donation.getDonor().getFullName() : "प्रिय देणगीदार");
                String amount = donation.getAmount().toString();
                String category = donation.getDonationPool() != null ? (donation.getDonationPool().getSector() != null ? donation.getDonationPool().getSector().getName() : donation.getDonationPool().getPoolCode()) : "General Donation";
                String orderId = (donation.getPaymentOrder() != null) ? donation.getPaymentOrder().getRazorpayOrderId() : "NA";
                String txnHash = (donation.getBlockchainTxnHash() != null) ? donation.getBlockchainTxnHash() : "Pending Registration";

                // Build Marathi Message Content
                String marathiMessage = String.format(
                        "🙏 धन्यवाद!\n\n" +
                        "आपण केलेल्या देणगीबद्दल मनःपूर्वक आभार 🙏\n\n" +
                        "📌 देणगी तपशील:\n" +
                        "👤 नाव: %s\n" +
                        "💰 रक्कम: ₹%s\n" +
                        "📂 प्रकार: %s\n" +
                        "🆔 ऑर्डर आयडी: %s\n\n" +
                        "🔗 तुमचा व्यवहार सुरक्षितपणे ब्लॉकचेनवर नोंदवला गेला आहे:\n" +
                        "Txn Hash: %s\n\n" +
                        "आपल्या छोट्याशा मदतीमुळे मोठा बदल घडू शकतो ❤️\n\n" +
                        "लवकरच आपणास आपल्या देणगीचा परिणाम (Impact Update) कळवण्यात येईल.\n\n" +
                        "धन्यवाद!\n" +
                        "– Viyom Team 🌍",
                        donorName, amount, category, orderId, txnHash
                );

                // Optional: Media URL (If you have ngrok or S3 URL, add it here)
                String mediaUrl = null; 

                // Call the new flexible WhatsAppService method
                whatsAppService.sendWhatsApp(phone, marathiMessage, mediaUrl);
                
            } else {
                log.warn("⚠️ No valid phone number found for donation {}. WhatsApp skipped.", donationId);
            }
        } catch (Exception e) {
            log.warn("⚠️ Failed to send WhatsApp Marathi success notification for donation {}: {}", donationId, e.getMessage());
        }
    }

    /**
     * Record donation on blockchain synchronously to get immediate transaction hash
     * This method is used in payment verification to return blockchain hash to user
     * 
     * @param donationId The ID of the donation to record on blockchain
     * @return The blockchain transaction hash or null if failed
     */
    /**
     * Updates only the blockchain hash in a fresh transaction.
     * Use to persist the hash after the long wait, without keeping the main connection open for 120s.
     */
    @Transactional
    public void updateDonationBlockchainStatus(Long donationId, String hash, String status) {
        donationRepository.findById(donationId).ifPresent(donation -> {
            donation.setBlockchainTxnHash(hash);
            donation.setBlockchainStatus(status);
            donationRepository.save(donation);
            log.info("📝 Updated donation {} - Hash: {}, Status: {}", donationId, hash, status);
        });
    }

    /**
     * Record donation on blockchain synchronously (with wait). 
     * NOTE: NO @Transactional here – we don't want to hold a DB connection for 120s!
     */
    public String recordDonationOnBlockchainSync(Long donationId) {
        log.info("⏳ Starting synchronous blockchain recording for donation: {} (no DB tx held)", donationId);
        try {
            // Load necessary data outside of a long-running transaction
            Donation donation = donationRepository.findById(donationId)
                    .orElseThrow(() -> new RuntimeException("Donation not found: " + donationId));
            
            String donorEmail = donation.getDonor().getEmail();
            BigDecimal amount = donation.getAmount();
            String category = donation.getDonationPool().getSector().getName();
            String razorpayOrderId = (donation.getPaymentOrder() != null) ? donation.getPaymentOrder().getRazorpayOrderId() : null;
            String orderId = razorpayOrderId != null ? razorpayOrderId : ("DONATION_" + donation.getDonationId());
            Long timestamp = System.currentTimeMillis() / 1000;
            
            // Invoke the blockchain service
            CompletableFuture<BlockchainService.BlockchainResult> blockchainFuture = blockchainService.recordDonationOnBlockchain(
                    donorEmail, amount, category, orderId, timestamp
            );
            
            // Wait for it (up to 120s) without holding a database transaction!
            BlockchainService.BlockchainResult result;
            try {
                result = blockchainFuture.get(120, TimeUnit.SECONDS);
            } catch (TimeoutException te) {
                log.error("⏰ Blockchain Recording TIMEOUT (120s) for donation {}. Will retry later.", donationId);
                blockchainFuture.cancel(true);
                return null;
            }
            
            if (result != null && result.getTransactionHash() != null) {
                // Now use 'self' to call the transactional method so a new transaction is actually created!
                self.updateDonationBlockchainStatus(donationId, result.getTransactionHash(), result.getStatus());
                return result.getTransactionHash();
            }
            return null;
            
        } catch (Exception e) {
            log.error("💥 sync record blockchain failed: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Trigger milestone check asynchronously after donation confirmation
     */
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<Void> triggerMilestoneCheck(Long donationId) {
        try {
            // Re-load donation in this thread
            Donation donation = donationRepository.findById(donationId)
                    .orElseThrow(() -> new RuntimeException("Donation not found for milestone check: " + donationId));

            log.info("Triggering milestone check for donation: {} in pool: {}", 
                     donationId, donation.getDonationPool().getPoolId());

            // Get category from the donation pool's sector
            String category = donation.getDonationPool().getSector().getName();
            
            // Calculate current metrics for the category
            CategoryMetrics metrics = calculateCategoryMetrics(category);
            
            // Check and update milestones
            List<Milestone> achievedMilestones = milestoneService.checkAndUpdateMilestones(
                    category, metrics.getTotalAmount(), metrics.getDonorCount());
            
            // Send notifications if milestones were achieved
            if (!achievedMilestones.isEmpty()) {
                List<Donor> donorsInCategory = getDonorsInCategory(category);
                notificationService.sendMilestoneNotifications(achievedMilestones, donorsInCategory);
            }
            
        } catch (Exception e) {
            log.error("Error during milestone check for donation: {}", donationId, e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Calculate current metrics for a category (total amount and donor count)
     */
    private CategoryMetrics calculateCategoryMetrics(String category) {
        // Get all donations for this category via the sector
        List<Donation> categoryDonations = donationRepository.findByDonationPool_Sector_Name(category);
        
        BigDecimal totalAmount = categoryDonations.stream()
                .map(Donation::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long uniqueDonorCount = categoryDonations.stream()
                .map(d -> d.getDonor().getDonorId())
                .distinct()
                .count();
        
        return CategoryMetrics.builder()
                .totalAmount(totalAmount)
                .donorCount((int) uniqueDonorCount)
                .build();
    }

    /**
     * Get all unique donors who have donated to a specific category
     */
    private List<Donor> getDonorsInCategory(String category) {
        return donationRepository.findByDonationPool_Sector_Name(category).stream()
                .map(Donation::getDonor)
                .distinct()
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DonationHistoryResponse> getDonationsForDonor(Donor donor) {
        log.info("Fetching donations for donor: {}", donor.getEmail());
        List<Donation> donations = donationRepository.findByDonor(donor);
        log.debug("Found {} donations for donor", donations.size());
        return donations.stream()
                .map(this::convertToDonationHistoryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DonationHistoryResponse> getAllDonations() {
        List<Donation> donations = donationRepository.findAll();
        return donations.stream()
                .map(this::convertToDonationHistoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get donation entities for donor
     */
    public List<Donation> getDonationEntitiesForDonor(Donor donor) {
        return donationRepository.findByDonor(donor);
    }

    /**
     * Convert Donation entity to DonationHistoryResponse DTO
     */
    private DonationHistoryResponse convertToDonationHistoryResponse(Donation donation) {
        PaymentOrder paymentOrder = donation.getPaymentOrder();
        DonationPool pool = donation.getDonationPool();
        Sector sector = pool.getSector();
        Donor donor = donation.getDonor();
        
        String razorpayPaymentId = null;
        String razorpayOrderId = null;
        String status = "UNKNOWN";
        
        if (paymentOrder != null) {
            razorpayOrderId = paymentOrder.getRazorpayOrderId();
            status = paymentOrder.getStatus();
            
            // Get actual payment ID from database
            try {
                viyom.donation.viyom.Entity.PaymentTransaction transaction = 
                    paymentTransactionRepository.findByPaymentOrder(paymentOrder).orElse(null);
                if (transaction != null) {
                    razorpayPaymentId = transaction.getRazorpayPaymentId();
                } else if (razorpayOrderId != null && razorpayOrderId.length() > 6) {
                    // Fallback to derived ID if transaction record is not found (for legacy support)
                    razorpayPaymentId = "PAYMENT_" + razorpayOrderId.substring(6);
                }
            } catch (Exception e) {
                log.warn("Could not fetch payment transaction for order {}: {}", razorpayOrderId, e.getMessage());
            }
        }
        
        String donorName = "Anonymous";
        String donorEmail = null;
        
        if (donor != null && !donation.getAnonymous()) {
            donorName = donor.getFullName() != null ? donor.getFullName() : donor.getEmail();
            donorEmail = donor.getEmail();
        }
        
        return DonationHistoryResponse.builder()
                .donationId(donation.getDonationId())
                .amount(donation.getAmount())
                .donatedAt(donation.getDonatedAt())
                .anonymous(donation.getAnonymous())
                .blockchainTxnHash(donation.getBlockchainTxnHash())
                .blockchainStatus(donation.getBlockchainStatus())
                .status(status)
                .razorpayOrderId(razorpayOrderId)
                .razorpayPaymentId(razorpayPaymentId)
                .donorName(donorName)
                .donorEmail(donorEmail)
                .poolId(pool.getPoolId())
                .poolName(pool.getPoolCode())
                .sectorId(sector.getSectorId())
                .sectorName(sector.getName())
                .build();
    }

    @lombok.Data
    @lombok.Builder
    private static class CategoryMetrics {
        private BigDecimal totalAmount;
        private Integer donorCount;
    }
}
