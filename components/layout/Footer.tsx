import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";
import { CATEGORY_SHORT, mostRequested } from "@/lib/products";
import SocialLinks from "@/components/ui/SocialLinks";

const COMPANY = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Our work" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const heading = "text-xs font-medium uppercase tracking-[0.2em] text-surface/50";
const link = "text-sm text-surface/80 transition-colors hover:text-surface";

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-surface">
      <div className="mx-auto grid max-w-screen-2xl gap-10 px-4 py-16 sm:px-6 lg:px-8 xl:px-10 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-semibold">
            <Image src="/logo.png" alt="" width={256} height={240} className="h-12 w-auto rounded-lg bg-surface p-1" />
            <span>PRINT <span className="text-magenta">CIRCUIT</span></span>
          </Link>
          <p className="mt-2 font-script text-base text-pink-300">
            Crafted with precision &amp; care in Zimbabwe ✨
          </p>
          <p className="mt-3 text-sm text-surface/70">{SITE.address}</p>
          <dl className="mt-4 space-y-1 text-sm text-surface/70">
            {SITE.hours.map((h) => (
              <div key={h.days} className="flex gap-2">
                <dt>{h.days}:</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3 className={heading}>Shop</h3>
          <ul className="mt-4 space-y-2">
            {mostRequested(6).map((p) => (
              <li key={p.slug}>
                <Link href={`/shop/${p.slug}`} className={link}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={heading}>Categories</h3>
          <ul className="mt-4 space-y-2">
            {SITE.services.map((s) => (
              <li key={s.slug}>
                <Link href={`/shop?cat=${s.slug}`} className={link}>
                  {CATEGORY_SHORT[s.slug]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={heading}>Company</h3>
          <ul className="mt-4 space-y-2">
            {COMPANY.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className={link}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={heading}>Get in touch</h3>
          <address className="mt-4 space-y-2 not-italic">
            {SITE.phones.map((p) => (
              <p key={p}>
                <a href={`tel:${p.replace(/\s+/g, "")}`} className={link}>
                  {p}
                </a>
              </p>
            ))}
            <p>
              <a href={`mailto:${SITE.email}`} className={link}>
                {SITE.email}
              </a>
            </p>
            <p>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className={link}>
                Chat on WhatsApp
              </a>
            </p>
          </address>
          <SocialLinks tone="dark" className="mt-4" />
        </div>
      </div>

      <div className="border-t border-surface/10">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-surface/60 sm:flex-row sm:px-6 lg:px-8 xl:px-10">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <ul className="flex gap-2">
            {["Harare-made", "Same-day quotes"].map((chip) => (
              <li key={chip} className="rounded-md bg-surface/10 px-2.5 py-1 font-medium text-surface/80">
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
