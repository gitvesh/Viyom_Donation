const { ethers } = require('ethers');
require('dotenv').config();

async function test() {
    console.log("🚀 Testing Ethers.js Connection...");
    try {
        const rpcUrl = process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology";
        console.log("📡 Connecting to RPC: " + rpcUrl);
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        
        console.log("🔍 Fetching network information...");
        const network = await provider.getNetwork();
        console.log("🌐 Network: " + network.name + " (" + network.chainId + ")");
        
        const pk = process.env.PRIVATE_KEY;
        if (!pk) {
            console.error("❌ PRIVATE_KEY is missing from .env!");
            return;
        }
        
        console.log("🔑 Creating wallet instance...");
        const wallet = new ethers.Wallet(pk, provider);
        console.log("👤 Wallet Address: " + wallet.address);
        
        console.log("💰 Fetching balance...");
        const balance = await provider.getBalance(wallet.address);
        console.log("💵 Balance: " + ethers.formatEther(balance) + " MATIC");
        
        if (balance == 0n) {
            console.warn("⚠️  Wallet is empty! No transactions possible.");
        } else {
            console.log("✅ Ready for deployment!");
        }
    } catch (e) {
        console.error("❌ ERROR: " + e.message);
        if (e.stack) console.error(e.stack);
    }
}
test();
