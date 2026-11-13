import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Static WebP and AVIF files are made at build time by scripts/optimize-images.mjs and picked
    // by lib/image-loader.ts, so Vercel Image Optimization does zero transformations.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 2048, 2400],
    imageSizes: [96, 128, 256, 384],
  },
  async rewrites() {
    // Browsers that accept AVIF get the smaller AVIF twin of the same file (a plain static file).
    return {
      beforeFiles: [
        {
          source: "/images/_opt/:name(.+)\\.webp",
          has: [{ type: "header", key: "accept", value: ".*image/avif.*" }],
          destination: "/images/_opt/:name.avif",
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/images/_opt/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Vary", value: "Accept" },
        ],
      },
    ];
  },
};

export default nextConfig;
