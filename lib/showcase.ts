export interface ShowcaseItem {
  /** Visible caption — also the human-readable label. */
  label: string;
  /** Local image under public/showcase/. Swap the file or this path to change it. */
  src: string;
  /** Honest description of the item category (image alt text). */
  alt: string;
}

/**
 * The "what we print" band below the home hero. Images are free-licensed stock
 * placeholders (see public/showcase/CREDITS.md) sized to a uniform 640×400 —
 * replace any file with a real Print Circuit job photo to make it ours.
 */
export const SHOWCASE: ShowcaseItem[] = [
  { label: "Business Cards", src: "/showcase/business-cards.jpg", alt: "Printed business cards" },
  { label: "Flyers", src: "/showcase/flyers.jpg", alt: "Printed promotional flyer" },
  {
    label: "Large Format Printing",
    src: "/showcase/large-format-printing.jpg",
    alt: "Large-format printer producing a wide print",
  },
  { label: "Banners", src: "/showcase/banners.jpg", alt: "Printed event banner" },
  { label: "Signage", src: "/showcase/signage.jpg", alt: "Illuminated storefront signage" },
  { label: "Branding", src: "/showcase/branding.jpg", alt: "Brand identity materials" },
  { label: "Stationery", src: "/showcase/stationery.jpg", alt: "Branded business stationery" },
  { label: "Stickers", src: "/showcase/stickers.jpg", alt: "Printed stickers" },
];
