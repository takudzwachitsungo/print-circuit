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
    <main className="mx-auto w-full max-w-screen-2xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8 xl:px-10">
      {/* Top Eyebrow */}
      <div className="flex items-center gap-3">
        <span className="h-0.5 w-10 bg-magenta" />
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-magenta">
          Portfolio &amp; Case Studies
        </p>
      </div>

      {/* Main Display Heading */}
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl">
        Our <span className="text-magenta">Work.</span>
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        A growing selection of the printing, branding, signage, and digital projects we&rsquo;ve delivered across Zimbabwe. Filter by category to explore what we can do for you.
      </p>

      <div className="mt-8">
        <WorkGallery covers={covers} />
      </div>
    </main>
  );
}
