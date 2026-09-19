"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/easing";
import { FACTS, type FactCard } from "@/lib/showcase";

function Icon({ name }: { name: FactCard["icon"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 48 48" className="size-11" aria-hidden="true">
      {name === "leaf" && (
        <g {...common}>
          <path d="M10 38C10 20 22 9 40 8c0 18-11 30-30 30Z" />
          <path d="M10 38 30 18M18 30h9M22 26v-8" />
        </g>
      )}
      {name === "drop" && (
        <g {...common}>
          <path d="M24 7s12 13 12 22a12 12 0 0 1-24 0C12 20 24 7 24 7Z" />
          <path d="M9 39 39 9" />
        </g>
      )}
      {name === "bubble" && (
        <g {...common}>
          <circle cx="18" cy="26" r="10" />
          <circle cx="33" cy="15" r="6" />
          <circle cx="34" cy="33" r="4" />
          <path d="M13 23a6 6 0 0 1 5-4" />
        </g>
      )}
      {name === "bottle" && (
        <g {...common}>
          <path d="M18 17h12v4a4 4 0 0 1 3 4v16a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V25a4 4 0 0 1 3-4v-4Z" />
          <path d="M21 17v-5h6v5M27 9h-8M15 30h18" />
        </g>
      )}
    </svg>
  );
}

export default function FeatureCards() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-heading] > *", {
          autoAlpha: 0,
          y: 30,
          duration: 1,
          stagger: 0.08,
          ease: EASE.reveal,
          scrollTrigger: { trigger: "[data-heading]", start: "top 85%", once: true },
        });

        const cards = gsap.utils.toArray<HTMLElement>("[data-fact]");
        gsap.fromTo(
          cards,
          { y: 60, autoAlpha: 0, clipPath: "inset(18% 0% 0% 0% round 22px)" },
          {
            y: 0,
            autoAlpha: 1,
            clipPath: "inset(0% 0% 0% 0% round 22px)",
            duration: 1.2,
            stagger: 0.12,
            ease: EASE.reveal,
            scrollTrigger: { trigger: "[data-facts]", start: "top 80%", once: true },
          },
        );

        cards.forEach((card, index) => {
          const number = card.querySelector<HTMLElement>("[data-count]");
          const fact = FACTS[index];
          if (!number || !fact) return;
          const counter = { value: fact.from };
          number.textContent = String(fact.from);
          gsap.to(counter, {
            value: fact.to,
            duration: 1.8,
            delay: 0.25 + index * 0.12,
            ease: "power2.out",
            onUpdate: () => {
              number.textContent = String(Math.round(counter.value));
            },
            scrollTrigger: { trigger: "[data-facts]", start: "top 80%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="ingredients" ref={root} aria-labelledby="ingredients-title" className="relative bg-ink px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div data-heading className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">Ingredients</p>
            <h2
              id="ingredients-title"
              className="mt-4 font-sans text-[clamp(2.4rem,5.6vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-bone"
            >
              Small list.{" "}
              <span className="font-display font-medium italic tracking-[-0.01em] text-gold">Big difference.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-mist">
            What goes into Pro-Vitamin Shampoo — and, just as importantly, what stays out.
          </p>
        </div>

        <ul data-facts className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4 lg:gap-5">
          {FACTS.map((fact) => (
            <li
              key={fact.fact}
              data-fact
              className="relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-[22px] bg-cream p-6 text-cocoa sm:min-h-[340px] md:min-h-[400px] md:p-8"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cocoa/75">{fact.fact}</span>
                <span className="text-bronze">
                  <Icon name={fact.icon} />
                </span>
              </div>
              <div>
                <p className="font-sans text-[clamp(5rem,9vw,9rem)] font-bold leading-[0.8] tracking-[-0.06em] text-bronze">
                  <span data-count className="tabular-nums">
                    {fact.to}
                  </span>
                  {fact.suffix && <span className="ml-1 text-[0.32em] tracking-normal">{fact.suffix}</span>}
                </p>
                <p className="mt-5 border-t border-dotted border-cocoa/30 pt-4 text-[13px] leading-relaxed text-cocoa/75">
                  {fact.caption}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
