import { web3Service } from './web3Service';
import type { CampaignDetails, PlatformStats } from './web3Service';

// Export types for use in components
export type { CampaignDetails as Campaign, PlatformStats } from './web3Service';

// Real blockchain data service
export class BlockchainDataService {
  
  // Get all campaigns
  async getAllCampaigns(startIndex = 0, limit = 50): Promise<CampaignDetails[]> {
    try {
      return await web3Service.getAllCampaigns(startIndex, limit);
    } catch (error) {
      console.error("Error fetching all campaigns:", error);
      return [];
    }
  }

  // Get platform statistics  
  async getPlatformStats(): Promise<PlatformStats | null> {
    try {
      return await web3Service.getPlatformStats();
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      return null;
    }
  }
  
  // Get all active campaigns for homepage
  async getActiveCampaigns(limit = 6): Promise<CampaignDetails[]> {
    try {
      const campaigns = await web3Service.getAllCampaigns(0, limit);
      return campaigns.filter(campaign => campaign.isActive);
    } catch (error) {
      console.error("Error fetching active campaigns:", error);
      return [];
    }
  }

  // Get campaigns by category
  async getCampaignsByCategory(category: string, limit = 10): Promise<CampaignDetails[]> {
    try {
      const allCampaigns = await web3Service.getAllCampaigns(0, 50); // Get more to filter
      return allCampaigns
        .filter(campaign => campaign.category === category && campaign.isActive)
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching campaigns by category:", error);
      return [];
    }
  }

  // Get featured campaigns (high funding percentage or close to deadline)
  async getFeaturedCampaigns(limit = 3): Promise<CampaignDetails[]> {
    try {
      const allCampaigns = await web3Service.getAllCampaigns(0, 20);
      
      // Sort by funding percentage and recent activity
      const featuredCampaigns = allCampaigns
        .filter(campaign => campaign.isActive)
        .map(campaign => {
          const fundingPercentage = (parseFloat(campaign.totalRaised) / parseFloat(campaign.goal)) * 100;
          const timeLeft = campaign.deadline - Date.now() / 1000;
          const daysLeft = timeLeft / (24 * 60 * 60);
          
          // Score based on funding percentage and urgency
          const score = fundingPercentage + (daysLeft < 7 ? 50 : 0) + (fundingPercentage > 75 ? 30 : 0);
          
          return { ...campaign, score, fundingPercentage, daysLeft };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return featuredCampaigns;
    } catch (error) {
      console.error("Error fetching featured campaigns:", error);
      return [];
    }
  }

  // Get platform statistics
  async getPlatformStatistics(): Promise<PlatformStats | null> {
    try {
      return await web3Service.getPlatformStats();
    } catch (error) {
      console.error("Error fetching platform statistics:", error);
      return null;
    }
  }

  // Get campaigns created by a specific user
  async getUserCampaigns(userAddress: string): Promise<CampaignDetails[]> {
    try {
      return await web3Service.getCampaignsByCreator(userAddress);
    } catch (error) {
      console.error("Error fetching user campaigns:", error);
      return [];
    }
  }

  // Get a single campaign with additional stats
  async getCampaignWithStats(campaignId: number): Promise<CampaignDetails & { stats?: any } | null> {
    try {
      const campaign = await web3Service.getCampaignDetails(campaignId);
      if (!campaign) return null;

      // Add additional stats calculation here if needed
      const fundingPercentage = (parseFloat(campaign.totalRaised) / parseFloat(campaign.goal)) * 100;
      const timeLeft = campaign.deadline - Date.now() / 1000;
      const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60));

      return {
        ...campaign,
        stats: {
          fundingPercentage: fundingPercentage.toFixed(2),
          daysLeft: Math.max(0, daysLeft),
          isExpired: daysLeft < 0,
          isFullyFunded: fundingPercentage >= 100
        }
      };
    } catch (error) {
      console.error("Error fetching campaign with stats:", error);
      return null;
    }
  }

  // Search campaigns by title or description
  async searchCampaigns(query: string, limit = 10): Promise<CampaignDetails[]> {
    try {
      const allCampaigns = await web3Service.getAllCampaigns(0, 50);
      const searchTerm = query.toLowerCase();
      
      return allCampaigns
        .filter(campaign => 
          campaign.isActive && 
          (campaign.title.toLowerCase().includes(searchTerm) ||
           campaign.description.toLowerCase().includes(searchTerm))
        )
        .slice(0, limit);
    } catch (error) {
      console.error("Error searching campaigns:", error);
      return [];
    }
  }

  // Get trending campaigns (recently created or highly funded)
  async getTrendingCampaigns(limit = 5): Promise<CampaignDetails[]> {
    try {
      const allCampaigns = await web3Service.getAllCampaigns(0, 30);
      
      // Calculate trending score based on recent activity and funding
      const trendingCampaigns = allCampaigns
        .filter(campaign => campaign.isActive)
        .map(campaign => {
          const fundingPercentage = (parseFloat(campaign.totalRaised) / parseFloat(campaign.goal)) * 100;
          const ageInDays = (Date.now() / 1000 - campaign.createdAt) / (24 * 60 * 60);
          
          // Higher score for newer campaigns with good funding
          const trendingScore = fundingPercentage + (ageInDays < 7 ? 100 : 50) + campaign.contributorCount * 5;
          
          return { ...campaign, trendingScore };
        })
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, limit);

      return trendingCampaigns;
    } catch (error) {
      console.error("Error fetching trending campaigns:", error);
      return [];
    }
  }

  // Get user's contribution history
  async getUserContributions(userAddress: string): Promise<Array<{
    campaignId: number;
    amount: string;
    timestamp: number;
    campaignTitle: string;
  }>> {
    try {
      const allCampaigns = await web3Service.getAllCampaigns(0, 100);
      const contributions: Array<{
        campaignId: number;
        amount: string;
        timestamp: number;
        campaignTitle: string;
      }> = [];

      // This would need to be implemented in the smart contract
      // For now, return empty array
      return contributions;
    } catch (error) {
      console.error("Error fetching user contributions:", error);
      return [];
    }
  }

  // Real-time campaign updates (would use WebSocket in production)
  async getCampaignUpdates(campaignId: number): Promise<CampaignDetails | null> {
    return this.getCampaignWithStats(campaignId);
  }

  // Helper method to format campaign data for display
  formatCampaignForDisplay(campaign: CampaignDetails): any {
    const fundingPercentage = (parseFloat(campaign.totalRaised) / parseFloat(campaign.goal)) * 100;
    const timeLeft = campaign.deadline - Date.now() / 1000;
    const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60));

    return {
      ...campaign,
      fundingPercentage: fundingPercentage.toFixed(2),
      daysLeft: Math.max(0, daysLeft),
      isExpired: daysLeft < 0,
      isFullyFunded: fundingPercentage >= 100,
      formattedGoal: parseFloat(campaign.goal).toFixed(4),
      formattedRaised: parseFloat(campaign.totalRaised).toFixed(4)
    };
  }
}

// Export singleton instance
export const blockchainDataService = new BlockchainDataService();
