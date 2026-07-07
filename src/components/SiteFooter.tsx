import { footer } from "@/lib/content";

const rowCls =
  "gap-2 grid grid-cols-12 font-bold text-[7.2svw] lg:text-[6svw] xl:text-[5.6svw] 2xl:text-[5svw] leading-[1.05]";

const linkCls =
  "block relative p-2 before:content-[''] before:absolute before:inset-0 before:border-2 before:border-transparent lg:hover:before:border-l1";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="z-10 relative flex flex-col justify-center p-6 lg:p-16 w-full min-h-dvh"
    >
      <div className={rowCls}>
        <span className="col-span-6 md:col-span-5 xl:col-span-4 md:col-start-2 xl:col-start-3 text-left">
          {footer.lines.row1Left}
        </span>
        <span className="col-span-6 md:col-span-5 xl:col-span-4 text-right">
          {footer.lines.row1Right}
        </span>
      </div>
      <div className={rowCls}>
        <span className="col-span-12 md:col-start-2 xl:col-start-3 text-left">
          {footer.lines.row2}
        </span>
      </div>
      <div className={rowCls}>
        <span className="col-span-12 md:col-end-12 xl:col-end-11 text-right">
          {footer.lines.row3}
        </span>
      </div>
      <div className="absolute inset-0 flex flex-col justify-end px-4 lg:px-14 py-18 pointer-events-none">
        <div className="flex lg:flex-row flex-col justify-between w-full font-mono-2 pointer-events-auto">
          <a href={`mailto:${footer.email}`} className={linkCls}>
            {footer.email}
          </a>
          <div className="flex flex-row items-center gap-2 lg:gap-4">
            {footer.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={linkCls}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
