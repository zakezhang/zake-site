"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

const AMBIENT_SRC = "/audio/ambient.m4a";
const AMBIENT_VOLUME = 0.45;

type ThemeMode = "system" | "light" | "dark";

const THEME_ORDER: ThemeMode[] = ["system", "light", "dark"];
const THEME_LABEL: Record<ThemeMode, string> = {
  system: "A",
  light: "L",
  dark: "D",
};

/* Dotted selection-box hover, the site's signature affordance */
const boxHover =
  "relative p-2 before:content-[''] before:absolute before:inset-0 before:border-2 before:border-dotted before:border-transparent before:pointer-events-none lg:hover:before:border-l1";

function applyTheme(mode: ThemeMode) {
  const dark =
    mode === "dark" ||
    (mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

function useClock() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const cn = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Shanghai",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);
      setTime(cn);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function Clock({ time }: { time: string }) {
  const [hh, mm] = time.split(":");
  return (
    <span className="tabular-nums">
      {hh}
      <span className="[animation:ltBlink_1s_steps(1)_infinite]">:</span>
      {mm}
    </span>
  );
}

export function SiteHeader() {
  const time = useClock();
  const [coords, setCoords] = useState({ x: 1, y: 1 });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";
    const stored = localStorage.getItem("theme") as ThemeMode | null;
    return stored && THEME_ORDER.includes(stored) ? stored : "system";
  });

  // `sound` mirrors the <audio> element's real playback state
  const [sound, setSound] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = AMBIENT_VOLUME;

    // Try instant autoplay; when the browser blocks it, start on the
    // visitor's first gesture instead
    const events = ["pointerdown", "keydown", "touchstart", "wheel"] as const;
    const onFirstGesture = () => {
      cleanup();
      void audio.play().catch(() => {});
    };
    const cleanup = () =>
      events.forEach((e) => window.removeEventListener(e, onFirstGesture));

    audio.play().catch(() => {
      events.forEach((e) =>
        window.addEventListener(e, onFirstGesture, { passive: true }),
      );
    });
    return cleanup;
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play().catch(() => {});
    else audio.pause();
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) =>
      setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const cycleTheme = () => {
    const next =
      THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length];
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const pad = (n: number) => String(Math.max(0, n)).padStart(4, "0");

  return (
    <header className="z-50 fixed inset-0 flex flex-col justify-between font-mono-2 pointer-events-none text-base">
      <audio
        ref={audioRef}
        src={AMBIENT_SRC}
        loop
        preload="auto"
        onPlay={() => setSound(true)}
        onPause={() => setSound(false)}
      />
      <div className="flex justify-between items-center px-4 lg:px-14 py-4 lg:py-7">
        <Link href="/" className={cn(boxHover, "pointer-events-auto")}>
          <span>{site.logo.head}</span>
          <span className="text-l2">{site.logo.tail}</span>
        </Link>
        <div className="hidden lg:flex flex-wrap justify-between items-center gap-x-3 gap-y-2 pointer-events-auto">
          <button className={cn(boxHover, "uppercase cursor-pointer")} onClick={() => scrollTo("work")}>
            Work
          </button>
          <button className={cn(boxHover, "uppercase cursor-pointer")} onClick={() => scrollTo("contact")}>
            Contact
          </button>
          <button
            className={cn(boxHover, "uppercase cursor-pointer")}
            aria-label={`Theme: ${theme}`}
            onClick={cycleTheme}
            suppressHydrationWarning
          >
            THEME[{THEME_LABEL[theme]}]
          </button>
          <button
            className={cn(boxHover, "uppercase cursor-pointer")}
            aria-label={sound ? "Sound playing, click to pause" : "Sound paused, click to play"}
            onClick={toggleSound}
          >
            SOUND[
            <span
              className={cn(
                "inline-block",
                sound && "[animation:rtSpin_2s_linear_infinite]",
              )}
            >
              {sound ? "|" : "-"}
            </span>
            ]
          </button>
        </div>
      </div>
      <div className="flex justify-between px-4 lg:px-14 py-4 lg:py-7">
        <span className="lg:hidden p-2 uppercase">
          <Clock time={time} />
        </span>
        <span className="hidden lg:inline p-2 uppercase">
          {site.clockPrefix} <Clock time={time} />
        </span>
        <span className={cn(boxHover, "pointer-events-auto tabular-nums")}>
          {pad(coords.x)} X {pad(coords.y)} Y
        </span>
      </div>
    </header>
  );
}
