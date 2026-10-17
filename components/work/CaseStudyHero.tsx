import { type Project } from "@/lib/projects";

export default function CaseStudyHero({ project }: { project: Project }) {
  return (
    <section className="mx-auto grid w-full max-w-screen-2xl gap-4 px-4 pt-6 sm:px-6 lg:px-8 xl:px-10 lg:grid-cols-12">
      <div className="rounded-3xl bg-tint-butter p-8 sm:p-12 lg:col-span-7">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/60">{project.category}</p>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-primary/75">{project.summary}</p>
        <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 text-sm">
          <div>
            <dt className="text-primary/60">Client</dt>
            <dd className="mt-1 text-primary">{project.client}</dd>
          </div>
          <div>
            <dt className="text-primary/60">Year</dt>
            <dd className="mt-1 text-primary">{project.year}</dd>
          </div>
        </dl>
      </div>
      <div className="rounded-3xl border border-line bg-surface p-8 sm:p-12 lg:col-span-5">
        <h2 className="font-display text-2xl font-medium text-primary">What we did</h2>
        <p className="mt-4 text-muted">{project.scope}</p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Services provided">
          {project.services.map((s) => (
            <li key={s} className="rounded-full border border-line bg-base px-3 py-1 text-sm text-primary">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
