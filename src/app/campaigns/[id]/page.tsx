"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { CalendarDays, Users, Target, Share2, Heart, Flag, Loader2 } from "lucide-react";
import { henny_penny } from "@/components/global/Header";
import { blockchainDataService, type Campaign } from "@/lib/blockchainDataService";
import { web3Service } from "@/lib/web3Service";
import { toast } from "sonner";

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [contributing, setContributing] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [campaignId, setCampaignId] = useState<number | null>(null);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        setCampaignId(id);
        
        if (isNaN(id)) {
          setLoading(false);
          return;
        }

        // Get all campaigns and find the one with matching ID
        const campaigns = await blockchainDataService.getAllCampaigns();
        const foundCampaign = campaigns.find(c => c.id === id);
        
        if (foundCampaign) {
          setCampaign(foundCampaign);
        }
        
        // Check if user wallet is connected
        if (typeof window !== 'undefined' && window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
              setUserAddress(accounts[0]);
            }
          } catch (error) {
            console.error('Error checking wallet connection:', error);
          }
        }
      } catch (error) {
        console.error('Error loading campaign:', error);
        toast.error('Failed to load campaign details');
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [params]);

  const handleContribute = async () => {
    if (!campaign || !contributionAmount || !campaignId) {
      toast.error('Please enter a valid contribution amount');
      return;
    }

    // Check if wallet is connected
    if (!userAddress) {
      // Try to connect wallet first
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts.length > 0) {
            setUserAddress(accounts[0]);
          } else {
            toast.error('Please connect your MetaMask wallet');
            return;
          }
        } else {
          toast.error('MetaMask not found. Please install MetaMask to contribute.');
          return;
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast.error('Failed to connect wallet');
        return;
      }
    }

    // Check if user is trying to contribute to their own campaign
    if (userAddress && campaign.creator.toLowerCase() === userAddress.toLowerCase()) {
      toast.error('You cannot contribute to your own campaign');
      return;
    }

    try {
      setContributing(true);
      await web3Service.contribute(campaignId, parseFloat(contributionAmount));
      
      // Refresh campaign data after contribution
      const campaigns = await blockchainDataService.getAllCampaigns();
      const updatedCampaign = campaigns.find(c => c.id === campaignId);
      if (updatedCampaign) {
        setCampaign(updatedCampaign);
      }
      
      setContributionAmount("");
      toast.success('Contribution successful!');
    } catch (error) {
      console.error('Error contributing:', error);
      toast.error('Failed to contribute. Please try again.');
    } finally {
      setContributing(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading campaign details...</p>
        </div>
      </main>
    );
  }

  if (!campaign) {
    notFound();
  }

  const goalAmount = parseFloat(campaign.goal || '0');
  const currentAmount = parseFloat(campaign.totalRaised || '0');
  const progressPercentage = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
  const daysLeft = Math.ceil((campaign.deadline * 1000 - Date.now()) / (1000 * 3600 * 24));
  const isCompleted = campaign.goalReached;
  const isExpired = daysLeft < 0 && !isCompleted;
  const isOwnCampaign = userAddress && campaign.creator.toLowerCase() === userAddress.toLowerCase();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Campaign Image and Gallery */}
          <div className="lg:col-span-2">
            <div className="relative h-96 w-full rounded-xl overflow-hidden mb-4">
              <Image
                src={campaign.imageHash || "/hero-image.png"}
                alt={campaign.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant={isCompleted ? "default" : isExpired ? "destructive" : "secondary"}>
                  {isCompleted ? "Successfully Funded" : isExpired ? "Campaign Expired" : "Active Campaign"}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-white/90">
                  {campaign.category}
                </Badge>
              </div>
            </div>

            {/* Campaign Title and Creator */}
            <div className="mb-6">
              <h1 className={`${henny_penny.className} text-3xl font-bold text-emerald-900 mb-3`}>
                {campaign.title}
              </h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-emerald-600 text-white">
                      {campaign.creator.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {campaign.creator.slice(0, 6)}...{campaign.creator.slice(-4)}
                    </p>
                    <p className="text-sm text-gray-500">Campaign Creator</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="h-4 w-4 mr-1" />
                    Report
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Funding Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-emerald-900">Funding Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-emerald-800">
                      {currentAmount.toFixed(4)} ETH
                    </span>
                    <span className="text-sm text-gray-500">
                      {progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.min(progressPercentage, 100)} className="h-3 mb-2" />
                  <p className="text-sm text-gray-600">
                    of {goalAmount.toFixed(4)} ETH goal
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-800">{campaign.contributorCount}</div>
                    <div className="text-sm text-gray-600">Contributors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-800">
                      {isCompleted ? "Completed" : isExpired ? "Expired" : daysLeft}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isCompleted ? "" : isExpired ? "" : "Days Left"}
                    </div>
                  </div>
                </div>

                {/* Contribute Section */}
                {!isExpired && !isCompleted && (
                  <div className="space-y-3">
                    {isOwnCampaign ? (
                      <div className="text-center p-4 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-600">This is your campaign</p>
                        <p className="text-xs text-gray-500 mt-1">You cannot contribute to your own campaign</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Contribution Amount (ETH)
                          </label>
                          <Input
                            type="number"
                            placeholder="0.01"
                            step="0.001"
                            min="0"
                            value={contributionAmount}
                            onChange={(e) => setContributionAmount(e.target.value)}
                          />
                        </div>
                        <Button 
                          onClick={handleContribute}
                          disabled={contributing || !contributionAmount}
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                          {contributing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Contributing...
                            </>
                          ) : !userAddress ? (
                            'Connect Wallet & Support'
                          ) : (
                            'Support This Campaign'
                          )}
                        </Button>
                        {!userAddress && (
                          <p className="text-xs text-gray-500 text-center mt-2">
                            MetaMask will be required to contribute
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Campaign Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>Deadline: {new Date(campaign.deadline * 1000).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>Created: {new Date(campaign.createdAt * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="story" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="story">Campaign Story</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="contributors">Contributors ({campaign.contributorCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="story" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {campaign.description}
                  </p>
                  <div className="whitespace-pre-wrap text-gray-700">
                    {campaign.description || 'No detailed story provided for this campaign.'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="updates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>No updates posted yet.</p>
                  <p className="text-sm">Campaign creators will post updates here as the project progresses.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contributors" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">{campaign.contributorCount} Contributors</p>
                  <p className="text-sm mt-2">Contributor details are kept private for security.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
