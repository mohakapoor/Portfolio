"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type AutoRedirectProps = {
  href: string;
  delayMs?: number;
};

export default function AutoRedirect({ href, delayMs = 5000 }: AutoRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    const storageKey = `redirected:${href}`;
    try {
      const alreadyRedirected = window.sessionStorage.getItem(storageKey) === "true";
      if (alreadyRedirected) {
        return;
      }
    } catch (_) {
      // If sessionStorage is unavailable, proceed without the guard
    }

    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(storageKey, "true");
      } catch (_) {
        // ignore
      }
      router.push(href);
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [href, delayMs, router]);

  return null;
}


