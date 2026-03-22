"use client";

import React, { useState, useEffect } from "react";
import { RoleData } from "@/data/roles";

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
       <div className="text-[10px] tracking-[0.3em] font-mono text-[#8c8c8c] uppercase">
         {currentRole.counter}
       </div>

       <h2 className="text-4xl font-bold tracking-tight transition-colors duration-700" style={{ color: currentRole.tokens.primary }}>
         {currentRole.label}
       </h2>

       <p className="text-[#a1a1a1] leading-relaxed text-sm max-w-md">
         {currentRole.tagline}
       </p>

       <div className="w-[28px] h-[2px] transition-colors duration-700" style={{ background: currentRole.tokens.outlineVariant }} />

       <div className="flex flex-wrap gap-2 pt-2">
         {currentRole.tags.map((tag, i) => {
           const isPrimary = i < 2;
           return (
             <span 
               key={tag}
               className="px-3 py-1 rounded-full text-xs font-medium transition-colors duration-700"
               style={{
                 border: `1px solid ${isPrimary ? currentRole.tokens.primary + '80' : currentRole.tokens.outlineVariant}`,
                 color: isPrimary ? currentRole.tokens.primary : '#8c8c8c',
                 background: isPrimary ? currentRole.tokens.primary + '11' : 'transparent'
               }}
             >
               {tag}
             </span>
           );
         })}
       </div>
    </div>
  );
}
