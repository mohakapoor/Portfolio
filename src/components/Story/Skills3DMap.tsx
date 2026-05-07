"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { gsap } from "gsap";

interface StarNode {
  id: string;
  pos: [number, number, number];
  isPrimary?: boolean;
  labelPos?: "top" | "left" | "right" | "bottom"; // default: bottom
}

interface ConstellationData {
  category: string;
  constellation: string;
  color: string;
  stars: StarNode[];
  connections: [number, number][];
  viewDistance: number; // camera z-distance when zoomed into this constellation
}

const CONSTELLATIONS: ConstellationData[] = [
  {
    category: "Machine Learning",
    constellation: "URSA MINOR",
    color: "#ff4444",
    stars: [
      { id: "PyTorch",         pos: [-15, 3, 0],       isPrimary: true, labelPos: "left"},
      { id: "TensorFlow",      pos: [-13.5, 0.75, 0],               labelPos: "right"},
      { id: "Deep Learning",   pos: [-12, -0.75, 0.75],             labelPos: "right"},
      { id: "CNN-LSTM",        pos: [-11.25, -2.25, 0], isPrimary: true, labelPos: "right"},
      { id: "Computer Vision", pos: [-12.75, -3.75, 0],             labelPos: "right"},
      { id: "scikit-learn",    pos: [-14.25, -3, 0],                labelPos: "left"},
      { id: "XGBoost",         pos: [-14.7, -1.2, 0],              labelPos: "left"},
    ],
    viewDistance: 12,
    connections: [
      [0, 1], [1, 2], [2, 3],
      [3, 4], [4, 5], [5, 6], [6, 3]
    ]
  },
  {
    category: "Dev & Infrastructure",
    constellation: "CORONA BOREALIS",
    color: "#4dedff",
    stars: [
      { id: "Python",      pos: [0, -4.5, 0],      isPrimary: true, labelPos: "left"  },
      { id: "TypeScript",  pos: [2.625, -3.8, 0],               labelPos: "right" },
      { id: "Django",      pos: [4.547, -1.875, 0],             labelPos: "right" },
      { id: "MLflow",      pos: [5.25, 0.75, 0],   isPrimary: true, labelPos: "right"},
      { id: "FastAPI",     pos: [4.547, 3.375, 0],             labelPos: "right" },
      { id: "PostgreSQL",  pos: [2.625, 5.3, 0],               labelPos: "top"   },
      { id: "Cloudflare",  pos: [0, 6, 0],          isPrimary: true, labelPos: "top" },
    ],
    viewDistance: 16,
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]
  },
  {
    category: "CI/CD & Ops",
    constellation: "CRUX",
    color: "#ff7ab9",
    stars: [
      { id: "Docker",         pos: [17.25, 3.3, 0],    isPrimary: true, labelPos: "top"},
      { id: "Kubernetes",     pos: [17.25, -2.7, 0],   isPrimary: true, labelPos: "right"},
      { id: "Terraform",      pos: [14.25, 0.45, 0.75],               labelPos: "left"},
      { id: "GitHub Actions", pos: [20.25, 0.45, -0.75],              labelPos: "right"},
      { id: "Automation",     pos: [19.2, 2.4, 0],                    labelPos: "right"},
    ],
    viewDistance: 11,
    connections: [
      [0, 1],
      [2, 3],
      [0, 4]
    ]
  },
  {
    category: "LLMs & GenAI",
    constellation: "CORVUS",
    color: "#f5c542",
    // Corvus: a slightly tilted quadrilateral (the Raven) — 4 bright stars
    stars: [
      { id: "MCP",             pos: [28, 2.5, 0],  isPrimary: true, labelPos: "left"  }, // top-left
      { id: "RAG",             pos: [32, 3, 0],    isPrimary: true, labelPos: "right" }, // top-right
      { id: "ML System Design", pos: [33, -1, 0],               labelPos: "right" }, // bottom-right
      { id: "Hugging Face",    pos: [28.5, -1.5, 0],           labelPos: "left"  }, // bottom-left
    ],
    viewDistance: 10,
    connections: [
      [0, 1], // top bar
      [1, 2], // right side
      [2, 3], // bottom bar
      [3, 0], // left side
      [0, 2], // diagonal (makes it feel more like a real Corvus)
    ]
  }
];

const ZOOM_THRESHOLD = 20; // labels reveal when closer than this

function Star({ star, color, active, onHover, revealed }: {
  star: StarNode, color: string, active: boolean, onHover: (id: string | null) => void, revealed: boolean
}) {
  const lp = star.labelPos ?? "bottom";
  const offset: [number, number, number] =
    lp === "left"   ? [-1, 0, 0] :
    lp === "right"  ? [1, 0, 0] :
    lp === "top"    ? [0, 0.8, 0] :
                      [0, -0.8, 0]; // bottom
  const anchor: "left" | "right" | "center" =
    lp === "left" ? "right" : lp === "right" ? "left" : "center";

  return (
    <group position={star.pos}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onHover(star.id); }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[star.isPrimary ? 0.14 : 0.09, 16, 16]} />
        <meshBasicMaterial color={active ? "#ffffff" : color} />
      </mesh>

      {active && (
        <mesh>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
      )}

      <Html position={offset} center>
        <div
          className="whitespace-nowrap font-mono uppercase pointer-events-none transition-all duration-500"
          style={{
            fontSize: star.isPrimary ? "10px" : "9px",
            letterSpacing: "0.08em",
            textAlign: anchor === "center" ? "center" : anchor === "right" ? "right" : "left",
            color: active ? "white" : color,
            opacity: revealed ? (active ? 1 : 0.65) : 0,
            transform: revealed ? "scale(1) translateY(0)" : "scale(0.7) translateY(4px)",
            textShadow: active ? `0 0 18px ${color}` : "none",
          }}
        >
          {star.id}
        </div>
      </Html>
    </group>
  );
}

function ConstellationGroup({ data, hovered, setHovered, onFocus, revealed }: {
  data: ConstellationData, hovered: string | null, setHovered: (id: string | null) => void,
  onFocus: (pos: [number, number, number], viewDistance: number) => void, revealed: boolean
}) {
  const center = useMemo(() => {
    const sum = data.stars.reduce(
      (acc, s) => [acc[0] + s.pos[0], acc[1] + s.pos[1], acc[2] + s.pos[2]], [0, 0, 0]
    );
    return [sum[0] / data.stars.length, sum[1] / data.stars.length, sum[2] / data.stars.length] as [number, number, number];
  }, [data.stars]);

  const topY = useMemo(() => Math.max(...data.stars.map(s => s.pos[1])), [data.stars]);
  const minY = useMemo(() => Math.min(...data.stars.map(s => s.pos[1])), [data.stars]);
  // Visual center accounts for the heading floating above the stars
  const visualCenterY = useMemo(() => (minY + topY + 1.6) / 2, [minY, topY]);

  return (
    <group>
      <Html position={[center[0], topY + 1.6, center[2]]} center>
        <div
          className="flex flex-col items-center cursor-pointer group/hdr select-none text-center"
          style={{ minWidth: "240px" }}
          onClick={() => onFocus([center[0], visualCenterY, center[2]], data.viewDistance)}
        >
          <span className="newspaper-headline text-xl text-white/90 group-hover/hdr:text-white transition-colors whitespace-nowrap">
            {data.category}
          </span>
          {/* Constellation name — only visible when zoomed in */}
          <span
            className="font-mono text-[8px] uppercase tracking-[0.55em] mt-[2px] transition-all duration-500"
            style={{
              color: data.color,
              opacity: revealed ? 0.7 : 0,
              transform: revealed ? "translateY(0)" : "translateY(-4px)",
            }}
          >
            {data.constellation}
          </span>

        </div>
      </Html>

      {data.connections.map(([s, e], idx) => (
        <Line
          key={idx}
          points={[data.stars[s].pos, data.stars[e].pos]}
          color={data.color}
          lineWidth={1.5}
          transparent
          opacity={0.5}
        />
      ))}

      {data.stars.map((star, idx) => (
        <Star
          key={idx}
          star={star}
          color={data.color}
          active={hovered === star.id}
          onHover={setHovered}
          revealed={revealed}
        />
      ))}
    </group>
  );
}

function Scene({
  hovered, setHovered, onZoomChange
}: {
  hovered: string | null, setHovered: (id: string | null) => void, onZoomChange: (dist: number) => void
}) {
  const { camera, controls } = useThree();
  const lastDist = useRef(20);

  useFrame(() => {
    const dist = camera.position.distanceTo(
      // @ts-ignore
      controls?.target ?? new THREE.Vector3(0, 0, 0)
    );
    if (Math.abs(dist - lastDist.current) > 0.3) {
      lastDist.current = dist;
      onZoomChange(dist);
    }
  });

  const handleFocus = useCallback((pos: [number, number, number], viewDistance: number) => {
    if (!controls) return;
    gsap.killTweensOf(camera.position);
    // @ts-ignore
    gsap.killTweensOf(controls.target);
    // Use per-constellation viewDistance; camera targets visual center (stars + heading)
    gsap.to(camera.position, { x: pos[0], y: pos[1], z: pos[2] + viewDistance, duration: 1.3, ease: "expo.inOut" });
    // @ts-ignore
    gsap.to(controls.target, {
      x: pos[0], y: pos[1], z: pos[2], duration: 1.3, ease: "expo.inOut",
      // @ts-ignore
      onUpdate: () => controls.update()
    });
  }, [camera, controls]);

  const handleReset = useCallback(() => {
    if (!controls) return;
    gsap.killTweensOf(camera.position);
    // @ts-ignore
    gsap.killTweensOf(controls.target);
    // Return to initial overview — centered across all 4 constellations (x≈8)
    gsap.to(camera.position, { x: 8, y: 0, z: 32, duration: 1.3, ease: "expo.inOut" });
    // @ts-ignore
    gsap.to(controls.target, {
      x: 8, y: 2, z: 0, duration: 1.3, ease: "expo.inOut",
      // @ts-ignore
      onUpdate: () => controls.update()
    });
  }, [camera, controls]);

  // Expose reset to parent via ref
  (Scene as any)._resetRef = handleReset;

  return (
    <>
      <ambientLight intensity={1.2} />
      {CONSTELLATIONS.map((c, i) => (
        <ConstellationGroup
          key={i}
          data={c}
          hovered={hovered}
          setHovered={setHovered}
          onFocus={handleFocus}
          revealed={lastDist.current < ZOOM_THRESHOLD}
        />
      ))}
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} intensity={1} radius={0.4} />
      </EffectComposer>
    </>
  );
}

export default function Skills3DMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [zoomDist, setZoomDist] = useState(32);
  const resetRef = useRef<(() => void) | null>(null);

  const isZoomedIn = zoomDist < ZOOM_THRESHOLD;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: "12px",
        background: "color-mix(in oklab, var(--newsprint-gray) 65%, transparent)",
        backgroundColor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(var(--theme-accent-rgb, 204,41,54), 0.25)",
        backdropFilter: "blur(10px) saturate(120%)",
        WebkitBackdropFilter: "blur(10px) saturate(120%)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset, 0 0 0 1px rgba(255,255,255,0.03) inset, 0 10px 24px rgba(0,0,0,0.45), 0 20px 60px rgba(0,0,0,0.35), 0 0 20px rgba(var(--theme-accent-rgb,204,41,54),0.1)",
      }}
    >
      {/* Nebula background behind the canvas */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 40% 50% at 5% 50%, rgba(255,50,50,0.08) 0%, transparent 70%)",
            "radial-gradient(ellipse 35% 50% at 35% 50%, rgba(77,237,255,0.07) 0%, transparent 70%)",
            "radial-gradient(ellipse 35% 50% at 65% 50%, rgba(255,122,185,0.06) 0%, transparent 70%)",
            "radial-gradient(ellipse 35% 50% at 95% 50%, rgba(245,197,66,0.07) 0%, transparent 70%)",
            "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,0.82) 40%, transparent 100%)",
          ].join(", "),
          zIndex: 0,
        }}
      />
      {/* Title overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-5 pb-3 pointer-events-none">
        <h3 className="newspaper-headline text-2xl text-white/90">Skill Constellation</h3>
        <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-white/20 mt-1">Click a heading to explore · Scroll to zoom</p>
      </div>

      <div className="w-full h-[560px] cursor-move relative" style={{ zIndex: 1 }}>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [8, 0, 32], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
        >
          <color attach="background" args={["#000000"]} />
          <Scene
            hovered={hovered}
            setHovered={setHovered}
            onZoomChange={(dist) => {
              setZoomDist(dist);
              // also stash reset fn
              resetRef.current = (Scene as any)._resetRef;
            }}
          />
          <OrbitControls
            makeDefault
            target={[8, 2, 0]}
            enablePan={true}
            enableZoom={true}
            maxDistance={55}
            minDistance={6}
            autoRotate={false}
          />
        </Canvas>
      </div>

      {/* Reset button — inside wrapper, absolutely positioned */}
      <button
        onClick={() => resetRef.current?.()}
        className="absolute bottom-5 left-5 flex items-center gap-2 px-3 py-[6px] rounded-md border font-mono text-[9px] uppercase tracking-[0.35em] transition-all duration-500"
        style={{
          opacity: isZoomedIn ? 1 : 0,
          pointerEvents: isZoomedIn ? "auto" : "none",
          transform: isZoomedIn ? "translateY(0)" : "translateY(8px)",
          borderColor: "rgba(var(--theme-accent-rgb, 204,41,54), 0.35)",
          backgroundColor: "rgba(0,0,0,0.65)",
          color: "rgba(255,255,255,0.5)",
          backdropFilter: "blur(8px)",
          zIndex: 10,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--theme-accent-rgb,204,41,54),0.7)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--theme-accent-rgb,204,41,54),0.35)"; }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 1L1 5L5 9M9 5H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Reset View
      </button>
    </div>
  );
}
