# 📦 Web3j CLI Setup Guide

## 🛠️ Required Tools Installation

### Option 1: Using Web3j CLI (Recommended)

#### Prerequisites
- Java 8 or higher
- Node.js 12 or higher
- Git

#### Installation Steps

1. **Install Web3j CLI via npm**
   ```bash
   npm install -g web3j-cli
   ```

2. **Verify Installation**
   ```bash
   web3j version
   ```

3. **Generate Contract Wrapper**
   ```bash
   # Navigate to blockchain directory
   cd blockchain
   
   # Compile contract first
   npx hardhat compile
   
   # Generate Java wrapper
   web3j generate solidity \
     -a artifacts/contracts/DonationTransparency.sol/DonationTransparency.json \
     -o ../backend/src/main/java/viyom/donation/viyom/blockchain/contract \
     -p viyom.donation.viyom.blockchain.contract
   ```

### Option 2: Using Web3j Maven Plugin

#### Add to pom.xml
```xml
<plugin>
    <groupId>org.web3j</groupId>
    <artifactId>web3j-maven-plugin</artifactId>
    <version>4.10.0</version>
    <configuration>
        <packageName>viyom.donation.viyom.blockchain.contract</packageName>
        <outputDirectory>${project.basedir}/src/main/java</outputDirectory>
        <soliditySourceFiles>
            <soliditySourceFile>../blockchain/artifacts/contracts/DonationTransparency.sol/DonationTransparency.json</soliditySourceFile>
        </soliditySourceFiles>
    </configuration>
</plugin>
```

#### Run Maven Plugin
```bash
mvn web3j:generate-sources
```

### Option 3: Manual Wrapper (Current Implementation)

The provided `DonationTransparency.java` is a manually created wrapper that supports:

- ✅ `recordDonation()` - Record new donation
- ✅ `getDonation()` - Retrieve donation details
- ✅ `donationExists()` - Check if donation exists
- ✅ `getTotalDonations()` - Get total count
- ✅ Event handling for `DonationRecorded`

## 🔧 Integration Steps

### 1. After Contract Deployment
```bash
# Deploy contract
npx hardhat run scripts/deploy.js --network amoy

# This will create:
# - Contract ABI in artifacts/
# - Contract address saved to backend/resources
```

### 2. Generate Java Wrapper
```bash
# Using Web3j CLI
web3j generate solidity \
  -a artifacts/contracts/DonationTransparency.sol/DonationTransparency.json \
  -o ../backend/src/main/java/viyom/donation/viyom/blockchain/contract \
  -p viyom.donation.viyom.blockchain.contract
```

### 3. Update Backend Configuration
Add to `application.properties`:
```properties
# Blockchain Configuration
blockchain.polygon.rpc.url=https://rpc-amoy.polygon.technology
blockchain.polygon.chain.id=80002
blockchain.contract.address=YOUR_DEPLOYED_CONTRACT_ADDRESS
blockchain.private.key=YOUR_PRIVATE_KEY
```

## 📋 Generated Files Structure

After Web3j generation, you'll have:
```
src/main/java/viyom/donation/viyom/blockchain/contract/
├── DonationTransparency.java           # Main contract wrapper
├── DonationTransparency_deploy.java     # Deployment utilities
├── DonationTransparency_events.java      # Event handling
└── DonationTransparency_functions.java  # Function definitions
```

## 🚀 Usage Example

### Backend Integration
```java
@Service
public class BlockchainService {
    
    private final DonationTransparency contract;
    private final Web3j web3j;
    private final Credentials credentials;
    
    public BlockchainService() {
        this.web3j = BlockchainUtils.createWeb3j(rpcUrl);
        this.credentials = BlockchainUtils.createCredentials(privateKey);
        this.contract = DonationTransparency.load(
            contractAddress, 
            web3j, 
            credentials, 
            BlockchainUtils.createGasProvider()
        );
    }
    
    public CompletableFuture<String> recordDonation(
            Long donationId, 
            BigDecimal amount, 
            String donorEmail) {
        
        return CompletableFuture.supplyAsync(() -> {
            try {
                String orderId = "DONATION_" + donationId;
                String donorHash = BlockchainUtils.generateDonorHash(donorEmail);
                BigInteger amountWei = BlockchainUtils.ethToWei(amount);
                BigInteger timestamp = BlockchainUtils.getCurrentTimestamp();
                
                TransactionReceipt receipt = contract.recordDonation(
                    donorHash, 
                    amountWei, 
                    "Donation", 
                    orderId, 
                    timestamp
                ).send();
                
                return receipt.getTransactionHash();
                
            } catch (Exception e) {
                throw new RuntimeException("Failed to record donation on blockchain", e);
            }
        });
    }
    
    public DonationDetails getDonation(String orderId) {
        try {
            return contract.getDonation(orderId).send();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get donation from blockchain", e);
        }
    }
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Web3j CLI not found**
   ```bash
   # Try installing with sudo
   sudo npm install -g web3j-cli
   
   # Or use npx
   npx web3j generate solidity ...
   ```

2. **ABI not found**
   ```bash
   # Ensure contract is compiled
   npx hardhat compile
   
   # Check ABI location
   ls artifacts/contracts/DonationTransparency.sol/
   ```

3. **Package structure issues**
   ```bash
   # Create package directory first
   mkdir -p ../backend/src/main/java/viyom/donation/viyom/blockchain/contract
   ```

### Alternative: Use Manual Wrapper

If Web3j CLI fails, the provided manual wrapper supports:
- All required functions
- Type safety
- Event handling
- Gas management
- Error handling

## 📚 Additional Resources

- [Web3j Documentation](https://docs.web3j.io/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Polygon Documentation](https://docs.polygon.technology/)

---

**Ready for Java blockchain integration!** 🎉
