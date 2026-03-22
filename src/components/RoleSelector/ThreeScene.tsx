"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Html, Center, Wireframe } from "@react-three/drei";
import * as THREE from "three";
import { RoleData } from "@/data/roles";

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

  // Synchronize materials with High-Tech Editorial active tertiary token
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
         const mesh = child as THREE.Mesh;
         
          // Create the High-Tech Editorial emissive material
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#050505"),
            emissive: new THREE.Color(activeRole.tokens.tertiary),
            emissiveIntensity: 3.0, 
            roughness: 0.5, 
            metalness: 0.5,
            flatShading: true,
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
      
      if (!isLocked) {
        // 1. Continuous Auto-rotation
        groupRef.current.rotation.y += delta * 0.8; 
        
        // Normalize for math stability
        const currentY = ((groupRef.current.rotation.y % TWO_PI) + TWO_PI) % TWO_PI;
        groupRef.current.rotation.y = currentY;

        // 2. Full Rotation Trigger: If we jumped from ~2π back to ~0, increment role
        if (currentY < prevRotationYRef.current && prevRotationYRef.current > 4.5) {
          const nextIdx = (activeIndexRef.current + 1) % roles.length;
          onChangeRole(nextIdx);
        }
        
        prevRotationYRef.current = currentY;
      } else {
        // 3. Front-Facing Snapping (Target is Always 0 for all roles now)
        const currentY = ((groupRef.current.rotation.y % TWO_PI) + TWO_PI) % TWO_PI;
        groupRef.current.rotation.y = currentY;

        const targetRotY = activeRole.rotationY; // This is now 0 for all roles
        const diff = Math.atan2(Math.sin(targetRotY - currentY), Math.cos(targetRotY - currentY));
        
        groupRef.current.rotation.y += diff * 10.0 * delta;
        
        if (Math.abs(diff) < 0.001) {
          groupRef.current.rotation.y = targetRotY;
        }
        
        prevRotationYRef.current = groupRef.current.rotation.y;
      }
      
      // Floating animation (sine wave Y drift) using the non-deprecated ref
      groupRef.current.position.y = Math.sin(elapsedTimeRef.current * 1.2) * 0.08;
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
         <primitive object={clonedScene} scale={5.4} />
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
        {/* Low ambient — keep it dark so directionals do the work */}
        <ambientLight intensity={0.12} />

        {/* Key light — above, offset to one side, strong */}
        <directionalLight position={[3, 5, 4]} intensity={1.6} />

        {/* Fill light — opposite side, much weaker, softens harsh shadows */}
        <directionalLight position={[-4, 1, 3]} intensity={0.35} />

        {/* Rim light — from behind/below, separates head from background */}
        <directionalLight position={[0, -3, -4]} intensity={0.7} />
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
