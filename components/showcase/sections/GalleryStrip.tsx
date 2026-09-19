"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/easing";
import { RITUAL } from "@/lib/showcase";
import { productHref } from "@/lib/data";
import DashedFrame from "@/components/showcase/ui/DashedFrame";

export default function GalleryStrip() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = el.querySelector<HTMLElement>("[data-track]");
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
        const labels = gsap.utils.toArray<HTMLElement>("[data-label]", el);
        const frame = el.querySelector<HTMLElement>("[data-frame]");
        if (!track || cards.length < 2) return;

        let step = 0;
        const measure = () => {
          step = cards[1].offsetLeft - cards[0].offsetLeft;
        };
        measure();

        let active = 0;
        gsap.set(labels.slice(1), { yPercent: 110, autoAlpha: 0 });
        const swapLabel = (next: number) => {
          if (next === active) return;
          const dir = next > active ? 1 : -1;
          gsap.to(labels[active], { yPercent: -110 * dir, autoAlpha: 0, duration: 0.6, ease: EASE.section, overwrite: true });
          gsap.fromTo(labels[next], { yPercent: 110 * dir, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: EASE.reveal, overwrite: true });
          if (frame) gsap.fromTo(frame, { scale: 0.94, autoAlpha: 0.3 }, { scale: 1, autoAlpha: 1, duration: 0.7, ease: EASE.reveal, overwrite: true });
          active = next;
        };

        const proxy = { p: 0 };
        const apply = () => {
          const pos = proxy.p * (cards.length - 1);
          gsap.set(track, { x: -pos * step });
          cards.forEach((card, index) => {
            const d = Math.min(Math.abs(index - pos), 1);
            gsap.set(card, { scale: 1 - 0.28 * d, autoAlpha: 1 - 0.6 * d });
          });
          swapLabel(Math.round(pos));
        };
        apply();

        gsap.to(proxy, {
          p: 1,
          ease: "none",
          onUpdate: apply,
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
            onRefresh: () => {
              measure();
              apply();
            },
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="ritual" ref={root} aria-labelledby="ritual-title" className="relative h-[300svh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-[10svh] md:pt-[14svh] motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <h2 id="ritual-title" className="sr-only">
          The Treza ritual — one shelf, every step
        </h2>

        <div className="absolute left-5 top-[12svh] z-10 md:left-10 md:top-[13svh] motion-reduce:static motion-reduce:mb-10 motion-reduce:px-5">
          <div className="relative grid overflow-hidden">
            {RITUAL.map((card) => (
              <p key={card.image} data-label className="[grid-area:1/1] not-first:invisible">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">{card.kicker}</span>
                <span className="mt-2 block font-display text-[clamp(2rem,4.2vw,4rem)] italic leading-[1.02] text-bone">
                  {card.line}
                </span>
              </p>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            data-frame
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 aspect-[4/5] w-[calc(62vw+28px)] -translate-x-1/2 -translate-y-1/2 md:w-[calc(24vw+40px)] motion-reduce:hidden"
          >
            <DashedFrame className="inset-0" />
          </div>
          <ul
            data-track
            className="flex items-center gap-[5vw] pl-[19vw] will-change-transform md:gap-[3vw] md:pl-[38vw] motion-reduce:snap-x motion-reduce:overflow-x-auto motion-reduce:px-5 motion-reduce:pb-4"
          >
            {RITUAL.map((card, index) => (
              <li key={card.image} data-card className="w-[62vw] shrink-0 md:w-[24vw] motion-reduce:snap-center">
                <a href={productHref(card.product)} className="group relative block">
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-[14px] bg-ink-3">
                    <Image
                      src={card.image}
                      alt={card.product.imageAlt}
                      fill
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="(min-width: 768px) 24vw, 62vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="absolute inset-x-0 top-full mt-10 flex items-baseline justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-bone/80">
                    <span>{card.product.shortTitle}</span>
                    <span className="text-gold">{String(index + 1).padStart(2, "0")}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
