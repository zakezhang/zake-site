"use client";

import { useEffect } from "react";

/**
 * Barrel-wall scroll illusion, alive only while the page is in motion:
 * [data-barrel] blocks tilt away and shrink toward the viewport edges as
 * if pasted on the inside of a spinning drum. Intensity ramps up with
 * scrolling and every block springs back perfectly flat ~140ms after the
 * last scroll tick, so a resting page always reads crisp and undistorted.
 */
const MAX_ROT = 13; // deg at the viewport edges
const MAX_SHRINK = 0.08;
const IDLE_MS = 140;
const RETURN_MS = 280;

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
    let ticking = false;
    let idleTimer = 0;

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
        const rot = -d * MAX_ROT * damp * intensity;
        const scale = 1 - Math.abs(d) * MAX_SHRINK * damp * intensity;
        el.style.transition = "none";
        el.style.transform = `perspective(1000px) rotateX(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      }
    };

    // spring everything back flat the moment scrolling rests
    const relax = () => {
      intensity = 0;
      for (const el of els) {
        el.style.transition = `transform ${RETURN_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
        el.style.transform = "";
      }
    };

    const onScroll = () => {
      intensity = Math.min(1, intensity + 0.14);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(relax, IDLE_MS);
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(idleTimer);
      root.removeEventListener("scroll", onScroll);
      els.forEach((el) => {
        el.style.transition = "";
        el.style.transform = "";
      });
    };
  }, []);

  return null;
}
