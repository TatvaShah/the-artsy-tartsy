import { InstagramGlyph } from "@/components/ig-glyph";
import { SectionHead } from "@/components/media";
import { ReelVideo } from "@/components/reel-video";
import { optimizedSources } from "@/lib/image-loader";
import { has, igHandle, igUrl, site } from "@/lib/site";

// Local mp4 copies of reels (public/videos) play muted on a loop while on screen, no Instagram iframe.
// The section hides when reels.items is empty. See README "Reels" for where the files may come from.
export function Reels() {
  const r = site.reels;
  if (!r || !has(r.items)) return null;
  const items = r.items.slice(0, 3);
  const single = items.length === 1;
  // The gallery already ends with an Instagram link, so this one only shows when there is no gallery.
  const link = !has(site.gallery?.items) ? (
    <p className="mt-8">
      <a href={igUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
        <InstagramGlyph />
        Visit @{igHandle} for more reels
      </a>
    </p>
  ) : null;
  return (
    <section id="reels" className={`scroll-mt-24 mx-auto max-w-6xl px-5 py-16 md:py-24 ${single ? "grid items-center gap-10 md:grid-cols-[1fr_minmax(0,22rem)] md:gap-16" : ""}`}>
      <div>
        <SectionHead eyebrow="Reels" title={r.title ?? "In motion"} intro={r.intro} />
        {single ? link : null}
      </div>
      <div className={`grid gap-4 md:gap-6 ${single ? "mx-auto w-full max-w-xs md:max-w-none" : items.length === 2 ? "mt-10 grid-cols-2 md:max-w-3xl" : "mt-10 grid-cols-2 md:grid-cols-3"}`}>
        {items.map((it, i) => (
          <figure key={it.src} className={items.length === 3 && i === 2 ? "hidden md:block" : ""}>
            <ReelVideo
              src={it.src}
              poster={it.poster ? optimizedSources(it.poster, 828).src : undefined}
              label={it.title ?? `${site.name} reel ${i + 1}`}
              igHref={it.href ?? igUrl}
              igHandle={igHandle}
            />
            {it.title || it.caption ? (
              <figcaption className="px-1 pt-3">
                {it.title ? <p className="font-display text-lg text-ink sm:text-xl">{it.title}</p> : null}
                {it.caption ? <p className="mt-1 text-sm text-muted">{it.caption}</p> : null}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
      {single ? null : link}
    </section>
  );
}
