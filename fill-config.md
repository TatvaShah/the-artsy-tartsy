# Mapping a lead into site.config.ts

Lead entries in `leads/<date>.json` look like:
`business_name, instagram_handle, instagram_url, category, city_area, order_booking_links[], phone, email, tiktok_url, google_listing_url, slug, role`.

| Config field | Source |
| - | - |
| `name` | `business_name` exactly as styled on IG |
| `tagline` | One sentence: what they make plus `city_area`. From the IG bio when possible |
| `category` | Short form of `category`, e.g. "Custom cakes", "Filipino home cooking", "Event florals" |
| `schemaType` | Bakery (cakes, desserts), FoodEstablishment (home food, caterers), Florist, BeautySalon, else LocalBusiness |
| `area` | `city_area` plus ", ON" |
| `siteUrl` | `https://` plus the domain in `.site-domain` (new-site.sh picks a free vercel.app name, since `<slug>.vercel.app` can belong to a stranger) |
| `theme.preset` | See "Which preset" below |
| `theme.colors.accent` | Optional, the main brand color from the logo |
| `logo` | `/images/logo.png` (IG profile picture, PNG or JPG) |
| `hero.headline` and `subhead` | Short benefit line plus how ordering works. No invented claims |
| `hero.primaryCta` | Optional override. Default follows the preset: service presets use "DM to book", or "Book now" to the first `order.links` entry; food presets use "Order by Instagram DM" |
| `hero.variant` | Leave unset (automatic pick from the business name). Set `full` only for one strong wide or tall photo with room for text |
| `theme.tone` | Leave unset (automatic), or pick one that suits the photos (see README) |
| `hero.images` | 1 to 3 strongest post photos (`full` variant needs one wide or tall photo with room for text) |
| `highlights` | 3 or 4 short true facts: "Made to order", "Halal", "Pickup in Brampton", "Orders by DM" |
| `about.body` | 1 or 2 paragraphs from the bio and captions. Skip if nothing real to say |
| `menu` | See "Menu and services" below. Items and prices only from captions, story highlights, or menus posted on IG |
| `gallery.items` | 6 to 12 post photos with short captions. Photos open in a lightbox on the page; `href` is optional and no longer linked |
| `reels.items` | Optional mp4 files in `public/videos` with poster images, only when the business sent or approved them (see README "Reels"). Else leave `[]` |
| `instagram.handle` | `instagram_handle` without the @ |
| `instagram.embeds` | 1 to 3 post or reel URLs (https://www.instagram.com/p/CODE/) |
| `order.dmMessage` | "Hi <name>! I would like to order..." plus blank lines for date, quantity, pickup or delivery |
| `order.links` | Each `order_booking_links` entry as `{ label, href }` (order form, Uber Eats, booking page) |
| `order.note` | Lead time or deposit rules, only if posted |
| `reviews.items` | Only real reviews from `google_listing_url` or tagged posts, with source. Else leave `[]` |
| `faq` | 2 to 4 answers built from known facts only |
| `contact.email`, `contact.phone` | `email`, `phone` from the lead or IG bio |
| `contact.address`, `contact.hours` | Only if public (storefront or Google listing). Home businesses: leave empty |
| `contact.socials` | `tiktok_url`, Facebook, Linktree, `google_listing_url` as `{ label, href }` |
| `seo.title` | "<name> \| <category> in <city>" |
| `seo.description` | 140 to 160 characters: what, where, how to order |
| `seo.keywords` | 3 to 5 phrases like "custom cakes Mississauga" |
| `seo.ogPhoto` | `/images/og-photo.jpg` (480x630 PNG or JPG). Used for the static share image `public/og.jpg`, made by `npm run og` (publish.sh runs it). Keep `siteUrl` set to the live domain so og:image is absolute |

Leave anything unknown empty. Empty sections disappear, and that is better than invented content.

## Non-food businesses (salons, nails, barbers, services)
Service presets (`salon-chic`, `barber-bold`, `barber-bold-light`) already default the hero primary CTA to "DM to book". If `order.links` has a booking page (Setmore, Square, Booksy), put it first: the hero button becomes "Book now" and links there. Food presets keep "Order by Instagram DM". The header DM button defaults to "DM to book" on those same presets (else "DM to order"). Explicit `hero.primaryCta` and `order.headerCtaLabel` always win over these defaults.

Still set the other labels so nothing reads like a bakery: `menu.label: "Services"`, `order.label: "How to book"`, `contact.title: "Contact"` (or "Contact and booking"). `schemaType` BeautySalon or HairSalon.

## Which preset

| Business | `theme.preset` | Fonts (headings / body / wordmark) | Look |
| - | - | - | - |
| Cakes, cupcakes, cookies, dessert tables | `bakery-pastel` | Playfair Display / Outfit / name in Playfair | cream and rose, round corners |
| Home kitchens, tiffin, street food, small takeout | `warm-food` | DM Serif Display / Nunito | warm cream and burnt orange |
| Caterers, party trays, event and wedding food, grazing tables | `catering-events` | DM Serif Display / Outfit / name in Parisienne script | paper, deep raspberry |
| Florists, event decor, balloon and party styling | `floral-elegant` | Cormorant Garamond / Jost | stone and mauve, sharp corners |
| Nail, lash, brow, beauty and hair salons, spas, makeup artists | `salon-chic` | Cormorant Garamond / Montserrat / name in Cormorant | blush white and dusty rose |
| Barbers, men's grooming, fade and beard shops (dark logo or moody photos) | `barber-bold` | Anton (uppercase) / Inter | black, bone and gold |
| Barbers with bright photos or a light logo | `barber-bold-light` | Anton (uppercase) / Inter | warm paper, ink and rust |

If unsure between the two barber presets, use `barber-bold`. Override `theme.colors.accent` with the logo colour if obvious. Optional switches: `theme.wordmark: "script"` puts the business name in the script font (never use script for headings), `theme.headingCase: "upper"` or `"normal"`.
Never set `theme.fonts.display` to a swashy or quirky serif (no Fraunces).

## Menu and services

Use the same `menu` block for food menus and for service lists.

```ts
menu: {
  label: "Menu",          // "Services" for salons and barbers
  title: "What we make",
  intro: "Optional line",
  variant: "list",        // "list" for text menus and services, "cards" when items have photos
  layout: "tabs",         // "tabs" when 3 or more categories, else leave out ("stacked")
  showPrices: true,       // false hides every price on the page
  priceNote: "Message us for a quote", // shown only when showPrices is false
  groups: [
    {
      title: "Canapes",
      note: "Minimum 16 per item",      // optional, shown as a small badge
      items: [
        { name: "Paneer tikka", description: "Mint chutney", veg: true, price: "$3" },
        { name: "Chicken biryani", dietary: ["halal", "spicy"] },
        { name: "Skin fade", price: "$35", duration: "45 min", tag: "Most booked" },
      ],
    },
  ],
  footnote: "Optional small print",
},
```

Item fields: `name` (required), `description`, `price` (free text: "$35", "From $65", "$3 each"), `duration` (services), `veg: true`, `dietary` (any of `veg`, `vegan`, `halal`, `gf`, `spicy`, `nonveg`; a legend appears automatically), `tag`, `image` (cards), `href` (IG post).

With prices: prices were posted on IG. Put them on each item and leave `showPrices` out.
Without prices: prices were never posted, or the business quotes by DM. Leave `price` off every item (never guess one), or set `showPrices: false` to hide any that exist, and add a `priceNote` like "Message us for pricing on your date and guest count."
Services (salons, barbers): `label: "Services"`, `variant: "list"`, one group per service type (Cuts, Beard, Nails, Lashes), `duration` when posted, and a note such as "Price on consultation" for custom work.
Old configs with only `title`, `variant`, `groups` and `footnote` keep working unchanged.

## Images

Put photos in `public/images` at full resolution (up to about 2400 px wide is plenty). `npm run build` runs `scripts/optimize-images.mjs` first, which makes the static WebP and AVIF sizes in `public/images/_opt` and `lib/image-manifest.json`; commit both. Never re-enable Vercel Image Optimization. Gallery tiles read their width and height from the manifest when the config omits them.
