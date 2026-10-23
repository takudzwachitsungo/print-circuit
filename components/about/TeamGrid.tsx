import Image from "next/image";
import Reveal from "@/components/animation/Reveal";
import { TEAM } from "@/lib/team";
import { getTeamPhoto } from "@/lib/gallery";

export default function TeamGrid() {
  return (
    <section
      aria-label="The Print Circuit Team"
      className="mx-auto w-full max-w-screen-2xl bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 xl:px-10"
    >
      {/* Centered Section Header matching "Shop all." style */}
      <Reveal className="text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="h-0.5 w-10 bg-magenta" />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-magenta">
            Our People
          </p>
          <span className="h-0.5 w-10 bg-magenta" />
        </div>

        <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          The <span className="text-magenta">Team.</span>
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          The dedicated specialists, technicians, and creatives bringing precision and craft to every project.
        </p>
      </Reveal>

      {/* 4-Column Card Grid matching reference layout (without hearts, centered content, 3-dots top right) */}
      <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 lg:gap-8">
        {TEAM.map((member, i) => {
          const photo = getTeamPhoto(member.photo);
          return (
            <Reveal
              as="li"
              key={member.name}
              delay={i * 0.05}
              className="group relative flex flex-col items-center rounded-2xl border border-line/80 bg-white p-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-magenta/30 hover:shadow-md"
            >
              {/* Top Row: 3-dot options menu on top-right (hearts omitted as requested) */}
              <div className="flex w-full items-center justify-end">
                <span
                  aria-hidden
                  className="flex items-center gap-1 text-muted/40 transition-colors group-hover:text-muted"
                >
                  <span className="h-1 w-1 rounded-full bg-current" />
                  <span className="h-1 w-1 rounded-full bg-current" />
                  <span className="h-1 w-1 rounded-full bg-current" />
                </span>
              </div>

              {/* Centered Circular Avatar */}
              <div className="relative mt-2">
                {photo ? (
                  <div className="relative aspect-square w-24 overflow-hidden rounded-full border-2 border-line/60 bg-surface shadow-xs sm:h-28 sm:w-28">
                    <Image
                      src={photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 96px, 112px"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div
                    aria-hidden
                    className="dot-pattern aspect-square w-24 overflow-hidden rounded-full border-2 border-line/60 bg-tint-pink sm:h-28 sm:w-28"
                  />
                )}
              </div>

              {/* Name & Role */}
              <h3 className="mt-5 font-display text-base font-bold tracking-tight text-primary sm:text-lg">
                {member.name}
              </h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-magenta">
                {member.role}
              </p>

              {/* Bio Description */}
              <p className="mt-3 text-xs leading-relaxed text-muted line-clamp-3">
                {member.bio}
              </p>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
