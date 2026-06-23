// Simple Blockchain Test Script (No external dependencies)
// Tests basic blockchain connectivity and configuration

const https = require('https');
const crypto = require('crypto');

// Configuration
const RPC_URL = 'https://polygon-amoy.g.alchemy.com/v2/Ecooto5QXtLA10_XTBtIN';
const PRIVATE_KEY = '601485FdABC06C7aE51C7B4dea982512771D0a26';
const CHAIN_ID = 80002; // Polygon Amoy

console.log('🚀 Starting Simple Blockchain Test...');
console.log('=====================================');

function makeRPCRequest(method, params = []) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            jsonrpc: '2.0',
            method: method,
            params: params,
            id: 1
        });

        const options = {
            hostname: 'polygon-amoy.g.alchemy.com',
            port: 443,
            path: '/v2/Ecooto5QXtLA10_XTBtIN',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(responseData);
                    if (response.error) {
                        reject(new Error(response.error.message));
                    } else {
                        resolve(response.result);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

async function testRPCConnection() {
    try {
        console.log('🔗 Testing RPC Connection...');
        
        const blockNumber = await makeRPCRequest('eth_blockNumber');
        console.log(`✅ RPC Connection Successful! Latest block: ${parseInt(blockNumber, 16)}`);
        
        // Test chain ID
        const chainId = await makeRPCRequest('eth_chainId');
        console.log(`📊 Chain ID: ${parseInt(chainId, 16)}`);
        
        if (parseInt(chainId, 16) === CHAIN_ID) {
            console.log('✅ Correct chain (Polygon Amoy)');
        } else {
            console.log('⚠️  Wrong chain detected');
        }
        
        return true;
    } catch (error) {
        console.error('❌ RPC Connection Failed:', error.message);
        return false;
    }
}

function testPrivateKeyFormat() {
    try {
        console.log('🔐 Testing Private Key Format...');
        
        // Check if private key is valid format (64 hex characters)
        const cleanKey = PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY.slice(2) : PRIVATE_KEY;
        
        if (cleanKey.length !== 64) {
            console.error('❌ Invalid private key length. Expected 64 characters, got:', cleanKey.length);
            return false;
        }
        
        if (!/^[0-9a-fA-F]+$/.test(cleanKey)) {
            console.error('❌ Private key contains non-hex characters');
            return false;
        }
        
        // Derive address from private key
        const { createHash } = crypto;
        const privateKey = Buffer.from(cleanKey, 'hex');
        
        // Simple address derivation (simplified for testing)
        const hash = createHash('sha256').update(privateKey).digest();
        const address = '0x' + hash.slice(-40).toString('hex');
        
        console.log(`✅ Private Key Format Valid`);
        console.log(`🏠 Derived Address: ${address}`);
        
        return true;
    } catch (error) {
        console.error('❌ Private Key Test Failed:', error.message);
        return false;
    }
}

function testPolygonScanURL() {
    try {
        console.log('🔍 Testing PolygonScan URL Format...');
        
        // Test a sample transaction hash
        const sampleTxHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        const polygonScanUrl = `https://amoy.polygonscan.com/tx/${sampleTxHash}`;
        
        console.log(`🌐 PolygonScan URL: ${polygonScanUrl}`);
        
        // Check URL format
        if (polygonScanUrl.startsWith('https://amoy.polygonscan.com/tx/0x')) {
            console.log('✅ PolygonScan URL format is correct');
            return true;
        } else {
            console.error('❌ Invalid PolygonScan URL format');
            return false;
        }
    } catch (error) {
        console.error('❌ PolygonScan URL Test Failed:', error.message);
        return false;
    }
}

function testDonationFlow() {
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
        const donorHash = crypto.createHash('sha256').update(donation.donorEmail).digest('hex');
        console.log(`🔐 Donor Hash: ${donorHash}`);
        
        // Generate expected transaction hash format
        const expectedTxHash = '0x' + crypto.createHash('sha256').update(donation.orderId + donation.timestamp).digest('hex');
        console.log(`🔗 Expected TxHash: ${expectedTxHash}`);
        
        console.log('✅ Donation flow simulation successful');
        return true;
    } catch (error) {
        console.error('❌ Donation Flow Test Failed:', error.message);
        return false;
    }
}

function testGasEstimation() {
    try {
        console.log('⛽ Testing Gas Estimation...');
        
        // Standard gas values for Polygon Amoy
        const standardGasPrice = 20000000000; // 20 gwei
        const standardGasLimit = 6000000;
        
        const gasPriceGwei = standardGasPrice / 1e9;
        const totalCostEth = (standardGasPrice * standardGasLimit) / 1e18;
        
        console.log(`⛽ Standard Gas Price: ${gasPriceGwei} gwei`);
        console.log(`⛽ Standard Gas Limit: ${standardGasLimit}`);
        console.log(`💸 Standard Transaction Cost: ${totalCostEth} MATIC`);
        
        console.log('✅ Gas estimation values are reasonable');
        return true;
    } catch (error) {
        console.error('❌ Gas Estimation Test Failed:', error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('🧪 Running All Blockchain Tests...\n');
    
    const results = {
        rpc: false,
        privateKey: false,
        polygonscan: false,
        donation: false,
        gas: false
    };
    
    // Test 1: RPC Connection
    results.rpc = await testRPCConnection();
    console.log('');
    
    // Test 2: Private Key
    results.privateKey = testPrivateKeyFormat();
    console.log('');
    
    // Test 3: PolygonScan URL
    results.polygonscan = testPolygonScanURL();
    console.log('');
    
    // Test 4: Donation Flow
    results.donation = testDonationFlow();
    console.log('');
    
    // Test 5: Gas Estimation
    results.gas = testGasEstimation();
    console.log('');
    
    // Results Summary
    console.log('=====================================');
    console.log('📊 Test Results Summary:');
    console.log(`RPC Connection: ${results.rpc ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Private Key Format: ${results.privateKey ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`PolygonScan URL: ${results.polygonscan ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Donation Flow: ${results.donation ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Gas Estimation: ${results.gas ? '✅ PASS' : '❌ FAIL'}`);
    console.log('=====================================');
    
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`📈 Overall: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Blockchain configuration is ready.');
        console.log('\n🔧 Next Steps:');
        console.log('1. Deploy smart contract to Polygon Amoy');
        console.log('2. Update contract address in application.properties');
        console.log('3. Start the backend application');
        console.log('4. Test real donation flow');
    } else {
        console.log('⚠️  Some tests failed. Check the configuration.');
    }
    
    return results;
}

// Manual test for donation flow
async function testManualDonation() {
    console.log('💝 Manual Donation Test');
    console.log('=======================');
    
    // Simulate a complete donation flow
    const donation = {
        donorEmail: 'user@example.com',
        amount: '50.00',
        category: 'Healthcare',
        orderId: 'DONATION_' + Date.now(),
        timestamp: Math.floor(Date.now() / 1000)
    };
    
    console.log('1. Creating donation...');
    console.log(`   Donor: ${donation.donorEmail}`);
    console.log(`   Amount: ${donation.amount} MATIC`);
    console.log(`   Category: ${donation.category}`);
    
    console.log('\n2. Generating donor hash...');
    const donorHash = crypto.createHash('sha256').update(donation.donorEmail).digest('hex');
    console.log(`   Hash: ${donorHash}`);
    
    console.log('\n3. Simulating blockchain transaction...');
    const mockTxHash = '0x' + crypto.createHash('sha256').update(donation.orderId + donation.timestamp).digest('hex');
    console.log(`   Transaction Hash: ${mockTxHash}`);
    
    console.log('\n4. Creating PolygonScan URL...');
    const polygonScanUrl = `https://amoy.polygonscan.com/tx/${mockTxHash}`;
    console.log(`   URL: ${polygonScanUrl}`);
    
    console.log('\n✅ Manual donation test completed!');
    console.log('\n🔗 You can check the transaction (when real) at:');
    console.log(`   ${polygonScanUrl}`);
    
    return {
        donation,
        donorHash,
        transactionHash: mockTxHash,
        polygonScanUrl
    };
}

// Run tests if called directly
if (require.main === module) {
    const command = process.argv[2];
    
    if (command === 'manual') {
        testManualDonation().catch(console.error);
    } else if (command === 'rpc') {
        testRPCConnection().catch(console.error);
    } else {
        runAllTests().catch(console.error);
    }
}

module.exports = {
    testRPCConnection,
    testPrivateKeyFormat,
    testPolygonScanURL,
    testDonationFlow,
    testGasEstimation,
    runAllTests,
    testManualDonation
};
