package viyom.donation.viyom.blockchain.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import viyom.donation.viyom.blockchain.contract.DonationTransparency;
import viyom.donation.viyom.blockchain.util.HashUtil;

import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.tx.gas.ContractGasProvider;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

/**
 * Service for interacting with DonationTransparency smart contract
 * Handles blockchain transactions and data retrieval
 */
@Service
@Slf4j
public class BlockchainService {

    private final Web3j web3j;
    private final Credentials credentials;
    private final ContractGasProvider gasProvider;
    private final String contractAddress;
    private final boolean transactionEnabled;
    private final DonationTransparency contract;

    public BlockchainService(
            Web3j web3j,
            Credentials credentials,
            DefaultGasProvider gasProvider,
            @Qualifier("contractAddress") String contractAddress,
            @Qualifier("isTransactionEnabled") boolean transactionEnabled,
            DonationTransparency donationTransparency) {
        
        this.web3j = web3j;
        this.credentials = credentials;
        this.gasProvider = gasProvider;
        this.contractAddress = contractAddress;
        this.transactionEnabled = transactionEnabled;
        this.contract = donationTransparency;
        
        log.info("BlockchainService initialized with contract at: {}", contractAddress);
        log.info("Transaction enabled: {}", transactionEnabled);
    }

    /**
     * Record donation on blockchain with specific parameters
     * 
     * @param donorEmail Donor email for hash generation
     * @param amount Donation amount in ETH
     * @param category Donation category/sector
     * @param orderId Unique order identifier
     * @param timestamp Transaction timestamp
     * @return Transaction hash if successful, null if blockchain fails
     */
    public CompletableFuture<String> recordDonationOnBlockchain(
            String donorEmail,
            BigDecimal amount,
            String category,
            String orderId,
            Long timestamp) {
        
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Check if blockchain transactions are enabled
                if (!transactionEnabled) {
                    log.warn("Blockchain transactions disabled - skipping donation recording");
                    return null;
                }
                
                log.info("Starting blockchain donation recording - Order: {}, Amount: {}, Category: {}", 
                    orderId, amount, category);
                
                // Step 1: Generate donorHash using SHA256
                String donorHash = HashUtil.generateConsistentDonorHash(donorEmail);
                log.debug("Generated donor hash: {}", HashUtil.getShortHash(donorHash));
                
                // Step 2: Convert hash to bytes32 and prepare parameters
                org.web3j.abi.datatypes.generated.Bytes32 donorHashBytes32 = 
                    new org.web3j.abi.datatypes.generated.Bytes32(donorHash);
                BigInteger amountWei = convertToWei(amount);
                BigInteger timestampBigInt = BigInteger.valueOf(timestamp);
                
                log.debug("Converted parameters - Amount Wei: {}, Timestamp: {}", amountWei, timestampBigInt);
                
                // Step 3: Call smart contract recordDonation()
                log.info("Calling smart contract recordDonation()...");
                TransactionReceipt receipt = contract.recordDonation(
                        donorHashBytes32,
                        amountWei,
                        category,
                        orderId,
                        timestampBigInt
                ).send();
                
                // Step 4: Wait for transaction receipt
                if (receipt == null) {
                    log.error("Transaction receipt is null for order: {}", orderId);
                    return null;
                }
                
                // Verify transaction status
                if (!"0x1".equals(receipt.getStatus())) {
                    log.error("Transaction failed for order: {} - Status: {}", orderId, receipt.getStatus());
                    return null;
                }
                
                // Step 5: Extract transaction hash
                String transactionHash = receipt.getTransactionHash();
                if (transactionHash == null || transactionHash.isEmpty()) {
                    log.error("Transaction hash is null for order: {}", orderId);
                    return null;
                }
                
                log.info("Successfully recorded donation on blockchain - Order: {}, TxHash: {}", 
                    orderId, transactionHash);
                
                // Step 6: Return transaction hash
                return transactionHash;
                
            } catch (Exception e) {
                // Step 6: Proper exception handling - don't break main donation flow
                log.error("Blockchain recording failed for order: {} - Error: {}", 
                    orderId, e.getMessage(), e);
                
                // Return null instead of throwing exception to prevent breaking main flow
                return null;
            }
        }).exceptionally(throwable -> {
            // Handle CompletableFuture exceptions
            log.error("CompletableFuture failed for blockchain recording", throwable);
            
            // Return null to prevent breaking main donation flow
            return null;
        });
    }

    /**
     * Record donation transaction on blockchain (legacy method for compatibility)
     * 
     * @param donationId Database donation ID
     * @param amount Donation amount in ETH
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
                
                log.info("Recording donation {} on blockchain - Amount: {}, Donor: {}", 
                    donationId, amount, donorEmail);
                
                // Generate donor hash for privacy
                String donorHash = HashUtil.generateConsistentDonorHash(donorEmail);
                String orderId = "DONATION_" + donationId;
                BigInteger amountWei = convertToWei(amount);
                BigInteger timestamp = BigInteger.valueOf(System.currentTimeMillis() / 1000);
                
                // Send transaction to blockchain
                TransactionReceipt receipt = contract.recordDonation(
                        donorHash,
                        amountWei,
                        "Donation",
                        orderId,
                        timestamp
                ).send();
                
                String transactionHash = receipt.getTransactionHash();
                log.info("Donation {} recorded on blockchain with tx hash: {}", 
                    donationId, transactionHash);
                
                return transactionHash;
                
            } catch (Exception e) {
                log.error("Failed to record donation {} on blockchain", donationId, e);
                throw new CompletionException(new RuntimeException(
                    "Blockchain transaction failed for donation " + donationId, e));
            }
        });
    }

    /**
     * Record fund allocation transaction on blockchain
     * 
     * @param allocationId Fund allocation ID
     * @param amount Allocation amount in ETH
     * @param beneficiaryContact Beneficiary contact details
     * @return Transaction hash
     */
    public CompletableFuture<String> recordFundAllocationTransaction(
            Long allocationId, 
            BigDecimal amount, 
            String beneficiaryContact) {
        
        return CompletableFuture.supplyAsync(() -> {
            try {
                if (!transactionEnabled) {
                    throw new IllegalStateException("Blockchain transactions are disabled");
                }
                
                log.info("Recording fund allocation {} on blockchain - Amount: {}, Beneficiary: {}", 
                    allocationId, amount, beneficiaryContact);
                
                // Generate beneficiary hash for privacy
                String beneficiaryHash = HashUtil.generateBeneficiaryHash(allocationId, beneficiaryContact);
                String orderId = "ALLOCATION_" + allocationId;
                BigInteger amountWei = convertToWei(amount);
                BigInteger timestamp = BigInteger.valueOf(System.currentTimeMillis() / 1000);
                
                // Send transaction to blockchain
                TransactionReceipt receipt = contract.recordDonation(
                        beneficiaryHash,
                        amountWei,
                        "FundAllocation",
                        orderId,
                        timestamp
                ).send();
                
                String transactionHash = receipt.getTransactionHash();
                log.info("Fund allocation {} recorded on blockchain with tx hash: {}", 
                    allocationId, transactionHash);
                
                return transactionHash;
                
            } catch (Exception e) {
                log.error("Failed to record fund allocation {} on blockchain", allocationId, e);
                throw new CompletionException(new RuntimeException(
                    "Blockchain transaction failed for allocation " + allocationId, e));
            }
        });
    }

    /**
     * Get donation details from blockchain
     * 
     * @param orderId Order ID to look up
     * @return Donation details
     */
    public CompletableFuture<DonationTransparency.DonationDetails> getDonationDetails(String orderId) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.info("Retrieving donation details for order ID: {}", orderId);
                
                DonationTransparency.DonationDetails details = contract.getDonation(orderId).send();
                
                log.info("Retrieved donation details - Amount: {} ETH, Category: {}", 
                    convertFromWei(details.getAmount()), details.getCategory());
                
                return details;
                
            } catch (Exception e) {
                log.error("Failed to get donation details for order ID: {}", orderId, e);
                throw new CompletionException(new RuntimeException(
                    "Failed to retrieve donation details for " + orderId, e));
            }
        });
    }

    /**
     * Verify if transaction exists on blockchain
     * 
     * @param transactionHash Transaction hash to verify
     * @return true if transaction exists and is confirmed
     */
    public CompletableFuture<Boolean> verifyTransaction(String transactionHash) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.info("Verifying transaction: {}", transactionHash);
                
                // Get transaction receipt
                TransactionReceipt receipt = web3j.ethGetTransactionReceipt(transactionHash)
                        .send()
                        .getTransactionReceipt()
                        .orElse(null);
                
                boolean isVerified = receipt != null && receipt.getStatus().equals("0x1");
                log.info("Transaction {} verification result: {}", transactionHash, isVerified);
                
                return isVerified;
                
            } catch (Exception e) {
                log.error("Failed to verify transaction: {}", transactionHash, e);
                return false;
            }
        });
    }

    /**
     * Get total number of donations recorded on blockchain
     * 
     * @return Total donation count
     */
    public CompletableFuture<Long> getTotalDonations() {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.info("Retrieving total donations from blockchain");
                
                BigInteger total = contract.getTotalDonations().send();
                long totalLong = total.longValue();
                
                log.info("Total donations recorded on blockchain: {}", totalLong);
                return totalLong;
                
            } catch (Exception e) {
                log.error("Failed to get total donations from blockchain", e);
                throw new CompletionException(new RuntimeException(
                    "Failed to retrieve total donations", e));
            }
        });
    }

    /**
     * Check if donation exists on blockchain
     * 
     * @param orderId Order ID to check
     * @return true if donation exists
     */
    public CompletableFuture<Boolean> donationExists(String orderId) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.info("Checking if donation exists for order ID: {}", orderId);
                
                boolean exists = contract.donationExists(orderId).send();
                log.info("Donation exists for order {}: {}", orderId, exists);
                
                return exists;
                
            } catch (Exception e) {
                log.error("Failed to check donation existence for order ID: {}", orderId, e);
                return false;
            }
        });
    }

    /**
     * Get blockchain connection status
     * 
     * @return Connection status information
     */
    public CompletableFuture<BlockchainStatus> getBlockchainStatus() {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Test connection
                String clientVersion = web3j.web3ClientVersion().send().getWeb3ClientVersion();
                BigInteger blockNumber = web3j.ethBlockNumber().send().getBlockNumber();
                
                return BlockchainStatus.builder()
                        .connected(true)
                        .clientVersion(clientVersion)
                        .currentBlock(blockNumber.longValue())
                        .contractAddress(contractAddress)
                        .transactionEnabled(transactionEnabled)
                        .build();
                        
            } catch (Exception e) {
                log.error("Failed to get blockchain status", e);
                return BlockchainStatus.builder()
                        .connected(false)
                        .error(e.getMessage())
                        .transactionEnabled(false)
                        .build();
            }
        });
    }

    /**
     * Convert ETH amount to wei
     */
    private BigInteger convertToWei(BigDecimal ethAmount) {
        return ethAmount.multiply(BigDecimal.TEN.pow(18)).toBigInteger();
    }

    /**
     * Convert wei amount to ETH
     */
    private BigDecimal convertFromWei(BigInteger weiAmount) {
        return new BigDecimal(weiAmount).divide(BigDecimal.TEN.pow(18));
    }

    /**
     * Data class for blockchain status
     */
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
