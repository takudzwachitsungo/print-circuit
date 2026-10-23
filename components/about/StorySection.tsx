import Reveal from "@/components/animation/Reveal";

export default function StorySection() {
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
      <Reveal className="rounded-3xl border border-line bg-surface p-8 sm:p-12">
        <h2 className="font-display text-3xl font-medium tracking-tight text-primary sm:text-4xl">
          Our story
        </h2>
        <div className="mt-6 max-w-3xl space-y-4 text-lg text-muted">
          <p>
            Print Circuit Enterprises (Private) Limited is a Zimbabwean printing and branding company committed to quality, creativity, and reliability. Since our incorporation on 20 May 2026, we have been helping businesses and individuals bring their ideas to life through professional printing, branding, and design solutions.
          </p>
          <p>
            Our services include graphic design, digital and large-format printing, branding, indoor and outdoor signage, vehicle branding, web development, and stationery supplies. We are dedicated to delivering quality work that helps our clients communicate clearly and present their brands professionally.
          </p>
          <p>
            At Print Circuit, we believe every brand has a story worth telling. Our goal is to provide creative and reliable solutions that meet our clients&rsquo; needs and exceed their expectations.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
