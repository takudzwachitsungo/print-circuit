import Link from "next/link";
import { type Project } from "@/lib/projects";

export default function WorkCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-white/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-base to-surface transition-transform duration-500 group-hover:scale-105" />
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
