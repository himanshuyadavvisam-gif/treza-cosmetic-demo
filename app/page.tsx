import ShowcaseRoot from "@/components/showcase/ShowcaseRoot";
import Nav from "@/components/showcase/ui/Nav";
import Hero from "@/components/showcase/sections/Hero";
import BigClaim from "@/components/showcase/sections/BigClaim";
import GalleryStrip from "@/components/showcase/sections/GalleryStrip";
import PinnedScene from "@/components/showcase/sections/PinnedScene";
import FeatureCards from "@/components/showcase/sections/FeatureCards";
import MegaType from "@/components/showcase/sections/MegaType";
import ProductChooser from "@/components/showcase/sections/ProductChooser";
import Testimonials from "@/components/showcase/sections/Testimonials";
import Footer from "@/components/showcase/sections/Footer";
import BestSellers from "@/components/sections/BestSellers";
import Faq from "@/components/sections/Faq";
import { BRAND, SITE_URL } from "@/lib/config";
import { FAQS, PRODUCTS, productHref } from "@/lib/data";
import { HERO, VARIANTS } from "@/lib/showcase";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND.name,
      url: SITE_URL,
      email: BRAND.email,
      sameAs: [BRAND.instagram],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BRAND.name,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-IN",
    },
    {
      "@type": "ItemList",
      name: "Best sellers",
      itemListElement: PRODUCTS.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.title,
          image: product.shopImage,
          url: productHref(product),
          brand: { "@type": "Brand", name: BRAND.name },
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: productHref(product),
          },
        },
      })),
    },
    // Featured products of the showcase, with their full descriptions.
    ...VARIANTS.map((variant) => ({
      "@type": "Product",
      "@id": `${productHref(variant.product)}#product`,
      name: variant.product.title,
      description: variant.id === "pro-vitamin" ? HERO.body : `${variant.name} Shampoo — ${variant.tagline}.`,
      image: [variant.product.shopImage],
      brand: { "@type": "Brand", name: BRAND.name },
      category: "Shampoo",
      offers: {
        "@type": "Offer",
        price: variant.product.price,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: productHref(variant.product),
      },
    })),
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <ShowcaseRoot>
      <Nav />
      <main id="main">
        <Hero />
        <BigClaim />
        <GalleryStrip />
        <PinnedScene />
        <FeatureCards />
        <MegaType />
        <ProductChooser />
        <Testimonials />
        <BestSellers />
        <Faq />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        // Escape "<" so the JSON can never terminate the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </ShowcaseRoot>
  );
}
