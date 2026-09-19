"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/easing";
import { getVariant, setVariant, subscribeVariant } from "@/lib/scrollStore";
import { VARIANTS } from "@/lib/showcase";
import { productHref } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import ScrollRail from "@/components/showcase/ui/ScrollRail";

export default function ProductChooser() {
  const root = useRef<HTMLElement>(null);
  const active = useSyncExternalStore(subscribeVariant, getVariant, () => 0);
  const variant = VARIANTS[active];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-rail-fill]", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });
        gsap.from("[data-fade]", {
          autoAlpha: 0,
          y: 30,
          duration: 1,
          stagger: 0.1,
          ease: EASE.reveal,
          scrollTrigger: { trigger: root.current, start: "top 60%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  useGSAP(
    () => {
      const marks = gsap.utils.toArray<HTMLElement>("[data-wordmark]");
      marks.forEach((mark, index) => {
        const on = index === active;
        gsap.to(mark, {
          autoAlpha: on ? 1 : 0,
          yPercent: on ? 0 : index < active ? -40 : 40,
          duration: on ? 0.9 : 0.5,
          ease: on ? EASE.reveal : "power2.in",
          overwrite: true,
        });
      });
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <section id="choose" ref={root} aria-labelledby="choose-title" className="relative h-[220svh] wide:h-[300svh] motion-reduce:h-auto">
      <div className="sticky top-0 h-svh overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        {/* Static fallback bottles (hidden once the 3D stage is running). */}
        <div className="stage-static pointer-events-none absolute left-1/2 top-[45%] h-[40svh] -translate-x-1/2 -translate-y-1/2 wide:top-[45%] wide:h-[60svh] motion-reduce:relative motion-reduce:left-auto motion-reduce:top-auto motion-reduce:mx-auto motion-reduce:h-[50svh] motion-reduce:w-fit motion-reduce:translate-x-0 motion-reduce:translate-y-0">
          {VARIANTS.map((item, index) => (
            <Image
              key={item.id}
              src={item.cutout}
              alt={index === active ? item.product.imageAlt : ""}
              width={598}
              height={1800}
              sizes="(min-width: 768px) 20vh, 16vh"
              className={`product-cutout h-full w-auto object-contain transition-opacity duration-700 ${
                index === active ? "opacity-100" : "absolute inset-0 opacity-0"
              }`}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col px-5 pt-20 wide:px-10 wide:pt-28 motion-reduce:h-auto">
          <div data-fade className="text-center wide:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">Choose your own</p>
            <h2 id="choose-title" className="mt-3 font-display text-[clamp(1.8rem,3.4vw,3.2rem)] italic leading-none text-bone">
              Two shampoos, one ritual.
            </h2>
          </div>

          <fieldset
            data-fade
            className="mt-auto mb-[calc(14vw+92px)] wide:absolute wide:left-10 wide:top-1/2 wide:mb-0 wide:w-[min(340px,28vw)] wide:-translate-y-1/2 short:top-auto short:bottom-[19svh] short:w-[46vw] short:translate-y-0 motion-reduce:static motion-reduce:mt-10 motion-reduce:translate-y-0"
          >
            <legend className="sr-only">Shampoo variant</legend>
            <div className="flex gap-2 wide:flex-col wide:gap-3 short:flex-row">
              {VARIANTS.map((item, index) => (
                <label
                  key={item.id}
                  className={`group relative flex flex-1 cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 transition-colors wide:gap-4 wide:px-5 wide:py-4 short:py-2 ${
                    index === active ? "border-gold/70 bg-ink/60" : "border-bone/15 bg-ink/30 hover:border-bone/40"
                  } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold`}
                >
                  <input
                    type="radio"
                    name="variant"
                    value={item.id}
                    checked={index === active}
                    onChange={() => setVariant(index)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="grid size-6 shrink-0 place-items-center rounded-full border border-bone/30 wide:size-7"
                    style={{ background: item.swatch }}
                  >
                    <span className={`size-2 rounded-full bg-bone transition-transform duration-300 ${index === active ? "scale-100" : "scale-0"}`} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-bold uppercase tracking-[0.14em] text-bone wide:text-[13px]">{item.name}</span>
                    <span className="mt-1 hidden text-[11px] leading-snug text-mist wide:block short:hidden">{item.tagline}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4 hidden items-center justify-between gap-4 wide:flex short:mt-2">
              <span className="text-lg font-semibold text-bone">{formatPrice(variant.product.price)}</span>
              <a
                href={productHref(variant.product)}
                className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold"
              >
                Shop {variant.name} <span aria-hidden="true">→</span>
              </a>
            </div>
            <p aria-live="polite" className="sr-only">
              {`${variant.name} selected, ${formatPrice(variant.product.price)}`}
            </p>
          </fieldset>
        </div>

        <ScrollRail labels={["0°", "180°", "360°"]} className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 wide:flex wide:right-14 motion-reduce:hidden" />

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[2svh] z-10 grid motion-reduce:static motion-reduce:mt-8">
          {VARIANTS.map((item, index) => (
            <p
              key={item.id}
              data-wordmark
              className={`[grid-area:1/1] whitespace-nowrap text-center font-sans text-[13.2vw] short:text-[16svh] font-bold uppercase leading-[0.8] tracking-[-0.055em] text-bone ${
                index === 0 ? "" : "invisible"
              }`}
            >
              {item.wordmark}
            </p>
          ))}
        </div>

        <a
          href={productHref(variant.product)}
          className="absolute inset-x-5 bottom-[calc(14vw+22px)] z-20 inline-flex items-center justify-center gap-2 rounded-full bg-bone py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ink wide:hidden motion-reduce:hidden"
        >
          Shop {variant.name} — {formatPrice(variant.product.price)}
        </a>
      </div>
    </section>
  );
}
