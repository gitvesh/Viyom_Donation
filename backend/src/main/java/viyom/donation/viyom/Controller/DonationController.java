package viyom.donation.viyom.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.Entity.AuthUser;
import viyom.donation.viyom.Entity.Donor;
import viyom.donation.viyom.Service.DonationService;
import viyom.donation.viyom.Service.AuthService;
import viyom.donation.viyom.dto.CreatePaymentOrderRequest;
import viyom.donation.viyom.dto.CreatePaymentOrderResponse;
import viyom.donation.viyom.dto.VerifyPaymentRequest;
import viyom.donation.viyom.dto.VerifyPaymentResponse;
import viyom.donation.viyom.dto.DonationHistoryResponse;
import viyom.donation.viyom.dto.DonationHistoryApiResponse;
import viyom.donation.viyom.Entity.Donation;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;
    private final AuthService authService;

    @PostMapping("/create-order")
    public ResponseEntity<CreatePaymentOrderResponse> createOrder(
            @RequestBody CreatePaymentOrderRequest request,
            @AuthenticationPrincipal AuthUser authUser
    ) throws Exception {
        Donor donor = authService.findDonorByAuthUser(authUser);
        CreatePaymentOrderResponse response = donationService.createOrder(request, donor);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<VerifyPaymentResponse> verifyPayment(@RequestBody VerifyPaymentRequest request) throws Exception {
        System.out.println("📥 CONTROLLER: Received verify-payment request for OrderID: " + request.getRazorpayOrderId());
        // Step 1: Verify payment and save to DB in its own short-lived transaction
        VerifyPaymentResponse response = donationService.verifyPayment(request);
        
        if ("SUCCESS".equals(response.getStatus()) && response.getDonationId() != null) {
            try {
                // Step 2: Record on blockchain ASYNCHRONOUSLY
                // This ensures the DB record is already persisted and this request returns immediately
                donationService.recordDonationOnBlockchainAsync(response.getDonationId());
                
                response.setMessage("Payment verified. Recording on blockchain in background...");
            } catch (Exception e) {
                // We don't want to fail the whole request if only the async trigger fails
                response.setMessage("Payment verified but blockchain trigger encountered an error: " + e.getMessage());
            }
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-donations")
    public ResponseEntity<List<DonationHistoryResponse>> getMyDonations(@AuthenticationPrincipal AuthUser authUser) {
        Donor donor = authService.findDonorByAuthUser(authUser);
        List<DonationHistoryResponse> donations = donationService.getDonationsForDonor(donor);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/admin/donations")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<DonationHistoryResponse>> getAllDonations() {
        List<DonationHistoryResponse> donations = donationService.getAllDonations();
        return ResponseEntity.ok(donations);
    }

    /**
     * Get donation history with blockchain verification URLs
     * Clean API response for frontend UI
     */
    @GetMapping("/history")
    public ResponseEntity<List<DonationHistoryApiResponse>> getDonationHistory(@AuthenticationPrincipal AuthUser authUser) {
        Donor donor = authService.findDonorByAuthUser(authUser);
        List<Donation> donations = donationService.getDonationEntitiesForDonor(donor);
        
        List<DonationHistoryApiResponse> response = donations.stream()
                .map(this::convertToApiResponse)
                .toList();
        
        return ResponseEntity.ok(response);
    }

    /**
     * Convert Donation entity to clean API response
     */
    private DonationHistoryApiResponse convertToApiResponse(Donation donation) {
        // Build blockchain verification info
        DonationHistoryApiResponse.BlockchainVerification.BlockchainVerificationBuilder verificationBuilder = 
            DonationHistoryApiResponse.BlockchainVerification.builder();
        
        if (donation.getBlockchainTxnHash() != null && !donation.getBlockchainTxnHash().isEmpty()) {
            // Transaction is recorded on blockchain
            verificationBuilder
                .verified(true)
                .status("verified")
                .explorerUrl(buildPolygonScanUrl(donation.getBlockchainTxnHash()))
                .verificationApi(buildVerificationApiUrl(donation.getBlockchainTxnHash()));
        } else {
            // Transaction not recorded or failed
            verificationBuilder
                .verified(false)
                .status("pending")
                .explorerUrl(null)
                .verificationApi(null);
        }
        
        return DonationHistoryApiResponse.builder()
                .donationId(donation.getDonationId())
                .amount(donation.getAmount())
                .category(donation.getDonationPool().getSector().getName())
                .timestamp(donation.getDonatedAt())
                .blockchainTxnHash(donation.getBlockchainTxnHash())
                .blockchainVerification(verificationBuilder.build())
                .build();
    }

    /**
     * Build PolygonScan URL for transaction verification
     */
    private String buildPolygonScanUrl(String transactionHash) {
        if (transactionHash == null || transactionHash.isEmpty()) {
            return null;
        }
        
        // Polygon Amoy testnet explorer URL
        return String.format("https://amoy.polygonscan.com/tx/%s", transactionHash);
    }

    /**
     * Build verification API URL for transaction verification
     */
    private String buildVerificationApiUrl(String transactionHash) {
        if (transactionHash == null || transactionHash.isEmpty()) {
            return null;
        }
        
        // Internal API for transaction verification
        return String.format("/api/blockchain/verify/%s", transactionHash);
    }
}

