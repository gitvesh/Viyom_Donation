package viyom.donation.viyom.blockchain.contract;

import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.utils.Numeric;

import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Updated Web3j wrapper for DonationTransparency smart contract.
 * Includes support for Fund Allocation tracking.
 */
public class DonationTransparency extends Contract {

    // Updated binary from a fresh compilation
    private static final String BINARY = "608060405234801561000f575f80fd5b50600436106100b2575f3560e01c80634ae8a9311161006f5780634ae8a931146101c85780634c056c24146101e45780635adce33214610214578063777c658f14610247578063aec5883d14610265578063e0ad174414610295576100b2565b806301ffc9a7146100b65780630a2642bf146100e657806316c6b57614610118578063230e623a146101485780632dcb222714610164578063473b99b014610198575b5f80fd5b6100d060048036038101906100cb9190611409565b6102c5565b6040516100dd919061144e565b60405180910390f3"; 
    
    public DonationTransparency(String contractAddress, Web3j web3j, 
                           TransactionManager transactionManager, 
                           ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public DonationTransparency(String contractAddress, Web3j web3j, 
                           Credentials credentials, 
                           ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    /**
     * Records a new donation on the blockchain.
     */
    public RemoteFunctionCall<TransactionReceipt> recordDonation(
            String donorHash, BigInteger amount, String category, String orderId, BigInteger timestamp) {
        
        String cleanHash = donorHash;
        if (cleanHash.startsWith("0x")) {
            cleanHash = cleanHash.substring(2);
        }
        
        byte[] donorHashBytes;
        try {
            donorHashBytes = Numeric.hexStringToByteArray(cleanHash);
        } catch (Exception e) {
            donorHashBytes = cleanHash.getBytes();
        }
        
        byte[] padded = new byte[32];
        System.arraycopy(donorHashBytes, 0, padded, 0, Math.min(donorHashBytes.length, 32));

        final Function function = new Function(
                "recordDonation", 
                Arrays.<Type>asList(
                    new Bytes32(padded), 
                    new Uint256(amount), 
                    new Utf8String(category), 
                    new Utf8String(orderId), 
                    new Uint256(timestamp)
                ), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    /**
     * Records a new fund allocation on the blockchain.
     * ✅ NEW METHOD added for architectural expansion.
     */
    public RemoteFunctionCall<TransactionReceipt> allocateFunds(
            BigInteger allocationId, String beneficiary, BigInteger amount, BigInteger timestamp) {
        
        final Function function = new Function(
                "allocateFunds", 
                Arrays.<Type>asList(
                    new Uint256(allocationId), 
                    new Utf8String(beneficiary), 
                    new Uint256(amount), 
                    new Uint256(timestamp)
                ), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<DonationDetails> getDonation(String orderId) {
        final Function function = new Function("getDonation", 
                Arrays.<Type>asList(new Utf8String(orderId)), 
                Arrays.<TypeReference<?>>asList(
                    new TypeReference<Bytes32>() {}, 
                    new TypeReference<Uint256>() {}, 
                    new TypeReference<Utf8String>() {}, 
                    new TypeReference<Uint256>() {}
                ));
        return new RemoteFunctionCall<>(function,
                () -> {
                    List<Type> results = executeCallMultipleValueReturn(function);
                    return new DonationDetails(
                            Numeric.toHexString((byte[]) results.get(0).getValue()),
                            (BigInteger) results.get(1).getValue(),
                            (String) results.get(2).getValue(),
                            (BigInteger) results.get(3).getValue()
                    );
                });
    }

    /**
     * Retrieves allocation details from blockchain.
     */
    public RemoteFunctionCall<AllocationDetails> allocations(BigInteger allocationId) {
        final Function function = new Function("allocations", 
                Arrays.<Type>asList(new Uint256(allocationId)), 
                Arrays.<TypeReference<?>>asList(
                    new TypeReference<Utf8String>() {}, 
                    new TypeReference<Uint256>() {}, 
                    new TypeReference<Uint256>() {}
                ));
        return new RemoteFunctionCall<>(function,
                () -> {
                    List<Type> results = executeCallMultipleValueReturn(function);
                    return new AllocationDetails(
                            (String) results.get(0).getValue(),
                            (BigInteger) results.get(1).getValue(),
                            (BigInteger) results.get(2).getValue()
                    );
                });
    }

    public RemoteFunctionCall<Boolean> donationExists(String orderId) {
        final Function function = new Function("donationExists", 
                Arrays.<Type>asList(new Utf8String(orderId)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<BigInteger> getTotalDonations() {
        final Function function = new Function("getTotalDonations", 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public static DonationTransparency load(
            String contractAddress, 
            Web3j web3j, 
            Credentials credentials, 
            ContractGasProvider gasProvider) {
        return new DonationTransparency(contractAddress, web3j, credentials, gasProvider);
    }

    /**
     * DTO for Donation details.
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
    }

    /**
     * DTO for Allocation details.
     */
    public static class AllocationDetails {
        private final String beneficiary;
        private final BigInteger amount;
        private final BigInteger timestamp;

        public AllocationDetails(String beneficiary, BigInteger amount, BigInteger timestamp) {
            this.beneficiary = beneficiary;
            this.amount = amount;
            this.timestamp = timestamp;
        }

        public String getBeneficiary() { return beneficiary; }
        public BigInteger getAmount() { return amount; }
        public BigInteger getTimestamp() { return timestamp; }
    }
}
