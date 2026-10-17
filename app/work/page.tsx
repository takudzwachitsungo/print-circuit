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
    <main className="mx-auto w-full max-w-screen-2xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 xl:px-10">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
        Our work
      </p>
      <h1 className="mt-2 max-w-3xl font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl">
        Projects we&rsquo;re proud of.
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        A growing selection of the printing, branding, signage and web work we&rsquo;ve
        delivered. Filter by what you need.
      </p>
      <WorkGallery covers={covers} />
    </main>
  );
}
