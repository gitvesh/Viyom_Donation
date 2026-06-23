const fs = require('fs');
const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
    console.log("🚀 Starting deployment of DonationTransparency contract using pure Ethers.js...");
    try {
        // Read compiled ABI and Bytecode from solc
        const abiPath = './build/contracts_DonationTransparency_sol_DonationTransparency.abi';
        const binPath = './build/contracts_DonationTransparency_sol_DonationTransparency.bin';
        
        if (!fs.existsSync(abiPath) || !fs.existsSync(binPath)) {
            throw new Error("ABI or BIN files not found! Please run `npx solc --bin --abi contracts/DonationTransparency.sol -o build` first.");
        }
        
        const abi = fs.readFileSync(abiPath, 'utf8');
        const bytecode = fs.readFileSync(binPath, 'utf8');
        
        // Setup Provider & Signer
        const rpcUrl = process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology";
        console.log(`📡 Connecting to RPC: ${rpcUrl}`);
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        
        let privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) throw new Error("PRIVATE_KEY not found in .env");
        if (!privateKey.startsWith("0x")) privateKey = "0x" + privateKey;
        
        const wallet = new ethers.Wallet(privateKey, provider);
        
        console.log("👤 Deploying with account:", wallet.address);
        
        const network = await provider.getNetwork();
        console.log("🌐 Deploying to network:", {
            name: network.name,
            chainId: network.chainId.toString()
        });
        
        const balance = await provider.getBalance(wallet.address);
        console.log("💰 Account balance:", ethers.formatEther(balance), "MATIC");
        
        if (balance === 0n) {
            throw new Error("Account has 0 MATIC! Please fund the wallet before deploying.");
        }
        
        console.log("📦 Getting ContractFactory...");
        const factory = new ethers.ContractFactory(abi, bytecode, wallet);
        
        console.log("🚢 Deploying contract with custom gas limits to fit in 0.1 MATIC...");
        // Set lower max fee (e.g., 40 gwei) which should cost ~0.06 MATIC
        const overrides = {
            maxFeePerGas: ethers.parseUnits("50", "gwei"),
            maxPriorityFeePerGas: ethers.parseUnits("40", "gwei")
        };
        const contract = await factory.deploy(overrides);
        
        console.log("⏳ Waiting for deployment confirmation...");
        await contract.waitForDeployment();
        
        const contractAddress = await contract.getAddress();
        console.log("✅ Contract deployed successfully!");
        console.log("📍 Contract Address:", contractAddress);
        
        const deployTx = contract.deploymentTransaction();
        console.log("📋 Deployment TxHash:", deployTx ? deployTx.hash : "N/A");
        
        // Save to file for backend integration
        const deploymentInfo = {
            network: network.name,
            chainId: network.chainId.toString(),
            contractAddress: contractAddress,
            deployerAddress: wallet.address,
            deployedAt: new Date().toISOString(),
            transactionHash: deployTx ? deployTx.hash : "N/A"
        };
        
        if (!fs.existsSync('../backend/src/main/resources')) {
            fs.mkdirSync('../backend/src/main/resources', { recursive: true });
        }
        fs.writeFileSync(
            "../backend/src/main/resources/contract-address.json",
            JSON.stringify(deploymentInfo, null, 2)
        );
        console.log("💾 Deployment info saved to ../backend/src/main/resources/contract-address.json");
        
        console.log("\n🔑 ─────────────────────────────────────────────────────────");
        console.log("   NEXT STEPS – update backend/src/main/resources/application.properties:");
        console.log(`   blockchain.contract.address=${contractAddress}`);
        console.log(`   blockchain.private.key=${process.env.PRIVATE_KEY}`);
        console.log("─────────────────────────────────────────────────────────────\n");
        
    } catch (e) {
        console.error("❌ Failed to deploy:", e.message || e);
        process.exit(1);
    }
}

main();
