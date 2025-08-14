"use client";

import React from "react";

export default function HeaderSocials(): React.ReactElement {
  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2 sm:gap-3">
      <a
        href="https://github.com/mohakapoor"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="GitHub"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--newsprint-gray)] text-[var(--vintage-white)] hover:bg-[var(--spider-red)] transition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-3.162 19.492c.5.092.683-.217.683-.483 0-.238-.009-.868-.013-1.703-2.779.604-3.366-1.34-3.366-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.607.069-.607 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.087 2.91.832.091-.647.35-1.087.637-1.337-2.22-.252-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.563 9.563 0 0 1 12 6.844c.851.004 1.708.115 2.509.337 1.909-1.294 2.748-1.025 2.748-1.025.545 1.377.202 2.394.1 2.647.64.698 1.028 1.59 1.028 2.682 0 3.842-2.338 4.688-4.566 4.936.359.309.678.92.678 1.855 0 1.339-.012 2.421-.012 2.751 0 .268.18.58.688.481A10 10 0 0 0 12 2z"/>
        </svg>
      </a>
      <a
        href="https://www.linkedin.com/in/mohak-kapoor-24383828a"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="LinkedIn"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--newsprint-gray)] text-[var(--vintage-white)] hover:bg-[var(--spider-red)] transition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.5 8.25h4V23h-4V8.25zM8.5 8.25h3.834v2.008h.054c.534-1.013 1.84-2.083 3.787-2.083 4.05 0 4.795 2.666 4.795 6.136V23h-3.999v-6.54c0-1.56-.028-3.566-2.173-3.566-2.176 0-2.51 1.7-2.51 3.454V23H8.5V8.25z"/>
        </svg>
      </a>
      {/* Instagram (disabled for now)
      <a
        href="https://www.instagram.com/isitmohak"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Instagram"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--newsprint-gray)] text-[var(--vintage-white)] hover:bg-[var(--spider-red)] transition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm6.5-.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"/>
        </svg>
      </a>
      */}
    </div>
  );
}


