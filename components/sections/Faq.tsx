import Reveal from "@/components/ui/Reveal";
import { FAQS } from "@/lib/data";

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-ink-2 px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">Help</p>
          <h2
            id="faq-title"
            className="mt-4 font-display text-[clamp(2.4rem,5.4vw,4.4rem)] font-medium leading-[1.02] text-bone"
          >
            Questions, <span className="gold-text italic">answered</span>
          </h2>
        </Reveal>

        <div className="border-t border-gold/15">
          {FAQS.map((item) => (
            <details key={item.q} name="faq" className="group border-b border-gold/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left font-display text-xl text-bone transition-colors hover:text-gold md:py-7 md:text-2xl [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="relative block size-6 shrink-0 text-gold before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-current after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-current after:transition-transform after:duration-300 group-open:after:rotate-90"
                />
              </summary>
              <p className="max-w-2xl pb-7 text-[15px] leading-relaxed text-mist md:text-base">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
