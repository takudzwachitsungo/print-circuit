import type { Metadata } from "next";
import ServicesList from "@/components/services/ServicesList";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Printing, graphic design & branding, signage, stationery and web development — everything Print Circuit offers, in one place.",
};

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-cyan">
        Services
      </p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold text-primary sm:text-6xl">
        Everything you need to look professional in print and online.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Five service lines, one team. Hover a service to see what we do, or open
        it for the full picture.
      </p>
      <ServicesList />
    </main>
  );
}
