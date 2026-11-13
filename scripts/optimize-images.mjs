// Build time image step. Converts every photo in the folders under public into static WebP and AVIF files at
// responsive widths (never wider than the source) and writes lib/image-manifest.json with
// intrinsic sizes. lib/image-loader.ts points next/image at these files, so Vercel runs zero
// image transformations. Outputs are committed; unchanged images are skipped, so builds stay fast.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "public/images");
const OUT = path.join(SRC, "_opt");
const MANIFEST = path.join(ROOT, "lib/image-manifest.json");
const WIDTHS = [96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1600, 2048, 2400];
const QUALITY = 82;
const AVIF_QUALITY = 48; // Next.js used AVIF quality 47 (75 scaled by 50/80); this stays at or above it
const VERSION = 4; // bump to force a full rebuild after changing settings
const EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return d.name === "_opt" ? [] : walk(p);
    return EXT.test(d.name) ? [p] : [];
  });
}

const old = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
// Every image folder under public (images, media, photos, brand...). Files directly in public, like og.jpg, are left alone.
const PUB = path.join(ROOT, "public");
const files = fs.readdirSync(PUB, { withFileTypes: true }).filter((d) => d.isDirectory()).sort((a, b) => a.name.localeCompare(b.name)).flatMap((d) => walk(path.join(PUB, d.name)));
const manifest = {};
const keep = new Set();
let sharp = null;
let made = 0;

for (const file of files) {
  const rel = path.relative(path.join(ROOT, "public"), file).split(path.sep).join("/");
  const key = "/" + rel;
  // Content hash (not mtime, which changes on every git clone) keeps the cache valid on Vercel
  // and gives each version of an image a new URL, so long browser caching is safe.
  const hash = crypto.createHash("sha1").update(`${VERSION}:${QUALITY}:${AVIF_QUALITY}:`).update(fs.readFileSync(file)).digest("hex").slice(0, 10);
  const stamp = hash;
  const sub = rel.startsWith("images/") ? rel.slice(7) : rel;
  const base = "/images/_opt/" + sub.replace(EXT, "") + "." + hash;
  const prev = old[key];
  const outs = (e) => e.widths.flatMap((w) => ["webp", "avif"].map((x) => path.join(ROOT, "public", `${e.base}-${w}.${x}`)));
  if (prev && prev.stamp === stamp && prev.base === base && outs(prev).every((p) => fs.existsSync(p))) {
    manifest[key] = prev;
    outs(prev).forEach((p) => keep.add(p));
    continue;
  }
  if (!sharp) sharp = (await import("sharp")).default;
  const img = sharp(file, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  const swap = (meta.orientation ?? 1) >= 5;
  const w = swap ? meta.height : meta.width;
  const h = swap ? meta.width : meta.height;
  const widths = WIDTHS.filter((x) => x < w);
  if (!widths.length || w <= 2400) widths.push(Math.min(w, 2400));
  const entry = { w, h, widths: [...new Set(widths)], base, stamp };
  for (const ow of entry.widths) {
    const dest = path.join(ROOT, "public", `${base}-${ow}`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const resized = sharp(file, { failOn: "none" }).rotate().resize({ width: ow, withoutEnlargement: true });
    await resized.clone().webp({ quality: QUALITY, effort: 6, smartSubsample: true }).toFile(dest + ".webp");
    await resized.clone().avif({ quality: AVIF_QUALITY, effort: 4 }).toFile(dest + ".avif");
    keep.add(dest + ".webp");
    keep.add(dest + ".avif");
  }
  manifest[key] = entry;
  made++;
}

// Remove outputs whose source image is gone.
if (fs.existsSync(OUT)) {
  for (const f of fs.readdirSync(OUT, { recursive: true })) {
    const p = path.join(OUT, f);
    if (/\.(webp|avif)$/.test(p) && !keep.has(p)) fs.rmSync(p);
  }
}
fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
const text = JSON.stringify(sorted, null, 1) + "\n";
if (!fs.existsSync(MANIFEST) || fs.readFileSync(MANIFEST, "utf8") !== text) fs.writeFileSync(MANIFEST, text);
console.log(`optimize-images: ${files.length} images, ${made} converted, ${files.length - made} cached`);
