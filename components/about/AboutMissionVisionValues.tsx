import Reveal from "@/components/animation/Reveal";

export default function AboutMissionVisionValues() {
  return (
    <section
      aria-label="Our Purpose, Mission, Vision, and Values"
      className="mx-auto w-full max-w-screen-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 xl:px-10"
    >
      <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#ec008c] via-[#db0082] to-[#b8006d] p-8 text-white shadow-2xl sm:p-12 lg:p-16">
        {/* Ambient Subtle Radial Glows inside the Pink Banner */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-black/15 blur-3xl"
        />

        {/* Script / Elegant Display Heading "About Us" */}
        <div className="relative text-center pb-10 sm:pb-14">
          <p className="font-serif italic text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-md">
            About Us
          </p>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-white/70" />
        </div>

        {/* 3 Columns: Mission, Vision, Values with vertical divider lines */}
        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-white/25">
          {/* Column 1: Our Mission */}
          <div className="flex flex-col lg:pr-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                Our
              </span>
            </div>
            <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Mission
            </h3>
            <p className="mt-4 text-justify text-sm sm:text-base leading-relaxed text-white/95 font-medium">
              To empower businesses and individuals with high-quality and innovative printing, branding, and marketing solutions that enhance their visibility and success.
            </p>
          </div>

          {/* Column 2: Our Vision */}
          <div className="flex flex-col lg:px-10 border-t border-white/20 pt-8 lg:border-t-0 lg:pt-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                Our
              </span>
            </div>
            <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Vision
            </h3>
            <p className="mt-4 text-justify text-sm sm:text-base leading-relaxed text-white/95 font-medium">
              To become a leading provider of innovative printing, branding, and marketing solutions in Zimbabwe and beyond, renowned for excellence, creativity, and exceptional customer service.
            </p>
          </div>

          {/* Column 3: Our Values */}
          <div className="flex flex-col lg:pl-10 border-t border-white/20 pt-8 lg:border-t-0 lg:pt-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                Our
              </span>
            </div>
            <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Values
            </h3>
            <ul className="mt-4 space-y-2 text-sm sm:text-base text-white/95 font-medium">
              <li className="flex items-center gap-2.5">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
                <span>Quality</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
                <span>Innovation</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
                <span>Integrity</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
                <span>Customer Focus</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
                <span>Reliability</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
                <span>Teamwork</span>
              </li>
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
