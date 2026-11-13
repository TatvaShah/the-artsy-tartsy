// Shape of site.config.ts. Every optional field that is empty hides its section.

export type ThemePresetName =
  | "bakery-pastel"
  | "warm-food"
  | "floral-elegant"
  | "salon-chic"
  | "barber-bold"
  | "barber-bold-light"
  | "catering-events";

export type ThemeColors = {
  bg: string; // page background
  surface: string; // cards and alternate bands
  ink: string; // headings
  text: string; // body copy
  muted: string; // secondary copy
  accent: string; // buttons and highlights
  accentInk: string; // text on accent
  soft: string; // soft tint band
  line: string; // borders
};

export type FontKey =
  | "fraunces" // legacy key only: now maps to Playfair Display (no swashy Fraunces)
  | "playfair"
  | "cormorant"
  | "dmSerif"
  | "outfit"
  | "inter"
  | "nunito"
  | "jost"
  | "greatVibes"
  | "dancing"
  | "parisienne"
  | "anton"
  | "montserrat"
  | "oswald";

export type ThemeConfig = {
  preset: ThemePresetName;
  colors?: Partial<ThemeColors>; // override any preset color
  fonts?: { display?: FontKey; body?: FontKey; script?: FontKey }; // script is for the wordmark only, never headings
  radius?: "soft" | "round" | "sharp";
  wordmark?: "display" | "script"; // header and footer name font; preset decides by default
  headingCase?: "normal" | "upper"; // uppercase headings (barber presets default to upper)
  // Background tone. Leave unset (or "auto") and the kit picks one from the business name, so two sites
  // on the same preset do not share the exact same background. "classic" is the preset's own look.
  // Light presets: classic | sand | sage | mist | blush. Dark presets: classic | navy | espresso | forest.
  tone?: ThemeTone;
};

export type ThemeTone = "auto" | "classic" | "sand" | "sage" | "mist" | "blush" | "navy" | "espresso" | "forest";

export type HeroVariant = "auto" | "split" | "split-reverse" | "full" | "centered" | "editorial";

// Middle sections that can be reordered with site.sections. Hero and highlights always come first,
// contact always comes last. Sections left out of the list keep their default order after it.
export type SectionKey = "menu" | "gallery" | "reels" | "about" | "reviews" | "instagram" | "order" | "faq";

export type Img = {
  src: string; // path under /public (preferred) or https URL
  alt: string;
  width?: number;
  height?: number;
};

export type Dietary = "veg" | "vegan" | "halal" | "gf" | "spicy" | "nonveg";

export type MenuItem = {
  name: string;
  description?: string;
  price?: string; // optional free text, e.g. "$65", "From $40", "$3 each". Hidden when menu.showPrices is false
  duration?: string; // services: e.g. "45 min"
  dietary?: Dietary[]; // small icons next to the name
  veg?: boolean; // shorthand for dietary: ["veg"]
  image?: Img;
  tag?: string; // e.g. "Best seller"
  href?: string; // IG post for this item
};

export type MenuGroup = {
  title: string;
  note?: string; // per category, e.g. "Minimum 16 per item" or "Price on consultation"
  items: MenuItem[];
};

// href is kept for reference only: photos now open in the on page lightbox instead of linking out.
export type GalleryItem = Img & { caption?: string; href?: string };

export type Reel = {
  src: string; // local mp4 under /public/videos (H.264, muted, about 720px wide, under 3 MB; see README "Reels")
  poster?: string; // JPG or WebP under /public/videos, first frame; shown before play and for reduced motion
  title?: string;
  caption?: string;
  href?: string; // original IG reel
};

export type Review = { quote: string; author?: string; source?: string };

export type Faq = { q: string; a: string };

export type Link = { label: string; href: string };

export type SiteConfig = {
  name: string;
  shortName?: string;
  tagline: string;
  category: string; // human readable, e.g. "Custom celebration cakes"
  schemaType?: string; // schema.org type: Bakery, FoodEstablishment, Florist, BeautySalon, LocalBusiness
  area?: string; // city or area served, e.g. "Mississauga"
  siteUrl?: string; // e.g. "https://littlebakes.vercel.app"; falls back to Vercel env

  theme: ThemeConfig;
  logo?: string; // PNG or JPG under /public; used for header and favicon
  showNameWithLogo?: boolean;

  hero: {
    // Leave unset (or "auto") to get a layout picked from the business name among split, split-reverse,
    // centered and editorial. "full" needs one strong photo with room for text, so it is never auto picked.
    variant?: HeroVariant;
    eyebrow?: string;
    headline: string;
    subhead?: string;
    images?: Img[]; // first is main; split variant shows up to 3
    primaryCta?: Link; // optional override; else preset default (see defaultHeroCta in lib/site.ts)
    secondaryCta?: Link;
  };

  highlights?: string[]; // short badges under the hero

  sections?: SectionKey[]; // optional order of the middle sections, e.g. ["gallery", "menu", "about", "order"]

  about?: { title?: string; body: string[]; image?: Img };

  menu?: {
    label?: string; // nav and eyebrow label, default "Menu" (use "Services" for non-food)
    title?: string;
    intro?: string;
    variant?: "cards" | "list";
    layout?: "stacked" | "tabs"; // tabs: one category at a time, sticky sideways scrolling tab bar. Default "stacked"
    showPrices?: boolean; // default true. false hides every price, e.g. "quoted by DM" businesses
    priceNote?: string; // shown under the menu when prices are hidden, e.g. "Message us for a quote"
    dietaryLegend?: boolean; // default true when any item has dietary icons
    groups: MenuGroup[];
    footnote?: string;
  };

  gallery?: { title?: string; intro?: string; items: GalleryItem[] };

  reels?: { title?: string; intro?: string; items: Reel[] };

  instagram: {
    handle: string; // without @
    embeds?: string[]; // post or reel URLs to embed with the official iframe
    embedsTitle?: string;
  };

  order: {
    label?: string; // nav and eyebrow label, default "How to order" (e.g. "How to book")
    headerCtaLabel?: string; // header DM button; default "DM to book" on service presets, else "DM to order"
    title?: string;
    intro?: string;
    steps?: string[];
    dmMessage: string; // prefilled note copied before opening IG DM
    links?: Link[]; // order form, Uber Eats, booking page, etc.
    note?: string; // e.g. "Please order 7 days ahead"
  };

  reviews?: { title?: string; items: Review[] };

  faq?: Faq[];

  contact?: {
    title?: string; // default "Contact and pickup"
    area?: string;
    address?: string; // only if public; adds a map
    hours?: { days: string; time: string }[];
    phone?: string;
    email?: string;
    socials?: Link[]; // TikTok, Facebook, Linktree...
  };

  seo: {
    title: string; // full default title
    description: string;
    keywords?: string[];
    ogPhoto?: string; // optional PNG or JPG in /public shown on the generated 1200x630 share card
  };
};
