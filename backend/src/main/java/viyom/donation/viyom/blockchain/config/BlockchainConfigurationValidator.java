package viyom.donation.viyom.blockchain.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Validates blockchain configuration on application startup
 * Ensures all required properties are properly configured
 */
@Component
@Slf4j
public class BlockchainConfigurationValidator {

    @Value("${blockchain.rpc.url:https://rpc-amoy.polygon.technology}")
    private String rpcUrl;

    @Value("${blockchain.contract.address:}")
    private String contractAddress;

    @Value("${blockchain.private.key:}")
    private String privateKey;

    @Value("${blockchain.polygon.chain.id:80002}")
    private Long chainId;

    @EventListener(ApplicationReadyEvent.class)
    public void validateConfiguration() {
        log.info("🔍 Validating blockchain configuration...");
        
        boolean isValid = true;
        
        // Validate RPC URL
        if (rpcUrl == null || rpcUrl.isEmpty()) {
            log.error("❌ Blockchain RPC URL not configured");
            isValid = false;
        } else if (!rpcUrl.startsWith("http")) {
            log.error("❌ Invalid RPC URL format: {}", rpcUrl);
            isValid = false;
        } else {
            log.info("✅ RPC URL configured: {}", rpcUrl);
        }
        
        // Validate Chain ID
        if (chainId == null) {
            log.error("❌ Chain ID not configured");
            isValid = false;
        } else {
            log.info("✅ Chain ID configured: {}", chainId);
        }
        
        // Validate Contract Address
        if (contractAddress == null || contractAddress.isEmpty()) {
            log.warn("⚠️ Contract address not configured - blockchain transactions disabled");
        } else if (!isValidAddress(contractAddress)) {
            log.error("❌ Invalid contract address format: {}", contractAddress);
            isValid = false;
        } else {
            log.info("✅ Contract address configured: {}", contractAddress);
        }
        
        // Validate Private Key
        if (privateKey == null || privateKey.isEmpty()) {
            log.warn("⚠️ Private key not configured - read-only mode enabled");
        } else if (!isValidPrivateKey(privateKey)) {
            log.error("❌ Invalid private key format");
            isValid = false;
        } else {
            log.info("✅ Private key configured (wallet mode enabled)");
        }
        
        // Overall validation result
        if (isValid) {
            log.info("🎉 Blockchain configuration validation passed");
            log.info("📊 Configuration Summary:");
            log.info("   - RPC URL: {}", rpcUrl);
            log.info("   - Chain ID: {}", chainId);
            log.info("   - Contract: {}", contractAddress != null ? contractAddress : "Not configured");
            log.info("   - Wallet: {}", privateKey != null ? "Enabled" : "Read-only");
        } else {
            log.error("🚨 Blockchain configuration validation failed");
            log.error("💡 Please check your application.properties or environment variables");
        }
    }
    
    /**
     * Validate Ethereum address format
     */
    private boolean isValidAddress(String address) {
        if (address == null) return false;
        
        // Remove 0x prefix if present
        String cleanAddress = address.startsWith("0x") ? address.substring(2) : address;
        
        // Check length (40 characters = 20 bytes)
        if (cleanAddress.length() != 40) return false;
        
        // Check if it's valid hexadecimal
        return cleanAddress.matches("^[0-9a-fA-F]+$");
    }
    
    /**
     * Validate private key format
     */
    private boolean isValidPrivateKey(String privateKey) {
        if (privateKey == null) return false;
        
        // Remove 0x prefix if present (should not be present)
        String cleanKey = privateKey.startsWith("0x") ? privateKey.substring(2) : privateKey;
        
        // Check length (64 characters = 32 bytes)
        if (cleanKey.length() != 64) return false;
        
        // Check if it's valid hexadecimal
        return cleanKey.matches("^[0-9a-fA-F]+$");
    }
}
