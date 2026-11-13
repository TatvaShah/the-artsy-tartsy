import { CLAUDAURA_URL, igHandle, igUrl, site } from "@/lib/site";

export function SiteFooter() {
  const c = site.contact;
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="wordmark text-3xl text-ink">{site.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">{site.tagline}</p>
        </div>
        <ul className="grid content-start gap-2 text-sm">
          <li>
            <a href={igUrl} className="hover:text-accent">
              Instagram @{igHandle}
            </a>
          </li>
          {c?.socials?.map((s) => (
            <li key={s.href}>
              <a href={s.href} className="hover:text-accent">
                {s.label}
              </a>
            </li>
          ))}
          {c?.email ? (
            <li>
              <a href={`mailto:${c.email}`} className="hover:text-accent">
                {c.email}
              </a>
            </li>
          ) : null}
          {c?.phone ? (
            <li>
              <a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`} className="hover:text-accent">
                {c.phone}
              </a>
            </li>
          ) : null}
        </ul>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
            {site.area ? `, ${site.area}` : ""}
          </p>
          <p>
            Website by{" "}
            <a href={CLAUDAURA_URL} className="font-medium text-ink underline decoration-line underline-offset-4">
              ClaudAura
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
