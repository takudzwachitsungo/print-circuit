import Link from "next/link";
import Reveal from "@/components/animation/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { CATEGORY_ICONS } from "@/components/ui/icons";
import { SITE } from "@/lib/site";

const TINTS = ["bg-tint-cyan", "bg-tint-pink", "bg-tint-butter", "bg-tint-cyan", "bg-tint-pink"];

export default function CategoryCards() {
  return (
    <section aria-labelledby="categories-heading" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <div data-testid="reveal-probe">
          <SectionHeading
            id="categories-heading"
            label="Categories"
            title="Shop by category"
            link={{ href: "/shop", label: "All categories" }}
          />
        </div>
      </Reveal>
      <ul className="-mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
        {SITE.services.map((s, i) => {
          const Icon = CATEGORY_ICONS[s.slug];
          return (
            <li key={s.slug} className="w-44 shrink-0 snap-start sm:w-auto">
              <Link
                href={`/shop?cat=${s.slug}`}
                className="flex h-full flex-col items-center rounded-2xl border border-line bg-surface p-6 text-center transition-colors hover:border-primary"
              >
                <span className={`grid h-14 w-14 place-items-center rounded-full text-primary ${TINTS[i % TINTS.length]}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="mt-4 font-medium text-primary">{s.label}</span>
                <span className="mt-1 text-xs text-muted">View products</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
