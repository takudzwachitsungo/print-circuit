import { COMPANY_STATS } from "@/lib/stats";

export default function AboutStats() {
  return (
    <section aria-label="Print Circuit in numbers" className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {COMPANY_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse rounded-3xl border border-line bg-surface p-8">
            <dt className="mt-2 text-sm text-muted">{stat.label}</dt>
            <dd className="font-display text-4xl font-medium text-primary sm:text-5xl">
              {stat.to}
              {stat.suffix}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
