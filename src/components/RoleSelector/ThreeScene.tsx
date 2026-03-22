"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Html, Center, Wireframe } from "@react-three/drei";
import * as THREE from "three";
import { RoleData } from "@/data/roles";
import { gsap } from "gsap";

function CameraEntrance() {
  const { camera } = useThree();
  useEffect(() => {
    // Cinematic Zoom-in Reveal
    gsap.fromTo(camera.position, 
      { z: 12 }, 
      { z: 5, duration: 2.5, ease: "expo.out", delay: 0.2 }
    );
  }, [camera]);
  return null;
}

interface ThreeSceneProps {
  roles: RoleData[];
  activeIndex: number;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  onChangeRole: (index: number) => void;
}

function RotatingHead({ roles, activeIndex, isLocked, setIsLocked, onChangeRole }: ThreeSceneProps) {
  const { scene } = useGLTF("/head.glb");
  const groupRef = useRef<THREE.Group>(null);
  const activeRole = roles[activeIndex];

  // Safely clone the imported GLTF scene so we can mutate materials freely 
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    return clone;
  }, [scene]);

  // Synchronize materials with a high-contrast dark base for light interaction
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        // Sculpted material for high shadow contrast
        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#383838"),
          emissive: new THREE.Color(activeRole.tokens.tertiary),
          emissiveIntensity: 0.9,
          roughness: 0.7, // Matte for maximum contrast
          metalness: 0.3,
          flatShading: true, // Smooth shading for sculpted look
        });
      }
    });
  }, [clonedScene, activeRole]);


  // Track previous rotation and elapsed time for animations without Clock deprecations
  const prevRotationYRef = useRef(0);
  const elapsedTimeRef = useRef(0);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useFrame((state, delta) => {
    elapsedTimeRef.current += delta;

    if (groupRef.current) {
      const TWO_PI = Math.PI * 2;
      const mouseX = state.mouse.x * 0.25; // Subtle tracking
      const mouseY = state.mouse.y * 0.2;

      if (!isLocked) {
        // 1. Continuous Auto-rotation
        groupRef.current.rotation.y += delta * 0.8;
        
        // Normalize for math stability
        const currentY = ((groupRef.current.rotation.y % TWO_PI) + TWO_PI) % TWO_PI;
        groupRef.current.rotation.y = currentY;

        // 2. Full Rotation Trigger
        if (currentY < prevRotationYRef.current && prevRotationYRef.current > 4.5) {
          const nextIdx = (activeIndexRef.current + 1) % roles.length;
          onChangeRole(nextIdx);
        }

        prevRotationYRef.current = currentY;
        
        // Subtle tilt even during rotation
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY * 0.5, delta * 2);
      } else {
        // 3. Front-Facing Snapping + Mouse Gaze
        const currentY = ((groupRef.current.rotation.y % TWO_PI) + TWO_PI) % TWO_PI;
        groupRef.current.rotation.y = currentY;

        const targetRotY = activeRole.rotationY; 
        const diff = Math.atan2(Math.sin(targetRotY - currentY), Math.cos(targetRotY - currentY));
        
        // Combine snappy rotation with subtle gaze
        groupRef.current.rotation.y += (diff * 10.0 + mouseX) * delta;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY, delta * 2);
        
        prevRotationYRef.current = groupRef.current.rotation.y;
      }

      // Organic Floating & Breathing
      groupRef.current.position.y = Math.sin(elapsedTimeRef.current * 1.5) * 0.12;
      groupRef.current.position.x = Math.cos(elapsedTimeRef.current * 0.8) * 0.06;
    }
  });

  return (
    <group
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setIsLocked(!isLocked);
      }}
    >
      <group ref={groupRef}>
        <primitive object={clonedScene} scale={5.4} position-y={-0.4} />
      </group>

      {/* Subtle role-tinting point light */}
      <pointLight position={[0, 1, 4]} color={activeRole.tokens.tertiary} intensity={1.2} distance={20} />

      <Html position={[0, -2.5, 0]} center zIndexRange={[100, 0]}>
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#666] whitespace-nowrap opacity-60 select-none cursor-pointer hover:opacity-100 transition-opacity">
          {isLocked ? "locked · click to resume auto-rotation" : "auto-rotating · click model to lock"}
        </div>
      </Html>
    </group>
  );
}

export function ThreeScene(props: ThreeSceneProps) {
  return (
    <div className="w-full h-full cursor-pointer touch-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 2]}>
        <CameraEntrance />
        {/* Very low ambient — dark base is essential */}
        <ambientLight intensity={0.05} />

        {/* Key light — high and to the side, this is what carves the face */}
        <directionalLight position={[-2, 8, 3]} intensity={2.8} />

        {/* Brow/eye definition light — above the face, slightly forward */}
        <directionalLight position={[0, 6, 2]} intensity={1.2} />

        {/* Weak front fill — just enough to see into the shadows */}
        <directionalLight position={[0, 0, 6]} intensity={0.25} />

        {/* Rim — separates from background */}
        <directionalLight position={[0, -1, -5]} intensity={1.1} />
        <Center>
          <React.Suspense fallback={
            <Html center>
              <div className="text-[#8c8c8c] text-[10px] uppercase tracking-widest font-mono animate-pulse">
                Initializing 3D Module...
              </div>
            </Html>
          }>
            <RotatingHead {...props} />
          </React.Suspense>
        </Center>
      </Canvas>
    </div>
  );
}

// Preload the requested 3D model asset to avoid stutter
useGLTF.preload("/head.glb");
