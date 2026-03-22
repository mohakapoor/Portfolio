"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FeaturedProject() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Text Animation
      gsap.fromTo(
        textRef.current,
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none none",
          },
        }
      );

      // Visual Animation
      gsap.fromTo(
        visualRef.current,
        {
          scale: 0.95,
          opacity: 0,
          x: 40,
        },
        {
          scale: 1,
          opacity: 1,
          x: 0,
          duration: 1.2,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full px-8 py-20 md:px-24 md:py-24 border-b border-white/[0.04] bg-[#0d0d0d]"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-start">
        
        {/* Text Content */}
        <div ref={textRef} className="flex-1">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-5 h-[1px] bg-white/15" />
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/20 font-medium">
              currently building
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white/92 leading-[1.15] mb-8 max-w-xl">
            Neural <span style={{ color: 'var(--theme-accent)' }}>Artifacts:</span> <br />
            Latent Space Explorer
          </h2>

          {/* Description */}
          <p className="text-[14px] leading-relaxed text-white/40 mb-10 max-w-lg">
            A real-time visualization engine for high-dimensional embeddings. 
            Reducing inference latency by 40% through custom CUDA kernels and optimized quantization.
          </p>

          {/* Tech Chips */}
          <div className="flex flex-wrap gap-3 mb-10">
            {["PyTorch", "CUDA", "React Three Fiber", "FastAPI"].map(tech => (
              <span 
                key={tech}
                className="px-4 py-1.5 rounded-full border border-white/[0.08] text-[10px] font-medium text-white/40 uppercase tracking-wider"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTA Link - Themed with Primary Accent */}
          <a 
            href="#" 
            className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] transition-opacity hover:opacity-75"
            style={{ color: 'var(--theme-accent, #cc2936)' }}
          >
            View project 
            <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* Visual Placeholder */}
        <div 
          ref={visualRef}
          className="w-full md:w-[280px] aspect-[4/5] rounded-xl border border-white/[0.07] bg-white/[0.03] p-6 flex flex-col gap-3 relative overflow-hidden"
        >
          {/* Abstract Grid Blocks */}
          <div className="grid grid-cols-3 gap-3 h-full">
            {Array.from({ length: 9 }).map((_, i) => (
              <div 
                key={i}
                className="rounded-md transition-colors duration-1000"
                style={{ 
                  backgroundColor: i === 4 || i === 7 
                    ? 'rgba(var(--theme-accent-rgb), 0.18)' 
                    : 'rgba(255, 255, 255, 0.05)' 
                }}
              />
            ))}
          </div>
          
          {/* Decorative Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

      </div>
    </section>
  );
}
