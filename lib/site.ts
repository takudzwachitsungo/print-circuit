export const SITE = {
  name: "Print Circuit",
  legalName: "Printcircuit Enterprises (Private) Limited",
  address: "61 Mendel, Avondale, Harare, Zimbabwe",
  phones: ["+263 78 872 3331", "+263 71 776 1048"],
  email: "info@printcircuit.co.zw",
  whatsapp: "https://wa.me/263788723331",
  socials: { twitter: "https://twitter.com/printcircuit" },
  services: [
    { slug: "printing", label: "Printing Services" },
    { slug: "graphic-design-branding", label: "Graphic Design & Branding" },
    { slug: "signage-advertising", label: "Signage & Advertising" },
    { slug: "stationery-supplies", label: "Stationery & Supplies" },
    { slug: "web-development", label: "Web Development" },
  ],
} as const;
