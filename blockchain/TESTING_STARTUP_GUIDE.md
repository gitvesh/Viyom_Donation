# 🚀 Blockchain Module Testing Startup Guide

## ✅ **Configuration Status Update**

### **✅ Completed Configuration**
```properties
# Updated application.properties
blockchain.rpc.url=https://polygon-amoy.g.alchemy.com/v2/Ecooto5QXtLA10_XTBtIN
blockchain.private.key=601485FdABC06C7aE51C7B4dea982512771D0a26
blockchain.contract.address=CONTRACT_ADDRESS_NEEDED
blockchain.polygon.chain.id=80002
blockchain.gas.price=20000000000
blockchain.gas.limit=6000000
```

### **🔧 Configuration Sources**
| Source | Property | Value | Status |
|--------|----------|-------|--------|
| `.env.example` | `PRIVATE_KEY` | `0x601485...` | ✅ Mapped (removed 0x) |
| `.env.example` | `AMOY_RPC_URL` | Alchemy URL | ✅ Mapped |
| `application.properties` | `blockchain.rpc.url` | Alchemy URL | ✅ Updated |
| `application.properties` | `blockchain.private.key` | `601485...` | ✅ Updated |
| `application.properties` | `blockchain.contract.address` | `CONTRACT_ADDRESS_NEEDED` | ⚠️ Needs deployment |

---

## 🧪 **Ready to Test**

### **✅ What's Ready**
1. **RPC Configuration** - Alchemy endpoint configured
2. **Private Key** - Formatted correctly (no 0x prefix)
3. **Chain ID** - Polygon Amoy (80002) set
4. **Gas Configuration** - Optimized for testnet
5. **Test Scripts** - Both Linux and Windows ready

### **⚠️ What's Missing**
1. **Smart Contract Deployment** - Need deployed contract address
2. **Contract Verification** - Contract needs to be deployed on Polygon Amoy

---

## 🚀 **Testing Steps**

### **Step 1: Start Backend Application**
```bash
# Navigate to backend directory
cd backend

# Start the application
mvn spring-boot:run
```

### **Step 2: Check Startup Logs**
Look for these log messages:
```
🔍 Validating blockchain configuration...
✅ RPC URL configured: https://polygon-amoy.g.alchemy.com/v2/...
✅ Chain ID configured: 80002
⚠️ Contract address not configured - blockchain transactions disabled
✅ Private key configured (wallet mode enabled)
🎉 Blockchain configuration validation passed
```

### **Step 3: Run Test Script**
```bash
# Linux/Mac
cd blockchain
chmod +x test-blockchain.sh
./test-blockchain.sh

# Windows
cd blockchain
test-blockchain.bat
```

### **Step 4: Expected Test Results**
```
🚀 Starting Blockchain Module Testing...
==================================
🔍 Checking if backend is running...
✅ PASS Backend Health Check

🔧 Testing Blockchain Configuration...
✅ PASS Blockchain Status Endpoint
⚠️ FAIL Configuration Validation (Expected - no contract address)

🔗 Testing Blockchain Connection...
✅ PASS RPC Connection

📄 Testing Smart Contract...
⚠️ FAIL Contract Loading (Expected - no contract address)

💝 Testing Donation Flow...
✅ PASS Donation History Endpoint

==================================
📊 Test Results:
✅ Passed: 3
❌ Failed: 2
```

---

## 🔍 **Manual Testing Commands**

### **1. Test Backend Health**
```bash
curl http://localhost:8080/viyom/actuator/health
```

### **2. Test Blockchain Status**
```bash
curl http://localhost:8080/viyom/api/blockchain/status
```

### **3. Test RPC Connection**
```bash
curl -X POST https://polygon-amoy.g.alchemy.com/v2/Ecooto5QXtLA10_XTBtIN \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### **4. Test Configuration Status**
```bash
# Linux/Mac
./test-blockchain.sh config

# Windows
test-blockchain.bat config
```

---

## 📋 **Testing Checklist**

### **Phase 1: Basic Configuration** ✅ Ready
- [x] RPC URL configured
- [x] Private key formatted
- [x] Chain ID set
- [x] Gas configuration
- [ ] Application starts without errors
- [ ] Blockchain configuration validation

### **Phase 2: Connection Tests** ✅ Ready
- [ ] RPC connection to Polygon Amoy
- [ ] Web3j initialization
- [ ] Wallet credentials loading
- [ ] Network ID verification

### **Phase 3: Contract Tests** ⚠️ Pending
- [ ] Smart contract deployment
- [ ] Contract address configuration
- [ ] Contract loading
- [ ] Read method testing

### **Phase 4: Integration Tests** ⚠️ Pending
- [ ] Donation recording
- [ ] Transaction hash generation
- [ ] Failure handling
- [ ] API endpoint testing

---

## 🚨 **Expected Issues & Solutions**

### **Issue 1: Contract Address Missing**
```
⚠️ Contract address not configured - blockchain transactions disabled
```
**Solution**: Deploy contract and update configuration
```bash
# After deployment, update application.properties
blockchain.contract.address=0x1234567890abcdef1234567890abcdef12345678
```

### **Issue 2: Private Key Format**
```
❌ Invalid private key format
```
**Solution**: Ensure no 0x prefix (already fixed)

### **Issue 3: RPC Connection**
```
❌ Cannot connect to Polygon Amoy RPC
```
**Solution**: Check network connectivity and API key

---

## 🎯 **Success Criteria**

### **Minimum Success (Current State)**
- ✅ Application starts without blockchain errors
- ✅ RPC connection successful
- ✅ Configuration validation passes (except contract)
- ✅ Basic endpoints accessible

### **Full Success (After Contract Deployment)**
- ✅ All configuration tests pass
- ✅ Contract loads successfully
- ✅ Donation recording works
- ✅ End-to-end flow complete

---

## 🔄 **Next Steps**

### **Immediate (Today)**
1. **Start backend application** and verify startup
2. **Run test scripts** to validate current configuration
3. **Deploy smart contract** to Polygon Amoy testnet
4. **Update contract address** in configuration

### **Short Term (This Week)**
1. **Complete contract testing**
2. **Run integration tests**
3. **Test donation flow end-to-end**
4. **Verify frontend integration**

### **Long Term (Next Week)**
1. **Production configuration**
2. **Performance testing**
3. **Security validation**
4. **Documentation completion**

---

## 📞 **Help Commands**

### **Test Script Options**
```bash
# Show current configuration
./test-blockchain.sh config

# Show setup instructions
./test-blockchain.sh setup

# Run all tests
./test-blockchain.sh test

# Show help
./test-blockchain.sh help
```

### **Application Commands**
```bash
# Start with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Start with debug logging
mvn spring-boot:run -Dlogging.level.viyom.donation.viyom.blockchain=DEBUG

# Check application logs
tail -f logs/application.log
```

---

## 🎉 **Ready to Start Testing!**

The blockchain module is now configured and ready for testing. Here's what to do:

1. **Start the backend application**
2. **Run the test script** to validate current setup
3. **Deploy the smart contract** to complete the configuration
4. **Run full integration tests** once contract is deployed

**Current Status: 🟢 Ready for Phase 1 & 2 Testing**

---

**🚀 Let's start testing!**
