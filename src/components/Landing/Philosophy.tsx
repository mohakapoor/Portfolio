"use client";

import React from "react";

export function Philosophy() {
  return (
    <section className="relative w-full px-8 py-24 md:py-32 border-b border-white/[0.04] bg-[#0d0d0d] flex justify-center text-center">
      <div className="max-w-[540px]">
        <blockquote className="text-2xl md:text-[28px] font-bold tracking-tight text-white/92 leading-[1.35]">
          Good models are <span className="text-white/25 antialiased">20% architecture</span> and 80% knowing your data.
        </blockquote>
        
        <cite className="block mt-8 not-italic">
          <span className="text-[10px] uppercase tracking-[0.14em] text-white/15">
            — Mohak Kapoor
          </span>
        </cite>
      </div>
    </section>
  );
}
