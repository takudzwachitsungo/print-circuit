import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PROJECTS, getProject } from "@/lib/projects";
import { getGalleryImages } from "@/lib/gallery";
import CaseStudyHero from "@/components/work/CaseStudyHero";
import CaseStudyGallery from "@/components/work/CaseStudyGallery";
import MagneticButton from "@/components/ui/MagneticButton";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/work/${slug}`,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const galleryImages = getGalleryImages(slug);

  return (
    <main>
      <CaseStudyHero project={project} />
      <CaseStudyGallery project={project} images={galleryImages} />

      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          Like what you see?
        </h2>
        <div className="mt-8 flex justify-center">
          <MagneticButton href="/contact">Start a project</MagneticButton>
        </div>
        <Link
          href="/work"
          className="mt-10 inline-block text-sm text-muted transition-colors hover:text-primary"
        >
          ← All work
        </Link>
      </section>
    </main>
  );
}
