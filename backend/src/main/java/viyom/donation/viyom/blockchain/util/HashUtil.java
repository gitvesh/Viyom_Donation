package viyom.donation.viyom.blockchain.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.web3j.crypto.Hash;
import org.web3j.utils.Numeric;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Utility class for generating secure hashes for blockchain transactions
 * Provides privacy protection for donor identities
 */
@Component
@Slf4j
public class HashUtil {

    /**
     * Generate SHA-256 hash for donor email with bytes32 compatibility
     * Ensures consistent hashing across multiple requests
     * 
     * @param email Donor email address
     * @return 32-byte hexadecimal hash string (64 characters) compatible with bytes32
     */
    public static String generateDonorHash(String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("Email cannot be null or empty");
            }

            // Normalize email for consistency
            String normalizedEmail = email.toLowerCase().trim();
            
            // Use application-specific salt for consistent hashing
            String saltedInput = "VIYOM_DONOR_" + normalizedEmail;
            
            log.debug("Generating hash for email: {}", normalizedEmail);
            
            // Generate SHA-256 hash
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(saltedInput.getBytes(StandardCharsets.UTF_8));
            
            // Convert to hexadecimal string (adds 0x prefix by default in Web3j)
            String hexHash = Numeric.toHexString(hashBytes);
            
            // Remove 0x prefix if present for consistent length checking
            String cleanHash = hexHash.startsWith("0x") ? hexHash.substring(2) : hexHash;
            
            // Ensure bytes32 compatibility (exactly 32 bytes = 64 hex characters)
            if (cleanHash.length() != 64) {
                log.error("Hash length mismatch: expected 64 chars, got {}", cleanHash.length());
                throw new RuntimeException("Hash generation failed - incorrect length");
            }
            
            log.debug("Generated donor hash: {}", getShortHash(hexHash));
            
            return hexHash;
            
        } catch (NoSuchAlgorithmException e) {
            log.error("SHA-256 algorithm not available", e);
            throw new RuntimeException("Hash generation failed", e);
        } catch (Exception e) {
            log.error("Failed to generate donor hash for email: {}", email, e);
            throw new RuntimeException("Donor hash generation failed", e);
        }
    }

    /**
     * Generate SHA256 hash for donor privacy (legacy method with timestamp)
     * 
     * @param donorIdentifier Email, phone, or any donor identifier
     * @return Hexadecimal hash string
     */
    public static String generateDonorHashWithTimestamp(String donorIdentifier) {
        try {
            if (donorIdentifier == null || donorIdentifier.trim().isEmpty()) {
                throw new IllegalArgumentException("Donor identifier cannot be null or empty");
            }

            // Add timestamp salt for uniqueness
            String saltedInput = donorIdentifier + "_" + Instant.now().truncatedTo(ChronoUnit.DAYS);
            
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(saltedInput.getBytes(StandardCharsets.UTF_8));
            
            return Numeric.toHexString(hashBytes);
            
        } catch (NoSuchAlgorithmException e) {
            log.error("SHA-256 algorithm not available", e);
            throw new RuntimeException("Hash generation failed", e);
        } catch (Exception e) {
            log.error("Failed to generate donor hash for: {}", donorIdentifier, e);
            throw new RuntimeException("Donor hash generation failed", e);
        }
    }

    /**
     * Validate if hash is bytes32 compatible (exactly 32 bytes)
     * 
     * @param hash Hash string to validate
     * @return true if hash is bytes32 compatible
     */
    public static boolean isBytes32Compatible(String hash) {
        if (hash == null) return false;
        
        // Remove 0x prefix if present
        String cleanHash = hash.startsWith("0x") ? hash.substring(2) : hash;
        
        // Check length (32 bytes = 64 hex characters)
        return cleanHash.length() == 64 && cleanHash.matches("^[0-9a-fA-F]+$");
    }

    /**
     * Convert hash to bytes32 format (with 0x prefix)
     * 
     * @param hash Hash string
     * @return bytes32 formatted hash
     */
    public static String toBytes32Format(String hash) {
        if (hash == null) {
            throw new IllegalArgumentException("Hash cannot be null");
        }
        
        String cleanHash = hash.startsWith("0x") ? hash.substring(2) : hash;
        
        if (!isBytes32Compatible(cleanHash)) {
            throw new IllegalArgumentException("Hash is not bytes32 compatible");
        }
        
        return "0x" + cleanHash;
    }

    /**
     * Generate consistent donor hash (alias for generateDonorHash)
     * 
     * @param email Donor email address
     * @return 32-byte hexadecimal hash string
     */
    public static String generateConsistentDonorHash(String email) {
        return generateDonorHash(email);
    }

    /**
     * Test hash consistency across multiple calls
     * 
     * @param email Email to test
     * @param iterations Number of test iterations
     * @return true if all hashes are identical
     */
    public static boolean testHashConsistency(String email, int iterations) {
        if (email == null || iterations <= 0) {
            return false;
        }
        
        String firstHash = generateDonorHash(email);
        
        for (int i = 1; i < iterations; i++) {
            String currentHash = generateDonorHash(email);
            if (!firstHash.equals(currentHash)) {
                log.error("Hash inconsistency detected at iteration {}: {} != {}", 
                    i, firstHash, currentHash);
                return false;
            }
        }
        
        log.info("Hash consistency test passed for {} iterations", iterations);
        return true;
    }

    /**
     * Generate hash with custom salt (for testing)
     * 
     * @param email Email address
     * @param salt Custom salt
     * @return Hash string
     */
    public static String generateDonorHashWithSalt(String email, String salt) {
        try {
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("Email cannot be null or empty");
            }
            
            if (salt == null || salt.trim().isEmpty()) {
                throw new IllegalArgumentException("Salt cannot be null or empty");
            }

            String normalizedEmail = email.toLowerCase().trim();
            String saltedInput = salt + "_" + normalizedEmail;
            
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(saltedInput.getBytes(StandardCharsets.UTF_8));
            
            return Numeric.toHexString(hashBytes);
            
        } catch (NoSuchAlgorithmException e) {
            log.error("SHA-256 algorithm not available", e);
            throw new RuntimeException("Hash generation failed", e);
        } catch (Exception e) {
            log.error("Failed to generate donor hash with salt for email: {}", email, e);
            throw new RuntimeException("Donor hash generation failed", e);
        }
    }

    /**
     * Generate keccak256 hash (Web3j compatible)
     * 
     * @param input String to hash
     * @return Keccak256 hash
     */
    public static String generateKeccak256Hash(String input) {
        try {
            if (input == null || input.trim().isEmpty()) {
                throw new IllegalArgumentException("Input cannot be null or empty");
            }

            byte[] inputBytes = input.getBytes(StandardCharsets.UTF_8);
            byte[] hashBytes = Hash.sha3(inputBytes);
            
            return Numeric.toHexString(hashBytes);
            
        } catch (Exception e) {
            log.error("Failed to generate keccak256 hash for: {}", input, e);
            throw new RuntimeException("Keccak256 hash generation failed", e);
        }
    }

    /**
     * Generate order ID hash for blockchain lookup
     * 
     * @param orderId Original order ID
     * @return Hashed order ID
     */
    public static String generateOrderIdHash(String orderId) {
        return generateKeccak256Hash("VIYOM_ORDER_" + orderId);
    }

    /**
     * Generate unique transaction reference
     * 
     * @param donationId Database donation ID
     * @param timestamp Transaction timestamp
     * @return Unique transaction reference
     */
    public static String generateTransactionReference(Long donationId, Long timestamp) {
        String input = "VIYOM_TX_" + donationId + "_" + timestamp;
        return generateKeccak256Hash(input);
    }

    /**
     * Validate hash format
     * 
     * @param hash Hash string to validate
     * @return true if valid hex hash
     */
    public static boolean isValidHash(String hash) {
        if (hash == null || hash.isEmpty()) {
            return false;
        }
        
        // Check if it's a valid hexadecimal string
        return hash.matches("^[0-9a-fA-F]+$") && hash.length() == 64;
    }

    /**
     * Generate short hash for display purposes
     * 
     * @param fullHash Full hash string
     * @return Shortened hash (first 8 + last 4 characters)
     */
    public static String getShortHash(String fullHash) {
        if (fullHash == null || fullHash.length() < 12) {
            return fullHash;
        }
        
        return fullHash.substring(0, 8) + "..." + fullHash.substring(fullHash.length() - 4);
    }

    /**
     * Generate hash for beneficiary identification
     * 
     * @param beneficiaryId Beneficiary database ID
     * @param contactDetails Contact information
     * @return Hashed beneficiary identifier
     */
    public static String generateBeneficiaryHash(Long beneficiaryId, String contactDetails) {
        String input = "VIYOM_BENEFICIARY_" + beneficiaryId + "_" + contactDetails;
        return generateKeccak256Hash(input);
    }

    /**
     * Generate hash for fund allocation tracking
     * 
     * @param allocationId Fund allocation ID
     * @param beneficiaryId Beneficiary ID
     * @param amount Allocation amount
     * @return Hashed allocation reference
     */
    public static String generateAllocationHash(Long allocationId, Long beneficiaryId, String amount) {
        String input = "VIYOM_ALLOCATION_" + allocationId + "_" + beneficiaryId + "_" + amount;
        return generateKeccak256Hash(input);
    }
}
