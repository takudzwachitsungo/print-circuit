import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-32">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-yellow">
        About
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold text-primary sm:text-6xl">
        Our story
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        Coming soon — Phase 2.
      </p>
    </main>
  );
}
