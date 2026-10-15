import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/shop/ProductGrid";
import { mostRequested } from "@/lib/products";

export default function MostRequested() {
  return (
    <section aria-labelledby="popular-heading" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        id="popular-heading"
        label="Products"
        title="Most requested"
        link={{ href: "/shop", label: "View all" }}
      />
      <div className="mt-8">
        <ProductGrid products={mostRequested(8)} />
      </div>
    </section>
  );
}
