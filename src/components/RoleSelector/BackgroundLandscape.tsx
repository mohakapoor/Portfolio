"use client";

import React, { useState, useEffect } from "react";

interface BackgroundLandscapeProps {
  image: string;
}

export function BackgroundLandscape({ image }: BackgroundLandscapeProps) {
  const [displayImage, setDisplayImage] = useState(image);
  const [fade, setFade] = useState("opacity-40");

  useEffect(() => {
    if (image !== displayImage) {
      // Fade out current
      setFade("opacity-0");
      
      const timeout = setTimeout(() => {
        setDisplayImage(image);
        setFade("opacity-40");
      }, 400); // Trigger swap midway through transition
      
      return () => clearTimeout(timeout);
    }
  }, [image, displayImage]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#0d0d0d]">
      {/* The Dynamic Landscape Image */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1000ms] ease-in-out ${fade}`}
        style={{ 
          backgroundImage: `url(${displayImage})`,
          // Subtle noir treatment: slightly desaturated and deepened
          filter: "grayscale(0.2) brightness(0.5) contrast(1.2)",
        }}
      />
      
      {/* Vignette & Gradients to Ensure Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-transparent to-[#0d0d0d] opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-transparent to-[rgba(13,13,13,0.8)] opacity-50" />
    </div>
  );
}
