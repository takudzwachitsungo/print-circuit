import SectionHeading from "@/components/ui/SectionHeading";
import WorkCard from "@/components/work/WorkCard";
import { PROJECTS } from "@/lib/projects";
import { getCover } from "@/lib/gallery";

export default function RecentWork() {
  return (
    <section aria-labelledby="work-heading" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        id="work-heading"
        label="Portfolio"
        title="Fresh off the press"
        link={{ href: "/work", label: "See all work" }}
      />
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.slice(0, 3).map((p) => (
          <li key={p.slug}>
            <WorkCard project={p} cover={getCover(p.slug)} />
          </li>
        ))}
      </ul>
    </section>
  );
}
