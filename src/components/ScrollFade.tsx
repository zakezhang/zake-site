"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Apple-style progressive glass pinned to the bottom of the viewport,
 * alive only while content is in motion. Blur radius doubles layer by
 * layer with rising saturation for the through-glass feel.
 *
 * The show/hide fade lives on each layer, never on the wrapper: a parent
 * with animated opacity forms a compositing group that silently disables
 * children's backdrop-filter, which reads as the blur "popping" off.
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
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".no-scrollbar");
    if (!root) return;
    let idleTimer = 0;
    const onScroll = () => {
      const remaining = root.scrollHeight - root.scrollTop - root.clientHeight;
      setAtEnd(remaining < 24);
      // the glass only exists while content is in motion
      setScrolling(true);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setScrolling(false), 200);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(idleTimer);
      root.removeEventListener("scroll", onScroll);
    };
  }, []);

  const shown = scrolling && !atEnd;
  const fadeCls = cn(
    "absolute inset-0 transition-opacity ease-out",
    shown ? "opacity-100 duration-300" : "opacity-0 duration-700",
  );

  return (
    <div
      aria-hidden
      className="z-40 fixed inset-x-0 bottom-0 h-28 lg:h-40 pointer-events-none"
    >
      {Array.from({ length: STEPS }, (_, i) => (
        <div key={i} className={fadeCls} style={layerStyle(i)} />
      ))}
      {/* a whisper of surface tint toward the edge */}
      <div
        className={fadeCls}
        style={{
          background:
            "linear-gradient(to bottom, transparent 30%, rgba(var(--label-d), 0.03) 70%, rgba(var(--background-deep), 0.35) 100%)",
        }}
      />
    </div>
  );
}
