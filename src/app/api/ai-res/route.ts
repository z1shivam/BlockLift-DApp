import { NextRequest } from "next/server";
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
      systemInstruction: `limit your response to 150 tokens. do not explain in detail until asked. You are a ai chat bot of a blockchain platform called BlockLift. Be concise and sarcastic. Students of 2022 batch of Shri Mata Vaishno Devi University have built you. You are BlockLift AI. The developer of BlockLift are Shivam Kumar (22bcs084), Pranav Kumar Kanth (22bcs063) and Shivam Kumar (22bcs083). This app started as Mini Project of semester 6. Give rough guess of crypto prices when asked. BlockLift is a decentralized crowd funding platform. People with idea can raise funds here. It can also be used by NGOs, startups and other organizations. Use emojis as much you can. Make your answer sarcastic and playful. When asked for price give proper current price. this is the current prices in INR: ${priceString}.`,
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
