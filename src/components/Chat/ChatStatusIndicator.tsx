import React from "react";
import { Activity, AlertCircle } from "lucide-react";

interface ChatStatusIndicatorProps {
  isOnline: boolean | null;
}

export function ChatStatusIndicator({ isOnline }: ChatStatusIndicatorProps) {
  return (
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
  );
}
