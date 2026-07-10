/**
 * The four line-art facet scenes — alpine contours, jiu-jitsu bodies,
 * swim waves, drifting notes — shared by the hero canvas and the fixed
 * canvas behind the motto/footer pages. `createScenePainters()` returns a
 * fresh painter set per canvas so stateful scenes (the jiu-jitsu physics)
 * never share state between hosts.
 */

export const SCENE_S = 9;
export const FADE_S = 1.8;
export const SCENES = 4;
export const CYCLE_S = SCENE_S * SCENES;

/* One accent per facet: expedition orange, belt blue, water aqua, stage violet */
export const ACCENT = {
  alpine: "255,107,53",
  bjj: "79,124,255",
  swim: "34,211,238",
  music: "168,130,255",
};

export const ACCENT_LIST = [ACCENT.alpine, ACCENT.bjj, ACCENT.swim, ACCENT.music];

export function sceneAlpha(cycle: number, index: number) {
  const start = index * SCENE_S;
  // distance into this scene's window, wrapping around the cycle
  const local = (cycle - start + CYCLE_S) % CYCLE_S;
  if (local >= SCENE_S) return 0;
  const fadeIn = Math.min(1, local / FADE_S);
  const fadeOut = Math.min(1, (SCENE_S - local) / FADE_S);
  return Math.min(fadeIn, fadeOut);
}

export interface SceneEnv {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  dpr: number;
  ink: string;
  /** scene opacity 0..1 */
  a: number;
  /** seconds */
  t: number;
  /** gaussian cursor bump: returns lift at (x, y) */
  bump: (x: number, y: number, radius: number, gain: number) => number;
  /** smoothed cursor in canvas pixels, energy 0..1 */
  pointer: { x: number; y: number; energy: number };
}

const mono = (env: SceneEnv, px: number) => `${px * env.dpr}px monospace`;

/* deterministic pseudo-random in [0,1) from a seed */
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

function drawAlpine(env: SceneEnv) {
  const { ctx, w, h, dpr, ink, a, t, bump } = env;
  const peaks = [
    { x: w * (0.34 + 0.04 * Math.sin(t * 0.4)), y: h * (0.42 + 0.03 * Math.cos(t * 0.5)), s: 0.17, a: 1 },
    { x: w * (0.7 + 0.04 * Math.cos(t * 0.35)), y: h * (0.6 + 0.04 * Math.sin(t * 0.45)), s: 0.14, a: 0.75 },
  ];
  const diag = Math.hypot(w, h);
  const field = (x: number, y: number) => {
    let v = 0;
    for (const p of peaks) {
      const d = Math.hypot(x - p.x, y - p.y) / (p.s * diag);
      v += p.a * Math.exp(-d * d);
    }
    // cursor pushes the terrain up — contours ripple around it
    return v + 0.05 * Math.sin(x / (180 * dpr) + t * 0.6) + bump(x, y, 150 * dpr, 0.9);
  };
  const STEP = 32 * dpr;
  const cols = Math.ceil(w / STEP) + 1;
  const rows = Math.ceil(h / STEP) + 1;
  const grid = new Float32Array(cols * rows);
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) grid[j * cols + i] = field(i * STEP, j * STEP);
  ctx.lineWidth = 1 * dpr;
  [0.35, 0.5, 0.65, 0.8, 0.92].forEach((level, li) => {
    ctx.strokeStyle =
      li === 2
        ? `rgba(${ACCENT.alpine}, ${0.4 * a})`
        : `rgba(${ink}, ${(li % 2 === 0 ? 0.13 : 0.08) * a})`;
    ctx.beginPath();
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const x = i * STEP, y = j * STEP;
        const tl = grid[j * cols + i], tr = grid[j * cols + i + 1];
        const br = grid[(j + 1) * cols + i + 1], bl = grid[(j + 1) * cols + i];
        const idx = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const lerp = (p: number, q: number) => (level - p) / (q - p);
        const top = { x: x + STEP * lerp(tl, tr), y };
        const right = { x: x + STEP, y: y + STEP * lerp(tr, br) };
        const bottom = { x: x + STEP * lerp(bl, br), y: y + STEP };
        const left = { x, y: y + STEP * lerp(tl, bl) };
        const seg = (p: { x: number; y: number }, q: { x: number; y: number }) => {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
        };
        switch (idx) {
          case 1: case 14: seg(left, bottom); break;
          case 2: case 13: seg(bottom, right); break;
          case 3: case 12: seg(left, right); break;
          case 4: case 11: seg(top, right); break;
          case 5: seg(left, top); seg(bottom, right); break;
          case 6: case 9: seg(top, bottom); break;
          case 7: case 8: seg(left, top); break;
          case 10: seg(top, right); seg(left, bottom); break;
        }
      }
    }
    ctx.stroke();
  });
  const main = peaks[0];
  ctx.strokeStyle = `rgba(${ACCENT.alpine}, ${0.65 * a})`;
  ctx.fillStyle = `rgba(${ACCENT.alpine}, ${0.65 * a})`;
  ctx.beginPath();
  ctx.moveTo(main.x - 5 * dpr, main.y);
  ctx.lineTo(main.x + 5 * dpr, main.y);
  ctx.moveTo(main.x, main.y - 5 * dpr);
  ctx.lineTo(main.x, main.y + 5 * dpr);
  ctx.stroke();
  ctx.font = mono(env, 10);
  ctx.fillText("MUZTAGH ATA — 7546M", main.x + 9 * dpr, main.y - 6 * dpr);
}

function drawSwim(env: SceneEnv) {
  const { ctx, w, h, dpr, ink, a, t, bump } = env;
  ctx.lineWidth = 1 * dpr;
  const rowsY = 7;
  for (let i = 0; i < rowsY; i++) {
    const y = h * (0.5 + (i / (rowsY - 1)) * 0.38);
    const amp = (6 + i * 2.2) * dpr;
    const k = 0.008 / dpr;
    const speed = 0.9 + i * 0.18;
    ctx.strokeStyle =
      i % 3 === 0
        ? `rgba(${ACCENT.swim}, ${0.4 * a})`
        : `rgba(${ink}, ${0.08 * a})`;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 6 * dpr) {
      const yy =
        y + Math.sin(x * k + t * speed + i * 0.9) * amp - bump(x, y, 120 * dpr, 26 * dpr);
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  // lane line + PB annotation
  const laneY = h * 0.46;
  ctx.strokeStyle = `rgba(${ACCENT.swim}, ${0.35 * a})`;
  ctx.setLineDash([2 * dpr, 8 * dpr]);
  ctx.beginPath();
  ctx.moveTo(0, laneY);
  ctx.lineTo(w, laneY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = `rgba(${ACCENT.swim}, ${0.65 * a})`;
  ctx.font = mono(env, 10);
  ctx.fillText("FREESTYLE 50M — 29.8S", w * 0.66, laneY - 8 * dpr);
}

/* Notes scattered across the whole canvas, each on its own drift lane and
   bob rhythm; the staff is reduced to a whisper. */
function drawMusic(env: SceneEnv) {
  const { ctx, w, h, dpr, ink, a, t } = env;
  const A = ACCENT.music;
  // barely-there staff, off-center so type never sits on it
  const staffTop = h * 0.72;
  const gap = 14 * dpr;
  ctx.lineWidth = 1 * dpr;
  ctx.strokeStyle = `rgba(${ink}, ${0.045 * a})`;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.moveTo(0, staffTop + i * gap);
    ctx.lineTo(w, staffTop + i * gap);
  }
  ctx.stroke();
  const GLYPHS = ["♪", "♩", "♫", "♬"];
  const N = 22;
  const margin = 80 * dpr;
  const span = w + 2 * margin;
  for (let i = 0; i < N; i++) {
    const speed = (18 + hash(i * 1.7) * 46) * dpr;
    const size = (14 + hash(i * 2.3) * 26) * dpr;
    // every note keeps its own lane, spread over the full height
    const laneY = h * (0.06 + hash(i * 3.1) * 0.88);
    const x = w + margin - ((t * speed + hash(i * 4.7) * span) % span);
    const bobA = (8 + hash(i * 5.9) * 14) * dpr;
    const y = laneY + Math.sin(t * (0.6 + hash(i * 6.3)) + i) * bobA;
    const accent = i % 3 === 0;
    ctx.fillStyle = accent
      ? `rgba(${A}, ${(0.3 + hash(i * 8.9) * 0.3) * a})`
      : `rgba(${ink}, ${(0.1 + hash(i * 7.7) * 0.14) * a})`;
    ctx.font = `${size}px sans-serif`;
    ctx.fillText(GLYPHS[i % 4], x, y);
  }
  ctx.fillStyle = `rgba(${A}, ${0.6 * a})`;
  ctx.font = mono(env, 10);
  ctx.fillText("CELLO × RAP", w * 0.05, h * 0.94);
}

/* Two bodies drawn to a shared center — clash, part, return. The cursor
   pushes them off course. Conflict and stillness in one loop. */
interface BjjBall {
  x: number; y: number; vx: number; vy: number; r: number;
  trail: { x: number; y: number }[];
}
interface BjjRing { x: number; y: number; r: number; alpha: number }

function createBjjPainter() {
  let balls: BjjBall[] | null = null;
  const rings: BjjRing[] = [];
  let lastT = 0;

  return function drawBjj(env: SceneEnv) {
    const { ctx, w, h, dpr, ink, a, t, pointer } = env;
    const cx = w * 0.5;
    const cy = h * 0.38;

    if (!balls) {
      balls = [
        { x: cx - w * 0.18, y: cy - h * 0.1, vx: 40 * dpr, vy: 90 * dpr, r: 11 * dpr, trail: [] },
        { x: cx + w * 0.18, y: cy + h * 0.12, vx: -50 * dpr, vy: -80 * dpr, r: 14 * dpr, trail: [] },
      ];
      lastT = t;
    }
    const dt = Math.min(0.05, Math.max(0, t - lastT));
    lastT = t;

    // physics: spring to center, cursor repulsion, light damping
    const K = 1.4;
    for (const b of balls) {
      let ax = (cx - b.x) * K;
      let ay = (cy - b.y) * K;
      if (pointer.energy > 0.02) {
        const dx = b.x - pointer.x;
        const dy = b.y - pointer.y;
        const dist = Math.hypot(dx, dy) + 1;
        const push = 5200 * dpr * pointer.energy * Math.exp(-((dist / (200 * dpr)) ** 2));
        ax += (dx / dist) * push;
        ay += (dy / dist) * push;
      }
      b.vx = (b.vx + ax * dt) * (1 - 0.06 * dt);
      b.vy = (b.vy + ay * dt) * (1 - 0.06 * dt);
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.trail.push({ x: b.x, y: b.y });
      if (b.trail.length > 26) b.trail.shift();
    }

    // collision: elastic exchange along the normal + an impact ring
    const [p, q] = balls;
    const dx = q.x - p.x, dy = q.y - p.y;
    const dist = Math.hypot(dx, dy);
    const minDist = p.r + q.r;
    if (dist > 0 && dist < minDist) {
      const nx = dx / dist, ny = dy / dist;
      const rel = (q.vx - p.vx) * nx + (q.vy - p.vy) * ny;
      if (rel < 0) {
        p.vx += rel * nx; p.vy += rel * ny;
        q.vx -= rel * nx; q.vy -= rel * ny;
        rings.push({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2, r: minDist * 0.6, alpha: 0.5 });
      }
      const overlap = (minDist - dist) / 2 + 0.5;
      p.x -= nx * overlap; p.y -= ny * overlap;
      q.x += nx * overlap; q.y += ny * overlap;
    }

    // zen anchor: the shared center
    ctx.strokeStyle = `rgba(${ink}, ${0.25 * a})`;
    ctx.lineWidth = 1 * dpr;
    ctx.beginPath();
    ctx.moveTo(cx - 5 * dpr, cy);
    ctx.lineTo(cx + 5 * dpr, cy);
    ctx.moveTo(cx, cy - 5 * dpr);
    ctx.lineTo(cx, cy + 5 * dpr);
    ctx.stroke();

    // impact rings breathe out and dissolve
    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i];
      ring.r += 90 * dpr * dt;
      ring.alpha -= 0.5 * dt;
      if (ring.alpha <= 0.01) {
        rings.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = `rgba(${ACCENT.bjj}, ${ring.alpha * a})`;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // trails, then the two bodies: one solid accent, one ink outline
    balls.forEach((b, bi) => {
      for (let i = 1; i < b.trail.length; i++) {
        const f = i / b.trail.length;
        ctx.strokeStyle =
          bi === 0
            ? `rgba(${ACCENT.bjj}, ${0.22 * f * a})`
            : `rgba(${ink}, ${0.18 * f * a})`;
        ctx.lineWidth = 1.2 * dpr * f;
        ctx.beginPath();
        ctx.moveTo(b.trail[i - 1].x, b.trail[i - 1].y);
        ctx.lineTo(b.trail[i].x, b.trail[i].y);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      if (bi === 0) {
        ctx.fillStyle = `rgba(${ACCENT.bjj}, ${0.6 * a})`;
        ctx.fill();
      } else {
        ctx.strokeStyle = `rgba(${ink}, ${0.5 * a})`;
        ctx.lineWidth = 1.5 * dpr;
        ctx.stroke();
      }
    });

    ctx.fillStyle = `rgba(${ACCENT.bjj}, ${0.6 * a})`;
    ctx.font = mono(env, 10);
    ctx.fillText("BRAZILIAN JIU-JITSU — BLUE BELT", w * 0.05, h * 0.9);
  };
}

/** Fresh painter set per canvas — stateful scenes stay isolated. */
export function createScenePainters() {
  return [drawAlpine, createBjjPainter(), drawSwim, drawMusic];
}
