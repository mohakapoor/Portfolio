'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type TargetCursorProps = {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  color?: string;
};

export default function TargetCursor({
  targetSelector = '[data-cursor-target], .cursor-target',
  spinDuration = 3,
  hideDefaultCursor = false,
  color = 'var(--spider-red)'
}: TargetCursorProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rotorRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const mobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    if (!isMounted || isMobile) return;
    
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const wrapper = wrapperRef.current;
    const rotor = rotorRef.current;
    const dot = dotRef.current;
    if (!wrapper || !rotor || !dot) return;

    // Hide default cursor if requested
    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    // Smooth follow using quickTo
    const setX = gsap.quickTo(wrapper, 'x', { duration: 0.18, ease: 'power3.out' });
    const setY = gsap.quickTo(wrapper, 'y', { duration: 0.18, ease: 'power3.out' });
    
    let currentTarget: HTMLElement | null = null;
    
    const onMove = (e: MouseEvent) => {
      const targets = Array.from(document.querySelectorAll<HTMLElement>(targetSelector));
      let hoveredTarget: HTMLElement | null = null;
      
      // Check if mouse is directly over any target
      targets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const padding = 20; // Extend the detection area slightly beyond button bounds
        
        if (
          e.clientX >= rect.left - padding &&
          e.clientX <= rect.right + padding &&
          e.clientY >= rect.top - padding &&
          e.clientY <= rect.bottom + padding
        ) {
          hoveredTarget = target;
        }
      });
      
      if (hoveredTarget && hoveredTarget !== currentTarget) {
        // New target - position corners around button edges
        currentTarget = hoveredTarget;
        const rect = (hoveredTarget as HTMLElement).getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;
        
        setX(targetX);
        setY(targetY);
        
        // Stop spinning and lock rotation
        spinTween?.pause();
        gsap.set(rotor, { rotation: 0 });
        
        // Position each corner around the button with more margin
        const margin = 6; // 16 * 0.4 = 6.4px margin
        const cornerSize = 12;
        const borderWidth = 3;
        
        // Get all corner elements
        const corners = rotor.querySelectorAll('.target-cursor-corner');
        const [tlCorner, trCorner, brCorner, blCorner] = corners;
        
        // Calculate positions relative to cursor center with larger margin
        const tlX = rect.left - targetX - borderWidth - margin;
        const tlY = rect.top - targetY - borderWidth - margin;
        const trX = rect.right - targetX + borderWidth - cornerSize + margin;
        const trY = rect.top - targetY - borderWidth - margin;
        const brX = rect.right - targetX + borderWidth - cornerSize + margin;
        const brY = rect.bottom - targetY + borderWidth - cornerSize + margin;
        const blX = rect.left - targetX - borderWidth - margin;
        const blY = rect.bottom - targetY + borderWidth - cornerSize + margin;
        
        // Change to white when locked in
        corners.forEach(corner => {
          (corner as HTMLElement).style.borderColor = '#ffffff';
        });
        (dot as HTMLElement).style.backgroundColor = '#ffffff';
        
        // Animate corners to their positions
        gsap.to(tlCorner, { x: tlX, y: tlY, duration: 0.3, ease: 'power3.out' });
        gsap.to(trCorner, { x: trX, y: trY, duration: 0.3, ease: 'power3.out' });
        gsap.to(brCorner, { x: brX, y: brY, duration: 0.3, ease: 'power3.out' });
        gsap.to(blCorner, { x: blX, y: blY, duration: 0.3, ease: 'power3.out' });
        gsap.to(dot, { scale: 0.8, duration: 0.2, ease: 'power3.out' });
      } else if (!hoveredTarget && currentTarget) {
        // Left magnetic field - return corners to default positions
        currentTarget = null;
        setX(e.clientX);
        setY(e.clientY);
        
        // Resume spinning
        if (!prefersReduced && spinDuration > 0) {
          spinTween?.resume();
        }
        
        // Reset colors back to red
        const corners = rotor.querySelectorAll('.target-cursor-corner');
        corners.forEach(corner => {
          (corner as HTMLElement).style.borderColor = color;
        });
        (dot as HTMLElement).style.backgroundColor = color;
        
        // Reset corners to default positions
        const [tlCorner, trCorner, brCorner, blCorner] = corners;
        const cornerSize = 12;
        
        gsap.to(tlCorner, { x: -cornerSize * 1.5, y: -cornerSize * 1.5, duration: 0.4, ease: 'power3.inOut' });
        gsap.to(trCorner, { x: cornerSize * 0.5, y: -cornerSize * 1.5, duration: 0.4, ease: 'power3.inOut' });
        gsap.to(brCorner, { x: cornerSize * 0.5, y: cornerSize * 0.5, duration: 0.4, ease: 'power3.inOut' });
        gsap.to(blCorner, { x: -cornerSize * 1.5, y: cornerSize * 0.5, duration: 0.4, ease: 'power3.inOut' });
        gsap.to(dot, { scale: 1, duration: 0.3, ease: 'power3.inOut' });
      } else if (!hoveredTarget) {
        // Normal mouse follow
        setX(e.clientX);
        setY(e.clientY);
      }
    };
    window.addEventListener('mousemove', onMove);

    // Continuous spin of corners
    let spinTween: gsap.core.Tween | null = null;
    if (!prefersReduced && spinDuration > 0) {
      spinTween = gsap.to(rotor, { rotate: 360, duration: spinDuration, ease: 'none', repeat: -1 });
    }


    return () => {
      window.removeEventListener('mousemove', onMove);
      spinTween?.kill();
      if (hideDefaultCursor) {
        document.body.style.cursor = originalCursor;
      }
    };
  }, [targetSelector, spinDuration, hideDefaultCursor, isMounted, isMobile]);

  // Don't render anything until mounted or if on mobile
  if (!isMounted || isMobile) return null;

  return (
    <>
      <div
        ref={wrapperRef}
        className="target-cursor-wrapper"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'normal',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div
          ref={dotRef}
          className="target-cursor-dot"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 4,
            height: 4,
            background: color,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            willChange: 'transform'
          }}
        />
        <div
          ref={rotorRef}
          className="target-cursor-rotor"
          style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0 }}
        >
          <div
            className="target-cursor-corner corner-tl"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 12,
              height: 12,
              border: `3px solid ${color}`,
              transform: 'translate(-150%, -150%)',
              willChange: 'transform',
              borderRight: 'none',
              borderBottom: 'none'
            }}
          />
          <div
            className="target-cursor-corner corner-tr"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 12,
              height: 12,
              border: `3px solid ${color}`,
              transform: 'translate(50%, -150%)',
              willChange: 'transform',
              borderLeft: 'none',
              borderBottom: 'none'
            }}
          />
          <div
            className="target-cursor-corner corner-br"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 12,
              height: 12,
              border: `3px solid ${color}`,
              transform: 'translate(50%, 50%)',
              willChange: 'transform',
              borderLeft: 'none',
              borderTop: 'none'
            }}
          />
          <div
            className="target-cursor-corner corner-bl"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 12,
              height: 12,
              border: `3px solid ${color}`,
              transform: 'translate(-150%, 50%)',
              willChange: 'transform',
              borderRight: 'none',
              borderTop: 'none'
            }}
          />
        </div>
      </div>
    </>
  );
}


