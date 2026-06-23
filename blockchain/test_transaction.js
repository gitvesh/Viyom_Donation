const { ethers } = require('ethers');
require('dotenv').config();

const contractAddress = process.env.CONTRACT_ADDRESS || "0xC50E1D5608b2d861d3eDD0aC887d529434B9eC02";
const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology";

const ABI = [
    "function recordDonation(string memory _donorHash, uint256 _amount, string memory _category, string memory _transactionId, uint256 _timestamp) public",
    "function allocateFunds(uint256 _allocationId, uint256 _amount, string memory _sector, string memory _description, uint256 _timestamp) public",
    "function getTotalDonations() public view returns (uint256)",
    "function getTotalAllocated() public view returns (uint256)"
];

async function testTransactions() {
    try {
        console.log("🔗 Connecting to:", rpcUrl);
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const wallet = new ethers.Wallet(privateKey, provider);
        
        console.log("😎 Wallet Address:", wallet.address);
        const balanceWei = await provider.getBalance(wallet.address);
        const balanceMatic = ethers.formatEther(balanceWei);
        console.log("💰 Wallet Balance:", balanceMatic, "MATIC");

        if (parseFloat(balanceMatic) < 0.01) {
            console.error("❌ Not enough MATIC to perform tests. Need more funds!");
            return;
        }

        const contract = new ethers.Contract(contractAddress, ABI, wallet);
        console.log(`\n📝 Testing recordDonation...`);
        
        const donorHash = ethers.id("test_donor@example.com");
        const amount = ethers.parseEther("0.0001"); // Very small test amount
        const category = "TestCategory";
        const transactionId = "TXN_" + Date.now();
        const timestamp = Math.floor(Date.now() / 1000);

        // Lowering gasLimit as we did in Spring Boot to 300000
        const overrides = {
            gasLimit: 300000
        };

        const txDonation = await contract.recordDonation(
            donorHash, amount, category, transactionId, timestamp, overrides
        );
        console.log("   🚀 Transaction Sent! Hash:", txDonation.hash);
        console.log("   ⏳ Waiting for confirmation...");
        const receiptDonation = await txDonation.wait();
        console.log("   ✅ recordDonation Confirmed! Block:", receiptDonation.blockNumber);

        console.log(`\n📝 Testing allocateFunds...`);
        const allocationId = Math.floor(Math.random() * 100000) + 1;
        const allocAmount = ethers.parseEther("0.00005");
        const sector = "TestCategory";
        const desc = "Test Allocation " + allocationId;

        const txAllocation = await contract.allocateFunds(
            allocationId, allocAmount, sector, desc, timestamp, overrides
        );
        console.log("   🚀 Transaction Sent! Hash:", txAllocation.hash);
        console.log("   ⏳ Waiting for confirmation...");
        const receiptAllocation = await txAllocation.wait();
        console.log("   ✅ allocateFunds Confirmed! Block:", receiptAllocation.blockNumber);

        console.log("\n📊 Verification:");
        const totalDonated = await contract.getTotalDonations();
        const totalAllocated = await contract.getTotalAllocated();
        console.log("   Total Donated (Wei):", totalDonated.toString());
        console.log("   Total Allocated (Wei):", totalAllocated.toString());

    } catch (e) {
        console.error("❌ ERROR Details:");
        console.error(e);
    }
}

testTransactions();
