import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Target } from "lucide-react";
import type { Campaign } from "@/lib/blockchainDataService";

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  // Add validation for campaign data
  if (!campaign || typeof campaign.id === 'undefined' || campaign.id === null) {
    console.warn('Invalid campaign data passed to CampaignCard:', campaign);
    return null;
  }

  // Convert string amounts to numbers for calculations
  const goalAmount = parseFloat(campaign.goal || '0');
  const currentAmount = parseFloat(campaign.totalRaised || '0');
  
  const progressPercentage = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
  const daysLeft = Math.ceil((campaign.deadline * 1000 - Date.now()) / (1000 * 3600 * 24));
  const isCompleted = campaign.goalReached;
  const isExpired = daysLeft < 0 && !isCompleted;

  // Format ETH amounts for display
  const formatEth = (amount: number) => amount.toFixed(4);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Campaign Image */}
      <div className="relative h-48 w-full">
        <Image
          src={campaign.imageHash && campaign.imageHash.length > 0 && campaign.imageHash !== "" ? campaign.imageHash : "/hero-image.png"}
          alt={campaign.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={isCompleted ? "default" : isExpired ? "destructive" : "secondary"}>
            {isCompleted ? "Funded" : isExpired ? "Expired" : "Active"}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-white/90">
            {campaign.category || "General"}
          </Badge>
        </div>
      </div>

      {/* Campaign Content */}
      <div className="p-6">
        {/* Title and Creator */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {campaign.title}
          </h3>
          <p className="text-sm text-gray-600">
            by <span className="font-medium text-emerald-700">
              {campaign.creator ? `${campaign.creator.slice(0, 6)}...${campaign.creator.slice(-4)}` : "Unknown"}
            </span>
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {campaign.description}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {formatEth(currentAmount)} ETH raised
            </span>
            <span className="text-sm text-gray-500">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>Goal: {formatEth(goalAmount)} ETH</span>
            <span>{campaign.contributorCount} contributors</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>{isCompleted ? "Completed" : isExpired ? "Expired" : `${daysLeft} days left`}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{campaign.contributorCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>{formatEth(goalAmount)} ETH</span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/campaigns/${campaign.id || 'unknown'}`}>
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isExpired}
          >
            {isCompleted ? "View Details" : isExpired ? "Campaign Ended" : "Support Campaign"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
