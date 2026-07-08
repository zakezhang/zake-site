"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Apple-style frosted lip pinned to the bottom of the viewport: incoming
 * content rises through a soft blur + fade instead of appearing abruptly.
 * Hides itself once the scroll container reaches the very end.
 */
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
        "z-40 fixed inset-x-0 bottom-0 h-24 lg:h-32 pointer-events-none transition-opacity duration-500",
        atEnd ? "opacity-0" : "opacity-100",
      )}
      style={{
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        maskImage:
          "linear-gradient(to top, black 0%, black 30%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to top, black 0%, black 30%, transparent 100%)",
        background:
          "linear-gradient(to top, rgb(var(--background-deep) / 0.6), transparent)",
      }}
    />
  );
}
