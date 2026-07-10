"use client";

import { useEffect, useRef } from "react";
import {
  ACCENT_LIST,
  CYCLE_S,
  createScenePainters,
  sceneAlpha,
  type SceneEnv,
} from "@/lib/facetScenes";

/**
 * Cycling facet scenes behind the hero (painters live in lib/facetScenes).
 * Adds the liquid pointer field: scenes warp around the cursor and a
 * scene-tinted glow trails it.
 */
export function HeroCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      canvas.width = wrap.offsetWidth * dpr;
      canvas.height = wrap.offsetHeight * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let inView = true;
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
    });
    io.observe(wrap);

    // Liquid pointer field, in canvas pixels; smoothed toward the cursor
    const pointer = { tx: -1e4, ty: -1e4, x: -1e4, y: -1e4, energy: 0, inside: false };
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      pointer.inside = inside;
      if (inside) {
        pointer.tx = (e.clientX - r.left) * dpr;
        pointer.ty = (e.clientY - r.top) * dpr;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Gaussian bump from the cursor, used to warp scenes near the pointer
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

    const painters = createScenePainters();
    let raf = 0;

    const draw = (now: number) => {
      if (!reduced) raf = requestAnimationFrame(draw);
      if (!inView) return;
      const t = reduced ? 0 : now / 1000;
      const cycle = t % CYCLE_S;

      // Smooth the pointer toward the cursor; energy fades when it leaves
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      pointer.energy += ((pointer.inside ? 1 : 0) - pointer.energy) * 0.06;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let dominant = 0;
      let best = 0;
      painters.forEach((paint, i) => {
        const a = reduced ? (i === 0 ? 1 : 0) : sceneAlpha(cycle, i);
        if (a > best) {
          best = a;
          dominant = i;
        }
        if (a > 0.01) {
          const env: SceneEnv = {
            ctx,
            w: canvas.width,
            h: canvas.height,
            dpr,
            ink,
            a,
            t,
            bump,
            pointer,
          };
          paint(env);
        }
      });

      // Liquid glow trailing the cursor, tinted by the active scene
      if (pointer.energy > 0.02) {
        const rad = 130 * dpr;
        const g = ctx.createRadialGradient(
          pointer.x, pointer.y, 0, pointer.x, pointer.y, rad,
        );
        g.addColorStop(0, `rgba(${ACCENT_LIST[dominant]}, ${0.16 * pointer.energy})`);
        g.addColorStop(1, `rgba(${ACCENT_LIST[dominant]}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeWatch.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="absolute inset-0 -z-[1] pointer-events-none"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
