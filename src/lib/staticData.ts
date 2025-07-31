export interface Campaign {
  id: number;
  title: string;
  description: string;
  image: string;
  creator: string;
  creatorName: string;
  goal: string;
  raised: string;
  deadline: string;
  completed: boolean;
  category: string;
  contributors: number;
  createdAt: string;
  story: string;
}

export interface Contribution {
  id: number;
  campaignId: number;
  contributor: string;
  contributorName: string;
  amount: string;
  timestamp: string;
  message?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  rollNumber: string;
  role: string;
  image: string;
  bio: string;
  github: string;
  linkedin: string;
  email: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

// Dummy Campaigns Data
export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    title: "Smart Water Purification System for Rural India",
    description: "Developing an IoT-based water purification system to provide clean drinking water to rural communities across India.",
    image: "/hero-image.png",
    creator: "0x742d35Cc6634C0532925a3b8D93C7C5b8e0C8B23",
    creatorName: "Tech4Good Foundation",
    goal: "5.0",
    raised: "3.2",
    deadline: "2025-09-15",
    completed: false,
    category: "Technology",
    contributors: 156,
    createdAt: "2025-01-15",
    story: "Access to clean water remains a critical challenge in rural India. Our team has developed a smart, IoT-enabled water purification system that can be deployed in remote areas. The system uses solar power and advanced filtration technology to provide safe drinking water. With your support, we can deploy 50 units across 10 villages in Rajasthan and Uttar Pradesh."
  },
  {
    id: 2,
    title: "Blockchain-Based Education Platform",
    description: "Creating a decentralized education platform that provides verified certificates and courses using blockchain technology.",
    image: "/madhubani-crowdfunding.png",
    creator: "0x8ba1f109551bD432803012645Hac136c22c501e2",
    creatorName: "EduChain Initiative",
    goal: "8.5",
    raised: "8.5",
    deadline: "2025-08-20",
    completed: true,
    category: "Education",
    contributors: 234,
    createdAt: "2024-12-10",
    story: "Traditional education systems often lack transparency in credentialing and accessibility. Our blockchain-based platform ensures tamper-proof certificates, decentralized course content, and global accessibility. The funding has helped us create a platform that's already serving 5,000+ students worldwide."
  },
  {
    id: 3,
    title: "Madhubani Art Digital Preservation Project",
    description: "Digitizing traditional Madhubani art forms and creating NFT collections to support local artists in Bihar.",
    image: "/madhubani-crowdfunding.png",
    creator: "0x1f9840af85d09c89e2f22b3c55c04c7f1b7c8f67",
    creatorName: "Bihar Art Collective",
    goal: "3.0",
    raised: "1.8",
    deadline: "2025-10-30",
    completed: false,
    category: "Art & Culture",
    contributors: 89,
    createdAt: "2025-02-01",
    story: "Madhubani art is a treasured folk art form from Bihar, India. Our project aims to digitally preserve these traditional paintings and create NFT collections that directly benefit the original artists. We're working with 25 local artists to document their techniques and stories while providing them with a new revenue stream through digital art sales."
  },
  {
    id: 4,
    title: "Sustainable Farming Initiative - Organic Vegetable Cooperative",
    description: "Supporting small farmers to transition to organic farming and establish a cooperative marketplace.",
    image: "/hero-image.png",
    creator: "0x2f9840af85d09c89e2f22b3c55c04c7f1b7c8f68",
    creatorName: "Green Fields Cooperative",
    goal: "6.0",
    raised: "4.1",
    deadline: "2025-11-15",
    completed: false,
    category: "Agriculture",
    contributors: 178,
    createdAt: "2025-01-28",
    story: "Small-scale farmers face numerous challenges including access to markets and sustainable farming practices. Our cooperative provides training in organic farming methods, seeds, equipment, and a direct-to-consumer marketplace. With your support, we can help 100 farmers transition to organic methods and increase their income by 40%."
  },
  {
    id: 5,
    title: "Open Source Medical Equipment for Remote Areas",
    description: "Developing low-cost, open-source medical equipment designs for healthcare in underserved regions.",
    image: "/hero-image.png",
    creator: "0x3f9840af85d09c89e2f22b3c55c04c7f1b7c8f69",
    creatorName: "MedTech for All",
    goal: "12.0",
    raised: "2.3",
    deadline: "2025-12-31",
    completed: false,
    category: "Healthcare",
    contributors: 67,
    createdAt: "2025-02-15",
    story: "Remote healthcare facilities often lack access to essential medical equipment due to high costs and maintenance requirements. Our team is developing open-source designs for critical medical devices including oxygen concentrators, patient monitors, and portable X-ray machines. These designs can be manufactured locally at 70% lower cost than commercial alternatives."
  }
];

// Dummy Contributions Data
export const mockContributions: Contribution[] = [
  {
    id: 1,
    campaignId: 1,
    contributor: "0x4f5cD54c13f29a8a80a38e2ca2b25c8f5d6e7890",
    contributorName: "Anonymous Donor",
    amount: "0.5",
    timestamp: "2025-07-30T14:30:00Z",
    message: "Great initiative for rural development!"
  },
  {
    id: 2,
    campaignId: 1,
    contributor: "0x5f6dE65d24f3a9b91b49f3db3c36d9g6e7f8901",
    contributorName: "WaterCare Foundation",
    amount: "1.0",
    timestamp: "2025-07-29T09:15:00Z",
    message: "Supporting clean water access for all."
  },
  {
    id: 3,
    campaignId: 1,
    contributor: "0x6f7eF76e35f4bac2c5af4ecc4d47eah7f8g9012",
    contributorName: "Tech Enthusiast",
    amount: "0.2",
    timestamp: "2025-07-28T16:45:00Z"
  },
  {
    id: 4,
    campaignId: 2,
    contributor: "0x7f8fG87f46f5cbd3d6bg5fdd5e58fbi8g9h0123",
    contributorName: "Education Advocate",
    amount: "2.0",
    timestamp: "2025-07-27T11:20:00Z",
    message: "Blockchain education is the future!"
  },
  {
    id: 5,
    campaignId: 3,
    contributor: "0x8f9gH98g57g6dce4e7ch6gee6f69gcj9h0i1234",
    contributorName: "Art Collector",
    amount: "0.8",
    timestamp: "2025-07-26T13:10:00Z",
    message: "Preserving cultural heritage through technology."
  },
  {
    id: 6,
    campaignId: 4,
    contributor: "0x9f0hI09h68h7edf5f8di7hff7g70hdk0i1j2345",
    contributorName: "Organic Supporter",
    amount: "0.3",
    timestamp: "2025-07-25T10:30:00Z"
  },
  {
    id: 7,
    campaignId: 1,
    contributor: "0xaf1iJ10i79i8feg6g9ej8igg8h81iel1j2k3456",
    contributorName: "Social Impact Investor",
    amount: "1.5",
    timestamp: "2025-07-24T15:45:00Z",
    message: "Technology for social good!"
  }
];

// Team Members Data
export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Shivam Kumar",
    rollNumber: "22bcs084",
    role: "Full Stack Developer & Project Lead",
    image: "/team/shivam1.jpg",
    bio: "Passionate about blockchain technology and decentralized applications. Leading the development of BlockLift with a focus on user experience and smart contract integration.",
    github: "https://github.com/z1shivam",
    linkedin: "https://linkedin.com/in/shivam-kumar",
    email: "shivam.22bcs084@smvdu.ac.in"
  },
  {
    id: 2,
    name: "Pranav Kumar Kanth",
    rollNumber: "22bcs063",
    role: "Smart Contract Developer & Security",
    image: "/team/pranav.jpg",
    bio: "Specializes in smart contract development and blockchain security. Ensures the platform's smart contracts are secure, efficient, and gas-optimized.",
    github: "https://github.com/pranavkanth",
    linkedin: "https://linkedin.com/in/pranav-kumar-kanth",
    email: "pranav.22bcs063@smvdu.ac.in"
  },
  {
    id: 3,
    name: "Shivam Kumar",
    rollNumber: "22bcs083",
    role: "Frontend Developer & UI/UX Designer",
    image: "/team/shivam2.jpg",
    bio: "Creates beautiful and intuitive user interfaces. Focuses on making blockchain technology accessible to everyone through thoughtful design and seamless user experience.",
    github: "https://github.com/shivam083",
    linkedin: "https://linkedin.com/in/shivam-kumar-083",
    email: "shivam.22bcs083@smvdu.ac.in"
  }
];

// Platform Statistics
export const platformStats = {
  totalCampaigns: 156,
  totalFundsRaised: "₹2,45,67,890",
  totalContributors: 1247,
  successfulCampaigns: 89,
  averageFundingTime: "45 days",
  platformFee: "2.5%"
};

// FAQ Data
export const faqs: FAQ[] = [
  {
    question: "What is BlockLift?",
    answer: "BlockLift is a decentralized crowdfunding platform built on blockchain technology. It allows creators to raise funds for their projects while ensuring transparency, security, and global accessibility."
  },
  {
    question: "How does blockchain make crowdfunding better?",
    answer: "Blockchain provides transparency through immutable records, eliminates intermediaries reducing fees, enables global participation, and ensures funds are securely managed through smart contracts."
  },
  {
    question: "What cryptocurrencies can I use?",
    answer: "Currently, BlockLift supports Ethereum (ETH). We're planning to add support for more cryptocurrencies in future updates."
  },
  {
    question: "How do I create a campaign?",
    answer: "Connect your MetaMask wallet, click 'Start Your Campaign', fill out the campaign details including goal amount and deadline, and deploy your campaign to the blockchain."
  },
  {
    question: "What happens if a campaign doesn't reach its goal?",
    answer: "If a campaign doesn't reach its funding goal by the deadline, all contributors can claim a full refund through our smart contract system."
  },
  {
    question: "Are there any fees?",
    answer: "BlockLift charges a 2.5% platform fee only on successfully funded campaigns. This covers platform maintenance and development costs."
  }
];
