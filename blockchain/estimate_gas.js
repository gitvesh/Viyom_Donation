const fs = require('fs');
const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
    try {
        const abiPath = './build/contracts_DonationTransparency_sol_DonationTransparency.abi';
        const binPath = './build/contracts_DonationTransparency_sol_DonationTransparency.bin';
        const abi = fs.readFileSync(abiPath, 'utf8');
        const bytecode = fs.readFileSync(binPath, 'utf8');
        
        const rpcUrl = process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology";
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        
        let privateKey = process.env.PRIVATE_KEY;
        if (!privateKey.startsWith("0x")) privateKey = "0x" + privateKey;
        
        const wallet = new ethers.Wallet(privateKey, provider);
        const factory = new ethers.ContractFactory(abi, bytecode, wallet);
        
        const tx = await factory.getDeployTransaction();
        const gasEstimate = await provider.estimateGas(tx);
        const feeData = await provider.getFeeData();
        
        console.log("Gas Estimate:", gasEstimate.toString());
        console.log("Max Fee Per Gas:", feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, "gwei") : "0", "gwei");
        
        const cost = BigInt(gasEstimate) * (feeData.maxFeePerGas || feeData.gasPrice);
        console.log("Estimated Cost:", ethers.formatEther(cost), "MATIC");
        console.log("Current Balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "MATIC");
    } catch (e) {
        console.error(e);
    }
}
main();
