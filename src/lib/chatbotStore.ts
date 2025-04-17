import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: number;
  answered: boolean;
}

interface ChatbotState {
  messages: Message[];
  isTyping: boolean;
  conversationId: string | null;

  setConversationId: (id: string | null) => void;
  setIsTyping: (isTyping: boolean) => void;
  clearMessages: () => void;
  addMessage: (text: string, sender: "user" | "bot") => string;
  updateMessage: (id: string, content: string) => void;
  markMessageAsAnswered: (id: string) => void;
}

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set, get) => ({
      messages: [],
      isTyping: false,
      conversationId: null,

      setConversationId: (id) => {
        set({ conversationId: id });
      },
      setIsTyping: (isTyping) => {
        set({ isTyping });
      },
      clearMessages: () => {
        set({ messages: [], conversationId: null });
      },
      addMessage: (text, sender) => {
        const id = uuidv4();
        const newMessage: Message = {
          id,
          content: text,
          sender,
          timestamp: Date.now(),
          answered: sender === "user" ? false : true, // User messages start unanswered, bot messages are answered
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
        return id;
      },
      updateMessage: (id, content) => {
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === id ? { ...message, content } : message,
          ),
        }));
      },
      markMessageAsAnswered: (id) => {
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === id ? { ...message, answered: true } : message,
          ),
        }));
      },
    }),
    {
      name: "chatbot-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
