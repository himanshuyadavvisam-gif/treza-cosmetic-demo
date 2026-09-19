"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/easing";
import { getActiveSection, subscribeActiveSection } from "@/lib/scrollStore";
import { SECTION_LABELS, SHOWCASE_NAV } from "@/lib/showcase";
import { NAV_LINKS } from "@/lib/data";
import { shopHref } from "@/lib/config";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Fixed top nav with a scroll-spy underline that glides between links. */
export default function Nav() {
  const active = useSyncExternalStore(subscribeActiveSection, getActiveSection, () => "top" as const);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const linksRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useIsoLayoutEffect(() => {
    const underline = underlineRef.current;
    const links = linksRef.current;
    if (!underline || !links) return;
    const move = () => {
      const link = links.querySelector<HTMLElement>(`[data-nav="${active}"]`);
      if (!link) {
        gsap.to(underline, { autoAlpha: 0, duration: 0.4, ease: EASE.glide });
        return;
      }
      gsap.to(underline, {
        x: link.offsetLeft,
        width: link.offsetWidth,
        autoAlpha: 1,
        duration: 0.8,
        ease: EASE.glide,
      });
    };
    move();
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [active]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open ? "border-b border-gold/10 bg-ink/70 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-20 md:px-10">
        <a href="#top" className="flex flex-col leading-none" aria-label="Treza Cosmetic — back to top">
          <span className="font-display text-2xl font-semibold tracking-[0.34em] text-bone md:text-[26px]">TREZA</span>
          <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.5em] text-gold">Cosmetic</span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <div ref={linksRef} className="relative flex items-center gap-9">
            {SHOWCASE_NAV.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                data-nav={link.id}
                aria-current={active === link.id ? "location" : undefined}
                className={`py-2 text-[11px] font-semibold uppercase tracking-[0.28em] transition-colors hover:text-gold ${
                  active === link.id ? "text-bone" : "text-bone/60"
                }`}
              >
                {link.label}
              </a>
            ))}
            <span
              ref={underlineRef}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-gold opacity-0"
            />
          </div>
        </nav>

        <div className="flex items-center gap-1">
          <a
            href={shopHref("/cart")}
            aria-label="View cart"
            className="grid size-11 place-items-center rounded-full text-bone transition-colors hover:text-gold"
          >
            <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center rounded-full text-bone md:hidden"
          >
            <span className="relative block h-3.5 w-6" aria-hidden="true">
              <span className={`absolute left-0 h-px w-6 bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-px w-6 bg-current transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="border-t border-gold/10 bg-ink/95 px-5 pb-8 pt-2 backdrop-blur-xl md:hidden">
        <nav aria-label="Mobile" className="flex flex-col">
          {SHOWCASE_NAV.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setOpen(false)}
              className="border-b border-gold/10 py-4 font-display text-3xl text-bone transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist hover:text-gold">
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      <p aria-live="polite" className="sr-only">
        {`Now viewing: ${SECTION_LABELS[active]}`}
      </p>
    </header>
  );
}
