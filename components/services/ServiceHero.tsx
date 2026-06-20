import MagneticButton from "@/components/ui/MagneticButton";
import { ACCENT, type Service } from "@/lib/services";

export default function ServiceHero({ service }: { service: Service }) {
  const accent = ACCENT[service.accent];
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-16">
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-32 left-1/2 h-96 w-[120%] -translate-x-1/2 bg-gradient-to-b ${accent.gradientFrom} to-transparent opacity-40 blur-3xl`}
      />
      <div className="relative mx-auto max-w-7xl">
        <p
          className={`font-display text-sm uppercase tracking-[0.2em] ${accent.text}`}
        >
          Service
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold text-primary sm:text-6xl">
          {service.label}
        </h1>
        <p className="mt-4 max-w-3xl font-display text-xl text-muted sm:text-2xl">
          {service.tagline}
        </p>
        <p className="mt-6 max-w-2xl text-lg text-muted">{service.intro}</p>
        <div className="mt-10">
          <MagneticButton href="/contact">Request a quote</MagneticButton>
        </div>
      </div>
    </section>
  );
}
