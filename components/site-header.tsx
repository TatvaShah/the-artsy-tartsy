import Image from "next/image";
import Link from "next/link";
import { DmButton } from "@/components/dm-button";
import { has, igDmUrl, isBookingBusiness, isServicePreset, site } from "@/lib/site";

export function navLinks() {
  const links: { href: string; label: string }[] = [];
  if (has(site.menu?.groups)) links.push({ href: "#menu", label: site.menu?.label ?? "Menu" });
  if (has(site.gallery?.items)) links.push({ href: "#gallery", label: "Gallery" });
  if (site.about?.body?.length) links.push({ href: "#about", label: "About" });
  if (has(site.reviews?.items)) links.push({ href: "#reviews", label: "Reviews" });
  links.push({ href: "#order", label: site.order.label ?? (isBookingBusiness() ? "How to book" : "How to order") });
  return links;
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {site.logo ? (
            <Image src={site.logo} alt={`${site.name} logo`} width={44} height={44} className="h-11 w-11 rounded-full object-cover" priority />
          ) : null}
          {!site.logo || site.showNameWithLogo !== false ? (
            <span className="wordmark truncate text-xl text-ink sm:text-2xl">{site.shortName ?? site.name}</span>
          ) : null}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 text-sm md:flex">
          {navLinks().map((l) => (
            <a key={l.href} href={l.href} className="text-muted hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <DmButton href={igDmUrl} message={site.order.dmMessage} label={site.order.headerCtaLabel ?? (isServicePreset() ? "DM to book" : "DM to order")} className="btn btn-primary shrink-0 whitespace-nowrap !px-4 !py-2 text-sm" />
      </div>
    </header>
  );
}
