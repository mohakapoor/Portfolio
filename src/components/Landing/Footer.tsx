"use client";

import React from "react";

const SOCIALS = [
  { name: "GitHub", url: "https://github.com/mohakapoor" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/mohakapoor/" },
  { name: "Twitter/X", url: "https://x.com/mohakapoor" },
  { name: "Email", url: "mailto:contact.mohakapoor@gmail.com" },
];

export function Footer() {
  return (
    <footer className="relative w-full px-8 py-10 md:px-12 md:py-12 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Availability Status */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
          </div>
          <p className="text-[20px] font-medium tracking-tight">
            <span className="text-white/65 mr-2">Open to work</span>
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
