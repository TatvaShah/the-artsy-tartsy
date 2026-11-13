// Custom next/image loader: serves the static WebP files made by scripts/optimize-images.mjs
// (public/images/_opt; AVIF is swapped in by a rewrite in next.config.ts), so Vercel Image Optimization is never used. Anything not in the
// manifest (remote URLs, SVG, GIF) is returned unchanged and served as is.
import manifest from "./image-manifest.json";

type Entry = { w: number; h: number; widths: number[]; base: string };
const m = manifest as Record<string, Entry>;

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const e = m[src.split("?")[0]];
  if (!e) return src;
  const w = e.widths.find((x) => x >= width) ?? e.widths[e.widths.length - 1];
  return `${e.base}-${w}.webp`;
}

export function imageSize(src: string): { width: number; height: number } | undefined {
  const e = m[src.split("?")[0]];
  return e ? { width: e.w, height: e.h } : undefined;
}

/** Static srcset and a large fallback from the optimized files, for plain <img> tags (lightbox, posters). */
export function optimizedSources(src: string, maxWidth = 2048): { src: string; srcSet?: string; width?: number; height?: number } {
  const e = m[src.split("?")[0]];
  if (!e) return { src };
  const widths = e.widths.filter((w) => w <= maxWidth);
  const use = widths.length ? widths : [e.widths[0]];
  return {
    src: `${e.base}-${use[use.length - 1]}.webp`,
    srcSet: use.map((w) => `${e.base}-${w}.webp ${w}w`).join(", "),
    width: e.w,
    height: e.h,
  };
}
