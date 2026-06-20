"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled ? "bg-surface/80 backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold text-primary">
          Print Circuit
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
          <MagneticButton href="/contact">Get a Quote</MagneticButton>
        </div>

        <button
          className="text-2xl leading-none text-primary md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-4 bg-surface px-6 py-6 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-primary"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <MagneticButton href="/contact">Get a Quote</MagneticButton>
        </div>
      )}
    </header>
  );
}
