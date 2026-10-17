import { SITE } from "./site";

export type CategorySlug = (typeof SITE.services)[number]["slug"];
export type ProductBadge = "Popular" | "Fast turnaround" | "New";

export interface Product {
  /** Unique, URL-safe — becomes /shop/<slug>. */
  slug: string;
  name: string;
  category: CategorySlug;
  /** One line of honest spec shown on the card. */
  blurb: string;
  /** Selectable choices on the product page (one may be chosen). */
  options?: string[];
  /** Path under /public. Leave out to show the branded placeholder. */
  image?: string;
  badge?: ProductBadge;
  /** Shown in the home hero (first two). */
  featured?: boolean;
}

/** Short names for chips and cards ("Printing Services" → "Printing"). */
export const CATEGORY_SHORT: Record<CategorySlug, string> = {
  printing: "Printing",
  "graphic-design-branding": "Design & Branding",
  "signage-advertising": "Signage",
  "stationery-supplies": "Stationery",
  "web-development": "Web",
};

/**
 * The catalogue. Edit names/blurbs/options freely; keep slugs stable once live
 * (they are page URLs and live in visitors' saved quotes). No prices — every
 * product is quoted on request.
 */
export const PRODUCTS: Product[] = [
  // ── Printing ─────────────────────────────────────────────
  {
    slug: "business-cards",
    name: "Business Cards",
    category: "printing",
    blurb: "Single or double-sided on premium card — matte, gloss or spot UV finish.",
    options: ["Matte", "Gloss", "Spot UV"],
    image: "/showcase/business-cards.jpg",
    badge: "Popular",
    featured: true,
  },
  {
    slug: "flyers-brochures",
    name: "Flyers & Brochures",
    category: "printing",
    blurb: "Promote events, menus and offers — A5, A4 or DL, folded or flat.",
    options: ["A5", "A4", "DL"],
    image: "/showcase/flyers.jpg",
    badge: "Popular",
  },
  {
    slug: "posters-large-format",
    name: "Posters & Large Format",
    category: "printing",
    blurb: "Eye-catching posters from A3 up to A0 and beyond, indoor or outdoor.",
    options: ["A3", "A2", "A1", "A0"],
    image: "/products/posters-large-format.jpg",
  },
  {
    slug: "vinyl-banners",
    name: "Vinyl Banners",
    category: "printing",
    blurb: "Weatherproof banners for shopfronts, events and fences, any size.",
    options: ["Eyelets", "Pole pockets"],
    image: "/products/vinyl-banners.jpg",
    badge: "Fast turnaround",
    featured: true,
  },
  {
    slug: "booklets-manuals",
    name: "Booklets & Manuals",
    category: "printing",
    blurb: "Programmes, catalogues and training manuals, stapled or bound.",
    options: ["Saddle-stitched", "Perfect bound"],
    image: "/products/booklets-manuals.jpg",
  },
  {
    slug: "stickers-labels",
    name: "Stickers & Labels",
    category: "printing",
    blurb: "Product labels and promo stickers, cut to any shape.",
    options: ["Gloss", "Matte", "Die-cut"],
    image: "/products/stickers-labels.jpg",
    badge: "New",
  },
  {
    slug: "custom-t-shirts",
    name: "Custom T-shirts",
    category: "printing",
    blurb: "Printed tees for events, teams, uniforms and memorials.",
    options: ["Event", "Company uniform", "Memorial"],
    image: "/products/custom-t-shirts.jpg",
  },
  {
    slug: "branded-merchandise",
    name: "Branded Merchandise",
    category: "printing",
    blurb: "Hoodies, caps and drinkware with your logo — for staff, clients and gifts.",
    options: ["Hoodies", "Caps", "Tumblers & mugs"],
    image: "/products/branded-merchandise.jpg",
  },
  // ── Graphic design & branding ────────────────────────────
  {
    slug: "logo-design",
    name: "Logo Design",
    category: "graphic-design-branding",
    blurb: "A distinctive logo with concepts, revisions and print-ready files.",
    image: "/products/logo-design.jpg",
    badge: "Popular",
  },
  {
    slug: "brand-identity",
    name: "Brand Identity",
    category: "graphic-design-branding",
    blurb: "Logo, colours, type and templates that make your business recognisable.",
    image: "/showcase/branding.jpg",
  },
  {
    slug: "social-media-kits",
    name: "Social Media Kits",
    category: "graphic-design-branding",
    blurb: "Branded post and story templates for your channels.",
    image: "/products/social-media-kits.jpg",
  },
  {
    slug: "marketing-collateral",
    name: "Marketing Collateral",
    category: "graphic-design-branding",
    blurb: "Designed flyers, brochures and presentations ready for print or screen.",
    image: "/products/marketing-collateral.jpg",
  },
  {
    slug: "packaging-design",
    name: "Packaging Design",
    category: "graphic-design-branding",
    blurb: "Boxes, bags and labels designed to stand out on the shelf.",
    image: "/products/packaging-design.jpg",
  },
  {
    slug: "brand-guidelines",
    name: "Brand Guidelines",
    category: "graphic-design-branding",
    blurb: "A simple guide so everyone uses your brand consistently.",
  },
  // ── Signage & advertising ────────────────────────────────
  {
    slug: "roll-up-banners",
    name: "Roll-up Banners",
    category: "signage-advertising",
    blurb: "Portable pull-up banners for events, expos and reception areas.",
    options: ["Standard 85 × 200 cm", "Wide 100 × 200 cm"],
    image: "/products/roll-up-banners.jpg",
    badge: "Popular",
  },
  {
    slug: "shopfront-signage",
    name: "Shopfront Signage",
    category: "signage-advertising",
    blurb: "Fascia boards and shop signs, made and installed.",
    image: "/products/shopfront-signage.jpg",
  },
  {
    slug: "vehicle-branding",
    name: "Vehicle Branding",
    category: "signage-advertising",
    blurb: "Decals and wraps that turn your vehicles into adverts.",
    options: ["Decals", "Partial wrap", "Full wrap"],
    image: "/products/vehicle-branding.jpg",
  },
  {
    slug: "event-displays",
    name: "Event Displays",
    category: "signage-advertising",
    blurb: "Pop-up walls, backdrops and table covers for events.",
    image: "/products/event-displays.jpg",
  },
  {
    slug: "billboard-printing",
    name: "Billboard Printing",
    category: "signage-advertising",
    blurb: "Large-format outdoor billboard skins, printed to spec.",
    image: "/products/billboard-printing.jpg",
  },
  {
    slug: "directional-signs",
    name: "Directional & Safety Signs",
    category: "signage-advertising",
    blurb: "Clear wayfinding and safety signage for offices and sites.",
    image: "/products/directional-signs.jpg",
  },
  // ── Stationery & supplies ────────────────────────────────
  {
    slug: "letterheads",
    name: "Letterheads",
    category: "stationery-supplies",
    blurb: "Branded letterheads on quality bond paper.",
    options: ["80gsm", "100gsm"],
    image: "/showcase/stationery.jpg",
  },
  {
    slug: "receipt-books",
    name: "Invoice & Receipt Books",
    category: "stationery-supplies",
    blurb: "Numbered, carbonless duplicate or triplicate books.",
    options: ["Duplicate", "Triplicate"],
    image: "/products/receipt-books.jpg",
    badge: "Popular",
  },
  {
    slug: "branded-notebooks",
    name: "Branded Notebooks",
    category: "stationery-supplies",
    blurb: "Notebooks with your logo for staff, clients and events.",
    options: ["A5", "A4"],
    image: "/products/branded-notebooks.jpg",
  },
  {
    slug: "company-folders",
    name: "Company Folders",
    category: "stationery-supplies",
    blurb: "Presentation folders with pockets for proposals and documents.",
    image: "/products/company-folders.jpg",
  },
  {
    slug: "envelopes",
    name: "Envelopes",
    category: "stationery-supplies",
    blurb: "Printed envelopes in standard sizes.",
    options: ["DL", "C5", "C4"],
    image: "/products/envelopes.jpg",
  },
  {
    slug: "certificates",
    name: "Certificates",
    category: "stationery-supplies",
    blurb: "Award and training certificates, designed and printed on premium card.",
    image: "/products/certificates.jpg",
  },
  {
    slug: "office-printing",
    name: "Office Printing Supplies",
    category: "stationery-supplies",
    blurb: "Everyday office printing and supplies, sorted in one order.",
    image: "/products/office-printing.jpg",
  },
  // ── Web development ──────────────────────────────────────
  {
    slug: "business-websites",
    name: "Business Websites",
    category: "web-development",
    blurb: "A fast, mobile-first website that shows customers who you are.",
    image: "/products/business-websites.jpg",
    badge: "Popular",
  },
  {
    slug: "landing-pages",
    name: "Landing Pages",
    category: "web-development",
    blurb: "A focused single page for a campaign, product or event.",
  },
  {
    slug: "ecommerce-stores",
    name: "E-commerce Stores",
    category: "web-development",
    blurb: "An online store to show products and take orders.",
  },
  {
    slug: "website-redesigns",
    name: "Website Redesigns",
    category: "web-development",
    blurb: "Refresh an outdated site with a modern look and better speed.",
  },
  {
    slug: "hosting-domains",
    name: "Hosting & Domains",
    category: "web-development",
    blurb: "Domain registration, hosting and business email set-up.",
    image: "/products/hosting-domains.jpg",
  },
  {
    slug: "website-maintenance",
    name: "Maintenance & Support",
    category: "web-development",
    blurb: "Updates, backups and fixes so your site keeps running.",
    image: "/products/website-maintenance.jpg",
  },
];

export const PRODUCT_SLUGS: ReadonlySet<string> = new Set(PRODUCTS.map((p) => p.slug));

export function isCategory(value: unknown): value is CategorySlug {
  return typeof value === "string" && SITE.services.some((s) => s.slug === value);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function featuredProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured).slice(0, 2);
}

/** Badged products first, then the rest in catalogue order. */
export function mostRequested(limit = 8): Product[] {
  const badged = PRODUCTS.filter((p) => p.badge);
  const rest = PRODUCTS.filter((p) => !p.badge);
  return [...badged, ...rest].slice(0, limit);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  return productsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, limit);
}

/** Case-insensitive; every whitespace-separated term must appear somewhere in
    the name, blurb, category or options. Blank query returns the pool. */
export function searchProducts(query: string, pool: Product[] = PRODUCTS): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return pool;
  return pool.filter((p) => {
    const haystack = [p.name, p.blurb, CATEGORY_SHORT[p.category], ...(p.options ?? [])]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}
