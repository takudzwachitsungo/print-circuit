import type { Metadata } from "next";
import AboutIntroStory from "@/components/about/AboutIntroStory";
import AboutMissionVisionValues from "@/components/about/AboutMissionVisionValues";
import AboutClientsGrid from "@/components/about/AboutClientsGrid";
import TeamGrid from "@/components/about/TeamGrid";
import AboutStats from "@/components/about/AboutStats";
import OrderBand from "@/components/home/OrderBand";

export const metadata: Metadata = {
  title: "About Us · Print Circuit",
  description:
    "Print Circuit is a premier Harare-based printing, branding and design studio. Learn our story, mission, vision, values, and client partnerships.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us · Print Circuit",
    description:
      "Print Circuit is a Zimbabwean printing, branding, signage, stationery and web studio in Avondale, Harare.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="w-full bg-white">
      {/* 1. About Print Circuit Story & Capabilities (Clean White Background) */}
      <AboutIntroStory />

      {/* 2. Mission, Vision, and Values Banner (Logo Pink Background with Vertical Dividers) */}
      <AboutMissionVisionValues />

      {/* 3. Some of our Clients - 15 Circular Trust Badges Grid */}
      <AboutClientsGrid />

      {/* 4. The Studio Team */}
      <TeamGrid />

      {/* 5. Key Numbers & Statistics */}
      <AboutStats />

      {/* 6. Quote & Order Consultation Band */}
      <div className="pb-12">
        <OrderBand />
      </div>
    </main>
  );
}
