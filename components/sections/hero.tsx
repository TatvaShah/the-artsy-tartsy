import { DmButton } from "@/components/dm-button";
import { Media } from "@/components/media";
import { defaultHeroCta, heroVariant, igDmUrl, site } from "@/lib/site";

function Ctas({ center }: { center?: boolean }) {
  const h = site.hero;
  const fallback = defaultHeroCta();
  return (
    <div className={`mt-8 flex flex-wrap gap-3 ${center ? "justify-center" : ""}`}>
      {h.primaryCta ? (
        <a href={h.primaryCta.href} className="btn btn-primary">
          {h.primaryCta.label}
        </a>
      ) : fallback.kind === "link" ? (
        <a href={fallback.href} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
          {fallback.label}
        </a>
      ) : (
        <DmButton href={igDmUrl} message={site.order.dmMessage} label={fallback.label} />
      )}
      {h.secondaryCta ? (
        <a href={h.secondaryCta.href} className="btn btn-ghost">
          {h.secondaryCta.label}
        </a>
      ) : null}
    </div>
  );
}

function Copy({ center, light }: { center?: boolean; light?: boolean }) {
  const h = site.hero;
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : ""}>
      {h.eyebrow ? <p className={light ? "eyebrow !text-white/85" : "eyebrow"}>{h.eyebrow}</p> : null}
      <h1 className={`mt-3 text-4xl leading-[1.05] tracking-tight sm:text-6xl ${light ? "!text-white" : ""}`}>{h.headline}</h1>
      {h.subhead ? (
        <p className={`mt-5 text-lg leading-8 ${light ? "text-white/90" : "text-muted"} ${center ? "mx-auto max-w-2xl" : "max-w-xl"}`}>{h.subhead}</p>
      ) : null}
      <Ctas center={center} />
    </div>
  );
}

export function Hero() {
  const h = site.hero;
  const imgs = h.images ?? [];
  const variant = heroVariant();

  if (variant === "full" && imgs[0]) {
    return (
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden">
        <Media img={imgs[0]} sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-32">
          <Copy light />
        </div>
      </section>
    );
  }

  if (variant === "centered") {
    return (
      <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <Copy center />
        {imgs.length ? (
          <div className="mt-12 grid grid-cols-3 gap-3 md:gap-5">
            {imgs.slice(0, 3).map((img, i) => (
              <div key={img.src} className={`relative aspect-[4/5] overflow-hidden rounded-media bg-soft ${i === 1 ? "md:-translate-y-6" : ""}`}>
                <Media img={img} sizes="33vw" priority={i === 0} />
              </div>
            ))}
          </div>
        ) : null}
      </section>
    );
  }

  if (variant === "editorial") {
    // Big headline with the subhead and buttons beside it, then a wide photo band underneath.
    return (
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-10 md:pb-16 md:pt-16">
        <div className="grid items-end gap-6 md:grid-cols-[1.25fr_1fr] md:gap-12">
          <div>
            {h.eyebrow ? <p className="eyebrow">{h.eyebrow}</p> : null}
            <h1 className="mt-3 text-4xl leading-[1.05] tracking-tight sm:text-6xl">{h.headline}</h1>
          </div>
          <div>
            {h.subhead ? <p className="text-lg leading-8 text-muted">{h.subhead}</p> : null}
            <Ctas />
          </div>
        </div>
        {imgs.length ? (
          <div className={`mt-10 grid gap-3 md:mt-12 md:gap-5 ${imgs.length > 1 ? "grid-cols-2 md:grid-cols-[2fr_1fr_1fr]" : ""}`}>
            <div className={`relative overflow-hidden rounded-media bg-soft ${imgs.length > 1 ? "col-span-2 aspect-[16/10] md:col-span-1 md:aspect-auto md:min-h-[360px]" : "aspect-[16/9]"}`}>
              <Media img={imgs[0]} sizes={imgs.length > 1 ? "(min-width: 768px) 50vw, 100vw" : "100vw"} priority />
            </div>
            {imgs.slice(1, 3).map((img) => (
              <div key={img.src} className="relative aspect-[4/5] overflow-hidden rounded-media bg-soft">
                <Media img={img} sizes="(min-width: 768px) 25vw, 50vw" />
              </div>
            ))}
          </div>
        ) : null}
      </section>
    );
  }

  // split (photos right) and split-reverse (photos left). With three photos the big one now fills
  // the full height of the two small squares beside it (it used to stop short at 4:5).
  // split (photos right) and split-reverse (photos left on wider screens; copy stays first on phones)
  const reverse = variant === "split-reverse";
  return (
    <section className={`mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:py-16 ${reverse ? "md:grid-cols-[0.95fr_1.05fr]" : "md:grid-cols-[1.05fr_0.95fr]"}`}>
      <div className={reverse ? "md:order-2" : ""}>
        <Copy />
      </div>
      {imgs.length ? (
        <div className={`grid gap-3 ${reverse ? "grid-cols-[1fr_1.4fr] md:order-1" : "grid-cols-[1.4fr_1fr]"}`}>
          <div className={`relative overflow-hidden rounded-media bg-soft ${imgs.length > 2 ? "row-span-2 h-full min-h-0" : imgs.length > 1 ? "row-span-2 aspect-[4/5]" : "col-span-2 aspect-[4/5]"} ${imgs.length > 1 && reverse ? "col-start-2 row-start-1" : ""}`}>
            <Media img={imgs[0]} sizes="(min-width: 768px) 30vw, 60vw" priority />
          </div>
          {imgs.slice(1, 3).map((img) => (
            <div key={img.src} className={`relative aspect-square overflow-hidden rounded-media bg-soft ${reverse ? "col-start-1" : ""}`}>
              <Media img={img} sizes="(min-width: 768px) 20vw, 40vw" />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
