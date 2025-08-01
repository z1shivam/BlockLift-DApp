"use client";

import { useState, useEffect } from "react";
import { blockchainDataService } from "@/lib/blockchainDataService";
import type { Campaign } from "@/lib/blockchainDataService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { henny_penny } from "@/components/global/Header";
import { 
  Wallet, 
  TrendingUp, 
  Calendar,
  Award,
  History,
  ExternalLink,
  PieChart,
  Plus,
  User,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userAddress, setUserAddress] = useState<string>("");
  const [createdCampaigns, setCreatedCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user's wallet address and fetch campaigns
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user's wallet address from MetaMask
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            const address = accounts[0];
            setUserAddress(address);

            // Fetch campaigns created by this user
            const userCampaigns = await blockchainDataService.getUserCampaigns(address);
            setCreatedCampaigns(userCampaigns);
          } else {
            setError("Please connect your MetaMask wallet to view your dashboard.");
          }
        } else {
          setError("MetaMask not found. Please install MetaMask to use this feature.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Calculate statistics
  const totalCreated = createdCampaigns.length;
  const activeCampaigns = createdCampaigns.filter(campaign => 
    campaign.isActive && !campaign.goalReached
  ).length;
  const completedCampaigns = createdCampaigns.filter(campaign => 
    campaign.goalReached
  ).length;
  const totalRaisedByUser = createdCampaigns.reduce((sum, campaign) => 
    sum + parseFloat(campaign.totalRaised || '0'), 0
  );

  const userName = userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : "Not Connected";

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700"
            >
              Retry
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-emerald-600 text-white text-xl">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className={`${henny_penny.className} text-3xl font-bold text-emerald-900`}>
                  Creator Dashboard
                </h1>
                <p className="text-gray-600">
                  {userName}
                </p>
                <Badge variant="outline" className="mt-1">
                  <Wallet className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link href="/create-campaign">
                <Button className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-6 py-3">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Browse Campaigns
                </Button>
              </Link>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-emerald-700">{totalCreated}</div>
                    <div className="text-sm text-emerald-600">Total Campaigns</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-700">{activeCampaigns}</div>
                    <div className="text-sm text-blue-600">Active Campaigns</div>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-700">{completedCampaigns}</div>
                    <div className="text-sm text-green-600">Completed</div>
                  </div>
                  <Award className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-700">
                      {totalRaisedByUser.toFixed(3)} ETH
                    </div>
                    <div className="text-sm text-purple-600">Total Raised</div>
                  </div>
                  <PieChart className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Campaign Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Campaign Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Success Rate</span>
                      <span className="font-bold text-green-600">
                        {totalCreated > 0 
                          ? ((completedCampaigns / totalCreated) * 100).toFixed(1)
                          : '0'
                        }%
                      </span>
                    </div>
                    <Progress 
                      value={totalCreated > 0 ? (completedCampaigns / totalCreated) * 100 : 0} 
                      className="h-2" 
                    />
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{completedCampaigns}</div>
                        <div className="text-xs text-gray-500">Successful</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-600">
                          {totalCreated - completedCampaigns}
                        </div>
                        <div className="text-xs text-gray-500">In Progress</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/create-campaign" className="block">
                    <Button className="w-full justify-start bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Campaign
                    </Button>
                  </Link>
                  <Link href="/campaigns" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Browse All Campaigns
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <PieChart className="h-4 w-4 mr-2" />
                    Analytics (Coming Soon)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Created Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                {createdCampaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">
                      You haven't created any campaigns yet.
                    </div>
                    <Link href="/create-campaign">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Campaign
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {createdCampaigns.map((campaign) => {
                      const goalAmount = parseFloat(campaign.goal || '0');
                      const raisedAmount = parseFloat(campaign.totalRaised || '0');
                      const progressPercentage = goalAmount > 0 ? (raisedAmount / goalAmount) * 100 : 0;
                      const daysLeft = Math.ceil((campaign.deadline * 1000 - Date.now()) / (1000 * 3600 * 24));
                      
                      return (
                        <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {campaign.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {campaign.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant={campaign.goalReached ? "default" : campaign.isActive ? "secondary" : "destructive"}>
                                  {campaign.goalReached ? "Goal Reached" : campaign.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <Badge variant="outline">{campaign.category}</Badge>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="font-bold text-emerald-700 mb-1">
                                {raisedAmount.toFixed(4)} ETH raised
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                Goal: {goalAmount.toFixed(4)} ETH
                              </div>
                              <Link href={`/campaigns/${campaign.id}`}>
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View Campaign
                                </Button>
                              </Link>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress: {progressPercentage.toFixed(1)}%</span>
                              <span>
                                {campaign.goalReached 
                                  ? "Goal Reached!" 
                                  : daysLeft > 0 
                                    ? `${daysLeft} days left` 
                                    : "Campaign Ended"
                                }
                              </span>
                            </div>
                            <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{campaign.contributorCount} contributors</span>
                              <span>Created {new Date(campaign.createdAt * 1000).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
