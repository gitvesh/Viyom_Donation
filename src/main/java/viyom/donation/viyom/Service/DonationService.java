package viyom.donation.viyom.Service;

import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
import viyom.donation.viyom.Repository.DonationPoolRepository;
import viyom.donation.viyom.Repository.DonorRepository;
import viyom.donation.viyom.dto.CreatePaymentOrderRequest;
import viyom.donation.viyom.dto.CreatePaymentOrderResponse;
import viyom.donation.viyom.dto.VerifyPaymentRequest;
import viyom.donation.viyom.dto.VerifyPaymentResponse;

import java.math.BigDecimal;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class DonationService {

    private final DonationRepository donationRepository;
    private final PaymentService paymentService;
    private final AuthService authService;
    private final MilestoneService milestoneService;
    private final NotificationService notificationService;
    private final DonationPoolRepository donationPoolRepository;
    private final DonorRepository donorRepository;

    public CreatePaymentOrderResponse createOrder(CreatePaymentOrderRequest request, Donor donor) throws RazorpayException {
        PaymentOrder order = paymentService.createOrder(request.getAmount(), "INR", "receipt_" + System.currentTimeMillis(), authService.getCurrentUser(), request.getSectorId());

        return CreatePaymentOrderResponse.builder()
                .razorpayOrderId(order.getRazorpayOrderId())
                .currency(order.getCurrency())
                .amount(order.getAmount().toPlainString())
                .build();
    }

    @Transactional
    public VerifyPaymentResponse verifyPayment(VerifyPaymentRequest request) throws RazorpayException, NoSuchAlgorithmException, InvalidKeyException {
        boolean isValid = paymentService.verifyPaymentSignature(request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature());

        if (isValid) {
            Donation donation = donationRepository.findByPaymentOrder_RazorpayOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new RuntimeException("Donation not found for this order"));

            // Trigger milestone check asynchronously after donation is confirmed
            triggerMilestoneCheck(donation);

            return VerifyPaymentResponse.builder()
                    .status("SUCCESS")
                    .donationId(donation.getDonationId())
                    .build();
        }

        return VerifyPaymentResponse.builder().status("FAILED").build();
    }

    /**
     * Trigger milestone check asynchronously after donation confirmation
     * This ensures the main donation flow is not blocked by milestone processing
     */
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<Void> triggerMilestoneCheck(Donation donation) {
        try {
            log.info("Triggering milestone check for donation: {} in pool: {}", 
                     donation.getDonationId(), donation.getDonationPool().getPoolId());

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
            log.error("Error during milestone check for donation: {}", donation.getDonationId(), e);
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

    public List<Donation> getDonationsForDonor(Donor donor) {
        return donationRepository.findByDonor(donor);
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    /**
     * DTO for category metrics
     */
    @lombok.Data
    @lombok.Builder
    private static class CategoryMetrics {
        private BigDecimal totalAmount;
        private Integer donorCount;
    }
}
