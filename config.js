export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // From Sepolia deployment
export const CONTRACT_ABI = [
  // Copy ABI from crowdfunding-web3/artifacts/contracts/Crowdfunding.sol/Crowdfunding.json
  {
    inputs: [{ internalType: "uint256", name: "_goal", type: "uint256" }, { internalType: "uint256", name: "_duration", type: "uint256" }],
    name: "createCampaign",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_campaignId", type: "uint256" }],
    name: "contribute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_campaignId", type: "uint256" }],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_campaignId", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "campaigns",
    outputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256", name: "goal", type: "uint256" },
      { internalType: "uint256", name: "raised", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "bool", name: "completed", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "campaignCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "contributions",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "campaignId", type: "uint256" },
      { indexed: false, internalType: "address", name: "creator", type: "address" },
      { indexed: false, internalType: "uint256", name: "goal", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "CampaignCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "campaignId", type: "uint256" },
      { indexed: false, internalType: "address", name: "contributor", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "Contributed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "campaignId", type: "uint256" },
      { indexed: false, internalType: "address", name: "contributor", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "Refunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "campaignId", type: "uint256" },
      { indexed: false, internalType: "address", name: "creator", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "Withdrawn",
    type: "event",
  },
];