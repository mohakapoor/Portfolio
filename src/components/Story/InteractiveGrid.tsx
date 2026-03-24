"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !svgRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Random Data Packets
      const createPacket = () => {
        if (!svgRef.current || !container) return;
        
        const isHorizontal = Math.random() > 0.5;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const size = 60; 
        
        const width = container.offsetWidth || 1000;
        const height = container.offsetHeight || 2000;
        
        if (isHorizontal) {
          const pos = Math.floor(Math.random() * (height / size)) * size;
          line.setAttribute("x1", "-150");
          line.setAttribute("x2", "0");
          line.setAttribute("y1", pos.toString());
          line.setAttribute("y2", pos.toString());
        } else {
          const pos = Math.floor(Math.random() * (width / size)) * size;
          line.setAttribute("x1", pos.toString());
          line.setAttribute("x2", pos.toString());
          line.setAttribute("y1", "-150");
          line.setAttribute("y2", "0");
        }

        line.setAttribute("stroke", "var(--theme-accent)");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("opacity", "0");
        line.style.filter = "drop-shadow(0 0 8px var(--theme-accent))";
        
        svgRef.current.appendChild(line);

        const tl = gsap.timeline({
          onComplete: () => line.remove()
        });

        tl.to(line, { opacity: 0.4, duration: 0.3 });

        const destination = isHorizontal ? (width + 200) : (height + 200);
        tl.to(line, {
          attr: {
            [isHorizontal ? "x1" : "y1"]: destination,
            [isHorizontal ? "x2" : "y2"]: destination + 100,
          },
          duration: 2.0 + Math.random() * 3.0,
          ease: "none"
        }, 0);
        
        tl.to(line, { opacity: 0, duration: 0.5 }, "-=0.5");
      };

      // Subtle initial burst
      for(let i=0; i<3; i++) setTimeout(createPacket, i * 1000);
      
      const packetInterval = setInterval(createPacket, 2500);
      return () => clearInterval(packetInterval);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <svg 
        ref={svgRef}
        width="100%" 
        height="100%" 
        style={{ opacity: 0.4 }}
      >
        <defs>
          <pattern id="storyGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <circle cx="0" cy="0" r="1.5" fill="rgba(255,255,255,0.1)" />
          </pattern>
        </defs>

        {/* Base Grid */}
        <rect width="100%" height="100%" fill="url(#storyGrid)" />

        {/* Spot Light Mask (Top/Bottom fade) */}
        <rect width="100%" height="100%" fill="transparent" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }} />
      </svg>
    </div>
  );
}
