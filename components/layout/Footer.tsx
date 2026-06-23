import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        {/* Brand + contact */}
        <div className="md:col-span-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl font-bold text-primary"
          >
            <Image src="/logo.png" alt="" width={256} height={240} className="h-20 w-auto" />
            Print Circuit
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted">
            Printing, branding, signage and design for businesses across
            Zimbabwe.
          </p>
          <address className="mt-6 space-y-1 text-sm not-italic text-muted">
            <p>{SITE.address}</p>
            {SITE.phones.map((p) => (
              <p key={p}>
                <a
                  href={`tel:${p.replace(/\s+/g, "")}`}
                  className="transition-colors hover:text-primary"
                >
                  {p}
                </a>
              </p>
            ))}
            <p>
              <a
                href={`mailto:${SITE.email}`}
                className="transition-colors hover:text-primary"
              >
                {SITE.email}
              </a>
            </p>
            <p>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan transition-colors hover:text-magenta"
              >
                Chat on WhatsApp
              </a>
            </p>
          </address>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-display text-sm font-semibold text-primary">
            Services
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {SITE.services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="transition-colors hover:text-primary"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company + newsletter */}
        <div>
          <h3 className="font-display text-sm font-semibold text-primary">
            Company
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <Link href="/about" className="transition-colors hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link href="/work" className="transition-colors hover:text-primary">
                Our Work
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition-colors hover:text-primary"
              >
                Get a Quote
              </Link>
            </li>
            <li>
              <a
                href={SITE.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
              >
                Twitter / X
              </a>
            </li>
          </ul>

          <form
            className="mt-6"
            aria-label="Newsletter signup"
            // backend-ready: wire to an API route later
          >
            <label htmlFor="newsletter" className="sr-only">
              Email address
            </label>
            <div className="flex overflow-hidden rounded-full border border-white/15">
              <input
                id="newsletter"
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent px-4 py-2 text-sm text-primary placeholder:text-muted focus:outline-none"
              />
              <button
                type="submit"
                className="bg-cyan px-4 py-2 text-sm font-medium text-base"
              >
                Join
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
      </div>
    </footer>
  );
}
