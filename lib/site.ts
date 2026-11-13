import { site } from "@/site.config";
import { fonts } from "./fonts";
import { autoTones, presets, radiusScale, tones } from "./themes";
import type { HeroVariant, SectionKey, SiteConfig, ThemeTone } from "./types";

export { site };
export const CLAUDAURA_URL = "https://www.claudaura.ca";

export function getSiteUrl() {
  if (site.siteUrl) return site.siteUrl.replace(/\/$/, "");
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;
  const host = process.env.VERCEL_URL;
  if (host) return `https://${host}`;
  return "http://localhost:3000";
}

export const igHandle = site.instagram.handle.replace(/^@/, "");
export const igUrl = `https://www.instagram.com/${igHandle}/`;
export const igDmUrl = `https://ig.me/m/${igHandle}`;

// Stable small number from the business name (as a slug), so the "auto" tone and hero layout differ
// between sites but never change between builds, or when siteUrl moves from localhost to the live domain.
export function siteSlug(cfg: SiteConfig = site) {
  return cfg.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export function slugPick<T>(options: readonly T[], salt: string, cfg: SiteConfig = site): T {
  let h = 2166136261;
  for (const ch of `${salt}:${siteSlug(cfg)}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  // Final mix so the tone and hero picks do not move together.
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) >>> 0;
  h ^= h >>> 16;
  return options[(h >>> 0) % options.length];
}

function hexToRgb(hex: string) {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m.slice(0, 6);
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
/** Mix color a into b by amount t (0 to 1), returns hex. */
export function mixHex(a: string, b: string, t: number) {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return "#" + x.map((v, i) => Math.round(v * t + y[i] * (1 - t)).toString(16).padStart(2, "0")).join("");
}
function isDark(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
}

export function resolveTone(cfg: SiteConfig = site): ThemeTone {
  const preset = presets[cfg.theme.preset] ? cfg.theme.preset : "bakery-pastel";
  const want = cfg.theme.tone ?? "auto";
  if (want !== "auto") return want;
  return slugPick(autoTones[preset], "tone", cfg);
}

export function resolveTheme(cfg: SiteConfig = site) {
  const p = presets[cfg.theme.preset] ?? presets["bakery-pastel"];
  const tone = resolveTone(cfg);
  let base = { ...p.colors };
  const t = tone !== "auto" && tone !== "classic" ? tones[tone] : undefined;
  // A tone only applies when it matches the preset's light or dark nature (ink stays readable).
  if (t && t.dark === isDark(p.colors.bg)) {
    const accent = cfg.theme.colors?.accent ?? p.colors.accent;
    base = {
      ...base,
      bg: t.bg,
      surface: t.surface,
      soft: mixHex(accent, t.bg, t.dark ? 0.14 : 0.1),
      line: mixHex(p.colors.ink, t.bg, t.dark ? 0.16 : 0.12),
    };
  }
  const colors = { ...base, ...(cfg.theme.colors ?? {}) };
  const f = { ...p.fonts, ...(cfg.theme.fonts ?? {}) };
  const r = radiusScale[cfg.theme.radius ?? p.radius];
  const wordmark = cfg.theme.wordmark ?? p.wordmark ?? "display";
  const upper = (cfg.theme.headingCase ?? p.headingCase) === "upper";
  const vars: Record<string, string> = {
    "--c-bg": colors.bg,
    "--c-surface": colors.surface,
    "--c-ink": colors.ink,
    "--c-text": colors.text,
    "--c-muted": colors.muted,
    "--c-accent": colors.accent,
    "--c-accent-ink": colors.accentInk,
    "--c-soft": colors.soft,
    "--c-line": colors.line,
    "--f-display": fonts[f.display].style.fontFamily,
    "--f-body": fonts[f.body].style.fontFamily,
    "--f-script": fonts[f.script].style.fontFamily,
    "--f-wordmark": fonts[wordmark === "script" ? f.script : f.display].style.fontFamily,
    "--h-case": upper ? "uppercase" : "none",
    "--h-track": upper ? "0.01em" : "normal",
    "--r-card": r.card,
    "--r-pill": r.pill,
    "--r-media": r.media,
  };
  return { colors, vars, wordmark, tone };
}

/** Hero layout. Unset or "auto" picks one from the business name ("full" is only used when asked for). */
export function heroVariant(cfg: SiteConfig = site): Exclude<HeroVariant, "auto"> {
  const v = cfg.hero.variant ?? "auto";
  if (v !== "auto") return v;
  return slugPick(["split", "split-reverse", "centered", "editorial"] as const, "hero", cfg);
}

const DEFAULT_SECTIONS: SectionKey[] = ["menu", "gallery", "reels", "about", "reviews", "instagram", "order", "faq"];
/** Middle section order: site.sections first (unknown keys and repeats ignored), then the rest in default order. */
export function sectionOrder(cfg: SiteConfig = site): SectionKey[] {
  const picked = (cfg.sections ?? []).filter((k, i, a) => DEFAULT_SECTIONS.includes(k) && a.indexOf(k) === i);
  return [...picked, ...DEFAULT_SECTIONS.filter((k) => !picked.includes(k))];
}

/** True when the business takes bookings rather than orders (service preset or a "book" label). */
export function isBookingBusiness(cfg: SiteConfig = site) {
  const labels = [cfg.order.label, cfg.order.headerCtaLabel].filter(Boolean).join(" ");
  if (/\bbook/i.test(labels)) return true;
  if (/\border/i.test(labels)) return false;
  return SERVICE_PRESETS.has(cfg.theme.preset);
}

export const has = <T,>(arr?: T[] | null): arr is T[] => Array.isArray(arr) && arr.length > 0;

/** Presets for appointment businesses (salons, barbers, nails, lashes, groomers). */
const SERVICE_PRESETS = new Set(["salon-chic", "barber-bold", "barber-bold-light"]);

export function isServicePreset(preset: string = site.theme.preset) {
  return SERVICE_PRESETS.has(preset);
}

/**
 * Default hero primary CTA when hero.primaryCta is unset.
 * Service presets: "DM to book", or "Book now" linking the first order.links entry.
 * Food and other presets: Instagram DM with "Order by Instagram DM".
 * Explicit hero.primaryCta / order.headerCtaLabel always win over these defaults.
 */
export function defaultHeroCta() {
  if (isServicePreset()) {
    const booking = site.order.links?.[0];
    if (booking?.href) return { kind: "link" as const, label: "Book now", href: booking.href };
    return { kind: "dm" as const, label: "DM to book" };
  }
  return { kind: "dm" as const, label: "Order by Instagram DM" };
}

export function isRasterForOg(path?: string) {
  return !!path && /\.(png|jpe?g)$/i.test(path) && path.startsWith("/");
}

// Build guard: fail the build if any copy in the config contains two hyphens in a row.
function walk(v: unknown, path: string, out: string[]) {
  if (typeof v === "string") {
    if (/^(https?:|\/)/.test(v)) return;
    if (v.includes("--")) out.push(path);
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`, out));
  else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`, out));
}
const bad: string[] = [];
walk(site, "site", bad);
if (bad.length) throw new Error(`Double hyphen found in site.config.ts copy at: ${bad.join(", ")}`);

export function businessJsonLd() {
  const url = getSiteUrl();
  const c = site.contact;
  const sameAs = [igUrl, ...(c?.socials ?? []).map((s) => s.href)];
  return {
    "@context": "https://schema.org",
    "@type": site.schemaType ?? "LocalBusiness",
    name: site.name,
    description: site.seo.description,
    url,
    ...(site.logo ? { logo: `${url}${site.logo}` } : {}),
    ...(site.hero.images?.[0]?.src?.startsWith("/") ? { image: `${url}${site.hero.images[0].src}` } : {}),
    ...(c?.email ? { email: c.email } : {}),
    ...(c?.phone ? { telephone: c.phone } : {}),
    ...(site.area || c?.address
      ? {
          address: {
            "@type": "PostalAddress",
            ...(c?.address ? { streetAddress: c.address } : {}),
            ...(site.area ? { addressLocality: site.area } : {}),
            addressRegion: "ON",
            addressCountry: "CA",
          },
        }
      : {}),
    ...(site.area ? { areaServed: [site.area, "Greater Toronto Area"] } : {}),
    sameAs,
  };
}
