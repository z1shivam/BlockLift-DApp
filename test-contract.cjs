const { ethers } = require('ethers');

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RPC_URL = "http://localhost:8545";

const CROWDFUNDING_ABI = [
  "function createCampaign(string _title, string _description, string _imageHash, string _category, uint256 _goal, uint256 _durationInDays) external returns (uint256)",
  "function campaignCounter() external view returns (uint256)",
  "function getPlatformStats() external view returns (uint256, uint256, uint256, uint256, uint256)"
];

async function testContract() {
  try {
    console.log("🔍 Testing contract connection...");
    
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CROWDFUNDING_ABI, provider);
    
    // Test read-only function
    console.log("📊 Testing campaignCounter...");
    const counter = await contract.campaignCounter();
    console.log("✅ Campaign counter:", counter.toString());
    
    // Test platform stats
    console.log("📈 Testing getPlatformStats...");
    const stats = await contract.getPlatformStats();
    console.log("✅ Platform stats:", stats.toString());
    
    // Test create campaign with a signer
    console.log("🔑 Testing with wallet...");
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const signer = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, CROWDFUNDING_ABI, signer);
    
    console.log("🧪 Testing createCampaign function (dry run)...");
    
    // Test parameters that should pass validation
    const testTitle = "Test Campaign";
    const testDescription = "This is a test description that is long enough to pass the 50 character minimum requirement for campaign descriptions.";
    const testImageHash = "/test-image.png";
    const testCategory = "Technology";
    const testGoal = ethers.parseEther("1.0"); // 1 ETH
    const testDuration = 30; // 30 days
    
    console.log("📝 Test parameters:");
    console.log("  Title:", testTitle, `(${testTitle.length} chars)`);
    console.log("  Description:", testDescription.substring(0, 50) + "...", `(${testDescription.length} chars)`);
    console.log("  Goal:", ethers.formatEther(testGoal), "ETH");
    console.log("  Duration:", testDuration, "days");
    
    // Try to estimate gas (this will fail if the function doesn't exist)
    try {
      const gasEstimate = await contractWithSigner.createCampaign.estimateGas(
        testTitle,
        testDescription,
        testImageHash,
        testCategory,
        testGoal,
        testDuration
      );
      console.log("✅ Gas estimate successful:", gasEstimate.toString());
      console.log("✅ Contract function exists and parameters are valid!");
    } catch (gasError) {
      console.error("❌ Gas estimation failed:", gasError.message);
      
      // Check specific error types
      if (gasError.message.includes("Function not found")) {
        console.error("🔍 Function signature issue detected");
      } else if (gasError.message.includes("InvalidCampaignParameters")) {
        console.error("🔍 Parameter validation failed");
      } else if (gasError.message.includes("CampaignDurationInvalid")) {
        console.error("🔍 Duration validation failed");
      }
    }
    
  } catch (error) {
    console.error("❌ Contract test failed:", error.message);
  }
}

testContract();
