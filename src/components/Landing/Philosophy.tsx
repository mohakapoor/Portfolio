"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Philosophy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<(SVGPathElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Background Waves Animation
      gsap.fromTo(
        pathsRef.current,
        {
          x: -100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none none",
          },
        }
      );

      // Content Animation
      gsap.fromTo(
        contentRef.current,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 30%",
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
      className="relative w-full px-8 py-24 md:py-32 border-b border-white/[0.04] bg-[#0d0d0d] flex justify-center text-center overflow-hidden min-h-[600px]"
    >

      {/* Papercut Layered Background - High Density Left to Right Sweep */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 md:opacity-40">
        <svg
          viewBox="0 0 1440 800"
          className="w-full h-full object-cover scale-110"
          preserveAspectRatio="none"
        >
          {/* Layers 1-8 */}
          {[
            "M0 0H150C250 200 50 400 200 600C300 750 150 800 150 800H0V0Z",
            "M0 0H300C400 200 200 400 350 600C450 750 300 800 300 800H0V0Z",
            "M0 0H400C500 200 300 400 450 600C550 750 400 800 400 800H0V0Z",
            "M0 0H500C600 200 400 400 550 600C650 750 500 800 500 800H0V0Z",
            "M0 0H600C700 200 500 400 650 600C750 750 600 800 600 800H0V0Z",
            "M0 0H700C800 200 600 400 750 600C850 750 700 800 700 800H0V0Z",
            "M0 0H800C900 200 700 400 850 600C950 750 800 800 800 800H0V0Z",
            "M0 0H900C1000 200 800 400 950 600C1050 750 900 800 900 800H0V0Z"
          ].map((d, i) => (
            <path
              key={i}
              ref={(el) => { (pathsRef.current[i] = el); }}
              d={d}
              fill={`rgba(var(--theme-accent-rgb), ${0.03 + i * 0.02})`}
              style={{ filter: i > 0 ? `drop-shadow(${25 - i * 3}px 0 ${35 - i * 3}px rgba(0,0,0,${0.4 + i * 0.05}))` : "none" }}
            />
          ))}
        </svg>
      </div>

      <div ref={contentRef} className="max-w-[750px] relative z-10 px-4">
        <h2 className="text-3xl md:text-[46px] font-bold tracking-tight text-white/92 leading-[1.15] mb-12">
          Open to <span style={{ color: 'var(--theme-accent)' }}>new challenges</span> and collaborative <br className="hidden md:block" />
          <span className="text-white/40">freelancing projects.</span>
        </h2>

        <p className="text-[14px] md:text-[17px] leading-relaxed text-white/40 max-w-[500px] mx-auto mb-14 font-medium">
          Specializing in Anomaly Detection, Computer Vision, and Data Engineering.
          Let’s build something impactful together.
        </p>

        <div className="flex justify-center group cursor-pointer">
          <a 
            href="mailto:contact.mohakapoor@gmail.com"
            className="h-11 w-11 border border-white/10 bg-white/[0.02] rounded-full flex items-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:w-44 px-3 relative overflow-hidden active:scale-95 shadow-lg no-underline"
          >
             <div className="flex items-center justify-center w-full">
               {/* Text revealed on expansion - collapsed width initially */}
               <div className="w-0 opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden flex items-center">
                 <span className="text-white/50 font-medium tracking-[0.2em] text-[10px] uppercase whitespace-nowrap pl-2">
                    Let's Talk
                 </span>
               </div>

               {/* Minimalist Mail Icon - Always visible, pushed to right on expansion */}
               <div className="transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex-shrink-0 text-white/40 group-hover:text-[var(--theme-accent)]">
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="transition-colors duration-500"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 7L2 7" />
                  </svg>
               </div>
             </div>
          </a>
        </div>
      </div>

    </section>
  );
}
