"use client";

import React from "react";

const STACK_PRIMARY = [
  "Python", "PyTorch", "TensorFlow", "Scikit-learn",
  "NumPy", "Pandas", "Transformers", "SQL",
  "OpenAI API", "LangChain", "HuggingFace", "Computer Vision"
];

const STACK_SECONDARY = [
  "AWS", "Docker", "Kubernetes", "Git",
  "Weights & Biases", "MLflow", "FastAPI", "React",
  "Node.js", "MongoDB", "PostgreSQL", "Linux"
];

export function Marquee() {
  return (
    <section className="relative w-full border-y border-white/[0.04] py-6 overflow-hidden bg-[#0d0d0d]">
      <style jsx>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-row {
          display: flex;
          white-space: nowrap;
          width: fit-content;
        }
        .animate-marquee-left {
          animation: marquee-left 30s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 36s linear infinite;
        }
      `}</style>

      {/* Row 1: Primary Stack - Scrolls Left */}
      <div className="flex overflow-hidden mb-4">
        <div className="marquee-row animate-marquee-left flex gap-10 pr-10">
          {[...STACK_PRIMARY, ...STACK_PRIMARY].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className={`text-[11px] font-semibold uppercase tracking-[0.12em] transition-opacity duration-500`}
              style={{ 
                color: i % 7 === 0 ? 'var(--theme-accent)' : 'inherit',
                opacity: i % 7 === 0 ? 0.9 : i % 3 === 0 ? 0.45 : 0.15 
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2: Secondary Stack - Scrolls Right */}
      <div className="flex overflow-hidden">
        <div className="marquee-row animate-marquee-right flex gap-10 pr-10">
          {[...STACK_SECONDARY, ...STACK_SECONDARY].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className={`text-[11px] font-semibold uppercase tracking-[0.12em] transition-opacity duration-500`}
              style={{ 
                color: i % 5 === 0 ? 'var(--theme-accent)' : 'inherit',
                opacity: i % 5 === 0 ? 0.9 : i % 2 === 0 ? 0.45 : 0.15 
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
