# Starter kit changelog

## 2026-11-09

Small upgrade after Tatva's review of the Nov 7 and Nov 8 demos. Backup of the previous kit: `/workspace/claudaura-prospects/starter-backup-2026-11-09`. Existing sites keep their own copy of the kit and do not change until someone copies these files in and redeploys.

- Build: `next build --webpack` so Vercel production builds do not fail on next/font/google under Turbopack.
- Share card (`lib/og.tsx`): fixed text running into the lines below it on long names and long categories. Bundled real fonts (`lib/og-fonts`, SIL OFL) instead of the single fallback weight with faked bold and uneven word gaps. Name size now fits two lines, eyebrow falls back to the area when category plus area is too long, tagline is trimmed at a word, logo shrinks or hides before text is squeezed, roomier line height and spacing. CTA says "to book" for booking businesses, "to order" for food.
- Gallery: photos open full screen in an accessible lightbox (Esc and close button, arrow keys, swipe, swipe down to close, focus trap, page scroll locked, focus returns to the photo). Uses the static files in `/images/_opt`, never `/_next/image`. No more link out to Instagram per photo; one "Visit @handle on Instagram" button under the grid.
- Reels: muted, looping, inline video that starts only while on screen, poster plus play button under reduced motion, "Watch more @handle" overlay, play and pause button. Files go in `public/videos`. Section hides when empty. README explains where files may come from and the ffmpeg settings.
- Variety: `theme.tone` (background and card colours) and new hero layouts `split-reverse` and `editorial`. When unset, both are picked from the business name so sites on the same preset no longer look identical. Optional `sections` to reorder the middle of the page. Existing configs keep working; an explicit `hero.variant` still wins.
- Fixes from live demos: the How to book section on booking sites said "Get a quote and confirm your order" (now booking wording, and the booking page is the main button with the DM as backup); a lone "Services" group heading repeated the "Our services" section title; in the split hero with three photos, the big photo stopped short of the two small ones.
