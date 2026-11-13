import { Media } from "@/components/media";
import type { Dietary, MenuGroup, MenuItem } from "@/lib/types";

export const dietaryInfo: Record<Dietary, { label: string; short: string; color: string }> = {
  veg: { label: "Vegetarian", short: "V", color: "#4f8a3c" },
  vegan: { label: "Vegan", short: "VG", color: "#2f7a4a" },
  halal: { label: "Halal", short: "H", color: "#2c6e8f" },
  gf: { label: "Gluten free", short: "GF", color: "#a07a2c" },
  spicy: { label: "Spicy", short: "S", color: "#c0392b" },
  nonveg: { label: "Contains meat", short: "N", color: "#8e3b2c" },
};

export function itemDietary(it: MenuItem): Dietary[] {
  const d = [...(it.dietary ?? [])];
  if (it.veg && !d.includes("veg")) d.unshift("veg");
  return d;
}

export function DietIcon({ d }: { d: Dietary }) {
  const info = dietaryInfo[d];
  if (d === "veg" || d === "vegan") {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label={info.label} className="h-4 w-4 shrink-0" style={{ fill: info.color }}>
        <title>{info.label}</title>
        <path d="M20 4C11 4 5 8.5 5 15c0 1.7.5 3.2 1.3 4.4L4 21.7l1.3 1.3 2.4-2.4C8.9 21.5 10.4 22 12 22c6.5 0 9-7 8-18Zm-8.6 14.4-1.2-1.2c2.2-2.6 4.6-4.7 7.3-6.4-2.4 2-4.4 4.6-6.1 7.6Z" />
      </svg>
    );
  }
  return (
    <span
      role="img"
      aria-label={info.label}
      title={info.label}
      className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-sm border px-0.5 text-[9px] font-bold leading-none"
      style={{ color: info.color, borderColor: info.color }}
    >
      {info.short}
    </span>
  );
}

function Name({ it }: { it: MenuItem }) {
  const diet = itemDietary(it);
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span>{it.name}</span>
      {diet.map((d) => (
        <DietIcon key={d} d={d} />
      ))}
    </span>
  );
}

function Meta({ it, showPrices, accent }: { it: MenuItem; showPrices: boolean; accent?: boolean }) {
  const price = showPrices && it.price ? it.price : null;
  if (!price && !it.duration) return null;
  return (
    <div className="shrink-0 text-right">
      {price ? <p className={`font-semibold ${accent ? "text-accent" : "text-ink"}`}>{price}</p> : null}
      {it.duration ? <p className="text-xs text-muted">{it.duration}</p> : null}
    </div>
  );
}

export function GroupItems({ g, list, showPrices }: { g: MenuGroup; list: boolean; showPrices: boolean }) {
  if (list) {
    return (
      <ul className="mt-2 grid divide-y divide-line md:grid-cols-2 md:gap-x-12 md:divide-y-0">
        {g.items.map((it) => (
          <li key={it.name} className="flex items-start justify-between gap-6 border-line py-4 md:border-b">
            <div className="min-w-0">
              <p className="font-semibold text-ink">
                <Name it={it} />
                {it.tag ? <span className="ml-2 rounded-pill bg-soft px-2 py-0.5 text-xs font-medium text-accent">{it.tag}</span> : null}
              </p>
              {it.description ? <p className="mt-1 text-sm leading-6 text-muted">{it.description}</p> : null}
              {it.href ? (
                <a href={it.href} className="mt-1 inline-block text-xs underline decoration-line underline-offset-4 hover:text-accent">
                  See it on Instagram
                </a>
              ) : null}
            </div>
            <Meta it={it} showPrices={showPrices} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {g.items.map((it) => (
        <article key={it.name} className="overflow-hidden rounded-card border border-line bg-surface">
          {it.image ? (
            <div className="relative aspect-[4/3] bg-soft">
              <Media img={it.image} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
            </div>
          ) : null}
          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <h4 className="font-display text-xl text-ink">
                <Name it={it} />
              </h4>
              <Meta it={it} showPrices={showPrices} accent />
            </div>
            {it.tag ? <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">{it.tag}</p> : null}
            {it.description ? <p className="mt-2 text-sm leading-6 text-muted">{it.description}</p> : null}
            {it.href ? (
              <a href={it.href} className="mt-3 inline-block text-sm underline decoration-line underline-offset-4 hover:text-accent">
                See it on Instagram
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function GroupNote({ note }: { note?: string }) {
  if (!note) return null;
  return <span className="inline-block rounded-pill bg-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">{note}</span>;
}
