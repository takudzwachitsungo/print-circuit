"use client";

import Link from "next/link";
import Image from "next/image";
import Form from "next/form";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { SITE } from "@/lib/site";
import { CATEGORY_SHORT } from "@/lib/products";
import SocialLinks from "@/components/ui/SocialLinks";
import { BagIcon, SearchIcon } from "@/components/ui/icons";
import { useBasket } from "@/components/shop/BasketProvider";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Our work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const PHONE = SITE.phones[0];
const tel = (p: string) => `tel:${p.replace(/\s+/g, "")}`;

function SearchForm({ className = "", autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  const id = useId();
  return (
    <Form action="/shop" role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        name="q"
        type="search"
        autoFocus={autoFocus}
        placeholder="Search products…"
        className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-primary placeholder:text-muted focus:border-primary focus:outline-none"
      />
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </Form>
  );
}

function BasketButton() {
  const { count, open } = useBasket();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Quote basket, ${count} ${count === 1 ? "item" : "items"}`}
      className="relative grid h-10 w-10 place-items-center rounded-full text-primary transition-colors hover:bg-line"
    >
      <BagIcon className="h-5 w-5" />
      {count > 0 && (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-magenta px-1 text-[11px] font-semibold text-white"
        >
          {count}
        </span>
      )}
    </button>
  );
}

function CategoriesMenu() {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="true"
        className="rounded-lg px-3 py-1.5 text-muted transition-colors hover:text-primary group-focus-within:text-primary"
      >
        Categories ▾
      </button>
      <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul className="w-56 rounded-2xl border border-line bg-surface p-2 shadow-lg">
          {SITE.services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/shop?cat=${s.slug}`}
                onClick={(e) => e.currentTarget.blur()}
                className="block rounded-lg px-3 py-2 text-sm text-primary hover:bg-base"
              >
                {CATEGORY_SHORT[s.slug]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const linkClass = (href: string) =>
    `rounded-lg px-3 py-1.5 transition-colors ${
      isActive(href) ? "bg-line text-primary" : "text-muted hover:text-primary"
    }`;

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-xs text-surface">
        Print Circuit, Harare ·{" "}
        <Link href="/shop" className="font-medium underline underline-offset-2">
          Get a quote in minutes →
        </Link>
      </div>

      <header className="sticky top-0 z-50 border-b border-line bg-base/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-display text-lg font-semibold text-primary">
            {/* Decorative — the wordmark beside it carries the name. */}
            <Image src="/logo.png" alt="" width={256} height={240} priority className="h-10 w-auto" />
            Print Circuit
          </Link>

          <SearchForm className="mx-auto hidden w-full max-w-xl md:block" />

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <button
              type="button"
              aria-label="Search products"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full text-primary hover:bg-line md:hidden"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
            <BasketButton />
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full text-xl leading-none text-primary hover:bg-line md:hidden"
            >
              ☰
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-line px-4 py-3 md:hidden">
            <SearchForm autoFocus />
          </div>
        )}

        {menuOpen && (
          <div className="border-t border-line bg-base px-4 py-4 md:hidden">
            <ul className="space-y-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setMenuOpen(false)} className={`block ${linkClass(l.href)}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 px-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">Categories</p>
            <ul className="mt-1 space-y-1">
              {SITE.services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/shop?cat=${s.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-1.5 text-muted hover:text-primary"
                  >
                    {CATEGORY_SHORT[s.slug]}
                  </Link>
                </li>
              ))}
            </ul>
            <a href={tel(PHONE)} className="mt-4 block px-3 text-sm text-primary">
              Call {PHONE}
            </a>
            <SocialLinks className="mt-3 px-3" />
          </div>
        )}
      </header>

      <nav aria-label="Primary" className="hidden border-b border-line md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-6 py-2 text-sm">
          {LINKS.slice(0, 2).map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
          <CategoriesMenu />
          {LINKS.slice(2).map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-4">
            <a href={tel(PHONE)} className="text-muted transition-colors hover:text-primary">
              Call <span className="font-medium text-primary">{PHONE}</span>
            </a>
            <SocialLinks variant="compact" />
          </div>
        </div>
      </nav>
    </>
  );
}
