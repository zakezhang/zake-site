"use client";

import { useEffect, useRef } from "react";

const TILE = 256; // CSS px

/** gaussian-ish sample in [-1, 1]: film grain clusters around mid-grey */
const grain = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

/**
 * Fine, moving film grain behind the content. One tile is drawn once at
 * device-pixel resolution (one grain per physical pixel); an oversized layer
 * then jumps between random offsets with a stepped CSS transform, so the
 * motion runs entirely on the compositor and never touches the main thread.
 */
export function GrainOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dpr = Math.min(3, Math.max(1, window.devicePixelRatio || 1));
    const size = Math.round(TILE * dpr);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // light grains lift, dark grains sink — the mean stays neutral on any theme
    const img = ctx.createImageData(size, size);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = grain();
      const c = v > 0 ? 255 : 0;
      d[i] = c;
      d[i + 1] = c;
      d[i + 2] = c;
      d[i + 3] = Math.min(255, Math.abs(v) * 255);
    }
    ctx.putImageData(img, 0, 0);
    let url = "";
    let cancelled = false;
    canvas.toBlob((blob) => {
      if (!blob || cancelled) return;
      url = URL.createObjectURL(blob);
      el.style.backgroundImage = `url(${url})`;
      el.style.backgroundSize = `${TILE}px ${TILE}px`;
    }, "image/png");
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  return (
    // Sits behind the content as background texture; text and media stay crisp
    <div aria-hidden className="-z-[2] fixed inset-0 overflow-hidden pointer-events-none opacity-[0.09] dark:opacity-[0.12]">
      <div
        ref={ref}
        className="absolute -inset-[256px] [image-rendering:pixelated] will-change-transform motion-safe:[animation:grainShift_0.5s_steps(1)_infinite]"
      />
    </div>
  );
}
