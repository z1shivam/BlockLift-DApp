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
  showTrending = false,
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
        fetchedCampaigns =
          await blockchainDataService.getTrendingCampaigns(limit);
      } else {
        fetchedCampaigns =
          await blockchainDataService.getFeaturedCampaigns(limit);
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
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-emerald-900">
              {title}
            </h2>
            <p className="text-lg text-gray-700">{subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 rounded-t-lg bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="mb-2 h-4 rounded bg-gray-200"></div>
                  <div className="mb-4 h-3 rounded bg-gray-200"></div>
                  <div className="mb-4 h-2 rounded bg-gray-200"></div>
                  <div className="flex gap-2">
                    <div className="h-8 flex-1 rounded bg-gray-200"></div>
                    <div className="h-8 w-20 rounded bg-gray-200"></div>
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
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-emerald-900">
              {title}
            </h2>
            <p className="text-lg text-gray-700">{subtitle}</p>
          </div>

          <div className="py-12 text-center">
            <div className="mb-4 text-6xl">🚀</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700">
              No Campaigns Yet
            </h3>
            <p className="mb-6 text-gray-500">
              Be the first to create a campaign on BlockLift!
            </p>
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
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-emerald-900">{title}</h2>
          <p className="text-lg text-gray-700">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            // Add defensive checks for campaign data
            if (!campaign || typeof campaign.id === 'undefined' || campaign.id === null) {
              console.warn('Invalid campaign data:', campaign);
              return null;
            }

            const progress = Math.min(
              (Number(campaign.totalRaised || 0) / Number(campaign.goal || 1)) * 100,
              100,
            );
            const timeLeft =
              campaign.deadline * 1000 > Date.now()
                ? `${Math.ceil((campaign.deadline * 1000 - Date.now()) / (1000 * 60 * 60 * 24))} days left`
                : "Expired";
            const isExpired = campaign.deadline < Date.now() / 1000;

            return (
              <div
                key={campaign.id}
                className="overflow-hidden border-emerald-200 border transition-shadow hover:shadow-lg rounded-lg"
              >
                <div className="relative">
                  <img
                    src={`/placeholder.png`}
                    alt={campaign.title}
                    className="aspect-video w-full object-cover"
                  />

                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-emerald-700">
                      {campaign.category}
                    </Badge>
                  </div>

                  {campaign.goalReached && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 text-white">
                        <Target className="mr-1 h-3 w-3" />
                        Funded
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-6 ">
                  <h3 className="mb-2 line-clamp-2 text-lg font-bold text-emerald-900">
                    {campaign.title}
                  </h3>

                  <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                    {campaign.description}
                  </p>

                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-emerald-700">
                          {(Number(campaign.totalRaised) / 1e18).toFixed(3)} ETH
                        </span>
                        <span className="text-gray-500">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="mt-1 text-xs text-gray-500">
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
                      <Link
                        href={`/campaigns/${campaign.id || 'unknown'}`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                        >
                          View Details
                        </Button>
                      </Link>

                      {!isExpired && !campaign.goalReached && (
                        <Link
                          href={`/campaigns/${campaign.id || 'unknown'}`}
                          className="flex-1"
                        >
                          <Button className="w-full bg-emerald-800 hover:bg-emerald-900">
                            Contribute
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            );
          })}
        </div>

        {/* Show More Button */}
        <div className="mt-12 text-center">
          <Link href="/campaigns">
            <Button
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              View All Campaigns
              <TrendingUp className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
