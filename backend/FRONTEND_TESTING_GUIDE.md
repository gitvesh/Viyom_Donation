# 🧪 Complete Application Testing Guide

## ✅ **Current Status**

### **Backend Issues**
- ❌ **Compilation Errors**: Web3j compatibility issues
- ❌ **Entity Dependencies**: Missing entity methods
- ❌ **Test Dependencies**: Missing test imports

### **Working Components**
- ✅ **Blockchain Configuration**: RPC connection works
- ✅ **Polygon Amoy**: Chain ID verification works
- ✅ **Donation Flow**: Simulation works
- ✅ **Frontend**: Ready for testing

---

## 🚀 **Testing Strategy**

Since the backend has compilation issues, we'll test the application using:
1. **Frontend Testing** - Test UI and API calls
2. **Manual API Testing** - Test core functionality
3. **Blockchain Testing** - Test blockchain components separately
4. **Integration Testing** - Test end-to-end flow

---

## 🌐 **Frontend Testing**

### **Step 1: Start Frontend**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if needed)
npm install

# Start development server
npm start
```

### **Step 2: Test Frontend Components**
Open `http://localhost:3000` in your browser and test:

#### **1. Landing Page**
- ✅ Page loads correctly
- ✅ Navigation works
- ✅ Features are displayed

#### **2. User Registration**
- ✅ Registration form works
- ✅ Email validation works
- ✅ Password validation works

#### **3. User Login**
- ✅ Login form works
- ✅ JWT token generation
- ✅ User dashboard access

#### **4. Donation Flow**
- ✅ Donation pools display
- ✅ Amount selection works
- ✅ Payment integration (Razorpay)

---

## 📡 **API Testing**

### **Step 1: Test Core APIs**
Use Postman or curl to test APIs:

#### **1. Health Check**
```bash
curl -X GET http://localhost:8080/viyom/actuator/health
```

#### **2. User Registration**
```bash
curl -X POST http://localhost:8080/viyom/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

#### **3. User Login**
```bash
curl -X POST http://localhost:8080/viyom/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### **4. Get Donation Pools**
```bash
curl -X GET http://localhost:8080/viyom/api/pools \
  -H "Authorization: Bearer <token>"
```

---

## 🔗 **Blockchain Testing**

### **Step 1: Test Blockchain Connection**
```bash
# Run blockchain test
cd blockchain
node simple-test.js
```

### **Step 2: Test Donation Flow**
```bash
# Run manual donation test
cd blockchain
node simple-test.js manual
```

### **Step 3: Test PolygonScan Integration**
```bash
# Open the HTML test
open blockchain/test-donation.html
```

---

## 🧪 **Complete End-to-End Test**

### **Test Scenario: Complete Donation Flow**

#### **1. User Registration**
```bash
# Expected Response
{
  "status": "SUCCESS",
  "message": "User registered successfully",
  "token": "jwt_token_here"
}
```

#### **2. User Login**
```bash
# Expected Response
{
  "status": "SUCCESS",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "fullName": "Test User"
  }
}
```

#### **3. Create Donation Order**
```bash
curl -X POST http://localhost:8080/viyom/api/donations/create-order \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "poolId": 1
  }'
```

#### **4. Mock Payment Verification**
```bash
curl -X POST http://localhost:8080/viyom/api/donations/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpayOrderId": "order_test123",
    "razorpayPaymentId": "pay_test123",
    "razorpaySignature": "test_signature"
  }'
```

#### **5. Check Donation History**
```bash
curl -X GET http://localhost:8080/viyom/api/donations/history \
  -H "Authorization: Bearer <token>"
```

---

## 📊 **Expected Results**

### **Success Indicators**
- ✅ **Frontend**: UI loads and works correctly
- ✅ **Authentication**: Users can register and login
- ✅ **Donation Flow**: Orders created successfully
- ✅ **Blockchain**: RPC connection and PolygonAmoy work
- ✅ **PolygonScan**: URLs generated correctly

### **Error Handling**
- ⚠️ **Backend Errors**: Compilation issues (known)
- ⚠️ **Blockchain**: Contract not deployed (expected)
- ⚠️ **Payment**: Razorpay integration (needs API keys)

---

## 🔧 **Troubleshooting Guide**

### **Backend Issues**
```bash
# Check if backend is running
curl http://localhost:8080/viyom/actuator/health

# Check logs
tail -f logs/application.log

# Check database connection
curl http://localhost:8080/viyom/api/pools
```

### **Frontend Issues**
```bash
# Check if frontend is running
curl http://localhost:3000

# Check console errors
# Open browser developer tools
```

### **Blockchain Issues**
```bash
# Test RPC connection
cd blockchain
node simple-test.js rpc

# Test wallet setup
node simple-test.js wallet
```

---

## 📋 **Testing Checklist**

### **Frontend Tests**
- [ ] Landing page loads
- [ ] Navigation works
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads
- [ ] Donation pools display
- [ ] Payment flow works

### **Backend Tests**
- [ ] Health check endpoint
- [ ] User registration API
- [ ] User login API
- [ ] Donation pool API
- [ ] Payment order API
- [ ] Payment verification API
- [ ] Donation history API

### **Blockchain Tests**
- [ ] RPC connection to Polygon Amoy
- [ ] Chain ID verification
- [ ] Private key format
- [ ] Donation flow simulation
- [ ] PolygonScan URL generation

---

## 🎯 **Success Metrics**

### **Minimum Success**
- ✅ Frontend runs and displays correctly
- ✅ User can register and login
- ✅ Donation order creation works
- ✅ Blockchain RPC connection works

### **Full Success**
- ✅ All frontend features work
- ✅ All backend APIs work
- ✅ Complete donation flow works
- ✅ Blockchain integration works
- ✅ PolygonScan verification works

---

## 📱 **Manual Testing Steps**

### **1. Frontend Testing**
1. Open `http://localhost:3000`
2. Register a new user
3. Login with the new user
4. Navigate to donation page
5. Select a donation pool
6. Enter donation amount
7. Complete payment flow

### **2. Backend Testing**
1. Use Postman or curl
2. Test each API endpoint
3. Verify responses
4. Check error handling

### **3. Blockchain Testing**
1. Run `node simple-test.js`
2. Verify RPC connection
3. Test donation flow
4. Check PolygonScan URLs

---

## 🚀 **Next Steps**

### **Immediate Actions**
1. **Start frontend** for UI testing
2. **Run blockchain tests** for verification
3. **Test core APIs** manually
4. **Document results**

### **Future Actions**
1. **Fix backend compilation** issues
2. **Deploy smart contract** to Polygon Amoy
3. **Complete blockchain integration**
4. **Add comprehensive tests**

---

## 📈 **Current Status Summary**

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend | ✅ Ready | Can be tested independently |
| Backend | ⚠️ Issues | Compilation errors need fixing |
| Database | ❌ Unknown | Depends on backend |
| Blockchain | ✅ Ready | RPC connection works |
| Payment | ⚠️ Partial | Razorpay integration needs keys |
| Smart Contract | ❌ Not Deployed | Needs deployment |

---

**🎉 Ready to test frontend and blockchain components!**

The frontend is ready for testing, and the blockchain components work independently. Start with the frontend testing to verify the UI and user flow, then test the blockchain components to verify the integration.
