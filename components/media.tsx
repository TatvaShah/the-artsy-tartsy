import Image from "next/image";
import type { Img } from "@/lib/types";

// Fills its parent box. The parent sets the aspect ratio and rounding.
export function Media({ img, sizes, priority }: { img: Img; sizes: string; priority?: boolean }) {
  return <Image src={img.src} alt={img.alt} fill sizes={sizes} priority={priority} className="object-cover" />;
}

export function SectionHead({ eyebrow, title, intro, center }: { eyebrow?: string; title: string; intro?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-2 text-3xl leading-tight tracking-tight sm:text-5xl">{title}</h2>
      {intro ? <p className="mt-4 text-base leading-7 text-muted">{intro}</p> : null}
    </div>
  );
}
