const { ethers } = require('ethers');

const CROWDFUNDING_ABI = [
  "function campaignCounter() external view returns (uint256)",
  "function getCampaignDetails(uint256 campaignId) external view returns (address, string, string, string, string, uint256, uint256, uint256, uint256, bool, bool, bool, uint256)"
];

const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D93C7C5b8e0C8B23";

async function debugCampaigns() {
  try {
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CROWDFUNDING_ABI, provider);
    
    console.log("Getting campaign counter...");
    const count = await contract.campaignCounter();
    console.log(`Total campaigns: ${count}`);
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        try {
          console.log(`\nFetching campaign ${i}:`);
          const details = await contract.getCampaignDetails(i);
          console.log(`  ID: ${i}`);
          console.log(`  Creator: ${details[0]}`);
          console.log(`  Title: ${details[1]}`);
          console.log(`  Description: ${details[2].substring(0, 50)}...`);
          console.log(`  ImageHash: '${details[3]}'`);
          console.log(`  Category: ${details[4]}`);
          console.log(`  Goal: ${ethers.formatEther(details[5])} ETH`);
          console.log(`  IsActive: ${details[11]}`);
        } catch (error) {
          console.log(`  Error fetching campaign ${i}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugCampaigns();
