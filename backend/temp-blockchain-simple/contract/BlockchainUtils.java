package viyom.donation.viyom.blockchain.contract;

import org.web3j.crypto.Credentials;
import org.web3j.crypto.Hash;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.utils.Numeric;

import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * Utility class for blockchain operations
 */
public class BlockchainUtils {

    /**
     * Create Web3j instance for Polygon Amoy
     */
    public static Web3j createWeb3j(String rpcUrl) {
        HttpService httpService = new HttpService(rpcUrl);
        return Web3j.build(httpService);
    }

    /**
     * Create credentials from private key
     */
    public static Credentials createCredentials(String privateKey) {
        return Credentials.create(privateKey);
    }

    /**
     * Create default gas provider for Polygon Amoy
     */
    public static DefaultGasProvider createGasProvider() {
        return new DefaultGasProvider(
                BigInteger.valueOf(20000000000L), // 20 gwei gas price
                BigInteger.valueOf(6000000L)   // 6M gas limit
        );
    }

    /**
     * Convert ETH amount to wei
     */
    public static BigInteger ethToWei(BigDecimal ethAmount) {
        return ethAmount.multiply(BigDecimal.TEN.pow(18)).toBigInteger();
    }

    /**
     * Convert wei to ETH
     */
    public static BigDecimal weiToEth(BigInteger weiAmount) {
        return new BigDecimal(weiAmount).divide(BigDecimal.TEN.pow(18));
    }

    /**
     * Generate donor hash from email or identifier
     */
    public static String generateDonorHash(String donorIdentifier) {
        return Numeric.toHexString(Hash.sha3(donorIdentifier.getBytes()));
    }

    /**
     * Get current timestamp in seconds
     */
    public static BigInteger getCurrentTimestamp() {
        return BigInteger.valueOf(System.currentTimeMillis() / 1000);
    }

    /**
     * Validate contract address
     */
    public static boolean isValidAddress(String address) {
        return address != null && address.startsWith("0x") && address.length() == 42;
    }

    /**
     * Format transaction hash for display
     */
    public static String formatTransactionHash(String hash) {
        if (hash == null || hash.length() <= 10) return hash;
        return hash.substring(0, 6) + "..." + hash.substring(hash.length() - 4);
    }
}
