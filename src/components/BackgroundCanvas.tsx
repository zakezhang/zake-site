"use client";

import { useEffect, useRef } from "react";
import {
  ACCENT_LIST,
  CYCLE_S,
  SCENE_PAINTERS,
  sceneAlpha,
  type SceneEnv,
} from "@/lib/facetScenes";

/**
 * Fixed canvas behind the page, faded in (via the draw loop, not CSS)
 * while the motto CTA or the footer is in view. Cycles the same four
 * facet scenes as the hero, with the same liquid pointer field.
 */
export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    // Section-reveal fade, interpolated per frame inside the draw loop
    const fadeState = { current: 0, target: 0 };
    let raf = 0;

    // Liquid pointer field, in canvas pixels; smoothed toward the cursor
    const pointer = { tx: -1e4, ty: -1e4, x: -1e4, y: -1e4, energy: 0, inside: false };
    const onMove = (e: PointerEvent) => {
      pointer.inside = true;
      pointer.tx = e.clientX * dpr;
      pointer.ty = e.clientY * dpr;
    };
    const onLeave = () => {
      pointer.inside = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    const bump = (x: number, y: number, radius: number, gain: number) => {
      if (pointer.energy < 0.01) return 0;
      const d = Math.hypot(x - pointer.x, y - pointer.y) / radius;
      return gain * pointer.energy * Math.exp(-d * d);
    };

    // Cache the ink color; re-read only when the theme class flips
    const readInk = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--label-d")
        .trim();
    let ink = readInk();
    const themeWatch = new MutationObserver(() => {
      ink = readInk();
    });
    themeWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let frame = 0;

    const draw = (now: number) => {
      if (!reduced) raf = requestAnimationFrame(draw);
      // Half-rate painting keeps the main thread free while scrolling
      // through the CTA/footer overlap
      frame++;
      if (!reduced && frame % 2 === 1) return;

      fadeState.current += (fadeState.target - fadeState.current) * 0.1;
      if (fadeState.current < 0.01 && fadeState.target === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      const fade = Math.min(1, fadeState.current);

      // Smooth the pointer toward the cursor; energy fades when it leaves
      pointer.x += (pointer.tx - pointer.x) * 0.24;
      pointer.y += (pointer.ty - pointer.y) * 0.24;
      pointer.energy += ((pointer.inside ? 1 : 0) - pointer.energy) * 0.12;

      const t = reduced ? 0 : now / 1000;
      const cycle = t % CYCLE_S;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let dominant = 0;
      let best = 0;
      SCENE_PAINTERS.forEach((paint, i) => {
        const a = reduced ? (i === 0 ? 1 : 0) : sceneAlpha(cycle, i);
        if (a > best) {
          best = a;
          dominant = i;
        }
        const scoped = a * fade;
        if (scoped > 0.01) {
          const env: SceneEnv = {
            ctx,
            w: canvas.width,
            h: canvas.height,
            dpr,
            ink,
            a: scoped,
            t,
            bump,
          };
          paint(env);
        }
      });

      // Liquid glow trailing the cursor, tinted by the active scene
      if (pointer.energy > 0.02 && fade > 0.02) {
        const rad = 150 * dpr;
        const g = ctx.createRadialGradient(
          pointer.x, pointer.y, 0, pointer.x, pointer.y, rad,
        );
        g.addColorStop(0, `rgba(${ACCENT_LIST[dominant]}, ${0.14 * pointer.energy * fade})`);
        g.addColorStop(1, `rgba(${ACCENT_LIST[dominant]}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Show the scenes across the last two sections: the CTA and the footer
    const sections = ["cta", "contact"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        fadeState.target = visible.size > 0 ? 1 : 0;
        if (reduced) {
          fadeState.current = fadeState.target;
          draw(performance.now());
        }
      },
      { threshold: 0.05 },
    );
    sections.forEach((el) => io.observe(el));

    if (!reduced) raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      themeWatch.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="top-0 left-0 -z-[1] fixed w-full h-dvh lg:h-screen">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
