"use client";

import ButtonLink, { buttonClass } from "@/components/ui/ButtonLink";
import { useBasket } from "@/components/shop/BasketProvider";
import { SITE } from "@/lib/site";

export default function OrderBand() {
  const { count, open } = useBasket();
  return (
    <section aria-label="Place an order" className="mx-auto w-full max-w-screen-2xl px-4 pb-20 sm:px-6 lg:px-8 xl:px-10">
      <div className="grid items-center gap-8 rounded-3xl bg-tint-cyan p-8 sm:p-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-medium tracking-tight text-primary sm:text-5xl">
            Ready to place an order?
          </h2>
          <p className="mt-4 max-w-md text-primary/75">
            Pick products, add them to your quote, and we&rsquo;ll reply the same day.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          {count > 0 ? (
            <button type="button" onClick={open} className={buttonClass("primary", "sm:min-w-56")}>
              View my quote ({count})
            </button>
          ) : (
            <ButtonLink href="/shop" className="sm:min-w-56">
              Start a quote
            </ButtonLink>
          )}
          <ButtonLink href={SITE.whatsapp} variant="outline" external>
            WhatsApp us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
