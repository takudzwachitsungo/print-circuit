import type { Metadata } from "next";
import WhatWeDoHero from "@/components/services/WhatWeDoHero";
import ServicesDetailedList from "@/components/services/ServicesDetailedList";
import ServicesFaqSection from "@/components/services/ServicesFaqSection";
import OrderBand from "@/components/home/OrderBand";

export const metadata: Metadata = {
  title: "What We Do · Services",
  description:
    "Printing, graphic design & branding, signage, stationery supplies and web development — everything Print Circuit offers, in one place.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "What We Do · Print Circuit Services",
    description:
      "Printing, graphic design & branding, signage, stationery supplies and web development — five specialised service lines, one team in Harare.",
    url: "/services",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ServicesPage() {
  return (
    <main className="w-full">
      {/* What We Do Hero Section: exact homepage ambient background, dynamic rotating aura, 01-05 numbered cards */}
      <WhatWeDoHero />

      {/* Comprehensive Service Deep-Dive: maintaining all existing service information, intros, deliverables & shop links */}
      <ServicesDetailedList />

      {/* Frequently Asked Questions: interactive accordion with answers across all services */}
      <ServicesFaqSection />

      {/* Consultation & Order Band */}
      <div className="pt-10 pb-8">
        <OrderBand />
      </div>
    </main>
  );
}
