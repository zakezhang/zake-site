import type { SVGProps } from "react";

/* Hand-drawn-feel stroke glyphs for Zake's facets: alpine, BJJ, swimming,
   filmmaking — plus per-project marks for cards without photography. */

function base(props: SVGProps<SVGSVGElement>) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function MountainIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M2 20 L9 6 l4 7 l3 -4 l6 11" />
      <path d="M7.5 9.5 l1.5 1.5 l1.5 -1.5" />
    </svg>
  );
}

export function IceAxeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M5 21 L16 10" />
      <path d="M11 5 c3 -2.5 7 -1.5 9 1.5 l-4 3.5 l-5 -5 z" />
      <path d="M5 21 l1.5 -0.3" />
    </svg>
  );
}

export function BeltIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M2 9.5 h7 M15 9.5 h7 M2 13.5 h6 M16 13.5 h6" />
      <rect x="9.5" y="8.5" width="5" height="6" />
      <path d="M10.5 14.5 l-2 6 M13.5 14.5 l2 6" />
    </svg>
  );
}

export function WaveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M2 10 q3 -4 6 0 t6 0 t6 0" />
      <path d="M2 16 q3 -4 6 0 t6 0 t6 0" />
    </svg>
  );
}

export function FilmIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="9" width="18" height="11" />
      <path d="M3.5 9 L6 4 l4 1.5 L7.5 10 M10 5.5 l4 1.5 L11.5 11.5 M14 7 l4 1.5 L15.5 13" />
    </svg>
  );
}

export function TerminalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="4.5" width="18" height="15" />
      <path d="M7 10 l3 3 l-3 3 M12.5 16 h4.5" />
    </svg>
  );
}

export function MergeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <circle cx="6" cy="5.5" r="2.2" />
      <circle cx="6" cy="18.5" r="2.2" />
      <circle cx="18" cy="12" r="2.2" />
      <path d="M6 7.7 v8.6 M6 12 c0 -3 4 -4.5 9.8 -4.5 M6 12 c0 3 4 4.5 9.8 4.5" />
    </svg>
  );
}

export function ScissorsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <circle cx="6" cy="6.5" r="2.5" />
      <circle cx="6" cy="17.5" r="2.5" />
      <path d="M8.2 8 L20 17 M8.2 16 L20 7" />
    </svg>
  );
}

export function MicIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="9.5" y="3" width="5" height="10" rx="2.5" />
      <path d="M6 11 c0 4 2.5 6 6 6 s6 -2 6 -6 M12 17 v4 M9 21 h6" />
    </svg>
  );
}

export function FramesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="6" width="13" height="15" />
      <path d="M8 3 h13 v15" />
      <path d="M3 16 l4 -4 l3 3 l3.5 -3.5 l2.5 2.5" />
    </svg>
  );
}
