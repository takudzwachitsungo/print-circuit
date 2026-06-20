import { SITE } from "./site";

export type Accent = "cyan" | "magenta" | "yellow";

export interface ServiceContent {
  tagline: string;
  intro: string;
  included: string[];
  faqs: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
  accent: Accent;
}

export interface Service extends ServiceContent {
  slug: string;
  label: string;
}

/** Literal Tailwind class strings per accent (never build these by concatenation). */
export const ACCENT: Record<
  Accent,
  { text: string; border: string; bgSoft: string; gradientFrom: string; groupHoverText: string }
> = {
  cyan: {
    text: "text-cyan",
    border: "border-cyan",
    bgSoft: "bg-cyan/10",
    gradientFrom: "from-cyan/30",
    groupHoverText: "group-hover:text-cyan",
  },
  magenta: {
    text: "text-magenta",
    border: "border-magenta",
    bgSoft: "bg-magenta/10",
    gradientFrom: "from-magenta/30",
    groupHoverText: "group-hover:text-magenta",
  },
  yellow: {
    text: "text-yellow",
    border: "border-yellow",
    bgSoft: "bg-yellow/10",
    gradientFrom: "from-yellow/30",
    groupHoverText: "group-hover:text-yellow",
  },
};

/** Rich content keyed by the canonical SITE.services slugs. */
const CONTENT: Record<string, ServiceContent> = {
  printing: {
    accent: "cyan",
    tagline: "Sharp, vibrant printing for every format.",
    intro:
      "From a single business card to wall-sized banners, we print on the right stock at the right finish so your work looks professional every time. Digital and large-format production, handled in-house in Harare.",
    included: [
      "Business cards",
      "Flyers & brochures",
      "Posters & large format",
      "Banners & roll-ups",
      "Booklets & manuals",
      "Stickers & labels",
    ],
    faqs: [
      {
        q: "How long does printing take?",
        a: "Most standard jobs are ready in 2–3 working days. We can fast-track urgent work — tell us your deadline when you request a quote.",
      },
      {
        q: "What file formats do you accept?",
        a: "Print-ready PDF is ideal. We also accept high-resolution PNG, JPG, and native design files, and we can fix or set up artwork for you.",
      },
      {
        q: "Is there a minimum order?",
        a: "No. We print short runs and one-offs as well as bulk orders, with better per-unit pricing at higher quantities.",
      },
    ],
    seoTitle: "Printing Services in Harare",
    seoDescription:
      "Business card, flyer, banner and large-format printing in Harare, Zimbabwe. Fast turnaround, sharp results from Print Circuit.",
  },
  "graphic-design-branding": {
    accent: "magenta",
    tagline: "Identities that make new brands look established.",
    intro:
      "We design logos and complete brand systems that help businesses and individuals look credible from day one — clear, consistent, and built to work across print and screen.",
    included: [
      "Logo design",
      "Brand identity systems",
      "Social media kits",
      "Marketing collateral",
      "Packaging design",
      "Brand guidelines",
    ],
    faqs: [
      {
        q: "How many logo concepts do we get?",
        a: "Our standard logo package includes three initial concepts and two rounds of revisions on your chosen direction. Larger brand projects are scoped to fit.",
      },
      {
        q: "Do we own the final artwork?",
        a: "Yes. On final payment you receive full ownership and all source files, including vector formats for print and web.",
      },
      {
        q: "Can you refresh our existing brand?",
        a: "Absolutely — we can modernise an existing identity while keeping the recognition you've already built.",
      },
    ],
    seoTitle: "Graphic Design & Branding in Harare",
    seoDescription:
      "Logo design, brand identity and marketing collateral in Harare, Zimbabwe. Print Circuit helps brands look established.",
  },
  "signage-advertising": {
    accent: "yellow",
    tagline: "Get seen — indoors, outdoors, and on the move.",
    intro:
      "We design and produce signage that puts your brand in front of customers, from shopfront fascias to vehicle branding and event displays, built to hold up in Zimbabwe's conditions.",
    included: [
      "Roll-up & pull-up banners",
      "Shopfront & fascia signage",
      "Vehicle branding & wraps",
      "Pop-up & event displays",
      "Outdoor & billboard printing",
      "Directional & safety signs",
    ],
    faqs: [
      {
        q: "Do you install signage?",
        a: "Yes — we handle production and installation for shopfront and outdoor signage in and around Harare.",
      },
      {
        q: "Are your outdoor materials weatherproof?",
        a: "We use UV- and weather-resistant materials for outdoor work so colours stay strong in sun and rain.",
      },
      {
        q: "Can you brand a vehicle from our logo?",
        a: "We can. Send us your logo and vehicle details and we'll design, print, and apply a wrap or decals to fit.",
      },
    ],
    seoTitle: "Signage & Advertising in Harare",
    seoDescription:
      "Banners, shopfront signage, vehicle branding and outdoor advertising in Harare, Zimbabwe, from Print Circuit.",
  },
  "stationery-supplies": {
    accent: "cyan",
    tagline: "The everyday essentials that keep you looking professional.",
    intro:
      "Branded business stationery and office supplies, printed consistently so every document, invoice, and folder reinforces your brand.",
    included: [
      "Letterheads",
      "Invoice & receipt books",
      "Branded notebooks",
      "Company folders",
      "Envelopes",
      "Office printing supplies",
    ],
    faqs: [
      {
        q: "Can you reprint our existing stationery?",
        a: "Yes — send us a sample or your files and we'll match your current stationery for reorders.",
      },
      {
        q: "Do you supply numbered invoice and receipt books?",
        a: "We do, with sequential numbering and duplicate or triplicate copies on request.",
      },
      {
        q: "Can we order in bulk for the year?",
        a: "Bulk orders are welcome and reduce your per-unit cost — tell us your annual volume for a quote.",
      },
    ],
    seoTitle: "Business Stationery & Supplies in Harare",
    seoDescription:
      "Branded letterheads, invoice books, folders and office stationery printing in Harare, Zimbabwe, from Print Circuit.",
  },
  "web-development": {
    accent: "magenta",
    tagline: "Modern websites that turn visitors into enquiries.",
    intro:
      "We build fast, mobile-first websites that match your brand and make it easy for customers to find and contact you — from one-page landing sites to full business sites and online stores.",
    included: [
      "Business websites",
      "Landing pages",
      "E-commerce stores",
      "Website redesigns",
      "Hosting & domains",
      "Maintenance & support",
    ],
    faqs: [
      {
        q: "How long does a website take to build?",
        a: "A focused business site typically takes 2–4 weeks depending on the number of pages and content readiness. We'll confirm a timeline in your quote.",
      },
      {
        q: "Will the site work on phones?",
        a: "Every site we build is mobile-first and tested across phones, tablets, and desktops.",
      },
      {
        q: "Can you host and maintain the site for us?",
        a: "Yes — we offer hosting, domain setup, and ongoing maintenance so you don't have to manage the technical side.",
      },
    ],
    seoTitle: "Web Development in Harare",
    seoDescription:
      "Business websites, landing pages and e-commerce development in Harare, Zimbabwe, by Print Circuit.",
  },
};

export const SERVICES: Service[] = SITE.services.map((s) => ({
  ...s,
  ...CONTENT[s.slug],
}));

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
