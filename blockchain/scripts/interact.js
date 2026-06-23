const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  // Get command line arguments
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    console.log("📖 Available commands:");
    console.log("  record <orderId> <amount> <category>");
    console.log("  get <orderId>");
    console.log("  total");
    console.log("  list <category>");
    console.log("");
    console.log("🔧 Environment setup:");
    console.log("  Copy .env.example to .env");
    console.log("  Fill in your PRIVATE_KEY");
    console.log("  Ensure contract is deployed");
    return;
  }
  
  try {
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    
    // Contract address (you'll get this from deployment)
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.error("❌ CONTRACT_ADDRESS not set in .env");
      console.log("📝 Please set CONTRACT_ADDRESS=<deployed_contract_address>");
      return;
    }
    
    const DonationTransparency = await ethers.getContractAt(
      "DonationTransparency", 
      contractAddress
    );
    
    console.log(`🌐 Connected to ${network.name} (Chain ID: ${network.chainId})`);
    console.log(`📍 Contract: ${contractAddress}`);
    
    switch (command) {
      case "record":
        await recordDonation(DonationTransparency, deployer, args.slice(1));
        break;
        
      case "get":
        await getDonation(DonationTransparency, args[1]);
        break;
        
      case "total":
        await getTotalDonations(DonationTransparency);
        break;
        
      case "list":
        await listDonations(DonationTransparency, args[1]);
        break;
        
      default:
        console.error("❌ Unknown command:", command);
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function recordDonation(contract, signer, args) {
  const [orderId, amount, category] = args;
  
  if (!orderId || !amount || !category) {
    console.error("❌ Missing required arguments");
    console.log("📝 Usage: record <orderId> <amount> <category>");
    return;
  }
  
  console.log(`📝 Recording donation: ${orderId} (${amount} ${category})`);
  
  // Hash donor identifier (using deployer address for demo)
  const donorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signer.address));
  
  // Convert amount to wei
  const amountWei = ethers.utils.parseEther(amount);
  
  // Get current timestamp
  const timestamp = Math.floor(Date.now() / 1000);
  
  try {
    const tx = await contract.connect(signer).recordDonation(
      donorHash,
      amountWei,
      category,
      orderId,
      timestamp
    );
    
    console.log("⏳ Transaction submitted:", tx.hash);
    console.log("⏳ Waiting for confirmation...");
    
    const receipt = await tx.wait();
    
    console.log("✅ Donation recorded successfully!");
    console.log("🔗 Transaction:", `https://amoy.polygonscan.com/tx/${tx.hash}`);
    console.log("📊 Gas used:", receipt.gasUsed.toString());
    
  } catch (error) {
    console.error("❌ Failed to record donation:", error.message);
  }
}

async function getDonation(contract, orderId) {
  if (!orderId) {
    console.error("❌ Order ID required");
    return;
  }
  
  try {
    const [donorHash, amount, category, timestamp] = await contract.getDonation(orderId);
    
    console.log("📋 Donation Details:");
    console.log("  Order ID:", orderId);
    console.log("  Donor Hash:", donorHash);
    console.log("  Amount:", ethers.utils.formatEther(amount), "ETH");
    console.log("  Category:", category);
    console.log("  Timestamp:", new Date(timestamp.toNumber() * 1000).toISOString());
    
  } catch (error) {
    console.error("❌ Failed to get donation:", error.message);
  }
}

async function getTotalDonations(contract) {
  try {
    const total = await contract.getTotalDonations();
    console.log("📊 Total donations recorded:", total.toString());
  } catch (error) {
    console.error("❌ Failed to get total:", error.message);
  }
}

async function listDonations(contract, category) {
  try {
    const orderIds = await contract.getDonationsByCategory(category, 0, 10);
    
    console.log(`📋 Donations in category "${category}":`);
    
    for (let i = 0; i < orderIds.length; i++) {
      const [donorHash, amount, cat, timestamp] = await contract.getDonation(orderIds[i]);
      console.log(`  ${i + 1}. ${orderIds[i]} - ${ethers.utils.formatEther(amount)} ETH (${cat})`);
    }
    
    if (orderIds.length === 10) {
      console.log("📝 Showing first 10 results. Use pagination for more.");
    }
    
  } catch (error) {
    console.error("❌ Failed to list donations:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
