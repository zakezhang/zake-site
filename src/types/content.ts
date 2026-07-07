export type WorkIcon =
  | "terminal"
  | "merge"
  | "scissors"
  | "mic"
  | "frames"
  | "belt";

export interface WorkItem {
  /** Zero-padded number shown on the generated cover, e.g. "01" */
  no: string;
  title: string;
  /** Short codename rendered on the cover */
  code: string;
  years: string;
  href: string;
  external?: boolean;
  /** Lime badge pinned to the cover's top-right corner */
  badge?: string;
  /** Small label next to the year on desktop, e.g. "video" */
  tag?: string;
  aspect: "wide" | "standard" | "video";
  /** Tailwind column classes replicating the original scattered grid */
  cols: string;
  /** Real cover photo under public/, e.g. "/images/work/vidmuse.jpg" */
  image?: string;
  /** Line-art glyph cover for items without photography */
  icon?: WorkIcon;
}

export interface FooterLink {
  label: string;
  href: string;
}
