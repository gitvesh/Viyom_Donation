package viyom.donation.viyom.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import viyom.donation.viyom.Entity.*;
import viyom.donation.viyom.Repository.DonationRepository;
import viyom.donation.viyom.Repository.DonationPoolRepository;
import viyom.donation.viyom.Repository.PaymentOrderRepository;
import viyom.donation.viyom.Repository.PaymentTransactionRepository;
import viyom.donation.viyom.dto.CreatePaymentOrderRequest;
import viyom.donation.viyom.dto.CreatePaymentOrderResponse;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;

@Service
public class PaymentService {

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;


    private final RazorpayClient razorpayClient;
    private final PaymentOrderRepository paymentOrderRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final DonationRepository donationRepository;
    private final DonationPoolRepository donationPoolRepository;
    private final DonarService donorService;
    private final DonationPoolService donationPoolService;

    public PaymentService(@Value("${razorpay.key.id}") String razorpayKeyId,
                          @Value("${razorpay.key.secret}") String razorpayKeySecret,
                          PaymentOrderRepository paymentOrderRepository,
                          PaymentTransactionRepository paymentTransactionRepository,
                          DonationRepository donationRepository,
                          DonationPoolRepository donationPoolRepository,
                          DonarService donorService, 
                          DonationPoolService donationPoolService) throws RazorpayException {
        this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        this.razorpaySecret = razorpayKeySecret; // Ensure the field is explicitly initialized!
        this.paymentOrderRepository = paymentOrderRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.donationRepository = donationRepository;
        this.donationPoolRepository = donationPoolRepository;
        this.donorService = donorService;
        this.donationPoolService = donationPoolService;
    }

    public PaymentOrder createOrder(BigDecimal amount, String currency, String receipt, AuthUser authUser, Long donationPoolId, Boolean anonymous) throws RazorpayException {
        Donor donor = donorService.findByAuthUser(authUser);
        DonationPool donationPool = donationPoolService.findById(donationPoolId);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount.multiply(BigDecimal.valueOf(100))); // amount in the smallest currency unit
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", receipt);

        Order order = razorpayClient.orders.create(orderRequest);

        PaymentOrder paymentOrder = PaymentOrder.builder()
                .razorpayOrderId(order.get("id"))
                .amount(amount)
                .currency(currency)
                .status(order.get("status"))
                .receiptReference(receipt)
                .createdAt(LocalDateTime.now())
                .anonymous(anonymous != null ? anonymous : false)
                .donor(donor)
                .donationPool(donationPool)
                .build();

        return paymentOrderRepository.save(paymentOrder);
    }

    public boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) throws NoSuchAlgorithmException, InvalidKeyException {
        if (razorpaySecret == null || razorpaySecret.isEmpty()) {
            System.err.println("❌ ERROR: razorpaySecret is NULL or EMPTY in PaymentService!");
        }
        String generatedSignature = hmacSha256(razorpayOrderId + "|" + razorpayPaymentId, razorpaySecret);
        boolean isValid = generatedSignature.equals(razorpaySignature);
        System.out.println("🔐 Signature Verification - OrderID: " + razorpayOrderId + ", IsValid: " + isValid);
        return isValid;
    }

    public PaymentOrder getPaymentOrderByRazorpayOrderId(String razorpayOrderId) {
        return paymentOrderRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("PaymentOrder not found"));
    }

    public PaymentTransaction savePaymentTransaction(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature, BigDecimal paidAmount, String status, String donorPhone) {
        PaymentOrder paymentOrder = paymentOrderRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("PaymentOrder not found"));

        paymentOrder.setStatus("PAID");
        paymentOrderRepository.save(paymentOrder);

        PaymentTransaction paymentTransaction = PaymentTransaction.builder()
                .razorpayPaymentId(razorpayPaymentId)
                .razorpaySignature(razorpaySignature)
                .paidAmount(paidAmount)
                .status(status)
                .paymentTime(LocalDateTime.now())
                .paymentOrder(paymentOrder)
                .build();

        paymentTransactionRepository.save(paymentTransaction);

        Donation donation = Donation.builder()
                .amount(paidAmount)
                .donatedAt(LocalDateTime.now())
                .anonymous(paymentOrder.getAnonymous())
                .blockchainTxnHash(null) // Will be updated when recorded on blockchain
                .donor(paymentOrder.getDonor())
                .donorPhone(donorPhone) // ✅ Store phone from donation form 
                .donationPool(paymentOrder.getDonationPool())
                .paymentOrder(paymentOrder)
                .build();

        donationRepository.save(donation);

        // Update donation pool balances
        DonationPool pool = paymentOrder.getDonationPool();
        pool.setTotalCollectedAmount(pool.getTotalCollectedAmount().add(paidAmount));
        pool.setAvailableBalance(pool.getAvailableBalance().add(paidAmount));
        donationPoolRepository.save(pool);

        return paymentTransaction;
    }

    private String hmacSha256(String data, String secret) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secret_key);

        byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
