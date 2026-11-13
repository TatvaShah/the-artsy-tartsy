import type { ReactNode } from "react";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { FaqSection } from "@/components/sections/faq";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { Highlights } from "@/components/sections/highlights";
import { InstagramEmbeds } from "@/components/sections/instagram-embeds";
import { Menu } from "@/components/sections/menu";
import { Order } from "@/components/sections/order";
import { Reels } from "@/components/sections/reels";
import { Reviews } from "@/components/sections/reviews";
import { sectionOrder } from "@/lib/site";
import type { SectionKey } from "@/lib/types";

const SECTIONS: Record<SectionKey, () => ReactNode> = {
  menu: Menu,
  gallery: Gallery,
  reels: Reels,
  about: About,
  reviews: Reviews,
  instagram: InstagramEmbeds,
  order: Order,
  faq: FaqSection,
};

// Hero and highlights first, contact last. The middle follows site.sections (optional),
// else the default order. Each section returns null when its config is empty.
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Highlights />
      {sectionOrder().map((key) => {
        const Section = SECTIONS[key];
        return <Section key={key} />;
      })}
      <Contact />
    </main>
  );
}
