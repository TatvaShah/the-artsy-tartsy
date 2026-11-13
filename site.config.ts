import type { SiteConfig } from "@/lib/types";

export const site: SiteConfig = {
  name: "The Artsy Tartsy",
  tagline: "Fresh homemade eggless cakes and desserts.",
  category: "Eggless custom cakes",
  schemaType: "Bakery",
  area: "Brampton, ON",
  siteUrl: "https://the-artsy-tartsy-ca.vercel.app",

  theme: {
    preset: "bakery-pastel",
    colors: { accent: "#b76e84" },
  },
  logo: "/images/logo.jpg",
  showNameWithLogo: false,

  hero: {
    eyebrow: "Eggless cakes and desserts",
    headline: "Custom cakes, baked for your celebration",
    subhead: "Fresh homemade eggless cakes and desserts, including Biscoff cakes, soft pink bow cakes and chocolate tarts. Send a message to order, with pickup in Brampton.",
    images: [
      { src: "/images/post-4.jpg", alt: "A soft pink bow cake from The Artsy Tartsy", width: 1080, height: 1917 },
      { src: "/images/post-5.jpg", alt: "A Biscoff birthday cake from The Artsy Tartsy", width: 1080, height: 1440 },
      { src: "/images/post-8.jpg", alt: "Chocolate tarts from The Artsy Tartsy", width: 1080, height: 1080 },
    ],
    primaryCta: { label: "Order by Instagram DM", href: "https://ig.me/m/the_artsy_tartsy_" },
    secondaryCta: { label: "See the cakes", href: "#gallery" },
  },

  highlights: [
    "Fresh homemade eggless cakes and desserts",
    "Custom cakes, including Biscoff and bow cakes",
    "Chocolate tarts and other desserts",
    "Pickup in Brampton",
  ],

  about: {
    title: "Welcome to The Artsy Tartsy",
    body: [
      "The Artsy Tartsy is a home bakery in Brampton making fresh homemade eggless cakes and desserts to order.",
      "Recent orders have included Biscoff cakes, soft pink bow cakes, chocolate tarts and a Super Mario birthday cake. Send a message on Instagram to order. Pickup is available in Brampton.",
    ],
    image: { src: "/images/post-5.jpg", alt: "A Biscoff birthday cake from The Artsy Tartsy", width: 1080, height: 1440 },
  },

  menu: {
    label: "Menu",
    title: "What we bake",
    variant: "list",
    showPrices: false,
    priceNote: "Send a message for a quote on your date, flavour and design.",
    groups: [
      {
        title: "Cakes",
        items: [
          { name: "Eggless custom cakes" },
          { name: "Biscoff cake" },
          { name: "Soft pink bow cakes" },
          { name: "Themed birthday cakes" },
        ],
      },
      {
        title: "Desserts",
        items: [
          { name: "Chocolate tarts", description: "Finished with gold and white details." },
          { name: "Custom desserts" },
        ],
      },
    ],
  },

  gallery: {
    title: "Recent bakes",
    items: [
      { src: "/images/post-4.jpg", width: 1080, height: 1917, alt: "A soft pink bow cake from The Artsy Tartsy", caption: "Soft pink bow cake", href: "https://www.instagram.com/reel/DegEABWxZms/" },
      { src: "/images/post-5.jpg", width: 1080, height: 1440, alt: "A Biscoff birthday cake from The Artsy Tartsy", caption: "Biscoff cake", href: "https://www.instagram.com/p/DdxQg7ykTqz/" },
      { src: "/images/post-6.jpg", width: 720, height: 1280, alt: "A close look at a Biscoff cake from The Artsy Tartsy", caption: "Biscoff details", href: "https://www.instagram.com/reel/DdwykMLNBp7/" },
      { src: "/images/post-8.jpg", width: 1080, height: 1080, alt: "Chocolate tarts from The Artsy Tartsy", caption: "Chocolate tarts", href: "https://www.instagram.com/p/DdkkhoJDMR6/" },
      { src: "/images/post-9.jpg", width: 1080, height: 1440, alt: "A Super Mario birthday cake from The Artsy Tartsy", caption: "Super Mario cake", href: "https://www.instagram.com/p/DdVHa6EDO9S/" },
    ],
  },

  reels: { items: [] },

  instagram: {
    handle: "the_artsy_tartsy_",
    embeds: ["https://www.instagram.com/p/DdxQg7ykTqz/", "https://www.instagram.com/p/DdkkhoJDMR6/", "https://www.instagram.com/p/DdVHa6EDO9S/"],
  },

  order: {
    label: "How to order",
    title: "Order in a DM",
    intro: "Send a message on Instagram with your date, design and flavour. Pickup is available in Brampton.",
    dmMessage: "Hi The Artsy Tartsy! I would like to order.\nDate needed:\nCake or dessert:\nFlavour and design:\nPickup in Brampton:",
    headerCtaLabel: "DM to order",
    links: [{ label: "Order by Instagram DM", href: "https://ig.me/m/the_artsy_tartsy_" }],
  },

  reviews: { items: [] },

  faq: [
    { q: "How do I order?", a: "Send a message on Instagram with your date, design and flavour." },
    { q: "Are the cakes eggless?", a: "Yes. The Artsy Tartsy makes fresh homemade eggless cakes and desserts." },
    { q: "Do you offer pickup?", a: "Yes. Pickup is available in Brampton." },
  ],

  contact: {
    title: "Contact",
    area: "Brampton, Ontario",
    socials: [{ label: "Instagram", href: "https://www.instagram.com/the_artsy_tartsy_/" }],
  },

  seo: {
    title: "The Artsy Tartsy | Eggless custom cakes in Brampton",
    description: "Eggless custom cakes and desserts in Brampton, including Biscoff cakes, bow cakes and chocolate tarts. Order by Instagram DM, with pickup available.",
    keywords: ["eggless cakes Brampton", "Biscoff cake Brampton", "The Artsy Tartsy"],
    ogPhoto: "/images/og-photo.jpg",
  },
};
