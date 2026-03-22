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
    <div className="flex gap-4 items-center">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="w-[6px] h-[6px] rounded-full transition-all duration-300 ease-out"
            style={{
              background: isActive ? activeColor : "rgba(255,255,255,0.2)",
              transform: isActive ? "scale(1.8)" : "scale(1)",
              boxShadow: isActive ? `0 0 10px ${activeColor}80` : "none"
            }}
            aria-label={`Select role ${i + 1}`}
          />
        );
      })}
    </div>
  );
}
