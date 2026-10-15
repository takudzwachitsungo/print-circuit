import Link from "next/link";
import { SERVICES, ACCENT } from "@/lib/services";

export default function ServicesList() {
  return (
    <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((s) => (
        <li key={s.slug}>
          <Link
            href={`/services/${s.slug}`}
            className={`group flex h-full flex-col rounded-3xl p-8 transition-transform hover:-translate-y-0.5 ${ACCENT[s.accent].tint}`}
          >
            <h2 className="font-display text-2xl font-medium text-primary">{s.label}</h2>
            <p className="mt-3 text-primary/70">{s.tagline}</p>
            <span className="mt-auto pt-8 text-sm font-medium text-primary">
              Explore{" "}
              <span aria-hidden className="transition-colors group-hover:text-magenta">
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
