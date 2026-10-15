import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/shop/ProductGrid";
import { productsByCategory } from "@/lib/products";
import { type Service } from "@/lib/services";

export default function ServiceIncluded({ service }: { service: Service }) {
  return (
    <section aria-labelledby="included-heading" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        id="included-heading"
        label="Products"
        title="What's included"
        link={{ href: `/shop?cat=${service.slug}`, label: "Shop this category" }}
      />
      <div className="mt-8">
        <ProductGrid products={productsByCategory(service.slug)} label={`${service.label} products`} />
      </div>
    </section>
  );
}
