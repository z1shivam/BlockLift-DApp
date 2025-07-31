import Image from "next/image";
import { teamMembers, platformStats } from "@/lib/staticData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { henny_penny } from "@/components/global/Header";
import { Github, Linkedin, Mail, ExternalLink, Users, Target, TrendingUp, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white h-96">
        <div
          className="w-full h-full min-h-full flex justify-center items-center"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 270 270' width='40' height='40' transform='rotate(45)'%3E%3Cpath d='M128.6 149.4c-3.1 2-2.5 2.7-22.2 29.7-10 13.7-28.2 37.2-33.8 50.4-.7 1.7-.9 3.5-.6 5.4 1.8 7.4 13.6 7.1 15.2-.3 7.6-15.1 32.9-46 48.9-69 7.8 8.3 46.1 64.7 55.9 77.7 1.8 2.4 4.9 3.5 7.9 3.2 6.8-.6 10.1-7.6 6.5-12.5-47.6-64-61-95.5-77.8-84.6zM208.5 173c-14.3-20.6-60.7-90.8-85.4-88.2-3.5.4-6.8 2.4-8.7 5.4-5.8 9.3-4.6 10.3-43.6 75.6-1.9 3.3-4.4 7.3-2.2 11.1 1.9 3.3 6.7 4.5 10 2.7 1.8-1 3.1-2.1 3.8-4.1 3.6-6.3 15.4-22.5 44.4-74.4 21.1 12 58.3 68 67.5 81.1 1.4 2 7.1 3.3 7.8 3.2 6.2-.4 10.4-6.7 6.4-12.4zm-128.4 5.7c.4-.3.7-.6 1-1-.4.5-.8.8-1 1zM75.1 111c1.9-3.6 40-55.9 53.6-70.6 10.8 8.4 31.1 33.4 49.1 49.6 1.7 1.5 3.7 2.4 5.9 2.5 8.1.3 11.8-8.8 6.9-13.2-15.4-13.8-31-32.5-45-45.7-4.5-4.2-9.6-8.8-15.9-9.9-3.5-.6-7.7.6-11.1 4.2C105.2 42 92.4 60.1 77.3 81.2c-13.9 19.5-17.7 24.3-17.4 29.4.3 4 4.2 6.6 8.2 6.3 3.4-.3 6.4-2.7 7-5.9z' fill='%234A6543'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "40px 40px",
          }}
        >
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h1 className={`${henny_penny.className} text-5xl font-bold mb-6`}>
              About BlockLift
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Revolutionizing crowdfunding through blockchain technology. Built by students, for innovators worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                🎓 Student Project
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                🔗 Blockchain Powered
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                🌍 Global Impact
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className={`${henny_penny.className} text-3xl font-bold text-emerald-900 mb-4`}>
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              To democratize access to funding by creating a transparent, secure, and decentralized platform 
              where innovative ideas can flourish without traditional barriers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-emerald-200">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-semibold text-emerald-900 mb-2">Community Driven</h3>
                <p className="text-sm text-gray-600">
                  Empowering creators and backers through decentralized governance
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-emerald-200">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-semibold text-emerald-900 mb-2">Transparent</h3>
                <p className="text-sm text-gray-600">
                  Every transaction recorded on blockchain for complete transparency
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-emerald-200">
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-semibold text-emerald-900 mb-2">Global Reach</h3>
                <p className="text-sm text-gray-600">
                  Connecting creators and supporters across geographical boundaries
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-emerald-200">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-semibold text-emerald-900 mb-2">Innovation</h3>
                <p className="text-sm text-gray-600">
                  Supporting cutting-edge projects that shape the future
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Platform Stats */}
        <section className="mb-16">
          <div className="text-center mb-8">
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
                  {platformStats.totalCampaigns}
                </div>
                <div className="text-sm text-emerald-700">Total Campaigns</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-emerald-50 border-emerald-200">
              <CardContent className="py-6">
                <div className="text-3xl font-bold text-emerald-800 mb-1">
                  {platformStats.totalFundsRaised}
                </div>
                <div className="text-sm text-emerald-700">Funds Raised</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-emerald-50 border-emerald-200">
              <CardContent className="py-6">
                <div className="text-3xl font-bold text-emerald-800 mb-1">
                  {platformStats.totalContributors}
                </div>
                <div className="text-sm text-emerald-700">Contributors</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-emerald-50 border-emerald-200">
              <CardContent className="py-6">
                <div className="text-3xl font-bold text-emerald-800 mb-1">
                  {platformStats.successfulCampaigns}
                </div>
                <div className="text-sm text-emerald-700">Successful</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-emerald-50 border-emerald-200">
              <CardContent className="py-6">
                <div className="text-3xl font-bold text-emerald-800 mb-1">
                  {platformStats.averageFundingTime}
                </div>
                <div className="text-sm text-emerald-700">Avg. Time</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-emerald-50 border-emerald-200">
              <CardContent className="py-6">
                <div className="text-3xl font-bold text-emerald-800 mb-1">
                  {platformStats.platformFee}
                </div>
                <div className="text-sm text-emerald-700">Platform Fee</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
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
        </section>

        {/* University Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className={`${henny_penny.className} text-2xl font-bold text-emerald-900 mb-4`}>
                  Shri Mata Vaishno Devi University
                </h3>
                <p className="text-emerald-800 mb-4">
                  This project was developed as part of our Mini Project for Semester 6 in the Computer Science program. 
                  SMVDU has provided us with the foundation and support to explore innovative technologies like blockchain 
                  and create real-world applications.
                </p>
                <div className="flex justify-center gap-4">
                  <Badge variant="secondary">Batch 2022</Badge>
                  <Badge variant="secondary">Computer Science</Badge>
                  <Badge variant="secondary">Semester 6 Project</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Technology Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className={`${henny_penny.className} text-3xl font-bold text-emerald-900 mb-4`}>
              Technology Stack
            </h2>
            <p className="text-lg text-gray-700">
              Built with modern technologies for scalability, security, and user experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Next.js 15", category: "Frontend" },
              { name: "TypeScript", category: "Language" },
              { name: "Tailwind CSS", category: "Styling" },
              { name: "Ethers.js", category: "Web3" },
              { name: "Solidity", category: "Smart Contracts" },
              { name: "Gemini AI", category: "AI Integration" },
              { name: "Zustand", category: "State Management" },
              { name: "shadcn/ui", category: "UI Components" }
            ].map((tech, index) => (
              <Card key={index} className="text-center p-4 border-emerald-200">
                <div className="font-semibold text-emerald-900">{tech.name}</div>
                <div className="text-xs text-emerald-600">{tech.category}</div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
