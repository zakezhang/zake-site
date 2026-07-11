"use client";

import { useEffect } from "react";

/**
 * Barrel-wall scroll illusion driven by a smoothed energy value:
 * while scrolling the intensity eases toward 1, and once motion rests it
 * decays gently back to 0 over ~0.7s — both directions ride the same
 * continuous per-frame interpolation, so the drum breathes in and out
 * with no snap. At zero energy the loop sleeps and every [data-barrel]
 * block carries no transform at all.
 */
const MAX_ROT = 13; // deg at the viewport edges
const MAX_SHRINK = 0.08;
const SCROLLING_WINDOW_MS = 120;
const EASE_IN = 0.1; // per-frame lerp toward 1 while scrolling
const EASE_OUT = 0.05; // per-frame lerp toward 0 at rest

export function BarrelEffect() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.querySelector<HTMLElement>(".no-scrollbar");
    if (!root) return;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-barrel]"),
    );
    if (els.length === 0) return;

    let intensity = 0;
    let lastScroll = -1e9;
    let running = false;
    let rafId = 0;

    const apply = () => {
      const vh = root.clientHeight;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh * 0.3 || r.top > vh * 1.3) {
          if (el.style.transform) el.style.transform = "";
          continue;
        }
        const center = r.top + r.height / 2;
        let d = (center - vh / 2) / vh; // 0 at viewport center
        d = Math.max(-0.9, Math.min(0.9, d));
        // tall blocks tilt less so long sections don't lean permanently
        const damp = Math.min(1, (vh * 1.4) / Math.max(1, r.height));
        const rot = -d * MAX_ROT * damp * intensity;
        const scale = 1 - Math.abs(d) * MAX_SHRINK * damp * intensity;
        el.style.transform = `perspective(1000px) rotateX(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      }
    };

    const frame = (now: number) => {
      const scrolling = now - lastScroll < SCROLLING_WINDOW_MS;
      const target = scrolling ? 1 : 0;
      intensity += (target - intensity) * (target > intensity ? EASE_IN : EASE_OUT);
      if (!scrolling && intensity < 0.002) {
        intensity = 0;
        running = false;
        for (const el of els) {
          if (el.style.transform) el.style.transform = "";
        }
        return;
      }
      apply();
      rafId = requestAnimationFrame(frame);
    };

    const onScroll = () => {
      lastScroll = performance.now();
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(frame);
      }
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      root.removeEventListener("scroll", onScroll);
      els.forEach((el) => {
        el.style.transform = "";
      });
    };
  }, []);

  return null;
}
