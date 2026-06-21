import type { Metadata } from "next";
import QuoteForm from "@/components/contact/QuoteForm";
import ContactInfo from "@/components/contact/ContactInfo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get a quote from Print Circuit — Harare printing, branding, signage and web. Call, WhatsApp, or send us your project details.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-cyan">
        Contact
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold text-primary sm:text-6xl">
        Get a quote
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Tell us about your project and we&rsquo;ll get you a quote — usually the
        same day.
      </p>
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <QuoteForm />
        <ContactInfo />
      </div>
    </main>
  );
}
