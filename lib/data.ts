import { BRAND, PROMO_CODE, PROMO_TEXT, SHOP_ANCHOR } from "@/lib/config";

export type Product = {
  handle: string;
  title: string;
  shortTitle: string;
  category: "Hair Care" | "Skin Care" | "Waxing";
  price: number;
  compareAt?: number;
  /** Background-removed cut-out served from /public. */
  image: string;
  imageAlt: string;
};

/** DOM id of a product's card in the Best Sellers grid. */
export const productId = (product: Pick<Product, "handle">): string => `product-${product.handle}`;

/** "Shop" links scroll to the product's own card on this page. */
export const productHref = (product: Pick<Product, "handle">): string => `#${productId(product)}`;

export const PRODUCTS: Product[] = [
  {
    handle: "protin-hair-mask",
    title: "Protin Hair Mask – Smooth & Shiny Hair",
    shortTitle: "Protin Hair Mask",
    category: "Hair Care",
    price: 999,
    image: "/products/117-1.webp",
    imageAlt: "Treza Protin Hair Mask for smooth and shiny hair",
  },
  {
    handle: "treza-cosmetic-all-in-one-face-wash",
    title: "Treza Cosmetic All-in-One Face Wash",
    shortTitle: "All-in-One Face Wash",
    category: "Skin Care",
    price: 499,
    image: "/products/107-1.webp",
    imageAlt: "Treza Cosmetic All-in-One Face Wash",
  },
  {
    handle: "sandalwood-herbal-best-wax-powder",
    title: "Sandalwood Herbal Best Wax Powder",
    shortTitle: "Sandalwood Wax Powder",
    category: "Waxing",
    price: 399,
    image: "/products/113-1.webp",
    imageAlt: "Treza Sandalwood Herbal Best Wax Powder",
  },
  {
    handle: "treza-care-shikakai-bhringraj-hair-oil-best-anti-dandruff-paraben-and-mineral-oil-free150-ml",
    title: "Treza Cosmetic Shikakai Amla Hair Oil",
    shortTitle: "Shikakai Amla Hair Oil",
    category: "Hair Care",
    price: 349,
    compareAt: 499,
    image: "/products/115-1.webp",
    imageAlt: "Treza Cosmetic Shikakai Amla Hair Oil, 150 ml",
  },
  {
    handle: "treza-cosmetic-pro-vitamin-shampoo-500ml",
    title: "Treza Cosmetic Pro Vitamin Shampoo – 500ml",
    shortTitle: "Pro Vitamin Shampoo",
    category: "Hair Care",
    price: 799,
    image: "/products/112-1.webp",
    imageAlt: "Treza Cosmetic Pro Vitamin Shampoo, 500 ml",
  },
  {
    handle: "treza-cosmetic-pro-damage-repair-shampoo-500ml",
    title: "Treza Cosmetic Pro-Damage Repair Shampoo – 500ml",
    shortTitle: "Damage Repair Shampoo",
    category: "Hair Care",
    price: 799,
    image: "/products/110-1.webp",
    imageAlt: "Treza Cosmetic Pro-Damage Repair Shampoo, 500 ml",
  },
  {
    handle: "treza-cosmetic-pro-damage-repair-shampoo",
    title: "Treza Cosmetic Pro-Damage Repair Shampoo – 900ml",
    shortTitle: "Damage Repair Shampoo 900ml",
    category: "Hair Care",
    price: 1499,
    image: "/products/109-1.webp",
    imageAlt: "Treza Cosmetic Pro-Damage Repair Shampoo, 900 ml",
  },
  {
    handle: "treza-care-natural-conditioning-shampoo-500ml",
    title: "Treza Cosmetic Pro Vitamin Shampoo – 900ml",
    shortTitle: "Pro Vitamin Shampoo 900ml",
    category: "Hair Care",
    price: 1499,
    image: "/products/114-2.webp",
    imageAlt: "Treza Cosmetic Pro Vitamin Shampoo, 900 ml",
  },
];

const byHandle = (handle: string): Product => {
  const product = PRODUCTS.find((item) => item.handle === handle);
  if (!product) throw new Error(`Unknown product handle: ${handle}`);
  return product;
};

/** Products flown through the hero depth scene, in order of appearance. */
export const HERO_PRODUCTS: Product[] = [
  byHandle("protin-hair-mask"),
  byHandle("treza-cosmetic-all-in-one-face-wash"),
  byHandle("sandalwood-herbal-best-wax-powder"),
  byHandle("treza-care-shikakai-bhringraj-hair-oil-best-anti-dandruff-paraben-and-mineral-oil-free150-ml"),
  byHandle("treza-cosmetic-pro-vitamin-shampoo-500ml"),
  byHandle("treza-cosmetic-pro-damage-repair-shampoo-500ml"),
];

export type Chapter = {
  eyebrow: string;
  title: string;
  body: string;
  product: Product;
};

/** Pinned scroll-story chapters. */
export const CHAPTERS: Chapter[] = [
  {
    eyebrow: "Hair Care",
    title: "Smooth, shiny hair — rooted in Ayurveda.",
    body: "Protin Hair Mask brings Ayurvedic tradition and modern hair science together for smooth, shiny hair you'll love to show off.",
    product: byHandle("protin-hair-mask"),
  },
  {
    eyebrow: "Skin Care",
    title: "Dermatologist tested. Safe for every skin type.",
    body: "The All-in-One Face Wash is built on the same promise as everything we make: gentle, effective care you can trust on your skin, every day.",
    product: byHandle("treza-cosmetic-all-in-one-face-wash"),
  },
  {
    eyebrow: "Waxing",
    title: "Herbal waxing, made for smooth results.",
    body: "Sandalwood Herbal Best Wax Powder is a herbal, sandalwood-led wax powder from our waxing range, made for smooth results.",
    product: byHandle("sandalwood-herbal-best-wax-powder"),
  },
];

export const NAV_LINKS = [
  { label: "Best Sellers", href: SHOP_ANCHOR },
  { label: "Skin Care", href: SHOP_ANCHOR },
  { label: "Hair Care", href: SHOP_ANCHOR },
  { label: "Bath & Body", href: SHOP_ANCHOR },
  { label: "Waxing", href: SHOP_ANCHOR },
] as const;

export const CATEGORIES = [
  { name: "Skin Care", note: "Face washes, serums & de-tan care", href: SHOP_ANCHOR },
  { name: "Hair Care", note: "Shampoos, oils, masks & hair spa", href: SHOP_ANCHOR },
  { name: "Bath & Body", note: "Everyday body care rituals", href: SHOP_ANCHOR },
  { name: "Waxing", note: "Cream waxes & herbal wax powders", href: SHOP_ANCHOR },
] as const;

export const TRUST_BADGES = ["Cruelty Free", "Paraben Free", "Dermatologically Tested", "Hydrogen Peroxide Free"] as const;

export const MARQUEE_ITEMS = [
  "Ayurveda + Science",
  ...TRUST_BADGES,
  "Safe for Every Skin Type",
] as const;

export const FAQS = [
  {
    q: "What is Treza Cosmetic?",
    a: "Treza Cosmetic is an Indian beauty and wellness brand that blends Ayurvedic formulations with modern science across skin care, hair care, bath & body and waxing.",
  },
  {
    q: "Are Treza Cosmetic products suitable for all skin types?",
    a: "Treza products are dermatologically tested and made to be safe for every skin type. As with any new product, we still recommend a small patch test first, especially if your skin is sensitive.",
  },
  {
    q: "What payment methods are accepted?",
    a: "You can pay by card, UPI or digital wallet at checkout on the Treza Cosmetic store.",
  },
  {
    q: "Is there a discount for first-time customers?",
    a: `Yes — use code ${PROMO_CODE} at checkout for ${PROMO_TEXT}.`,
  },
  {
    q: "What are the shipping options and how can I track my order?",
    a: `Delivery options and timelines are listed on our Shipping Policy page. If you need help tracking an order, write to us at ${BRAND.email}.`,
  },
  {
    q: "What should I do if I have an allergic reaction?",
    a: `Stop using the product immediately, rinse the area with plenty of water and consult a doctor if irritation continues. You can also reach us at ${BRAND.email}.`,
  },
  {
    q: "How do I use the product?",
    a: "Usage directions are printed on every pack and listed on each product page in the store.",
  },
] as const;

export const FOOTER_LINKS = {
  explore: [
    { label: "The formula", href: "#formula" },
    { label: "Ingredients", href: "#ingredients" },
    { label: "Choose your shampoo", href: "#choose" },
    { label: "Best sellers", href: SHOP_ANCHOR },
  ],
  support: [
    { label: "FAQ", href: "#faq" },
    { label: "Email us", href: `mailto:${BRAND.email}` },
    { label: "Instagram", href: BRAND.instagram },
  ],
} as const;
