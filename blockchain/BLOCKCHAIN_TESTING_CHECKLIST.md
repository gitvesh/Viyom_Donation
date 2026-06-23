# 🔧 Blockchain Module Testing Checklist

## ✅ **Configuration Status**

### **Current Configuration from .env.example**
```bash
PRIVATE_KEY=66020cf04d1c648bcd4d7251788f55a564260dab9e43144545c8b13a739df715
AMOY_RPC_URL=polygon-amoy.g.alchemy.com/v2/Ecooto5QXtLA10_XTBtIN
POLYGONSCAN_API_KEY=SBZXRR7QQUFP2V5FME7EDJN69C539M8U24
```

### **Backend Configuration Properties**
```properties
blockchain.rpc.url=
blockchain.private.key=
blockchain.contract.address=
blockchain.polygon.rpc.url=https://rpc-amoy.polygon.technology
blockchain.polygon.chain.id=80002
```

---

## 🔍 **Missing Configurations**

### **❌ Critical Missing Items**
1. **Contract Address** - Deployed smart contract address not set
2. **RPC URL** - Using default instead of Alchemy URL
3. **Private Key Format** - Need to remove 0x prefix for Web3j

### **⚠️ Configuration Mismatches**
| Source | Property | Value | Status |
|--------|----------|-------|--------|
| `.env.example` | `PRIVATE_KEY` | `0x601485...` | ❌ Has 0x prefix |
| `application.properties` | `blockchain.rpc.url` | Empty | ❌ Not using Alchemy URL |
| `.env.example` | `AMOY_RPC_URL` | Alchemy URL | ⚠️ Not mapped to backend |

---

## 🔧 **Required Configuration Updates**

### **1. Update application.properties**
```properties
# Blockchain Configuration - Use Alchemy RPC
blockchain.rpc.url=https://polygon-amoy.g.alchemy.com/v2/Ecooto5QXtLA10_XTBtIN
blockchain.private.key=601485FdABC06C7aE51C7B4dea982512771D0a26
blockchain.contract.address=YOUR_DEPLOYED_CONTRACT_ADDRESS
blockchain.polygon.chain.id=80002
blockchain.gas.price=20000000000
blockchain.gas.limit=6000000
```

### **2. Environment Variables for Production**
```bash
export BLOCKCHAIN_RPC_URL="https://polygon-amoy.g.alchemy.com/v2/Ecooto5QXtLA10_XTBtIN"
export BLOCKCHAIN_PRIVATE_KEY="601485FdABC06C7aE51C7B4dea982512771D0a26"
export BLOCKCHAIN_CONTRACT_ADDRESS="0x1234567890abcdef1234567890abcdef12345678"
```

---

## 🧪 **Testing Plan**

### **Phase 1: Configuration Testing**
- [ ] Verify blockchain configuration loading
- [ ] Test Web3j connection to Alchemy RPC
- [ ] Validate private key format
- [ ] Check contract address format

### **Phase 2: Smart Contract Testing**
- [ ] Load deployed contract
- [ ] Test contract connection
- [ ] Verify contract ABI loading
- [ ] Test read methods (getDonation)

### **Phase 3: Integration Testing**
- [ ] Test donation recording on blockchain
- [ ] Verify transaction hash generation
- [ ] Test blockchain failure handling
- [ ] Verify retry mechanism

### **Phase 4: End-to-End Testing**
- [ ] Test complete donation flow
- [ ] Verify blockchain verification URLs
- [ ] Test donation history API
- [ ] Check frontend integration

---

## 🚀 **Quick Start Testing**

### **Step 1: Update Configuration**
```bash
# Copy .env.example to .env
cp blockchain/.env.example blockchain/.env

# Update application.properties with actual values
```

### **Step 2: Start Application**
```bash
cd backend
mvn spring-boot:run
```

### **Step 3: Check Startup Logs**
```bash
# Look for these log messages:
✅ Blockchain configuration validated
📡 RPC URL: https://polygon-amoy.g.alchemy.com/v2/...
📄 Contract: 0x1234567890abcdef1234567890abcdef12345678
🔐 Wallet: Configured
```

### **Step 4: Test Blockchain Connection**
```bash
# Test endpoint
curl http://localhost:8080/viyom/api/blockchain/status

# Expected response:
{
  "connected": true,
  "network": "80002",
  "contractLoaded": true,
  "walletConnected": true
}
```

---

## 🧪 **Test Scripts**

### **Configuration Test Script**
```bash
#!/bin/bash
echo "🔍 Testing Blockchain Configuration..."

# Test 1: Check if application starts
echo "1. Starting application..."
mvn spring-boot:run &
APP_PID=$!
sleep 10

# Test 2: Check blockchain status
echo "2. Checking blockchain status..."
curl -s http://localhost:8080/viyom/api/blockchain/status | jq .

# Test 3: Check configuration validation
echo "3. Checking configuration validation..."
curl -s http://localhost:8080/viyom/actuator/health | jq .

# Cleanup
kill $APP_PID
echo "✅ Configuration test completed"
```

### **Integration Test Script**
```bash
#!/bin/bash
echo "🧪 Running Blockchain Integration Tests..."

# Test 1: User registration and login
echo "1. Testing user authentication..."
TOKEN=$(curl -s -X POST http://localhost:8080/viyom/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' | jq -r '.token')

# Test 2: Create donation order
echo "2. Creating donation order..."
ORDER_RESPONSE=$(curl -s -X POST http://localhost:8080/viyom/api/donations/create-order \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"poolId":1}')

ORDER_ID=$(echo $ORDER_RESPONSE | jq -r '.razorpayOrderId')

# Test 3: Verify payment (mock)
echo "3. Verifying payment..."
VERIFY_RESPONSE=$(curl -s -X POST http://localhost:8080/viyom/api/donations/verify-payment \
  -H "Content-Type: application/json" \
  -d '{"razorpayOrderId":"'$ORDER_ID'","razorpayPaymentId":"pay_test123","razorpaySignature":"test_signature"}')

DONATION_ID=$(echo $VERIFY_RESPONSE | jq -r '.donationId')

# Test 4: Check donation history
echo "4. Checking donation history..."
curl -s -X GET http://localhost:8080/viyom/api/donations/history \
  -H "Authorization: Bearer $TOKEN" | jq .

echo "✅ Integration tests completed"
```

---

## 🔧 **Manual Testing Steps**

### **1. Configuration Validation**
```bash
# Start the application and check logs
mvn spring-boot:run

# Look for these specific logs:
🔍 Validating blockchain configuration...
✅ RPC URL configured: https://polygon-amoy.g.alchemy.com/v2/...
✅ Chain ID configured: 80002
✅ Contract address configured: 0x1234567890abcdef1234567890abcdef12345678
✅ Private key configured (wallet mode enabled)
🎉 Blockchain configuration validation passed
```

### **2. Blockchain Connection Test**
```java
// Test in BlockchainIntegrationExample.java
@Test
void testBlockchainConnection() {
    Web3j web3j = blockchainConfig.web3j();
    assertNotNull(web3j);
    
    // Test connection
    try {
        BigInteger blockNumber = web3j.ethBlockNumber().send().getBlockNumber();
        assertTrue(blockNumber.longValue() > 0);
        log.info("✅ Blockchain connection successful. Latest block: {}", blockNumber);
    } catch (Exception e) {
        fail("❌ Blockchain connection failed: " + e.getMessage());
    }
}
```

### **3. Contract Loading Test**
```java
@Test
void testContractLoading() {
    DonationTransparency contract = blockchainConfig.donationTransparency();
    assertNotNull(contract);
    
    try {
        // Test contract call
        String result = contract.getDonation(BigInteger.ONE).send();
        log.info("✅ Contract loaded successfully. Test call result: {}", result);
    } catch (Exception e) {
        fail("❌ Contract loading failed: " + e.getMessage());
    }
}
```

---

## 📊 **Test Results Checklist**

### **Configuration Tests**
- [ ] Application starts without errors
- [ ] Blockchain configuration validated
- [ ] Web3j connection established
- [ ] Private key loaded correctly
- [ ] Contract address format valid

### **Blockchain Tests**
- [ ] RPC connection successful
- [ ] Chain ID matches (80002)
- [ ] Contract loads successfully
- [ ] Read methods work
- [ ] Gas provider configured

### **Integration Tests**
- [ ] Donation recording works
- [ ] Transaction hash generated
- [ ] Failure handling works
- [ ] Retry mechanism functions
- [ ] API endpoints respond correctly

---

## 🚨 **Troubleshooting Guide**

### **Common Issues**

#### **1. Private Key Format Error**
```
❌ Invalid private key format
```
**Solution**: Remove 0x prefix from private key
```bash
# Wrong
PRIVATE_KEY=0x601485FdABC06C7aE51C7B4dea982512771D0a26

# Correct
PRIVATE_KEY=601485FdABC06C7aE51C7B4dea982512771D0a26
```

#### **2. RPC Connection Error**
```
❌ Blockchain RPC connection failed
```
**Solution**: Check RPC URL and network connectivity
```bash
# Test RPC URL
curl -X POST https://polygon-amoy.g.alchemy.com/v2/Ecooto5QXtLA10_XTBtIN \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

#### **3. Contract Not Found**
```
❌ Contract address not configured
```
**Solution**: Deploy contract and update configuration
```bash
# Deploy contract first, then update
blockchain.contract.address=0x1234567890abcdef1234567890abcdef12345678
```

---

## 🎯 **Next Steps**

### **Immediate Actions**
1. **Deploy smart contract** to Polygon Amoy testnet
2. **Update application.properties** with contract address
3. **Fix private key format** (remove 0x prefix)
4. **Update RPC URL** to use Alchemy endpoint

### **Testing Priority**
1. **Configuration validation** (highest)
2. **Blockchain connection** (high)
3. **Contract interaction** (medium)
4. **End-to-end flow** (medium)

### **Success Criteria**
- ✅ Application starts without blockchain errors
- ✅ Can connect to Polygon Amoy testnet
- ✅ Contract loads and responds to calls
- ✅ Donation recording works end-to-end

---

**🚀 Ready to start testing once configuration is updated!**
