/**
 * All copy and content for the cinematic showcase, in one typed place.
 * Claims below are taken from Treza's own product pages and pack labels.
 */
import { PRODUCTS, type Product } from "@/lib/data";
import type { SectionId } from "@/lib/scrollStore";

const product = (handle: string): Product => {
  const found = PRODUCTS.find((item) => item.handle === handle);
  if (!found) throw new Error(`Unknown product handle: ${handle}`);
  return found;
};

/* ------------------------------------------------------------------ nav */

export const SHOWCASE_NAV: ReadonlyArray<{ label: string; id: SectionId }> = [
  { label: "Formula", id: "formula" },
  { label: "Ingredients", id: "ingredients" },
  { label: "Choose", id: "choose" },
  { label: "Shop", id: "best-sellers" },
];

export const SECTION_LABELS: Record<SectionId, string> = {
  top: "Introduction",
  claim: "Powered by amla",
  ritual: "The ritual",
  formula: "The formula",
  ingredients: "Ingredients",
  ayurveda: "Rooted in Ayurveda",
  choose: "Choose your shampoo",
  promise: "What it's made to do",
  "best-sellers": "Best sellers",
  faq: "Questions",
};

/* --------------------------------------------------------------- hero */

export const HERO = {
  eyebrow: "Pro-Vitamin Shampoo · 500 ml",
  titleLead: "Everyday hair care,",
  titleAccent: "rooted in Ayurveda.",
  body: "Aloe vera, amla and shikakai in a mild, paraben- and sulfate-free shampoo for regular hair-washing routines.",
  product: product("treza-cosmetic-pro-vitamin-shampoo-500ml"),
};

/* ---------------------------------------------------------- big claim */

export const CLAIM = {
  lines: ["Powered", "by amla*"],
  caption: "A gentle everyday wash that helps cleanse the scalp and keep hair soft, smooth and naturally shiny.",
  footnote: "*Also aloe vera and shikakai. We couldn't pick a favourite.",
};

/* -------------------------------------------------------- ritual strip */

export type RitualCard = {
  kicker: string;
  line: string;
  image: string;
  product: Product;
};

export const RITUAL: RitualCard[] = [
  { kicker: "Every wash,", line: "gentle enough for daily", image: "/showcase/ritual-provitamin.webp", product: product("treza-cosmetic-pro-vitamin-shampoo-500ml") },
  { kicker: "Dry, rough hair,", line: "cared for in every wash", image: "/showcase/ritual-prodamage.webp", product: product("treza-cosmetic-pro-damage-repair-shampoo-500ml") },
  { kicker: "Once a week,", line: "deep conditioning", image: "/showcase/ritual-mask.webp", product: product("protin-hair-mask") },
  { kicker: "Before the wash,", line: "shikakai & amla oil", image: "/showcase/ritual-oil.webp", product: product("treza-care-shikakai-bhringraj-hair-oil-best-anti-dandruff-paraben-and-mineral-oil-free150-ml") },
  { kicker: "For skin too,", line: "one face wash, all in", image: "/showcase/ritual-facewash.webp", product: product("treza-cosmetic-all-in-one-face-wash") },
  { kicker: "Smooth & herbal,", line: "sandalwood wax powder", image: "/showcase/ritual-wax.webp", product: product("sandalwood-herbal-best-wax-powder") },
];

/* ------------------------------------------------------ pinned formula */

export type FormulaFeature = {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Tiny technical caption drawn in the annotation overlay. */
  note: string;
};

export const FORMULA: FormulaFeature[] = [
  {
    index: "01",
    eyebrow: "Herbal",
    title: "Aloe vera, amla & shikakai.",
    body: "Three classic Ayurvedic herbs that help cleanse the scalp and keep hair soft, smooth and shiny.",
    note: "aloe + amla + shikakai",
  },
  {
    index: "02",
    eyebrow: "Gentle",
    title: "No parabens. No sulfates.",
    body: "A mild formula made for regular hair-washing routines and different hair types.",
    note: "parabens: 0 · sulfates: 0",
  },
  {
    index: "03",
    eyebrow: "Nourish",
    title: "Pro-vitamin & protein care.",
    body: "With vitamin E and rosemary to help hair look healthy, smooth and easy to manage.",
    note: "vit. E + rosemary",
  },
  {
    index: "04",
    eyebrow: "Everyday",
    title: "A fresh, clean scalp. Daily.",
    body: "Cleanses without leaving hair feeling excessively dry or rough.",
    note: "net vol. 500 ml",
  },
];

/* ---------------------------------------------------------- feature cards */

export type FactCard = {
  from: number;
  to: number;
  suffix?: string;
  fact: string;
  caption: string;
  icon: "leaf" | "drop" | "bubble" | "bottle";
};

export const FACTS: FactCard[] = [
  { from: 0, to: 3, fact: "Herbal actives", caption: "Aloe vera, amla and shikakai.", icon: "leaf" },
  { from: 100, to: 0, fact: "Parabens", caption: "Counting down, on purpose.", icon: "drop" },
  { from: 100, to: 0, fact: "Sulfates", caption: "Clean lather, minus the harshness.", icon: "bubble" },
  { from: 0, to: 500, suffix: "ml", fact: "Per bottle", caption: "Pump bottle, made for the shower shelf.", icon: "bottle" },
];

/* ----------------------------------------------------------- mega type */

export const MEGA = {
  eyebrow: "Rooted in",
  word: "Ayurveda",
  body: "Ayurveda gives us the herbs; modern cosmetic science makes them easy to use every day. Every Treza formula is cruelty free, paraben free and dermatologically tested.",
};

/* ------------------------------------------------------------- chooser */

export type ShampooVariant = {
  id: string;
  name: string;
  wordmark: string;
  tagline: string;
  swatch: string;
  /** 360° label texture wrapped around the 3D bottle. */
  texture: string;
  /** Background-removed photo used when WebGL is off. */
  cutout: string;
  product: Product;
};

export const VARIANTS: ShampooVariant[] = [
  {
    id: "pro-vitamin",
    name: "Pro-Vitamin",
    wordmark: "Pro-Vitamin",
    tagline: "Hairfall controller · Scalp nourisher · Vitamin E & rosemary",
    swatch: "#5f6f35",
    texture: "/showcase/bottle-provitamin.webp",
    cutout: "/products/112-1.webp",
    product: product("treza-cosmetic-pro-vitamin-shampoo-500ml"),
  },
  {
    id: "pro-damage",
    name: "Pro-Damage Repair",
    wordmark: "Pro-Damage",
    tagline: "Heavy moisture · Chemically treated hair · Wheat protein",
    swatch: "#8b5cc7",
    texture: "/showcase/bottle-prodamage.webp",
    cutout: "/products/110-1.webp",
    product: product("treza-cosmetic-pro-damage-repair-shampoo-500ml"),
  },
];

/* -------------------------------------------------------- testimonials */

export type Testimonial = {
  quote: string;
  /** Exact substring of `quote` to highlight in the accent colour. */
  highlight: string;
  name: string;
  meta: string;
  /** 1–5. Leave undefined for non-review rows (no stars are drawn). */
  rating?: number;
  media: string;
  mediaAlt: string;
};

/**
 * Real customer reviews go here (name, city, rating, quote, product).
 * While this list is empty the section shows PROMISES — product claims from Treza's own
 * pack copy — so no review is ever invented.
 */
export const REVIEWS: Testimonial[] = [];

export const PROMISES: Testimonial[] = [
  {
    quote: "Mild, nourishing and gentle — made for everyday hair care.",
    highlight: "everyday hair care",
    name: "Pro-Vitamin Shampoo",
    meta: "Aloe vera · Amla · Shikakai",
    media: "/showcase/thumb-provitamin-back.webp",
    mediaAlt: "Back label of Treza Pro-Vitamin Shampoo with ingredients and directions",
  },
  {
    quote: "Care for dry, rough and damaged hair, leaving it softer, smoother and shinier.",
    highlight: "softer, smoother and shinier",
    name: "Pro-Damage Repair Shampoo",
    meta: "Heavy moisture · Wheat protein",
    media: "/showcase/thumb-prodamage-back.webp",
    mediaAlt: "Back label of Treza Pro-Damage Repair Shampoo",
  },
  {
    quote: "Deep conditioning for smooth, shiny and manageable hair.",
    highlight: "smooth, shiny and manageable",
    name: "Protin Hair Mask",
    meta: "800 gm · All hair types",
    media: "/showcase/thumb-mask-top.webp",
    mediaAlt: "Treza Protin Hair Mask jar seen from above",
  },
  {
    quote: "Shikakai and amla in an everyday hair oil, free from parabens and mineral oil.",
    highlight: "free from parabens and mineral oil",
    name: "Shikakai Amla Hair Oil",
    meta: "150 ml · Pre-wash care",
    media: "/showcase/thumb-oil-back.webp",
    mediaAlt: "Back label of Treza Shikakai Amla Hair Oil",
  },
];

/* --------------------------------------------------------------- footer */

export const FOOTER_CTA = {
  lead: "Wash day,",
  accent: "upgraded.",
};
