import type { Metadata } from "next";
import WorkGallery from "@/components/work/WorkGallery";
import { PROJECTS } from "@/lib/projects";
import { getCover } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected printing, branding, signage and web projects by Print Circuit in Harare, Zimbabwe.",
  alternates: { canonical: "/work" },
  openGraph: { url: "/work" },
};

export default function WorkPage() {
  const covers = Object.fromEntries(
    PROJECTS.map((p) => [p.slug, getCover(p.slug)]),
  );
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-magenta">
        Our work
      </p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold text-primary sm:text-6xl">
        Projects we&rsquo;re proud of.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        A growing selection of the printing, branding, signage and web work we&rsquo;ve
        delivered. Filter by what you need.
      </p>
      <WorkGallery covers={covers} />
    </main>
  );
}
