/**
 * The four line-art facet scenes — alpine contours, jiu-jitsu arcs, swim
 * waves, streaming notes — shared by the hero canvas and the fixed canvas
 * behind the motto/footer pages. Painters draw into a SceneEnv so each
 * host canvas keeps its own sizing, gating, and pointer state.
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
}

const mono = (env: SceneEnv, px: number) => `${px * env.dpr}px monospace`;

export function drawAlpine(env: SceneEnv) {
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

export function drawBjj(env: SceneEnv) {
  const { ctx, w, h, dpr, ink, a, t } = env;
  const cx = w * 0.64, cy = h * 0.46;
  const base = Math.min(w, h);
  ctx.lineWidth = 1 * dpr;
  for (let i = 0; i < 6; i++) {
    const r = base * (0.09 + i * 0.075);
    const dir = i % 2 === 0 ? 1 : -1;
    const start = t * (0.12 + i * 0.03) * dir + i * 1.1;
    const span = Math.PI * (0.9 + 0.35 * Math.sin(t * 0.3 + i));
    ctx.strokeStyle =
      i % 3 === 0
        ? `rgba(${ACCENT.bjj}, ${0.42 * a})`
        : `rgba(${ink}, ${0.09 * a})`;
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, start + span);
    ctx.stroke();
    // leading grip point on each arc
    ctx.fillStyle = `rgba(${ACCENT.bjj}, ${0.5 * a})`;
    ctx.beginPath();
    ctx.arc(cx + r * Math.cos(start + span), cy + r * Math.sin(start + span), 2 * dpr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = `rgba(${ACCENT.bjj}, ${0.65 * a})`;
  ctx.font = mono(env, 10);
  ctx.fillText("BRAZILIAN JIU-JITSU — BLUE BELT", cx - base * 0.09, cy - base * 0.09 - 10 * dpr);
}

export function drawSwim(env: SceneEnv) {
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

export function drawMusic(env: SceneEnv) {
  const { ctx, w, h, dpr, ink, a, t } = env;
  const A = ACCENT.music;
  // Faint staff lines across the middle band
  const staffTop = h * 0.44;
  const gap = 14 * dpr;
  ctx.lineWidth = 1 * dpr;
  ctx.strokeStyle = `rgba(${ink}, ${0.1 * a})`;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.moveTo(0, staffTop + i * gap);
    ctx.lineTo(w, staffTop + i * gap);
  }
  ctx.stroke();
  // Notes streaming right-to-left in loose lanes around the staff
  const GLYPHS = ["♪", "♩", "♫", "♬"];
  const N = 14;
  const margin = 60 * dpr;
  for (let i = 0; i < N; i++) {
    const speed = (36 + (i % 5) * 20) * dpr;
    const size = (15 + (i % 4) * 7) * dpr;
    const laneY = staffTop + (((i * 53) % (gap * 9)) - gap * 2);
    const x =
      w + margin - ((t * speed + (i * (w + 2 * margin)) / N * 1.7) % (w + 2 * margin));
    const bob = Math.sin(t * 1.4 + i) * 5 * dpr;
    ctx.fillStyle =
      i % 3 === 0 ? `rgba(${A}, ${0.5 * a})` : `rgba(${ink}, ${0.18 * a})`;
    ctx.font = `${size}px sans-serif`;
    ctx.fillText(GLYPHS[i % 4], x, laneY + bob);
  }
  ctx.fillStyle = `rgba(${A}, ${0.65 * a})`;
  ctx.font = mono(env, 10);
  ctx.fillText("CELLO × RAP", w * 0.66, staffTop - 16 * dpr);
}

export const SCENE_PAINTERS = [drawAlpine, drawBjj, drawSwim, drawMusic];
