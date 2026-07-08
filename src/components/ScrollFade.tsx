"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Apple-style progressive glass pinned to the bottom of the viewport.
 * A single blur reads as a hard band, so this stacks masked layers whose
 * blur radius doubles step by step — the material gets denser toward the
 * edge — while rising saturation gives the refraction-through-glass feel.
 * Hides itself once the scroll container reaches the very end.
 */
const STEPS = 6;

function layerStyle(i: number): React.CSSProperties {
  const blur = 0.5 * 2 ** i; // 0.5 → 16px
  // each layer fades in a little lower than the previous one
  const start = (i / STEPS) * 78;
  const full = Math.min(100, start + 34);
  const mask = `linear-gradient(to bottom, transparent ${start}%, black ${full}%)`;
  return {
    backdropFilter: `blur(${blur}px) saturate(${1 + i * 0.09})`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${1 + i * 0.09})`,
    maskImage: mask,
    WebkitMaskImage: mask,
  };
}

export function ScrollFade() {
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".no-scrollbar");
    if (!root) return;
    const onScroll = () => {
      const remaining = root.scrollHeight - root.scrollTop - root.clientHeight;
      setAtEnd(remaining < 24);
    };
    onScroll();
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className={cn(
        "z-40 fixed inset-x-0 bottom-0 h-28 lg:h-40 pointer-events-none transition-opacity duration-700 ease-out",
        atEnd ? "opacity-0" : "opacity-100",
      )}
    >
      {Array.from({ length: STEPS }, (_, i) => (
        <div key={i} className="absolute inset-0" style={layerStyle(i)} />
      ))}
      {/* a whisper of surface tint toward the edge */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 30%, rgba(var(--label-d), 0.03) 70%, rgba(var(--background-deep), 0.35) 100%)",
        }}
      />
    </div>
  );
}
