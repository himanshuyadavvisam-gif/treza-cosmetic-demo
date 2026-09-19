"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { HERO_PRODUCTS } from "@/lib/data";
import { shopHref } from "@/lib/config";

type Slot = {
  /** Horizontal offset as a fraction of half the scene width. */
  nx: number;
  /** Vertical offset as a fraction of half the scene height. */
  ny: number;
  /** Starting depth (negative = far from the camera). */
  z: number;
  /** Resting roll and yaw, in degrees. */
  rz: number;
  ry: number;
};

const SLOTS_DESKTOP: Slot[] = [
  { nx: 0.75, ny: 0.04, z: -450, rz: 5, ry: -18 },
  { nx: -0.62, ny: -0.1, z: -2500, rz: -6, ry: 18 },
  { nx: 0.55, ny: 0.12, z: -3400, rz: 4, ry: -16 },
  { nx: -0.5, ny: -0.06, z: -4300, rz: -5, ry: 16 },
  { nx: 0.46, ny: -0.1, z: -5200, rz: 6, ry: -14 },
  { nx: -0.44, ny: 0.1, z: -6100, rz: -4, ry: 14 },
];

const SLOTS_MOBILE: Slot[] = [
  { nx: 0.3, ny: 0.72, z: -450, rz: 5, ry: -16 },
  { nx: -0.34, ny: -0.08, z: -2500, rz: -6, ry: 16 },
  { nx: 0.3, ny: 0.3, z: -3400, rz: 4, ry: -14 },
  { nx: -0.3, ny: -0.1, z: -4300, rz: -5, ry: 14 },
  { nx: 0.28, ny: 0.24, z: -5200, rz: 6, ry: -12 },
  { nx: -0.28, ny: -0.06, z: -6100, rz: -4, ry: 12 },
];

/** Depth at which a card starts / finishes fading in, and starts / finishes fading out as it passes the camera. */
const FADE_IN: [number, number] = [-2300, -1500];
const FADE_OUT: [number, number] = [100, 600];
/** How far the camera dollies forward over the full scroll. */
const TRAVEL = 6500;

const clamp01 = gsap.utils.clamp(0, 1);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
      const world = el.querySelector<HTMLElement>("[data-world]");
      const copy = el.querySelector<HTMLElement>("[data-copy]");
      const outro = el.querySelector<HTMLElement>("[data-outro]");
      const mark = el.querySelector<HTMLElement>("[data-mark]");
      const cue = el.querySelector<HTMLElement>("[data-cue]");
      const bar = el.querySelector<HTMLElement>("[data-bar]");
      if (!world || !copy || !outro || !mark || !cue || !bar) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduce } = context.conditions as Record<"desktop" | "mobile" | "reduce", boolean>;
          const isMobile = window.innerWidth < 768;
          const slots = isMobile ? SLOTS_MOBILE : SLOTS_DESKTOP;
          const metrics = { hw: el.clientWidth / 2, hh: el.clientHeight / 2 };

          gsap.set(cards, { xPercent: -50, yPercent: -50 });

          /* Reduced motion: a calm, static composition — no pinning, no depth travel. */
          if (reduce) {
            // Desktop: two products flanking the centred copy. Mobile: one product beneath it.
            const layout = isMobile ? [{ x: 0, y: 0.74, scale: 0.8 }] : [{ x: -0.64, y: 0.04, scale: 0.9 }, { x: 0.64, y: 0.04, scale: 0.9 }];
            cards.forEach((card, index) => {
              const spot = layout[index];
              if (!spot) {
                gsap.set(card, { autoAlpha: 0 });
                return;
              }
              gsap.set(card, { x: spot.x * metrics.hw, y: spot.y * metrics.hh, z: 0, scale: spot.scale, autoAlpha: 1 });
            });
            gsap.set([outro, cue], { autoAlpha: 0 });
            return;
          }

          const state = { p: 0 };

          const render = () => {
            const { p } = state;
            const worldZ = p * TRAVEL;

            cards.forEach((card, index) => {
              const slot = slots[index];
              const z = slot.z + worldZ;
              const fadeIn = clamp01((z - FADE_IN[0]) / (FADE_IN[1] - FADE_IN[0]));
              const fadeOut = 1 - clamp01((z - FADE_OUT[0]) / (FADE_OUT[1] - FADE_OUT[0]));

              gsap.set(card, {
                x: slot.nx * metrics.hw,
                y: slot.ny * metrics.hh,
                z,
                rotationZ: slot.rz * clamp01(-z / 1800),
                rotationY: slot.ry * clamp01(-z / 1800),
                autoAlpha: Math.min(fadeIn, fadeOut),
              });
            });

            const leave = clamp01((p - 0.06) / 0.14);
            gsap.set(copy, { autoAlpha: 1 - leave, y: -70 * leave });

            const arrive = clamp01((p - 0.88) / 0.09);
            gsap.set(outro, { autoAlpha: arrive, y: (1 - arrive) * 30 });

            gsap.set(cue, { autoAlpha: 1 - clamp01(p / 0.04) });
            gsap.set(mark, { scale: 1 + p * 0.9 });
            gsap.set(bar, { scaleX: p });
          };

          render();

          gsap.to(state, {
            p: 1,
            ease: "none",
            onUpdate: render,
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=460%",
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: () => {
                metrics.hw = el.clientWidth / 2;
                metrics.hh = el.clientHeight / 2;
                render();
              },
            },
          });

          /* Subtle pointer parallax on the whole scene (desktop / fine pointers only). */
          if (desktop && window.matchMedia("(hover: hover)").matches) {
            const tiltY = gsap.quickTo(world, "rotationY", { duration: 0.9, ease: "power3.out" });
            const tiltX = gsap.quickTo(world, "rotationX", { duration: 0.9, ease: "power3.out" });
            const shiftMark = gsap.quickTo(mark, "x", { duration: 1.2, ease: "power3.out" });

            const onMove = (event: PointerEvent) => {
              const nx = event.clientX / window.innerWidth - 0.5;
              const ny = event.clientY / window.innerHeight - 0.5;
              tiltY(nx * 6);
              tiltX(-ny * 4);
              shiftMark(nx * -40);
            };

            el.addEventListener("pointermove", onMove);
            return () => el.removeEventListener("pointermove", onMove);
          }
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-label="Treza Cosmetic — Ayurveda and science"
      className="relative isolate h-svh w-full overflow-hidden bg-ink"
    >
      {/* Ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_50%_at_50%_42%,rgba(216,182,115,0.17),transparent_70%),radial-gradient(45%_35%_at_50%_100%,rgba(169,128,58,0.2),transparent_70%)]"
      />

      {/* Giant outlined wordmark that drifts and grows as the camera moves */}
      <div
        aria-hidden="true"
        data-mark
        className="pointer-events-none absolute inset-0 -z-10 flex select-none items-center justify-center font-display text-[34vw] font-medium leading-none tracking-[0.06em] text-transparent [-webkit-text-stroke:1px_rgba(216,182,115,0.15)] md:text-[26vw]"
      >
        TREZA
      </div>

      {/* 3D depth scene */}
      <div aria-hidden="true" className="absolute inset-0 [perspective:1200px]">
        <div data-world className="absolute inset-0 [transform-style:preserve-3d]">
          {HERO_PRODUCTS.map((product, index) => (
            <div
              key={product.handle}
              data-card
              className="absolute left-1/2 top-1/2 w-[42vw] max-w-[200px] opacity-0 will-change-transform md:w-[19vw] md:min-w-[200px] md:max-w-[300px]"
            >
              <div className="animate-float" style={{ animationDelay: `${index * -1.4}s` }}>
                <div className="relative aspect-[3/4]">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    preload={index < 2}
                    sizes="(min-width: 768px) 20vw, 46vw"
                    className="product-cutout object-contain"
                  />
                </div>
                <p className="mt-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.26em] text-gold">
                  {product.category}
                </p>
                <p className="mt-1 text-center font-display text-xl text-bone md:text-2xl">{product.shortTitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opening copy */}
      <div
        data-copy
        className="absolute inset-x-0 top-[15%] z-10 mx-auto flex max-w-[640px] flex-col items-center px-6 text-center md:top-1/2 md:-translate-y-1/2"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-gold">Ayurveda + Science</p>
        <h1 className="mt-5 font-display text-[clamp(2.7rem,7.2vw,5.6rem)] font-medium leading-[0.98] text-bone">
          Ancient Ayurveda.
          <br />
          <span className="gold-text italic">Modern science.</span>
        </h1>
        <p className="mt-6 max-w-[30rem] text-[15px] leading-relaxed text-bone/75 md:text-base">
          Dermatologist tested, cruelty free and safe for every skin type — skin, hair and body care crafted by Treza
          Cosmetic.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={shopHref("/collections/bestseller")}
            className="rounded-full bg-gradient-to-b from-[#ecd08f] to-[#b98c45] px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-ink shadow-[0_10px_40px_-10px_rgba(216,182,115,0.6)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Shop Best Sellers
          </a>
          <a
            href={shopHref("/collections/new-launch")}
            className="rounded-full border border-gold/40 px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-bone transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            New Launches
          </a>
        </div>
      </div>

      {/* Closing line as the camera exits the scene */}
      <div
        data-outro
        className="pointer-events-none absolute inset-x-0 bottom-[11%] z-10 flex flex-col items-center px-6 text-center opacity-0"
      >
        <p className="font-display text-3xl italic text-bone md:text-5xl">
          Meet the <span className="gold-text">range</span>
        </p>
        <span aria-hidden="true" className="mt-4 text-gold">
          ↓
        </span>
      </div>

      {/* Scroll cue + progress */}
      <div data-cue aria-hidden="true" className="absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-mist">Scroll</span>
        <span className="block h-10 w-px animate-cue bg-gold/70" />
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 h-[2px] bg-gold/10">
        <div data-bar className="h-full origin-left bg-gradient-to-r from-gold-deep to-gold" style={{ transform: "scaleX(0)" }} />
      </div>
    </section>
  );
}
