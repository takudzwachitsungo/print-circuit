import { type Project } from "@/lib/projects";

export default function CaseStudyHero({ project }: { project: Project }) {
  return (
    <section className="px-6 pt-32 pb-12">
      <div className="mx-auto max-w-5xl">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-cyan">
          {project.category}
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold text-primary sm:text-6xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{project.summary}</p>

        <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4 text-sm">
          <div>
            <dt className="text-muted">Client</dt>
            <dd className="mt-1 text-primary">{project.client}</dd>
          </div>
          <div>
            <dt className="text-muted">Year</dt>
            <dd className="mt-1 text-primary">{project.year}</dd>
          </div>
        </dl>

        <h2 className="mt-12 font-display text-2xl font-bold text-primary">
          What we did
        </h2>
        <p className="mt-4 max-w-2xl text-muted">{project.scope}</p>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Services provided">
          {project.services.map((s) => (
            <li
              key={s}
              className="rounded-full border border-white/15 px-3 py-1 text-sm text-muted"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
