"use client";

import React from "react";

export function Philosophy() {
  return (
    <section className="relative w-full px-8 py-24 md:py-32 border-b border-white/[0.04] bg-[#0d0d0d] flex justify-center text-center overflow-hidden min-h-[600px]">
      
      {/* Papercut Layered Background - High Density Left to Right Sweep */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 md:opacity-40">
        <svg 
          viewBox="0 0 1440 800" 
          className="w-full h-full object-cover scale-110"
          preserveAspectRatio="none"
        >
          {/* Layer 1 - Deepest (Leftmost) */}
          <path d="M0 0H150C250 200 50 400 200 600C300 750 150 800 150 800H0V0Z" fill="rgba(var(--theme-accent-rgb), 0.03)" />
          
          {/* Layer 2 */}
          <path d="M0 0H300C400 200 200 400 350 600C450 750 300 800 300 800H0V0Z" fill="rgba(var(--theme-accent-rgb), 0.05)"
            style={{ filter: "drop-shadow(25px 0 35px rgba(0,0,0,0.4))" }} />
          
          {/* Layer 3 */}
          <path d="M0 0H400C500 200 300 400 450 600C550 750 400 800 400 800H0V0Z" fill="rgba(var(--theme-accent-rgb), 0.07)"
            style={{ filter: "drop-shadow(20px 0 30px rgba(0,0,0,0.5))" }} />
          
          {/* Layer 4 */}
          <path d="M0 0H500C600 200 400 400 550 600C650 750 500 800 500 800H0V0Z" fill="rgba(var(--theme-accent-rgb), 0.09)"
            style={{ filter: "drop-shadow(15px 0 25px rgba(0,0,0,0.6))" }} />
          
          {/* Layer 5 */}
          <path d="M0 0H600C700 200 500 400 650 600C750 750 600 800 600 800H0V0Z" fill="rgba(var(--theme-accent-rgb), 0.11)"
            style={{ filter: "drop-shadow(12px 0 20px rgba(0,0,0,0.7))" }} />
          
          {/* Layer 6 */}
          <path d="M0 0H700C800 200 600 400 750 600C850 750 700 800 700 800H0V0Z" fill="rgba(var(--theme-accent-rgb), 0.13)"
            style={{ filter: "drop-shadow(10px 0 15px rgba(0,0,0,0.75))" }} />
          
          {/* Layer 7 */}
          <path d="M0 0H800C900 200 700 400 850 600C950 750 800 800 800 800H0V0Z" fill="rgba(var(--theme-accent-rgb), 0.15)"
            style={{ filter: "drop-shadow(8px 0 12px rgba(0,0,0,0.8))" }} />
            
          {/* Layer 8 - Closest (Sweeping furthest right) */}
          <path d="M0 0H900C1000 200 800 400 950 600C1050 750 900 800 900 800H0V0Z" fill="rgba(var(--theme-accent-rgb), 0.18)"
            style={{ filter: "drop-shadow(5px 0 10px rgba(0,0,0,0.85))" }} />
        </svg>
      </div>

      <div className="max-w-[750px] relative z-10 px-4">
        <h2 className="text-3xl md:text-[46px] font-bold tracking-tight text-white/92 leading-[1.15] mb-12">
          Open to <span style={{ color: 'var(--theme-accent)' }}>new challenges</span> and collaborative <br className="hidden md:block" />
          <span className="text-white/40">freelancing projects.</span>
        </h2>
        
        <p className="text-[14px] md:text-[17px] leading-relaxed text-white/40 max-w-[500px] mx-auto mb-14 font-medium">
          Specializing in High-Performance ML, Computer Vision, and Data Engineering. 
          Let’s build something impactful together.
        </p>

        <div className="flex justify-center">
          <div className="w-12 h-[1px]" style={{ backgroundColor: 'var(--theme-accent)', opacity: 0.4 }} />
        </div>
      </div>

    </section>
  );
}
