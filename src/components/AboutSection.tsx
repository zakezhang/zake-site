"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { about } from "@/lib/content";
import { cn } from "@/lib/utils";
import {
  BeltIcon,
  FilmIcon,
  MountainIcon,
  WaveIcon,
} from "@/components/icons";

/* Hand-drawn "Zake" signature, stroke-drawn on scroll into view */
function Signature({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 320 160"
      fill="none"
      aria-hidden
      className="svg-sign -top-[3%] -left-[8%] absolute z-10 w-3/4 pointer-events-none text-white mix-blend-difference"
    >
      <path
        d="M28 38 C70 22 118 20 128 30 C136 38 96 54 74 78 C56 98 48 116 62 122 C84 131 122 96 150 78 C166 68 176 70 170 84 C164 98 158 112 168 114 C180 116 196 92 208 80 C216 72 224 74 222 84 C220 96 218 110 228 110 C242 110 252 84 268 72 C280 63 294 66 292 78"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: active ? 0 : 1,
          transition: "stroke-dashoffset 1.4s var(--cubic-66)",
        }}
      />
    </svg>
  );
}

const FACET_ICONS = {
  mountain: MountainIcon,
  belt: BeltIcon,
  wave: WaveIcon,
  film: FilmIcon,
} as const;

const linkCls =
  "inline text-l1 underline underline-offset-[0.08em] decoration-solid decoration-l3 hover:decoration-l1 transition-[text-decoration-color] duration-150";

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-12 px-4 lg:px-14 py-18 lg:py-24 lg:pb-28 w-full">
      <div ref={ref} className="relative col-span-12 sm:col-span-4 lg:col-span-3 p-2">
        <Signature active={seen} />
        <div className="relative aspect-square overflow-hidden border border-line bg-be">
          <Image
            src={about.portrait}
            alt="Portrait of Zake Zhang"
            fill
            sizes="(min-width: 1024px) 25vw, 100vw"
            // Native lazy-loading misfires inside the fixed inner scroll container
            loading="eager"
            className="object-cover"
          />
          <span className="absolute bottom-2 left-2 font-mono-2 text-xs uppercase text-white mix-blend-difference">
            {about.portraitNote}
          </span>
        </div>
        <ul className="mt-4 space-y-2">
          {about.facets.map((facet) => {
            const Icon = FACET_ICONS[facet.icon as keyof typeof FACET_ICONS];
            return (
              <li
                key={facet.label}
                className="flex items-center gap-2 font-mono-2 text-xs uppercase text-l2"
              >
                <Icon className="size-4 shrink-0 text-l3" />
                {facet.label}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col justify-start items-start gap-6 col-span-12 sm:col-span-7 sm:col-start-6 lg:col-span-8 lg:col-start-5 mt-10 sm:mt-0">
        <p className="p-2 w-full text-l1 md:text-[4.2svw] text-xl leading-[1.3] md:leading-none select-text">
          {about.lead}
        </p>
        <p className="p-2 w-full text-l2 md:text-[4.2svw] text-xl leading-[1.3] md:leading-none select-text">
          {about.body.map((part, i) =>
            part.href ? (
              <a
                key={i}
                href={part.href}
                target={part.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className={cn(linkCls)}
              >
                {part.text}
              </a>
            ) : (
              <span key={i}>{part.text}</span>
            ),
          )}
        </p>
      </div>
    </div>
  );
}
