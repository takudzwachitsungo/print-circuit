import Counter from "@/components/animation/Counter";
import { COMPANY_STATS } from "@/lib/stats";

export default function AboutStats() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
        {COMPANY_STATS.map((stat) => (
          <div key={stat.label}>
            <div className="font-display text-4xl font-bold text-primary sm:text-6xl">
              <Counter to={stat.to} suffix={stat.suffix} />
            </div>
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
