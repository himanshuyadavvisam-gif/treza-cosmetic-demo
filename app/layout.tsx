import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { BRAND, SITE_URL } from "@/lib/config";
import SmoothScroll from "@/components/providers/SmoothScroll";

// Self-hosted via @fontsource: no runtime request to Google, works offline and in CI.
const display = localFont({
  src: [
    { path: "../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
});

const TITLE = `${BRAND.name} | Ayurveda + Science Skin, Hair & Body Care`;
const DESCRIPTION =
  "Dermatologist tested, cruelty free and safe for every skin type. Shop Ayurvedic skin care, hair care, bath & body and waxing products from Treza Cosmetic.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${BRAND.name}` },
  description: DESCRIPTION,
  applicationName: BRAND.name,
  alternates: { canonical: "/" },
  keywords: [
    "Treza Cosmetic",
    "Ayurvedic skin care",
    "hair care",
    "hair mask",
    "face wash",
    "wax powder",
    "cruelty free cosmetics India",
  ],
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_IN",
    images: [
      {
        url: "/showcase/og.jpg",
        width: 1200,
        height: 630,
        alt: "Treza Pro-Vitamin Shampoo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#e6eadb",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="grain min-h-svh">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
