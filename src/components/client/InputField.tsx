import { RiSparklingLine } from "react-icons/ri";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { TbSend } from "react-icons/tb";
import { LucideLoaderCircle } from "lucide-react";
import { LuDot } from "react-icons/lu";
import type { Ref } from "react";

interface InputFieldProps {
  input: string;
  setInput: (e: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSend: () => void;
  clearChat: () => void;
  isLoading: boolean;
  inputRef: Ref<HTMLInputElement>;
}
export default function InputField({
  input,
  setInput,
  handleKeyDown,
  isLoading,
  handleSend,
  clearChat,
  inputRef
}: InputFieldProps) {

  return (
    <div className="fixed bottom-0 pb-0 md:pb-3 w-full space-y-2 border-t-2 border-slate-200 px-3 pt-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center gap-2">
        <RiSparklingLine className="h-5 w-5 text-emerald-800" />
        <Input
          ref={inputRef}
          disabled={isLoading}
          className="h-12 flex-1 border-2 border-emerald-600 bg-white/60 md:text-base"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          onClick={handleSend}
          className="h-12 w-12 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-100"
          disabled={isLoading}
          size={"icon"}
        >
          {isLoading ? (
            <LucideLoaderCircle className="size-5 animate-spin" />
          ) : (
            <TbSend className="size-5" />
          )}
        </Button>
      </div>
      <div className="mx-auto md:flex max-w-4xl items-center pl-8 text-sm text-slate-500 hidden">
        <span>Powered by Gemini 2.0 Flash</span> <LuDot />
        <span
          className="cursor-pointer text-red-600 hover:underline"
          onClick={clearChat}
        >
          clear chat
        </span>
      </div>
    </div>
  );
}
