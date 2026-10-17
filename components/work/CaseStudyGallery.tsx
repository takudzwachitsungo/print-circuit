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
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
      <Reveal>
        <h2 className="font-display text-2xl font-medium text-primary">Gallery</h2>
      </Reveal>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item} delay={i * 0.05}>
            {hasImages ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line">
                <Image
                  src={item}
                  alt={`${project.title} — image ${i + 1}`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="dot-pattern aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-tint-butter" />
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
