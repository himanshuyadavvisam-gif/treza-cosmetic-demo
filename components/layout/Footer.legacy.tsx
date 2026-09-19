import { BRAND } from "@/lib/config";
import { CATEGORIES, FOOTER_LINKS } from "@/lib/data";

const linkClass = "text-sm text-mist transition-colors hover:text-gold";

export default function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-ink-2 px-5 pb-10 pt-20 md:px-10 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-4xl font-semibold tracking-[0.34em] text-bone">TREZA</p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.55em] text-gold">Cosmetic</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-mist">
              Ayurveda + Science. Dermatologist tested, cruelty free and safe for every skin type.
            </p>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 text-sm text-bone transition-colors hover:text-gold"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
              </svg>
              @treza.care
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <nav aria-label="Shop">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Shop</h2>
            <ul className="mt-5 space-y-3.5">
              {CATEGORIES.map((category) => (
                <li key={category.name}>
                  <a href={category.href} className={linkClass}>
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Explore">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Explore</h2>
            <ul className="mt-5 space-y-3.5">
              {FOOTER_LINKS.explore.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Customer service">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Customer service</h2>
            <ul className="mt-5 space-y-3.5">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <address className="mt-16 flex flex-col gap-2 border-t border-gold/10 pt-8 text-sm not-italic text-mist md:flex-row md:items-center md:justify-between">
          <span>{BRAND.address}</span>
          <a href={`mailto:${BRAND.email}`} className="transition-colors hover:text-gold">
            {BRAND.email}
          </a>
        </address>

        <p className="mt-8 text-xs text-mist/70">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
