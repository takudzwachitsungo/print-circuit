import Link from "next/link";
import type { Product } from "@/lib/products";
import ProductImage from "./ProductImage";
import AddToQuoteButton from "./AddToQuoteButton";

export default function ProductCard({ product }: { product: Product }) {
  const titleId = `product-${product.slug}`;
  const href = `/shop/${product.slug}`;
  return (
    <article aria-labelledby={titleId} className="flex h-full flex-col">
      {/* Image link is a duplicate of the title link — hidden from AT/tab order. */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="group relative block">
        <ProductImage
          product={product}
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="border border-line transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-primary">
            {product.badge}
          </span>
        )}
      </Link>
      <h3 id={titleId} className="mt-4 font-display text-lg font-medium leading-snug text-primary">
        <Link href={href} className="transition-colors hover:text-magenta">
          {product.name}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">{product.blurb}</p>
      <AddToQuoteButton slug={product.slug} className="mt-4 w-full" />
    </article>
  );
}
