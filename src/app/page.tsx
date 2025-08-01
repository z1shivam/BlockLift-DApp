"use client";

import { useState, useEffect } from "react";
import AiChatHome from "@/components/global/AiChatHome";
import CampaignCreateForm from "@/components/global/CampaignCreateForm";
import CampaignsShowcase from "@/components/global/CampaignsShowcase";
import FAQSection from "@/components/global/FaqHome";
import Features from "@/components/global/Features";
import Footer from "@/components/global/Footer";
import Hero from "@/components/global/Hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { henny_penny } from "@/components/global/Header";
import { teamMembers } from "@/lib/staticData";
import { blockchainDataService } from "@/lib/blockchainDataService";
import { Github, Linkedin, Mail, BookOpen, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { PlatformStats } from "@/lib/web3Service";

export default function HomePage() {
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlatformStats();
  }, []);

  const loadPlatformStats = async () => {
    try {
      setIsLoading(true);
      const stats = await blockchainDataService.getPlatformStatistics();
      setPlatformStats(stats);
    } catch (error) {
      console.error("Failed to load platform stats:", error);
      // Fallback to default values
      setPlatformStats({
        totalCampaigns: 0,
        totalFundsRaised: "0",
        successfulCampaigns: 0,
        totalContributors: 0,
        platformFeesCollected: "0"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatStatsForDisplay = (stats: PlatformStats | null) => {
    if (!stats) {
      return {
        totalCampaigns: "Loading...",
        totalFundsRaised: "Loading...",
        totalContributors: "Loading...",
        successfulCampaigns: "Loading...",
        averageFundingTime: "Coming Soon",
        platformFee: "2.5%"
      };
    }

    // Convert ETH to more readable format
    const fundsRaisedEth = parseFloat(stats.totalFundsRaised);
    const fundsRaisedDisplay = fundsRaisedEth > 0 
      ? `${fundsRaisedEth.toFixed(2)} ETH`
      : "0 ETH";

    return {
      totalCampaigns: stats.totalCampaigns.toString(),
      totalFundsRaised: fundsRaisedDisplay,
      totalContributors: stats.totalContributors.toString(),
      successfulCampaigns: stats.successfulCampaigns.toString(),
      averageFundingTime: "Coming Soon",
      platformFee: "2.5%"
    };
  };

  const displayStats = formatStatsForDisplay(platformStats);
  return (
    <main className="min-h-screen">
      <Hero />
      <CampaignCreateForm />
      <CampaignsShowcase 
        title="Live Campaigns" 
        subtitle="Discover and support innovative projects making a real impact"
        limit={6}
      />
      <Features />

      {/* Platform Impact */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className={`${henny_penny.className} text-3xl font-bold text-emerald-900 mb-4`}>
              Platform Impact
            </h2>
            <p className="text-lg text-gray-700">
              See how BlockLift is making a difference in the crowdfunding ecosystem
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="text-center bg-emerald-50 border-emerald-200">
              <CardContent className="py-6">
                <div className="text-3xl font-bold text-emerald-800 mb-1">
                  {isLoading ? "..." : displayStats.totalCampaigns}
                </div>
                <div className="text-sm text-emerald-700">Total Campaigns</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-emerald-50 border-emerald-200">
              <CardContent className="py-6">
                <div className="text-3xl font-bold text-emerald-800 mb-1">
                  {isLoading ? "..." : displayStats.totalFundsRaised}
                </div>
                <div className="text-sm text-emerald-700">Funds Raised</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-emerald-50 border-emerald-200">
              <CardContent className="py-6">
                <div className="text-3xl font-bold text-emerald-800 mb-1">
                  {isLoading ? "..." : displayStats.totalContributors}
                </div>
                <div className="text-sm text-emerald-700">Contributors</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-emerald-50 border-emerald-200">
              <CardContent className="py-6">
                <div className="text-3xl font-bold text-emerald-800 mb-1">
                  {isLoading ? "..." : displayStats.successfulCampaigns}
                </div>
                <div className="text-sm text-emerald-700">Successful</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-emerald-50 border-emerald-200">
              <CardContent className="py-6">
                <div className="text-3xl font-bold text-emerald-800 mb-1">
                  {displayStats.averageFundingTime}
                </div>
                <div className="text-sm text-emerald-700">Avg. Duration</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-emerald-50 border-emerald-200">
              <CardContent className="py-6">
                <div className="text-3xl font-bold text-emerald-800 mb-1">
                  {displayStats.platformFee}
                </div>
                <div className="text-sm text-emerald-700">Platform Fee</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className={`${henny_penny.className} text-3xl font-bold text-emerald-900 mb-4`}>
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Three passionate computer science students from Shri Mata Vaishno Devi University, 
              working together to revolutionize crowdfunding through blockchain technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="border-emerald-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 bg-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-emerald-900">{member.name}</CardTitle>
                  <Badge variant="outline" className="mx-auto">{member.rollNumber}</Badge>
                  <p className="text-sm font-medium text-emerald-700">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 text-center">
                    {member.bio}
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <a href={member.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${member.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/about">
              <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                Learn More About Us
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation CTA */}
      <section className="h-96 bg-emerald-900 text-white">
        <div
          className="w-full h-full flex justify-center items-center"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 270 270' width='40' height='40' transform='rotate(45)'%3E%3Cpath d='M128.6 149.4c-3.1 2-2.5 2.7-22.2 29.7-10 13.7-28.2 37.2-33.8 50.4-.7 1.7-.9 3.5-.6 5.4 1.8 7.4 13.6 7.1 15.2-.3 7.6-15.1 32.9-46 48.9-69 7.8 8.3 46.1 64.7 55.9 77.7 1.8 2.4 4.9 3.5 7.9 3.2 6.8-.6 10.1-7.6 6.5-12.5-47.6-64-61-95.5-77.8-84.6zM208.5 173c-14.3-20.6-60.7-90.8-85.4-88.2-3.5.4-6.8 2.4-8.7 5.4-5.8 9.3-4.6 10.3-43.6 75.6-1.9 3.3-4.4 7.3-2.2 11.1 1.9 3.3 6.7 4.5 10 2.7 1.8-1 3.1-2.1 3.8-4.1 3.6-6.3 15.4-22.5 44.4-74.4 21.1 12 58.3 68 67.5 81.1 1.4 2 7.1 3.3 7.8 3.2 6.2-.4 10.4-6.7 6.4-12.4zm-128.4 5.7c.4-.3.7-.6 1-1-.4.5-.8.8-1 1zM75.1 111c1.9-3.6 40-55.9 53.6-70.6 10.8 8.4 31.1 33.4 49.1 49.6 1.7 1.5 3.7 2.4 5.9 2.5 8.1.3 11.8-8.8 6.9-13.2-15.4-13.8-31-32.5-45-45.7-4.5-4.2-9.6-8.8-15.9-9.9-3.5-.6-7.7.6-11.1 4.2C105.2 42 92.4 60.1 77.3 81.2c-13.9 19.5-17.7 24.3-17.4 29.4.3 4 4.2 6.6 8.2 6.3 3.4-.3 6.4-2.7 7-5.9z' fill='%234A6543'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "40px 40px",
          }}
        >
          <div className="mx-auto max-w-4xl px-4 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-emerald-200" />
            <h2 className={`${henny_penny.className} text-4xl font-bold mb-6`}>
              Get Started with BlockLift
            </h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Ready to dive into decentralized crowdfunding? Our comprehensive documentation 
              covers everything from getting started to advanced features and best practices.
            </p>
            
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-semibold text-emerald-200 mb-2">Complete Guides</h3>
                <p className="text-sm text-emerald-100">Step-by-step tutorials for all platform features</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔧</div>
                <h3 className="font-semibold text-emerald-200 mb-2">Technical Details</h3>
                <p className="text-sm text-emerald-100">Smart contract architecture and security info</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <h3 className="font-semibold text-emerald-200 mb-2">Best Practices</h3>
                <p className="text-sm text-emerald-100">Tips for successful campaigns and contributions</p>
              </div>
            </div> */}

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/docs">
                <Button className="bg-white text-emerald-900 hover:bg-emerald-50 font-semibold">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read Documentation
                </Button>
              </Link>
              <Link href="/docs#getting-started">
                <Button variant="outline" className="border-white text-black hover:bg-white hover:text-emerald-900">
                  Quick Start Guide
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AiChatHome />
      <FAQSection />
      <Footer />
    </main>
  );
}
