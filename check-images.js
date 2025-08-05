const { ethers } = require('ethers');

const CROWDFUNDING_ABI = [
  "function getCampaignDetails(uint256 campaignId) external view returns (address, string, string, string, string, uint256, uint256, uint256, uint256, bool, bool, bool, uint256)"
];

const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D93C7C5b8e0C8B23";

async function checkCampaignImages() {
  try {
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CROWDFUNDING_ABI, provider);
    
    for (let i = 1; i <= 4; i++) {
      try {
        console.log(`\nChecking campaign ${i}:`);
        const details = await contract.getCampaignDetails(i);
        console.log(`  Title: ${details[1]}`);
        console.log(`  ImageHash: '${details[3]}'`);
        console.log(`  ImageHash length: ${details[3].length}`);
        console.log(`  ImageHash type: ${typeof details[3]}`);
      } catch (error) {
        console.log(`  Campaign ${i} not found`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkCampaignImages();
