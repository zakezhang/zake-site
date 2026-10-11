/** The four off-screen facets, shared by every hero toy. */
export interface Facet {
  id: string;
  index: string;
  title: string;
  stat: string;
  lines: string[];
  photo: string;
  /** focus of the photo for square crops, in 0..1 */
  focus: [number, number];
  accent: string;
}

export const FACETS: Facet[] = [
  {
    id: "alpine",
    index: "01",
    title: "Mountaineering",
    stat: "MUZTAGH ATA — 7546M",
    lines: ["Summited the Father of Ice Mountains"],
    photo: "/images/scenes/alpine-4742f2.jpg",
    focus: [0.55, 0.62],
    accent: "255,107,53",
  },
  {
    id: "swim",
    index: "02",
    title: "Swimming",
    stat: "FREESTYLE 50M — 29.8S",
    lines: ["My 50m freestyle personal best"],
    photo: "/images/scenes/swim-fde9a3.jpg",
    focus: [0.5, 0.52],
    accent: "34,211,238",
  },
  {
    id: "bjj",
    index: "03",
    title: "Brazilian Jiu-Jitsu",
    stat: "AJP CHINA — GOLD",
    lines: ["Gold at the Abu Dhabi Jiu-Jitsu Pro Tour, China"],
    photo: "/images/scenes/bjj-cfb062.jpg",
    focus: [0.47, 0.45],
    accent: "79,124,255",
  },
  {
    id: "music",
    index: "04",
    title: "Music",
    stat: "I PLAY CELLO & RAP",
    lines: ["Classical strings by day, verses by night"],
    photo: "/images/scenes/music-1edd12.jpg",
    focus: [0.45, 0.42],
    accent: "168,130,255",
  },
];

/** the source rect of a photo for a cols:rows crop around its focus; zoom > 1 crops tighter */
export function cropRect(img: HTMLImageElement, focus: [number, number], aspect: number, zoom: number) {
  const w = Math.min(img.naturalWidth, img.naturalHeight * aspect) / zoom;
  const h = w / aspect;
  const x = Math.min(Math.max(focus[0] * img.naturalWidth - w / 2, 0), img.naturalWidth - w);
  const y = Math.min(Math.max(focus[1] * img.naturalHeight - h / 2, 0), img.naturalHeight - h);
  return { x, y, w, h };
}

/** load an image and return a luminance grid sampled from a square crop */
export async function lumaGrid(f: Facet, cols: number, rows: number, zoom = 1) {
  const img = new Image();
  img.src = f.photo;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = cols;
  c.height = rows;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { img, luma: new Float32Array(cols * rows), rgb: new Uint8ClampedArray(cols * rows * 4) };
  const r = cropRect(img, f.focus, cols / rows, zoom);
  ctx.drawImage(img, r.x, r.y, r.w, r.h, 0, 0, cols, rows);
  const d = ctx.getImageData(0, 0, cols, rows).data;
  const luma = new Float32Array(cols * rows);
  let lo = 1, hi = 0;
  for (let i = 0; i < cols * rows; i++) {
    const v = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
    luma[i] = v;
    lo = Math.min(lo, v);
    hi = Math.max(hi, v);
  }
  // auto-levels so every photo uses the full ramp
  for (let i = 0; i < luma.length; i++) luma[i] = (luma[i] - lo) / Math.max(hi - lo, 0.01);
  return { img, luma, rgb: d };
}
