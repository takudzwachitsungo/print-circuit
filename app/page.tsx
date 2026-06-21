import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import AboutTeaser from "@/components/home/AboutTeaser";
import ServicesGrid from "@/components/home/ServicesGrid";
import FeaturedWork from "@/components/home/FeaturedWork";
import Process from "@/components/home/Process";
import Testimonials from "@/components/home/Testimonials";
import CtaBand from "@/components/home/CtaBand";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <AboutTeaser />
      <ServicesGrid />
      <FeaturedWork />
      <Process />
      <Testimonials />
      <CtaBand />
    </>
  );
}
