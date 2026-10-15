import type { Metadata } from "next";
import ServicesList from "@/components/services/ServicesList";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Printing, graphic design & branding, signage, stationery and web development — everything Print Circuit offers, in one place.",
  alternates: { canonical: "/services" },
  openGraph: { url: "/services" },
};

export default function ServicesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
        Services
      </p>
      <h1 className="mt-2 max-w-3xl font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl">
        Everything you need to look professional in print and online.
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Five service lines, one team. Open a service for the full picture, or jump
        straight to the shop.
      </p>
      <ServicesList />
    </main>
  );
}
