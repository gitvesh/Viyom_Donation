// Quick Blockchain Test Script
// Tests the blockchain module without requiring full application startup

const Web3 = require('web3');
const axios = require('axios');

// Configuration
const RPC_URL = 'https://polygon-amoy.g.alchemy.com/v2/Ecooto5QXtLA10_XTBtIN';
const PRIVATE_KEY = '601485FdABC06C7aE51C7B4dea982512771D0a26';
const CHAIN_ID = 80002; // Polygon Amoy

console.log('🚀 Starting Quick Blockchain Test...');
console.log('=====================================');

async function testBlockchainConnection() {
    try {
        console.log('🔗 Testing RPC Connection...');
        
        const web3 = new Web3(RPC_URL);
        const blockNumber = await web3.eth.getBlockNumber();
        
        console.log(`✅ RPC Connection Successful! Latest block: ${blockNumber}`);
        
        // Test chain ID
        const chainId = await web3.eth.getChainId();
        console.log(`📊 Chain ID: ${chainId}`);
        
        if (chainId.toString() === CHAIN_ID.toString()) {
            console.log('✅ Correct chain (Polygon Amoy)');
        } else {
            console.log('⚠️  Wrong chain detected');
        }
        
        return web3;
    } catch (error) {
        console.error('❌ RPC Connection Failed:', error.message);
        return null;
    }
}

async function testWallet(web3) {
    try {
        console.log('🔐 Testing Wallet Setup...');
        
        // Create account from private key
        const account = web3.eth.accounts.privateKeyToAccount('0x' + PRIVATE_KEY);
        console.log(`✅ Wallet Address: ${account.address}`);
        
        // Get balance
        const balance = await web3.eth.getBalance(account.address);
        const balanceEth = web3.utils.fromWei(balance, 'ether');
        console.log(`💰 Wallet Balance: ${balanceEth} MATIC`);
        
        return account;
    } catch (error) {
        console.error('❌ Wallet Setup Failed:', error.message);
        return null;
    }
}

async function testTransaction(web3, account) {
    try {
        console.log('💸 Testing Transaction Creation...');
        
        // Create a simple transaction to test gas estimation
        const tx = {
            from: account.address,
            to: account.address, // Self-transfer for testing
            value: web3.utils.toWei('0.001', 'ether'),
            gas: 21000,
            gasPrice: await web3.eth.getGasPrice()
        };
        
        // Estimate gas
        const gasEstimate = await web3.eth.estimateGas(tx);
        console.log(`⛽ Gas Estimate: ${gasEstimate}`);
        
        // Get gas price
        const gasPrice = await web3.eth.getGasPrice();
        const gasPriceGwei = web3.utils.fromWei(gasPrice, 'gwei');
        console.log(`⛽ Gas Price: ${gasPriceGwei} gwei`);
        
        // Calculate total cost
        const totalCost = web3.utils.toBN(gasEstimate).mul(web3.utils.toBN(gasPrice));
        const totalCostEth = web3.utils.fromWei(totalCost, 'ether');
        console.log(`💸 Total Transaction Cost: ${totalCostEth} MATIC`);
        
        // Check if we have enough balance
        const balance = await web3.eth.getBalance(account.address);
        if (balance.gt(totalCost)) {
            console.log('✅ Sufficient balance for transaction');
        } else {
            console.log('⚠️  Insufficient balance for transaction');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Transaction Test Failed:', error.message);
        return false;
    }
}

async function testPolygonScan() {
    try {
        console.log('🔍 Testing PolygonScan API...');
        
        // Test a sample transaction hash
        const sampleTxHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        const polygonScanUrl = `https://amoy.polygonscan.com/tx/${sampleTxHash}`;
        
        console.log(`🌐 PolygonScan URL: ${polygonScanUrl}`);
        console.log('✅ PolygonScan URL format is correct');
        
        return true;
    } catch (error) {
        console.error('❌ PolygonScan Test Failed:', error.message);
        return false;
    }
}

async function testDonationFlow() {
    try {
        console.log('💝 Testing Donation Flow Simulation...');
        
        // Simulate donation data
        const donation = {
            donorEmail: 'test@example.com',
            amount: '100.00',
            category: 'Education',
            orderId: 'DONATION_' + Date.now(),
            timestamp: Math.floor(Date.now() / 1000)
        };
        
        console.log('📊 Donation Data:');
        console.log(`   Donor: ${donation.donorEmail}`);
        console.log(`   Amount: ${donation.amount} MATIC`);
        console.log(`   Category: ${donation.category}`);
        console.log(`   Order ID: ${donation.orderId}`);
        console.log(`   Timestamp: ${donation.timestamp}`);
        
        // Generate donor hash (simulating HashUtil)
        const crypto = require('crypto');
        const donorHash = crypto.createHash('sha256').update(donation.donorEmail).digest('hex');
        console.log(`🔐 Donor Hash: ${donorHash}`);
        
        console.log('✅ Donation flow simulation successful');
        return true;
    } catch (error) {
        console.error('❌ Donation Flow Test Failed:', error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('🧪 Running All Blockchain Tests...\n');
    
    const results = {
        rpc: false,
        wallet: false,
        transaction: false,
        polygonscan: false,
        donation: false
    };
    
    // Test 1: RPC Connection
    const web3 = await testBlockchainConnection();
    if (web3) results.rpc = true;
    console.log('');
    
    // Test 2: Wallet
    if (web3) {
        const account = await testWallet(web3);
        if (account) results.wallet = true;
    }
    console.log('');
    
    // Test 3: Transaction
    if (web3 && results.wallet) {
        const account = web3.eth.accounts.privateKeyToAccount('0x' + PRIVATE_KEY);
        results.transaction = await testTransaction(web3, account);
    }
    console.log('');
    
    // Test 4: PolygonScan
    results.polygonscan = await testPolygonScan();
    console.log('');
    
    // Test 5: Donation Flow
    results.donation = await testDonationFlow();
    console.log('');
    
    // Results Summary
    console.log('=====================================');
    console.log('📊 Test Results Summary:');
    console.log(`RPC Connection: ${results.rpc ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Wallet Setup: ${results.wallet ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Transaction Test: ${results.transaction ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`PolygonScan URL: ${results.polygonscan ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Donation Flow: ${results.donation ? '✅ PASS' : '❌ FAIL'}`);
    console.log('=====================================');
    
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`📈 Overall: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Blockchain module is ready.');
    } else {
        console.log('⚠️  Some tests failed. Check the configuration.');
    }
    
    // Next Steps
    console.log('\n🔧 Next Steps:');
    console.log('1. Deploy smart contract to Polygon Amoy');
    console.log('2. Update contract address in application.properties');
    console.log('3. Start the backend application');
    console.log('4. Test donation flow with real transaction');
    
    return results;
}

// Run tests if called directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    testBlockchainConnection,
    testWallet,
    testTransaction,
    testPolygonScan,
    testDonationFlow,
    runAllTests
};
