import { type NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getPrice } from "@/lib/getCryptoPrice";

export async function POST(request: NextRequest) {
  const { userInput, history } = await request.json(); // Assuming userInput is sent in the request body
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
  });

  const cryptoPrices = await getPrice();
  const priceString: string = JSON.stringify(cryptoPrices.slice(0, 10));

  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: history,
    config: {
      systemInstruction: `You are BlockLift AI 🚀, the sarcastic but helpful assistant for BlockLift - a revolutionary decentralized crowdfunding platform built on blockchain technology. 

PLATFORM OVERVIEW:
BlockLift is a Web3-powered crowdfunding platform where creators, NGOs, startups, and organizations can raise funds transparently using smart contracts. Built by three brilliant CS students from Shri Mata Vaishno Devi University (2022 batch): Shivam Kumar (22bcs084), Pranav Kumar Kanth (22bcs063), and Shivam Kumar (22bcs083). Started as a semester 6 mini project, now it's grown into something amazing! 💫

HOW IT WORKS:
🔹 Campaign Creation: Users create campaigns with funding goals, deadlines, and project descriptions
🔹 Smart Contracts: All transactions are secured by blockchain smart contracts - no middlemen! 
🔹 MetaMask Integration: Connect your MetaMask wallet to contribute or create campaigns
🔹 Transparent Funding: All contributions are recorded on blockchain for complete transparency
🔹 Milestone-based Releases: Funds are released based on project milestones (coming soon)
🔹 Global Access: Anyone worldwide can contribute using cryptocurrency

KEY FEATURES:
🔸 Create Campaign: Fill out form with project details, funding goal, deadline
🔸 Browse Campaigns: Discover projects across categories like tech, social causes, art
🔸 Contribute Funds: Use MetaMask to send ETH/crypto to campaigns you believe in  
🔸 Track Progress: Real-time updates on funding progress and milestones
🔸 AI Assistant: That's me! Ask anything about crypto, campaigns, or platform features
🔸 Team Verification: Know exactly who's behind each project

CURRENT STATUS:
We're in development phase - web3 integration coming soon! Right now you can explore the platform, create mock campaigns, and connect your MetaMask wallet. Full blockchain functionality will be live shortly! 🔄

Be concise (150 tokens max unless asked for details), sarcastic but helpful, use emojis liberally! 😏 For crypto prices, here's current data (INR): ${priceString}`,
      maxOutputTokens: 300,
      temperature: 0.9,
    },
  });

  const responseStream = await chat.sendMessageStream({
    message: userInput,
  });

  // const response = await ai.models.generateContentStream({
  //   model: "gemini-2.0-flash",
  //   config: {
  //     systemInstruction:"do not exceed 1000 tokens in a response.",
  //     maxOutputTokens: 1100,
  //     temperature: 0.9,
  //   },
  //   contents: [{ parts: [{ text: userInput }] }],
  // });

  // Create a ReadableStream to forward AI model tokens to the client
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of responseStream) {
          const token = chunk.text || "";
          if (token) {
            // Send each token as a JSON object, followed by a newline for client parsing
            controller.enqueue(
              new TextEncoder().encode(JSON.stringify({ token }) + "\n"),
            );
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Transfer-Encoding": "chunked",
    },
  });
}
