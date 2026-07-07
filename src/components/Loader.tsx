"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Loader() {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const DURATION = 900;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // cubic-bezier(.66,0,.01,1) approximated for the fill
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased * 100);
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setLeaving(true);
        setTimeout(() => setGone(true), 500);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;

  return (
    <div
      className={cn(
        "left-1/2 top-1/2 z-40 fixed flex h-4 w-[140px] -translate-x-1/2 -translate-y-1/2 items-center",
        leaving && "[animation:hsstFadeOut_.5s_both]",
      )}
    >
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-l3">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-l1"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
