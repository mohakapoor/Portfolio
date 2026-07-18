"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { checkHealth, sendChatMessage } from "./actions";

// Modular Components
import type { Message } from "@/components/Chat/types";
import { ChatOfflineOverlay } from "@/components/Chat/ChatOfflineOverlay";
import { ChatStatusIndicator } from "@/components/Chat/ChatStatusIndicator";
import { ChatMessageBubble } from "@/components/Chat/ChatMessageBubble";
import { ChatInputForm } from "@/components/Chat/ChatInputForm";

export default function ChatPage() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Check health on mount
  useEffect(() => {
    async function init() {
      const health = await checkHealth();
      setIsOnline(health.ok);
    }
    init();
  }, []);

  // Auto-scroll
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading || isOnline === false) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const res = await sendChatMessage(userMessage.content);
    
    setIsLoading(false);

    if (res.success) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: res.data.answer,
        sources: res.data.sources,
      };
      setMessages((prev) => [...prev, botMessage]);
    } else {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "Error communicating with CodeAtlas Backend: " + res.error,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <main className="bg-[#0d0d0d] h-[100dvh] w-full selection:bg-white/10 overflow-hidden flex flex-col font-sans relative">
      
      {/* Modals & Status */}
      <ChatOfflineOverlay isOnline={isOnline} />
      <ChatStatusIndicator isOnline={isOnline} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative bg-newsprint bg-[size:50px_50px]">
          {/* Subtle overlay to darken the bg */}
          <div className="absolute inset-0 bg-[#0d0d0d]/90 pointer-events-none z-0"></div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 relative z-10 scrollbar-thin scrollbar-thumb-[#404040] scrollbar-track-transparent">
            
            {/* Initial System Message */}
            {messages.length === 0 && (
              <div className="flex justify-center my-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#cc2936]/70 border-b border-[#cc2936]/30 pb-1">
                  Secure Terminal Initialized
                </div>
              </div>
            )}

            {/* Render all messages */}
            {messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}
            
            {/* Thinking Indicator */}
            {isLoading && (
              <div className="flex justify-start max-w-4xl mx-auto w-full">
                <div className="max-w-[85%] flex items-start gap-4">
                  <div className="w-8 h-8 rounded bg-[#cc2936]/10 border border-[#cc2936]/50 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4 text-[#cc2936]/70 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-courier text-[#cc2936]/70 mt-2">
                    <span className="w-1.5 h-1.5 bg-[#cc2936] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#cc2936] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#cc2936] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    <span className="ml-2 uppercase tracking-widest text-[10px]">Processing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={endOfMessagesRef} className="h-4"></div>
          </div>

          {/* Input Area */}
          <ChatInputForm 
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            isOnline={isOnline}
            onSubmit={handleSubmit}
          />
          
        </div>
      </div>
    </main>
  );
}
