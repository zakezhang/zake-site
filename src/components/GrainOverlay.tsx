"use client";

import { useEffect, useRef } from "react";

const FPS = 12;
const SCALE = 3;

export function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      // zero-sized windows (background prerender, headless) must not crash
      canvas.width = Math.max(1, Math.ceil(window.innerWidth / SCALE));
      canvas.height = Math.max(1, Math.ceil(window.innerHeight / SCALE));
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      const image = ctx.createImageData(width, height);
      const data = image.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
    };

    draw();
    let id = 0;
    if (!reduced) id = window.setInterval(draw, 1000 / FPS);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    // Sits behind the content as background texture; text and media stay crisp
    <div className="-z-[2] fixed inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.07]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
