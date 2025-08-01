const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting BlockLift smart contract deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Check account balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  if (parseFloat(ethers.formatEther(balance)) < 0.01) {
    console.log("⚠️  Warning: Low account balance. Make sure you have enough ETH for deployment.");
  }

  // Set fee collector address (change this to your desired fee collector)
  const feeCollectorAddress = deployer.address; // Using deployer as fee collector for now
  console.log("🏦 Fee collector address:", feeCollectorAddress);

  // Deploy the contract
  console.log("⏳ Deploying CrowdfundingCampaign contract...");
  
  const CrowdfundingCampaign = await ethers.getContractFactory("CrowdfundingCampaign");
  const crowdfunding = await CrowdfundingCampaign.deploy(feeCollectorAddress);

  await crowdfunding.waitForDeployment();

  const contractAddress = await crowdfunding.getAddress();
  console.log("✅ CrowdfundingCampaign deployed to:", contractAddress);

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  
  try {
    const campaignCounter = await crowdfunding.campaignCounter();
    console.log("📊 Initial campaign counter:", campaignCounter.toString());
    
    const feeCollector = await crowdfunding.feeCollector();
    console.log("🏦 Fee collector set to:", feeCollector);
    
    console.log("✅ Contract verification successful!");
  } catch (error) {
    console.error("❌ Contract verification failed:", error);
  }

  // Display important information
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("=".repeat(60));
  console.log("📄 Contract Address:", contractAddress);
  console.log("🌐 Network:", (await deployer.provider.getNetwork()).name);
  console.log("⛽ Platform Fee:", "2.5%");
  console.log("🏦 Fee Collector:", feeCollectorAddress);
  console.log("=".repeat(60));
  
  console.log("\n📋 NEXT STEPS:");
  console.log("1. Update your .env.local file:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("2. Verify contract on Etherscan (if on mainnet):");
  console.log(`   npx hardhat verify --network <network> ${contractAddress} ${feeCollectorAddress}`);
  console.log("3. Test the contract with a small campaign");
  console.log("4. Update your frontend to use the new contract address");
  
  console.log("\n🔧 CONTRACT FUNCTIONS AVAILABLE:");
  console.log("- createCampaign(): Create new crowdfunding campaigns");
  console.log("- contribute(): Send ETH to campaigns");
  console.log("- withdrawFunds(): Creators withdraw funds when goal reached");
  console.log("- claimRefund(): Contributors get refunds if goal not met");
  console.log("- getCampaignDetails(): View campaign information");
  console.log("- getPlatformStats(): Get platform statistics");
  
  console.log("\n⚠️  SECURITY NOTES:");
  console.log("- Contract has reentrancy protection");
  console.log("- Platform fee is 2.5% of successful campaigns");
  console.log("- Emergency pause functionality available");
  console.log("- Funds are held in escrow until goals are met");
  
  // Save deployment info to file
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    feeCollectorAddress: feeCollectorAddress,
    network: (await deployer.provider.getNetwork()).name,
    blockNumber: await deployer.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
    platformFee: "2.5%"
  };
  
  require('fs').writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n💾 Deployment info saved to deployment-info.json");
  console.log("🚀 BlockLift is ready for production!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
