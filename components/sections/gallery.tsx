import Image from "next/image";
import { InstagramGlyph } from "@/components/ig-glyph";
import { Lightbox, type LightboxItem } from "@/components/lightbox";
import { SectionHead } from "@/components/media";
import { imageSize, optimizedSources } from "@/lib/image-loader";
import { has, igHandle, igUrl, site } from "@/lib/site";

// Photos open full screen in a lightbox (no link out per photo). One Instagram link sits under the grid.
export function Gallery() {
  const g = site.gallery;
  if (!g || !has(g.items)) return null;
  const items: LightboxItem[] = g.items.map((it) => ({ ...optimizedSources(it.src), alt: it.alt, caption: it.caption }));
  return (
    <section id="gallery" className="scroll-mt-24 bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <SectionHead eyebrow="Gallery" title={g.title ?? "Recent work"} intro={g.intro} />
        <Lightbox items={items}>
          <div className="mt-10 columns-2 gap-3 md:columns-3 md:gap-5">
            {g.items.map((it, i) => (
              <figure key={it.src} className="mb-3 break-inside-avoid md:mb-5">
                <button
                  type="button"
                  data-lb-index={i}
                  aria-label={`View larger: ${it.alt}`}
                  aria-haspopup="dialog"
                  className="group relative block w-full cursor-zoom-in overflow-hidden rounded-media"
                >
                  <Image
                    src={it.src}
                    alt={it.alt}
                    width={it.width ?? imageSize(it.src)?.width ?? 1200}
                    height={it.height ?? imageSize(it.src)?.height ?? 1500}
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="h-auto w-full bg-soft object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </button>
                {it.caption ? <figcaption className="px-1 pt-2 text-sm text-muted">{it.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        </Lightbox>
        <p className="mt-8 text-center">
          <a href={igUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <InstagramGlyph />
            Visit @{igHandle} on Instagram
          </a>
        </p>
      </div>
    </section>
  );
}
