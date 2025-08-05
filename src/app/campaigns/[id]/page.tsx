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
import { CalendarDays, Users, Target, Share2, Heart, Flag, Loader2, Wallet, DollarSign } from "lucide-react";
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
  const [withdrawing, setWithdrawing] = useState(false);
  const [claimingRefund, setClaimingRefund] = useState(false);
  const [userContribution, setUserContribution] = useState<number>(0);
  const [canClaimRefund, setCanClaimRefund] = useState(false);

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
              
              // Get user's contribution and refund eligibility if campaign exists
              if (foundCampaign) {
                try {
                  const contribution = await web3Service.getUserContribution(id, accounts[0]);
                  setUserContribution(contribution);
                  
                  const canRefund = await web3Service.canClaimRefund(id, accounts[0]);
                  setCanClaimRefund(canRefund);
                } catch (error) {
                  console.error('Error fetching user contribution data:', error);
                }
              }
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

  const handleWithdrawFunds = async () => {
    if (!campaignId || !userAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setWithdrawing(true);
      const result = await web3Service.withdrawFunds(campaignId);
      
      if (result.success) {
        // Refresh campaign data
        const campaigns = await blockchainDataService.getAllCampaigns();
        const updatedCampaign = campaigns.find(c => c.id === campaignId);
        if (updatedCampaign) {
          setCampaign(updatedCampaign);
        }
      }
    } catch (error) {
      console.error('Withdraw error:', error);
      toast.error('Failed to withdraw funds');
    } finally {
      setWithdrawing(false);
    }
  };

  const handleClaimRefund = async () => {
    if (!campaignId || !userAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setClaimingRefund(true);
      const result = await web3Service.claimRefund(campaignId);
      
      if (result.success) {
        // Update user contribution data
        setUserContribution(0);
        setCanClaimRefund(false);
        
        // Refresh campaign data
        const campaigns = await blockchainDataService.getAllCampaigns();
        const updatedCampaign = campaigns.find(c => c.id === campaignId);
        if (updatedCampaign) {
          setCampaign(updatedCampaign);
        }
      }
    } catch (error) {
      console.error('Refund error:', error);
      toast.error('Failed to claim refund');
    } finally {
      setClaimingRefund(false);
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
                src={campaign.imageHash || "/placeholder.png"}
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

                {/* Creator Withdraw Section */}
                {isOwnCampaign && isCompleted && !campaign.fundsWithdrawn && (
                  <div className="space-y-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-center">
                      <h3 className="font-semibold text-emerald-800">🎉 Goal Reached!</h3>
                      <p className="text-sm text-emerald-700 mt-1">
                        Your campaign was successful! You can now withdraw the funds.
                      </p>
                      <p className="text-xs text-emerald-600 mt-2">
                        You'll receive {((parseFloat(campaign.totalRaised) * 97.5) / 100).toFixed(4)} ETH 
                        (after 2.5% platform fee)
                      </p>
                    </div>
                    <Button 
                      onClick={handleWithdrawFunds}
                      disabled={withdrawing}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      {withdrawing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Withdrawing...
                        </>
                      ) : (
                        '💰 Withdraw Funds to MetaMask'
                      )}
                    </Button>
                  </div>
                )}

                {/* Funds Already Withdrawn */}
                {isOwnCampaign && campaign.fundsWithdrawn && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-center">
                      <h3 className="font-semibold text-green-800">✅ Funds Withdrawn</h3>
                      <p className="text-sm text-green-700 mt-1">
                        Campaign funds have been successfully withdrawn to your wallet.
                      </p>
                    </div>
                  </div>
                )}

                {/* User Contribution Info */}
                {!isOwnCampaign && userAddress && userContribution > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <h3 className="font-semibold text-blue-800">Your Contribution</h3>
                      <p className="text-lg font-bold text-blue-900">{userContribution.toFixed(4)} ETH</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Thank you for supporting this campaign!
                      </p>
                    </div>
                  </div>
                )}

                {/* Refund Section */}
                {!isOwnCampaign && userAddress && canClaimRefund && userContribution > 0 && (
                  <div className="space-y-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-center">
                      <h3 className="font-semibold text-orange-800">💔 Campaign Not Funded</h3>
                      <p className="text-sm text-orange-700 mt-1">
                        This campaign didn't reach its goal. You can claim a full refund.
                      </p>
                      <p className="text-lg font-bold text-orange-900 mt-2">
                        Refund Available: {userContribution.toFixed(4)} ETH
                      </p>
                    </div>
                    <Button 
                      onClick={handleClaimRefund}
                      disabled={claimingRefund}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      {claimingRefund ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Claiming Refund...
                        </>
                      ) : (
                        '💸 Claim Refund to MetaMask'
                      )}
                    </Button>
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

            {/* Money Flow Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  How Fund Distribution Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">💰 When You Contribute</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Your ETH goes to a smart contract (escrow)</li>
                        <li>• Funds are NOT sent to creator immediately</li>
                        <li>• Your contribution is tracked on blockchain</li>
                        <li>• Maximum 150% of goal can be raised</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Campaign Succeeds</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Creator can withdraw funds to their MetaMask</li>
                        <li>• 97.5% goes to creator</li>
                        <li>• 2.5% platform fee collected</li>
                        <li>• Funds transfer as ETH cryptocurrency</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">❌ Campaign Fails</h4>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Contributors can claim full refunds</li>
                        <li>• 100% of your contribution returned</li>
                        <li>• Refund goes to your MetaMask wallet</li>
                        <li>• Creator gets nothing</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">🔒 Security Features</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Smart contract holds funds (not humans)</li>
                        <li>• Creators can't contribute to own campaigns</li>
                        <li>• Automatic refunds for failed campaigns</li>
                        <li>• Transparent on blockchain</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> This is a Web3 platform using cryptocurrency (ETH). 
                    Funds are distributed to MetaMask wallets, not traditional bank accounts. 
                    You can transfer ETH to exchanges to convert to fiat currency if needed.
                  </p>
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
