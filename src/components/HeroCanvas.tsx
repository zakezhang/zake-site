"use client";

import { useEffect, useRef } from "react";

/**
 * Line-art scenes cycling behind the hero, one per facet of Zake's life:
 * alpine contours → jiu-jitsu arcs → swimming waves. Same ink-on-paper
 * language as the footer topo map; scenes crossfade inside the draw loop.
 */
const SCENE_S = 9;
const FADE_S = 1.8;
const SCENES = 3;
const CYCLE_S = SCENE_S * SCENES;

/* One accent per facet: expedition orange, belt blue, water aqua */
const ACCENT = {
  alpine: "255,107,53",
  bjj: "79,124,255",
  swim: "34,211,238",
};

function sceneAlpha(cycle: number, index: number) {
  const start = index * SCENE_S;
  // distance into this scene's window, wrapping around the cycle
  const local = (cycle - start + CYCLE_S) % CYCLE_S;
  if (local >= SCENE_S) return 0;
  const fadeIn = Math.min(1, local / FADE_S);
  const fadeOut = Math.min(1, (SCENE_S - local) / FADE_S);
  return Math.min(fadeIn, fadeOut);
}

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

    const mono = (px: number) => `${px * dpr}px monospace`;

    const drawAlpine = (ink: string, a: number, t: number) => {
      const { width: w, height: h } = canvas;
      const peaks = [
        { x: w * (0.34 + 0.04 * Math.sin(t * 0.4)), y: h * (0.42 + 0.03 * Math.cos(t * 0.5)), s: 0.17, a: 1 },
        { x: w * (0.7 + 0.04 * Math.cos(t * 0.35)), y: h * (0.6 + 0.04 * Math.sin(t * 0.45)), s: 0.14, a: 0.75 },
      ];
      const diag = Math.hypot(w, h);
      const field = (x: number, y: number) => {
        let v = 0;
        for (const p of peaks) {
          const d = Math.hypot(x - p.x, y - p.y) / (p.s * diag);
          v += p.a * Math.exp(-d * d);
        }
        return v + 0.05 * Math.sin(x / (180 * dpr) + t * 0.6);
      };
      const STEP = 32 * dpr;
      const cols = Math.ceil(w / STEP) + 1;
      const rows = Math.ceil(h / STEP) + 1;
      const grid = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) grid[j * cols + i] = field(i * STEP, j * STEP);
      ctx.lineWidth = 1 * dpr;
      [0.35, 0.5, 0.65, 0.8, 0.92].forEach((level, li) => {
        ctx.strokeStyle =
          li === 2
            ? `rgba(${ACCENT.alpine}, ${0.4 * a})`
            : `rgba(${ink}, ${(li % 2 === 0 ? 0.13 : 0.08) * a})`;
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const x = i * STEP, y = j * STEP;
            const tl = grid[j * cols + i], tr = grid[j * cols + i + 1];
            const br = grid[(j + 1) * cols + i + 1], bl = grid[(j + 1) * cols + i];
            const idx = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const lerp = (p: number, q: number) => (level - p) / (q - p);
            const top = { x: x + STEP * lerp(tl, tr), y };
            const right = { x: x + STEP, y: y + STEP * lerp(tr, br) };
            const bottom = { x: x + STEP * lerp(bl, br), y: y + STEP };
            const left = { x, y: y + STEP * lerp(tl, bl) };
            const seg = (p: { x: number; y: number }, q: { x: number; y: number }) => {
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
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
      const main = peaks[0];
      ctx.strokeStyle = `rgba(${ACCENT.alpine}, ${0.65 * a})`;
      ctx.fillStyle = `rgba(${ACCENT.alpine}, ${0.65 * a})`;
      ctx.beginPath();
      ctx.moveTo(main.x - 5 * dpr, main.y);
      ctx.lineTo(main.x + 5 * dpr, main.y);
      ctx.moveTo(main.x, main.y - 5 * dpr);
      ctx.lineTo(main.x, main.y + 5 * dpr);
      ctx.stroke();
      ctx.font = mono(10);
      ctx.fillText("MUZTAGH ATA — 7546M", main.x + 9 * dpr, main.y - 6 * dpr);
    };

    const drawBjj = (ink: string, a: number, t: number) => {
      const { width: w, height: h } = canvas;
      const cx = w * 0.64, cy = h * 0.46;
      const base = Math.min(w, h);
      ctx.lineWidth = 1 * dpr;
      for (let i = 0; i < 6; i++) {
        const r = base * (0.09 + i * 0.075);
        const dir = i % 2 === 0 ? 1 : -1;
        const start = t * (0.12 + i * 0.03) * dir + i * 1.1;
        const span = Math.PI * (0.9 + 0.35 * Math.sin(t * 0.3 + i));
        ctx.strokeStyle =
          i % 3 === 0
            ? `rgba(${ACCENT.bjj}, ${0.42 * a})`
            : `rgba(${ink}, ${0.09 * a})`;
        ctx.beginPath();
        ctx.arc(cx, cy, r, start, start + span);
        ctx.stroke();
        // leading grip point on each arc
        ctx.fillStyle = `rgba(${ACCENT.bjj}, ${0.5 * a})`;
        ctx.beginPath();
        ctx.arc(cx + r * Math.cos(start + span), cy + r * Math.sin(start + span), 2 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = `rgba(${ACCENT.bjj}, ${0.65 * a})`;
      ctx.font = mono(10);
      ctx.fillText("BRAZILIAN JIU-JITSU — BLUE BELT", cx - base * 0.09, cy - base * 0.09 - 10 * dpr);
    };

    const drawSwim = (ink: string, a: number, t: number) => {
      const { width: w, height: h } = canvas;
      ctx.lineWidth = 1 * dpr;
      const rowsY = 7;
      for (let i = 0; i < rowsY; i++) {
        const y = h * (0.5 + (i / (rowsY - 1)) * 0.38);
        const amp = (6 + i * 2.2) * dpr;
        const k = 0.008 / dpr;
        const speed = 0.9 + i * 0.18;
        ctx.strokeStyle =
          i % 3 === 0
            ? `rgba(${ACCENT.swim}, ${0.4 * a})`
            : `rgba(${ink}, ${0.08 * a})`;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6 * dpr) {
          const yy = y + Math.sin(x * k + t * speed + i * 0.9) * amp;
          if (x === 0) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }
      // lane line + PB annotation
      const laneY = h * 0.46;
      ctx.strokeStyle = `rgba(${ACCENT.swim}, ${0.35 * a})`;
      ctx.setLineDash([2 * dpr, 8 * dpr]);
      ctx.beginPath();
      ctx.moveTo(0, laneY);
      ctx.lineTo(w, laneY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = `rgba(${ACCENT.swim}, ${0.65 * a})`;
      ctx.font = mono(10);
      ctx.fillText("FREESTYLE 50M — 29.8S", w * 0.66, laneY - 8 * dpr);
    };

    const painters = [drawAlpine, drawBjj, drawSwim];
    let raf = 0;

    const draw = (now: number) => {
      if (!reduced) raf = requestAnimationFrame(draw);
      if (!inView) return;
      const t = reduced ? 0 : now / 1000;
      const cycle = t % CYCLE_S;
      const ink = getComputedStyle(document.documentElement)
        .getPropertyValue("--label-d")
        .trim();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      painters.forEach((paint, i) => {
        const a = reduced ? (i === 0 ? 1 : 0) : sceneAlpha(cycle, i);
        if (a > 0.01) paint(ink, a, t);
      });
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
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
