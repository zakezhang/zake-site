"use client";

import { useEffect, useRef, useState } from "react";
import { FACETS, cropRect, lumaGrid, type Facet } from "@/components/toys/facets";
import { ctaGallery } from "@/lib/content";

const S = 272; // cube edge, CSS px
const PERSP = 1100;
/* the front face sits S/2 closer to the viewer, so it renders larger than S */
const F = Math.round((S * PERSP) / (PERSP - S / 2));
const TEXT_H = 92;
const COLS = 24;
const ROWS = 24;
const RAMP = " .,:;-=+*#%@";
const NOISE = "01<>/{}[]=+*#%@$&";
const TURN_MS = 1150;
const AUTO_MS = 4200;
const GLYPH_ZOOM = 1.6;
const SQUARE_MS = 950; // hover: ease the cube square-on
const OPEN_MS = 520; // then fade the card up over the face
const CLOSE_MS = 320;
const REVEAL_MS = 1050; // runs alongside the turn, finishing just after it
const ZOOM_OUT_MS = 1000;
const PAINT_MS = 33; // glyph drift is slow: repaint the canvases at ~30fps, rotate at full rate

/* the four facets are fixed; the other two sides are drawn at random from
   the photo gallery (the motto page) on every visit */
const FIXED_PHOTOS = new Set(FACETS.map((f) => f.photo.split("/").pop()?.split("-")[0]));
const GALLERY_NOTES: Record<string, { title: string; stat: string; line: string; accent?: string }> = {
  g01: { title: "On the Trail", stat: "KUNGSLEDEN — 110KM", line: "Packed, laced, and heading north" },
  g03: { title: "On the Road", stat: "FIELD NOTES", line: "Strangers who became a group photo" },
  g04: { title: "Keynote", stat: "ONEPLUS — LAUNCH STAGE", line: "Telling the imaging story on stage" },
  g06: { title: "Archery", stat: "DRAW — ANCHOR — RELEASE", line: "Stillness at full draw" },
  g07: { title: "Cold", stat: "ABOVE THE SNOWLINE", line: "Wrapped up, waiting out the wind" },
  g08: { title: "Mont Blanc", stat: "MONT BLANC — 4810M", line: "A rest with the whole massif in view", accent: "255,107,53" },
  g09: { title: "Tre Cime", stat: "TRE CIME — DOLOMITES", line: "Three peaks framed by a cave mouth", accent: "255,107,53" },
  g10: { title: "Portrait", stat: "ZAKE ZHANG", line: "Black, white, and paying attention" },
  g11: { title: "Home", stat: "OFF DUTY", line: "The best kind of rest day" },
  g12: { title: "Night Push", stat: "SUMMIT DAY — BEFORE DAWN", line: "Headlamp on, one step at a time", accent: "255,107,53" },
  g13: { title: "On the Mat", stat: "BJJ — COMPETITION", line: "Grips first, then patience", accent: "79,124,255" },
  g14: { title: "Training Partners", stat: "BJJ — THE TEAM", line: "Every roll is a conversation", accent: "79,124,255" },
  g15: { title: "Summit", stat: "MUZTAGH ATA — 7546M", line: "Name on the banner, top of the Pamirs", accent: "255,107,53" },
  g17: { title: "Snow Summit", stat: "SUMMIT MARKER", line: "Crampons on, thumbs up", accent: "255,107,53" },
  g18: { title: "Medal", stat: "BJJ — PODIUM", line: "Another one for the shelf", accent: "79,124,255" },
  g19: { title: "Lakeside", stat: "SLOW DAYS", line: "Lying in the grass after the trek" },
};
const GALLERY: Facet[] = ctaGallery
  .map((g) => ({ src: g.src, key: g.src.split("/").pop()?.split("-")[0] ?? "" }))
  .filter((g) => GALLERY_NOTES[g.key] && !FIXED_PHOTOS.has(g.key))
  .map((g, i) => ({
    id: g.key,
    index: String(i + 5).padStart(2, "0"),
    title: GALLERY_NOTES[g.key].title,
    stat: GALLERY_NOTES[g.key].stat,
    lines: [GALLERY_NOTES[g.key].line],
    photo: g.src,
    focus: [0.5, 0.45] as [number, number],
    accent: GALLERY_NOTES[g.key].accent ?? "128,128,118",
  }));
const pickTwo = () => {
  const pool = [...GALLERY];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 2);
};
const N = 6;

/* ---------- tiny rotation kit (CSS space: x right, y down, z toward viewer) */
type V3 = [number, number, number];
type M3 = number[]; // row-major 3x3
type Q = [number, number, number, number]; // x y z w

const mul = (a: M3, b: M3): M3 => {
  const r: M3 = [];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) r.push(a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j]);
  return r;
};
const apply = (m: M3, v: V3): V3 => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
];
const rotX = (a: number): M3 => [1, 0, 0, 0, Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a)];
const rotY = (a: number): M3 => [Math.cos(a), 0, Math.sin(a), 0, 1, 0, -Math.sin(a), 0, Math.cos(a)];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

const toQ = (m: M3): Q => {
  const t = m[0] + m[4] + m[8];
  let x, y, z, w;
  if (t > 0) {
    const s = Math.sqrt(t + 1) * 2;
    w = s / 4; x = (m[7] - m[5]) / s; y = (m[2] - m[6]) / s; z = (m[3] - m[1]) / s;
  } else if (m[0] > m[4] && m[0] > m[8]) {
    const s = Math.sqrt(1 + m[0] - m[4] - m[8]) * 2;
    w = (m[7] - m[5]) / s; x = s / 4; y = (m[1] + m[3]) / s; z = (m[2] + m[6]) / s;
  } else if (m[4] > m[8]) {
    const s = Math.sqrt(1 + m[4] - m[0] - m[8]) * 2;
    w = (m[2] - m[6]) / s; x = (m[1] + m[3]) / s; y = s / 4; z = (m[5] + m[7]) / s;
  } else {
    const s = Math.sqrt(1 + m[8] - m[0] - m[4]) * 2;
    w = (m[3] - m[1]) / s; x = (m[2] + m[6]) / s; y = (m[5] + m[7]) / s; z = s / 4;
  }
  return [x, y, z, w];
};
const toM = ([x, y, z, w]: Q): M3 => [
  1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w),
  2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w),
  2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y),
];
const slerp = (a: Q, b: Q, t: number): Q => {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const bb: Q = d < 0 ? [-b[0], -b[1], -b[2], -b[3]] : b;
  d = Math.abs(d);
  if (d > 0.9995) {
    const r = a.map((v, i) => v + (bb[i] - v) * t) as Q;
    const l = Math.hypot(...r);
    return r.map((v) => v / l) as Q;
  }
  const th = Math.acos(d);
  const s = Math.sin(th);
  const wa = Math.sin((1 - t) * th) / s, wb = Math.sin(t * th) / s;
  return a.map((v, i) => v * wa + bb[i] * wb) as Q;
};

const SIDE_ROT: M3[] = [rotY(0), rotY(Math.PI / 2), rotY(Math.PI), rotY(-Math.PI / 2), rotX(Math.PI / 2), rotX(-Math.PI / 2)];
const SIDE_CSS = ["rotateY(0deg)", "rotateY(90deg)", "rotateY(180deg)", "rotateY(-90deg)", "rotateX(90deg)", "rotateX(-90deg)"];
const NORMAL = SIDE_ROT.map((m) => apply(m, [0, 0, 1]));
const UP = SIDE_ROT.map((m) => apply(m, [0, -1, 0]));

/** the orientation that shows side i upright, facing the viewer */
function upright(i: number): M3 {
  const n = NORMAL[i], u = UP[i];
  const r = cross(u, n).map((v) => -v) as V3;
  const B = [r, u, n];
  const A: V3[] = [[1, 0, 0], [0, -1, 0], [0, 0, 1]];
  const R: M3 = [];
  for (let i2 = 0; i2 < 3; i2++)
    for (let j = 0; j < 3; j++) R.push(A[0][i2] * B[0][j] + A[1][i2] * B[1][j] + A[2][i2] * B[2][j]);
  return R;
}
const frontOf = (m: M3) => {
  let best = 0, bz = -2;
  for (let i = 0; i < N; i++) {
    const z = apply(m, NORMAL[i])[2];
    if (z > bz) { bz = z; best = i; }
  }
  return best;
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/**
 * A cube typeset in code: every side is a photo rebuilt from drifting mono
 * characters. It tumbles on its own in any direction and can be dragged any
 * way. Hovering turns it square-on and unfolds the front side in place into
 * a card: the characters resolve cell by cell into the colour photo, and
 * the caption slides out beneath.
 */
export function CodeCube() {
  const cubeRef = useRef<HTMLDivElement>(null);
  const faceRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardTextRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const hoverRef = useRef(false);
  useEffect(() => {
    hoverRef.current = hover;
  }, [hover]);
  // deterministic on the server, shuffled once mounted
  const [sides, setSides] = useState<Facet[]>(() => [...FACETS, ...GALLERY.slice(0, 2)]);
  useEffect(() => {
    const id = requestAnimationFrame(() => setSides([...FACETS, ...pickTwo()]));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const cube = cubeRef.current;
    const card = cardRef.current;
    const cardCanvas = cardCanvasRef.current;
    if (!cube || !card || !cardCanvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const grids: (Float32Array | null)[] = sides.map(() => null);
    const colours: (Uint8ClampedArray | null)[] = sides.map(() => null);
    const images: (HTMLImageElement | null)[] = sides.map(() => null);
    // per-cell fill colours, built once per photo and theme (alpha goes through globalAlpha)
    const fills: (string[] | null)[] = sides.map(() => null);
    // the glyph crop, pre-scaled to card resolution, feeds the cell-by-cell reveal
    const crops: (HTMLCanvasElement | null)[] = sides.map(() => null);
    sides.forEach((f, i) => {
      lumaGrid(f, COLS, ROWS, GLYPH_ZOOM).then(({ luma, rgb, img }) => {
        grids[i] = luma;
        colours[i] = rgb;
        images[i] = img;
        buildFills(i);
      });
    });
    const css = getComputedStyle(document.documentElement);
    let ink = css.getPropertyValue("--label-d").trim();
    let dark = document.documentElement.classList.contains("dark");
    let inkRGB = ink.split(",").map(Number);
    const buildFills = (i: number) => {
      const rgb = colours[i];
      if (!rgb) return;
      const m = dark ? 0.15 : 0.35;
      const out: string[] = new Array(COLS * ROWS);
      for (let n = 0; n < COLS * ROWS; n++) {
        out[n] = `rgb(${(rgb[n * 4] * (1 - m) + inkRGB[0] * m) | 0},${(rgb[n * 4 + 1] * (1 - m) + inkRGB[1] * m) | 0},${(rgb[n * 4 + 2] * (1 - m) + inkRGB[2] * m) | 0})`;
      }
      fills[i] = out;
    };
    const cropFor = (i: number) => {
      if (crops[i]) return crops[i];
      const img = images[i];
      if (!img) return null;
      const c = document.createElement("canvas");
      c.width = c.height = Math.round(F * dpr);
      const r = cropRect(img, sides[i].focus, 1, GLYPH_ZOOM);
      c.getContext("2d")?.drawImage(img, r.x, r.y, r.w, r.h, 0, 0, c.width, c.height);
      crops[i] = c;
      return c;
    };
    const themeWatch = new MutationObserver(() => {
      ink = getComputedStyle(document.documentElement).getPropertyValue("--label-d").trim();
      inkRGB = ink.split(",").map(Number);
      dark = document.documentElement.classList.contains("dark");
      sides.forEach((_, i) => buildFills(i));
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const mono = css.getPropertyValue("--font-space").trim() || "monospace";
    const decode = sides.map(() => 1);

    /**
     * Paint side i into a canvas of `size` CSS px. `reveal` 0..1 swaps cells
     * from glyphs to the photo in a scattered order; `zoom` widens the photo
     * crop once every cell has resolved; `shuffle` 0..1 stirs cells into code.
     */
    const paint = (c: HTMLCanvasElement, size: number, i: number, now: number, reveal: number, zoom: number, shuffle = 0) => {
      const g = grids[i];
      if (!g) return;
      const px = Math.round(size * dpr);
      if (c.width !== px) {
        c.width = px;
        c.height = px;
      }
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const img = images[i];
      const cw = size / COLS;
      const ch = size / ROWS;
      if (img && reveal >= 1) {
        const r = cropRect(img, sides[i].focus, 1, zoom);
        ctx.drawImage(img, r.x, r.y, r.w, r.h, 0, 0, size, size);
        return;
      }
      const crop = reveal > 0 ? cropFor(i) : null;
      const cs = crop ? crop.width / COLS : 0;
      ctx.font = `700 ${ch * 1.45}px ${mono}, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fill = fills[i];
      const inkFill = `rgb(${ink})`;
      const d = decode[i];
      const t = now / 1000;
      const tick = Math.floor(now / 110);
      for (let r = 0; r < ROWS; r++) {
        for (let k = 0; k < COLS; k++) {
          const n = r * COLS + k;
          if (crop && hash(n * 2.71 + 0.3) < reveal) {
            ctx.globalAlpha = 1;
            ctx.drawImage(crop, k * cs, r * cs, cs, cs, k * cw, r * ch, cw + 0.5, ch + 0.5);
            continue;
          }
          const ph = hash(n * 0.77) * 6.283;
          // each glyph drifts on its own slow orbit and its tone breathes,
          // so the picture keeps its shape but never sits still
          const ox = Math.sin(t * 0.7 + ph) * 1.6 * (size / S);
          const oy = Math.cos(t * 0.55 + ph * 1.3) * 1.9 * (size / S);
          let v = g[n];
          if (!dark) v = 1 - v;
          v = Math.pow(Math.min(1, Math.max(0, v)), 0.8);
          v = Math.min(1, Math.max(0, v + 0.09 * Math.sin(t * 0.9 + ph * 2.1)));
          // hovering stirs the characters: a share of cells cycles through code
          const settled = hash(n * 1.31) < d && hash(n * 5.17 + 0.9) >= shuffle;
          let chr: string;
          let alpha: number;
          if (settled) {
            chr = RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))] ?? " ";
            alpha = 0.55 + 0.45 * v;
          } else {
            chr = NOISE[Math.floor(hash(n + tick * 7.7) * NOISE.length)] ?? "0";
            alpha = 0.25 + 0.5 * hash(n * 3.1 + tick);
          }
          if (chr === " ") continue;
          ctx.fillStyle = settled && fill ? fill[n] : inkFill;
          ctx.globalAlpha = alpha;
          ctx.fillText(chr, (k + 0.5) * cw + ox, (r + 0.5) * ch + 1 + oy);
        }
      }
      ctx.globalAlpha = 1;
    };

    // orientation
    let q: Q = toQ(upright(0));
    let anim: { from: Q; to: Q; start: number; side: number; scramble: boolean } | null = null;
    let lastTurn = performance.now();
    let front = 0;
    let drag: { x: number; y: number; vx: number; vy: number; t: number } | null = null;
    let spin: { vx: number; vy: number } | null = null;
    let square = 0; // 0 = presentation tilt, 1 = square-on for the card
    let open = 0; // card unfold 0..1
    let reveal = 0; // 0..1 cells resolve, 1..2 the crop widens
    let last = performance.now();

    // the arriving side decodes in step with the turn and is fully settled
    // before the cube lands, so nothing keeps flickering once it stops
    const settleOn = (side: number, now: number, scramble: boolean) => {
      anim = { from: q, to: toQ(upright(side)), start: now, side, scramble };
      if (scramble && side !== front) decode[side] = 0;
      lastTurn = now;
    };
    const markFront = (m: M3) => {
      const f = frontOf(m);
      if (f !== front) {
        front = f;
        setActive(f);
      }
    };
    const tumble = (now: number) => {
      const dir = Math.floor(Math.random() * 4);
      const turn = dir < 2 ? rotY(dir === 0 ? Math.PI / 2 : -Math.PI / 2) : rotX(dir === 2 ? Math.PI / 2 : -Math.PI / 2);
      settleOn(frontOf(mul(turn, toM(q))), now, true);
    };
    const nudge = (dx: number, dy: number) => {
      q = toQ(mul(rotX(-dy * 0.009), mul(rotY(dx * 0.009), toM(q))));
    };

    const onDown = (e: PointerEvent) => {
      cube.setPointerCapture(e.pointerId);
      drag = { x: e.clientX, y: e.clientY, vx: 0, vy: 0, t: performance.now() };
      anim = null;
      decode.fill(1);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      const now = performance.now();
      const dt = Math.max(1, now - drag.t);
      drag.vx = dx / dt;
      drag.vy = dy / dt;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.t = now;
      nudge(dx, dy);
    };
    const onUp = () => {
      if (!drag) return;
      spin = { vx: drag.vx * 16, vy: drag.vy * 16 };
      drag = null;
    };
    cube.addEventListener("pointerdown", onDown);
    cube.addEventListener("pointermove", onMove);
    cube.addEventListener("pointerup", onUp);
    cube.addEventListener("pointercancel", onUp);

    // stop all work while the hero is off screen or the tab is hidden
    let inView = true;
    const io = new IntersectionObserver(([en]) => {
      inView = en.isIntersecting;
    });
    io.observe(cube);
    let lastPaint = 0;
    let cardDrawn = "";

    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(50, now - last);
      last = now;
      if (!inView || document.hidden) return;
      const paintNow = now - lastPaint >= PAINT_MS;
      if (paintNow) lastPaint = now;
      if (spin) {
        nudge(spin.vx, spin.vy);
        spin.vx *= 0.92;
        spin.vy *= 0.92;
        if (Math.hypot(spin.vx, spin.vy) < 0.4) {
          spin = null;
          settleOn(frontOf(toM(q)), now, false);
        }
      }
      const handsOff = !drag && !spin;
      if (handsOff && !hoverRef.current && !anim && now - lastTurn > AUTO_MS) tumble(now);
      if (anim) {
        const t = Math.min(1, (now - anim.start) / TURN_MS);
        q = slerp(anim.from, anim.to, ease(t));
        if (anim.scramble) decode[anim.side] = Math.max(decode[anim.side], Math.min(1, (t - 0.15) / 0.65));
        if (t >= 1) {
          decode[anim.side] = 1;
          anim = null;
        }
      }
      const m = toM(q);
      markFront(m);

      // hover: the cube eases square-on while its characters stir and already
      // resolve into the photo, so the turn is part of the reveal; the card
      // then fades up over the face and the crop widens. Leaving reverses it.
      const wantSquare = hoverRef.current && handsOff;
      const wantOpen = wantSquare && !anim && square >= 1;
      if (wantOpen) open = Math.min(1, open + dt / OPEN_MS);
      else open = Math.max(0, open - dt / CLOSE_MS);
      if (wantSquare) square = Math.min(1, square + dt / SQUARE_MS);
      else if (open === 0) square = Math.max(0, square - dt / (SQUARE_MS * 0.8));
      if (wantSquare && square > 0.12) {
        // cells resolve during the turn; the crop only widens once the card is up
        if (reveal < 1) reveal = Math.min(1, reveal + dt / REVEAL_MS);
        else if (wantOpen && open > 0.75) reveal = Math.min(2, reveal + dt / ZOOM_OUT_MS);
      } else if (!wantSquare) reveal = Math.max(0, reveal - dt / CLOSE_MS);
      const sq = ease(square);
      const stir = 0.55 * sq;

      const k = 1 - sq;
      const sway = drag || spin ? 0 : Math.sin(now / 1700) * 0.07;
      const view = mul(rotX(-0.28 * k), mul(rotY((0.32 + sway) * k), m));
      cube.style.transform = `matrix3d(${view[0]},${view[3]},${view[6]},0,${view[1]},${view[4]},${view[7]},0,${view[2]},${view[5]},${view[8]},0,0,0,0,1)`;
      // faces hidden under the open card need no repaint
      if (paintNow && open < 1) {
        for (let i = 0; i < N; i++) {
          if (apply(view, NORMAL[i])[2] > -0.05) {
            const c = faceRefs.current[i];
            const r = i === front ? Math.min(1, reveal) : 0;
            if (c) paint(c, S, i, now, r, GLYPH_ZOOM, i === front ? stir * (1 - r) : 0);
          }
        }
      }

      // the card starts as an exact overlay of the front face and grows from it
      const e = ease(open);
      if (open > 0) {
        const r = Math.min(1, reveal);
        const zoom = GLYPH_ZOOM - (GLYPH_ZOOM - 1) * ease(Math.max(0, Math.min(1, reveal - 1)));
        // the stir settles as the photo resolves; a fully shown photo is static
        const key = r >= 1 ? `${front}:${zoom.toFixed(4)}` : "";
        if ((paintNow || r >= 1) && (key === "" || key !== cardDrawn)) {
          paint(cardCanvas, F, front, now, r, zoom, stir * (1 - r));
          cardDrawn = key;
        }
        card.style.visibility = "visible";
        card.style.opacity = String(e);
        card.style.height = `${F + TEXT_H * e}px`;
        card.style.transform = `scale(${0.985 + 0.055 * e})`;
        card.style.boxShadow = `0 ${24 * e}px ${70 * e}px rgba(0,0,0,${0.22 * e})`;
        if (cardTextRef.current) cardTextRef.current.style.opacity = String(Math.max(0, (e - 0.45) / 0.55));
      } else {
        card.style.visibility = "hidden";
        cardDrawn = "";
      }
      if (guideRef.current) guideRef.current.style.opacity = String(1 - e);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      themeWatch.disconnect();
      cube.removeEventListener("pointerdown", onDown);
      cube.removeEventListener("pointermove", onMove);
      cube.removeEventListener("pointerup", onUp);
      cube.removeEventListener("pointercancel", onUp);
    };
  }, [sides]);

  const f = sides[active];

  return (
    <div className="relative select-none" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <div className="relative" style={{ width: S, height: S, perspective: PERSP }}>
        <div
          ref={cubeRef}
          className="relative size-full [transform-style:preserve-3d] cursor-grab active:cursor-grabbing touch-none"
        >
          {sides.map((side, i) => (
            <div
              key={i}
              className="absolute inset-0 border border-l4 bg-b1/90 [backface-visibility:hidden]"
              style={{ transform: `${SIDE_CSS[i]} translateZ(${S / 2}px)` }}
            >
              <canvas
                ref={(el) => {
                  faceRefs.current[i] = el;
                }}
                className="size-full"
              />
            </div>
          ))}
        </div>

        {/* the front side, unfolded: clicks pass through so the cube stays draggable */}
        <div
          ref={cardRef}
          className="invisible absolute z-10 overflow-hidden border border-l4 bg-b1 origin-top pointer-events-none"
          style={{ left: (S - F) / 2, top: (S - F) / 2, width: F, height: F }}
        >
          <canvas ref={cardCanvasRef} className="block" style={{ width: F, height: F }} />
          <div ref={cardTextRef} className="px-3 pt-3 font-mono-2 text-[10px] leading-[1.6] opacity-0">
            <div className="text-l3">{f.title.toUpperCase()}</div>
            <div className="mt-0.5" style={{ color: `rgb(${f.accent})` }}>
              {f.stat}
            </div>
            <div className="text-l2">{f.lines[0]}</div>
          </div>
        </div>
      </div>

      <div
        ref={guideRef}
        className="mt-[104px] flex items-center justify-center gap-6 font-mono-2 text-[10px] tracking-[0.04em] text-l2"
      >
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-[7px] rounded-full border border-current" />
          HOVER TO PEEK
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden>↔</span>
          DRAG TO SPIN
        </span>
      </div>
    </div>
  );
}
