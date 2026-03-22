"use client";

import React from "react";

interface AmbientGlowProps {
  activeColor: string;
}

export function AmbientGlow({ activeColor }: AmbientGlowProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {/* Top Glow: subtle, small circle */}
      <div 
        className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full mix-blend-screen transition-colors duration-[800ms] ease-in-out"
        style={{ 
          background: activeColor, 
          filter: "blur(80px)", 
          opacity: 0.08 
        }} 
      />
      
      {/* Main Core Glow: anchored exactly behind the center of the 3D model */}
      <div 
        className="absolute top-[300px] md:top-1/2 left-1/2 md:left-[22.5%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full mix-blend-screen transition-colors duration-[800ms] ease-in-out"
        style={{ 
          background: activeColor, 
          filter: "blur(120px)", 
          opacity: 0.18
        }} 
      />
    </div>
  );
}
