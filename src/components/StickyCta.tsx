"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ctaGallery, stickyCta } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * "Life is a drug" as a scroll-scrubbed story in three eased phases:
 * a distant pile of photos is pulled close, then dealt like cards — one
 * by one, clockwise from the top-left — onto perimeter slots that tile
 * with minimal overlap, and only then does the motto pop through on the
 * topmost layer. Which photo lands on which slot is reshuffled on every
 * page load; native aspect ratios are always preserved. Photos live on a fixed layer that persists over the
 * footer, stay draggable, and a clean click (not a drag) opens a
 * lightbox with swipe / arrow-key navigation.
 */

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
/* cubic ease-in-out: slow start, brisk middle, slow settle */
const easeInOut = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const backOut = (t: number) => {
  const x = clamp01(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

interface Pose {
  /** start scatter, as fractions of stage size */
  sxF: number;
  syF: number;
  sr: number;
  /** perimeter slot destination, as fractions of stage size */
  exF: number;
  eyF: number;
  er: number;
  /** dealing order: clockwise around the ring from the top-left corner */
  rank: number;
}

/* dealt cards launch fast and decelerate into their slot */
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

/** tailwind width utility → px, honouring the lg: variant on wide screens */
function frameWidthPx(frame: string, vw: number): number {
  const m = frame.match(vw >= 1024 ? /lg:w-(\d+)/ : /(?:^|\s)w-(\d+)/);
  return m ? parseInt(m[1], 10) * 4 : 160;
}

/** Perimeter slots dealt clockwise from the top-left; which photo lands
 *  on which slot is reshuffled every load, with light jitter. */
function buildLayout(n: number, vw: number, vh: number): Pose[] {
  // Even CENTRE spacing reads uneven — tall photos overlap their neighbours
  // while short ones leave holes. Instead each side is justified like a line
  // of text: real photo extents with equal edge-to-edge gaps. Wide/square
  // photos are reserved for the four corners and the side columns so the
  // columns always fit between the rows.
  const rightN = 2;
  const leftN = 2;
  const topN = Math.floor((n - rightN - leftN) / 2);
  const bottomN = n - rightN - leftN - topN;

  const w = ctaGallery.map((g) => frameWidthPx(g.frame, vw));
  const ratio = ctaGallery.map((g) => {
    const [aw, ah] = g.ar.split("/").map((v) => parseFloat(v));
    return aw / ah;
  });
  const h = w.map((pw, i) => pw / ratio[i]);

  const photoAt = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [photoAt[i], photoAt[j]] = [photoAt[j], photoAt[i]];
  }
  // ranks that need a wide/square photo: the four corners + both columns
  const cTL = 0;
  const cTR = topN - 1;
  const cBR = topN + rightN;
  const cBL = topN + rightN + bottomN - 1;
  const needShort = new Set([cTL, cTR, cBR, cBL]);
  for (let k = topN; k < topN + rightN; k++) needShort.add(k);
  for (let k = topN + rightN + bottomN; k < n; k++) needShort.add(k);
  needShort.forEach((rank) => {
    if (ratio[photoAt[rank]] >= 0.9) return;
    for (let d = 0; d < n; d++) {
      if (!needShort.has(d) && ratio[photoAt[d]] >= 0.9) {
        [photoAt[rank], photoAt[d]] = [photoAt[d], photoAt[rank]];
        break;
      }
    }
  });

  const XM = 0.435 * vw; // frame edge left/right of centre
  const YROW = 0.325 * vh; // row centre line
  const G = 18; // corner breathing room

  const slots: { x: number; y: number }[] = new Array(n);
  const range = (from: number, count: number) =>
    Array.from({ length: count }, (_, k) => from + k);
  const justifyRow = (ranks: number[], y: number, dir: 1 | -1) => {
    const total = ranks.reduce((s, r) => s + w[photoAt[r]], 0);
    const gap = ranks.length > 1 ? (2 * XM - total) / (ranks.length - 1) : 0;
    let cursor = -dir * XM;
    for (const r of ranks) {
      const pw = w[photoAt[r]];
      slots[r] = { x: cursor + (dir * pw) / 2, y };
      cursor += dir * (pw + gap);
    }
  };
  const justifyCol = (
    ranks: number[],
    edge: 1 | -1,
    fromY: number,
    toY: number,
    dir: 1 | -1,
  ) => {
    const total = ranks.reduce((s, r) => s + h[photoAt[r]], 0);
    const gap =
      ranks.length > 1
        ? (Math.abs(toY - fromY) - total) / (ranks.length - 1)
        : 0;
    let cursor =
      ranks.length > 1 ? fromY : (fromY + toY) / 2 - (dir * total) / 2;
    for (const r of ranks) {
      const ph = h[photoAt[r]];
      slots[r] = {
        x: edge * (XM - w[photoAt[r]] / 2),
        y: cursor + (dir * ph) / 2,
      };
      cursor += dir * (ph + gap);
    }
  };

  justifyRow(range(0, topN), -YROW, 1);
  justifyRow(range(topN + rightN, bottomN), YROW, -1);
  // columns are tucked between the rows' corner photos, never fighting them
  justifyCol(
    range(topN, rightN),
    1,
    -YROW + h[photoAt[cTR]] / 2 + G,
    YROW - h[photoAt[cBR]] / 2 - G,
    1,
  );
  justifyCol(
    range(topN + rightN + bottomN, leftN),
    -1,
    YROW - h[photoAt[cBL]] / 2 - G,
    -YROW + h[photoAt[cTL]] / 2 + G,
    -1,
  );

  const poses: Pose[] = new Array(n);
  slots.forEach((slot, rank) => {
    poses[photoAt[rank]] = {
      sxF: (Math.random() - 0.5) * 0.16,
      syF: (Math.random() - 0.5) * 0.14,
      sr: (Math.random() - 0.5) * 26,
      exF: (slot.x + (Math.random() - 0.5) * 12) / vw,
      eyF: (slot.y + (Math.random() - 0.5) * 10) / vh,
      er: (Math.random() - 0.5) * 10,
      rank,
    };
  });
  return poses;
}

function Lightbox({
  index,
  onNav,
  onClose,
}: {
  index: number;
  onNav: (dir: number) => void;
  onClose: () => void;
}) {
  const photo = ctaGallery[index];
  const gesture = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNav(1);
      else if (e.key === "ArrowLeft") onNav(-1);
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNav, onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-black/85 backdrop-blur-md cursor-zoom-out select-none touch-none [animation:hsstFadeIn_.25s_both]"
      onPointerDown={(e) => {
        gesture.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const g = gesture.current;
        gesture.current = null;
        if (!g || (e.target as HTMLElement).closest("button")) return;
        const dx = e.clientX - g.x;
        const dy = e.clientY - g.y;
        // horizontal swipe switches, a still click returns to the page
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
          onNav(dx < 0 ? 1 : -1);
        } else if (Math.hypot(dx, dy) < 8) {
          onClose();
        }
      }}
    >
      <div className="relative w-[88vw] h-[72svh]">
        <Image
          key={photo.src}
          src={photo.src}
          alt=""
          fill
          sizes="88vw"
          priority
          draggable={false}
          className="object-contain"
        />
      </div>
      <div className="flex items-center gap-5 font-mono-2 text-xs lg:text-sm uppercase text-white/75">
        <button
          type="button"
          className="cursor-pointer hover:text-white"
          onClick={() => onNav(-1)}
        >
          [←]
        </button>
        <span className="tabular-nums">
          {String(index + 1).padStart(2, "0")} / {ctaGallery.length}
        </span>
        <button
          type="button"
          className="cursor-pointer hover:text-white"
          onClick={() => onNav(1)}
        >
          [→]
        </button>
        <button
          type="button"
          className="cursor-pointer hover:text-white"
          onClick={onClose}
        >
          [Close]
        </button>
      </div>
    </div>
  );
}

export function StickyCta() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mottoRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layout = useRef<Pose[] | null>(null);
  const drags = useRef(ctaGallery.map(() => ({ x: 0, y: 0 })));
  const dragging = useRef<{
    i: number;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    moved: boolean;
  } | null>(null);
  const topZ = useRef(40);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const root = wrap?.closest(".no-scrollbar") as HTMLElement | null;
    if (!wrap || !root) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const n = ctaGallery.length;
    // reshuffled every load; z order follows departure order (top leaves first)
    layout.current = buildLayout(n, window.innerWidth, root.clientHeight);
    layout.current.forEach((pose, i) => {
      const el = photoRefs.current[i];
      if (el) el.style.zIndex = String(5 + n - pose.rank);
    });

    const SPREAD_START = 0.24;
    const WIN = 0.12;
    const step = n > 1 ? (0.58 - WIN) / (n - 1) : 0;

    let ticking = false;
    const render = () => {
      ticking = false;
      const vh = root.clientHeight;
      const rect = wrap.getBoundingClientRect();
      const runway = Math.max(1, rect.height - vh);
      const p = reduced ? 1 : clamp01(-rect.top / runway);
      const W = window.innerWidth;

      // the fixed layer only exists once the motto page starts entering,
      // then persists over the footer below
      const entry = reduced ? 1 : clamp01((vh - rect.top) / (vh * 0.35));
      const layer = layerRef.current;
      if (layer) {
        layer.style.opacity = String(entry);
        layer.style.visibility = entry > 0.02 ? "visible" : "hidden";
      }

      // phase 1 — the pile is pulled close: everything scales up together
      const zoomK = 0.55 + 0.45 * easeInOut(p / 0.18);

      photoRefs.current.forEach((el, i) => {
        const pose = layout.current?.[i];
        if (!el || !pose) return;
        // phase 2 — cards are dealt one by one, clockwise from top-left
        const bStart = SPREAD_START + pose.rank * step;
        const t = easeOut((p - bStart) / WIN);
        const sx = pose.sxF * W;
        const sy = pose.syF * vh;
        const ex = pose.exF * W;
        const ey = pose.eyF * vh;
        const d = drags.current[i];
        const x = sx * zoomK + (ex - sx) * t + d.x;
        const y = sy * zoomK + (ey - sy) * t + d.y;
        const r = pose.sr + (pose.er - pose.sr) * t;
        el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${r.toFixed(2)}deg) scale(${zoomK.toFixed(3)})`;
      });

      // phase 3 — the motto pops only after the last batch has cleared
      const mt = clamp01((p - 0.84) / 0.16);
      const motto = mottoRef.current;
      if (motto) {
        motto.style.opacity = String(clamp01(mt * 1.8));
        motto.style.transform = `scale(${(0.55 + backOut(mt) * 0.45).toFixed(3)})`;
      }
      if (legendRef.current) legendRef.current.style.opacity = String(mt);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(render);
    };

    // wheel events over the fixed photo layer would otherwise chain to the
    // (non-scrolling) root scroller — forward them to the page scroller
    const layer = layerRef.current;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // instant, or the container's scroll-smooth would swallow the tiny
      // high-frequency trackpad deltas into perpetually restarted animations
      root.scrollBy({ top: e.deltaY, behavior: "instant" });
    };
    layer?.addEventListener("wheel", onWheel, { passive: false });

    render();
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      layer?.removeEventListener("wheel", onWheel);
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const requestRender = () => {
    // re-apply poses after a drag delta without waiting for a scroll tick
    const wrap = wrapRef.current;
    const root = wrap?.closest(".no-scrollbar") as HTMLElement | null;
    if (root) root.dispatchEvent(new Event("scroll"));
  };

  const nav = useCallback((dir: number) => {
    setLightbox((cur) =>
      cur === null ? cur : (cur + dir + ctaGallery.length) % ctaGallery.length,
    );
  }, []);
  const close = useCallback(() => setLightbox(null), []);

  return (
    <div
      id="cta"
      ref={wrapRef}
      className="relative h-[650vh] text-l1 snap-start snap-always"
    >
      {/* the motto page — scrolls away once the runway ends; sits above the
          fixed photo layer so the motto is never covered, and passes all
          pointer events through to the draggable photos beneath */}
      <div className="sticky top-0 z-30 h-dvh overflow-hidden pointer-events-none">
        {/* motto stays on the topmost layer, above every photo */}
        <div
          ref={mottoRef}
          className="absolute inset-0 z-20 grid place-items-center pointer-events-none opacity-0"
        >
          <div className="flex flex-col items-center font-bold text-[9svw] leading-[1.05] uppercase">
            {stickyCta.motto.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <span className="mt-8 font-mono-2 font-normal text-xs lg:text-sm uppercase tracking-wide text-l3">
              {stickyCta.routes}
            </span>
          </div>
        </div>

        {/* topo-map legend of summited peaks */}
        <div
          ref={legendRef}
          aria-hidden
          className="absolute left-4 lg:left-14 bottom-28 space-y-1.5 font-mono-2 text-xs uppercase text-l4 pointer-events-none opacity-0"
        >
          {stickyCta.peaks.map((peak) => (
            <div key={peak.name}>
              ▲ {peak.name} — {peak.alt}
            </div>
          ))}
        </div>
      </div>

      {/* fixed photo layer: keeps the spread arrangement while the motto
          page leaves and the footer rolls up beneath it */}
      <div
        ref={layerRef}
        className="fixed inset-0 z-[15] overflow-hidden pointer-events-none opacity-0 invisible"
      >
        {ctaGallery.map((photo, i) => (
          <div
            key={photo.src}
            ref={(el) => {
              photoRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 pointer-events-auto touch-none select-none cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => {
              e.preventDefault();
              const el = e.currentTarget;
              el.setPointerCapture(e.pointerId);
              dragging.current = {
                i,
                startX: e.clientX,
                startY: e.clientY,
                baseX: drags.current[i].x,
                baseY: drags.current[i].y,
                moved: false,
              };
            }}
            onPointerMove={(e) => {
              const d = dragging.current;
              if (!d || d.i !== i) return;
              const dx = e.clientX - d.startX;
              const dy = e.clientY - d.startY;
              if (!d.moved && Math.hypot(dx, dy) < 6) return;
              if (!d.moved) {
                d.moved = true;
                const el = photoRefs.current[i];
                if (el) el.style.zIndex = String(++topZ.current);
              }
              drags.current[i] = { x: d.baseX + dx, y: d.baseY + dy };
              requestRender();
            }}
            onPointerUp={() => {
              const d = dragging.current;
              dragging.current = null;
              // a still click — no drag — opens the lightbox
              if (d && d.i === i && !d.moved) setLightbox(i);
            }}
            onPointerCancel={() => {
              dragging.current = null;
            }}
          >
            {/* frameless: bare photo with a deeper shadow */}
            <div
              className={cn(
                "shadow-[0_12px_44px_rgba(0,0,0,0.4)]",
                photo.frame,
              )}
            >
              <div
                className="relative overflow-hidden bg-neutral-200"
                style={{ aspectRatio: photo.ar }}
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="25vw"
                  loading="eager"
                  draggable={false}
                  className="object-cover pointer-events-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <Lightbox index={lightbox} onNav={nav} onClose={close} />
      )}
    </div>
  );
}
