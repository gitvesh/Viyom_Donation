# 🔗 Viyom Blockchain Module

## 📋 Overview

Modular blockchain integration for Viyom donation transparency system using Polygon Amoy testnet. Provides secure, privacy-protected donation recording and verification.

## 🏗️ Architecture

```
com.viyom.blockchain/
├── config/
│   └── BlockchainConfig.java      # Spring configuration & beans
├── service/
│   └── BlockchainService.java      # Main blockchain service
├── contract/
│   └── DonationTransparency.java    # Smart contract wrapper
└── util/
    └── HashUtil.java             # Hash generation utilities
```

## 🔧 Configuration

### Application Properties
```properties
# Blockchain Configuration
blockchain.polygon.rpc.url=https://rpc-amoy.polygon.technology
blockchain.polygon.chain.id=80002
blockchain.contract.address=YOUR_CONTRACT_ADDRESS
blockchain.private.key=YOUR_PRIVATE_KEY
blockchain.gas.price=20000000000
blockchain.gas.limit=6000000
```

### Environment Variables
```bash
export BLOCKCHAIN_CONTRACT_ADDRESS=0x...
export BLOCKCHAIN_PRIVATE_KEY=your_private_key
```

## 🚀 Services

### BlockchainService

**Primary service for blockchain operations:**

- **recordDonationTransaction()** - Record donation on blockchain
- **recordFundAllocationTransaction()** - Record fund allocation
- **getDonationDetails()** - Retrieve donation details
- **verifyTransaction()** - Verify transaction status
- **getTotalDonations()** - Get total donation count
- **donationExists()** - Check donation existence
- **getBlockchainStatus()** - Connection status

### HashUtil

**Privacy protection utilities:**

- **generateDonorHash()** - SHA256 donor hash
- **generateConsistentDonorHash()** - Consistent donor hash
- **generateKeccak256Hash()** - Web3j compatible hash
- **generateOrderIdHash()** - Order ID hash
- **generateTransactionReference()** - Unique transaction reference

### DonationTransparency

**Smart contract wrapper:**

- **recordDonation()** - Contract interaction
- **getDonation()** - Data retrieval
- **donationExists()** - Existence check
- **getTotalDonations()** - Statistics

## 🔌 Dependency Injection

### Spring Configuration
```java
@Configuration
public class BlockchainConfig {
    @Bean
    public Web3j web3j() { ... }
    
    @Bean
    public Credentials credentials() { ... }
    
    @Bean
    public DefaultGasProvider gasProvider() { ... }
}
```

### Service Injection
```java
@Service
public class BlockchainService {
    private final Web3j web3j;
    private final Credentials credentials;
    private final DonationTransparency contract;
    
    public BlockchainService(Web3j web3j, Credentials credentials, ...) {
        // Constructor injection
    }
}
```

## 🔄 Integration Examples

### Donation Recording
```java
@Service
public class DonationService {
    
    @Autowired
    private BlockchainService blockchainService;
    
    public void recordDonation(Donation donation) {
        blockchainService.recordDonationTransaction(
            donation.getId(),
            donation.getAmount(),
            donation.getDonor().getEmail()
        ).thenAccept(txHash -> {
            donation.setBlockchainTxHash(txHash);
            donationRepository.save(donation);
        });
    }
}
```

### Transaction Verification
```java
@RestController
public class BlockchainController {
    
    @Autowired
    private BlockchainService blockchainService;
    
    @GetMapping("/blockchain/verify/{txHash}")
    public CompletableFuture<Boolean> verifyTransaction(@PathVariable String txHash) {
        return blockchainService.verifyTransaction(txHash);
    }
}
```

## 🔒 Security Features

### Privacy Protection
- **Donor hashing** with SHA256
- **Consistent hashing** for same donor
- **Salt generation** for uniqueness
- **Contact detail protection** for beneficiaries

### Transaction Security
- **Private key management** via Spring config
- **Gas optimization** for Polygon Amoy
- **Transaction retries** with timeout
- **Error handling** with logging

## 📊 Monitoring & Logging

### Log Levels
```properties
logging.level.viyom.donation.viyom.blockchain=INFO
```

### Status Monitoring
```java
blockchainService.getBlockchainStatus()
    .thenAccept(status -> {
        log.info("Blockchain connected: {}", status.isConnected());
        log.info("Current block: {}", status.getCurrentBlock());
    });
```

## 🧪 Testing

### Unit Tests
```java
@ExtendWith(MockitoExtension.class)
class BlockchainServiceTest {
    
    @Mock
    private Web3j web3j;
    
    @Mock
    private DonationTransparency contract;
    
    @InjectMocks
    private BlockchainService blockchainService;
    
    @Test
    void shouldRecordDonation() {
        // Test implementation
    }
}
```

### Integration Tests
```java
@SpringBootTest
@TestPropertySource(properties = {
    "blockchain.polygon.rpc.url=https://rpc-amoy.polygon.technology",
    "blockchain.contract.address=TEST_CONTRACT"
})
class BlockchainIntegrationTest {
    
    @Test
    void shouldConnectToBlockchain() {
        // Integration test
    }
}
```

## 🚀 Deployment

### Contract Deployment
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network amoy
```

### Backend Configuration
1. Update `application.properties` with deployed contract address
2. Set private key environment variable
3. Restart Spring Boot application

### Verification
```bash
curl http://localhost:8080/viyom/api/blockchain/status
```

## 📈 Performance

### Gas Optimization
- **20 gwei** gas price for Polygon Amoy
- **6M gas limit** for complex transactions
- **Batch operations** for multiple records
- **Async processing** to avoid blocking

### Connection Pooling
- **HTTP connection reuse**
- **Timeout management**
- **Retry mechanisms**
- **Circuit breaker** pattern

## 🔧 Troubleshooting

### Common Issues

1. **Connection Failed**
   ```bash
   # Check RPC URL
   curl -X POST https://rpc-amoy.polygon.technology \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   ```

2. **Contract Not Found**
   ```bash
   # Verify contract address
   npx hardhat run scripts/verify-contract.js --network amoy
   ```

3. **Transaction Failed**
   ```bash
   # Check gas price
   curl https://api.polygonscan.com/api?module=gastracker&action=gasoracle
   ```

### Debug Mode
```properties
blockchain.debug=true
logging.level.viyom.donation.viyom.blockchain=DEBUG
```

## 📚 Dependencies

### Maven
```xml
<dependency>
    <groupId>org.web3j</groupId>
    <artifactId>core</artifactId>
    <version>4.10.0</version>
</dependency>
<dependency>
    <groupId>org.web3j</groupId>
    <artifactId>geth</artifactId>
    <version>4.10.0</version>
</dependency>
```

### Spring Boot Starter
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

---

**🎉 Blockchain module ready for transparent donation tracking!**
