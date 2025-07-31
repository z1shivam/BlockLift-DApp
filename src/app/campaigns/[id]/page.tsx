import { notFound } from "next/navigation";
import Image from "next/image";
import { mockCampaigns, mockContributions } from "@/lib/staticData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Users, Target, Share2, Heart, Flag } from "lucide-react";
import { henny_penny } from "@/components/global/Header";
import ContributeButton from "@/components/global/ContributeButton";

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { id } = await params;
  const campaignId = parseInt(id);
  
  const campaign = mockCampaigns.find(c => c.id === campaignId);
  
  if (!campaign) {
    notFound();
  }

  const contributions = mockContributions.filter(c => c.campaignId === campaignId);
  const progressPercentage = (parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100;
  const daysLeft = Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  const isCompleted = campaign.completed;
  const isExpired = daysLeft < 0 && !isCompleted;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Campaign Image and Gallery */}
          <div className="lg:col-span-2">
            <div className="relative h-96 w-full rounded-xl overflow-hidden mb-4">
              <Image
                src={campaign.image}
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
                      {campaign.creatorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{campaign.creatorName}</p>
                    <p className="text-sm text-gray-500">{campaign.creator.slice(0, 8)}...{campaign.creator.slice(-6)}</p>
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
                      {campaign.raised} ETH
                    </span>
                    <span className="text-sm text-gray-500">
                      {progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3 mb-2" />
                  <p className="text-sm text-gray-600">
                    of {campaign.goal} ETH goal
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-800">{campaign.contributors}</div>
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

                {/* Contribute Button */}
                <ContributeButton 
                  campaignId={campaign.id}
                  isCompleted={isCompleted}
                  isExpired={isExpired}
                />

                {/* Campaign Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
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
            <TabsTrigger value="contributors">Contributors ({contributions.length})</TabsTrigger>
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
                  <div className="whitespace-pre-line text-gray-700">
                    {campaign.story}
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
                <CardTitle>Recent Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contributions.length > 0 ? (
                    contributions.map((contribution) => (
                      <div key={contribution.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <Avatar>
                          <AvatarFallback className="bg-emerald-600 text-white">
                            {contribution.contributorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">
                              {contribution.contributorName}
                            </span>
                            <span className="font-bold text-emerald-700">
                              {contribution.amount} ETH
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            {new Date(contribution.timestamp).toLocaleDateString()} at {new Date(contribution.timestamp).toLocaleTimeString()}
                          </p>
                          {contribution.message && (
                            <p className="text-sm text-gray-700 italic">
                              "{contribution.message}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No contributions yet.</p>
                      <p className="text-sm">Be the first to support this campaign!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
