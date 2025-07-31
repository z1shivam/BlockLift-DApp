import { faqs } from "@/lib/staticData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { henny_penny } from "@/components/global/Header";
import Link from "next/link";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Book, 
  Shield, 
  Wallet,
  Users,
  Zap,
  Search,
  ExternalLink
} from "lucide-react";

export default function HelpPage() {
  const helpCategories = [
    {
      icon: <Wallet className="h-6 w-6" />,
      title: "Getting Started",
      description: "Learn how to connect your wallet and create your first campaign",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security & Safety",
      description: "Understanding blockchain security and protecting your funds",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Campaign Management",
      description: "Tips for creating successful campaigns and managing contributions",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Technical Support",
      description: "Troubleshooting common issues and technical questions",
      color: "bg-orange-50 border-orange-200"
    }
  ];

  const quickLinks = [
    { title: "How to Connect MetaMask", href: "#metamask" },
    { title: "Creating Your First Campaign", href: "#create-campaign" },
    { title: "Understanding Gas Fees", href: "#gas-fees" },
    { title: "Refund Process", href: "#refunds" },
    { title: "Platform Fees", href: "#fees" },
    { title: "Security Best Practices", href: "#security" }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
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
          <div className="mx-auto max-w-4xl px-4 text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6 text-emerald-200" />
            <h1 className={`${henny_penny.className} text-4xl font-bold mb-4`}>
              Help & Support Center
            </h1>
            <p className="text-xl text-emerald-100 mb-8">
              Find answers to common questions and get the help you need to succeed on BlockLift
            </p>
            
            {/* Search Bar Placeholder */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 bg-white shadow-md focus:ring-2 focus:ring-emerald-300 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Quick Help Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-8 text-center">
            How can we help you?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className={`${category.color} hover:shadow-lg transition-shadow cursor-pointer`}>
                <CardContent className="p-6 text-center">
                  <div className="text-emerald-600 mb-4 flex justify-center">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-emerald-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-emerald-700">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm text-gray-700">{link.title}</span>
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/ai">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat with AI Assistant
                    </Link>
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>📧 support@blocklift.com</p>
                  <p>⏰ Response time: 24-48 hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">All Systems Operational</span>
                </div>
                
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Ethereum Network</span>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Smart Contracts</span>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>API Services</span>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Guides */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-8">
            Step-by-Step Guides
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🚀 Getting Started Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li>1. Install MetaMask browser extension</li>
                  <li>2. Create or import your Ethereum wallet</li>
                  <li>3. Connect your wallet to BlockLift</li>
                  <li>4. Browse campaigns or create your own</li>
                  <li>5. Start contributing or fundraising!</li>
                </ol>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/docs#getting-started">View Full Guide</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Campaign Creation Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Write a compelling story and clear goals</li>
                  <li>• Set realistic funding targets and deadlines</li>
                  <li>• Add high-quality images and videos</li>
                  <li>• Engage with your community regularly</li>
                  <li>• Provide regular updates to contributors</li>
                </ul>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/docs#campaign-creation">View Full Guide</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🔒 Security Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Never share your private keys or seed phrase</li>
                  <li>• Always verify contract addresses</li>
                  <li>• Use hardware wallets for large amounts</li>
                  <li>• Be cautious of phishing attempts</li>
                  <li>• Keep your browser and wallet updated</li>
                </ul>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/docs#security">View Full Guide</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⛽ Understanding Gas Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Gas fees are required for all Ethereum transactions:</p>
                  <ul className="space-y-1 mt-2">
                    <li>• Creating campaigns: ~0.01-0.03 ETH</li>
                    <li>• Contributing: ~0.005-0.015 ETH</li>
                    <li>• Withdrawing funds: ~0.005-0.02 ETH</li>
                  </ul>
                </div>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/docs#gas-fees">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
