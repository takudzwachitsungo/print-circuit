import Reveal from "@/components/animation/Reveal";

export default function StorySection() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <Reveal>
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          Our story
        </h2>
        <div className="mt-6 space-y-4 text-lg text-muted">
          <p>
            Print Circuit was incorporated on 20 May 2026 — a young studio with
            an old-fashioned belief: that good print still matters. We started
            because too many small businesses were settling for dated, templated
            work that didn&rsquo;t reflect how good they actually are.
          </p>
          <p>
            We pair modern design with dependable production, so whether you need
            a single business card or a full brand rollout, the result looks
            sharp and lands on time. We&rsquo;re new and hungry, and we treat
            every project like it&rsquo;s our calling card — because it is.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
