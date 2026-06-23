package viyom.donation.viyom.blockchain.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Test class to demonstrate HashUtil functionality
 * Shows SHA-256 hashing with bytes32 compatibility and consistency
 */
@Component
@Slf4j
public class HashUtilTest {

    /**
     * Run comprehensive hash utility tests
     */
    public void runHashTests() {
        log.info("=== HashUtil Test Suite ===");
        
        // Test 1: Basic hash generation
        testBasicHashGeneration();
        
        // Test 2: Consistency test
        testHashConsistency();
        
        // Test 3: Bytes32 compatibility
        testBytes32Compatibility();
        
        // Test 4: Error handling
        testErrorHandling();
        
        // Test 5: Custom salt
        testCustomSalt();
        
        log.info("=== HashUtil Test Suite Complete ===");
    }

    /**
     * Test basic hash generation
     */
    private void testBasicHashGeneration() {
        log.info("--- Test 1: Basic Hash Generation ---");
        
        String email = "test@example.com";
        String hash = HashUtil.generateDonorHash(email);
        
        log.info("Email: {}", email);
        log.info("Hash: {}", hash);
        log.info("Short Hash: {}", HashUtil.getShortHash(hash));
        log.info("Length: {} characters", hash.length());
        
        // Verify hash properties
        assert hash.length() == 64 : "Hash should be 64 characters (32 bytes)";
        assert HashUtil.isBytes32Compatible(hash) : "Hash should be bytes32 compatible";
        
        log.info("✅ Basic hash generation test passed");
    }

    /**
     * Test hash consistency across multiple calls
     */
    private void testHashConsistency() {
        log.info("--- Test 2: Hash Consistency ---");
        
        String email = "consistency@example.com";
        
        // Generate hash multiple times
        String hash1 = HashUtil.generateDonorHash(email);
        String hash2 = HashUtil.generateDonorHash(email);
        String hash3 = HashUtil.generateDonorHash(email);
        
        log.info("Email: {}", email);
        log.info("Hash 1: {}", HashUtil.getShortHash(hash1));
        log.info("Hash 2: {}", HashUtil.getShortHash(hash2));
        log.info("Hash 3: {}", HashUtil.getShortHash(hash3));
        
        // Verify consistency
        assert hash1.equals(hash2) : "Hashes should be identical";
        assert hash2.equals(hash3) : "Hashes should be identical";
        
        // Test consistency method
        boolean isConsistent = HashUtil.testHashConsistency(email, 100);
        assert isConsistent : "Hash should be consistent across 100 iterations";
        
        log.info("✅ Hash consistency test passed");
    }

    /**
     * Test bytes32 compatibility
     */
    private void testBytes32Compatibility() {
        log.info("--- Test 3: Bytes32 Compatibility ---");
        
        String email = "bytes32@example.com";
        String hash = HashUtil.generateDonorHash(email);
        
        log.info("Email: {}", email);
        log.info("Hash: {}", hash);
        log.info("Is bytes32 compatible: {}", HashUtil.isBytes32Compatible(hash));
        
        // Test bytes32 format conversion
        String bytes32Hash = HashUtil.toBytes32Format(hash);
        log.info("Bytes32 format: {}", bytes32Hash);
        
        // Test with 0x prefix
        String hashWithPrefix = "0x" + hash;
        log.info("Hash with 0x: {}", hashWithPrefix);
        log.info("Is bytes32 compatible: {}", HashUtil.isBytes32Compatible(hashWithPrefix));
        
        // Verify properties
        assert HashUtil.isBytes32Compatible(hash) : "Hash should be bytes32 compatible";
        assert HashUtil.isBytes32Compatible(hashWithPrefix) : "Hash with 0x should be bytes32 compatible";
        assert bytes32Hash.startsWith("0x") : "Bytes32 format should start with 0x";
        assert bytes32Hash.length() == 66 : "Bytes32 format should be 66 characters (0x + 64)";
        
        log.info("✅ Bytes32 compatibility test passed");
    }

    /**
     * Test error handling
     */
    private void testErrorHandling() {
        log.info("--- Test 4: Error Handling ---");
        
        try {
            HashUtil.generateDonorHash(null);
            assert false : "Should throw exception for null email";
        } catch (IllegalArgumentException e) {
            log.info("✅ Null email correctly rejected: {}", e.getMessage());
        }
        
        try {
            HashUtil.generateDonorHash("");
            assert false : "Should throw exception for empty email";
        } catch (IllegalArgumentException e) {
            log.info("✅ Empty email correctly rejected: {}", e.getMessage());
        }
        
        try {
            HashUtil.generateDonorHash("   ");
            assert false : "Should throw exception for whitespace email";
        } catch (IllegalArgumentException e) {
            log.info("✅ Whitespace email correctly rejected: {}", e.getMessage());
        }
        
        try {
            HashUtil.toBytes32Format(null);
            assert false : "Should throw exception for null hash";
        } catch (IllegalArgumentException e) {
            log.info("✅ Null hash correctly rejected: {}", e.getMessage());
        }
        
        try {
            HashUtil.toBytes32Format("invalid");
            assert false : "Should throw exception for invalid hash";
        } catch (IllegalArgumentException e) {
            log.info("✅ Invalid hash correctly rejected: {}", e.getMessage());
        }
        
        log.info("✅ Error handling test passed");
    }

    /**
     * Test custom salt functionality
     */
    private void testCustomSalt() {
        log.info("--- Test 5: Custom Salt ---");
        
        String email = "custom@example.com";
        String salt1 = "SALT_1";
        String salt2 = "SALT_2";
        
        String hash1 = HashUtil.generateDonorHashWithSalt(email, salt1);
        String hash2 = HashUtil.generateDonorHashWithSalt(email, salt2);
        String hash3 = HashUtil.generateDonorHash(email); // Default salt
        
        log.info("Email: {}", email);
        log.info("Hash with salt1: {}", HashUtil.getShortHash(hash1));
        log.info("Hash with salt2: {}", HashUtil.getShortHash(hash2));
        log.info("Hash with default salt: {}", HashUtil.getShortHash(hash3));
        
        // Verify different salts produce different hashes
        assert !hash1.equals(hash2) : "Different salts should produce different hashes";
        assert !hash1.equals(hash3) : "Custom salt should differ from default salt";
        assert !hash2.equals(hash3) : "Different salts should produce different hashes";
        
        // Test consistency with same salt
        String hash1_repeat = HashUtil.generateDonorHashWithSalt(email, salt1);
        assert hash1.equals(hash1_repeat) : "Same salt should produce same hash";
        
        log.info("✅ Custom salt test passed");
    }

    /**
     * Test email normalization
     */
    public void testEmailNormalization() {
        log.info("--- Test 6: Email Normalization ---");
        
        String email1 = "Test@Example.COM";
        String email2 = "test@example.com";
        String email3 = "  test@example.com  ";
        
        String hash1 = HashUtil.generateDonorHash(email1);
        String hash2 = HashUtil.generateDonorHash(email2);
        String hash3 = HashUtil.generateDonorHash(email3);
        
        log.info("Email 1: '{}' -> {}", email1, HashUtil.getShortHash(hash1));
        log.info("Email 2: '{}' -> {}", email2, HashUtil.getShortHash(hash2));
        log.info("Email 3: '{}' -> {}", email3, HashUtil.getShortHash(hash3));
        
        // All should produce the same hash due to normalization
        assert hash1.equals(hash2) : "Case should be normalized";
        assert hash2.equals(hash3) : "Whitespace should be trimmed";
        
        log.info("✅ Email normalization test passed");
    }

    /**
     * Performance test
     */
    public void testPerformance() {
        log.info("--- Test 7: Performance Test ---");
        
        String email = "performance@example.com";
        int iterations = 10000;
        
        long startTime = System.currentTimeMillis();
        
        for (int i = 0; i < iterations; i++) {
            HashUtil.generateDonorHash(email);
        }
        
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        
        log.info("Generated {} hashes in {} ms", iterations, duration);
        log.info("Average time per hash: {} ms", (double) duration / iterations);
        log.info("Hashes per second: {}", (iterations * 1000) / duration);
        
        // Performance should be reasonable (< 1ms per hash)
        assert duration < iterations * 10 : "Performance should be under 10ms per hash";
        
        log.info("✅ Performance test passed");
    }
}
