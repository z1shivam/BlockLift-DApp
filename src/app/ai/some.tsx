"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleGenAI } from "@google/genai";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RiSparklingLine } from "react-icons/ri";
import { TbSend } from "react-icons/tb";
import { remark } from "remark";
import html from "remark-html";

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function Page() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      setMessages([{ role: "user", content: q }]);
      fetchResponse(q);
    }
  }, [searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const fetchResponse = async (userInput: string) => {
    setIsLoading(true);
    try {
      const response = await ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        config: {
          systemInstruction:
            "You are BlockLift AI. Blocklift is a decentralized crowdfunding platform. You can connect your metamask wallet here and create campaigns from directly on homepage. it is very easy to use and built by 2022 batch of Students of SMVDU. Developers are Shivam (22bcs084), Pranav (22bcs063) & Shivam (22bcs083). Shivam (22bcs084) is the lead developer. Whenever asked about shivam, answer about the 22bcs084 only. Be very concise with answers. do not exceed 150 words in any situation.",
          maxOutputTokens: 700,
          temperature: 0.1,
        },
        contents: [{ parts: [{ text: userInput }] }],
      });

      setMessages((prev) => [...prev, { role: "bot", content: "" }]);
      let botResponse = "";
      setIsLoading(false);

      console.log(messages);
      for await (const chunk of response) {
        botResponse += chunk.text || "";
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "bot", content: botResponse },
        ]);
      }
      console.log(messages);

      if (!botResponse) {
        throw new Error("No response generated");
      }

      const processedContent = await remark().use(html).process(botResponse);
      const contentHtml = processedContent.toString();

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", content: contentHtml },
      ]);
    } catch (error) {
      // toast.error("Error fetching response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: input }]);
      fetchResponse(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      handleSend();
    }
  };

  return (
    <>
      <section className="mx-auto flex min-h-96 w-full max-w-4xl flex-col p-4">
        <div className="mb-4 flex-1 overflow-y-auto rounded-lg px-4 pb-12">
          {messages.map((msg, index) => (
            <div key={index}>
              <div
                className={`${msg.role === "user" && "pr-2 text-right"} pl-2 text-sm text-emerald-700`}
              >
                {msg.role === "user" ? "user" : "blocklift"}
              </div>
              <div
                className={`mb-4 flex w-fit max-w-[80%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "ml-auto justify-end bg-emerald-100"
                    : "mr-auto justify-start bg-gray-100"
                }`}
              >
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mr-auto mb-4 flex w-fit max-w-[80%] justify-start rounded-lg bg-gray-100 p-3">
              <div>Thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </section>
     
    </>
  );
}
