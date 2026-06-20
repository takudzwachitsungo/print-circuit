import Reveal from "@/components/animation/Reveal";
import { type Service } from "@/lib/services";

export default function ServiceGallery({ service }: { service: Service }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Reveal>
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          Sample work
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          A taste of {service.label.toLowerCase()} we&rsquo;ve produced. Full
          case studies are on the way.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-surface via-base to-surface" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
