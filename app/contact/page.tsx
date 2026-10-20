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
    <main className="mx-auto w-full max-w-screen-2xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8 xl:px-10">
      {/* Top Eyebrow */}
      <div className="flex items-center gap-3">
        <span className="h-0.5 w-10 bg-magenta" />
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-magenta">
          Get In Touch
        </p>
      </div>

      {/* Main Display Heading */}
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl">
        Contact <span className="text-magenta">Print Circuit.</span>
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        Tell us about your project and we&rsquo;ll get you a quote — usually the same day. Call, WhatsApp, email, or visit our Harare studio.
      </p>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
        <QuoteForm />
        <ContactInfo />
      </div>
    </main>
  );
}
