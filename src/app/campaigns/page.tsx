"use client";

import { useState, useEffect } from "react";
import CampaignCard from "@/components/global/CampaignCard";
import { henny_penny } from "@/components/global/Header";
import { blockchainDataService, type Campaign } from "@/lib/blockchainDataService";
import { Loader2 } from "lucide-react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalRaised: 0,
    totalContributors: 0,
    activeCampaigns: 0
  });

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load campaigns and platform stats
        const [campaignsData, platformStats] = await Promise.all([
          blockchainDataService.getAllCampaigns(),
          blockchainDataService.getPlatformStats()
        ]);

        setCampaigns(campaignsData);
        setStats({
          totalCampaigns: platformStats?.totalCampaigns || 0,
          totalRaised: parseFloat(platformStats?.totalFundsRaised || '0'),
          totalContributors: platformStats?.totalContributors || 0,
          activeCampaigns: campaignsData.filter(c => !c.goalReached && Date.now() < c.deadline * 1000).length
        });
      } catch (err) {
        console.error('Error loading campaigns:', err);
        setError('Failed to load campaigns. Make sure you\'re connected to the correct network.');
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  const activeCampaigns = campaigns.filter(campaign => 
    !campaign.goalReached && Date.now() < campaign.deadline * 1000
  );
  
  const completedCampaigns = campaigns.filter(campaign => 
    campaign.goalReached || Date.now() >= campaign.deadline * 1000
  );

  // Filter campaigns by selected category
  const filteredActiveCampaigns = selectedCategory === 'All' 
    ? activeCampaigns 
    : activeCampaigns.filter(campaign => campaign.category === selectedCategory);
  
  const filteredCompletedCampaigns = selectedCategory === 'All' 
    ? completedCampaigns 
    : completedCampaigns.filter(campaign => campaign.category === selectedCategory);

  const categories = ['All', 'Technology', 'Education', 'Healthcare', 'Art & Culture', 'Agriculture'];

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-600" />
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Campaigns</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className={`${henny_penny.className} text-4xl font-bold text-emerald-900 mb-4`}>
            Discover Amazing Campaigns
          </h1>
          <p className="text-lg text-emerald-700 max-w-2xl mx-auto">
            Support innovative projects and make a difference in the world through decentralized crowdfunding.
          </p>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-emerald-800">{stats.totalCampaigns}</div>
            <div className="text-sm text-gray-600">Total Campaigns</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-emerald-800">{stats.activeCampaigns}</div>
            <div className="text-sm text-gray-600">Active Campaigns</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-emerald-800">
              {stats.totalRaised.toFixed(2)} ETH
            </div>
            <div className="text-sm text-gray-600">Total Raised</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-emerald-800">
              {stats.totalContributors}
            </div>
            <div className="text-sm text-gray-600">Contributors</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category === 'All' ? 'All Campaigns' : category}
            </button>
          ))}
        </div>

        {/* Active Campaigns */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">
            Active Campaigns
            {selectedCategory !== 'All' && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                in {selectedCategory}
              </span>
            )}
          </h2>
          {filteredActiveCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActiveCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No active campaigns found</p>
              {selectedCategory !== 'All' && (
                <p className="text-sm mt-2">Try selecting a different category</p>
              )}
            </div>
          )}
        </section>

        {/* Completed Campaigns */}
        <section>
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">
            Successfully Funded
            {selectedCategory !== 'All' && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                in {selectedCategory}
              </span>
            )}
          </h2>
          {filteredCompletedCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompletedCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No completed campaigns found</p>
              {selectedCategory !== 'All' && (
                <p className="text-sm mt-2">Try selecting a different category</p>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
