import { stickyCta } from "@/lib/content";

/* Ridgeline with Zake's summited peaks marked at their vertices */
const PEAK_MARKS = [
  { x: 780, y: 36, peak: stickyCta.peaks[0] },
  { x: 330, y: 70, peak: stickyCta.peaks[1] },
  { x: 520, y: 96, peak: stickyCta.peaks[2] },
];

function Ridgeline() {
  return (
    <svg
      viewBox="0 0 1200 260"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-x-4 lg:inset-x-14 top-1/2 -translate-y-1/2 w-[calc(100%-2rem)] lg:w-[calc(100%-7rem)] text-l4"
    >
      <path
        d="M0 210 L120 140 L210 178 L330 70 L420 150 L520 96 L640 176 L780 36 L880 130 L980 100 L1090 168 L1200 120"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M0 36 H1200"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 6"
      />
      {PEAK_MARKS.map(({ x, y, peak }) => (
        <path
          key={peak.name}
          d={`M${x} ${y} l-5 8 h10 z`}
          fill="currentColor"
          stroke="none"
        />
      ))}
      {/* Topo-map legend, kept clear of the centered motto */}
      {PEAK_MARKS.map(({ peak }, i) => (
        <text
          key={peak.name}
          x="4"
          y={198 + i * 21}
          fontSize="12"
          fill="currentColor"
          className="font-mono-2 uppercase"
        >
          ▲ {peak.name} — {peak.alt}
        </text>
      ))}
    </svg>
  );
}

export function StickyCta() {
  return (
    <div id="cta" className="relative h-[160vh] text-l1 snap-start">
      <div className="top-0 sticky grid grid-cols-12 grid-rows-6 px-4 lg:px-14 py-18 h-dvh overflow-hidden">
        <Ridgeline />
        <div className="relative flex flex-col justify-center items-center col-span-12 row-span-6 font-bold text-[9svw] leading-[1.05] uppercase">
          {stickyCta.motto.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <span className="mt-8 font-mono-2 font-normal text-xs lg:text-sm uppercase tracking-wide text-l3">
            {stickyCta.routes}
          </span>
        </div>
      </div>
    </div>
  );
}
