package viyom.donation.viyom.blockchain.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import viyom.donation.viyom.blockchain.contract.DonationTransparency;
import viyom.donation.viyom.blockchain.util.HashUtil;

import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.gas.ContractGasProvider;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

/**
 * Service for interacting with DonationTransparency smart contract.
 * Handles blockchain transactions and data retrieval.
 *
 * Design contract:
 * - If {@code transactionEnabled} is false, all write operations immediately return null.
 * - If {@code contract} bean is null (misconfigured), all operations return null / false.
 * - The donation/allocation flow in the main services MUST NOT fail when this service
 *   returns null – the database record is always the source of truth.
 */
@Service
@Slf4j
public class BlockchainService {

    private final Web3j web3j;
    private final String contractAddress;
    private final boolean transactionEnabled;

    /** May be null when blockchain is not configured. Always check transactionEnabled first. */
    @Nullable
    private final DonationTransparency contract;

    public BlockchainService(
            Web3j web3j,
            @Nullable Credentials credentials,
            ContractGasProvider gasProvider,
            @Qualifier("contractAddress") String contractAddress,
            @Qualifier("isTransactionEnabled") boolean transactionEnabled,
            @Nullable DonationTransparency donationTransparency) {

        this.web3j = web3j;
        this.contractAddress = contractAddress;
        this.transactionEnabled = transactionEnabled;
        this.contract = donationTransparency;

        log.info("BlockchainService initialized – contract address: '{}', transactionEnabled: {}",
                contractAddress.isEmpty() ? "NOT SET" : contractAddress, transactionEnabled);

        if (!transactionEnabled) {
            log.warn("⚠️  BlockchainService is in DISABLED mode. " +
                     "Donation/allocation data will be stored in DB only. " +
                     "To enable blockchain recording set a valid contract address AND private key " +
                     "in application.properties.");
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // recordDonationOnBlockchain – PRIMARY method called by DonationService
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Record a donation on the blockchain.
     *
     * Returns the transaction hash string on success, or {@code null} on any failure.
     * This method NEVER propagates an exception so it cannot break the main donation flow.
     *
     * @param donorEmail Donor email – hashed via SHA-256 before sending to chain
     * @param amount     Donation amount in rupees (will be treated as wei for chain storage)
     * @param category   Sector / category name
     * @param orderId    Unique order identifier (Razorpay order ID or internal)
     * @param timestamp  Unix epoch seconds
     * @return CompletableFuture resolving to tx hash or null
     */
    public CompletableFuture<BlockchainResult> recordDonationOnBlockchain(
            String donorEmail,
            BigDecimal amount,
            String category,
            String orderId,
            Long timestamp) {

        return CompletableFuture.supplyAsync(() -> {
            try {
                if (!transactionEnabled) {
                    log.warn("Blockchain transactions disabled – skipping donation recording for order: {}", orderId);
                    return new BlockchainResult(null, false, "DISABLED", "Transactions disabled");
                }

                if (contract == null) {
                    log.error("Contract bean is null – cannot record donation for order: {}", orderId);
                    return new BlockchainResult(null, false, "ERROR", "Contract not configured");
                }

                log.info("Starting blockchain donation recording – order: {}, amount: {}, category: {}",
                        orderId, amount, category);

                String donorHash = HashUtil.generateConsistentDonorHash(donorEmail);
                BigInteger amountWei = convertToWei(amount);
                BigInteger tsBigInt = BigInteger.valueOf(timestamp != null ? timestamp : System.currentTimeMillis() / 1000);

                log.info("Calling smart contract recordDonation() for order: {}", orderId);
                TransactionReceipt receipt = contract.recordDonation(
                        donorHash,
                        amountWei,
                        category,
                        orderId,
                        tsBigInt
                ).send();

                if (receipt == null) {
                    log.error("Transaction receipt is null for order: {}", orderId);
                    return new BlockchainResult(null, false, "ERROR", "No receipt returned");
                }

                String transactionHash = receipt.getTransactionHash();
                boolean isSuccess = receipt.isStatusOK();
                
                log.info("Donation {} on blockchain. Status: {}, TxHash: {}", 
                        isSuccess ? "RECORDED" : "REVERTED", isSuccess ? "SUCCESS" : "FAILED", transactionHash);

                return new BlockchainResult(
                    transactionHash, 
                    isSuccess, 
                    isSuccess ? "CONFIRMED" : "REVERTED", 
                    isSuccess ? null : "Transaction reverted on chain"
                );

            } catch (Exception e) {
                log.error("💥 Failed to record donation on blockchain: {}", e.getMessage());
                String hash = null;
                if (e instanceof org.web3j.protocol.exceptions.TransactionException) {
                    hash = ((org.web3j.protocol.exceptions.TransactionException) e).getTransactionHash().orElse(null);
                } else if (e.getCause() instanceof org.web3j.protocol.exceptions.TransactionException) {
                    hash = ((org.web3j.protocol.exceptions.TransactionException) e.getCause()).getTransactionHash().orElse(null);
                }
                return new BlockchainResult(hash, false, "EXCEPTION", e.getMessage());
            }
        }).exceptionally(throwable -> {
            log.error("CompletableFuture error during blockchain recording for order: {}", orderId, throwable);
            return new BlockchainResult(null, false, "EXCEPTION", throwable.getMessage());
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // recordDonationTransaction – legacy / admin-triggered method
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Record a donation transaction on the blockchain (legacy method for compatibility).
     * Throws CompletionException on failure so the caller can handle it explicitly.
     *
     * @param donationId Database donation ID
     * @param amount     Donation amount
     * @param donorEmail Donor email for hash generation
     * @return Transaction hash
     */
    public CompletableFuture<String> recordDonationTransaction(
            Long donationId,
            BigDecimal amount,
            String donorEmail) {

        return CompletableFuture.supplyAsync(() -> {
            try {
                if (!transactionEnabled) {
                    throw new IllegalStateException("Blockchain transactions are disabled");
                }
                if (contract == null) {
                    throw new IllegalStateException("Contract not loaded – check blockchain configuration");
                }

                log.info("Recording donation {} on blockchain – amount: {}", donationId, amount);

                String donorHash = HashUtil.generateConsistentDonorHash(donorEmail);
                String orderId = "DONATION_" + donationId;
                BigInteger amountWei = convertToWei(amount);
                BigInteger timestamp = BigInteger.valueOf(System.currentTimeMillis() / 1000);

                TransactionReceipt receipt = contract.recordDonation(
                        donorHash, amountWei, "Donation", orderId, timestamp
                ).send();

                String transactionHash = receipt.getTransactionHash();
                log.info("Donation {} recorded on blockchain. TxHash: {}", donationId, transactionHash);
                return transactionHash;

            } catch (Exception e) {
                log.error("Failed to record donation {} on blockchain", donationId, e);
                throw new CompletionException(
                        new RuntimeException("Blockchain transaction failed for donation " + donationId, e));
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // recordFundAllocationTransaction – called by FundAllocationService
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Records a fund allocation on the blockchain.
     * 
     * @param allocationId Unique allocation ID from database
     * @param beneficiary Beneficiary name or identifier
     * @param amount Allocation amount in rupees
     * @param timestamp Unix epoch seconds
     * @return CompletableFuture resolving to transaction hash or null
     */
    public CompletableFuture<BlockchainResult> recordAllocationOnBlockchain(
            Long allocationId,
            String beneficiary,
            BigDecimal amount,
            Long timestamp) {

        return CompletableFuture.supplyAsync(() -> {
            try {
                if (!transactionEnabled) {
                    log.warn("Blockchain transactions disabled – skipping allocation recording for ID: {}", allocationId);
                    return new BlockchainResult(null, false, "DISABLED", "Transactions disabled");
                }
                if (contract == null) {
                    log.error("Contract bean is null – cannot record allocation for ID: {}", allocationId);
                    return new BlockchainResult(null, false, "ERROR", "Contract not configured");
                }

                log.info("🚀 Recording fund allocation on-chain – ID: {}, amount: {}, beneficiary: {}", 
                        allocationId, amount, beneficiary);

                String beneficiaryName = beneficiary != null ? beneficiary : "unknown";
                BigInteger amountWei = convertToWei(amount);
                BigInteger tsBigInt = BigInteger.valueOf(timestamp != null ? timestamp : System.currentTimeMillis() / 1000);

                // Call specialized smart contract method
                TransactionReceipt receipt = contract.allocateFunds(
                        BigInteger.valueOf(allocationId), 
                        beneficiaryName, 
                        amountWei, 
                        tsBigInt
                ).send();

                if (receipt == null) {
                    log.error("❌ Allocation transaction receipt is null for ID: {}", allocationId);
                    return new BlockchainResult(null, false, "ERROR", "No receipt received");
                }

                String transactionHash = receipt.getTransactionHash();
                log.info("ℹ️ Receipt status for allocation {}: {}", allocationId, receipt.getStatus());

                boolean isSuccess = "0x1".equals(receipt.getStatus());
                if (!isSuccess) {
                    log.warn("❌ Allocation transaction REVERTED (status {}) for ID: {}. Hash: {}", 
                             receipt.getStatus(), allocationId, transactionHash);
                    return new BlockchainResult(transactionHash, false, "REVERTED", "Transaction reverted on-chain");
                }

                log.info("✅ Allocation {} successfully confirmed on blockchain. TxHash: {}", allocationId, transactionHash);
                return new BlockchainResult(transactionHash, true, "CONFIRMED", null);

            } catch (Exception e) {
                log.error("❌ Blockchain recording CRITICAL FAILURE for allocation {}: {}", allocationId, e.getMessage(), e);
                return new BlockchainResult(null, false, "EXCEPTION", e.getMessage());
            }
        }).exceptionally(throwable -> {
            log.error("CompletableFuture error during allocation recording: {}", allocationId, throwable);
            return new BlockchainResult(null, false, "EXCEPTION", throwable.getMessage());
        });
    }

    /**
     * Legacy compatibility method – eventually to be phased out.
     */
    public CompletableFuture<String> recordFundAllocationTransaction(
            Long allocationId,
            BigDecimal amount,
            String beneficiaryContact) {
        return recordAllocationOnBlockchain(allocationId, beneficiaryContact, amount, System.currentTimeMillis() / 1000)
                .thenApply(BlockchainResult::getTransactionHash);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Read-only blockchain queries
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Retrieve donation details from blockchain for a given order ID.
     */
    public CompletableFuture<DonationTransparency.DonationDetails> getDonationDetails(String orderId) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                if (contract == null) {
                    log.warn("Contract not loaded – cannot retrieve donation details for: {}", orderId);
                    return null;
                }
                log.info("Retrieving donation details for order: {}", orderId);
                DonationTransparency.DonationDetails details = contract.getDonation(orderId).send();
                log.info("Retrieved donation for order {} – amount: {}, category: {}",
                        orderId, convertFromWei(details.getAmount()), details.getCategory());
                return details;
            } catch (Exception e) {
                log.error("Failed to get donation details for order: {}", orderId, e);
                throw new CompletionException(
                        new RuntimeException("Failed to retrieve donation details for " + orderId, e));
            }
        });
    }

    /**
     * Verify if a transaction exists on the blockchain and was successful.
     */
    public CompletableFuture<Boolean> verifyTransaction(String transactionHash) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.info("Verifying transaction: {}", transactionHash);
                TransactionReceipt receipt = web3j.ethGetTransactionReceipt(transactionHash)
                        .send()
                        .getTransactionReceipt()
                        .orElse(null);

                boolean isVerified = receipt != null && "0x1".equals(receipt.getStatus());
                log.info("Transaction {} verification: {}", transactionHash, isVerified);
                return isVerified;
            } catch (Exception e) {
                log.error("Failed to verify transaction: {}", transactionHash, e);
                return false;
            }
        });
    }

    /**
     * Get total number of donations recorded on the blockchain.
     */
    public CompletableFuture<Long> getTotalDonations() {
        return CompletableFuture.supplyAsync(() -> {
            try {
                if (contract == null) {
                    log.warn("Contract not loaded – returning 0 for total donations.");
                    return 0L;
                }
                BigInteger total = contract.getTotalDonations().send();
                long totalLong = total.longValue();
                log.info("Total donations on blockchain: {}", totalLong);
                return totalLong;
            } catch (Exception e) {
                log.error("Failed to get total donations from blockchain", e);
                throw new CompletionException(new RuntimeException("Failed to retrieve total donations", e));
            }
        });
    }

    /**
     * Check if a donation exists on the blockchain for a given order ID.
     */
    public CompletableFuture<Boolean> donationExists(String orderId) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                if (contract == null) {
                    log.warn("Contract not loaded – returning false for donationExists: {}", orderId);
                    return false;
                }
                boolean exists = contract.donationExists(orderId).send();
                log.info("Donation exists for order {}: {}", orderId, exists);
                return exists;
            } catch (Exception e) {
                log.error("Failed to check donation existence for order: {}", orderId, e);
                return false;
            }
        });
    }

    /**
     * Get overall blockchain connection and configuration status.
     */
    public CompletableFuture<BlockchainStatus> getBlockchainStatus() {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String clientVersion = web3j.web3ClientVersion().send().getWeb3ClientVersion();
                BigInteger blockNumber = web3j.ethBlockNumber().send().getBlockNumber();

                return BlockchainStatus.builder()
                        .connected(true)
                        .clientVersion(clientVersion)
                        .currentBlock(blockNumber.longValue())
                        .contractAddress(contractAddress.isEmpty() ? "Not configured" : contractAddress)
                        .transactionEnabled(transactionEnabled)
                        .build();
            } catch (Exception e) {
                log.error("Failed to get blockchain status", e);
                return BlockchainStatus.builder()
                        .connected(false)
                        .error(e.getMessage())
                        .contractAddress(contractAddress.isEmpty() ? "Not configured" : contractAddress)
                        .transactionEnabled(false)
                        .build();
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────────────────────
    // DTOs for result handling
    // ─────────────────────────────────────────────────────────────────────────

    @lombok.Data
    @lombok.AllArgsConstructor
    public static class BlockchainResult {
        private String transactionHash;
        private boolean success;
        private String status;
        private String error;
    }

    /** Convert a rupee/ETH amount to wei (× 10^18). */
    private BigInteger convertToWei(BigDecimal amount) {
        return amount.multiply(BigDecimal.TEN.pow(18)).toBigInteger();
    }

    /** Convert wei back to ETH. */
    private BigDecimal convertFromWei(BigInteger weiAmount) {
        return new BigDecimal(weiAmount).divide(BigDecimal.TEN.pow(18));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Status DTO
    // ─────────────────────────────────────────────────────────────────────────

    @lombok.Data
    @lombok.Builder
    public static class BlockchainStatus {
        private boolean connected;
        private String clientVersion;
        private Long currentBlock;
        private String contractAddress;
        private boolean transactionEnabled;
        private String error;
    }
}
