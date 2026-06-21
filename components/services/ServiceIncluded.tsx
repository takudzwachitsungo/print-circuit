import Reveal from "@/components/animation/Reveal";
import { ACCENT, type Service } from "@/lib/services";

export default function ServiceIncluded({ service }: { service: Service }) {
  const accent = ACCENT[service.accent];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Reveal>
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          What&apos;s included
        </h2>
      </Reveal>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {service.included.map((item, i) => (
          <Reveal
            as="li"
            key={item}
            delay={i * 0.05}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-surface px-5 py-4"
          >
            <span
              aria-hidden
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${accent.bgSoft} ${accent.text} font-display text-sm`}
            >
              +
            </span>
            <span className="text-primary">{item}</span>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
