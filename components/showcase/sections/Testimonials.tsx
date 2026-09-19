"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/easing";
import { pulseStage } from "@/lib/scrollStore";
import { PROMISES, REVIEWS, type Testimonial } from "@/lib/showcase";

function Quote({ item }: { item: Testimonial }) {
  const at = item.quote.indexOf(item.highlight);
  if (at < 0) return <>{item.quote}</>;
  return (
    <>
      {item.quote.slice(0, at)}
      <mark className="bg-transparent text-inherit transition-colors duration-700 [.is-active_&]:text-gold motion-reduce:text-gold">
        {item.highlight}
      </mark>
      {item.quote.slice(at + item.highlight.length)}
    </>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <p className="flex gap-1" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`size-4 transition-[fill,color] duration-500 ${index < rating ? "text-gold" : "text-bone/25"} fill-transparent stroke-current [.is-active_&]:fill-current`}
          style={{ transitionDelay: `${index * 90}ms` }}
        >
          <path strokeWidth="1.2" d="m10 1.8 2.5 5.3 5.7.7-4.2 3.9 1.1 5.7L10 14.6l-5.1 2.8L6 11.7 1.8 7.8l5.7-.7L10 1.8Z" />
        </svg>
      ))}
    </p>
  );
}

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const isReviews = REVIEWS.length > 0;
  const rows = isReviews ? REVIEWS : PROMISES;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-row]", el);
      const media = gsap.utils.toArray<HTMLElement>("[data-media]", el);
      let current = -1;

      const activate = (index: number) => {
        if (index === current) return;
        items.forEach((item, i) => item.classList.toggle("is-active", i === index));
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        media.forEach((m, i) => {
          if (i === index) {
            gsap.fromTo(
              m,
              { clipPath: "inset(0% 0% 100% 0%)", zIndex: 2 },
              { clipPath: "inset(0% 0% 0% 0%)", duration: reduce ? 0 : 0.9, ease: EASE.section, overwrite: true },
            );
          } else {
            gsap.set(m, { zIndex: i === current ? 1 : 0 });
          }
        });
        if (current !== -1) pulseStage();
        current = index;
      };
      activate(0);

      items.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 58%",
          end: "bottom 58%",
          onToggle: (self) => {
            if (self.isActive) activate(index);
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="promise" ref={root} aria-labelledby="promise-title" className="relative px-5 py-24 wide:px-10 wide:py-36">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">{isReviews ? "Reviews" : "The promise"}</p>
        <h2
          id="promise-title"
          className="mt-4 font-sans text-[clamp(2.4rem,5.6vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-bone"
        >
          {isReviews ? "Loved on " : "What it's "}
          <span className="font-display font-medium italic tracking-[-0.01em] text-gold">{isReviews ? "every shelf." : "made to do."}</span>
        </h2>

        <div className="mt-14 grid gap-10 wide:mt-20 wide:grid-cols-[5fr_3fr_2fr]">
          <ol className="border-t border-dotted border-bone/25">
            {rows.map((item, index) => (
              <li
                key={item.quote}
                data-row
                className={`border-b border-dotted border-bone/25 py-9 opacity-35 transition-opacity duration-700 wide:py-14 [&.is-active]:opacity-100 motion-reduce:opacity-100 ${
                  index === 0 ? "is-active" : ""
                }`}
              >
                <figure>
                  {item.rating !== undefined && <Stars rating={item.rating} />}
                  <blockquote className="mt-4 font-display text-[clamp(1.6rem,2.8vw,2.7rem)] leading-[1.12] text-bone">
                    <p>
                      “<Quote item={item} />”
                    </p>
                  </blockquote>
                  <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.24em]">
                    <span className="text-bone">{item.name}</span>
                    <span className="text-mist">{item.meta}</span>
                  </figcaption>
                </figure>
                <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-[14px] wide:hidden">
                  <Image src={item.media} alt={item.mediaAlt} fill sizes="90vw" className="object-cover" />
                </div>
              </li>
            ))}
          </ol>

          <div aria-hidden="true" className="hidden wide:block" />

          <div className="hidden wide:block">
            <div className="sticky top-[24svh] aspect-[4/5] overflow-hidden rounded-[18px] bg-ink-3">
              {rows.map((item, index) => (
                <div key={item.media} data-media className="absolute inset-0" style={{ zIndex: index === 0 ? 2 : 0 }}>
                  <Image src={item.media} alt={item.mediaAlt} fill sizes="20vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
