"use client";

import React, { useEffect, useMemo, useState } from "react";

type TypewriterProps = {
  text: string;
  className?: string;
  startDelayMs?: number;
  speedMs?: number;
  // Pass a negative value to keep the cursor blinking indefinitely
  afterBlinkMs?: number;
};

/**
 * Typewriter renders text one character at a time and shows a blinking cursor
 * that persists for `afterBlinkMs` after completion, then disappears.
 */
export default function Typewriter({
  text,
  className,
  startDelayMs = 1000,
  speedMs = 55,
  afterBlinkMs = 1000,
}: TypewriterProps) {
  const characters = useMemo(() => Array.from(text), [text]);
  const [index, setIndex] = useState<number>(0);
  const [showCursor, setShowCursor] = useState<boolean>(false);

  useEffect(() => {
    let typingTimer: number | undefined;
    let postTimer: number | undefined;

    const start = window.setTimeout(() => {
      setShowCursor(true);
      typingTimer = window.setInterval(() => {
        setIndex((prev) => {
          const next = prev + 1;
          if (next >= characters.length) {
            // Done typing
            window.clearInterval(typingTimer);
            if (afterBlinkMs !== undefined && afterBlinkMs >= 0) {
              postTimer = window.setTimeout(() => setShowCursor(false), afterBlinkMs);
            }
          }
          return Math.min(next, characters.length);
        });
      }, speedMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(start);
      if (typingTimer) window.clearInterval(typingTimer);
      if (postTimer) window.clearTimeout(postTimer);
    };
  }, [characters.length, startDelayMs, speedMs, afterBlinkMs]);

  const visible = characters.slice(0, index).join("");

  return (
    <span className={className} aria-label={text} role="text">
      {visible}
      {showCursor ? <span className="cursor-bar" aria-hidden="true" /> : null}
    </span>
  );
}


