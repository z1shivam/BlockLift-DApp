import { ethers } from 'ethers';
import { toast } from 'sonner';

// Enhanced Contract ABI for production contract
const CROWDFUNDING_ABI = [
  "function createCampaign(string _title, string _description, string _imageHash, string _category, uint256 _goal, uint256 _durationInDays) external returns (uint256)",
  "function contribute(uint256 campaignId) external payable",
  "function withdrawFunds(uint256 campaignId) external",
  "function claimRefund(uint256 campaignId) external",
  "function cancelCampaign(uint256 campaignId) external",
  "function getCampaignDetails(uint256 campaignId) external view returns (address, string, string, string, string, uint256, uint256, uint256, uint256, bool, bool, bool, uint256)",
  "function getContribution(uint256 campaignId, address contributor) external view returns (uint256)",
  "function getCampaignStats(uint256 campaignId) external view returns (uint256, uint256, uint256, bool)",
  "function getPlatformStats() external view returns (uint256, uint256, uint256, uint256, uint256)",
  "function canClaimRefund(uint256 campaignId, address contributor) external view returns (bool)",
  "function campaignCounter() external view returns (uint256)",
  "event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, uint256 goal, uint256 deadline, string category, uint256 timestamp)",
  "event ContributionMade(uint256 indexed campaignId, address indexed contributor, uint256 amount, uint256 newTotal, uint256 timestamp)",
  "event GoalReached(uint256 indexed campaignId, uint256 totalRaised, uint256 timestamp)"
];

// Contract address - Update this after deployment
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x742d35Cc6634C0532925a3b8D93C7C5b8e0C8B23";

export interface CampaignDetails {
  id: number;
  creator: string;
  title: string;
  description: string;
  imageHash: string;
  category: string;
  goal: string;
  deadline: number;
  totalRaised: string;
  createdAt: number;
  goalReached: boolean;
  fundsWithdrawn: boolean;
  isActive: boolean;
  contributorCount: number;
}

export interface CampaignStats {
  percentageFunded: number;
  timeLeft: number;
  contributorCount: number;
  isExpired: boolean;
}

export interface PlatformStats {
  totalCampaigns: number;
  totalFundsRaised: string;
  successfulCampaigns: number;
  totalContributors: number;
  platformFeesCollected: string;
}

export class Web3CrowdfundingService {
  private contract: any = null;
  private readOnlyContract: any = null;
  private provider: ethers.BrowserProvider | null = null;
  private readOnlyProvider: ethers.JsonRpcProvider | null = null;
  private signer: ethers.Signer | null = null;

  // Initialize for read-only operations (no MetaMask required)
  async initializeReadOnly() {
    try {
      this.readOnlyProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:8545");
      this.readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CROWDFUNDING_ABI, this.readOnlyProvider);
    } catch (error) {
      console.error("Failed to initialize read-only Web3 service:", error);
      throw new Error("Failed to connect to blockchain for reading data.");
    }
  }

  // Initialize for write operations (MetaMask required)
  async initializeWithWallet() {
    if (!window.ethereum) {
      throw new Error("MetaMask not found. Please install MetaMask to use this feature.");
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CROWDFUNDING_ABI, this.signer);
    } catch (error) {
      console.error("Failed to initialize Web3 service:", error);
      throw new Error("Failed to connect to blockchain. Please check your MetaMask connection.");
    }
  }

  private async ensureReadOnlyInitialized() {
    if (!this.readOnlyContract) {
      await this.initializeReadOnly();
    }
  }

  private async ensureWalletInitialized() {
    if (!this.contract) {
      await this.initializeWithWallet();
    }
  }

  // Create a new campaign
  async createCampaign(
    title: string,
    description: string,
    imageHash: string,
    category: string,
    goalInEth: number,
    durationInDays: number
  ): Promise<{ success: boolean; campaignId?: number; txHash?: string }> {
    try {
      await this.ensureWalletInitialized();

      // Validate inputs before sending to blockchain
      if (!title || title.length === 0 || title.length > 100) {
        toast.error("❌ Title must be between 1-100 characters");
        return { success: false };
      }
      
      if (!description || description.length < 50 || description.length > 1000) {
        toast.error("❌ Description must be between 50-1000 characters");
        return { success: false };
      }
      
      if (goalInEth < 0.01 || goalInEth > 1000) {
        toast.error("❌ Goal must be between 0.01-1000 ETH");
        return { success: false };
      }
      
      if (durationInDays < 1 || durationInDays > 365) {
        toast.error("❌ Duration must be between 1-365 days");
        return { success: false };
      }

      const goalInWei = ethers.parseEther(goalInEth.toString());
      
      console.log("Creating campaign with:", {
        title,
        description: description.substring(0, 50) + "...",
        imageHash,
        category,
        goalInWei: goalInWei.toString(),
        durationInDays
      });
      
      toast.info("🔄 Creating campaign... Please confirm the transaction in MetaMask");
      
      const tx = await this.contract.createCampaign(
        title,
        description,
        imageHash,
        category,
        goalInWei,
        durationInDays
      );

      toast.info("⏳ Transaction submitted. Waiting for blockchain confirmation...");
      const receipt = await tx.wait();

      toast.success("✅ Campaign created successfully!");
      return { success: true, txHash: receipt.hash };
    } catch (error: any) {
      console.error("Create campaign error:", error);
      
      // More specific error handling
      if (error.code === 'ACTION_REJECTED') {
        toast.error("❌ Transaction cancelled by user");
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        toast.error("❌ Insufficient funds for transaction");
      } else if (error.message?.includes('InvalidCampaignParameters')) {
        toast.error("❌ Invalid campaign parameters. Check title (1-100 chars), description (50-1000 chars), and goal (0.01-1000 ETH)");
      } else if (error.message?.includes('CampaignDurationInvalid')) {
        toast.error("❌ Invalid campaign duration. Must be between 1-365 days");
      } else if (error.message?.includes('Function not found')) {
        toast.error("❌ Contract function not found. Please redeploy the contract");
      } else {
        toast.error(`❌ Failed to create campaign: ${error.reason || error.message}`);
      }
      return { success: false };
    }
  }

  // Contribute to a campaign
  async contribute(
    campaignId: number,
    amountInEth: number
  ): Promise<{ success: boolean; txHash?: string }> {
    try {
      await this.ensureWalletInitialized();

      const amountInWei = ethers.parseEther(amountInEth.toString());
      
      toast.info("🔄 Processing contribution... Please confirm the transaction in MetaMask");
      
      const tx = await this.contract.contribute(campaignId, {
        value: amountInWei
      });

      toast.info("⏳ Transaction submitted. Waiting for blockchain confirmation...");
      const receipt = await tx.wait();

      toast.success("✅ Contribution successful! Your funds are now held in escrow.");
      return { success: true, txHash: receipt.hash };
    } catch (error: any) {
      console.error("Contribute error:", error);
      if (error.code === 'ACTION_REJECTED') {
        toast.error("❌ Transaction cancelled by user");
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        toast.error("❌ Insufficient ETH balance for this contribution");
      } else {
        toast.error(`❌ Contribution failed: ${error.reason || error.message}`);
      }
      return { success: false };
    }
  }

  // Withdraw funds (for campaign creator)
  async withdrawFunds(campaignId: number): Promise<{ success: boolean; txHash?: string }> {
    try {
      await this.ensureWalletInitialized();

      toast.info("🔄 Withdrawing funds... Please confirm the transaction in MetaMask");
      
      const tx = await this.contract.withdrawFunds(campaignId);

      toast.info("⏳ Transaction submitted. Waiting for blockchain confirmation...");
      const receipt = await tx.wait();

      toast.success("✅ Funds withdrawn successfully!");
      return { success: true, txHash: receipt.hash };
    } catch (error: any) {
      console.error("Withdraw error:", error);
      if (error.code === 'ACTION_REJECTED') {
        toast.error("❌ Transaction cancelled by user");
      } else {
        toast.error(`❌ Withdrawal failed: ${error.reason || error.message}`);
      }
      return { success: false };
    }
  }

  // Claim refund
  async claimRefund(campaignId: number): Promise<{ success: boolean; txHash?: string }> {
    try {
      await this.ensureWalletInitialized();

      toast.info("🔄 Claiming refund... Please confirm the transaction in MetaMask");
      
      const tx = await this.contract.claimRefund(campaignId);

      toast.info("⏳ Transaction submitted. Waiting for blockchain confirmation...");
      const receipt = await tx.wait();

      toast.success("✅ Refund claimed successfully! ETH has been returned to your wallet.");
      return { success: true, txHash: receipt.hash };
    } catch (error: any) {
      console.error("Refund error:", error);
      if (error.code === 'ACTION_REJECTED') {
        toast.error("❌ Transaction cancelled by user");
      } else {
        toast.error(`❌ Refund failed: ${error.reason || error.message}`);
      }
      return { success: false };
    }
  }

  // Get campaign details from blockchain
  async getCampaignDetails(campaignId: number): Promise<CampaignDetails | null> {
    try {
      await this.ensureReadOnlyInitialized();

      const details = await this.readOnlyContract.getCampaignDetails(campaignId);
      
      return {
        id: campaignId,
        creator: details[0],
        title: details[1],
        description: details[2],
        imageHash: details[3],
        category: details[4],
        goal: ethers.formatEther(details[5]),
        deadline: Number(details[6]),
        totalRaised: ethers.formatEther(details[7]),
        createdAt: Number(details[8]),
        goalReached: details[9],
        fundsWithdrawn: details[10],
        isActive: details[11],
        contributorCount: Number(details[12])
      };
    } catch (error) {
      console.error("Get campaign details error:", error);
      return null;
    }
  }

  // Get campaign statistics
  async getCampaignStats(campaignId: number): Promise<CampaignStats | null> {
    try {
      await this.ensureReadOnlyInitialized();

      const stats = await this.readOnlyContract.getCampaignStats(campaignId);
      
      return {
        percentageFunded: Number(stats[0]),
        timeLeft: Number(stats[1]),
        contributorCount: Number(stats[2]),
        isExpired: stats[3]
      };
    } catch (error) {
      console.error("Get campaign stats error:", error);
      return null;
    }
  }

  // Get platform statistics
  async getPlatformStats(): Promise<PlatformStats | null> {
    try {
      await this.ensureReadOnlyInitialized();

      const stats = await this.readOnlyContract.getPlatformStats();
      
      return {
        totalCampaigns: Number(stats[0]),
        totalFundsRaised: ethers.formatEther(stats[1]),
        successfulCampaigns: Number(stats[2]),
        totalContributors: Number(stats[3]),
        platformFeesCollected: ethers.formatEther(stats[4])
      };
    } catch (error) {
      console.error("Get platform stats error:", error);
      return null;
    }
  }

  // Get user's contribution to a campaign
  async getUserContribution(campaignId: number, userAddress: string): Promise<number> {
    try {
      await this.ensureReadOnlyInitialized();

      const contribution = await this.readOnlyContract.getContribution(campaignId, userAddress);
      return parseFloat(ethers.formatEther(contribution));
    } catch (error) {
      console.error("Get contribution error:", error);
      return 0;
    }
  }

  // Check if user can claim refund
  async canClaimRefund(campaignId: number, userAddress: string): Promise<boolean> {
    try {
      await this.ensureReadOnlyInitialized();

      return await this.readOnlyContract.canClaimRefund(campaignId, userAddress);
    } catch (error) {
      console.error("Can claim refund error:", error);
      return false;
    }
  }

  // Get total number of campaigns
  async getTotalCampaigns(): Promise<number> {
    try {
      await this.ensureReadOnlyInitialized();

      const count = await this.readOnlyContract.campaignCounter();
      return Number(count);
    } catch (error) {
      console.error("Get total campaigns error:", error);
      return 0;
    }
  }

  // Get all campaigns (for homepage and browse page)
  async getAllCampaigns(startId = 0, limit = 20): Promise<CampaignDetails[]> {
    try {
      const totalCampaigns = await this.getTotalCampaigns();
      
      // If no campaigns exist, return empty array
      if (totalCampaigns === 0) {
        return [];
      }
      
      const campaigns: CampaignDetails[] = [];
      
      // Campaign IDs go from 0 to (totalCampaigns - 1)
      // Get campaigns in reverse order (newest first)
      const endId = Math.min(startId + limit, totalCampaigns);
      for (let i = endId - 1; i >= startId; i--) {
        const details = await this.getCampaignDetails(i);
        if (details && details.isActive) {
          campaigns.push(details);
        }
      }
      
      return campaigns;
    } catch (error) {
      console.error("Get all campaigns error:", error);
      return [];
    }
  }

  // Get campaigns by creator
  async getCampaignsByCreator(creatorAddress: string): Promise<CampaignDetails[]> {
    try {
      const totalCampaigns = await this.getTotalCampaigns();
      const campaigns: CampaignDetails[] = [];
      
      for (let i = 0; i < totalCampaigns; i++) {
        const details = await this.getCampaignDetails(i);
        if (details && details.creator.toLowerCase() === creatorAddress.toLowerCase()) {
          campaigns.push(details);
        }
      }
      
      return campaigns.reverse(); // newest first
    } catch (error) {
      console.error("Get campaigns by creator error:", error);
      return [];
    }
  }

  // Event listeners
  onCampaignCreated(callback: (campaignId: number, creator: string) => void) {
    if (!this.contract) return;

    this.contract.on("CampaignCreated", (campaignId: any, creator: any) => {
      callback(Number(campaignId), creator);
    });
  }

  onContributionMade(callback: (campaignId: number, contributor: string, amount: string) => void) {
    if (!this.contract) return;

    this.contract.on("ContributionMade", (campaignId: any, contributor: any, amount: any) => {
      callback(Number(campaignId), contributor, ethers.formatEther(amount));
    });
  }

  onGoalReached(callback: (campaignId: number, totalRaised: string) => void) {
    if (!this.contract) return;

    this.contract.on("GoalReached", (campaignId: any, totalRaised: any) => {
      callback(Number(campaignId), ethers.formatEther(totalRaised));
    });
  }

  // Cleanup event listeners
  removeAllListeners() {
    if (this.contract) {
      this.contract.removeAllListeners();
    }
  }
}

// Export singleton instance for global use
export const web3Service = new Web3CrowdfundingService();
