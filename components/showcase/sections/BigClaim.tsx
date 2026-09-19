"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/easing";
import { CLAIM } from "@/lib/showcase";

export default function BigClaim() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-line]", {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.08,
          ease: EASE.reveal,
          scrollTrigger: { trigger: "[data-headline]", start: "top 78%", once: true },
        });
        gsap.from("[data-fade]", {
          autoAlpha: 0,
          y: 30,
          duration: 1,
          stagger: 0.1,
          ease: EASE.reveal,
          scrollTrigger: { trigger: "[data-fade]", start: "top 88%", once: true },
        });
        // Gentle counter-drift so the type feels layered over the rising product.
        gsap.to("[data-headline]", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="claim" ref={root} aria-labelledby="claim-title" className="relative min-h-[150svh] px-5 md:px-10">
      <div className="mx-auto max-w-[1440px] pt-[26svh] md:pt-[27svh]">
        <h2
          id="claim-title"
          data-headline
          className="text-center font-sans text-[clamp(4rem,17vw,17rem)] font-semibold uppercase leading-[0.84] tracking-[-0.055em] text-bone"
        >
          {CLAIM.lines.map((line, index) => (
            <span key={line} className="block overflow-hidden pb-[0.04em]">
              <span data-line className={`block ${index === 1 ? "text-gold" : ""}`}>
                {line}
              </span>
            </span>
          ))}
        </h2>
      </div>

      <div className="mx-auto mt-[66svh] grid max-w-[1440px] gap-6 pb-16 md:mt-[34svh] md:grid-cols-2 md:items-end">
        <p data-fade className="max-w-sm text-[15px] leading-relaxed text-bone/85 md:text-base">
          {CLAIM.caption}
        </p>
        <p data-fade className="max-w-xs text-[11px] leading-relaxed tracking-wide text-mist md:justify-self-end md:text-right">
          {CLAIM.footnote}
        </p>
      </div>
    </section>
  );
}
