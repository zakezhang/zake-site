"use client";

import type { ReactNode } from "react";
import { hero } from "@/lib/content";
import {
  BeltIcon,
  FilmIcon,
  MountainIcon,
  WaveIcon,
} from "@/components/icons";

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

export function HeroSection({
  toy,
}: {
  /** an interactive object living in the empty right half of the hero */
  toy?: ReactNode;
}) {
  return (
    <div
      id="hero"
      className="relative grid grid-cols-12 grid-rows-[auto_1fr] px-4 lg:px-14 py-18 lg:py-24 w-full min-h-dvh snap-start snap-always"
    >
      {toy && (
        <div className="hidden lg:flex absolute z-10 right-14 xl:right-24 top-[24%] bottom-[12%] w-[38%] items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">{toy}</div>
        </div>
      )}
      <div
        data-barrel
        className="flex flex-col order-2 lg:order-1 lg:grid lg:grid-cols-12 col-span-12 font-mono text-base [animation:hsstFadeIn_.9s_.3s_both]"
      >
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
      <div
        data-barrel
        className="flex flex-col self-end order-1 lg:order-2 col-span-12 px-2 font-bold text-[13svw] lg:text-[9svw] leading-[0.98] tracking-tight"
      >
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
