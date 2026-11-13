import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { igHandle, isBookingBusiness, isRasterForOg, resolveTheme, site } from "./site";
import { presets } from "./themes";

export async function localDataUrl(path?: string) {
  if (!isRasterForOg(path)) return null;
  try {
    const buf = await readFile(join(process.cwd(), "public", path!));
    const type = /\.png$/i.test(path!) ? "image/png" : "image/jpeg";
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

// Share card fonts (lib/og-fonts, SIL OFL). Without them the card fell back to one regular weight
// with a faked bold and uneven word gaps. The name uses a face close to the site's headings.
type OgFace = "inter" | "serif" | "condensed";
async function ogFonts() {
  const dir = join(process.cwd(), "lib/og-fonts");
  const load = (f: string) => readFile(join(dir, f));
  const [i400, i700, serif, anton] = await Promise.all([
    load("inter-latin-400-normal.woff"),
    load("inter-latin-700-normal.woff"),
    load("dm-serif-display-latin-400-normal.woff"),
    load("anton-latin-400-normal.woff"),
  ]);
  return [
    { name: "Inter", data: i400, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: i700, weight: 700 as const, style: "normal" as const },
    { name: "DM Serif Display", data: serif, weight: 400 as const, style: "normal" as const },
    { name: "Anton", data: anton, weight: 400 as const, style: "normal" as const },
  ];
}
function nameFace(): OgFace {
  const p = presets[site.theme.preset] ?? presets["bakery-pastel"];
  const display = site.theme.fonts?.display ?? p.fonts.display;
  if (display === "anton" || display === "oswald") return "condensed";
  if (["playfair", "cormorant", "dmSerif", "fraunces"].includes(display)) return "serif";
  return "inter";
}
const FACE_SCALE: Record<OgFace, number> = { inter: 1, serif: 0.96, condensed: 0.74 };

// Rough text width for the share card font (no layout engine at this step), used to pick sizes and
// wrap lines safely so long names never run into the lines under them.
function textWidth(text: string, size: number, tracking = 0, scale = 1) {
  let w = 0;
  for (const ch of text) {
    if (ch === " ") w += 0.28;
    else if (/[A-Z0-9&@#%]/.test(ch)) w += 0.64;
    else if (/[mwMW]/.test(ch)) w += 0.82;
    else if (/[iljtfr.,:;'|!]/.test(ch)) w += 0.3;
    else w += 0.55;
  }
  return w * size * scale + tracking * text.length;
}
function wrapLines(text: string, size: number, maxWidth: number, tracking = 0, scale = 1) {
  const lines: string[] = [];
  let cur = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && textWidth(next, size, tracking, scale) > maxWidth) {
      lines.push(cur);
      cur = word;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}
function clampText(text: string, size: number, maxWidth: number, maxLines: number, tracking = 0) {
  const lines = wrapLines(text, size, maxWidth, tracking);
  if (lines.length <= maxLines) return { text, lines: lines.length };
  const kept = lines.slice(0, maxLines);
  let last = kept[maxLines - 1];
  while (last.includes(" ") && textWidth(`${last}…`, size, tracking) > maxWidth) last = last.slice(0, last.lastIndexOf(" "));
  // Do not end on a joining word ("and…", "in…").
  last = last.replace(/(\s+(and|or|in|of|the|for|with|to|at|by|&))+$/i, "");
  kept[maxLines - 1] = `${last.replace(/[\s,.;:·|]+$/, "")}…`;
  return { text: kept.join(" "), lines: maxLines };
}

/** Share card call to action: "DM @handle to book" on booking businesses, "to order" for food. */
export function ogCta() {
  return `DM @${igHandle} to ${isBookingBusiness() ? "book" : "order"}`;
}

// 1200x630 share card built from the config: name, tagline, area, handle, optional photo and logo.
// Sizes are picked from the text length so nothing overlaps; every block keeps its own height.
export async function shareImage() {
  const { colors } = resolveTheme();
  const photo = await localDataUrl(site.seo.ogPhoto);
  const logo = await localDataUrl(site.logo);

  const fonts = await ogFonts();
  const face = nameFace();
  const scale = FACE_SCALE[face];
  const nameText = face === "condensed" ? site.name.toUpperCase() : site.name;
  const PAD_X = 72;
  const PAD_Y = 52;
  const colWidth = (photo ? 1200 - 480 : 1200 - 360) - PAD_X - 64;
  const budget = 630 - PAD_Y * 2;

  // Eyebrow: category and area on one line when they fit, else the area, else the category,
  // allowing a second line before trimming.
  const EYE = 20;
  const EYE_TRACK = 2.5;
  const eyeOptions = [[site.category, site.area].filter(Boolean).join(" · "), site.area ?? "", site.category].filter(Boolean);
  const eyeFits = (t: string, n: number) => wrapLines(t.toUpperCase(), EYE, colWidth, EYE_TRACK).length <= n;
  const eyebrow = eyeOptions.find((t) => eyeFits(t, 1)) ?? eyeOptions.find((t) => eyeFits(t, 2)) ?? clampText((site.area || site.category).toUpperCase(), EYE, colWidth, 2, EYE_TRACK).text;
  const eyeLines = Math.min(2, wrapLines(eyebrow.toUpperCase(), EYE, colWidth, EYE_TRACK).length);

  // Name: largest size that fits in two lines (three at the smallest size).
  const sizes = [76, 68, 60, 54, 48, 42];
  let nameSize = sizes[sizes.length - 1];
  for (const sz of sizes) {
    if (wrapLines(nameText, sz, colWidth, 0, scale).length <= 2) {
      nameSize = sz;
      break;
    }
  }
  const nameLines = Math.min(3, wrapLines(nameText, nameSize, colWidth, 0, scale).length);
  const NAME_LH = face === "condensed" ? 1.08 : 1.12;

  // Tagline: up to three lines, two when space is tight, trimmed at a word with an ellipsis.
  const TAG = 28;
  const TAG_LH = 1.42;
  const CTA_H = 58;
  const fixed = eyeLines * EYE * 1.45 + 18 + nameLines * nameSize * NAME_LH + 22 + 32 + CTA_H;
  // When space is tight: smaller logo first, then a shorter tagline, then no logo.
  let logoSize = logo ? 84 : 0;
  let tagMax = 3;
  const room = () => budget - fixed - (logoSize ? logoSize + 24 : 0) - tagMax * TAG * TAG_LH;
  if (room() < 0 && logoSize) logoSize = 64;
  if (room() < 0) tagMax = 2;
  if (room() < 0) logoSize = 0;
  if (room() < 0) tagMax = 1;
  const tagline = clampText(site.tagline, TAG, colWidth, tagMax);

  const block = { display: "flex", flexShrink: 0 } as const;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: colors.bg, color: colors.ink, fontFamily: "Inter" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: `${PAD_Y}px 64px ${PAD_Y}px ${PAD_X}px`, overflow: "hidden" }}>
          {logoSize ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo!} width={logoSize} height={logoSize} style={{ borderRadius: logoSize / 2, marginBottom: 24, objectFit: "cover", flexShrink: 0 }} alt="" />
          ) : null}
          <div style={{ ...block, fontSize: EYE, lineHeight: 1.45, letterSpacing: EYE_TRACK, textTransform: "uppercase", color: colors.accent, fontWeight: 700 }}>{eyebrow}</div>
          <div
            style={{
              ...block,
              fontFamily: face === "serif" ? "DM Serif Display" : face === "condensed" ? "Anton" : "Inter",
              fontSize: nameSize,
              fontWeight: face === "inter" ? 700 : 400,
              lineHeight: NAME_LH,
              marginTop: 18,
              letterSpacing: face === "condensed" ? 1 : face === "inter" && nameSize >= 60 ? -1 : 0,
              wordBreak: "break-word",
            }}
          >
            {nameText}
          </div>
          <div style={{ ...block, fontSize: TAG, lineHeight: TAG_LH, marginTop: 22, color: colors.muted }}>{tagline.text}</div>
          <div style={{ ...block, marginTop: 32 }}>
            <div style={{ display: "flex", alignItems: "center", height: CTA_H, background: colors.accent, color: colors.accentInk, fontSize: 24, padding: "0 30px", borderRadius: 999, fontWeight: 700, letterSpacing: 0.2 }}>
              {ogCta()}
            </div>
          </div>
        </div>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} width={480} height={630} style={{ objectFit: "cover", flexShrink: 0 }} alt="" />
        ) : (
          <div style={{ width: 360, flexShrink: 0, display: "flex", background: colors.soft }} />
        )}
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}

// Square icon: the logo when it is a PNG or JPG, otherwise a monogram on the accent color.
export async function iconImage(size: number) {
  const { colors } = resolveTheme();
  const logo = await localDataUrl(site.logo);
  return new ImageResponse(
    logo ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logo} width={size} height={size} style={{ objectFit: "cover", borderRadius: size / 2 }} alt="" />
    ) : (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.accent,
          color: colors.accentInk,
          fontSize: size * 0.6,
          fontWeight: 800,
          borderRadius: size / 5,
        }}
      >
        {site.name.trim().charAt(0).toUpperCase()}
      </div>
    ),
    { width: size, height: size },
  );
}
