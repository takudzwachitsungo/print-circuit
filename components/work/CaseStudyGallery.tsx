import Image from "next/image";
import Reveal from "@/components/animation/Reveal";
import { type Project } from "@/lib/projects";

export default function CaseStudyGallery({
  project,
  images = [],
}: {
  project: Project;
  /** Real images from public/work/<slug>/; empty falls back to placeholders. */
  images?: string[];
}) {
  const hasImages = images.length > 0;
  const items = hasImages ? images : project.gallery;

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <Reveal>
        <h2 className="font-display text-2xl font-bold text-primary">Gallery</h2>
      </Reveal>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item} delay={i * 0.05}>
            {hasImages ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={item}
                  alt={`${project.title} — image ${i + 1}`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-surface via-base to-surface" />
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
