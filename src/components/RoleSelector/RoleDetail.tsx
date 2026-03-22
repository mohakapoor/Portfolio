"use client";

import React, { useState, useEffect } from "react";
import { RoleData } from "@/data/roles";
import Link from "next/link";

export function RoleDetail({ role }: { role: RoleData }) {
  const [currentRole, setCurrentRole] = useState(role);
  const [fade, setFade] = useState("opacity-100 translate-y-0");

  useEffect(() => {
    if (role.id !== currentRole.id) {
      // Step 1: Fade out + translate down
      setFade("opacity-0 translate-y-[10px]");
      
      // Step 2: Swap content and Fade in after timeout
      const timeout = setTimeout(() => {
        setCurrentRole(role);
        setFade("opacity-100 translate-y-0");
      }, 200); // 0.2s fade out window

      return () => clearTimeout(timeout);
    }
  }, [role, currentRole.id]);

  return (
    <div 
      className={`flex flex-col gap-6 max-w-lg transition-all duration-[350ms] ease-out will-change-transform ${fade}`}
    >
       <h1 className="newspaper-headline text-5xl sm:text-6xl md:text-7xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] tracking-tight mb-8">
         Mohak Kapoor
       </h1>

       <h2 className="text-4xl font-bold tracking-tight transition-colors duration-700" style={{ color: currentRole.tokens.primary }}>
         {currentRole.label}
       </h2>

       <p className="text-[#a1a1a1] leading-relaxed text-sm max-w-md">
         {currentRole.tagline}
       </p>

       <div className="flex flex-wrap gap-4 pt-6">
         <Link
           className="spider-noir-button px-10 py-3 border-2 text-sm uppercase tracking-widest font-bold transition-all duration-500"
           style={{ 
             borderColor: currentRole.tokens.primary,
             boxShadow: `0 0 15px ${currentRole.tokens.primary}20`
           }}
           href="/story"
         >
           Story
         </Link>
         <a
           className="spider-noir-button px-10 py-3 border-2 text-sm uppercase tracking-widest font-bold transition-all duration-500"
           style={{ 
             borderColor: currentRole.tokens.primary,
             boxShadow: `0 0 15px ${currentRole.tokens.primary}20`
           }}
           href="/MOHAK_KAPOOR_ML.pdf"
           download
         >
           Resume
         </a>
       </div>
    </div>
  );
}
