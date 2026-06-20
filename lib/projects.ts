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
  /** Image path under /public/work — real assets added in the Portfolio phase. */
  image: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "uz-event-flyer",
    title: "UZ Event Flyer",
    category: "Branding",
    image: "/work/uz-event-flyer.jpg",
  },
  {
    slug: "rotaract-rollup-banner",
    title: "Rotaract UZ Roll-up Banner",
    category: "Signage",
    image: "/work/rotaract-rollup-banner.jpg",
  },
  {
    slug: "value-store-branding",
    title: "The Value Store Branding",
    category: "Branding",
    image: "/work/value-store-branding.jpg",
  },
  {
    slug: "church-countdown-flyer",
    title: "Church Countdown Flyer",
    category: "Printing",
    image: "/work/church-countdown-flyer.jpg",
  },
  {
    slug: "binyabs-logo",
    title: "Binyabs Logo Design",
    category: "Branding",
    image: "/work/binyabs-logo.jpg",
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    category: "Web",
    image: "/work/portfolio-website.jpg",
  },
];
