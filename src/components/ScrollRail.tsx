"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Right-edge progress rail: a hairline track with one square dot per
 * section (placed at its true scroll fraction), a lime thumb tracking the
 * live position, and the active section's name written vertically above.
 */
const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "cta", label: "Motto" },
  { id: "contact", label: "Contact" },
];

interface Stop {
  id: string;
  label: string;
  fraction: number;
  top: number;
}

export function ScrollRail() {
  const [progress, setProgress] = useState(0);
  const [stops, setStops] = useState<Stop[]>([]);
  const [active, setActive] = useState("Intro");
  const ticking = useRef(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".no-scrollbar");
    if (!root) return;

    let current: Stop[] = [];
    const measure = () => {
      const max = root.scrollHeight - root.clientHeight;
      const rootTop = root.getBoundingClientRect().top;
      current = SECTIONS.flatMap(({ id, label }) => {
        const el = document.getElementById(id);
        if (!el) return [];
        const top = el.getBoundingClientRect().top - rootTop + root.scrollTop;
        return [{ id, label, top, fraction: Math.min(1, Math.max(0, top / max)) }];
      });
      setStops(current);
    };

    const update = () => {
      ticking.current = false;
      const max = root.scrollHeight - root.clientHeight;
      const p = max > 0 ? root.scrollTop / max : 0;
      setProgress(p);
      const mid = root.scrollTop + root.clientHeight * 0.4;
      const hit = [...current].reverse().find((s) => s.top <= mid);
      if (hit) setActive(hit.label);
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    measure();
    update();
    root.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
    ro.observe(root.firstElementChild ?? root);
    return () => {
      root.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="z-40 fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 font-mono-2 pointer-events-none">
      <span className="text-[10px] uppercase tracking-widest text-l3 [writing-mode:vertical-rl]">
        {active}
      </span>
      <div className="relative w-px h-[38svh] bg-line pointer-events-auto">
        <div
          className="absolute left-0 top-0 w-px bg-l2"
          style={{ height: `${progress * 100}%` }}
        />
        {stops.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Scroll to ${s.label}`}
            title={s.label}
            onClick={() =>
              document
                .getElementById(s.id)
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className={cn(
              "absolute -left-[2.5px] size-1.5 cursor-pointer border transition-colors duration-300",
              active === s.label
                ? "border-transparent bg-selection"
                : "border-l3 bg-b1 hover:bg-l2",
            )}
            style={{ top: `calc(${s.fraction * 100}% - 3px)` }}
          />
        ))}
        <div
          aria-hidden
          className="absolute -left-[2.5px] size-1.5 bg-l1"
          style={{ top: `calc(${progress * 100}% - 3px)` }}
        />
      </div>
    </div>
  );
}
