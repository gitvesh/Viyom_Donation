package viyom.donation.viyom.blockchain.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import viyom.donation.viyom.blockchain.util.HashUtil;

import java.math.BigDecimal;
import java.util.concurrent.CompletableFuture;

/**
 * Example showing how to integrate recordDonationOnBlockchain() method
 * into the main donation flow without breaking the application
 */
@Service
@Slf4j
public class BlockchainIntegrationExample {

    @Autowired
    private BlockchainService blockchainService;

    /**
     * Example of integrating blockchain recording into donation processing
     */
    public void processDonationWithBlockchain(Long donationId, BigDecimal amount, String donorEmail) {
        try {
            // Main donation processing (always succeeds)
            log.info("Processing donation {} for amount: {}", donationId, amount);
            
            // Prepare blockchain parameters
            String category = "Donation";
            String orderId = "DONATION_" + donationId;
            Long timestamp = System.currentTimeMillis() / 1000;
            
            // Async blockchain recording (non-blocking, won't break main flow)
            CompletableFuture<String> blockchainFuture = blockchainService.recordDonationOnBlockchain(
                    donorEmail,
                    amount,
                    category,
                    orderId,
                    timestamp
            );
            
            // Handle blockchain result asynchronously
            blockchainFuture.thenAccept(txHash -> {
                if (txHash != null) {
                    log.info("Blockchain recording successful - TxHash: {}", txHash);
                    // Update database with transaction hash if needed
                    updateDonationWithTxHash(donationId, txHash);
                } else {
                    log.warn("Blockchain recording failed for donation {}", donationId);
                    // Donation still succeeded, just no blockchain record
                }
            }).exceptionally(throwable -> {
                log.error("Blockchain async processing failed", throwable);
                return null;
            });
            
            // Continue with main donation flow - blockchain is completely async
            log.info("Main donation processing completed for {}", donationId);
            
        } catch (Exception e) {
            log.error("Main donation processing failed", e);
            throw e; // Re-throw main donation errors
        }
    }

    /**
     * Example of synchronous blockchain recording with fallback
     */
    public String recordDonationWithFallback(Long donationId, BigDecimal amount, String donorEmail) {
        try {
            String category = "Donation";
            String orderId = "DONATION_" + donationId;
            Long timestamp = System.currentTimeMillis() / 1000;
            
            // Call blockchain service (returns null on failure)
            CompletableFuture<String> future = blockchainService.recordDonationOnBlockchain(
                    donorEmail, amount, category, orderId, timestamp);
            
            // Wait for result with timeout
            String txHash = future.get();
            
            if (txHash != null) {
                log.info("Blockchain recording successful: {}", txHash);
                return txHash;
            } else {
                log.warn("Blockchain recording failed, using fallback");
                return "BLOCKCHAIN_FAILED_" + HashUtil.generateOrderIdHash(orderId);
            }
            
        } catch (Exception e) {
            log.error("Blockchain recording exception, using fallback", e);
            return "BLOCKCHAIN_ERROR_" + System.currentTimeMillis();
        }
    }

    /**
     * Example of batch blockchain recording
     */
    public CompletableFuture<Void> recordMultipleDonationsBatch() {
        // Simulate multiple donations
        CompletableFuture<String> donation1 = blockchainService.recordDonationOnBlockchain(
                "donor1@example.com", new BigDecimal("0.1"), "Education", "ORDER_1", System.currentTimeMillis() / 1000);
        
        CompletableFuture<String> donation2 = blockchainService.recordDonationOnBlockchain(
                "donor2@example.com", new BigDecimal("0.2"), "Healthcare", "ORDER_2", System.currentTimeMillis() / 1000);
        
        CompletableFuture<String> donation3 = blockchainService.recordDonationOnBlockchain(
                "donor3@example.com", new BigDecimal("0.15"), "Environment", "ORDER_3", System.currentTimeMillis() / 1000);
        
        // Wait for all to complete
        return CompletableFuture.allOf(donation1, donation2, donation3)
                .thenRun(() -> log.info("Batch blockchain recording completed"))
                .exceptionally(throwable -> {
                    log.error("Batch recording failed", throwable);
                    return null;
                });
    }

    /**
     * Update donation record with transaction hash
     */
    private void updateDonationWithTxHash(Long donationId, String txHash) {
        // Implementation would update database
        log.info("Updating donation {} with transaction hash: {}", donationId, txHash);
    }

    /**
     * Example of error handling in main donation service
     */
    public void processDonationWithErrorHandling(Long donationId, BigDecimal amount, String donorEmail) {
        try {
            // Main donation logic
            log.info("Processing main donation flow for {}", donationId);
            
            // Blockchain recording with comprehensive error handling
            blockchainService.recordDonationOnBlockchain(
                    donorEmail,
                    amount,
                    "Donation",
                    "DONATION_" + donationId,
                    System.currentTimeMillis() / 1000
            ).thenAccept(txHash -> {
                if (txHash != null) {
                    log.info("✅ Blockchain success: {}", txHash);
                } else {
                    log.warn("⚠️ Blockchain failed - donation still valid");
                }
            }).exceptionally(throwable -> {
                log.error("❌ Blockchain error - donation still valid", throwable);
                return null;
            });
            
            // Main donation continues regardless of blockchain outcome
            log.info("✅ Main donation completed successfully for {}", donationId);
            
        } catch (Exception e) {
            // Only main donation errors should break the flow
            log.error("❌ Main donation failed for {}", donationId, e);
            throw new RuntimeException("Donation processing failed", e);
        }
    }
}
