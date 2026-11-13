import { DmButton } from "@/components/dm-button";
import { SectionHead } from "@/components/media";
import { has, igDmUrl, igHandle, isBookingBusiness, site } from "@/lib/site";

export function Order() {
  const o = site.order;
  const booking = isBookingBusiness();
  const links = o.links?.filter((l) => l.href) ?? [];
  // A booking business with its own booking page: that page is the main button, the DM is the backup.
  const linkFirst = booking && links.length > 0;
  const steps = has(o.steps)
    ? o.steps
    : linkFirst
      ? [`Tap "${links[0].label}" to pick a time online.`, `Questions first? Copy the starter message and DM @${igHandle}.`, "Get a reply and confirm your booking."]
      : ["Tap the button to copy a starter message.", `Paste it in a DM to @${igHandle} with your date and details.`, booking ? "Get a reply and confirm your booking." : "Get a quote and confirm your order."];
  return (
    <section id="order" className="scroll-mt-24 bg-soft">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <SectionHead eyebrow={o.label ?? (booking ? "How to book" : "How to order")} title={o.title ?? (booking ? "Book in a quick DM" : "Order in a quick DM")} intro={o.intro} />
          <ol className="mt-8 grid gap-4">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-accent-ink">{i + 1}</span>
                <p className="pt-1.5 leading-7">{s}</p>
              </li>
            ))}
          </ol>
          {o.note ? <p className="mt-6 text-sm text-muted">{o.note}</p> : null}
        </div>
        <div className="rounded-card border border-line bg-surface p-6 sm:p-8">
          <p className="eyebrow">Starter message</p>
          <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-6 text-ink">{o.dmMessage}</pre>
          <div className="mt-6 flex flex-wrap gap-3">
            {linkFirst ? (
              <a href={links[0].href} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                {links[0].label}
              </a>
            ) : null}
            <DmButton href={igDmUrl} message={o.dmMessage} label={`Copy and DM @${igHandle}`} className={linkFirst ? "btn btn-ghost" : undefined} />
            {(linkFirst ? links.slice(1) : links).map((l) => (
              <a key={l.href} href={l.href} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
