import Link from "next/link";
import Reveal from "@/components/animation/Reveal";
import Counter from "@/components/animation/Counter";

const STATS = [
  { to: 4, suffix: "+", label: "Projects completed" },
  { to: 20, suffix: "+", label: "Clients served" },
  { to: 5, suffix: "", label: "Service lines" },
];

export default function AboutTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal className="max-w-3xl">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-cyan">
          About
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold text-primary sm:text-5xl">
          A Harare print house built for modern brands.
        </h2>
        <p className="mt-6 text-lg text-muted">
          Founded in 2026, Print Circuit helps businesses and individuals look
          professional in print — from a single business card to a full brand
          rollout. We pair sharp design with reliable production so your message
          lands clearly.
        </p>
        <Link
          href="/about"
          className="mt-6 inline-block font-medium text-cyan transition-colors hover:text-magenta"
        >
          Read our story →
        </Link>
      </Reveal>

      <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="font-display text-4xl font-bold text-primary sm:text-6xl">
              <Counter to={s.to} suffix={s.suffix} />
            </div>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
