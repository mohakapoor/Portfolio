import React from "react";
import { AlertCircle } from "lucide-react";

interface ChatOfflineOverlayProps {
  isOnline: boolean | null;
}

export function ChatOfflineOverlay({ isOnline }: ChatOfflineOverlayProps) {
  if (isOnline !== false) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-[#121212] border border-[#cc2936]/50 p-8 rounded shadow-[0_0_30px_rgba(204,41,54,0.15)] text-center space-y-6 flex flex-col items-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#cc2936]/10 border border-[#cc2936]/30 mb-2">
          <AlertCircle className="w-6 h-6 text-[#cc2936]" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white uppercase newspaper-headline border-none">
          Backend Offline
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          CodeAtlas cannot connect to the backend server. The AI assistant is
          currently unavailable. Please ensure the local FastAPI server is
          running.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="spider-noir-button px-8 py-3 border-2 text-xs uppercase tracking-widest font-bold mt-4 text-white"
          style={{
            borderColor: "#cc2936",
            boxShadow: "0 0 10px rgba(204,41,54,0.2)",
          }}
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}
