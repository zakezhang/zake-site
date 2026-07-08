"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fades + lifts its children into place when they scroll into view. Observes
 * against the fixed inner scroll container (`.no-scrollbar`), not the window.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const root = el.closest(".no-scrollbar");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { root: root ?? null, rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-[opacity,transform,filter] duration-[900ms] ease-66 will-change-transform motion-reduce:transition-none",
        shown
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-8 blur-[6px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
