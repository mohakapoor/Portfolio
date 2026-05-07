"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

gsap.registerPlugin();

export default function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !svgRef.current) return;

    const ctx = gsap.context(() => {
      // Animated data packets along grid lines
      const createPacket = () => {
        if (!svgRef.current || !container) return;
        const isHorizontal = Math.random() > 0.5;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const size = 60;
        const width = container.offsetWidth || 1000;
        const height = container.offsetHeight || 2000;

        if (isHorizontal) {
          const pos = Math.floor(Math.random() * (height / size)) * size;
          line.setAttribute("x1", "-120"); line.setAttribute("x2", "0");
          line.setAttribute("y1", pos.toString()); line.setAttribute("y2", pos.toString());
        } else {
          const pos = Math.floor(Math.random() * (width / size)) * size;
          line.setAttribute("x1", pos.toString()); line.setAttribute("x2", pos.toString());
          line.setAttribute("y1", "-120"); line.setAttribute("y2", "0");
        }

        line.setAttribute("stroke", "var(--theme-accent)");
        line.setAttribute("stroke-width", "1.5");
        line.setAttribute("opacity", "0");
        line.style.filter = "drop-shadow(0 0 6px var(--theme-accent))";
        svgRef.current.appendChild(line);

        const tl = gsap.timeline({ onComplete: () => line.remove() });
        tl.to(line, { opacity: 0.5, duration: 0.2 });
        const destination = isHorizontal ? (width + 150) : (height + 150);
        tl.to(line, {
          attr: {
            [isHorizontal ? "x1" : "y1"]: destination,
            [isHorizontal ? "x2" : "y2"]: destination + 80,
          },
          duration: 1.5 + Math.random() * 2.5, ease: "none"
        }, 0);
        tl.to(line, { opacity: 0, duration: 0.4 }, "-=0.4");
      };

      // Blinking intersection nodes
      const createNodePulse = () => {
        if (!svgRef.current || !container) return;
        const size = 60;
        const width = container.offsetWidth || 1000;
        const height = container.offsetHeight || 2000;
        const cx = Math.floor(Math.random() * (width / size)) * size;
        const cy = Math.floor(Math.random() * (height / size)) * size;

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx.toString());
        circle.setAttribute("cy", cy.toString());
        circle.setAttribute("r", "2");
        circle.setAttribute("fill", "var(--theme-accent)");
        circle.setAttribute("opacity", "0");
        circle.style.filter = "drop-shadow(0 0 4px var(--theme-accent))";
        svgRef.current.appendChild(circle);

        gsap.timeline({ onComplete: () => circle.remove() })
          .to(circle, { opacity: 0.8, duration: 0.3 })
          .to(circle, { opacity: 0, duration: 0.8, delay: 0.4 });
      };

      for (let i = 0; i < 3; i++) setTimeout(createPacket, i * 800);
      const packetInterval = setInterval(createPacket, 2000);
      const nodeInterval = setInterval(createNodePulse, 600);

      return () => { clearInterval(packetInterval); clearInterval(nodeInterval); };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Radial spotlight vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(var(--theme-accent-rgb,204,41,54),0.04) 0%, transparent 70%)",
        }}
      />

      <svg ref={svgRef} width="100%" height="100%" style={{ opacity: 0.7 }}>
        <defs>
          <pattern id="storyGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            {/* Grid lines */}
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            {/* Intersection dots */}
            <circle cx="0" cy="0" r="1.2" fill="rgba(255,255,255,0.12)" />
          </pattern>

          {/* Fade mask — fades out at top and bottom */}
          <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="black" />
            <stop offset="8%" stopColor="white" />
            <stop offset="92%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </linearGradient>
          <mask id="gridMask">
            <rect width="100%" height="100%" fill="url(#gridFade)" />
          </mask>
        </defs>

        <g mask="url(#gridMask)">
          <rect width="100%" height="100%" fill="url(#storyGrid)" />
        </g>
      </svg>
    </div>
  );
}
