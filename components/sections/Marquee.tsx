import { MARQUEE_ITEMS } from "@/lib/data";

/** Infinite trust ticker. The list is rendered twice so the -50% translate loops seamlessly. */
export default function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section aria-label="Why customers choose Treza" className="overflow-hidden border-b border-gold/10 bg-ink py-6 md:py-8">
      <div className="flex w-max animate-marquee items-center motion-reduce:animate-none">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            aria-hidden={index >= MARQUEE_ITEMS.length ? "true" : undefined}
            className="flex items-center gap-8 whitespace-nowrap pr-8 font-display text-3xl italic text-bone/85 md:gap-12 md:pr-12 md:text-5xl"
          >
            {item}
            <span aria-hidden="true" className="text-lg text-gold not-italic">
              ✦
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
