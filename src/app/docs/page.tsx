import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { henny_penny } from "@/components/global/Header";
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  Shield, 
  Wallet,
  Zap,
  Code,
  Users,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const quickStartSteps = [
    {
      step: 1,
      title: "Install MetaMask",
      description: "Download and install the MetaMask browser extension",
      details: "MetaMask is required to interact with the Ethereum blockchain"
    },
    {
      step: 2,
      title: "Create Wallet",
      description: "Set up your Ethereum wallet or import existing one",
      details: "Keep your seed phrase secure and never share it with anyone"
    },
    {
      step: 3,
      title: "Connect to BlockLift",
      description: "Connect your wallet to the BlockLift platform",
      details: "Click the 'Connect MetaMask' button in the header"
    },
    {
      step: 4,
      title: "Start Exploring",
      description: "Browse campaigns or create your own",
      details: "You're ready to participate in decentralized crowdfunding!"
    }
  ];

  const docSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Wallet className="h-5 w-5" />,
      description: "Complete guide to setting up and using BlockLift"
    },
    {
      id: "campaign-creation",
      title: "Campaign Creation",
      icon: <Users className="h-5 w-5" />,
      description: "Learn how to create successful crowdfunding campaigns"
    },
    {
      id: "security",
      title: "Security Guide",
      icon: <Shield className="h-5 w-5" />,
      description: "Best practices for keeping your funds and data safe"
    },
    {
      id: "gas-fees",
      title: "Gas Fees",
      icon: <Zap className="h-5 w-5" />,
      description: "Understanding Ethereum transaction costs"
    },
    {
      id: "smart-contracts",
      title: "Smart Contracts",
      icon: <Code className="h-5 w-5" />,
      description: "Technical details about BlockLift's smart contracts"
    }
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
          <div className="mx-auto max-w-6xl px-4 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-emerald-200" />
            <h1 className={`${henny_penny.className} text-5xl font-bold mb-6`}>
              BlockLift Documentation
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Complete guides, tutorials, and technical documentation for using BlockLift's decentralized crowdfunding platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                📚 Comprehensive Guides
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                🔧 Technical Details
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                🚀 Step-by-Step
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Quick Start Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className={`${henny_penny.className} text-3xl font-bold text-emerald-900 mb-4`}>
              Quick Start Guide
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Get started with BlockLift in just 4 simple steps. Follow this guide to set up your wallet and make your first contribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStartSteps.map((step, index) => (
              <Card key={index} className="border-emerald-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-emerald-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{step.description}</p>
                  <p className="text-xs text-gray-500">{step.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="#getting-started">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Read Detailed Guide
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className={`${henny_penny.className} text-3xl font-bold text-emerald-900 mb-4`}>
              Documentation Sections
            </h2>
            <p className="text-lg text-gray-700">
              Explore our comprehensive documentation covering all aspects of the BlockLift platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docSections.map((section, index) => (
              <Card key={index} className="border-emerald-200 hover:shadow-lg transition-shadow group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-emerald-600 mr-3">
                      {section.icon}
                    </div>
                    <h3 className="font-semibold text-emerald-900">{section.title}</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">{section.description}</p>
                  <Link href={`#${section.id}`}>
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-emerald-50">
                      Read More
                      <ArrowRight className="h-3 w-3 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Detailed Guides */}
        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="campaign-creation">Campaigns</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="gas-fees">Gas Fees</TabsTrigger>
            <TabsTrigger value="smart-contracts">Contracts</TabsTrigger>
          </TabsList>

          {/* Getting Started Tab */}
          <TabsContent value="getting-started" id="getting-started">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Getting Started with BlockLift
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Prerequisites</h4>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• A modern web browser (Chrome, Firefox, or Brave recommended)</li>
                    <li>• Basic understanding of cryptocurrency and wallets</li>
                    <li>• Some ETH for gas fees (typically $5-20 worth)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Step 1: Install MetaMask (Coming Soon)</h4>
                  <p className="text-gray-700 mb-3">
                    MetaMask integration is coming soon. For now, you can explore the platform and see how it will work.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Web3 integration is currently in development. All blockchain features will be available soon.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Step 2: Wallet Setup (Coming Soon)</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      Wallet creation and management features are being implemented. Stay tuned for the full Web3 experience!
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Step 3: Platform Integration (Coming Soon)</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      Blockchain integration is in development. For now, you can explore the platform's interface and features.
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">What You Can Do Now</h4>
                  </div>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Browse active campaigns and explore the interface</li>
                    <li>• Learn about the platform features and design</li>
                    <li>• Read documentation and best practices</li>
                    <li>• Stay tuned for the full Web3 launch!</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaign Creation Tab */}
          <TabsContent value="campaign-creation" id="campaign-creation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Creating Successful Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Campaign Planning</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">Setting Your Goal</h5>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• Calculate actual costs needed</li>
                        <li>• Add 15-20% buffer for unexpected expenses</li>
                        <li>• Consider platform fees (2.5%)</li>
                        <li>• Account for gas fees</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">Timeline Planning</h5>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• 30-60 days is optimal for most campaigns</li>
                        <li>• Too short: not enough time to build momentum</li>
                        <li>• Too long: people may forget or lose interest</li>
                        <li>• Consider holidays and events</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Writing Your Campaign Story</h4>
                  <div className="space-y-4">
                    <div className="border-l-4 border-emerald-500 pl-4">
                      <h5 className="font-medium text-gray-900 mb-2">Structure Your Story</h5>
                      <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                        <li><strong>Hook:</strong> Start with why this matters</li>
                        <li><strong>Problem:</strong> What problem are you solving?</li>
                        <li><strong>Solution:</strong> How does your project help?</li>
                        <li><strong>Impact:</strong> What will success look like?</li>
                        <li><strong>Call to Action:</strong> Why should they contribute?</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Visual Content Guidelines</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Main Image</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• 1280x720px recommended</li>
                        <li>• High quality, clear focus</li>
                        <li>• Shows your project/product</li>
                        <li>• Avoid too much text</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Additional Images</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Progress photos</li>
                        <li>• Team photos</li>
                        <li>• Product mockups</li>
                        <li>• Behind-the-scenes</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Video (Optional)</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• 2-3 minutes ideal</li>
                        <li>• Personal, authentic</li>
                        <li>• Show passion for project</li>
                        <li>• Upload to YouTube/Vimeo</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Launch Preparation</h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h5 className="font-medium text-yellow-900 mb-2">Pre-Launch Checklist</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li>☐ Campaign story is complete and compelling</li>
                        <li>☐ All images are high quality and relevant</li>
                        <li>☐ Goal amount is realistic and justified</li>
                        <li>☐ Timeline allows for proper promotion</li>
                        <li>☐ Social media accounts are ready</li>
                      </ul>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li>☐ Email list of potential supporters</li>
                        <li>☐ Press release or media kit prepared</li>
                        <li>☐ Team members know their roles</li>
                        <li>☐ Wallet has enough ETH for gas fees</li>
                        <li>☐ Launch day promotion plan ready</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Campaign Management</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Daily Tasks</h5>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• Respond to comments and messages</li>
                        <li>• Share updates on social media</li>
                        <li>• Thank new contributors personally</li>
                        <li>• Monitor campaign metrics</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Weekly Tasks</h5>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• Post campaign updates</li>
                        <li>• Reach out to media/influencers</li>
                        <li>• Analyze what's working and adjust strategy</li>
                        <li>• Plan next week's content</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" id="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-red-900">Critical Security Rules</h4>
                  </div>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• NEVER share your seed phrase with anyone</li>
                    <li>• NEVER enter your seed phrase on websites</li>
                    <li>• NEVER store your seed phrase digitally</li>
                    <li>• ALWAYS verify contract addresses before interacting</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Wallet Security</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Seed Phrase Protection</h5>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• Write it down on paper</li>
                        <li>• Store in a secure, fireproof location</li>
                        <li>• Consider making multiple copies</li>
                        <li>• Never take photos or screenshots</li>
                        <li>• Consider hardware storage (metal plates)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">MetaMask Settings</h5>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• Enable password protection</li>
                        <li>• Set auto-lock timer</li>
                        <li>• Review connected sites regularly</li>
                        <li>• Keep extension updated</li>
                        <li>• Use hardware wallet when possible</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Transaction Security</h4>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Before Every Transaction</h5>
                      <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                        <li>Verify the website URL (blocklift.com)</li>
                        <li>Check the contract address</li>
                        <li>Review transaction details carefully</li>
                        <li>Ensure gas fees are reasonable</li>
                        <li>Never rush - take your time</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Common Scams to Avoid</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <h5 className="font-medium text-red-900 mb-2">Phishing Websites</h5>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Fake websites with similar URLs</li>
                        <li>• Always type URLs manually</li>
                        <li>• Check for HTTPS and correct spelling</li>
                        <li>• Bookmark legitimate sites</li>
                      </ul>
                    </div>
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <h5 className="font-medium text-red-900 mb-2">Social Engineering</h5>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• "Support" asking for seed phrases</li>
                        <li>• Urgent messages about wallet issues</li>
                        <li>• Fake airdrops or giveaways</li>
                        <li>• Impersonators on social media</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Hardware Wallet Recommendations</h4>
                  <p className="text-gray-700 mb-3">
                    For large amounts, consider using a hardware wallet for maximum security:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Ledger Nano S/X</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Most popular option</li>
                        <li>• MetaMask compatible</li>
                        <li>• $60-120 price range</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Trezor Model T</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Open source firmware</li>
                        <li>• Touchscreen interface</li>
                        <li>• $180-200 price range</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">GridPlus Lattice1</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• WiFi enabled</li>
                        <li>• Large screen</li>
                        <li>• $400+ price range</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gas Fees Tab */}
          <TabsContent value="gas-fees" id="gas-fees">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Understanding Gas Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">What are Gas Fees?</h4>
                  <p className="text-gray-700 mb-3">
                    Gas fees are payments made to compensate Ethereum network validators for the computing energy required to process and validate transactions. Think of them as transaction fees.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2">Gas Fee Components</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Base Fee:</strong> Minimum fee required (burned)</li>
                      <li>• <strong>Priority Fee:</strong> Tip to validators (optional)</li>
                      <li>• <strong>Gas Limit:</strong> Maximum gas you're willing to use</li>
                      <li>• <strong>Gas Price:</strong> How much you pay per unit of gas</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Typical BlockLift Transaction Costs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <h5 className="font-medium text-gray-900 mb-2">Contributing</h5>
                      <div className="text-2xl font-bold text-emerald-600 mb-1">~$5-15</div>
                      <div className="text-sm text-gray-500">0.002-0.006 ETH</div>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <h5 className="font-medium text-gray-900 mb-2">Creating Campaign</h5>
                      <div className="text-2xl font-bold text-emerald-600 mb-1">~$20-50</div>
                      <div className="text-sm text-gray-500">0.008-0.02 ETH</div>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <h5 className="font-medium text-gray-900 mb-2">Withdrawing Funds</h5>
                      <div className="text-2xl font-bold text-emerald-600 mb-1">~$10-25</div>
                      <div className="text-sm text-gray-500">0.004-0.01 ETH</div>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <h5 className="font-medium text-gray-900 mb-2">Claiming Refund</h5>
                      <div className="text-2xl font-bold text-emerald-600 mb-1">~$8-20</div>
                      <div className="text-sm text-gray-500">0.003-0.008 ETH</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    *Costs vary based on network congestion. Prices shown are estimates based on $2500 ETH.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Optimizing Gas Costs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Timing Your Transactions</h5>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• Weekends typically cheaper than weekdays</li>
                        <li>• Early morning (UTC) often has lower fees</li>
                        <li>• Avoid times when US/Europe markets are active</li>
                        <li>• Use gas tracking websites for current rates</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">MetaMask Settings</h5>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• Use "Standard" speed for non-urgent transactions</li>
                        <li>• Custom gas settings for advanced users</li>
                        <li>• Enable gas fee suggestions</li>
                        <li>• Review gas estimates before confirming</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Gas Tracking Tools</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">ETH Gas Station</h5>
                      <p className="text-sm text-gray-700 mb-2">Real-time gas price tracker</p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://ethgasstation.info" target="_blank" rel="noopener noreferrer">
                          Visit <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Gas Now</h5>
                      <p className="text-sm text-gray-700 mb-2">Live gas price recommendations</p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://www.gasnow.org" target="_blank" rel="noopener noreferrer">
                          Visit <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Blocknative</h5>
                      <p className="text-sm text-gray-700 mb-2">Gas fee predictions</p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://www.blocknative.com/gas-estimator" target="_blank" rel="noopener noreferrer">
                          Visit <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-medium text-yellow-900 mb-2">Pro Tips</h5>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Failed transactions still consume gas - double-check before confirming</li>
                    <li>• Higher gas prices mean faster confirmation times</li>
                    <li>• Complex operations (like creating campaigns) cost more than simple transfers</li>
                    <li>• Keep some ETH in your wallet specifically for gas fees</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Contracts Tab */}
          <TabsContent value="smart-contracts" id="smart-contracts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Smart Contract Technical Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Development Status</h4>
                  </div>
                  <p className="text-sm text-blue-800">
                    Smart contract integration is currently in development. The information below represents the planned architecture.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Contract Overview</h4>
                  <p className="text-gray-700 mb-3">
                    BlockLift uses smart contracts deployed on the Ethereum blockchain to ensure transparent, 
                    trustless crowdfunding operations. All funds are held in escrow until campaign goals are met or deadlines expire.
                  </p>
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Contract Address</h5>
                    <code className="text-sm bg-white px-2 py-1 rounded border">
                      0x742d35Cc6634C0532925a3b8D93C7C5b8e0C8B23
                    </code>
                    <p className="text-sm text-gray-600 mt-2">
                      Always verify this address before interacting with the contract
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Core Functions</h4>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">createCampaign()</h5>
                      <p className="text-sm text-gray-700 mb-2">Creates a new crowdfunding campaign</p>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <strong>Parameters:</strong><br/>
                        • goal: Funding target in wei<br/>
                        • duration: Campaign duration in seconds
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">contribute()</h5>
                      <p className="text-sm text-gray-700 mb-2">Contribute ETH to a campaign</p>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <strong>Parameters:</strong><br/>
                        • campaignId: ID of the campaign to support<br/>
                        <strong>Payable:</strong> Yes (ETH amount to contribute)
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">withdraw()</h5>
                      <p className="text-sm text-gray-700 mb-2">Campaign creator withdraws funds after success</p>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <strong>Parameters:</strong><br/>
                        • campaignId: ID of the successful campaign<br/>
                        <strong>Requirements:</strong> Goal reached, deadline passed, creator only
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">refund()</h5>
                      <p className="text-sm text-gray-700 mb-2">Contributors claim refunds from failed campaigns</p>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <strong>Parameters:</strong><br/>
                        • campaignId: ID of the failed campaign<br/>
                        <strong>Requirements:</strong> Goal not reached, deadline passed
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Events</h4>
                  <p className="text-gray-700 mb-3">
                    The contract emits events for all major actions, enabling transparent tracking of all activities.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">CampaignCreated</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• campaignId</li>
                        <li>• creator address</li>
                        <li>• goal amount</li>
                        <li>• deadline timestamp</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Contributed</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• campaignId</li>
                        <li>• contributor address</li>
                        <li>• contribution amount</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Withdrawn</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• campaignId</li>
                        <li>• creator address</li>
                        <li>• withdrawn amount</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Refunded</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• campaignId</li>
                        <li>• contributor address</li>
                        <li>• refund amount</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Security Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Access Control</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Only creators can withdraw from their campaigns</li>
                        <li>• Only contributors can claim their refunds</li>
                        <li>• Time-based restrictions prevent premature actions</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Fund Protection</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Funds locked until goal met or deadline passed</li>
                        <li>• Automatic refund eligibility for failed campaigns</li>
                        <li>• No partial withdrawals - all or nothing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-900 mb-3">Interacting with the Contract</h4>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      Advanced users can interact directly with the smart contract using tools like Etherscan or custom scripts. 
                      However, we recommend using the BlockLift web interface for the best user experience.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">Via BlockLift Interface</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• User-friendly forms</li>
                          <li>• Input validation</li>
                          <li>• Gas estimation</li>
                          <li>• Transaction status tracking</li>
                        </ul>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">Direct Contract Interaction</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Etherscan write functions</li>
                          <li>• Custom DApp development</li>
                          <li>• Web3 libraries (ethers.js, web3.js)</li>
                          <li>• Command line tools</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-2">Contract Verification</h5>
                  <p className="text-sm text-blue-800 mb-2">
                    Our smart contract source code is verified on Etherscan for full transparency.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://etherscan.io/address/0x742d35Cc6634C0532925a3b8D93C7C5b8e0C8B23" target="_blank" rel="noopener noreferrer">
                      View on Etherscan <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
