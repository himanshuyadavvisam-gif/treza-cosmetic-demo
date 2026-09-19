"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/easing";
import { HERO } from "@/lib/showcase";
import { productHref } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import ScrollHint from "@/components/showcase/ui/ScrollHint";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: EASE.reveal } });
        tl.from("[data-line]", { yPercent: 110, duration: 1.3, stagger: 0.08 }, 0.15)
          .from("[data-fade]", { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08 }, 0.55)
          .from("[data-scroll-hint]", { autoAlpha: 0, y: 12, duration: 0.8 }, 1.1);

        gsap.to("[data-scroll-hint]", {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=180", scrub: true },
        });
        gsap.to("[data-hero-copy]", {
          yPercent: -18,
          autoAlpha: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const product = HERO.product;

  return (
    <section id="top" ref={root} aria-labelledby="hero-title" className="relative h-svh min-h-[620px] overflow-hidden short:min-h-0">
      {/* Static product: instant LCP, and the fallback when WebGL / motion is off. */}
      <div className="stage-static pointer-events-none absolute left-1/2 top-[75%] h-[27.6svh] -translate-x-1/2 -translate-y-1/2 wide:left-[77.5%] wide:top-[52%] wide:h-[60svh]">
        <Image
          src={product.image}
          alt={product.imageAlt}
          width={598}
          height={1800}
          preload
          sizes="(min-width: 768px) 22vh, 14vh"
          className="product-cutout h-full w-auto object-contain"
        />
      </div>

      <div
        data-hero-copy
        className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col px-5 pb-24 pt-24 wide:justify-end wide:px-10 wide:pb-28 short:justify-center short:pb-6 short:pt-16"
      >
        <p data-fade className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold wide:text-[11px]">
          {HERO.eyebrow}
        </p>
        <h1
          id="hero-title"
          className="mt-4 max-w-[13ch] font-sans text-[clamp(2.6rem,6.4vw,6.6rem)] short:mt-2 short:text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.045em] text-bone wide:mt-6"
        >
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-line className="block">
              {HERO.titleLead}
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <span data-line className="block font-display font-medium italic tracking-[-0.02em] text-gold">
              {HERO.titleAccent}
            </span>
          </span>
        </h1>
        <p data-fade className="mt-5 max-w-md text-[15px] leading-relaxed text-mist max-md:[@media(max-height:700px)]:hidden wide:mt-7 wide:text-base">
          {HERO.body}
        </p>
        <div data-fade className="mt-7 short:mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={productHref(product)}
            className="inline-flex items-center gap-3 rounded-full bg-bone px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold"
          >
            Shop now — {formatPrice(product.price)}
            <span aria-hidden="true">→</span>
          </a>
          <a href="#formula" className="py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-bone/80 max-md:[@media(max-height:700px)]:hidden underline-offset-8 transition-colors hover:text-gold hover:underline">
            See the formula
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center wide:bottom-8 short:hidden">
        <ScrollHint />
      </div>
    </section>
  );
}
