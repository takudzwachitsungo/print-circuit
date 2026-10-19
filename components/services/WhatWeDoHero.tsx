import Link from "next/link";
import { SERVICES } from "@/lib/services";

/**
 * Continuous fluid wave paths flowing seamlessly across the 5 service cards (01 to 05)
 * precisely matching the reference screenshot design.
 */
const WAVES = [
  // 01: Starts low left (y=95), rises smoothly to meet card 02 at y=45
  {
    path1: "M0,95 C100,95 240,90 320,60 C360,45 385,45 400,45 L400,120 L0,120 Z",
    path2: "M0,105 C120,105 250,98 330,72 C370,58 390,58 400,58 L400,120 L0,120 Z",
  },
  // 02: Starts at y=45, crests boldly at y=20, descends to y=85
  {
    path1: "M0,45 C80,45 140,20 210,20 C280,20 340,65 400,85 L400,120 L0,120 Z",
    path2: "M0,58 C90,58 150,35 220,35 C290,35 350,75 400,95 L400,120 L0,120 Z",
  },
  // 03: Starts at y=85, gentle central wave up to y=50, descends to y=85
  {
    path1: "M0,85 C70,85 130,50 200,50 C270,50 330,85 400,85 L400,120 L0,120 Z",
    path2: "M0,95 C80,95 140,65 210,65 C280,65 340,95 400,95 L400,120 L0,120 Z",
  },
  // 04: Starts at y=85, dips to y=98, rises sharply to y=40
  {
    path1: "M0,85 C70,95 150,100 230,80 C310,60 360,40 400,40 L400,120 L0,120 Z",
    path2: "M0,95 C80,105 160,110 240,90 C320,70 370,55 400,55 L400,120 L0,120 Z",
  },
  // 05: Starts at y=40, crests at y=25, descends to y=60
  {
    path1: "M0,40 C60,35 120,25 180,25 C260,25 330,50 400,60 L400,120 L0,120 Z",
    path2: "M0,55 C70,50 130,40 190,40 C270,40 340,62 400,72 L400,120 L0,120 Z",
  },
];

export default function WhatWeDoHero() {
  return (
    <section
      aria-label="What We Do"
      className="relative w-full border-b border-line bg-white"
    >
      {/* ── Content Container (compact vertical padding for above-the-fold visibility) ── */}
      <div className="relative mx-auto w-full max-w-screen-2xl px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-12 lg:px-8 lg:pt-8 lg:pb-12 xl:px-10">
        {/* Header: What We Do */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-magenta">
            Print Circuit · Services
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            What We Do
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-muted sm:text-sm">
            Everything you need to look professional in print and online — five specialised service lines, one dedicated team in Harare.
          </p>
        </div>

        {/* ── 5-Card Numbered Showcase Grid ── */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {SERVICES.map((s, index) => {
            const num = String(index + 1).padStart(2, "0");
            const wave = WAVES[index] || WAVES[0];

            return (
              <article
                key={s.slug}
                className="group relative flex h-[290px] sm:h-[305px] flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[#0a0208] from-0% via-[#1c0316] via-15% to-[#0a0208] p-4 sm:p-5 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-magenta/60 hover:shadow-[0_0_25px_rgba(236,0,140,0.35)]"
              >
                {/* Ambient Radial Glow matching Homepage Hero Magenta (#ec008c) */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-10 left-1/2 h-32 w-44 -translate-x-1/2 rounded-full bg-magenta/30 blur-2xl transition group-hover:bg-magenta/45"
                />

                {/* Tactile Halftone Mesh inside Card */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1.5px,transparent_1.5px)] bg-[size:18px_18px] opacity-60"
                />

                {/* Top: Large Bold Number + Accent Bar */}
                <div className="relative text-center">
                  <span className="font-display text-4xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-5xl">
                    {num}
                  </span>
                  <div className="mx-auto mt-1.5 h-1 w-7 rounded-full bg-white/70 transition-all duration-300 group-hover:w-12 group-hover:bg-magenta" />
                </div>

                {/* Middle: Service Title & Tagline */}
                <div className="relative z-10 text-center">
                  <h2 className="font-display text-base font-bold leading-snug text-white transition-colors group-hover:text-pink-200 sm:text-lg">
                    <Link href={`/services/${s.slug}`} className="focus:outline-none">
                      {s.label}
                    </Link>
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-white/75 line-clamp-2">
                    {s.tagline}
                  </p>
                </div>

                {/* Bottom: Fluid Wave Graphic in Brand Magenta */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 overflow-hidden"
                >
                  <svg
                    viewBox="0 0 400 120"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                  >
                    <defs>
                      <linearGradient id={`card-wave-grad-${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ec008c" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#9e005d" stopOpacity="0.95" />
                      </linearGradient>
                    </defs>
                    {/* Layered secondary translucent wave */}
                    <path d={wave.path2} fill="#ec008c" fillOpacity="0.25" />
                    {/* Primary fluid wave */}
                    <path d={wave.path1} fill={`url(#card-wave-grad-${index})`} />
                  </svg>
                </div>

                {/* Button: Get Started (rounded white pill with magenta text resting on wave) */}
                <div className="relative z-10 mt-auto flex justify-center pb-1">
                  <Link
                    href={`/services/${s.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-1.5 text-xs font-extrabold text-magenta shadow-md shadow-black/25 transition-all duration-300 hover:scale-105 hover:bg-magenta hover:text-white hover:shadow-magenta/40 active:scale-95"
                  >
                    Get Started
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
