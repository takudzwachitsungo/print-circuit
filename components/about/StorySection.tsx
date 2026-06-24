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
             Printcircuit Enterprises (Private) Limited is aZimbabwean printing and branding company committed to quality, innovation, integrity, and reliability. Since our incorporation on 20 May 2026, we have been providing creative and professional printing, branding, signage, and design solutions for businesses and individuals. Our services include graphic design, digital and large-format printing, advertising materials, branding, and stationery supplies. At Printcircuit Enterprises, we are dedicated to delivering dependable solutions that help our clients communicate effectively and stand out professionally.
          </p>
          <p>
           At Printcircuit Enterprises, we believe every brand has a story and great printing is how you tell it clearly. Whether you’re looking to promote your business, refresh your brand, or produce materials for a specific purpose, we&rsquo;re here to help you get it done professionally.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
