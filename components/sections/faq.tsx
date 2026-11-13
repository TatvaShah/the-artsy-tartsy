import { SectionHead } from "@/components/media";
import { has, site } from "@/lib/site";

export function FaqSection() {
  if (!has(site.faq)) return null;
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-16 md:py-24">
      <SectionHead eyebrow="Questions" title="Good to know" />
      <div className="mt-8 divide-y divide-line border-y border-line">
        {site.faq.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="cursor-pointer list-none font-semibold text-ink">
              {f.q}
              <span className="float-right text-accent group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 leading-7 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
