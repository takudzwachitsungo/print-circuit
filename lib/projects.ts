export type ProjectCategory =
  | "Branding"
  | "Printing"
  | "Signage"
  | "Stationery"
  | "Web";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  /** Cover image path under /public/work — placeholder until the asset pass. */
  image: string;
  /** One-line description (card + case-study lead). */
  summary: string;
  client: string;
  year: string;
  /** Service tags shown on the case study. */
  services: string[];
  /** Short paragraph: what we did. Company voice. */
  scope: string;
  /** Placeholder gallery image paths (real images added in the asset pass). */
  gallery: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: "uz-event-flyer",
    title: "UZ Event Flyer",
    category: "Branding",
    image: "/work/uz-event-flyer.jpg",
    summary: "Bold, readable event flyer for a University of Zimbabwe student event.",
    client: "University of Zimbabwe student society",
    year: "2026",
    services: ["Graphic Design", "Printing"],
    scope:
      "We designed a high-contrast flyer that stays legible at a glance and prints cleanly in volume, then produced the run for campus distribution.",
    gallery: ["/work/uz-event-flyer-1.jpg", "/work/uz-event-flyer-2.jpg"],
  },
  {
    slug: "rotaract-rollup-banner",
    title: "Rotaract UZ Roll-up Banner",
    category: "Signage",
    image: "/work/rotaract-rollup-banner.jpg",
    summary: "Pull-up banner for a Rotaract Club of UZ event.",
    client: "Rotaract Club of UZ",
    year: "2026",
    services: ["Graphic Design", "Large Format Printing"],
    scope:
      "We laid out a tall, eye-level banner that reads from a distance and printed it on durable roll-up stock ready for repeat use at events.",
    gallery: ["/work/rotaract-rollup-banner-1.jpg"],
  },
  {
    slug: "value-store-branding",
    title: "The Value Store Branding",
    category: "Branding",
    image: "/work/value-store-branding.jpg",
    summary: "Full branding rollout for a retail store, from logo to signage.",
    client: "The Value Store",
    year: "2026",
    services: ["Branding", "Logo Design", "Signage"],
    scope:
      "We built a complete visual identity — logo, colours, and shopfront signage — that made a new store feel established from day one.",
    gallery: [
      "/work/value-store-branding-1.jpg",
      "/work/value-store-branding-2.jpg",
      "/work/value-store-branding-3.jpg",
    ],
  },
  {
    slug: "church-countdown-flyer",
    title: "Church Countdown Flyer",
    category: "Printing",
    image: "/work/church-countdown-flyer.jpg",
    summary: "Event countdown flyer designed and printed for a church programme.",
    client: "Local church ministry",
    year: "2026",
    services: ["Graphic Design", "Printing"],
    scope:
      "We designed a clear, warm countdown flyer and printed it on quality stock for hand-out and display ahead of the event.",
    gallery: ["/work/church-countdown-flyer-1.jpg"],
  },
  {
    slug: "binyabs-logo",
    title: "Binyabs Logo Design",
    category: "Branding",
    image: "/work/binyabs-logo.jpg",
    summary: "Logo and core brand marks for the Binyabs brand.",
    client: "Binyabs",
    year: "2026",
    services: ["Logo Design", "Brand Identity"],
    scope:
      "We designed a distinctive wordmark and supporting marks, delivered in print- and web-ready formats with usage guidance.",
    gallery: ["/work/binyabs-logo-1.jpg", "/work/binyabs-logo-2.jpg"],
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    category: "Web",
    image: "/work/portfolio-website.jpg",
    summary: "A fast, responsive portfolio website.",
    client: "Independent client",
    year: "2026",
    services: ["Web Development", "UI Design"],
    scope:
      "We designed and built a mobile-first portfolio site with clean navigation and quick load times, ready to grow with the client's work.",
    gallery: ["/work/portfolio-website-1.jpg", "/work/portfolio-website-2.jpg"],
  },
];

/** Categories actually present in PROJECTS, in first-appearance order.
    Derived (not hard-coded) so the filter bar never shows an empty tab. */
export const CATEGORIES: ProjectCategory[] = PROJECTS.reduce<ProjectCategory[]>(
  (acc, p) => (acc.includes(p.category) ? acc : [...acc, p.category]),
  [],
);

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
