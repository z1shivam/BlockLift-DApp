"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { blockchainDataService } from "@/lib/blockchainDataService";
import type { CampaignDetails } from "@/lib/web3Service";

interface CampaignsShowcaseProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showTrending?: boolean;
}

export default function CampaignsShowcase({ 
  title = "Featured Campaigns", 
  subtitle = "Support innovative projects and make a difference",
  limit = 6,
  showTrending = false 
}: CampaignsShowcaseProps) {
  const [campaigns, setCampaigns] = useState<CampaignDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, [limit, showTrending]);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      let fetchedCampaigns: CampaignDetails[];
      
      if (showTrending) {
        fetchedCampaigns = await blockchainDataService.getTrendingCampaigns(limit);
      } else {
        fetchedCampaigns = await blockchainDataService.getFeaturedCampaigns(limit);
      }
      
      setCampaigns(fetchedCampaigns);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">{title}</h2>
            <p className="text-lg text-gray-700">{subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (campaigns.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">{title}</h2>
            <p className="text-lg text-gray-700">{subtitle}</p>
          </div>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Campaigns Yet</h3>
            <p className="text-gray-500 mb-6">Be the first to create a campaign on BlockLift!</p>
            <Link href="/create-campaign">
              <Button className="bg-emerald-800 hover:bg-emerald-900">
                Create First Campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-700">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => {
            const progress = Math.min((Number(campaign.totalRaised) / Number(campaign.goal)) * 100, 100);
            const timeLeft = campaign.deadline * 1000 > Date.now() 
              ? `${Math.ceil((campaign.deadline * 1000 - Date.now()) / (1000 * 60 * 60 * 24))} days left`
              : 'Expired';
            const isExpired = campaign.deadline < Date.now() / 1000;

            return (
              <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow border-emerald-200">
                <div className="relative">
                  {campaign.imageHash ? (
                    <img 
                      src={`https://ipfs.io/ipfs/${campaign.imageHash}`}
                      alt={campaign.title}
                      className="h-48 w-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if IPFS image fails
                        e.currentTarget.src = "/hero-image.png";
                      }}
                    />
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                      <div className="text-white text-4xl font-bold">
                        {campaign.title.charAt(0)}
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-emerald-700">
                      {campaign.category}
                    </Badge>
                  </div>
                  
                  {campaign.goalReached && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 text-white">
                        <Target className="h-3 w-3 mr-1" />
                        Funded
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-emerald-900 mb-2 line-clamp-2">
                    {campaign.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {campaign.description}
                  </p>

                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-emerald-700">
                          {(Number(campaign.totalRaised) / 1e18).toFixed(3)} ETH
                        </span>
                        <span className="text-gray-500">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={progress} 
                        className="h-2"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Goal: {(Number(campaign.goal) / 1e18).toFixed(2)} ETH
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{campaign.contributorCount} contributors</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className={isExpired ? "text-red-500" : ""}>
                          {timeLeft}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/campaigns/${campaign.id}`} className="flex-1">
                        <Button variant="outline" className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                          View Details
                        </Button>
                      </Link>
                      
                      {!isExpired && !campaign.goalReached && (
                        <Link href={`/campaigns/${campaign.id}/contribute`} className="flex-1">
                          <Button className="w-full bg-emerald-800 hover:bg-emerald-900">
                            Contribute
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Show More Button */}
        <div className="text-center mt-12">
          <Link href="/campaigns">
            <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
              View All Campaigns
              <TrendingUp className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
