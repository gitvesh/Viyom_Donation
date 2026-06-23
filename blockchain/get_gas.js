const { ethers } = require('ethers');

async function checkGas() {
    const provider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology');
    const feeData = await provider.getFeeData();
    console.log("Gas Price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
    console.log("Max Fee Per Gas:", ethers.formatUnits(feeData.maxFeePerGas || 0n, "gwei"), "gwei");
}
checkGas();
