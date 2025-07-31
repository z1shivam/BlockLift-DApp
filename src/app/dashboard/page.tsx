"use client";

import { useState } from "react";
import { mockCampaigns, mockContributions } from "@/lib/staticData";
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
  PieChart
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data - in real app this would come from wallet connection
  const userAddress = "0x742d35Cc6634C0532925a3b8D93C7C5b8e0C8B23";
  const userName = "Anonymous Contributor";

  // Filter user's contributions
  const userContributions = mockContributions.filter(
    contribution => contribution.contributor === userAddress
  );

  // Calculate user's contributed campaigns
  const contributedCampaigns = mockCampaigns.filter(campaign => 
    userContributions.some(contribution => contribution.campaignId === campaign.id)
  );

  // Calculate statistics
  const totalContributed = userContributions.reduce((sum, contribution) => 
    sum + parseFloat(contribution.amount), 0
  );

  const averageContribution = userContributions.length > 0 
    ? totalContributed / userContributions.length 
    : 0;

  const successfulCampaigns = contributedCampaigns.filter(campaign => campaign.completed).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-emerald-600 text-white text-xl">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className={`${henny_penny.className} text-3xl font-bold text-emerald-900`}>
                Contributor Dashboard
              </h1>
              <p className="text-gray-600">
                {userAddress.slice(0, 8)}...{userAddress.slice(-6)}
              </p>
              <Badge variant="outline" className="mt-1">
                <Wallet className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-emerald-800">
                  {totalContributed.toFixed(3)} ETH
                </div>
                <div className="text-sm text-emerald-700">Total Contributed</div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-800">
                  {contributedCampaigns.length}
                </div>
                <div className="text-sm text-blue-700">Campaigns Supported</div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">
                  {successfulCampaigns}
                </div>
                <div className="text-sm text-green-700">Successful Campaigns</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <PieChart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-800">
                  {averageContribution.toFixed(3)} ETH
                </div>
                <div className="text-sm text-purple-700">Average Contribution</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userContributions.slice(0, 5).map((contribution) => {
                      const campaign = mockCampaigns.find(c => c.id === contribution.campaignId);
                      return (
                        <div key={contribution.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {campaign?.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(contribution.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-emerald-700">
                              +{contribution.amount} ETH
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Success Rate</span>
                      <span className="font-bold text-green-600">
                        {contributedCampaigns.length > 0 
                          ? ((successfulCampaigns / contributedCampaigns.length) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={contributedCampaigns.length > 0 
                        ? (successfulCampaigns / contributedCampaigns.length) * 100 
                        : 0} 
                      className="h-2"
                    />
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{successfulCampaigns}</div>
                        <div className="text-xs text-gray-600">Successful</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-600">
                          {contributedCampaigns.length - successfulCampaigns}
                        </div>
                        <div className="text-xs text-gray-600">In Progress</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaigns You've Supported</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contributedCampaigns.map((campaign) => {
                      const userContribution = userContributions.find(c => c.campaignId === campaign.id);
                      const progressPercentage = (parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100;
                      
                      return (
                        <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {campaign.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                by {campaign.creatorName}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant={campaign.completed ? "default" : "secondary"}>
                                  {campaign.completed ? "Completed" : "Active"}
                                </Badge>
                                <Badge variant="outline">{campaign.category}</Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-emerald-700 mb-1">
                                Your Contribution: {userContribution?.amount} ETH
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
                              <span>Progress: {campaign.raised} ETH / {campaign.goal} ETH</span>
                              <span>{progressPercentage.toFixed(1)}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userContributions.map((contribution) => {
                    const campaign = mockCampaigns.find(c => c.id === contribution.campaignId);
                    return (
                      <div key={contribution.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Contribution to "{campaign?.title}"
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(contribution.timestamp).toLocaleString()}
                            </p>
                            {contribution.message && (
                              <p className="text-sm text-gray-600 italic mt-1">
                                "{contribution.message}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-700">
                            {contribution.amount} ETH
                          </div>
                          <Badge variant="outline" className="mt-1">
                            Confirmed
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
