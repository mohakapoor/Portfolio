"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

interface SkillNode {
  id: string;
  category: "ml" | "dev" | "ops";
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
}

const SKILLS: SkillNode[] = [
  // ML Cluster (Red)
  { id: "Deep Learning", category: "ml", x: 25, y: 30 },
  { id: "Time-Series", category: "ml", x: 15, y: 45 },
  { id: "CNN-LSTM", category: "ml", x: 35, y: 45 },
  { id: "TensorFlow", category: "ml", x: 25, y: 60 },
  { id: "scikit-learn", category: "ml", x: 10, y: 65 },

  // Dev Cluster (Cyan)
  { id: "Python", category: "dev", x: 50, y: 50 },
  { id: "TypeScript", category: "dev", x: 65, y: 40 },
  { id: "C++", category: "dev", x: 60, y: 60 },
  { id: "MCP", category: "dev", x: 45, y: 70 },
  { id: "PostgreSQL", category: "dev", x: 75, y: 55 },
  { id: "Cloudflare", category: "dev", x: 80, y: 40 },

  // Ops Cluster (Magenta)
  { id: "GitHub Actions", category: "ops", x: 50, y: 20 },
  { id: "Pipelines", category: "ops", x: 40, y: 10 },
  { id: "Automation", category: "ops", x: 60, y: 15 },
  { id: "Docker", category: "ops", x: 70, y: 25 },
];

const CONNECTIONS: Connection[] = [
  { from: "Deep Learning", to: "CNN-LSTM" },
  { from: "Deep Learning", to: "TensorFlow" },
  { from: "Time-Series", to: "CNN-LSTM" },
  { from: "Python", to: "Deep Learning" },
  { from: "Python", to: "TypeScript" },
  { from: "Python", to: "C++" },
  { from: "TypeScript", to: "Cloudflare" },
  { from: "TypeScript", to: "MCP" },
  { from: "Python", to: "PostgreSQL" },
  { from: "GitHub Actions", to: "Pipelines" },
  { from: "GitHub Actions", to: "Automation" },
  { from: "GitHub Actions", to: "Python" },
  { from: "Docker", to: "Pipelines" },
  { from: "TensorFlow", to: "scikit-learn" },
];

const CAT_COLORS = {
  ml: "#cc2936",
  dev: "#4dedff",
  ops: "#ff7ab9",
};

export default function SkillsConstellation() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<SVGSVGElement>(null);

  const activeConnections = useMemo(() => {
    if (!hoveredNode) return [];
    return CONNECTIONS.filter(c => c.from === hoveredNode || c.to === hoveredNode);
  }, [hoveredNode]);

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return;

    const lines = containerRef.current.querySelectorAll("line");
    const circles = containerRef.current.querySelectorAll("circle.skill-node");

    gsap.fromTo(lines,
      { strokeDasharray: 100, strokeDashoffset: 100 },
      { strokeDashoffset: 0, duration: 2, stagger: 0.05, ease: "power2.out" }
    );

    gsap.fromTo(circles,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, stagger: 0.02, ease: "back.out(1.7)" }
    );
  }, []);

  return (
    <div className="w-full aspect-[16/9] md:aspect-[21/9] relative bg-black/20 rounded-3xl border border-white/5 overflow-hidden group cursor-crosshair">
      <svg ref={containerRef} viewBox="0 0 100 80" className="w-full h-full">
        {/* Background Connections */}
        {CONNECTIONS.map((conn, i) => {
          const from = SKILLS.find(s => s.id === conn.from)!;
          const to = SKILLS.find(s => s.id === conn.to)!;
          const isActive = activeConnections.some(ac =>
            (ac.from === conn.from && ac.to === conn.to) || (ac.from === conn.to && ac.to === conn.from)
          );

          return (
            <line
              key={`line-${i}`}
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              stroke={isActive ? CAT_COLORS[from.category] : "white"}
              strokeWidth={isActive ? 0.3 : 0.05}
              strokeOpacity={isActive ? 0.8 : 0.15}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Nodes */}
        {SKILLS.map((node) => (
          <g
            key={node.id}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            className="cursor-pointer"
          >
            <circle
              cx={node.x} cy={node.y}
              r={hoveredNode === node.id ? 1.2 : 0.8}
              fill={CAT_COLORS[node.category]}
              className="skill-node transition-all duration-300 origin-center"
              style={{ transformBox: 'fill-box' }}
            />

            {/* Glow effect for active node */}
            {hoveredNode === node.id && (
              <circle
                cx={node.x} cy={node.y}
                r={2.5}
                fill={CAT_COLORS[node.category]}
                fillOpacity={0.2}
                className="animate-pulse"
              />
            )}

            <text
              x={node.x}
              y={node.y + 3.5}
              textAnchor="middle"
              fill="white"
              fontSize="1.5"
              className={`pointer-events-none transition-all duration-300 font-mono tracking-tighter ${hoveredNode === node.id ? 'opacity-100 scale-110' : 'opacity-40'}`}
              style={{ textShadow: hoveredNode === node.id ? `0 0 10px ${CAT_COLORS[node.category]}` : 'none' }}
            >
              {node.id}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-3">
        {Object.entries(CAT_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">
              {cat === 'ml' ? 'Machine Learning' : cat === 'dev' ? 'Dev & Infra' : 'CI/CD & Ops'}
            </span>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute top-6 right-6 font-mono text-[9px] uppercase tracking-widest text-white/20 pointer-events-none group-hover:opacity-0 transition-opacity">
        Interactive Knowledge Graph // Hover to trace
      </div>
    </div>
  );
}
