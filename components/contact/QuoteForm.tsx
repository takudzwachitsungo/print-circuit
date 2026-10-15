"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/lib/site";
import { getProduct } from "@/lib/products";
import { itemKey, toQuoteItems } from "@/lib/basket";
import { formatQuoteItems, shouldUseFallback, type QuoteRequest } from "@/lib/quote";
import { useBasket } from "@/components/shop/BasketProvider";
import QtyInput from "@/components/shop/QtyInput";
import { buttonClass } from "@/components/ui/ButtonLink";

const EMAILJS = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

// Env-gated reliability fallback. Inert (returns false) unless all three keys
// are configured, so dev/CI use the /api/quote path only. EmailJS templates
// take flat strings, so basket items are folded into `details`.
async function sendViaEmailJs(data: QuoteRequest): Promise<boolean> {
  if (!EMAILJS.serviceId || !EMAILJS.templateId || !EMAILJS.publicKey) return false;
  const { items, ...rest } = data;
  const details = [items?.length ? formatQuoteItems(items) : "", rest.details]
    .filter(Boolean)
    .join("\n\n");
  const emailjs = (await import("@emailjs/browser")).default;
  await emailjs.send(
    EMAILJS.serviceId,
    EMAILJS.templateId,
    { ...rest, details },
    { publicKey: EMAILJS.publicKey },
  );
  return true;
}

type Status = "idle" | "submitting" | "success" | "error";
type Fields = Omit<QuoteRequest, "items">;

const inputClass =
  "mt-1 w-full rounded-xl border border-line bg-base p-3 text-primary focus:border-primary focus:outline-none";

export default function QuoteForm() {
  const basket = useBasket();
  const hasItems = basket.items.length > 0;
  const steps = [hasItems ? "Products" : "Service", "Details", "Contact"];

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState<Fields>({
    service: "",
    details: "",
    name: "",
    email: "",
    phone: "",
  });

  const set = (k: keyof Fields, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const canAdvance =
    (step === 0 && (hasItems || form.service !== "")) ||
    (step === 1 && (hasItems || form.details.trim().length >= 10)) ||
    step === 2;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Enter in a field before the last step (implicit submission) moves on
    // instead of sending a quote without contact details.
    if (step < steps.length - 1) {
      if (canAdvance) setStep((s) => s + 1);
      return;
    }
    setStatus("submitting");
    setError("");
    const payload: QuoteRequest = hasItems
      ? { ...form, service: "", items: toQuoteItems(basket.items) }
      : form;
    const succeed = () => {
      basket.clear();
      setStatus("success");
    };
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return succeed();
      if (shouldUseFallback(res.status) && (await sendViaEmailJs(payload).catch(() => false))) {
        return succeed();
      }
      const body = await res.json().catch(() => ({}));
      setStatus("error");
      setError(typeof body.error === "string" ? body.error : "Something went wrong.");
    } catch {
      if (shouldUseFallback(null) && (await sendViaEmailJs(payload).catch(() => false))) {
        return succeed();
      }
      setStatus("error");
      setError("We couldn't reach the server.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-line bg-surface p-8">
        <h2 className="font-display text-2xl font-medium text-primary">
          Thanks — we&rsquo;ve got it.
        </h2>
        <p className="mt-3 text-muted">
          We&rsquo;ll get back to you with a quote, usually the same day. Need us sooner?
        </p>
        <a
          href={SITE.whatsapp}
          className="mt-4 inline-block font-medium text-primary underline underline-offset-4 hover:text-magenta"
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
      className="rounded-3xl border border-line bg-surface p-6 sm:p-8"
    >
      <ol className="flex gap-2" aria-hidden>
        {steps.map((label, i) => (
          <li
            key={label}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-line"}`}
          />
        ))}
      </ol>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-muted">
        Step {step + 1} of {steps.length} — {steps[step]}
      </p>

      {step === 0 && hasItems && (
        <fieldset className="mt-6">
          <legend className="font-display text-xl text-primary">Your products</legend>
          <ul className="mt-4 space-y-3">
            {basket.items.map((item) => {
              const product = getProduct(item.slug);
              if (!product) return null;
              const key = itemKey(item);
              return (
                <li key={key} className="flex items-center gap-3 rounded-xl border border-line bg-base p-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-primary">{product.name}</p>
                    {item.option && <p className="text-xs text-muted">{item.option}</p>}
                    {item.note && <p className="truncate text-xs text-muted">{item.note}</p>}
                  </div>
                  <QtyInput
                    value={item.qty}
                    label={`${product.name} quantity`}
                    onCommit={(qty) => basket.update(key, { qty })}
                  />
                  <button
                    type="button"
                    onClick={() => basket.remove(key)}
                    className="text-xs text-muted underline hover:text-primary"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
          <Link
            href="/shop"
            className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4 hover:text-magenta"
          >
            + Add more products
          </Link>
        </fieldset>
      )}

      {step === 0 && !hasItems && (
        <fieldset className="mt-6">
          <legend className="font-display text-xl text-primary">Which service do you need?</legend>
          <div className="mt-4 space-y-3">
            {SITE.services.map((s) => (
              <label
                key={s.slug}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-base p-3 hover:border-primary"
              >
                <input
                  type="radio"
                  name="service"
                  value={s.label}
                  checked={form.service === s.label}
                  onChange={() => set("service", s.label)}
                  className="accent-primary"
                />
                <span className="text-primary">{s.label}</span>
              </label>
            ))}
          </div>
          <Link
            href="/shop"
            className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4 hover:text-magenta"
          >
            Or pick specific products from the shop →
          </Link>
        </fieldset>
      )}

      {step === 1 && (
        <div className="mt-6">
          <label htmlFor="details" className="font-display text-xl text-primary">
            {hasItems ? "Anything else? (optional)" : "Tell us about your project"}
          </label>
          <textarea
            id="details"
            name="details"
            rows={6}
            value={form.details}
            onChange={(e) => set("details", e.target.value)}
            placeholder={
              hasItems
                ? "Deadline, delivery, artwork you already have…"
                : "What do you need, how many, and by when?"
            }
            className="mt-4 w-full rounded-xl border border-line bg-base p-4 text-primary placeholder:text-muted focus:border-primary focus:outline-none"
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
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
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
        {/* Distinct keys: if React reused one <button> and flipped its type to
            "submit" mid-click, the click that reaches the last step would
            submit the form before the contact details are filled in. */}
        {step < steps.length - 1 ? (
          <button
            key="next"
            type="button"
            onClick={() => canAdvance && setStep((s) => s + 1)}
            disabled={!canAdvance}
            className={buttonClass("primary", "rounded-full px-6 py-2")}
          >
            Next
          </button>
        ) : (
          <button
            key="submit"
            type="submit"
            disabled={status === "submitting"}
            className={buttonClass("primary", "rounded-full px-6 py-2")}
          >
            {status === "submitting" ? "Sending…" : "Send request"}
          </button>
        )}
      </div>
    </form>
  );
}
