"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/easing";
import { MEGA } from "@/lib/showcase";

export default function MegaType() {
  const root = useRef<HTMLElement>(null);
  const letters = Array.from(MEGA.word.toUpperCase());

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-letter]",
          { yPercent: 105, clipPath: "inset(100% 0% 0% 0%)" },
          {
            yPercent: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            stagger: 0.02,
            ease: EASE.reveal,
            scrollTrigger: { trigger: "[data-word]", start: "top 88%", end: "top 40%", scrub: 1 },
          },
        );
        gsap.from("[data-fade]", {
          autoAlpha: 0,
          y: 24,
          duration: 1,
          stagger: 0.1,
          ease: EASE.reveal,
          scrollTrigger: { trigger: "[data-word]", start: "top 70%", once: true },
        });
        gsap.fromTo(
          "[data-texture]",
          { scale: 1.15 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="ayurveda" ref={root} aria-labelledby="ayurveda-title" className="theme-dark relative overflow-hidden bg-ink py-28 md:py-44">
      <div data-texture className="absolute inset-0">
        <Image src="/showcase/macro-silk.webp" alt="" fill sizes="100vw" className="object-cover opacity-60" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink via-ink/30 to-ink" />

      <div className="relative">
        <p data-fade className="text-center text-[11px] font-semibold uppercase tracking-[0.5em] text-gold">
          {MEGA.eyebrow}
        </p>
        <h2 id="ayurveda-title" data-word className="mt-6 text-center">
          <span className="sr-only">
            {MEGA.eyebrow} {MEGA.word}
          </span>
          <span
            aria-hidden="true"
            className="mega-word flex justify-center whitespace-nowrap font-sans text-[19vw] font-bold uppercase leading-[0.86] tracking-[-0.05em]"
            style={{ "--n": letters.length } as CSSProperties}
          >
            {letters.map((letter, index) => (
              <span key={index} className="inline-block overflow-hidden pb-[0.06em]">
                <span data-letter className="mega-letter inline-block" style={{ "--i": index } as CSSProperties}>
                  {letter}
                </span>
              </span>
            ))}
          </span>
        </h2>
        <p data-fade className="mx-auto mt-10 max-w-lg px-5 text-center text-[15px] leading-relaxed text-bone/85 md:text-base">
          {MEGA.body}
        </p>
      </div>
    </section>
  );
}
