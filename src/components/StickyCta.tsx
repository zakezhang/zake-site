import { stickyCta } from "@/lib/content";

/**
 * "Life is a drug" page. Sticky against the remaining flow so the footer
 * starts sliding over it immediately — no dead scroll stretch between the
 * two closing pages. The cycling facet scenes show through from the fixed
 * background canvas.
 */
export function StickyCta() {
  return (
    <div
      id="cta"
      className="sticky top-0 grid grid-cols-12 grid-rows-6 px-4 lg:px-14 py-18 h-dvh overflow-hidden text-l1 snap-start"
    >
      {/* Topo-map legend of summited peaks */}
      <div
        aria-hidden
        className="absolute left-4 lg:left-14 bottom-28 space-y-1.5 font-mono-2 text-xs uppercase text-l4"
      >
        {stickyCta.peaks.map((peak) => (
          <div key={peak.name}>
            ▲ {peak.name} — {peak.alt}
          </div>
        ))}
      </div>
      <div className="relative flex flex-col justify-center items-center col-span-12 row-span-6 font-bold text-[9svw] leading-[1.05] uppercase">
        {stickyCta.motto.map((line) => (
          <span key={line}>{line}</span>
        ))}
        <span className="mt-8 font-mono-2 font-normal text-xs lg:text-sm uppercase tracking-wide text-l3">
          {stickyCta.routes}
        </span>
      </div>
    </div>
  );
}
