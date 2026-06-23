require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology");
    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const abiPath = './build/contracts_DonationTransparency_sol_DonationTransparency.abi';
    const binPath = './build/contracts_DonationTransparency_sol_DonationTransparency.bin';
    
    const abi = fs.readFileSync(abiPath, 'utf8');
    const bytecode = fs.readFileSync(binPath, 'utf8');
    
    console.log("👤 Deployer:", wallet.address);
    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "MATIC");

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    
    console.log("🚢 Deploying with ~500k gas limit...");
    try {
        const contract = await factory.deploy({
            gasLimit: 800000, // Safe buffer
            maxFeePerGas: ethers.parseUnits("35", "gwei"),
            maxPriorityFeePerGas: ethers.parseUnits("30", "gwei")
        });
        
        console.log("⏳ Waiting for tx:", contract.deploymentTransaction().hash);
        await contract.waitForDeployment();
        
        const address = await contract.getAddress();
        console.log("✅ Deployed to:", address);
        
        const info = {
            network: "matic-amoy",
            contractAddress: address,
            transactionHash: contract.deploymentTransaction().hash,
            deployedAt: new Date().toISOString()
        };
        fs.writeFileSync("../backend/src/main/resources/contract-address.json", JSON.stringify(info, null, 2));
    } catch (err) {
        console.error("❌ Deploy failed:", err.message);
    }
}

main().catch(console.error);
