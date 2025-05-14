import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../config";

export const connectWallet = async () => {
  if (!window.ethereum) throw new Error("MetaMask not installed. download it from https://metamask.io/download");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  const address = await signer.getAddress();
  return { provider, signer, contract, address };
};

export const getCampaigns = async (contract: any) => {
  const campaignCount = await contract.campaignCount();
  const campaigns = [];
  for (let i = 1; i <= campaignCount; i++) {
    const campaign = await contract.campaigns(i);
    campaigns.push({
      id: i,
      creator: campaign.creator,
      goal: ethers.formatEther(campaign.goal),
      raised: ethers.formatEther(campaign.raised),
      deadline: new Date(Number(campaign.deadline) * 1000).toLocaleString(),
      completed: campaign.completed,
    });
  }
  return campaigns;
};
