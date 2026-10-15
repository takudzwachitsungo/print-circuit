import Image from "next/image";
import Reveal from "@/components/animation/Reveal";
import { TEAM } from "@/lib/team";
import { getTeamPhoto } from "@/lib/gallery";

export default function TeamGrid() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <h2 className="font-display text-3xl font-medium tracking-tight text-primary sm:text-4xl">
          The team
        </h2>
      </Reveal>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((member, i) => {
          const photo = getTeamPhoto(member.photo);
          return (
          <Reveal
            as="li"
            key={member.name}
            delay={i * 0.05}
            className="h-full rounded-3xl border border-line bg-surface p-6"
          >
            {photo ? (
              <div className="relative aspect-square w-20 overflow-hidden rounded-full border border-line">
                <Image
                  src={photo}
                  alt={member.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                aria-hidden
                className="dot-pattern aspect-square w-20 overflow-hidden rounded-full bg-tint-pink"
              />
            )}
            <h3 className="mt-5 font-display text-lg font-medium text-primary">
              {member.name}
            </h3>
            <p className="mt-1 text-sm text-magenta">{member.role}</p>
            <p className="mt-3 text-sm text-muted">{member.bio}</p>
          </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
