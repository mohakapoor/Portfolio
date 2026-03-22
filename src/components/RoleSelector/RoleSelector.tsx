"use client";

import React, { useState, useEffect } from "react";
import { rolesData } from "@/data/roles";
import { AmbientGlow } from "./AmbientGlow";
import { ThreeScene } from "./ThreeScene";
import { RoleDetail } from "./RoleDetail";
import { DotNav } from "./DotNav";
import Link from "next/link";

export function RoleSelector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const activeRole = rolesData[activeIndex];

  // Sync physical CSS variables for High-Tech Editorial styling (for anything downstream)
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--theme-accent", activeRole.tokens.primary);

    // Convert hex to RGB for the shadow glow opacity rule
    const hex = activeRole.tokens.primary.replace("#", "");
    if (hex.length >= 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      root.style.setProperty("--theme-accent-rgb", `${r}, ${g}, ${b}`);
    }
  }, [activeIndex, activeRole]);

  return (
    <div className="relative w-full min-h-screen flex flex-col md:flex-row items-stretch justify-center overflow-hidden">
      <AmbientGlow activeColor={activeRole.tokens.primary} />

      {/* LEFT PANEL - 45% */}
      <div className="relative w-full md:w-[45%] flex flex-col items-center justify-center z-10 p-8 md:p-16">
        <div className="w-full h-[500px]">
          <ThreeScene
            roles={rolesData}
            activeIndex={activeIndex}
            isLocked={isLocked}
            setIsLocked={setIsLocked}
            onChangeRole={setActiveIndex}
          />
        </div>
        <div className="mt-8">
          <DotNav
            total={rolesData.length}
            activeIndex={activeIndex}
            onSelect={(idx: number) => {
              setActiveIndex(idx);
              setIsLocked(true); // Lock when navigation is manually triggered
            }}
            activeColor={activeRole.tokens.primary}
          />
        </div>
      </div>

      {/* RIGHT PANEL - 55% */}
      <div className="relative w-full md:w-[55%] flex flex-col justify-center p-8 md:p-24 z-10">

        {/* Name Header - Rendered directly over the Role Context */}
        <div className="mb-20">
          <h1 className="newspaper-headline text-5xl sm:text-6xl md:text-7xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] tracking-tight mb-8">
            Mohak Kapoor
          </h1>
          <div className="flex flex-wrap gap-4">
            <Link
              className="spider-noir-button px-6 py-3 border-2 text-sm uppercase tracking-widest font-bold"
              data-cursor-target
              href="/story"
            >
              Story
            </Link>
            <a
              className="spider-noir-button px-6 py-3 border-2 text-sm uppercase tracking-widest font-bold"
              data-cursor-target
              href="/MOHAK_KAPOOR_ML.pdf"
              download="MOHAK_KAPOOR_ML.pdf"
            >
              Resume
            </a>
          </div>
        </div>

        <RoleDetail role={activeRole} />
      </div>
    </div>
  );
}
