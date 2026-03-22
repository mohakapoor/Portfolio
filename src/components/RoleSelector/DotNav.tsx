"use client";

import React from "react";

interface DotNavProps {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  activeColor: string;
}

export function DotNav({ total, activeIndex, onSelect, activeColor }: DotNavProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Interaction Guidance Caption */}
      <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-white/30 animate-pulse">
        Click to stop rotating
      </span>
      
      <div className="flex gap-6 items-center">
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className="w-[10px] h-[10px] rounded-full transition-all duration-300 ease-out cursor-pointer"
              style={{
                background: isActive ? activeColor : "rgba(255,255,255,0.15)",
                transform: isActive ? "scale(1.4)" : "scale(1)",
                boxShadow: isActive ? `0 0 15px ${activeColor}90` : "none"
              }}
              aria-label={`Select role ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
