package viyom.donation.viyom.blockchain.contract;

import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.DefaultGasProvider;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Auto-generated Java wrapper for DonationTransparency smart contract.
 * Generated for Viyom donation transparency system.
 */
public class DonationTransparency extends Contract {

    // Contract ABI and Binary would be loaded here
    private static final String BINARY = ""; // Will be populated after compilation
    private static final String ABI = ""; // Will be populated after compilation
    
    // Function selectors
    private static final String RECORD_DONATION_FUNCTION = "recordDonation(bytes32,uint256,string,string,uint256)";
    private static final String GET_DONATION_FUNCTION = "getDonation(string)";
    private static final String DONATION_EXISTS_FUNCTION = "donationExists(string)";
    private static final String GET_TOTAL_DONATIONS_FUNCTION = "getTotalDonations()";
    private static final String GET_ORDER_ID_BY_INDEX_FUNCTION = "getOrderIdByIndex(uint256)";
    
    // Event signatures
    private static final String DONATION_RECORDED_EVENT = "DonationRecorded(bytes32,uint256,string,string,uint256)";

    /**
     * Load existing contract
     */
    public DonationTransparency(String contractAddress, Web3j web3j, 
                           TransactionManager transactionManager, 
                           ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    /**
     * Deploy new contract
     */
    public DonationTransparency(String contractAddress, Web3j web3j, 
                           Credentials credentials, 
                           ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    /**
     * Record a new donation on the blockchain
     * 
     * @param donorHash Hash of donor identifier for privacy
     * @param amount Donation amount in wei
     * @param category Donation category/sector
     * @param orderId Razorpay order ID
     * @param timestamp Donation timestamp
     * @return TransactionReceipt containing transaction details
     */
    public RemoteFunctionCall<TransactionReceipt> recordDonation(
            String donorHash,
            BigInteger amount,
            String category,
            String orderId,
            BigInteger timestamp) {
        
        org.web3j.abi.datatypes.generated.Bytes32 donorHashBytes32 = 
            org.web3j.abi.datatypes.generated.Bytes32(Numeric.hexStringToByteArray(donorHash));
        org.web3j.abi.datatypes.generated.Uint256 amountUint256 = 
            new org.web3j.abi.datatypes.generated.Uint256(amount);
        org.web3j.abi.datatypes.Utf8String categoryString = 
            new org.web3j.abi.datatypes.Utf8String(category);
        org.web3j.abi.datatypes.Utf8String orderIdString = 
            new org.web3j.abi.datatypes.Utf8String(orderId);
        org.web3j.abi.datatypes.generated.Uint256 timestampUint256 = 
            new org.web3j.abi.datatypes.generated.Uint256(timestamp);

        return executeRemoteFunctionTransaction(
                RECORD_DONATION_FUNCTION,
                donorHashBytes32,
                amountUint256,
                categoryString,
                orderIdString,
                timestampUint256);
    }

    /**
     * Get donation details by order ID
     * 
     * @param orderId Razorpay order ID
     * @return Tuple containing (donorHash, amount, category, timestamp)
     */
    public RemoteFunctionCall<DonationDetails> getDonation(String orderId) {
        org.web3j.abi.datatypes.Utf8String orderIdString = 
            new org.web3j.abi.datatypes.Utf8String(orderId);

        return executeRemoteFunctionCall(
                GET_DONATION_FUNCTION,
                orderIdString,
                input -> {
                    List<Type> output = input.getValue();
                    return new DonationDetails(
                            (String) output.get(0).getValue(),
                            (BigInteger) output.get(1).getValue(),
                            (String) output.get(2).getValue(),
                            (BigInteger) output.get(3).getValue()
                    );
                });
    }

    /**
     * Check if donation exists for given order ID
     * 
     * @param orderId Razorpay order ID
     * @return true if donation exists, false otherwise
     */
    public RemoteFunctionCall<Boolean> donationExists(String orderId) {
        org.web3j.abi.datatypes.Utf8String orderIdString = 
            new org.web3j.abi.datatypes.Utf8String(orderId);

        return executeRemoteFunctionCall(
                DONATION_EXISTS_FUNCTION,
                orderIdString,
                output -> (Boolean) output.getValue());
    }

    /**
     * Get total number of recorded donations
     * 
     * @return Total donation count
     */
    public RemoteFunctionCall<BigInteger> getTotalDonations() {
        return executeRemoteFunctionCall(
                GET_TOTAL_DONATIONS_FUNCTION,
                Collections.emptyList(),
                output -> (BigInteger) output.getValue());
    }

    /**
     * Get order ID by index (for pagination)
     * 
     * @param index Index in order IDs array
     * @return Order ID at given index
     */
    public RemoteFunctionCall<String> getOrderIdByIndex(BigInteger index) {
        org.web3j.abi.datatypes.generated.Uint256 indexUint256 = 
            new org.web3j.abi.datatypes.generated.Uint256(index);

        return executeRemoteFunctionCall(
                GET_ORDER_ID_BY_INDEX_FUNCTION,
                indexUint256,
                output -> (String) output.getValue());
    }

    /**
     * Get DonationRecorded events
     * 
     * @return List of donation events
     */
    public List<DonationRecordedEventResponse> getDonationRecordedEvents(TransactionReceipt transactionReceipt) {
        return extractEventParameters(
                DonationRecordedEventResponse.class,
                transactionReceipt,
                DONATION_RECORDED_EVENT);
    }

    /**
     * Get all DonationRecorded events from contract deployment
     * 
     * @return List of all donation events
     */
    public RemoteFunctionCall<List<DonationRecordedEventResponse>> getDonationRecordedEvents() {
        return generateEventFlowable(DonationRecordedEventResponse.class);
    }

    /**
     * Load contract from deployment
     */
    public static DonationTransparency load(
            String contractAddress, 
            Web3j web3j, 
            Credentials credentials, 
            ContractGasProvider gasProvider) {
        return new DonationTransparency(contractAddress, web3j, credentials, gasProvider);
    }

    /**
     * Deploy new contract
     */
    public static RemoteFunctionCall<DonationTransparency> deploy(
            Web3j web3j, 
            Credentials credentials, 
            ContractGasProvider gasProvider) {
        return deployRemoteCall(DonationTransparency.class, 
                web3j, credentials, gasProvider, BINARY, "");
    }

    /**
     * Data class for donation details
     */
    public static class DonationDetails {
        private final String donorHash;
        private final BigInteger amount;
        private final String category;
        private final BigInteger timestamp;

        public DonationDetails(String donorHash, BigInteger amount, String category, BigInteger timestamp) {
            this.donorHash = donorHash;
            this.amount = amount;
            this.category = category;
            this.timestamp = timestamp;
        }

        public String getDonorHash() { return donorHash; }
        public BigInteger getAmount() { return amount; }
        public String getCategory() { return category; }
        public BigInteger getTimestamp() { return timestamp; }

        @Override
        public String toString() {
            return String.format("DonationDetails{donorHash='%s', amount=%s, category='%s', timestamp=%s}",
                    donorHash, amount, category, timestamp);
        }
    }

    /**
     * Event response class for DonationRecorded event
     */
    public static class DonationRecordedEventResponse {
        private final String donorHash;
        private final BigInteger amount;
        private final String category;
        private final String orderId;
        private final BigInteger timestamp;

        public DonationRecordedEventResponse(String donorHash, BigInteger amount, String category, 
                                       String orderId, BigInteger timestamp) {
            this.donorHash = donorHash;
            this.amount = amount;
            this.category = category;
            this.orderId = orderId;
            this.timestamp = timestamp;
        }

        public String getDonorHash() { return donorHash; }
        public BigInteger getAmount() { return amount; }
        public String getCategory() { return category; }
        public String getOrderId() { return orderId; }
        public BigInteger getTimestamp() { return timestamp; }

        @Override
        public String toString() {
            return String.format("DonationRecordedEvent{donorHash='%s', amount=%s, category='%s', orderId='%s', timestamp=%s}",
                    donorHash, amount, category, orderId, timestamp);
        }
    }
}
