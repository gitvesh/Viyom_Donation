require('dotenv').config();
const { ethers } = require('ethers');

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology");
    const address = "0xC50E1D5608b2d861d3eDD0aC887d529434B9eC02";
    const code = await provider.getCode(address);
    if (code !== "0x") {
        console.log("✅ Contract found at:", address);
        console.log("Code length:", code.length);
    } else {
        console.log("❌ NO contract at:", address);
    }
}

main().catch(console.error);
