import Reveal from "@/components/ui/Reveal";
import { CATEGORIES } from "@/lib/data";

export default function Categories() {
  return (
    <section id="categories" aria-labelledby="categories-title" className="bg-ink px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">Explore</p>
          <h2
            id="categories-title"
            className="mt-4 font-display text-[clamp(2.4rem,6vw,5rem)] font-medium leading-none text-bone"
          >
            Shop by <span className="gold-text italic">category</span>
          </h2>
        </Reveal>

        <ul className="mt-14 border-t border-gold/15 md:mt-20">
          {CATEGORIES.map((category, index) => (
            <Reveal as="li" key={category.name} className="border-b border-gold/15" delay={index * 0.06} y={24}>
              <a
                href={category.href}
                className="group relative flex items-center justify-between gap-6 overflow-hidden py-8 md:py-12"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-0 origin-left scale-x-0 bg-gradient-to-r from-gold/15 to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100"
                />
                <span className="relative flex items-baseline gap-5 md:gap-10">
                  <span aria-hidden="true" className="font-display text-lg text-gold md:text-2xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[clamp(2.2rem,6vw,5rem)] leading-none text-bone transition-transform duration-500 group-hover:translate-x-3 md:group-hover:translate-x-5">
                    {category.name}
                  </span>
                </span>
                <span className="relative hidden max-w-[16rem] text-right text-sm text-mist md:block">{category.note}</span>
                <span
                  aria-hidden="true"
                  className="relative grid size-11 shrink-0 place-items-center rounded-full border border-gold/30 text-gold transition-all duration-500 group-hover:rotate-[-45deg] group-hover:bg-gold group-hover:text-ink md:size-14"
                >
                  →
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
