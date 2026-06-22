import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/animation/Reveal";
import { PROJECTS } from "@/lib/projects";
import { getCover } from "@/lib/gallery";

export default function FeaturedWork() {
  const featured = PROJECTS.slice(0, 4).map((p) => ({
    ...p,
    cover: getCover(p.slug),
  }));

  return (
    <section aria-label="Featured work" className="mx-auto max-w-7xl px-6 py-16">
      <Reveal className="flex items-end justify-between gap-6">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-yellow">
            Our work
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold text-primary sm:text-5xl">
            Recent projects
          </h2>
        </div>
        <Link
          href="/work"
          className="shrink-0 font-medium text-cyan transition-colors hover:text-magenta"
        >
          View all work →
        </Link>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {featured.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <Link
              href={`/work/${p.slug}`}
              className="group block overflow-hidden rounded-2xl border border-white/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {p.cover ? (
                  <Image
                    src={p.cover}
                    alt={p.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-surface via-base to-surface transition-transform duration-500 group-hover:scale-105" />
                )}
                <span className="absolute left-4 top-4 rounded-full bg-base/70 px-3 py-1 text-xs text-muted backdrop-blur">
                  {p.category}
                </span>
              </div>
              <div className="flex items-center justify-between p-5">
                <h3 className="font-display text-lg text-primary">{p.title}</h3>
                <span className="text-muted transition-colors group-hover:text-cyan">
                  →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
