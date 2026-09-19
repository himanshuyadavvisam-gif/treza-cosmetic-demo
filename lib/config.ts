/** Public URL of the Shopify storefront that products, cart and policies live on. */
export const SHOP_URL = (process.env.NEXT_PUBLIC_SHOP_URL ?? "https://www.trezacosmetic.com").replace(/\/$/, "");

/** Public URL where this homepage is deployed (used for metadata, sitemap and JSON-LD). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.trezacosmetic.com").replace(/\/$/, "");

export const BRAND = {
  name: "Treza Cosmetic",
  tagline: "Ayurveda + Science",
  email: "treza.care.27@gmail.com",
  instagram: "https://www.instagram.com/treza.care/",
  address: "2nd floor, Shop-43 Achakan Bazar, Baroda Pristage, Varacha Road, Surat 395006",
} as const;

export const PROMO_CODE = "LAUNCH15";
export const PROMO_TEXT = "15% off your first order";

export const shopHref = (path: string): string => `${SHOP_URL}${path}`;
