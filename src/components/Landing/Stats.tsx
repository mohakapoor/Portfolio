"use client";

import React from "react";

const STATS = [
  { value: "12", label: "Projects Shipped" },
  { value: "08", label: "Deployed Systems" },
  { value: "04", label: "Years Experience" },
  { value: "∞", label: "Tabs Open" },
];

export function Stats() {
  return (
    <section className="relative w-full bg-white/[0.04]">
      {/* 
        The grid uses a 1px gap with the container's background (white/0.04) 
        acting as the divider line between the solid black cells.
      */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px]">
        {STATS.map((stat) => (
          <div 
            key={stat.label} 
            className="bg-[#0d0d0d] px-8 py-12 flex flex-col items-start"
          >
            <span className="text-4xl md:text-5xl font-bold tracking-tight text-white/92 mb-4">
              {stat.value}
            </span>
            <span className="text-[11px] uppercase tracking-[0.12em] font-medium text-white/25">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
