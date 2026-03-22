"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "13", label: "Projects Shipped" },
  { value: "02", label: "Deployed Systems" },
  { value: "01", label: "Years Experience" },
  { value: "∞", label: "Tabs Open" },
];

export function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cellsRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-white/[0.04]">
      {/* 
        The grid uses a 1px gap with the container's background (white/0.04) 
        acting as the divider line between the solid black cells.
      */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px]">
        {STATS.map((stat, i) => (
          <div 
            key={stat.label} 
            ref={(el) => { (cellsRef.current[i] = el); }}
            className="bg-[#0d0d0d] px-8 py-12 flex flex-col items-start"
          >
            <span 
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
              style={{ color: 'var(--theme-accent)' }}
            >
              {stat.value}
            </span>
            <span className="text-[11px] uppercase tracking-[0.12em] font-medium text-white/25">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
