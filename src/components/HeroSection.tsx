"use client";

import { hero } from "@/lib/content";
import { HeroCanvas } from "@/components/HeroCanvas";
import {
  BeltIcon,
  FilmIcon,
  MountainIcon,
  WaveIcon,
} from "@/components/icons";

/* Slow-spinning circular stamp — the page's wax seal */
function RotatingSeal() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-8 lg:right-20 top-[46%] lg:top-[42%] size-24 lg:size-32 text-l2"
    >
      <svg
        viewBox="0 0 100 100"
        className="size-full [animation:rtSpin_18s_linear_infinite] motion-reduce:animate-none"
      >
        <defs>
          <path
            id="seal-circle"
            d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0"
          />
        </defs>
        <text
          className="font-mono-2 uppercase"
          fontSize="7.6"
          letterSpacing="0.4"
          fill="currentColor"
        >
          <textPath href="#seal-circle">{hero.seal}</textPath>
        </text>
      </svg>
      <MountainIcon className="absolute left-1/2 top-1/2 size-6 lg:size-7 -translate-x-1/2 -translate-y-1/2 text-l1" />
    </div>
  );
}

function RevealLine({
  text,
  delay,
  highlight,
}: {
  text: string;
  delay: number;
  highlight?: boolean;
}) {
  return (
    <span className="block overflow-hidden">
      <span
        className="block [animation:lineReveal_.7s_var(--ease-66)_both]"
        style={{ animationDelay: `${delay}ms` }}
      >
        {highlight ? (
          <span className="inline-block w-fit bg-selection px-[0.08em] text-black">
            {text}
          </span>
        ) : (
          text
        )}
      </span>
    </span>
  );
}

export function HeroSection() {
  return (
    <div
      id="hero"
      className="relative grid grid-cols-12 grid-rows-[auto_1fr] px-4 lg:px-14 py-18 lg:py-24 w-full min-h-dvh snap-start"
    >
      <HeroCanvas />
      <RotatingSeal />
      <div className="flex flex-col order-2 lg:order-1 lg:grid lg:grid-cols-12 col-span-12 font-mono text-base [animation:hsstFadeIn_.9s_.3s_both]">
        <span className="hidden lg:block lg:col-span-3 xl:col-span-2 lg:col-start-1 xl:col-start-1 p-2 font-sans">
          {hero.discipline[0]}
          <br />
          {hero.discipline[1]}
          <span className="mt-4 flex items-center gap-3 text-l3">
            <MountainIcon className="size-4" />
            <BeltIcon className="size-4" />
            <WaveIcon className="size-4" />
            <FilmIcon className="size-4" />
          </span>
        </span>
        <span className="hidden lg:block lg:col-span-3 xl:col-span-2 lg:col-start-4 xl:col-start-5 p-2 text-balance text-l2">
          {hero.tagline}
        </span>
        <span className="col-span-12 lg:col-span-6 xl:col-span-4 lg:col-start-7 xl:col-start-9 mt-auto lg:mt-0 p-2 text-l2">
          {hero.bio.before}
          <a
            href={hero.bio.link.href}
            target="_blank"
            rel="noreferrer"
            className="text-l1 underline underline-offset-[0.08em] decoration-solid decoration-l3 hover:decoration-l1 transition-[text-decoration-color] duration-150"
          >
            {hero.bio.link.label}
          </a>
          {hero.bio.after}
        </span>
      </div>
      <div className="flex flex-col self-end order-1 lg:order-2 col-span-12 px-2 font-bold text-[13svw] lg:text-[9svw] leading-[0.98] tracking-tight">
        {hero.display.map((line, i) => (
          <RevealLine
            key={line.text}
            text={line.text}
            highlight={line.highlight}
            delay={120 + i * 70}
          />
        ))}
      </div>
    </div>
  );
}
