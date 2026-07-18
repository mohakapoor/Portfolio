import React, { KeyboardEvent, FormEvent } from "react";
import { Send } from "lucide-react";

interface ChatInputFormProps {
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  isOnline: boolean | null;
  onSubmit: () => void;
}

export function ChatInputForm({
  input,
  setInput,
  isLoading,
  isOnline,
  onSubmit,
}: ChatInputFormProps) {
  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    onSubmit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d] to-transparent relative z-20">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
        {/* Glowing border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#cc2936]/0 via-[#cc2936]/50 to-[#cc2936]/0 rounded-lg blur opacity-30 group-focus-within:opacity-100 transition duration-500 pointer-events-none"></div>

        <div className="relative flex items-end bg-[#1a1a1a] border border-[#404040] rounded-lg focus-within:border-[#cc2936] transition-colors p-2 shadow-2xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isOnline === false}
            className="w-full bg-transparent border-none focus:ring-0 text-[#f5f5dc] text-sm resize-none p-3 max-h-[200px] min-h-[50px] font-sans scrollbar-none disabled:opacity-50"
            placeholder={
              isOnline === false ? "Backend offline..." : "Type a message..."
            }
            rows={1}
          ></textarea>
          <div className="flex items-center gap-2 p-2 shrink-0">
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isOnline === false}
              className="w-10 h-10 flex items-center justify-center rounded bg-[#cc2936] text-white hover:bg-[#a01f2a] transition-all shadow-[0_0_10px_rgba(204,41,54,0.3)] hover:shadow-[0_0_15px_rgba(204,41,54,0.5)] disabled:opacity-50 disabled:hover:bg-[#cc2936] disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="text-center mt-3">
          <span className="text-[10px] text-white/30 tracking-widest font-courier uppercase">
            Code Atlas can make mistakes. Check important information.
          </span>
        </div>
      </form>
    </div>
  );
}
