import { has, site } from "@/lib/site";

export function Highlights() {
  if (!has(site.highlights)) return null;
  return (
    <section aria-label="Highlights" className="bg-ink text-bg">
      <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2 px-5 py-4 text-sm font-medium">
        {site.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </section>
  );
}
