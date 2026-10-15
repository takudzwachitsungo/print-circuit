import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import CategoryCards from "@/components/home/CategoryCards";
import MostRequested from "@/components/home/MostRequested";
import RecentWork from "@/components/home/RecentWork";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import OrderBand from "@/components/home/OrderBand";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoryCards />
      <MostRequested />
      <RecentWork />
      <HowItWorks />
      <Testimonials />
      <OrderBand />
    </main>
  );
}
