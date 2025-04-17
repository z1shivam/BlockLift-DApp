"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RiSparklingLine } from "react-icons/ri";
import { Input } from "../ui/input";
import { henny_penny } from "./Header";
import { useChatbotStore } from "@/lib/chatbotStore";
import { toast } from "sonner";

export default function AiChatHome() {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { conversationId, addMessage } = useChatbotStore();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      addMessage(inputValue, "user");
      if (conversationId != null) {
        setInputValue("");
        router.push(`/ai/${conversationId}`);
      } else {
        try {
          const response = await fetch("/api/create-chat");
          if (!response.ok) {
            throw new Error(`Failed to create chat: ${response.statusText}`);
          }
          const data = await response.json();
          const chatId = data.uuid;
          router.push(`/ai/${chatId}`);
        } catch (err) {
          console.error(err);
          toast(err as string);
          setError("Failed to start chat. Please try again.");
        }
      }
    }
  };

  return (
    <section className="mx-auto flex min-h-96 w-full max-w-7xl flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1
          className={`text-4xl font-bold ${henny_penny.className} text-emerald-800`}
        >
          Ask BlockLift Anything
        </h1>
      </div>
      <div className="flex w-2/3 items-center gap-2">
        <RiSparklingLine className="h-5 w-5 text-emerald-800" />
        <Input
          className="h-12 w-full border-2 border-emerald-600 text-lg"
          placeholder="Ask me anything about this platform..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
