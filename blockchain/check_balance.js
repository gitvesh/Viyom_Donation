require('dotenv').config();
const { ethers } = require('ethers');

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology");
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        console.error("PRIVATE_KEY not found");
        return;
    }
    const wallet = new ethers.Wallet(privateKey, provider);
    const balance = await provider.getBalance(wallet.address);
    console.log("Account:", wallet.address);
    console.log("Balance:", ethers.formatEther(balance), "MATIC");
}

main().catch(console.error);
