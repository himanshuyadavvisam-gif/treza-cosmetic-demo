"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/easing";
import { BRAND, PROMO_CODE, PROMO_TEXT, SHOP_ANCHOR } from "@/lib/config";
import { FOOTER_LINKS } from "@/lib/data";
import { FOOTER_CTA } from "@/lib/showcase";
import LetterRoll from "@/components/showcase/ui/LetterRoll";

const ParticleField = dynamic(() => import("@/components/showcase/ui/ParticleField"), { ssr: false });

const COLUMNS = [
  { title: "Explore", links: FOOTER_LINKS.explore },
  { title: "Help", links: FOOTER_LINKS.support },
];

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const [particles, setParticles] = useState(false);

  // Only pull in the particle bundle when the footer gets close.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setParticles(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-line]", {
          yPercent: 110,
          duration: 1.3,
          stagger: 0.09,
          ease: EASE.reveal,
          scrollTrigger: { trigger: "[data-cta]", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="theme-dark relative z-1 overflow-hidden bg-ink-2 px-5 pb-10 pt-24 md:px-10 md:pt-36">
      <div aria-hidden="true" className="absolute inset-0">
        {particles && <ParticleField />}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgb(var(--glow)/0.22),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1440px]">
        <div data-cta>
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
            Use {PROMO_CODE} for {PROMO_TEXT}
          </p>
          <p className="mt-6 font-sans text-[clamp(3.4rem,12vw,13rem)] font-semibold leading-[0.86] tracking-[-0.055em] text-bone">
            <span className="block overflow-hidden pb-[0.04em]">
              <span data-line className="block">
                {FOOTER_CTA.lead}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-line className="block font-display font-medium italic tracking-[-0.02em] text-gold">
                {FOOTER_CTA.accent}
              </span>
            </span>
          </p>
          <a
            href={SHOP_ANCHOR}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-bone px-7 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
          >
            Shop Treza <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="mt-24 grid gap-14 border-t border-dotted border-bone/20 pt-14 sm:grid-cols-2 md:mt-32 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Treza Cosmetic</h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
              Ayurveda + Science. Dermatologist tested, cruelty free and safe for every skin type.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">{column.title}</h2>
              <ul className="mt-4 space-y-1">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <LetterRoll href={link.href} label={link.label} external={link.href.startsWith("http")} className="text-sm text-bone/75" />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-dotted border-bone/20 pt-8 text-sm text-mist md:flex-row md:items-center md:justify-between">
          <address className="not-italic">{BRAND.address}</address>
          <div className="flex flex-wrap items-center gap-6">
            <LetterRoll href={`mailto:${BRAND.email}`} label={BRAND.email} />
            <LetterRoll href={BRAND.instagram} label="@treza.care" external />
          </div>
        </div>
        <p className="mt-8 text-xs text-mist/70">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
