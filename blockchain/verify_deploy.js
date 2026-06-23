require('dotenv').config();
const { ethers } = require('ethers');

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology");
    const txHash = "0xcac75f8fc71eb8ffb93cef3d99a92056fff"; // From contract-address.json
    const receipt = await provider.getTransactionReceipt(txHash);
    if (receipt) {
        console.log("Tx Status:", receipt.status === 1 ? "SUCCESS" : "FAILED");
        console.log("Contract Address:", receipt.contractAddress);
    } else {
        console.log("Transaction not found or still pending.");
    }
}

main().catch(console.error);
