"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { CHAPTERS, productHref } from "@/lib/data";
import { formatPrice } from "@/lib/format";

/** Pinned scroll story: each chapter swaps a product and its copy in 3D while the page holds still. */
export default function Showcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const images = gsap.utils.toArray<HTMLElement>("[data-img]", el);
      const texts = gsap.utils.toArray<HTMLElement>("[data-text]", el);
      const bar = el.querySelector<HTMLElement>("[data-progress]");
      if (!bar || images.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const { motion } = context.conditions as Record<"motion" | "reduce", boolean>;

          const imgFrom = motion ? { autoAlpha: 0, scale: 0.86, rotationY: -28, y: 70 } : { autoAlpha: 0 };
          const imgTo = { autoAlpha: 1, scale: 1, rotationY: 0, y: 0, duration: 1, ease: "power2.out" };
          const imgOut = motion
            ? { autoAlpha: 0, scale: 1.08, rotationY: 28, y: -70, duration: 0.8, ease: "power2.in" }
            : { autoAlpha: 0, duration: 0.8 };
          const textFrom = motion ? { autoAlpha: 0, y: 50 } : { autoAlpha: 0 };
          const textTo = { autoAlpha: 1, y: 0, duration: 0.9, ease: "power2.out" };
          const textOut = motion ? { autoAlpha: 0, y: -50, duration: 0.7, ease: "power2.in" } : { autoAlpha: 0, duration: 0.7 };

          const STEP = 2.2;
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: `+=${images.length * 110}%`,
              scrub: 0.7,
              pin: true,
              anticipatePin: 1,
            },
          });

          gsap.set([images[0], texts[0]], { autoAlpha: 1 });

          images.forEach((image, index) => {
            const at = index * STEP;
            const last = index === images.length - 1;

            if (index > 0) {
              timeline.fromTo(image, imgFrom, imgTo, at);
              timeline.fromTo(texts[index], textFrom, textTo, at + 0.05);
            }
            if (!last) {
              timeline.to(image, imgOut, at + 1.5);
              timeline.to(texts[index], textOut, at + 1.4);
            }
          });

          timeline.to({}, { duration: 0.8 });
          timeline.fromTo(bar, { scaleY: 0 }, { scaleY: 1, ease: "none", duration: timeline.duration() }, 0);
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="story"
      aria-label="Featured products"
      className="relative h-svh overflow-hidden border-y border-gold/10 bg-ink-2"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_75%_50%,rgba(216,182,115,0.13),transparent_70%)]"
      />

      <div className="relative mx-auto grid h-full max-w-[1360px] grid-rows-[auto_auto] content-center gap-6 px-5 pb-8 pt-20 md:grid-cols-2 md:grid-rows-1 md:items-center md:gap-14 md:px-10 md:py-0">
        {/* Copy */}
        <div className="relative order-2 h-[36svh] md:order-1 md:h-[58svh]">
          {CHAPTERS.map((chapter, index) => (
            <div
              key={chapter.product.handle}
              data-text
              className={`absolute inset-0 flex flex-col justify-center ${index > 0 ? "invisible" : ""}`}
            >
              <span aria-hidden="true" className="gold-text font-display text-6xl leading-none md:text-[8.5rem]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.36em] text-gold md:mt-6">
                {chapter.eyebrow}
              </p>
              <h2 className="mt-3 font-display text-[clamp(1.9rem,4.4vw,3.8rem)] font-medium leading-[1.04] text-bone">
                {chapter.title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-mist md:mt-5 md:text-base">{chapter.body}</p>
              <a
                href={productHref(chapter.product)}
                className="group mt-5 inline-flex w-fit items-center gap-3 border-b border-gold/40 pb-1.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-bone transition-colors hover:border-gold hover:text-gold md:mt-8"
              >
                {chapter.product.shortTitle} — {formatPrice(chapter.product.price)}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          ))}
        </div>

        {/* Product stage */}
        <div className="relative order-1 h-[40svh] [perspective:1400px] md:order-2 md:h-[68svh]">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 aspect-square h-[92%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-dashed border-gold/25 md:h-[104%]"
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 aspect-square h-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/15 md:h-[80%]"
          />
          {CHAPTERS.map((chapter, index) => (
            <div
              key={chapter.product.handle}
              data-img
              className={`absolute left-1/2 top-0 aspect-[3/4] h-full -translate-x-1/2 will-change-transform ${index > 0 ? "invisible" : ""}`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={chapter.product.image}
                  alt={chapter.product.imageAlt}
                  fill
                  preload={index === 0}
                  sizes="(min-width: 768px) 34vw, 60vw"
                  className="product-cutout object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapter progress */}
      <div aria-hidden="true" className="absolute bottom-8 right-5 top-24 hidden w-px bg-gold/15 md:right-10 md:block">
        <div data-progress className="h-full w-full origin-top bg-gold" style={{ transform: "scaleY(0)" }} />
      </div>
    </section>
  );
}
