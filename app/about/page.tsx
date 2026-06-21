import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import StorySection from "@/components/about/StorySection";
import ValuesPanels from "@/components/about/ValuesPanels";
import TeamGrid from "@/components/about/TeamGrid";

export const metadata: Metadata = {
  title: "About",
  description:
    "Print Circuit is a Harare-based printing, branding and design studio. Learn our story and what we stand for.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <StorySection />
      <ValuesPanels />
      <TeamGrid />
    </main>
  );
}
