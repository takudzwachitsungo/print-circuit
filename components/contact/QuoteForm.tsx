"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import type { QuoteRequest } from "@/lib/quote";

const STEPS = ["Service", "Details", "Contact"] as const;

const EMAILJS = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

// Env-gated reliability fallback. Inert (returns false) unless all three keys
// are configured, so dev/CI use the /api/quote path only.
async function sendViaEmailJs(data: QuoteRequest): Promise<boolean> {
  if (!EMAILJS.serviceId || !EMAILJS.templateId || !EMAILJS.publicKey) return false;
  const emailjs = (await import("@emailjs/browser")).default;
  await emailjs.send(
    EMAILJS.serviceId,
    EMAILJS.templateId,
    { ...data },
    { publicKey: EMAILJS.publicKey },
  );
  return true;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function QuoteForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState<QuoteRequest>({
    service: "",
    details: "",
    name: "",
    email: "",
    phone: "",
  });

  const set = (k: keyof QuoteRequest, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canAdvance =
    (step === 0 && form.service !== "") ||
    (step === 1 && form.details.trim().length >= 10) ||
    step === 2;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      if (await sendViaEmailJs(form).catch(() => false)) {
        setStatus("success");
        return;
      }
      const body = await res.json().catch(() => ({}));
      setStatus("error");
      setError(typeof body.error === "string" ? body.error : "Something went wrong.");
    } catch {
      if (await sendViaEmailJs(form).catch(() => false)) {
        setStatus("success");
        return;
      }
      setStatus("error");
      setError("We couldn't reach the server.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface p-8">
        <h2 className="font-display text-2xl font-bold text-primary">
          Thanks — we&rsquo;ve got it.
        </h2>
        <p className="mt-3 text-muted">
          We&rsquo;ll get back to you with a quote, usually the same day. Need us
          sooner?
        </p>
        <a
          href={SITE.whatsapp}
          className="mt-4 inline-block font-medium text-cyan hover:text-magenta"
        >
          Chat on WhatsApp →
        </a>
      </div>
    );
  }

  return (
    <form
      aria-label="Request a quote"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-surface p-6 sm:p-8"
    >
      <ol className="flex gap-2" aria-hidden>
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-cyan" : "bg-white/10"}`}
          />
        ))}
      </ol>
      <p className="mt-4 font-display text-sm uppercase tracking-[0.2em] text-muted">
        Step {step + 1} of {STEPS.length} — {STEPS[step]}
      </p>

      {step === 0 && (
        <fieldset className="mt-6">
          <legend className="font-display text-xl text-primary">
            Which service do you need?
          </legend>
          <div className="mt-4 space-y-3">
            {SITE.services.map((s) => (
              <label
                key={s.slug}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-3 hover:border-cyan/50"
              >
                <input
                  type="radio"
                  name="service"
                  value={s.label}
                  checked={form.service === s.label}
                  onChange={() => set("service", s.label)}
                  className="accent-cyan"
                />
                <span className="text-primary">{s.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <div className="mt-6">
          <label htmlFor="details" className="font-display text-xl text-primary">
            Tell us about your project
          </label>
          <textarea
            id="details"
            name="details"
            rows={6}
            value={form.details}
            onChange={(e) => set("details", e.target.value)}
            placeholder="What do you need, how many, and by when?"
            className="mt-4 w-full rounded-xl border border-white/10 bg-base p-4 text-primary placeholder:text-muted focus:border-cyan focus:outline-none"
          />
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-muted">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-base p-3 text-primary focus:border-cyan focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-base p-3 text-primary focus:border-cyan focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-muted">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-base p-3 text-primary focus:border-cyan focus:outline-none"
            />
          </div>
        </div>
      )}

      {status === "error" && (
        <p role="alert" className="mt-4 text-sm text-magenta">
          {error} Please try again, or reach us on{" "}
          <a href={SITE.whatsapp} className="underline">
            WhatsApp
          </a>
          .
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm text-muted hover:text-primary disabled:opacity-40"
        >
          ← Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => canAdvance && setStep((s) => s + 1)}
            disabled={!canAdvance}
            className="rounded-full bg-cyan px-6 py-2 font-display text-sm text-base hover:bg-magenta hover:text-primary disabled:opacity-40"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-full bg-cyan px-6 py-2 font-display text-sm text-base hover:bg-magenta hover:text-primary disabled:opacity-40"
          >
            {status === "submitting" ? "Sending…" : "Send request"}
          </button>
        )}
      </div>
    </form>
  );
}
