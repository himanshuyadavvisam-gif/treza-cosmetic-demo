/**
 * Public URL where this site is deployed (metadata, sitemap, JSON-LD).
 * Set NEXT_PUBLIC_SITE_URL in production; on Vercel the project URL is used automatically.
 * The site never links out to an external store — every "shop" action stays on this page.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export const BRAND = {
  name: "Treza Cosmetic",
  tagline: "Ayurveda + Science",
  email: "treza.care.27@gmail.com",
  instagram: "https://www.instagram.com/treza.care/",
  address: "2nd floor, Shop-43 Achakan Bazar, Baroda Pristage, Varacha Road, Surat 395006",
} as const;

export const PROMO_CODE = "LAUNCH15";
export const PROMO_TEXT = "15% off your first order";

/** In-page destination for every shop / collection call to action. */
export const SHOP_ANCHOR = "#best-sellers";
