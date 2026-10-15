import Image from "next/image";
import type { CategorySlug, Product } from "@/lib/products";

/** Literal tint per category for the placeholder. */
const TINT: Record<CategorySlug, string> = {
  printing: "bg-tint-cyan",
  "graphic-design-branding": "bg-tint-pink",
  "signage-advertising": "bg-tint-butter",
  "stationery-supplies": "bg-tint-cyan",
  "web-development": "bg-tint-pink",
};

/** Square product image, or a branded halftone placeholder when the product
    has no photo yet (never a broken image). */
export default function ProductImage({
  product,
  sizes,
  priority = false,
  className = "",
}: {
  product: Product;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative aspect-square overflow-hidden rounded-2xl ${className}`}>
      {product.image ? (
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={product.name}
          className={`dot-pattern absolute inset-0 grid place-items-center p-4 ${TINT[product.category]}`}
        >
          <span aria-hidden className="text-center font-display text-lg font-medium leading-tight text-primary/70">
            {product.name}
          </span>
        </div>
      )}
    </div>
  );
}
