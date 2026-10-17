import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/shop/ProductGrid";
import { mostRequested } from "@/lib/products";

export default function MostRequested() {
  return (
    <section aria-labelledby="popular-heading" className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
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
