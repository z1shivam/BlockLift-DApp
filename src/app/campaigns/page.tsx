import { mockCampaigns } from "@/lib/staticData";
import CampaignCard from "@/components/global/CampaignCard";
import { henny_penny } from "@/components/global/Header";

export default function CampaignsPage() {
  const activeCampaigns = mockCampaigns.filter(campaign => !campaign.completed);
  const completedCampaigns = mockCampaigns.filter(campaign => campaign.completed);

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
            <div className="text-2xl font-bold text-emerald-800">{mockCampaigns.length}</div>
            <div className="text-sm text-gray-600">Total Campaigns</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-emerald-800">{activeCampaigns.length}</div>
            <div className="text-sm text-gray-600">Active Campaigns</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-emerald-800">
              {mockCampaigns.reduce((sum, campaign) => sum + parseFloat(campaign.raised), 0).toFixed(1)} ETH
            </div>
            <div className="text-sm text-gray-600">Total Raised</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-emerald-800">
              {mockCampaigns.reduce((sum, campaign) => sum + campaign.contributors, 0)}
            </div>
            <div className="text-sm text-gray-600">Contributors</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium">
            All Campaigns
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
            Technology
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
            Education
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
            Healthcare
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
            Art & Culture
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300">
            Agriculture
          </button>
        </div>

        {/* Active Campaigns */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">Active Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        {/* Completed Campaigns */}
        <section>
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">Successfully Funded</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
