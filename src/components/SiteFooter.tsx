import { footer } from "@/lib/content";

const linkCls =
  "block relative p-2 before:content-[''] before:absolute before:inset-0 before:border-2 before:border-transparent lg:hover:before:border-l1";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="z-10 relative flex flex-col justify-center p-6 lg:p-16 w-full min-h-dvh"
    >
      <p className="w-full text-center font-bold text-[6svw] lg:text-[4.6svw] leading-[1.15] text-balance">
        <span className="bg-selection px-[0.12em] text-black [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
          {footer.line}
        </span>
      </p>
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
