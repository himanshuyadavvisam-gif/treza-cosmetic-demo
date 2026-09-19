"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const STATEMENT =
  "Where ancient Ayurvedic wisdom meets modern dermatology. Every Treza formula is dermatologist tested, cruelty free and made to feel as good as it performs.";

const PILLARS = [
  { title: "Ayurvedic roots", text: "Formulations inspired by time-honoured Ayurvedic ingredients and rituals." },
  { title: "Backed by science", text: "Dermatologically tested, so care is gentle and considered from the very first use." },
  { title: "Safe for every skin type", text: "Paraben free and hydrogen peroxide free, made for everyday confidence." },
] as const;

export default function Philosophy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: "[data-statement]", start: "top 78%", end: "bottom 48%", scrub: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="philosophy"
      aria-labelledby="philosophy-title"
      className="relative overflow-hidden bg-ink-2 px-5 py-28 md:px-10 md:py-44"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 size-[36rem] rounded-full bg-gold/10 blur-[140px]"
      />
      <div className="relative mx-auto max-w-7xl">
        <h2 id="philosophy-title" className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
          Our philosophy
        </h2>

        <p
          data-statement
          className="mt-8 font-display text-[clamp(2rem,5.4vw,4.6rem)] font-medium leading-[1.12] text-bone"
        >
          {STATEMENT.split(" ").map((word, index) => (
            <span key={`${word}-${index}`} data-word className="mr-[0.22em] inline-block">
              {word}
            </span>
          ))}
        </p>

        <div className="mt-20 grid gap-10 border-t border-gold/15 pt-12 md:mt-28 md:grid-cols-3 md:gap-12">
          {PILLARS.map((pillar, index) => (
            <div key={pillar.title}>
              <span aria-hidden="true" className="gold-text font-display text-5xl leading-none">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-display text-2xl text-bone md:text-3xl">{pillar.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist md:text-[15px]">{pillar.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
