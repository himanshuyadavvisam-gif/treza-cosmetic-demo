import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { productHref, type Product } from "@/lib/data";

export default function ProductCard({ product, preload = false }: { product: Product; preload?: boolean }) {
  const onSale = typeof product.compareAt === "number" && product.compareAt > product.price;

  return (
    <a
      href={productHref(product)}
      className="group block rounded-[22px] focus-visible:outline-offset-4"
      aria-label={`${product.title}, ${formatPrice(product.price)}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[22px] border border-gold/15 bg-[radial-gradient(ellipse_at_50%_40%,#ffffff_0%,#eef1e5_100%)] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-gold/60 group-hover:shadow-[0_30px_60px_-20px_rgb(var(--shadow)/0.35)]">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          preload={preload}
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw"
          className="object-contain p-[9%] drop-shadow-[0_18px_22px_rgba(0,0,0,0.22)] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur">
            Sale
          </span>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/80">{product.category}</p>
          <h3 className="mt-1.5 font-display text-xl leading-tight text-bone md:text-2xl">{product.shortTitle}</h3>
        </div>
        <p className="flex shrink-0 flex-col items-end pt-4 text-right text-sm text-bone">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {onSale && <span className="mt-0.5 text-mist line-through">{formatPrice(product.compareAt as number)}</span>}
        </p>
      </div>
    </a>
  );
}
