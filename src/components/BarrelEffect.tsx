"use client";

import { useEffect } from "react";

/**
 * Barrel-wall scroll illusion: every [data-barrel] block tilts away and
 * shrinks slightly as it approaches the viewport edges, as if the page
 * were pasted on the inside of a drum. Center-origin rotateX + scale keep
 * each block's midpoint fixed, so the math never feeds back on itself.
 */
export function BarrelEffect() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.querySelector<HTMLElement>(".no-scrollbar");
    if (!root) return;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-barrel]"),
    );
    if (els.length === 0) return;

    let ticking = false;
    const apply = () => {
      ticking = false;
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
        const rot = -d * 9 * damp;
        const scale = 1 - Math.abs(d) * 0.05 * damp;
        el.style.transform = `perspective(1400px) rotateX(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };

    apply();
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      els.forEach((el) => {
        el.style.transform = "";
      });
    };
  }, []);

  return null;
}
