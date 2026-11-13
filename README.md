# ClaudAura demo site starter

Next.js 16.4.2 (App Router) + TypeScript + Tailwind v4. One prospect site = one edited `site.config.ts` plus images. Do not touch components unless something is truly broken.

## What you get

- Sections (each hides itself when its config is empty): hero (variants `split`, `split-reverse`, `centered`, `editorial`, `full`; picked from the business name when unset), highlights strip, menu, products or services (`cards` or `list`, stacked or as category tabs, prices optional, dietary icons, per category notes, service durations), gallery (masonry, photos open full screen in a lightbox, one "Visit @handle on Instagram" button under the grid), local reels (muted looping mp4 that plays while on screen, with a "Watch more @handle" overlay), embedded Instagram posts (official iframe), about, reviews, how to order with copy and DM button, FAQ, contact and location (map only when an address is given), footer with the small "Website by ClaudAura" credit linking https://www.claudaura.ca.
- Variety: `theme.tone` swaps the background and card colours (light presets: `classic`, `sand`, `sage`, `mist`, `blush`; `barber-bold`: `classic`, `navy`, `espresso`, `forest`). When `theme.tone` or `hero.variant` is unset, the kit picks one from the business name, so two sites on one preset no longer look identical, and a rebuild never changes the pick. Optional `sections` reorders the middle sections, e.g. `sections: ["gallery", "menu", "about"]`.
- Theme presets in `lib/themes.ts`: `bakery-pastel`, `warm-food`, `floral-elegant`, `salon-chic`, `barber-bold` (dark), `barber-bold-light`, `catering-events`. Pick one in `theme.preset`, optionally override any color, font, or radius. Which preset for which business: see the table in `fill-config.md`.
- Font rule: headings use clean faces only (DM Serif Display, Playfair Display, Cormorant, Anton, Montserrat, Outfit, Inter). Never Fraunces or other swashy display serifs (the old `fraunces` key now maps to Playfair Display). Script fonts (Great Vibes, Parisienne, Dancing Script) are only for the wordmark, via `theme.wordmark: "script"`.
- SEO: title, description, Open Graph and Twitter card tags with `metadataBase` from `siteUrl`, a static 1200x630 share image `public/og.jpg` under 200 KB (WhatsApp and Instagram skip previews over about 300 KB). `npm run og` builds the site, renders the card design from `app/og-card` (name, tagline, accent color, `seo.ogPhoto`) and saves it as a compressed JPEG with `scripts/make-og.mjs`; `publish.sh` runs it automatically and refuses to publish if the file is 200 KB or more. Metadata points og:image and twitter:image at the absolute `siteUrl/og.jpg` with type, width and height. Do not add `app/opengraph-image.*` or `app/twitter-image.*`, they would override it. Also: favicon and apple icon generated from `logo` (monogram fallback), JSON LD local business, robots and sitemap.
- Build guard: the build fails if any copy in `site.config.ts` contains two hyphens in a row.

## Recipe (about 15 minutes per site)

1. Copy the kit: `bash /workspace/claudaura-prospects/starter/scripts/new-site.sh <slug>` then `cd /workspace/<slug>`.
2. Fill `site.config.ts` from the lead entry in `/workspace/claudaura-prospects/leads/<date>.json` (field map in `fill-config.md` next to this README). Pick the preset that fits the category.
3. Assets: save the logo (IG profile picture) as `public/images/logo.png` (square PNG or JPG, 256px or more). Save 6 to 12 post images as `public/images/*.webp` or `.jpg` (do not hotlink Instagram CDN links, they expire). Make a 480x630 JPG crop of the best photo as `public/images/og-photo.jpg`. Optional: 1 to 3 reels as mp4 with poster images in `public/videos` (see Reels below; only files you may legally use).
4. Build: `npm install && npm run build`. Fix only config errors.
5. Share image: `npm run og` (also run by publish.sh), check `public/og.jpg` looks right and is under 200 KB, and commit it.
6. Publish: `bash scripts/publish.sh <slug>` (creates public repo TatvaShah/<slug>, pushes main, creates and deploys the Vercel project, prints title, og image, and saves a screenshot). Or use your usual PR flow plus `deploy.sh`.
7. Record the result in `ready/<date>.json` as before.

Rules: facts only from the lead file, the IG bio, and post captions. Never invent hours, addresses, prices, or reviews; leave those fields empty and the section disappears. No double hyphens in copy. Canadian spelling.

## Compact builder prompt (paste into a cheap cloud agent or box executor)

```
Build a ClaudAura demo site for lead <slug> using the starter kit. Do not design or write a site from scratch.

1. Run: bash /workspace/claudaura-prospects/starter/scripts/new-site.sh <slug> ; cd /workspace/<slug>
2. Read only the <slug> entry in /workspace/claudaura-prospects/leads/<date>.json and /workspace/claudaura-prospects/starter/fill-config.md.
3. Quick Instagram check (profile bio, profile picture, 6 to 12 recent posts and captions, 1 to 3 post URLs to embed). No other research.
4. Edit ONLY site.config.ts and files in public/images. Pick the theme preset from the table in fill-config.md (bakery-pastel, warm-food, catering-events, floral-elegant, salon-chic, barber-bold, barber-bold-light); set accent color from the logo if obvious. Save logo as public/images/logo.png, post photos as public/images/*.webp or .jpg, and a 480x630 crop as public/images/og-photo.jpg. Never hotlink Instagram CDN URLs.
5. Facts only: never invent hours, addresses, prices, or reviews; leave unknown fields empty so sections hide. No double hyphens in any copy. Keep the ClaudAura footer credit.
6. npm install && npm run build must pass. Then bash scripts/publish.sh <slug> and report the live URL, repo URL, and any facts used.
```

## Images (no Vercel Image Optimization)

Vercel Image Optimization is off for every site (the team hit its free transformation limit). Instead:

- `scripts/optimize-images.mjs` runs automatically before `npm run build` (the `prebuild` script). It turns every JPG, PNG, WebP or AVIF in `public/images` into WebP (quality 82, effort 6) and AVIF (quality 48, effort 4, at or above what Next.js used) at 96 to 2400 px wide (the same width steps Next.js used), never wider than the source, into `public/images/_opt/`, and writes intrinsic width and height to `lib/image-manifest.json`. File names carry a content hash, so they are cached for a year and a replaced photo gets a new URL.
- `next.config.ts` uses `loader: "custom"` with `lib/image-loader.ts`, so `next/image` keeps doing srcset, sizes, width and height, lazy loading and `priority` for the hero, but points at those static files. A `beforeFiles` rewrite in `next.config.ts` hands browsers that accept AVIF the AVIF twin of each WebP file (plain static files, `Vary: Accept`). Vercel does zero transformations. Anything not in the manifest (remote https URLs, SVG, GIF) is served as is.
- Commit `public/images/_opt` and `lib/image-manifest.json` with the site. Unchanged images are skipped (hash check), so Vercel builds stay fast.
- Keep using `next/image` as before. Hero images get `priority`; everything else stays lazy. Do not add `remotePatterns` back or set a different loader.
- `public/og.jpg` is untouched by this step.

## Reels (optional, section hides when `reels.items` is empty)

```ts
reels: {
  title: "In motion", // optional
  items: [{ src: "/videos/reel-1.mp4", poster: "/videos/reel-1.jpg", title: "Optional short title", href: "https://www.instagram.com/reel/CODE/" }],
},
```

- Plays muted, looped and inline, only while on screen (pauses when scrolled away). With reduced motion turned on in the visitor's device settings it never starts by itself: the poster shows with a play button. Each reel has a "Watch more @handle" overlay to the reel `href` (or the profile).
- Where the file comes from: only a video the business sent you or approved, or footage you own. Instagram has no download option for someone else's reels, and saving them through third party downloader sites or the CDN breaks Instagram's terms, so do not do that for a cold demo. Before first contact, leave `reels.items` empty and use `instagram.embeds` (official iframe) to show a reel instead.
- Keep each file small: 720 px wide, 15 seconds or less, no audio, H.264, about 1 to 3 MB. Up to 3 reels; phones show 2.

```bash
ffmpeg -i original.mp4 -t 15 -vf "scale=720:-2,fps=30" -c:v libx264 -profile:v main -pix_fmt yuv420p -crf 28 -preset slow -an -movflags +faststart public/videos/reel-1.mp4
ffmpeg -ss 1 -i public/videos/reel-1.mp4 -frames:v 1 -q:v 4 public/videos/reel-1.jpg
```

The poster is picked up by the image step like any other photo (a WebP copy in `public/images/_opt`).

## Share card

`lib/og.tsx` draws the card with the bundled fonts in `lib/og-fonts` (Inter, plus DM Serif Display for serif presets and Anton for the barber presets; SIL Open Font License). Sizes come from the text length: the name shrinks to fit two lines, the eyebrow falls back to the area when category plus area is too long, and the tagline is trimmed at a word with an ellipsis. Booking businesses (service presets, or an order label with "book") get "DM @handle to book", food gets "to order". Check `public/og.jpg` after `npm run og` anyway.
