"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/easing";
import { FORMULA, HERO } from "@/lib/showcase";
import Annotation from "@/components/showcase/ui/Annotation";

const NOTES = FORMULA.map((feature) => feature.note);
/** Where the annotation sits if the 3D stage is off (matches the static image below). */
const ANNOTATION_FALLBACK = { x: 0.69, y: 0.55, mobileX: 0.5, mobileY: 0.7 };

export default function PinnedScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const features = gsap.utils.toArray<HTMLElement>("[data-feature]", el);
        const notes = gsap.utils.toArray<SVGTextElement>("[data-anno-note]", el);
        const counter = el.querySelector<HTMLElement>("[data-counter]");

        gsap.set(features.slice(1), { autoAlpha: 0, y: 30 });
        gsap.set("[data-anno-draw]", { strokeDashoffset: 1 });
        gsap.set("[data-anno-line]", { autoAlpha: 0 });
        gsap.set("[data-anno-handle]", { scale: 0, transformOrigin: "50% 50%" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onEnter: () =>
              gsap.to("[data-anno-handle]", { scale: 1, duration: 0.6, stagger: 0.08, ease: EASE.pop, delay: 0.3, overwrite: true }),
            onLeaveBack: () => gsap.to("[data-anno-handle]", { scale: 0, duration: 0.3, overwrite: true }),
          },
        });

        tl.to("[data-anno-draw]", { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 0).to(
          "[data-anno-line]",
          { autoAlpha: 1, duration: 0.4 },
          0.1,
        );

        features.forEach((feature, index) => {
          if (index === 0) return;
          const at = index - 0.2;
          tl.to(features[index - 1], { autoAlpha: 0, y: -30, duration: 0.3, ease: "power2.in" }, at)
            .fromTo(feature, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, at + 0.25)
            .to(notes[index - 1], { opacity: 0, duration: 0.25 }, at)
            .to(notes[index], { opacity: 1, duration: 0.3 }, at + 0.25);
          if (counter) {
            tl.call(() => (counter.textContent = FORMULA[index].index), undefined, at + 0.25).call(
              () => (counter.textContent = FORMULA[index - 1].index),
              undefined,
              at + 0.24,
            );
          }
        });
        tl.to({}, { duration: 0.4 }, FORMULA.length - 0.4);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="formula" ref={root} aria-labelledby="formula-title" className="relative h-[280svh] wide:h-[420svh] motion-reduce:h-auto">
      <div className="sticky top-0 h-svh overflow-hidden motion-reduce:static motion-reduce:h-auto">
        <div className="stage-static pointer-events-none absolute left-1/2 top-[70%] h-[35svh] -translate-x-1/2 -translate-y-1/2 wide:left-[69%] wide:top-[55%] wide:h-[57svh] motion-reduce:hidden">
          <Image
            src={HERO.product.image}
            alt=""
            width={598}
            height={1800}
            sizes="(min-width: 768px) 20vh, 14vh"
            className="product-cutout h-full w-auto object-contain"
          />
        </div>

        <div className="motion-reduce:hidden">
          <Annotation notes={NOTES} fallback={ANNOTATION_FALLBACK} />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col px-5 pt-24 wide:justify-center wide:px-10 wide:pt-0 motion-reduce:h-auto motion-reduce:py-24">
          <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
            <span>The formula</span>
            <span aria-hidden="true" className="h-px w-10 bg-gold/50" />
            <span aria-hidden="true" className="tabular-nums text-bone/60 motion-reduce:hidden">
              <span data-counter>{FORMULA[0].index}</span> / {String(FORMULA.length).padStart(2, "0")}
            </span>
          </div>
          <h2 id="formula-title" className="sr-only">
            Inside the Pro-Vitamin Shampoo formula
          </h2>

          <div className="mt-6 grid max-w-xl short:mt-3 short:max-w-[48%] wide:mt-10 motion-reduce:gap-14">
            {FORMULA.map((feature, index) => (
              <article
                key={feature.index}
                data-feature
                className={`[grid-area:1/1] motion-reduce:[grid-area:auto] ${index > 0 ? "invisible motion-reduce:visible" : ""}`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-mist">
                  {feature.index} — {feature.eyebrow}
                </p>
                <h3 className="mt-3 font-sans text-[clamp(2.1rem,4.6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-bone">
                  {feature.title}
                </h3>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-mist wide:text-base">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
