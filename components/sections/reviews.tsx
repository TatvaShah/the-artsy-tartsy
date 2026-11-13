import { SectionHead } from "@/components/media";
import { has, site } from "@/lib/site";

// Only real, sourced reviews. Leave empty rather than inventing any.
export function Reviews() {
  const r = site.reviews;
  if (!r || !has(r.items)) return null;
  return (
    <section id="reviews" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 md:py-24">
      <SectionHead eyebrow="Kind words" title={r.title ?? "What people say"} center />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {r.items.map((it) => (
          <figure key={it.quote} className="rounded-card border border-line bg-surface p-6">
            <blockquote className="font-display text-lg leading-7 text-ink">“{it.quote}”</blockquote>
            {it.author || it.source ? (
              <figcaption className="mt-4 text-sm text-muted">
                {[it.author, it.source].filter(Boolean).join(", ")}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
