"use client";

import InputField from "@/components/client/InputField";
import { useChatbotStore } from "@/lib/chatbotStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BsCheck, BsCheckAll } from "react-icons/bs";
import { FaRobot, FaUser, FaUserAstronaut } from "react-icons/fa";
import { RiLoader4Fill } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

export default function AiChatbot({ chatId }: { chatId: string }) {
  const [input, setInput] = useState("");
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isTyping,
    setIsTyping,
    messages,
    addMessage,
    updateMessage,
    clearMessages,
    markMessageAsAnswered,
    setConversationId,
  } = useChatbotStore();

  useEffect(() => {
    if (chatId == "") {
      router.push("/ai");
      return;
    }
    setConversationId(chatId);
    scrollToBottom();
    setIsTyping(false);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollToBottom();
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1] || null;
      if (lastMessage === null) return;
      if (lastMessage.sender === "user" && !lastMessage.answered) {
        setIsTyping(true);
        fetchResponse(lastMessage.content, lastMessage.id);
      } else {
        setIsTyping(false);
      }
    }
  }, [messages]);

  const fetchResponse = async (input: string, inputId: string) => {
    setIsTyping(true);
    const botMessageId = addMessage("", "bot");
    const history = messages.map((message) => {
      return {
        role: message.sender === "user" ? "user" : "model",
        parts: [{ text: message.content }],
      };
    });

    try {
      const response = await fetch("/api/ai-res", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: input, history: history }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          markMessageAsAnswered(inputId);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.token) {
              accumulatedResponse += parsed.token;
              updateMessage(botMessageId, accumulatedResponse);
              scrollToBottom();
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      updateMessage(botMessageId, "Error: Could not get response");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      const inputId = addMessage(input, "user");
      fetchResponse(input, inputId);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      handleSend();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <section className="mx-auto min-h-96 max-w-4xl px-3 pb-[100px]">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full flex-col py-1.5 ${message.sender == "user" ? "items-end" : "items-start"}`}
            >
              <p className="px-12 text-sm text-slate-500">
                {new Date(message.timestamp).toLocaleDateString("en-US", {
                  year: "2-digit",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  timeZone: "IST",
                })}
              </p>
              <div
                className={`flex ${message.sender == "bot" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`prose relative max-w-2xl rounded-md px-3 py-2 ${message.sender == "user" ? "bg-emerald-100" : "bg-slate-100"} w-fit`}
                >
                  {message.content == "" ? (
                    <RiLoader4Fill className="size-4 animate-spin" />
                  ) : message.sender === "bot" ? (
                    <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                  <div className="absolute right-0 -bottom-4 float-right flex text-emerald-500">
                    {message.sender == "user" &&
                      (message.answered ? <BsCheckAll /> : <BsCheck />)}
                  </div>
                </div>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${message.sender == "user" ? "ml-2 bg-emerald-100 text-emerald-800" : "mr-2 bg-slate-100 text-slate-800"}`}
                >
                  {message.sender == "user" ? <FaUser /> : <FaRobot />}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-[600px] w-full items-center justify-center">
            <FaUserAstronaut className="size-44 text-emerald-700" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </section>
      <InputField
        inputRef={inputRef}
        input={input}
        setInput={setInput}
        isLoading={isTyping}
        handleSend={handleSend}
        handleKeyDown={handleKeyDown}
        clearChat={clearMessages}
      />
    </main>
  );
}
