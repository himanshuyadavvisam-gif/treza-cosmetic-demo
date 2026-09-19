import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Product cut-outs live in /public/products; Next resizes them and serves AVIF/WebP.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
