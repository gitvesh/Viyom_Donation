require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config') */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    // Polygon Amoy Testnet Configuration
    amoy: {
      url: process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology",
      chainId: 80002,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei
      gas: 6000000, // 6 million gas limit
    },
    // Polygon Mainnet (for future production)
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      chainId: 137,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 30000000000, // 30 gwei
      gas: 6000000,
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY || "",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
