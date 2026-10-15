import Link from "next/link";

/** SKO-style section header: small uppercase label, title, optional "View all →". */
export default function SectionHeading({
  id,
  label,
  title,
  link,
  as: Heading = "h2",
}: {
  id?: string;
  label: string;
  title: string;
  link?: { href: string; label: string };
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          {label}
        </p>
        <Heading
          id={id}
          className="mt-2 font-display text-3xl font-medium tracking-tight text-primary sm:text-4xl"
        >
          {title}
        </Heading>
      </div>
      {link && (
        <Link
          href={link.href}
          className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-magenta"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}
