import React from "react";
import { Terminal, Database, Code } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Message } from "./types";

interface ChatMessageBubbleProps {
  message: Message;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  // Helper to safely format paths in the UI
  const formatPath = (path: string) => {
    const parts = path.split("\\").pop() || path.split("/").pop();
    return parts || path;
  };

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      } max-w-4xl mx-auto w-full`}
    >
      {message.role === "user" ? (
        <div className="max-w-[80%] flex items-start gap-4 flex-row-reverse">
          <div className="w-8 h-8 rounded bg-[#1a1a1a] border border-[#404040] flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white/70">USR</span>
          </div>
          <div className="bg-[#1a1a1a] border border-[#404040] p-4 rounded-lg rounded-tr-none text-[#f5f5dc] text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
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
              <span className="text-[10px] uppercase tracking-widest text-[#cc2936] font-bold">
                Code Atlas
              </span>
            </div>

            <div className="text-[#f5f5dc] text-sm leading-relaxed space-y-4">
              <div className="text-sm leading-relaxed text-[#f5f5dc]">
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="mb-3 last:mb-0" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc list-outside space-y-1.5 my-3 ml-4"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-outside space-y-1.5 my-3 ml-4"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="pl-1" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-white" {...props} />
                    ),
                    code: ({ node, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const isInline =
                        !match && !String(children).includes("\n");
                      return isInline ? (
                        <code
                          className="text-[#a1faff] bg-[#a1faff]/10 px-1 py-0.5 rounded border border-[#a1faff]/20 font-courier text-xs"
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <div className="mt-4 bg-[#0a0a0a] border border-[#404040] rounded overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1a1a] border-b border-[#404040]">
                            <div className="flex items-center gap-2">
                              <Code className="w-3 h-3 text-white/40" />
                              <span className="text-[10px] font-courier text-white/60">
                                Snippet
                              </span>
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
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* Render Sources if they exist */}
              {message.sources && message.sources.length > 0 && (
                <details className="mt-4 pt-4 border-t border-[#404040]/50 group">
                  <summary className="text-[10px] uppercase tracking-widest text-[#cc2936]/70 mb-3 flex items-center gap-2 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden hover:text-[#cc2936] transition-colors">
                    <Database className="w-3 h-3" />
                    Sources
                    <span className="ml-auto text-xs opacity-50 group-open:rotate-90 transition-transform">
                      ▶
                    </span>
                  </summary>
                  <ul className="mt-2 space-y-1.5 list-disc list-inside text-white/50 text-xs">
                    {message.sources.map((source, idx) => (
                      <li key={idx} className="truncate">
                        <span className="font-bold">{source.repo}</span>
                        <span className="mx-1 opacity-50">/</span>
                        <span className="font-courier text-[#f5f5dc]">
                          {source.symbol !== "None"
                            ? source.symbol
                            : formatPath(source.path)}
                        </span>
                        <span className="ml-2 text-[9px] uppercase bg-[#1a1a1a] border border-[#404040] px-1 rounded text-white/40">
                          {source.type}
                        </span>
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
  );
}
