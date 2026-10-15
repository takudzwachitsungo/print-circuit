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
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
        Contact
      </p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl">
        Get a quote
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Tell us about your project and we&rsquo;ll get you a quote — usually the
        same day.
      </p>
      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
        <QuoteForm />
        <ContactInfo />
      </div>
    </main>
  );
}
