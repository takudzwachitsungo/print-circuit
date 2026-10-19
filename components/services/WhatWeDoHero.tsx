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
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#0a0208] from-0% via-[#1c0316] via-15% to-[#0a0208] text-white shadow-2xl"
    >
      {/* ── Ambient Radial Glows matching Dominant Logo Magenta (#ec008c) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-6 sm:top-10 left-1/2 h-[560px] w-[950px] -translate-x-1/2 rounded-full bg-magenta/30 blur-[135px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-36 -left-20 h-96 w-96 rounded-full bg-cyan/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-36 -right-20 h-96 w-96 rounded-full bg-yellow/10 blur-[120px]"
      />

      {/* ── Dynamic Rotating Ambient Aura (inspired by onegrafix rotating light movement) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 top-6 sm:top-10 overflow-hidden mix-blend-screen opacity-75"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <defs>
            <radialGradient id="servicesRotatingGradient1" cx="50%" cy="50%" fx="50%" fy="50%" r="50%">
              <animate attributeName="fx" dur="24s" values="35%;65%;35%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#ec008c" stopOpacity="0.5" />
              <stop offset="45%" stopColor="#ec008c" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ec008c" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="servicesRotatingGradient2" cx="50%" cy="50%" fx="50%" fy="50%" r="50%">
              <animate attributeName="fy" dur="20s" values="40%;60%;40%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#00aeef" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#00aeef" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#00aeef" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Primary Magenta Rotating Ambient Aura */}
          <rect
            x="10%"
            y="5%"
            width="90%"
            height="90%"
            fill="url(#servicesRotatingGradient1)"
          >
            <animate attributeName="x" dur="18s" values="20%;-5%;20%" repeatCount="indefinite" />
            <animate attributeName="y" dur="22s" values="-5%;20%;-5%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="9s"
              repeatCount="indefinite"
            />
          </rect>
          {/* Secondary Counter-Rotating Tint Aura */}
          <rect
            x="-10%"
            y="-5%"
            width="85%"
            height="85%"
            fill="url(#servicesRotatingGradient2)"
          >
            <animate attributeName="x" dur="25s" values="-10%;15%;-10%" repeatCount="indefinite" />
            <animate attributeName="y" dur="19s" values="15%;-10%;15%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 50 50"
              to="0 50 50"
              dur="14s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>

      {/* ── Tactile Halftone Print Mesh Overlay ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1.5px,transparent_1.5px)] bg-[size:22px_22px] opacity-70"
      />

      {/* ── Subtle Background Watermark ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
      >
        <span className="whitespace-nowrap font-display text-3xl font-extrabold uppercase tracking-[0.2em] text-white/[0.025] sm:text-5xl sm:tracking-[0.25em] lg:text-6xl">
          PRINT CIRCUIT
        </span>
      </div>

      {/* ── Geometric Side Stripes & Angled Hex Framing (matching reference screenshot) ── */}
      {/* Left side vertical stripes & angled lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2 pl-4 xl:pl-8 opacity-75"
      >
        <div className="h-64 w-2.5 rounded-full bg-gradient-to-b from-magenta via-magenta/60 to-transparent" />
        <div className="h-80 w-2.5 rounded-full bg-gradient-to-b from-magenta/90 via-magenta/50 to-transparent" />
        <div className="h-96 w-3 rounded-full bg-gradient-to-b from-magenta via-magenta/80 to-magenta/20 shadow-[0_0_15px_rgba(236,0,140,0.5)]" />
      </div>

      {/* Right side vertical stripes & angled lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2 pr-4 xl:pr-8 opacity-75"
      >
        <div className="h-96 w-3 rounded-full bg-gradient-to-b from-magenta via-magenta/80 to-magenta/20 shadow-[0_0_15px_rgba(236,0,140,0.5)]" />
        <div className="h-80 w-2.5 rounded-full bg-gradient-to-b from-magenta/90 via-magenta/50 to-transparent" />
        <div className="h-64 w-2.5 rounded-full bg-gradient-to-b from-magenta via-magenta/60 to-transparent" />
      </div>

      {/* Angled geometric polygon outline tracing across behind the cards */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden xl:block overflow-hidden opacity-40"
      >
        <svg
          viewBox="0 0 1440 600"
          fill="none"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          {/* Outer angled frame */}
          <path
            d="M 120,40 L 400,20 L 1040,20 L 1320,40 L 1380,300 L 1320,560 L 1040,580 L 400,580 L 120,560 L 60,300 Z"
            stroke="#ec008c"
            strokeWidth="2"
            strokeDasharray="8 6"
            strokeOpacity="0.4"
          />
          {/* Inner accent angled lines */}
          <path
            d="M 140,70 L 1300,70 L 1350,300 L 1300,530 L 140,530 L 90,300 Z"
            stroke="#ec008c"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          {/* Corner dynamic slash accents */}
          <line x1="80" y1="120" x2="160" y2="40" stroke="#ec008c" strokeWidth="3" strokeOpacity="0.6" />
          <line x1="90" y1="130" x2="170" y2="50" stroke="#ec008c" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="1360" y1="120" x2="1280" y2="40" stroke="#ec008c" strokeWidth="3" strokeOpacity="0.6" />
          <line x1="1350" y1="130" x2="1270" y2="50" stroke="#ec008c" strokeWidth="1.5" strokeOpacity="0.4" />
        </svg>
      </div>

      {/* ── Content Container ── */}
      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 xl:px-12">
        {/* Header: What We Do */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-300/80">
            Print Circuit · Services
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            What We Do
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            Everything you need to look professional in print and online — five specialised service lines, one dedicated team in Harare.
          </p>
        </div>

        {/* ── 5-Card Numbered Showcase Grid (matching reference screenshot) ── */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {SERVICES.map((s, index) => {
            const num = String(index + 1).padStart(2, "0");
            const wave = WAVES[index] || WAVES[0];

            return (
              <article
                key={s.slug}
                className="group relative flex min-h-[440px] flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] p-5 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-magenta/60 hover:bg-white/[0.11] hover:shadow-[0_0_35px_rgba(236,0,140,0.3)] sm:p-6"
              >
                {/* Ambient Card Backlight */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-magenta/20 blur-2xl transition group-hover:bg-magenta/35"
                />

                {/* Top: Large Bold Number + Accent Bar */}
                <div className="relative text-center pt-2">
                  <span className="font-display text-5xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-6xl">
                    {num}
                  </span>
                  <div className="mx-auto mt-2 h-1 w-8 rounded-full bg-white/70 transition-all duration-300 group-hover:w-14 group-hover:bg-magenta" />
                </div>

                {/* Middle: Service Title, Tagline & Deliverable Chips */}
                <div className="relative my-auto py-5 text-center">
                  <h2 className="font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-pink-200 sm:text-xl">
                    <Link href={`/services/${s.slug}`} className="focus:outline-none">
                      {s.label}
                    </Link>
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-white/75 line-clamp-2">
                    {s.tagline}
                  </p>
                  <div className="mt-3.5 flex flex-wrap justify-center gap-1.5">
                    {s.included.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom: Fluid Wave Graphic in Brand Magenta */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-32 overflow-hidden"
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
                <div className="relative z-10 mt-auto flex justify-center pb-2 pt-4">
                  <Link
                    href={`/services/${s.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-extrabold text-magenta shadow-lg shadow-black/30 transition-all duration-300 hover:scale-105 hover:bg-magenta hover:text-white hover:shadow-magenta/40 active:scale-95"
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
