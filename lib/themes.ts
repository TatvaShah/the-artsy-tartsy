import type { FontKey, ThemeColors, ThemePresetName, ThemeTone } from "./types";

type Preset = {
  colors: ThemeColors;
  fonts: { display: FontKey; body: FontKey; script: FontKey };
  radius: "soft" | "round" | "sharp";
  wordmark?: "display" | "script"; // script fonts are only ever used for the wordmark
  headingCase?: "normal" | "upper";
};

// Font rule: headings use clean faces only (DM Serif Display, Playfair Display, Cormorant, Anton,
// Montserrat, Outfit, Inter). No swashy display serifs like Fraunces. Script fonts: wordmark only.

export const presets: Record<ThemePresetName, Preset> = {
  // Cakes, cupcakes, cookies, dessert tables
  "bakery-pastel": {
    colors: {
      bg: "#fbf6f1",
      surface: "#ffffff",
      ink: "#3a2420",
      text: "#4a3430",
      muted: "#7a625b",
      accent: "#c0566e",
      accentInk: "#ffffff",
      soft: "#f6e1e3",
      line: "#ecdcd4",
    },
    fonts: { display: "playfair", body: "outfit", script: "greatVibes" },
    radius: "round",
  },
  // Home kitchens, caterers, tiffin, street food
  "warm-food": {
    colors: {
      bg: "#fbf5ea",
      surface: "#fffdf8",
      ink: "#2b1d12",
      text: "#3d2c1f",
      muted: "#6e5a48",
      accent: "#c2501f",
      accentInk: "#ffffff",
      soft: "#f4e2c4",
      line: "#e8d8bd",
    },
    fonts: { display: "dmSerif", body: "nunito", script: "dancing" },
    radius: "soft",
  },
  // Florists, event decor, wedding and party styling
  "floral-elegant": {
    colors: {
      bg: "#f7f5f0",
      surface: "#ffffff",
      ink: "#1f2a24",
      text: "#2f3a33",
      muted: "#66706a",
      accent: "#7d5a6b",
      accentInk: "#ffffff",
      soft: "#e9e4dc",
      line: "#dcd6cc",
    },
    fonts: { display: "cormorant", body: "jost", script: "greatVibes" },
    radius: "sharp",
  },
  // Beauty, nail, lash, brow and hair salons, spas, makeup artists
  "salon-chic": {
    colors: {
      bg: "#faf6f4",
      surface: "#ffffff",
      ink: "#2a1f22",
      text: "#3b3033",
      muted: "#7b6c70",
      accent: "#a8647a",
      accentInk: "#ffffff",
      soft: "#f3e6e8",
      line: "#eadcdf",
    },
    fonts: { display: "cormorant", body: "montserrat", script: "parisienne" },
    radius: "soft",
  },
  // Barbers and men's grooming, dark (after Jatin Blendzz): black, bone and gold, condensed caps
  "barber-bold": {
    colors: {
      bg: "#0b0b0c",
      surface: "#141416",
      ink: "#f3efe6",
      text: "#dcd7cd",
      muted: "#a39f97",
      accent: "#c9a45c",
      accentInk: "#0b0b0c",
      soft: "#1d1d20",
      line: "#2a2a2e",
    },
    fonts: { display: "anton", body: "inter", script: "anton" },
    radius: "sharp",
    wordmark: "display",
    headingCase: "upper",
  },
  // Barbers, light variant (after Jatin Blendzz light): warm paper, ink and rust
  "barber-bold-light": {
    colors: {
      bg: "#f6f1e9",
      surface: "#fffcf6",
      ink: "#1b1a17",
      text: "#2c2a26",
      muted: "#6b655b",
      accent: "#9a3b22",
      accentInk: "#ffffff",
      soft: "#ece5d8",
      line: "#d9d0c1",
    },
    fonts: { display: "anton", body: "inter", script: "anton" },
    radius: "sharp",
    wordmark: "display",
    headingCase: "upper",
  },
  // Caterers, party trays, event and wedding food (after Little Bites v2)
  "catering-events": {
    colors: {
      bg: "#f6efe6",
      surface: "#fffaf6",
      ink: "#241614",
      text: "#3a2824",
      muted: "#5c463f",
      accent: "#9a3044",
      accentInk: "#fffaf6",
      soft: "#f3dfe2",
      line: "#e6d8c8",
    },
    fonts: { display: "dmSerif", body: "outfit", script: "parisienne" },
    radius: "soft",
    wordmark: "script",
  },
};

export const radiusScale = {
  soft: { card: "1rem", pill: "999px", media: "1.25rem" },
  round: { card: "1.75rem", pill: "999px", media: "2rem" },
  sharp: { card: "0.25rem", pill: "0.25rem", media: "0.25rem" },
};

// Background tones. A tone swaps only the page background and card surface; the soft band and
// border lines are mixed from the accent and ink so they stay in harmony with any accent override.
// "classic" keeps the preset exactly as it was.
type ToneBase = { bg: string; surface: string };
export const tones: Record<Exclude<ThemeTone, "auto" | "classic">, ToneBase & { dark: boolean }> = {
  sand: { bg: "#f6f0e6", surface: "#fffbf4", dark: false },
  sage: { bg: "#f1f3ec", surface: "#fbfcf8", dark: false },
  mist: { bg: "#f2f4f6", surface: "#ffffff", dark: false },
  blush: { bg: "#faf1ef", surface: "#fffafa", dark: false },
  navy: { bg: "#0b111d", surface: "#121a29", dark: true },
  espresso: { bg: "#120e0b", surface: "#1b1612", dark: true },
  forest: { bg: "#0a120f", surface: "#111b17", dark: true },
};

// Tones the slug based "auto" pick may choose for each preset (all of them read well with it).
export const autoTones: Record<ThemePresetName, ThemeTone[]> = {
  "bakery-pastel": ["classic", "blush", "sand", "mist"],
  "warm-food": ["classic", "sand", "sage"],
  "catering-events": ["classic", "sand", "blush"],
  "floral-elegant": ["classic", "sage", "mist", "blush"],
  "salon-chic": ["classic", "blush", "mist", "sand"],
  "barber-bold": ["classic", "navy", "espresso", "forest"],
  "barber-bold-light": ["classic", "sand", "mist"],
};
