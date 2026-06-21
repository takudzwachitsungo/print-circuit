import Reveal from "@/components/animation/Reveal";
import { type Project } from "@/lib/projects";

export default function CaseStudyGallery({ project }: { project: Project }) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <Reveal>
        <h2 className="font-display text-2xl font-bold text-primary">Gallery</h2>
      </Reveal>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {project.gallery.map((src, i) => (
          <Reveal key={src} delay={i * 0.05}>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-surface via-base to-surface" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
