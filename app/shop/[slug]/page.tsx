import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { CATEGORY_SHORT, PRODUCTS, getProduct, relatedProducts } from "@/lib/products";
import ProductImage from "@/components/shop/ProductImage";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductConfigurator from "@/components/shop/ProductConfigurator";
import SectionHeading from "@/components/ui/SectionHeading";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const description = `${product.blurb} Get a quote from Print Circuit in Harare.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/shop/${slug}` },
    openGraph: { title: product.name, description, url: `/shop/${slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const service = SITE.services.find((s) => s.slug === product.category);
  const related = relatedProducts(product);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>{" "}
        /{" "}
        <Link href={`/shop?cat=${product.category}`} className="hover:text-primary">
          {CATEGORY_SHORT[product.category]}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative">
          <ProductImage
            product={product}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="border border-line"
          />
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-surface px-3 py-1 text-xs font-medium text-primary">
              {product.badge}
            </span>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {CATEGORY_SHORT[product.category]}
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg text-muted">{product.blurb}</p>

          <ProductConfigurator product={product} />

          <p className="mt-8 text-sm text-muted">
            Prices depend on quantity, size and finish — we&rsquo;ll send an exact quote, usually the
            same day.{" "}
            {service && (
              <Link
                href={`/services/${service.slug}`}
                className="font-medium text-primary underline underline-offset-4 hover:text-magenta"
              >
                More about {service.label}
              </Link>
            )}
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-20">
          <SectionHeading id="related-heading" label="Related" title="You might also need" />
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </main>
  );
}
