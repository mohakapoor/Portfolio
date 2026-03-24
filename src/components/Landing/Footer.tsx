"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { name: "GitHub", url: "https://github.com/mohakapoor" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/mohakapoor/" },
  { name: "Twitter/X", url: "https://x.com/mohakapoor" },
  { name: "Email", url: "mailto:contact.mohakapoor@gmail.com" },
];

export function Footer({ isFullWidth = false }: { isFullWidth?: boolean }) {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            end: "bottom bottom",
            toggleActions: "play none none none",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative z-[60] w-full px-8 py-10 md:px-12 md:py-12 bg-[#0d0d0d]">
      <div ref={contentRef} className={`${isFullWidth ? "w-full" : "max-w-7xl mx-auto"} flex flex-col md:flex-row justify-between items-center gap-8`}>
        
        {/* Availability Status */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
          </div>
          <p className="text-[20px] font-medium tracking-tight">
            <span className="text-[#22c55e] mr-2">Open to work</span>
            <span className="text-white/25">· Based in New Delhi· ML & AI roles</span>
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-6">
          {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.url}
              className="text-[15px] font-bold uppercase tracking-[0.14em] text-white/25 transition-colors duration-200 hover:text-white/70"
            >
              {social.name}
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
}
