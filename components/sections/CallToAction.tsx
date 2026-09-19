import Reveal from "@/components/ui/Reveal";
import { PROMO_CODE, PROMO_TEXT, shopHref } from "@/lib/config";

export default function CallToAction() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-ink px-5 py-28 md:px-10 md:py-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_50%,rgba(216,182,115,0.18),transparent_70%)]"
      />
      <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">Welcome offer</p>
        <h2
          id="cta-title"
          className="mt-5 font-display text-[clamp(2.6rem,7vw,5.6rem)] font-medium leading-[0.98] text-bone"
        >
          Begin your <span className="gold-text italic">ritual</span>
        </h2>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-bone/75 md:text-base">
          Use code{" "}
          <span className="rounded-md border border-gold/40 bg-gold/10 px-2.5 py-1 font-semibold tracking-[0.14em] text-gold">
            {PROMO_CODE}
          </span>{" "}
          for {PROMO_TEXT}.
        </p>
        <a
          href={shopHref("/collections/all")}
          className="mt-10 rounded-full bg-gradient-to-b from-[#ecd08f] to-[#b98c45] px-10 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-ink shadow-[0_10px_40px_-10px_rgba(216,182,115,0.6)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          Shop the collection
        </a>
      </Reveal>
    </section>
  );
}
