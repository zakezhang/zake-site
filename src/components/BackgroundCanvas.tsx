"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed canvas behind the page, faded in (via the draw loop, not CSS)
 * only while the footer is in view. The original site uses WebGL; this
 * version draws a slowly-drifting topographic contour map — elevation
 * lines around a few wandering peaks, an echo of Zake's mountaineering.
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

    // Footer-reveal fade, interpolated per frame inside the draw loop
    const fadeState = { current: 0, target: 0 };
    let raf = 0;

    const STEP = 26 * dpr;
    const LEVELS = [0.32, 0.42, 0.52, 0.62, 0.72, 0.82, 0.9];

    const draw = (now: number) => {
      if (!reduced) raf = requestAnimationFrame(draw);

      fadeState.current += (fadeState.target - fadeState.current) * 0.05;
      if (fadeState.current < 0.01 && fadeState.target === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      const fade = Math.min(1, fadeState.current);

      const t = reduced ? 0 : now / 9000;
      const { width: w, height: h } = canvas;
      const ink = getComputedStyle(document.documentElement)
        .getPropertyValue("--label-d")
        .trim();

      // Three wandering peaks — the ones Zake has summited
      const peaks = [
        { x: w * (0.28 + 0.05 * Math.sin(t)), y: h * (0.38 + 0.04 * Math.cos(t * 1.3)), s: 0.16, a: 1, alt: "7546" },
        { x: w * (0.72 + 0.04 * Math.cos(t * 0.8)), y: h * (0.62 + 0.05 * Math.sin(t * 1.1)), s: 0.2, a: 0.85, alt: "5588" },
        { x: w * (0.55 + 0.05 * Math.sin(t * 0.6 + 2)), y: h * (0.18 + 0.04 * Math.cos(t * 0.9 + 1)), s: 0.13, a: 0.7, alt: "4810" },
      ];
      const diag = Math.hypot(w, h);
      const field = (x: number, y: number) => {
        let v = 0;
        for (const p of peaks) {
          const d = Math.hypot(x - p.x, y - p.y) / (p.s * diag);
          v += p.a * Math.exp(-d * d);
        }
        v += 0.06 * Math.sin(x / (170 * dpr) + t * 2) * Math.cos(y / (150 * dpr) - t * 1.5);
        return v;
      };

      const cols = Math.ceil(w / STEP) + 1;
      const rows = Math.ceil(h / STEP) + 1;
      const grid = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++)
          grid[j * cols + i] = field(i * STEP, j * STEP);

      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1 * dpr;

      // Marching squares per contour level; every 3rd level is an index line
      LEVELS.forEach((level, li) => {
        ctx.strokeStyle = `rgba(${ink}, ${(li % 3 === 0 ? 0.16 : 0.09) * fade})`;
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const x = i * STEP;
            const y = j * STEP;
            const tl = grid[j * cols + i];
            const tr = grid[j * cols + i + 1];
            const br = grid[(j + 1) * cols + i + 1];
            const bl = grid[(j + 1) * cols + i];
            const idx =
              (tl > level ? 8 : 0) |
              (tr > level ? 4 : 0) |
              (br > level ? 2 : 0) |
              (bl > level ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const lerp = (a: number, b: number) => (level - a) / (b - a);
            const top = { x: x + STEP * lerp(tl, tr), y };
            const right = { x: x + STEP, y: y + STEP * lerp(tr, br) };
            const bottom = { x: x + STEP * lerp(bl, br), y: y + STEP };
            const left = { x, y: y + STEP * lerp(tl, bl) };
            const seg = (
              a: { x: number; y: number },
              b: { x: number; y: number },
            ) => {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
            };
            switch (idx) {
              case 1: case 14: seg(left, bottom); break;
              case 2: case 13: seg(bottom, right); break;
              case 3: case 12: seg(left, right); break;
              case 4: case 11: seg(top, right); break;
              case 5: seg(left, top); seg(bottom, right); break;
              case 6: case 9: seg(top, bottom); break;
              case 7: case 8: seg(left, top); break;
              case 10: seg(top, right); seg(left, bottom); break;
            }
          }
        }
        ctx.stroke();
      });

      // Summit marks with real altitudes
      ctx.strokeStyle = `rgba(${ink}, ${0.3 * fade})`;
      ctx.fillStyle = `rgba(${ink}, ${0.3 * fade})`;
      ctx.font = `${10 * dpr}px monospace`;
      ctx.beginPath();
      for (const p of peaks) {
        ctx.moveTo(p.x - 5 * dpr, p.y);
        ctx.lineTo(p.x + 5 * dpr, p.y);
        ctx.moveTo(p.x, p.y - 5 * dpr);
        ctx.lineTo(p.x, p.y + 5 * dpr);
      }
      ctx.stroke();
      for (const p of peaks) {
        ctx.fillText(p.alt, p.x + 9 * dpr, p.y - 6 * dpr);
      }
    };

    const footer = document.getElementById("contact");
    const io = new IntersectionObserver(
      ([entry]) => {
        fadeState.target = entry.isIntersecting ? 1 : 0;
        if (reduced) {
          fadeState.current = fadeState.target;
          draw(performance.now());
        }
      },
      { threshold: 0.05 },
    );
    if (footer) io.observe(footer);

    if (!reduced) raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="top-0 left-0 -z-[1] fixed w-full h-dvh lg:h-screen">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
