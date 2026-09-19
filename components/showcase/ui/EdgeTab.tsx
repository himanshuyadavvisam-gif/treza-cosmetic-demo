import { PROMO_CODE, PROMO_TEXT, shopHref } from "@/lib/config";

/** Thin cream tab on the right edge carrying the launch offer. */
export default function EdgeTab() {
  return (
    <a
      href={shopHref("/collections/all")}
      className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 rounded-l-md bg-bone px-2 py-4 text-[10px] font-bold uppercase tracking-[0.28em] text-ink shadow-[0_10px_30px_-10px_rgb(var(--shadow)/0.5)] transition-[padding,background-color] duration-300 [writing-mode:vertical-rl] hover:bg-gold hover:pr-3 md:block"
    >
      {PROMO_CODE} · {PROMO_TEXT.replace(" your first order", "")}
    </a>
  );
}
