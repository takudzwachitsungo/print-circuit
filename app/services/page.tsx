import type { Metadata } from "next";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-32">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-cyan">
        Services
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold text-primary sm:text-6xl">
        What we do
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        Coming soon — Phase 2.
      </p>
    </main>
  );
}
