const { ethers } = require("hardhat");
const fs = require("fs");
require("dotenv").config();

async function main() {
  console.log("🚀 Starting deployment of DonationTransparency contract...");
  
  try {
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("👤 Deploying with account:", deployer.address);
    
    // Get network information
    const network = await ethers.provider.getNetwork();
    console.log("🌐 Deploying to network:", {
      name: network.name,
      chainId: network.chainId.toString()
    });
    
    // Get account balance (ethers v6 API)
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "MATIC");
    
    // Compile and deploy contract
    console.log("📦 Getting DonationTransparency contract factory...");
    
    const DonationTransparency = await ethers.getContractFactory("DonationTransparency");
    
    console.log("🚢 Deploying contract...");
    const donationTransparency = await DonationTransparency.deploy();
    
    console.log("⏳ Waiting for deployment confirmation...");
    // ethers v6: use waitForDeployment() instead of .deployed()
    await donationTransparency.waitForDeployment();
    
    // ethers v6: .target instead of .address
    const contractAddress = await donationTransparency.getAddress();
    console.log("✅ Contract deployed successfully!");
    console.log("📍 Contract Address:", contractAddress);
    
    // Get the deployment transaction hash
    const deployTx = donationTransparency.deploymentTransaction();
    const txHash = deployTx ? deployTx.hash : "N/A";
    console.log("📋 Deployment TxHash:", txHash);

    // Verify contract on Polygonscan (if API key is available)
    if (process.env.POLYGONSCAN_API_KEY) {
      console.log("🔍 Waiting 5 blocks before verification...");
      // Wait for a few blocks to ensure the contract is indexed
      await deployTx.wait(5);
      
      console.log("🔍 Verifying contract on Polygonscan...");
      try {
        await hre.run("verify:verify", {
          address: contractAddress,
          constructorArguments: [],
        });
        console.log("✅ Contract verified on Polygonscan!");
      } catch (error) {
        console.log("⚠️ Contract verification failed:", error.message);
        console.log("🔗 Manual verification: https://amoy.polygonscan.com/address/" + contractAddress);
      }
    }
    
    // Save deployment information
    const deploymentInfo = {
      network: network.name,
      chainId: network.chainId.toString(),
      contractAddress: contractAddress,
      deployerAddress: deployer.address,
      deployedAt: new Date().toISOString(),
      transactionHash: txHash
    };
    
    console.log("📋 Deployment Summary:");
    console.log(JSON.stringify(deploymentInfo, null, 2));

    // ─── IMPORTANT: Update application.properties ─────────────────────────────
    console.log("\n🔑 ─────────────────────────────────────────────────────────");
    console.log("   NEXT STEPS – update backend/src/main/resources/application.properties:");
    console.log(`   blockchain.contract.address=${contractAddress}`);
    console.log("   blockchain.private.key=<your 64-hex-char private key>");
    console.log("─────────────────────────────────────────────────────────────\n");
    
    // Save to file for backend integration
    fs.writeFileSync(
      "../backend/src/main/resources/contract-address.json",
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("💾 Deployment info saved to backend/src/main/resources/contract-address.json");
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
