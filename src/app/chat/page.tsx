"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Terminal, Database, Code, Activity, Search, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { checkHealth, sendChatMessage } from "./actions";

type Source = {
  repo: string;
  path: string;
  type: string;
  symbol: string;
};

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  sources?: Source[];
};

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Helper to safely format paths in the UI
  const formatPath = (path: string) => {
    const parts = path.split("\\").pop() || path.split("/").pop();
    return parts || path;
  };

  return (
    <main className="bg-[#0d0d0d] h-[100dvh] w-full selection:bg-white/10 overflow-hidden flex flex-col font-sans relative">
      
      {/* Offline Alert Overlay */}
      {isOnline === false && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-[#121212] border border-[#cc2936]/50 p-8 rounded shadow-[0_0_30px_rgba(204,41,54,0.15)] text-center space-y-6 flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#cc2936]/10 border border-[#cc2936]/30 mb-2">
              <AlertCircle className="w-6 h-6 text-[#cc2936]" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white uppercase newspaper-headline border-none">Backend Offline</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              CodeAtlas cannot connect to the backend server. The AI assistant is currently unavailable. Please ensure the local FastAPI server is running.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="spider-noir-button px-8 py-3 border-2 text-xs uppercase tracking-widest font-bold mt-4 text-white" 
              style={{ borderColor: '#cc2936', boxShadow: '0 0 10px rgba(204,41,54,0.2)' }}>
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Floating Status Indicator */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 border border-[#404040] rounded-full text-xs bg-[#1a1a1a]/80 backdrop-blur">
        {isOnline === null ? (
          <>
            <Activity className="w-3 h-3 text-white/50 animate-pulse" />
            <span className="text-white/50 tracking-wider">Checking Status...</span>
          </>
        ) : isOnline ? (
          <>
            <Activity className="w-3 h-3 text-[#cc2936]" />
            <span className="text-white/80 tracking-wider">Atlas Online</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span className="text-red-500 tracking-wider">Backend Offline</span>
          </>
        )}
      </div>

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

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} max-w-4xl mx-auto w-full`}>
                
                {msg.role === 'user' ? (
                  <div className="max-w-[80%] flex items-start gap-4 flex-row-reverse">
                    <div className="w-8 h-8 rounded bg-[#1a1a1a] border border-[#404040] flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-white/70">USR</span>
                    </div>
                    <div className="bg-[#1a1a1a] border border-[#404040] p-4 rounded-lg rounded-tr-none text-[#f5f5dc] text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[85%] flex items-start gap-4">
                    <div className="w-8 h-8 rounded bg-[#cc2936]/20 border border-[#cc2936] flex items-center justify-center shrink-0 relative overflow-hidden group mt-1">
                      <div className="absolute inset-0 bg-[#cc2936]/10 animate-pulse"></div>
                      <Terminal className="w-4 h-4 text-[#cc2936] relative z-10" />
                    </div>
                    <div className="case-file-card bg-[#1a1a1a] border border-[#2a2a2a] p-5 rounded-lg rounded-tl-none shadow-[0_0_20px_rgba(204,41,54,0.05)] w-full relative">
                      
                      <div className="flex items-center gap-2 mb-3 border-b border-[#2a2a2a] pb-2">
                        <span className="text-[10px] uppercase tracking-widest text-[#cc2936] font-bold">Code Atlas</span>
                      </div>

                      <div className="text-[#f5f5dc] text-sm leading-relaxed space-y-4">
                        <div className="text-sm leading-relaxed text-[#f5f5dc]">
                          <ReactMarkdown
                            components={{
                              p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc list-outside space-y-1.5 my-3 ml-4" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal list-outside space-y-1.5 my-3 ml-4" {...props} />,
                              li: ({node, ...props}) => <li className="pl-1" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                              code: ({node, className, children, ...props}: any) => {
                                const match = /language-(\w+)/.exec(className || '')
                                const isInline = !match && !String(children).includes('\n')
                                return isInline ? (
                                  <code className="text-[#a1faff] bg-[#a1faff]/10 px-1 py-0.5 rounded border border-[#a1faff]/20 font-courier text-xs" {...props}>
                                    {children}
                                  </code>
                                ) : (
                                  <div className="mt-4 bg-[#0a0a0a] border border-[#404040] rounded overflow-hidden">
                                    <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1a1a] border-b border-[#404040]">
                                      <div className="flex items-center gap-2">
                                        <Code className="w-3 h-3 text-white/40" />
                                        <span className="text-[10px] font-courier text-white/60">Snippet</span>
                                      </div>
                                    </div>
                                    <div className="p-3 overflow-x-auto">
                                      <pre className="text-xs font-courier leading-relaxed">
                                        <code className={className} {...props}>
                                          {children}
                                        </code>
                                      </pre>
                                    </div>
                                  </div>
                                )
                              }
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                        
                        {/* Render Sources if they exist */}
                        {msg.sources && msg.sources.length > 0 && (
                          <details className="mt-4 pt-4 border-t border-[#404040]/50 group">
                            <summary className="text-[10px] uppercase tracking-widest text-[#cc2936]/70 mb-3 flex items-center gap-2 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden hover:text-[#cc2936] transition-colors">
                              <Database className="w-3 h-3" />
                              Sources
                              <span className="ml-auto text-xs opacity-50 group-open:rotate-90 transition-transform">▶</span>
                            </summary>
                            <ul className="mt-2 space-y-1.5 list-disc list-inside text-white/50 text-xs">
                              {msg.sources.map((source, idx) => (
                                <li key={idx} className="truncate">
                                  <span className="font-bold">{source.repo}</span>
                                  <span className="mx-1 opacity-50">/</span>
                                  <span className="font-courier text-[#f5f5dc]">
                                    {source.symbol !== "None" ? source.symbol : formatPath(source.path)}
                                  </span>
                                  <span className="ml-2 text-[9px] uppercase bg-[#1a1a1a] border border-[#404040] px-1 rounded text-white/40">{source.type}</span>
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                  placeholder={isOnline === false ? "Backend offline..." : "Type a message..."}
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
          
        </div>
      </div>
    </main>
  );
}
