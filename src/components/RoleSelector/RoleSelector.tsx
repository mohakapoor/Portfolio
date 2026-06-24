"use client";

import React, { useState, useEffect } from "react";
import { rolesData } from "@/data/roles";
import { AmbientGlow } from "./AmbientGlow";
import { ThreeScene } from "@/components/RoleSelector/ThreeScene";
import { RoleDetail } from "@/components/RoleSelector/RoleDetail";
import { DotNav } from "@/components/RoleSelector/DotNav";
import { BackgroundLandscape } from "@/components/RoleSelector/BackgroundLandscape";
import { Marquee } from "@/components/Landing/Marquee";

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
    <div className="relative w-full min-h-[100dvh] flex flex-col overflow-hidden">
      <BackgroundLandscape image={activeRole.backgroundImage} />
      <AmbientGlow activeColor={activeRole.tokens.primary} />
      
      {/* Interactive Content Area */}
      <div className="flex-1 flex flex-col md:flex-row items-stretch justify-center relative z-10">
        {/* LEFT PANEL - 45% */}
        <div className="relative w-full md:w-[45%] flex flex-col items-center justify-center p-4 md:p-12">
          
          {/* Mobile Only Title */}
          <h1 className="md:hidden newspaper-headline text-6xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] tracking-tight mb-6 mt-8 text-center">
            Mohak Kapoor
          </h1>

          <div className="w-[70%] md:w-full aspect-square max-h-[300px] md:max-h-[600px] flex items-center justify-center">

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
                setIsLocked(true);
              }}
              activeColor={activeRole.tokens.primary}
            />
          </div>
        </div>

        {/* RIGHT PANEL - 55% */}
        <div className="relative w-full md:w-[55%] flex flex-col justify-center p-8 md:p-24">
          <RoleDetail role={activeRole} />
        </div>
      </div>

      {/* Marquee Footnote - Anchored inside the Hero Height */}
      <div className="relative z-10">
        <Marquee />
      </div>
    </div>
  );
}
