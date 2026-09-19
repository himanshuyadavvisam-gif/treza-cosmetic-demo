import ProductCard from "@/components/ui/ProductCard";
import Reveal from "@/components/ui/Reveal";
import { PRODUCTS } from "@/lib/data";

export default function BestSellers() {
  return (
    <section id="best-sellers" aria-labelledby="best-sellers-title" className="bg-ink px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">The Edit</p>
            <h2
              id="best-sellers-title"
              className="mt-4 font-display text-[clamp(2.4rem,6vw,5rem)] font-medium leading-none text-bone"
            >
              Best <span className="gold-text italic">sellers</span>
            </h2>
          </div>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-20 md:grid-cols-4 md:gap-x-6 md:gap-y-16">
          {PRODUCTS.map((product, index) => (
            <Reveal as="li" key={product.handle} delay={(index % 4) * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
