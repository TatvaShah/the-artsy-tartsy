import { Media, SectionHead } from "@/components/media";
import { site } from "@/lib/site";

export function About() {
  const a = site.about;
  if (!a || !a.body?.length) return null;
  return (
    <section id="about" className="scroll-mt-24 bg-soft/60">
      <div className={`mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:py-24 ${a.image ? "md:grid-cols-2" : ""}`}>
        {a.image ? (
          <div className="relative aspect-[4/5] overflow-hidden rounded-media bg-soft">
            <Media img={a.image} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        ) : null}
        <div>
          <SectionHead eyebrow="About" title={a.title ?? `About ${site.name}`} />
          <div className="mt-5 grid gap-4 text-base leading-7">
            {a.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
