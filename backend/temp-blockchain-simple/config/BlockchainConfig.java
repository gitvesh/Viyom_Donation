package viyom.donation.viyom.blockchain.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

import java.math.BigInteger;

/**
 * Blockchain configuration for Viyom donation transparency system
 * Configures Web3j, credentials, and gas provider for Polygon Amoy
 */
@Configuration
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

    @Value("${blockchain.gas.price:20000000000}")
    private Long gasPrice;

    @Value("${blockchain.gas.limit:6000000}")
    private Long gasLimit;

    /**
     * Configure Web3j instance for blockchain connection
     */
    @Bean
    public Web3j web3j() {
        try {
            log.info("Initializing Web3j with RPC URL: {}", rpcUrl);
            HttpService httpService = new HttpService(rpcUrl);
            Web3j web3j = Web3j.build(httpService);
            
            // Test connection
            String clientVersion = web3j.web3ClientVersion().send().getWeb3ClientVersion();
            log.info("Connected to blockchain. Client version: {}", clientVersion);
            
            return web3j;
        } catch (Exception e) {
            log.error("Failed to initialize Web3j", e);
            throw new RuntimeException("Failed to connect to blockchain", e);
        }
    }

    /**
     * Configure wallet credentials for transaction signing
     */
    @Bean
    public Credentials credentials() {
        try {
            if (privateKey == null || privateKey.isEmpty()) {
                log.warn("Private key not configured. Read-only mode enabled.");
                return null;
            }
            
            log.info("Configuring wallet credentials for chain ID: {}", chainId);
            Credentials credentials = Credentials.create(privateKey);
            log.info("Wallet configured with address: {}", credentials.getAddress());
            
            return credentials;
        } catch (Exception e) {
            log.error("Failed to configure wallet credentials", e);
            throw new RuntimeException("Failed to configure blockchain wallet", e);
        }
    }

    /**
     * Configure gas provider for transactions
     */
    @Bean
    public DefaultGasProvider gasProvider() {
        log.info("Configuring gas provider - Price: {} wei, Limit: {}", gasPrice, gasLimit);
        return new DefaultGasProvider();
    }

    /**
     * Configure and load deployed smart contract as Spring Bean
     */
    @Bean
    public viyom.donation.viyom.blockchain.contract.DonationTransparency donationTransparency(
            Web3j web3j,
            Credentials credentials,
            DefaultGasProvider gasProvider) {
        
        try {
            if (contractAddress == null || contractAddress.isEmpty()) {
                throw new IllegalStateException("Contract address not configured in application.properties");
            }
            
            if (credentials == null) {
                log.warn("No credentials configured. Contract will be in read-only mode.");
            }
            
            log.info("Loading DonationTransparency contract at: {}", contractAddress);
            
            viyom.donation.viyom.blockchain.contract.DonationTransparency contract = 
                viyom.donation.viyom.blockchain.contract.DonationTransparency.load(
                    contractAddress,
                    web3j,
                    credentials,
                    gasProvider
                );
            
            log.info("DonationTransparency contract loaded successfully");
            return contract;
            
        } catch (Exception e) {
            log.error("Failed to load DonationTransparency contract", e);
            throw new RuntimeException("Failed to load smart contract", e);
        }
    }

    /**
     * Get contract address
     */
    @Bean("contractAddress")
    public String getContractAddress() {
        if (contractAddress == null || contractAddress.isEmpty()) {
            throw new IllegalStateException("Contract address not configured");
        }
        log.info("Using contract address: {}", contractAddress);
        return contractAddress;
    }

    /**
     * Get chain ID
     */
    @Bean("chainId")
    public Long getChainId() {
        return chainId;
    }

    /**
     * Get RPC URL
     */
    @Bean("rpcUrl")
    public String getRpcUrl() {
        return rpcUrl;
    }

    /**
     * Check if blockchain is configured for transactions
     */
    @Bean("isTransactionEnabled")
    public boolean isTransactionEnabled() {
        return privateKey != null && !privateKey.isEmpty() && 
               contractAddress != null && !contractAddress.isEmpty();
    }
}
