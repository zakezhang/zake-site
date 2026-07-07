import Image from "next/image";
import { workGroups } from "@/lib/content";
import type { WorkIcon, WorkItem } from "@/types/content";
import { cn } from "@/lib/utils";
import { IntroFilm } from "@/components/IntroFilm";
import {
  BeltIcon,
  FramesIcon,
  MergeIcon,
  MicIcon,
  ScissorsIcon,
  TerminalIcon,
} from "@/components/icons";

const ICONS: Record<WorkIcon, typeof BeltIcon> = {
  terminal: TerminalIcon,
  merge: MergeIcon,
  scissors: ScissorsIcon,
  mic: MicIcon,
  frames: FramesIcon,
  belt: BeltIcon,
};

function Cover({ item }: { item: WorkItem }) {
  const Icon = item.icon ? ICONS[item.icon] : null;
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-line bg-be",
        item.aspect === "wide" && "aspect-[16/10]",
        item.aspect === "video" && "aspect-video",
        item.aspect === "standard" && "aspect-[4/3]",
        item.fill && "lg:aspect-auto lg:h-full",
      )}
    >
      {item.image ? (
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          // Native lazy-loading misfires inside the fixed inner scroll container
          loading="eager"
          className="object-cover transition-transform duration-700 ease-66 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center text-l3 transition-transform duration-700 ease-66 group-hover:scale-[1.05]">
          {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map(
            (pos) => (
              <span
                key={pos}
                aria-hidden
                className={cn("absolute font-mono-2 text-l4 leading-none", pos)}
              >
                +
              </span>
            ),
          )}
          <div className="flex flex-col items-center gap-3 border border-dashed border-l4 px-8 py-6 lg:px-12 lg:py-8">
            {Icon && <Icon className="size-8 lg:size-10" />}
            <span className="font-mono-2 uppercase tracking-wide text-xs">
              No.{item.no} — {item.code}
            </span>
            <span className="font-mono-2 uppercase text-[10px] text-l4">
              in the lab
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkCard({ item }: { item: WorkItem }) {
  const external = item.external ?? item.href.startsWith("http");
  return (
    <article className={item.cols}>
      <a
        href={item.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        aria-label={`${item.title} - ${item.years}${external ? " (external)" : ""}`}
        className={cn(
          "group block space-y-3 p-2",
          item.fill && "lg:flex lg:h-full lg:flex-col",
        )}
      >
        <div
          className={cn(
            "relative w-full pointer-events-none select-none",
            item.fill && "lg:flex-1 lg:min-h-0",
          )}
        >
          {item.badge && (
            <span className="top-0 right-0 z-10 absolute bg-selection px-1 font-mono-2 text-black text-xs lg:text-sm">
              {item.badge}
            </span>
          )}
          <Cover item={item} />
        </div>
        <div className="flex justify-between items-center gap-3 min-w-0 text-xs lg:text-sm uppercase">
          <span className="flex-1 min-w-0 truncate">{item.title}</span>
          <div className="flex items-center gap-2 sm:gap-3 font-mono-2 tabular-nums whitespace-nowrap shrink-0">
            <span>{item.years}</span>
            {item.tag && (
              <span className="hidden lg:inline-flex items-center gap-1 text-l2">
                {item.tag} <span aria-hidden>↗</span>
              </span>
            )}
          </div>
        </div>
      </a>
    </article>
  );
}

export function WorkGrid() {
  return (
    <section
      id="work"
      className="px-4 lg:px-14 py-18 lg:py-24 w-full space-y-16 lg:space-y-24"
    >
      <div className="grid grid-cols-12 w-full">
        <IntroFilm />
      </div>
      {workGroups.map((group) => (
        <div key={group.label}>
          <div className="flex items-center gap-3 p-2 mb-4 font-mono-2 text-xs lg:text-sm uppercase text-l3">
            <span>{group.label}</span>
            <span aria-hidden className="flex-1 border-t border-line" />
          </div>
          <div className="grid grid-cols-12 w-full gap-y-10 lg:gap-y-12">
            {group.items.map((item) => (
              <WorkCard key={item.no} item={item} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
