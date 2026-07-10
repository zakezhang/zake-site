"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { introFilm } from "@/lib/content";
import { cn } from "@/lib/utils";

type Source = "yt" | "bili";

export interface FilmCardProps {
  title: string;
  cover: string;
  ytId: string;
  bvid: string;
  badge: string;
  className?: string;
}

/** Click-to-play film card with a YouTube/Bilibili source toggle,
 *  defaulting to whichever player the visitor's region can reach. */
export function FilmCard({
  title,
  cover,
  ytId,
  bvid,
  badge,
  className,
}: FilmCardProps) {
  const [playing, setPlaying] = useState(false);
  const [source, setSource] = useState<Source>("yt");

  // Deferred a frame so SSR markup and hydration stay consistent
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === "Asia/Shanghai" || tz === "Asia/Urumqi") setSource("bili");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const embeds: Record<Source, string> = {
    yt: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`,
    bili: `https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=1&high_quality=1&danmaku=0`,
  };

  return (
    <article className={className}>
      <div className="block space-y-3 p-2">
        <div className="relative w-full select-none">
          <span className="top-0 right-0 z-10 absolute bg-selection px-1 font-mono-2 text-black text-xs lg:text-sm">
            {badge}
          </span>
          <div className="relative aspect-video overflow-hidden border border-line bg-be">
            {playing ? (
              <iframe
                src={embeds[source]}
                title={title}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                aria-label={`Play ${title}`}
                onClick={() => setPlaying(true)}
                className="group/play block h-full w-full cursor-pointer"
              >
                <Image
                  src={cover}
                  alt={title}
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  loading="eager"
                  className="object-cover transition-transform duration-700 ease-66 group-hover/play:scale-[1.02]"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-16 lg:size-20 items-center justify-center rounded-full border-2 border-white/80 bg-black/30 backdrop-blur-sm transition-transform duration-500 ease-66 group-hover/play:scale-110">
                    <span
                      aria-hidden
                      className="ml-1 block size-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white"
                    />
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center gap-3 min-w-0 text-xs lg:text-sm uppercase">
          <span className="flex-1 min-w-0 truncate">{title} — Zake Zhang</span>
          <div className="flex items-center gap-3 font-mono-2 whitespace-nowrap shrink-0">
            {(["yt", "bili"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSource(key)}
                className={cn(
                  "uppercase cursor-pointer transition-colors duration-150",
                  source === key ? "text-l1" : "text-l3 hover:text-l2",
                )}
              >
                [{key === "yt" ? "YouTube" : "Bilibili"}]
              </button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function IntroFilm() {
  return (
    <FilmCard
      title={introFilm.title}
      cover={introFilm.cover}
      ytId={introFilm.ytId}
      bvid={introFilm.bvid}
      badge="Intro Film"
      className="col-span-12 lg:col-span-8 lg:col-start-3"
    />
  );
}
