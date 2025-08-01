const { ethers } = require('ethers');

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RPC_URL = "http://localhost:8545";

const CROWDFUNDING_ABI = [
  "function createCampaign(string title, string description, string imageHash, string category, uint256 goal, uint256 durationInDays) external returns (uint256)"
];

const accounts = [
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Account 0
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", // Account 1
  "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"  // Account 2
];

const campaigns = [
  {
    title: "🚀 Revolutionary Blockchain Platform",
    description: "Building the next generation of decentralized crowdfunding with cutting-edge blockchain technology. Our platform ensures transparency, security, and global accessibility for all fundraising campaigns.",
    category: "Technology",
    goal: "2.5",
    duration: 30
  },
  {
    title: "💧 Clean Water for Rural Communities",
    description: "Solar-powered water purification systems for underserved communities worldwide. Using advanced filtration and UV sterilization to provide safe, clean drinking water while being environmentally sustainable.",
    category: "Healthcare",
    goal: "1.8",
    duration: 45
  },
  {
    title: "🎓 AI-Powered Learning Platform",
    description: "Personalized education platform using artificial intelligence to adapt to individual learning styles. Providing real-time feedback and customized learning paths to help students achieve their academic goals.",
    category: "Education",
    goal: "3.2",
    duration: 60
  }
];

async function createSampleCampaigns() {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    console.log("📝 Creating sample campaigns...");
    
    for (let i = 0; i < campaigns.length; i++) {
      const campaign = campaigns[i];
      const privateKey = accounts[i];
      
      console.log(`\n🎯 Creating: ${campaign.title}`);
      
      const signer = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CROWDFUNDING_ABI, signer);
      
      const tx = await contract.createCampaign(
        campaign.title,
        campaign.description,
        "/hero-image.png",
        campaign.category,
        ethers.parseEther(campaign.goal),
        campaign.duration
      );
      
      console.log(`   📤 Transaction: ${tx.hash}`);
      await tx.wait();
      console.log(`   ✅ Campaign ${i} created successfully`);
      
      // Small delay between campaigns
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n🎉 All ${campaigns.length} sample campaigns created successfully!`);
    console.log("🌐 Ready for demonstration!");
    
  } catch (error) {
    console.error("❌ Error creating campaigns:", error.message);
    process.exit(1);
  }
}

createSampleCampaigns();
