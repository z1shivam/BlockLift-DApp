"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useWallet } from "@/contexts/WalletContext";
import { 
  Wallet, 
  Shield, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  ArrowLeftRight,
  Banknote
} from "lucide-react";

interface ContributionComponentProps {
  campaign: {
    id: number;
    title: string;
    creator: string;
    goal: string;
    raised: string;
    deadline: string;
    completed: boolean;
  };
}

export default function ContributionComponent({ campaign }: ContributionComponentProps) {
  const { account, isAuthenticated } = useWallet();
  const [contributionAmount, setContributionAmount] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  const [userContribution, setUserContribution] = useState(0);
  const [canRefund, setCanRefund] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState<'active' | 'successful' | 'failed' | 'expired'>('active');

  useEffect(() => {
    checkCampaignStatus();
    if (account) {
      loadUserContribution();
    }
  }, [account, campaign]);

  const checkCampaignStatus = () => {
    const now = new Date();
    const deadline = new Date(campaign.deadline);
    const goalReached = parseFloat(campaign.raised) >= parseFloat(campaign.goal);

    if (goalReached) {
      setCampaignStatus('successful');
    } else if (now > deadline) {
      setCampaignStatus('failed');
      setCanRefund(true);
    } else {
      setCampaignStatus('active');
    }
  };

  const loadUserContribution = () => {
    // In real app, this would call web3Service.getUserContribution()
    const savedContributions = localStorage.getItem('userContributions') || '{}';
    const contributions = JSON.parse(savedContributions);
    const userAmount = contributions[campaign.id] || 0;
    setUserContribution(userAmount);
  };

  const handleContribute = async () => {
    if (!isAuthenticated) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast.error("Please enter a valid contribution amount");
      return;
    }

    if (campaignStatus !== 'active') {
      toast.error("This campaign is no longer accepting contributions");
      return;
    }

    setIsContributing(true);

    try {
      // Simulate Web3 transaction
      toast.info("🔄 Sending transaction to smart contract...");
      
      // Simulate MetaMask confirmation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.info("⏳ Transaction submitted. Waiting for blockchain confirmation...");
      
      // Simulate blockchain confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update local storage (in real app, this would be handled by smart contract events)
      const amount = parseFloat(contributionAmount);
      const savedContributions = localStorage.getItem('userContributions') || '{}';
      const contributions = JSON.parse(savedContributions);
      contributions[campaign.id] = (contributions[campaign.id] || 0) + amount;
      localStorage.setItem('userContributions', JSON.stringify(contributions));

      // Update campaign data
      const newRaised = parseFloat(campaign.raised) + amount;
      const updatedCampaign = { ...campaign, raised: newRaised.toString() };
      
      // Save updated campaign (in real app, this would be on blockchain)
      const savedCampaigns = localStorage.getItem('campaigns') || '[]';
      const campaigns = JSON.parse(savedCampaigns);
      const campaignIndex = campaigns.findIndex((c: any) => c.id === campaign.id);
      if (campaignIndex !== -1) {
        campaigns[campaignIndex] = updatedCampaign;
        localStorage.setItem('campaigns', JSON.stringify(campaigns));
      }

      setUserContribution(contributions[campaign.id]);
      setContributionAmount("");

      toast.success("✅ Contribution successful! Funds are now held in escrow by the smart contract.");
      
    } catch (error) {
      toast.error("❌ Contribution failed. Please try again.");
      console.error("Contribution error:", error);
    } finally {
      setIsContributing(false);
    }
  };

  const handleRefund = async () => {
    if (!canRefund || !userContribution) {
      toast.error("Refund not available");
      return;
    }

    try {
      toast.info("🔄 Claiming refund from smart contract...");
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear user contribution
      const savedContributions = localStorage.getItem('userContributions') || '{}';
      const contributions = JSON.parse(savedContributions);
      delete contributions[campaign.id];
      localStorage.setItem('userContributions', JSON.stringify(contributions));

      setUserContribution(0);
      setCanRefund(false);

      toast.success(`✅ Refund successful! ${userContribution} ETH has been returned to your wallet.`);
      
    } catch (error) {
      toast.error("❌ Refund failed. Please try again.");
    }
  };

  const progressPercentage = (parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100;
  const rupeesValue = parseFloat(contributionAmount || "0") * 332820;

  return (
    <div className="space-y-6">
      {/* Campaign Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            Escrow Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Campaign Status:</span>
              <Badge 
                variant={campaignStatus === 'successful' ? 'default' : 
                        campaignStatus === 'failed' ? 'destructive' : 'secondary'}
              >
                {campaignStatus === 'active' && '🟢 Active'}
                {campaignStatus === 'successful' && '✅ Goal Reached'}
                {campaignStatus === 'failed' && '❌ Goal Not Met'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{campaign.raised} / {campaign.goal} ETH</span>
              </div>
              <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
              <div className="text-xs text-gray-500">
                {progressPercentage.toFixed(1)}% of goal reached
              </div>
            </div>

            {userContribution > 0 && (
              <Alert>
                <Wallet className="h-4 w-4" />
                <AlertDescription>
                  You have contributed <strong>{userContribution} ETH</strong> to this campaign.
                  {campaignStatus === 'active' && " Your funds are safely held in the smart contract escrow."}
                  {campaignStatus === 'successful' && " Funds will be released to the campaign creator."}
                  {campaignStatus === 'failed' && " You can claim a full refund."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contribution Form */}
      {campaignStatus === 'active' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-emerald-600" />
              Make a Contribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contribution Amount (ETH)
                {rupeesValue > 0 && (
                  <span className="ml-2 text-emerald-600 font-normal">
                    ≈ ₹{new Intl.NumberFormat('en-IN').format(rupeesValue)}
                  </span>
                )}
              </label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="0.00"
                className="border-2 border-emerald-300 focus:border-emerald-500"
              />
            </div>

            <Button
              onClick={handleContribute}
              disabled={isContributing || !isAuthenticated}
              className="w-full bg-emerald-800 hover:bg-emerald-900"
            >
              {isContributing ? "Processing..." : "Contribute to Campaign"}
            </Button>

            {!isAuthenticated && (
              <p className="text-sm text-gray-500 text-center">
                Connect your wallet to contribute
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Refund Section */}
      {canRefund && userContribution > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Refund Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                This campaign did not reach its funding goal before the deadline. 
                You can claim a full refund of your contribution.
              </AlertDescription>
            </Alert>
            
            <Button
              onClick={handleRefund}
              variant="outline"
              className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Claim Refund ({userContribution} ETH)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* How Escrow Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            How Escrow Protection Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-1">
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Secure Smart Contract</p>
              <p className="text-xs text-gray-600">Your funds are held by an automated smart contract, not by us or the campaign creator.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Goal-Based Release</p>
              <p className="text-xs text-gray-600">Funds are only released to the creator if the campaign reaches its full funding goal.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-1">
              <ArrowLeftRight className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Automatic Refunds</p>
              <p className="text-xs text-gray-600">If the goal isn't met by the deadline, you can claim a full refund directly from the contract.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-1">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Time-Locked</p>
              <p className="text-xs text-gray-600">Deadlines are enforced by the blockchain - no one can change them after the campaign starts.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
