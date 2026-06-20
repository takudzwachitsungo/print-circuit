import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import AboutTeaser from "@/components/home/AboutTeaser";
import ServicesGrid from "@/components/home/ServicesGrid";
import FeaturedWork from "@/components/home/FeaturedWork";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <AboutTeaser />
      <ServicesGrid />
      <FeaturedWork />
    </>
  );
}
