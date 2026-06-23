require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // ABI and BIN paths
    const abiPath = './build/contracts_DonationTransparency_sol_DonationTransparency.abi';
    const binPath = './build/contracts_DonationTransparency_sol_DonationTransparency.bin';
    
    const abi = fs.readFileSync(abiPath, 'utf8');
    const bytecode = fs.readFileSync(binPath, 'utf8');
    
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    
    console.log("Deploying contract...");
    try {
        // Auto-estimate gas without manual overrides causing CALL_EXCEPTION
        const contract = await factory.deploy();
        console.log("Deployment tx sent. Waiting...");
        await contract.waitForDeployment();
        
        const contractAddress = await contract.getAddress();
        console.log("Deployed to:", contractAddress);
        
        const deploymentInfo = {
            network: "matic-amoy",
            chainId: "80002",
            contractAddress: contractAddress,
            deployerAddress: wallet.address,
            deployedAt: new Date().toISOString()
        };
        fs.writeFileSync("../backend/src/main/resources/contract-address.json", JSON.stringify(deploymentInfo, null, 2));
        console.log("Saved address!");
    } catch(err) {
        console.error("Deploy failed:", err.message);
    }
}
main();
