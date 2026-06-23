package viyom.donation.viyom.blockchain.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import viyom.donation.viyom.blockchain.service.BlockchainService;

import java.util.concurrent.CompletableFuture;


/**
 * REST Controller for blockchain operations
 * Exposes blockchain functionality via HTTP endpoints
 */
@RestController
@RequestMapping("/api/blockchain")
@CrossOrigin(origins = "*")
@Slf4j
public class BlockchainController {

    @Autowired
    private BlockchainService blockchainService;

    /**
     * Get blockchain connection status
     */
    @GetMapping("/status")
    public CompletableFuture<ResponseEntity<BlockchainService.BlockchainStatus>> getBlockchainStatus() {
        log.info("Getting blockchain status");
        return blockchainService.getBlockchainStatus()
                .thenApply(ResponseEntity::ok)
                .exceptionally(throwable -> {
                    log.error("Failed to get blockchain status", throwable);
                    return ResponseEntity.internalServerError().build();
                });
    }

    /**
     * Verify transaction on blockchain
     */
    @GetMapping("/verify/{transactionHash}")
    public CompletableFuture<ResponseEntity<Boolean>> verifyTransaction(
            @PathVariable String transactionHash) {
        log.info("Verifying transaction: {}", transactionHash);
        return blockchainService.verifyTransaction(transactionHash)
                .thenApply(ResponseEntity::ok)
                .exceptionally(throwable -> {
                    log.error("Failed to verify transaction: {}", transactionHash, throwable);
                    return ResponseEntity.internalServerError().body(false);
                });
    }

    /**
     * Get donation details from blockchain
     */
    @GetMapping("/donation/{orderId}")
    public CompletableFuture<ResponseEntity<Object>> getDonationDetails(
            @PathVariable String orderId) {
        log.info("Getting donation details for order: {}", orderId);
        return blockchainService.getDonationDetails(orderId)
                .thenApply(details -> ResponseEntity.ok().body((Object) details))
                .exceptionally(throwable -> {
                    log.error("Failed to get donation details for order: {}", orderId, throwable);
                    return ResponseEntity.notFound().build();
                });
    }

    /**
     * Check if donation exists on blockchain
     */
    @GetMapping("/donation/{orderId}/exists")
    public CompletableFuture<ResponseEntity<Boolean>> donationExists(
            @PathVariable String orderId) {
        log.info("Checking if donation exists for order: {}", orderId);
        return blockchainService.donationExists(orderId)
                .thenApply(ResponseEntity::ok)
                .exceptionally(throwable -> {
                    log.error("Failed to check donation existence for order: {}", orderId, throwable);
                    return ResponseEntity.internalServerError().body(false);
                });
    }

    /**
     * Get total number of donations on blockchain
     */
    @GetMapping("/donations/total")
    public CompletableFuture<ResponseEntity<Long>> getTotalDonations() {
        log.info("Getting total donations from blockchain");
        return blockchainService.getTotalDonations()
                .thenApply(ResponseEntity::ok)
                .exceptionally(throwable -> {
                    log.error("Failed to get total donations", throwable);
                    return ResponseEntity.internalServerError().body(0L);
                });
    }

    /**
     * Record donation transaction (for testing)
     */
    @PostMapping("/donation")
    public CompletableFuture<ResponseEntity<String>> recordDonation(
            @RequestBody DonationRecordRequest request) {
        log.info("Recording donation transaction for donation ID: {}", request.getDonationId());
        return blockchainService.recordDonationTransaction(
                request.getDonationId(),
                request.getAmount(),
                request.getDonorEmail()
        ).thenApply(txHash -> {
            return ResponseEntity.ok().body("{\"transactionHash\":\"" + txHash + "\"}");
        })
        .exceptionally(throwable -> {
            log.error("Failed to record donation transaction", throwable);
            return ResponseEntity.internalServerError().body("{\"error\":\"Failed to record donation\"}");
        });
    }

    /**
     * Record fund allocation transaction (for testing)
     */
    @PostMapping("/allocation")
    public CompletableFuture<ResponseEntity<String>> recordFundAllocation(
            @RequestBody AllocationRecordRequest request) {
        log.info("Recording fund allocation transaction for allocation ID: {}", request.getAllocationId());
        return blockchainService.recordFundAllocationTransaction(
                request.getAllocationId(),
                request.getAmount(),
                request.getBeneficiaryContact()
        ).thenApply(txHash -> ResponseEntity.ok().body("{\"transactionHash\":\"" + txHash + "\"}"))
        .exceptionally(throwable -> {
            log.error("Failed to record fund allocation transaction", throwable);
            return ResponseEntity.internalServerError().body("{\"error\":\"Failed to record allocation\"}");
        });
    }

    /**
     * Request body for donation recording
     */
    public static class DonationRecordRequest {
        private Long donationId;
        private java.math.BigDecimal amount;
        private String donorEmail;

        // Getters and setters
        public Long getDonationId() { return donationId; }
        public void setDonationId(Long donationId) { this.donationId = donationId; }
        public java.math.BigDecimal getAmount() { return amount; }
        public void setAmount(java.math.BigDecimal amount) { this.amount = amount; }
        public String getDonorEmail() { return donorEmail; }
        public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }
    }

    /**
     * Request body for fund allocation recording
     */
    public static class AllocationRecordRequest {
        private Long allocationId;
        private java.math.BigDecimal amount;
        private String beneficiaryContact;

        // Getters and setters
        public Long getAllocationId() { return allocationId; }
        public void setAllocationId(Long allocationId) { this.allocationId = allocationId; }
        public java.math.BigDecimal getAmount() { return amount; }
        public void setAmount(java.math.BigDecimal amount) { this.amount = amount; }
        public String getBeneficiaryContact() { return beneficiaryContact; }
        public void setBeneficiaryContact(String beneficiaryContact) { this.beneficiaryContact = beneficiaryContact; }
    }
}
