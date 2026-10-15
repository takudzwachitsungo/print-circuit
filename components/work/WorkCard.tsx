import Link from "next/link";
import Image from "next/image";
import { type Project } from "@/lib/projects";

export default function WorkCard({
  project,
  cover,
}: {
  project: Project;
  /** Cover image from public/work/<slug>/; halftone placeholder when absent. */
  cover?: string | null;
}) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-tint-butter">
        {cover ? (
          <Image
            src={cover}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="dot-pattern absolute inset-0" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-primary">
          {project.category}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <h3 className="font-display text-lg font-medium text-primary">{project.title}</h3>
        <span aria-hidden className="text-muted transition-colors group-hover:text-magenta">
          →
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">{project.summary}</p>
    </Link>
  );
}
