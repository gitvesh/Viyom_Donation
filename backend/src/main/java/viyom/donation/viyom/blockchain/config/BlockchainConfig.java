package viyom.donation.viyom.blockchain.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.lang.Nullable;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.ReadonlyTransactionManager;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;

import java.math.BigInteger;

/**
 * Blockchain configuration for Viyom donation transparency system.
 * Configures Web3j, credentials, and gas provider for Polygon Amoy.
 *
 * IMPORTANT – this module is designed to degrade gracefully:
 *   - If the RPC is unreachable at startup, the app still starts (blockchain disabled).
 *   - If the contract address or private key is missing/invalid, blockchain transactions
 *     are disabled but the rest of the application continues to function normally.
 *
 * All beans are @Lazy so they don't block Spring Boot startup.
 * Blockchain connects on first use, allowing Render's health check to pass quickly.
 */
@Configuration
@Lazy
@Slf4j
public class BlockchainConfig {

    @Value("${blockchain.rpc.url:https://rpc-amoy.polygon.technology}")
    private String rpcUrl;

    @Value("${blockchain.polygon.chain.id:80002}")
    private Long chainId;

    @Value("${blockchain.contract.address:}")
    private String contractAddress;

    @Value("${blockchain.private.key:}")
    private String privateKey;

    @Value("${blockchain.gas.price:30000000000}")
    private Long gasPrice;

    @Value("${blockchain.gas.limit:500000}")
    private Long gasLimit;

    // ─────────────────────────────────────────────────────────────────────────
    // Web3j Bean – NEVER crashes on startup
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Configure Web3j instance for blockchain connection.
     * If the RPC endpoint is unreachable, a warning is logged but the bean
     * is still created so the application starts normally.
     */
    @Bean
    public Web3j web3j() {
        log.info("Initializing Web3j with RPC URL: {}", rpcUrl);
        try {
            HttpService httpService = new HttpService(rpcUrl);
            Web3j web3jInstance = Web3j.build(httpService);

            // Non-fatal connectivity test – timeout is handled by Web3j's underlying client.
            // We do NOT let a connection failure crash the whole Spring context.
            try {
                String clientVersion = web3jInstance.web3ClientVersion().send().getWeb3ClientVersion();
                log.info("✅ Connected to blockchain node. Client version: {}", clientVersion);
            } catch (Exception connEx) {
                log.warn("⚠️ Cannot reach blockchain RPC at startup: {}. " +
                         "Blockchain features will be disabled until the RPC is reachable. " +
                         "Application will still start normally.", connEx.getMessage());
            }

            return web3jInstance;
        } catch (Exception e) {
            log.error("Failed to build Web3j HTTP service for URL: {}. Blockchain disabled.", rpcUrl, e);
            // Return a best-effort instance – transactions will fail at call-time (handled gracefully).
            return Web3j.build(new HttpService(rpcUrl));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Credentials Bean – returns null in read-only / unconfigured mode
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Configure wallet credentials for transaction signing.
     *
     * Returns {@code null} when the private key is not configured.
     * All callers that need credentials must first check {@link #isTransactionEnabled()}.
     */
    @Bean
    public Credentials credentials() {
        if (privateKey == null || privateKey.trim().isEmpty()) {
            log.warn("⚠️ blockchain.private.key not configured – read-only mode. No transactions will be sent.");
            return null;
        }

        // Strip 0x prefix if accidentally included
        String cleanKey = privateKey.startsWith("0x") ? privateKey.substring(2) : privateKey;

        if (cleanKey.length() != 64 || !cleanKey.matches("^[0-9a-fA-F]+$")) {
            log.error("❌ blockchain.private.key has incorrect format (must be 64 hex chars, got {} chars). " +
                      "Blockchain transactions disabled.", cleanKey.length());
            return null;
        }

        try {
            log.info("Configuring wallet credentials for chain ID: {}", chainId);
            Credentials creds = Credentials.create(cleanKey);
            log.info("✅ Wallet configured. Address: {}", creds.getAddress());
            return creds;
        } catch (Exception e) {
            log.error("❌ Failed to create wallet credentials from private key. Blockchain disabled.", e);
            return null;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Gas Provider
    // ─────────────────────────────────────────────────────────────────────────

    @Bean
    public ContractGasProvider gasProvider() {
        log.info("Gas provider – price: {} wei, limit: {}", gasPrice, gasLimit);
        return new StaticGasProvider(BigInteger.valueOf(gasPrice), BigInteger.valueOf(gasLimit));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DonationTransparency Contract Bean – null when not fully configured
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Load the deployed DonationTransparency smart contract.
     *
     * Returns {@code null} (and disables transactions) when:
     * <ul>
     *   <li>Contract address is not set or is a placeholder</li>
     *   <li>Credentials are null (no private key)</li>
     * </ul>
     * {@link BlockchainService} checks {@code transactionEnabled} before using this bean.
     */
    @Bean
    public viyom.donation.viyom.blockchain.contract.DonationTransparency donationTransparency(
            Web3j web3j,
            @Nullable Credentials credentials,
            ContractGasProvider gasProvider) {

        // Validate contract address
        if (contractAddress == null || contractAddress.trim().isEmpty()) {
            log.warn("⚠️ blockchain.contract.address is not set. Blockchain transactions disabled.");
            return null;
        }
        String cleanAddr = contractAddress.startsWith("0x") ? contractAddress.substring(2) : contractAddress;
        if (cleanAddr.length() != 40 || !cleanAddr.matches("^[0-9a-fA-F]+$")) {
            log.error("❌ blockchain.contract.address '{}' is not a valid Ethereum address (need 40 hex chars). " +
                      "Blockchain transactions disabled.", contractAddress);
            return null;
        }

        // With valid credentials → load in full read-write mode with EIP-155 chain ID signing
        if (credentials != null) {
            try {
                log.info("Loading DonationTransparency contract at: {} with chain ID: {}", contractAddress, chainId);
                // MUST use RawTransactionManager with chain ID to satisfy EIP-155 replay protection
                // on Polygon Amoy (chain ID 80002). Passing Credentials directly would produce
                // unsigned-chainId transactions which the node rejects with error -32000.
                RawTransactionManager txManager = new RawTransactionManager(web3j, credentials, chainId);
                viyom.donation.viyom.blockchain.contract.DonationTransparency contract =
                    new viyom.donation.viyom.blockchain.contract.DonationTransparency(
                        contractAddress, web3j, txManager, gasProvider);
                log.info("✅ DonationTransparency contract loaded successfully with EIP-155 signing.");
                return contract;
            } catch (Exception e) {
                log.error("❌ Failed to load DonationTransparency contract. Blockchain transactions disabled.", e);
                return null;
            }
        }

        // No credentials → read-only mode using ReadonlyTransactionManager
        // (avoids NPE inside Web3j RawTransactionManager when credentials are null)
        log.warn("⚠️ No credentials configured – contract loaded in read-only mode. Transactions will not be sent.");
        try {
            ReadonlyTransactionManager readonlyTxManager =
                    new ReadonlyTransactionManager(web3j, contractAddress);
            return new viyom.donation.viyom.blockchain.contract.DonationTransparency(
                    contractAddress, web3j, readonlyTxManager, gasProvider);
        } catch (Exception e) {
            log.error("Failed to load contract in read-only mode.", e);
            return null;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Named Beans used by BlockchainService
    // ─────────────────────────────────────────────────────────────────────────

    /** Returns the raw contract address string (may be empty/invalid). */
    @Bean("contractAddress")
    public String getContractAddress() {
        if (contractAddress == null || contractAddress.trim().isEmpty()) {
            log.warn("⚠️ blockchain.contract.address bean: not configured.");
            return "";
        }
        return contractAddress;
    }

    @Bean("chainId")
    public Long getChainId() {
        return chainId;
    }

    @Bean("rpcUrl")
    public String getRpcUrl() {
        return rpcUrl;
    }

    /**
     * Returns {@code true} only when BOTH a valid private key AND a valid contract
     * address are configured. This gate prevents any write transaction from being
     * attempted in a misconfigured environment.
     */
    @Bean("isTransactionEnabled")
    public boolean isTransactionEnabled() {
        boolean keyOk = privateKey != null && !privateKey.trim().isEmpty();
        boolean addrOk = contractAddress != null && !contractAddress.trim().isEmpty();

        if (keyOk && addrOk) {
            // Extra format check for private key length
            String cleanKey = privateKey.startsWith("0x") ? privateKey.substring(2) : privateKey;
            keyOk = cleanKey.length() == 64 && cleanKey.matches("^[0-9a-fA-F]+$");
        }
        if (keyOk && addrOk) {
            // Extra format check for address length
            String cleanAddr = contractAddress.startsWith("0x") ? contractAddress.substring(2) : contractAddress;
            addrOk = cleanAddr.length() == 40 && cleanAddr.matches("^[0-9a-fA-F]+$");
        }

        boolean enabled = keyOk && addrOk;
        if (enabled) {
            log.info("✅ Blockchain transactions ENABLED.");
        } else {
            log.warn("⚠️ Blockchain transactions DISABLED (private key valid={}, contract address valid={}).",
                    keyOk, addrOk);
        }
        return enabled;
    }
}
