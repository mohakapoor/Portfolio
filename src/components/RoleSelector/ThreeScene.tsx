"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Center } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import { RoleData } from "@/data/roles";
import { gsap } from "gsap";

function CameraEntrance() {
  const { camera } = useThree();
  useEffect(() => {
    // Cinematic Zoom-in Reveal
    gsap.fromTo(camera.position, 
      { z: 12 }, 
      { z: 9, duration: 2.5, ease: "expo.out", delay: 0.2 }
    );
  }, [camera]);
  return null;
}

interface HexLatticeProps {
  radius?: number;
  color?: string;
  pulseColor?: string;
  detail?: number;
}

// --- HEXAGONAL DATA LATTICE COMPONENT ---
function HexLattice({ radius = 1.6, color = "#fff", pulseColor = "#fff", detail = 2 }: HexLatticeProps) {
  const meshRef = useRef<THREE.LineSegments>(null);

  const { latticeVertices, pathVertices, neighbors } = useMemo(() => {
    const icosa = new THREE.IcosahedronGeometry(1, detail);
    const pos = icosa.attributes.position.array;
    const faces: number[][] = [];
    for (let i = 0; i < pos.length; i += 9) {
      faces.push([i, i + 3, i + 6]);
    }

    const centroids: THREE.Vector3[] = faces.map(f => {
      const v1 = new THREE.Vector3(pos[f[0]], pos[f[0]+1], pos[f[0]+2]);
      const v2 = new THREE.Vector3(pos[f[1]], pos[f[1]+1], pos[f[1]+2]);
      const v3 = new THREE.Vector3(pos[f[2]], pos[f[2]+1], pos[f[2]+2]);
      return new THREE.Vector3().add(v1).add(v2).add(v3).divideScalar(3).normalize();
    });

    const lineVertices: THREE.Vector3[] = [];
    const adj: number[][] = centroids.map(() => []);

    for (let i = 0; i < faces.length; i++) {
      for (let j = i + 1; j < faces.length; j++) {
        let shared = 0;
        const f1 = [
          new THREE.Vector3(pos[faces[i][0]], pos[faces[i][0]+1], pos[faces[i][0]+2]), 
          new THREE.Vector3(pos[faces[i][1]], pos[faces[i][1]+1], pos[faces[i][1]+2]), 
          new THREE.Vector3(pos[faces[i][2]], pos[faces[i][2]+1], pos[faces[i][2]+2])
        ];
        const f2 = [
          new THREE.Vector3(pos[faces[j][0]], pos[faces[j][0]+1], pos[faces[j][0]+2]), 
          new THREE.Vector3(pos[faces[j][1]], pos[faces[j][1]+1], pos[faces[j][1]+2]), 
          new THREE.Vector3(pos[faces[j][2]], pos[faces[j][2]+1], pos[faces[j][2]+2])
        ];
        for (const v1 of f1) for (const v2 of f2) if (v1.distanceTo(v2) < 0.01) shared++;
        if (shared === 2) { 
          lineVertices.push(centroids[i], centroids[j]);
          adj[i].push(j);
          adj[j].push(i);
        }
      }
    }
    return { 
      latticeVertices: new Float32Array(lineVertices.flatMap(v => [v.x, v.y, v.z])),
      pathVertices: centroids,
      neighbors: adj
    };
  }, [detail]);

  useFrame(() => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.LineBasicMaterial).opacity = 0.25;
    }
  });

  return (
    <group scale={[radius, radius, radius]}>
      <lineSegments ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={latticeVertices.length / 3} array={latticeVertices} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.25} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <HexPulses key={pulseColor} vertices={pathVertices} neighbors={neighbors} color={pulseColor} />
    </group>
  );
}

interface HexPulsesProps {
  vertices: THREE.Vector3[];
  neighbors: number[][];
  color: string;
}

function HexPulses({ vertices, neighbors, color }: HexPulsesProps) {
  const count = 16;
  const pulseLength = 3; 
  const pulses = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const path: number[] = [];
      let current = Math.floor((i / count) * (vertices?.length || 1));
      path.push(current);
      for(let j=0; j<pulseLength; j++) {
        const possible = neighbors[current] || [];
        if (possible.length > 0) current = possible[Math.floor(Math.random() * possible.length)];
        path.push(current);
      }
      return { path, progress: (i / count), speed: 0.7 + Math.random() * 0.3, ref: React.createRef<THREE.Line>() };
    });
  }, [vertices, neighbors, count]);

  useFrame((state, delta) => {
    pulses.forEach((p) => {
      p.progress += delta * p.speed;
      if (p.progress >= 1) {
        p.progress = 0;
        const head = p.path[p.path.length - 1];
        const nextPossible = neighbors[head] || [];
        if (nextPossible.length > 0) {
          const next = nextPossible[Math.floor(Math.random() * nextPossible.length)];
          p.path.shift();
          p.path.push(next);
        }
      }
      if (p.ref.current && p.path.length >= 2) {
        const geo = p.ref.current.geometry as THREE.BufferGeometry;
        if (!geo.attributes.position) geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array((pulseLength + 1) * 3), 3));
        const attr = geo.attributes.position;
        const headStart = vertices[p.path[p.path.length - 2]];
        const headEnd = vertices[p.path[p.path.length - 1]];
        if (headStart && headEnd) {
          const headPos = new THREE.Vector3().lerpVectors(headStart, headEnd, p.progress);
          const posArray = attr.array as Float32Array;
          for(let i=0; i<p.path.length - 1; i++) {
            const v = vertices[p.path[i]];
            if (v) {
              posArray[i * 3] = v.x;
              posArray[i * 3 + 1] = v.y;
              posArray[i * 3 + 2] = v.z;
            }
          }
          const lastIdx = (p.path.length - 1) * 3;
          posArray[lastIdx] = headPos.x;
          posArray[lastIdx + 1] = headPos.y;
          posArray[lastIdx + 2] = headPos.z;
          attr.needsUpdate = true;
        }
      }
    });
  });

  return (
    <group>
      {pulses.map((p, i) => (
        <line key={i} ref={p.ref}>
          <bufferGeometry />
          <lineBasicMaterial color={color} transparent opacity={1} depthTest={false} blending={THREE.AdditiveBlending} />
        </line>
      ))}
    </group>
  );
}

function Satellites({ colors }: { colors: string[] }) {
  const satelliteRefs = useRef<(THREE.Group | null)[]>([]);
  const satellites = useMemo(() => [
    { distance: 2.15, speed: 1.1, size: 0.04, tilt: [0.5, 0.2, 0] },
    { distance: 2.3, speed: -0.8, size: 0.05, tilt: [-0.3, 0.5, 0.4] },
    { distance: 2.5, speed: 0.6, size: 0.03, tilt: [0.2, -0.4, 0.8] },
    { distance: 2.7, speed: -0.4, size: 0.04, tilt: [1.2, 0.2, -0.2] },
  ], []);


  useFrame((state) => {
    const t = state.clock.elapsedTime;
    satelliteRefs.current.forEach((ref, i) => {
      if (ref) {
        const s = satellites[i];
        const angle = t * s.speed;
        ref.position.x = Math.cos(angle) * s.distance;
        ref.position.z = Math.sin(angle) * s.distance;
      }
    });
  });

  return (
    <group>
      {satellites.map((s, i) => (
        <group key={i} rotation={s.tilt as [number, number, number]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[s.distance, s.distance + 0.005, 128]} />
            <meshBasicMaterial color={colors[i % colors.length]} transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
          <group ref={(el) => (satelliteRefs.current[i] = el)}>
            <mesh>
              <sphereGeometry args={[s.size, 16, 16]} />
              <meshBasicMaterial color={colors[i % colors.length]} />
            </mesh>
            <pointLight distance={1.5} intensity={2} color={colors[i % colors.length]} />
          </group>
        </group>
      ))}
    </group>
  );
}

interface ThreeSceneProps {
  roles: RoleData[];
  activeIndex: number;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  onChangeRole: (index: number) => void;
}

function CyberpunkMesh({ roles, activeIndex, isLocked, setIsLocked, onChangeRole }: ThreeSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const activeRole = roles[activeIndex];
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta;
    if (!groupRef.current) return;
    const TWO_PI = Math.PI * 2;
    const mouseX = state.mouse.x * 0.3;
    const mouseY = state.mouse.y * 0.25;

    if (!isLocked) {
      // 1. Continuous Auto-rotation
      groupRef.current.rotation.y += delta * 0.3;
      groupRef.current.rotation.y %= TWO_PI;

      // 2. 120-degree segment-based Role Switching
      const angleDeg = (groupRef.current.rotation.y * 180 / Math.PI) % 360;
      const normalizedAngle = angleDeg < 0 ? angleDeg + 360 : angleDeg;
      const newIndex = Math.floor(normalizedAngle / 120) % roles.length;
      if (newIndex !== activeIndex) {
        onChangeRole(newIndex);
      }
    } else {
      // 3. Front-Facing Snapping + Mouse Gaze
      const targetRotY = activeRole.rotationY || 0;
      const currentY = groupRef.current.rotation.y;
      const diff = Math.atan2(Math.sin(targetRotY - currentY), Math.cos(targetRotY - currentY));
      
      groupRef.current.rotation.y += (diff * 5 + mouseX) * delta;
    }
    // Vertical tilt
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY, delta * 3);

    // Organic Breathing
    groupRef.current.position.y = Math.sin(time.current * 1.2) * 0.1;
  });

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        setIsLocked(!isLocked);
      }}
    >
      <group ref={groupRef}>
        <HexLattice radius={1.8} color={activeRole.tokens.tertiary} pulseColor={activeRole.pulseColor} />
      </group>
      
      <Satellites colors={activeRole.satColors} />

    </group>
  );
}

export function ThreeScene(props: ThreeSceneProps) {
  return (
    <div className="w-full h-full cursor-pointer touch-none">
      <Canvas camera={{ position: [0, 0, 9], fov: 35 }} dpr={[1, 2]}>
        <CameraEntrance />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color={props.roles[props.activeIndex].tokens.tertiary} />

        <Center>
          <CyberpunkMesh {...props} />
        </Center>

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.1} mipmapBlur intensity={1.0} radius={0.4} />
          <Noise opacity={0.05} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
