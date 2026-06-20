import Link from "next/link";

const ACCENT_TEXT = {
  cyan: "group-hover:text-cyan",
  magenta: "group-hover:text-magenta",
  yellow: "group-hover:text-yellow",
} as const;

const ACCENT_GLOW = {
  cyan: "from-cyan/20",
  magenta: "from-magenta/20",
  yellow: "from-yellow/20",
} as const;

export type Accent = keyof typeof ACCENT_TEXT;

export default function ServiceCard({
  slug,
  label,
  description,
  accent,
}: {
  slug: string;
  label: string;
  description: string;
  accent: Accent;
}) {
  return (
    <Link
      href={`/services/${slug}`}
      className="group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-surface p-8 transition-all hover:-translate-y-1 hover:border-white/20"
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${ACCENT_GLOW[accent]} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <div className="relative">
        <h3
          className={`font-display text-xl font-semibold text-primary transition-colors ${ACCENT_TEXT[accent]}`}
        >
          {label}
        </h3>
        <p className="mt-3 text-sm text-muted">{description}</p>
        <span className="mt-6 inline-block text-sm text-muted transition-colors group-hover:text-primary">
          Learn more →
        </span>
      </div>
    </Link>
  );
}
