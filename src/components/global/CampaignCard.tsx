import Image from "next/image";
import Link from "next/link";
import type { Campaign } from "@/lib/staticData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Target } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const progressPercentage = (parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100;
  const daysLeft = Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  const isCompleted = campaign.completed;
  const isExpired = daysLeft < 0 && !isCompleted;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Campaign Image */}
      <div className="relative h-48 w-full">
        <Image
          src={campaign.image}
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
            {campaign.category}
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
            by <span className="font-medium text-emerald-700">{campaign.creatorName}</span>
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
              {campaign.raised} ETH raised
            </span>
            <span className="text-sm text-gray-500">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>Goal: {campaign.goal} ETH</span>
            <span>{campaign.contributors} contributors</span>
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
            <span>{campaign.contributors}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>{campaign.goal} ETH</span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/campaigns/${campaign.id}`}>
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
