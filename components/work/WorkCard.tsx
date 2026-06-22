import Link from "next/link";
import Image from "next/image";
import { type Project } from "@/lib/projects";

export default function WorkCard({
  project,
  cover,
}: {
  project: Project;
  /** Cover image from public/work/<slug>/; gradient shown when absent. */
  cover?: string | null;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-white/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface via-base to-surface transition-transform duration-500 group-hover:scale-105" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-base/70 px-3 py-1 text-xs text-muted backdrop-blur">
          {project.category}
        </span>
      </div>
      <div className="flex items-center justify-between p-5">
        <h3 className="font-display text-lg text-primary">{project.title}</h3>
        <span className="text-muted transition-colors group-hover:text-cyan">→</span>
      </div>
    </Link>
  );
}
