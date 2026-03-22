"use client";

import React from "react";
import Typewriter from "@/components/Typewriter";
import Link from "next/link";
import { Marquee } from "@/components/Landing/Marquee";

export function MobileHero() {
  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center p-8 text-center bg-transparent">
      {/* Background is provided by .noir-hero::before in globals.css */}
      
      <div className="z-10 w-full max-w-sm flex flex-col items-center">
        {/* Name with drop shadow for readability against the portrait bg */}
        <h1 className="newspaper-headline text-5xl text-white mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-tight">
          Mohak Kapoor
        </h1>
        
        {/* Role Tagline - Simple Typewriter */}
        <div className="h-12 flex items-center justify-center mb-12">
          <Typewriter 
            text="ML Engineer | Data Scientist" 
            className="text-spider-red font-mono text-lg tracking-widest uppercase"
            speedMs={80}
          />
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-5 w-full">
          <Link
            className="spider-noir-button w-full py-4 border-2 flex items-center justify-center text-sm uppercase tracking-[0.2em] font-bold"
            href="/story"
          >
            Read More
          </Link>
          <a
            className="spider-noir-button w-full py-4 border-2 flex items-center justify-center text-sm uppercase tracking-[0.2em] font-bold bg-white/5"
            href="/MOHAK_KAPOOR_ML.pdf"
            download
          >
            Resume
          </a>
        </div>
      </div>
      
      {/* Marquee Footnote for Mobile */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden z-20">
        <Marquee />
      </div>

      {/* Subtle bottom vignette for some depth */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-60 pointer-events-none" />
    </div>
  );
}
