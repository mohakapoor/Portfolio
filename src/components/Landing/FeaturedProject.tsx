"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface MarketPoint {
  price: number;
  regime: 'CALM' | 'CRISIS' | 'TRENDING';
  confidence: number;
}

function METRDashboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<MarketPoint[]>([]);
  const frameRef = useRef(0);

  // Initialize persistent mock data
  useMemo(() => {
    let basePrice = 150;
    for (let i = 0; i < 120; i++) {
      const noise = (Math.random() - 0.5) * 4;
      const trend = 0.5; // Slight upward bias for cumulative returns
      basePrice += noise + trend;
      
      dataRef.current.push({
        price: basePrice,
        regime: Math.random() > 0.92 ? 'CRISIS' : (Math.random() > 0.75 ? 'TRENDING' : 'CALM'),
        confidence: 0.52 + Math.random() * 0.08,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      // Handle Resize
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
      }

      const w = canvas.width;
      const h = canvas.height;
      
      // Get Theme Color
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim() || '#ffffff';

      // Clear & Background
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#090909'; 
      ctx.fillRect(0, 0, w, h);

      // 1. Draw Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      const gridSize = 35;
      for (let x = frameRef.current % gridSize; x < w; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // 2. Draw Regimes
      const data = dataRef.current;
      const step = w / data.length;

      data.forEach((d, i) => {
        if (d.regime === 'CRISIS') {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.06)';
          ctx.fillRect(i * step, 0, step, h);
        } else if (d.regime === 'TRENDING') {
          ctx.fillStyle = 'rgba(34, 197, 94, 0.03)';
          ctx.fillRect(i * step, 0, step, h);
        }
      });

      // 3. Draw Price Line (Scanning Reveal)
      const scanIndex = (Math.abs(frameRef.current) * 2.5) % data.length;
      
      const prices = data.map(d => d.price);
      const min = Math.min(...prices) - 10;
      const max = Math.max(...prices) + 10;
      const range = max - min;

      // Background "Full Path" (Very faint)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      data.forEach((d, i) => {
        const x = i * step;
        const y = h - ((d.price - min) / range) * (h * 0.7) - (h * 0.15);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Active "Scanning" Path
      ctx.beginPath();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 15;
      ctx.shadowColor = accent;

      let lastX = 0;
      let lastY = 0;

      data.forEach((d, i) => {
        if (i > scanIndex) return;
        const x = i * step;
        const y = h - ((d.price - min) / range) * (h * 0.7) - (h * 0.15);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        lastX = x; lastY = y;
      });
      ctx.stroke();
      
      // Leading Scanner Head
      if (scanIndex > 0) {
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = accent;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Cleanup shadow
      ctx.shadowBlur = 0;

      // 4. Draw HUD (Monospace)
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`SYSTEM_STATUS: ORCHESTRATING_ALPHA`, 20, 25);
      ctx.fillText(`MARKET_REGIME: ${data[data.length - 1].regime}`, 20, 40);

      // Confidence Bar
      const conf = data[data.length - 1].confidence;
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.strokeRect(20, 55, 80, 6);
      ctx.fillStyle = accent;
      ctx.fillRect(20, 55, 80 * conf, 6);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText(`CONFIDENCE: ${(conf * 100).toFixed(1)}%`, 110, 61);

      // Latest Quote
      ctx.textAlign = 'right';
      ctx.fillStyle = accent;
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(`ROC: +${(data[data.length-1].price - data[0].price).toFixed(2)}%`, w - 20, 25);
      ctx.textAlign = 'left';

      frameRef.current -= 0.2; // Slight scroll for the grid
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative">
       <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

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
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Visual Entrance
      gsap.fromTo(
        visualRef.current,
        { scale: 0.95, opacity: 0, x: 40 },
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
              Currently working on
            </span>
          </div>

          {/* Title */}
          <h2 className="text-5xl md:text-5xl font-bold tracking-tight text-white/92 leading-[1.15] mb-8 max-w-xl">
            <span style={{ color: 'var(--theme-accent)' }}>METR:</span> <br />
            Market Exposure Timing vs Randomness
          </h2>

          {/* Description */}
          <div className="space-y-6 text-[20px] leading-relaxed text-white/40 mb-10 max-w-lg">
            <p>
              Can a machine learning model trained purely on historical price/volume data—without any live sentiment, news, macro indicators, or order flow—actually beat random market entries in the long term?
            </p>
          </div>

          {/* Tech Chips */}
          <div className="flex flex-wrap gap-3 mb-10">
            {["XGBoost", "polars", "Time-Series", "numpy"].map(tech => (
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
            href="https://github.com/mohakapoor/METR" 
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] transition-opacity hover:opacity-75"
            style={{ color: 'var(--theme-accent, #cc2936)' }}
          >
            Explore more 
            <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* METR Animated Visual - Canvas Dashboard */}
        <div 
          ref={visualRef}
          className="w-full md:w-[480px] aspect-[16/9] md:aspect-auto md:h-[350px] rounded-xl border border-white/[0.07] bg-[#090909] relative overflow-hidden group shadow-2xl"
        >
          <METRDashboard />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          
          {/* Dashboard Overlay Vignette */}
          <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-xl shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]" />
        </div>

      </div>
    </section>
  );
}
