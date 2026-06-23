# 🚀 Viyom Blockchain Environment

## 📋 Overview
Complete Hardhat-based blockchain development environment for Viyom donation transparency system on Polygon Amoy testnet.

## 🏗️ Project Structure
```
blockchain/
├── contracts/
│   └── DonationTransparency.sol     # Main smart contract
├── scripts/
│   ├── deploy.js               # Contract deployment script
│   └── interact.js            # Contract interaction utilities
├── hardhat.config.js            # Hardhat configuration
├── .env.example                 # Environment variables template
├── package.json                 # Node.js dependencies
└── README.md                   # This file
```

## 🛠️ Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- MetaMask or compatible wallet
- MATIC tokens for gas fees on Polygon Amoy

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your private key
   ```

3. **Environment Variables**
   ```env
   # Required
   PRIVATE_KEY=your_private_key_here_without_0x_prefix
   AMOY_RPC_URL=https://rpc-amoy.polygon.technology
   
   # Optional
   POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
   CONTRACT_ADDRESS=deployed_contract_address
   ```

## 🚀 Usage

### Compile Contract
```bash
npx hardhat compile
```

### Deploy Contract
```bash
npx hardhat run scripts/deploy.js --network amoy
```

### Interact with Contract
```bash
# Record a donation
npx hardhat run scripts/interact.js record ORDER123 0.1 Education

# Get donation details
npx hardhat run scripts/interact.js get ORDER123

# Get total donations
npx hardhat run scripts/interact.js total

# List donations by category
npx hardhat run scripts/interact.js list Education
```

## 🔧 Configuration

### Networks
- **amoy**: Polygon Amoy Testnet (Chain ID: 80002)
- **polygon**: Polygon Mainnet (Chain ID: 137)
- **hardhat**: Local Hardhat Network (Chain ID: 31337)

### Gas Settings
- **Amoy**: 20 gwei gas price, 6M gas limit
- **Polygon**: 30 gwei gas price, 6M gas limit

## 📊 Contract Features

### DonationTransparency.sol
- ✅ **Gas Optimized**: ~50,000 gas for recording
- ✅ **Event-Driven**: DonationRecorded events
- ✅ **Privacy-Protected**: Donor hashes instead of addresses
- ✅ **Batch Operations**: Efficient multiple record retrieval
- ✅ **Category Filtering**: By sector/type
- ✅ **Time-based Queries**: Date range filtering
- ✅ **Pagination Support**: Efficient data access

### Key Functions
- `recordDonation()` - Store new donation record
- `getDonation()` - Retrieve single donation
- `getTotalDonations()` - Get total count
- `getDonationsByCategory()` - Filter by category
- `getDonationsByTimeRange()` - Date range queries
- `getBatchDonations()` - Multiple record retrieval

## 🔍 Verification

### Polygonscan Integration
- Automatic contract verification on deployment
- Transaction links for all operations
- Gas usage tracking and optimization

### Security Features
- Input validation on all functions
- Duplicate prevention for order IDs
- Access control ready (owner modifier)
- EIP-165 interface support

## 🚨 Important Notes

### Security
- **NEVER** commit private keys to version control
- **ALWAYS** use `.env` file for secrets
- **TEST** on Amoy testnet before mainnet deployment

### Gas Optimization
- Contract optimized for low gas usage
- Batch operations recommended for multiple queries
- Monitor gas prices before transactions

### Integration
- Deployment script saves contract address to backend
- Backend integration ready with contract-address.json
- Event-based frontend updates supported

## 🌐 Network Details

### Polygon Amoy Testnet
- **RPC URL**: https://rpc-amoy.polygon.technology
- **Chain ID**: 80002
- **Explorer**: https://amoy.polygonscan.com
- **Faucet**: https://faucet.polygon.technology

### Polygon Mainnet
- **RPC URL**: https://polygon-rpc.com
- **Chain ID**: 137
- **Explorer**: https://polygonscan.com

## 📱 Frontend Integration

### Contract ABI
After deployment, the ABI will be available in:
```
artifacts/contracts/DonationTransparency.sol/DonationTransparency.json
```

### Integration Steps
1. Deploy contract and copy address to backend
2. Update backend configuration with contract address
3. Import ABI in frontend for contract interaction
4. Listen to DonationRecorded events for real-time updates

## 🔧 Development Commands

```bash
# Clean compilation artifacts
npx hardhat clean

# Run local Hardhat node
npx hardhat node

# Run tests
npx hardhat test

# Verify contract on Polygonscan
npx hardhat verify --network amoy <contract-address>
```

## 📈 Next Steps

1. **Deploy Contract**: Run deployment script
2. **Backend Integration**: Update backend with contract address
3. **Frontend Integration**: Add contract interaction
4. **Testing**: End-to-end donation flow testing
5. **Production**: Mainnet deployment and configuration

## 🤝 Support

For issues or questions:
1. Check Hardhat documentation
2. Review Polygon documentation
3. Test on Amoy testnet first
4. Monitor gas usage and optimize

---

**Ready for transparent donation tracking on Polygon!** 🎉
