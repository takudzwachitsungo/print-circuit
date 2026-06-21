export const SITE = {
  name: "Print Circuit",
  url: "https://www.printcircuit.co.zw",
  legalName: "Printcircuit Enterprises (Private) Limited",
  address: "61 Mendel, Avondale, Harare, Zimbabwe",
  phones: ["+263 78 872 3331", "+263 71 776 1048"],
  email: "info@printcircuit.co.zw",
  whatsapp: "https://wa.me/263788723331",
  socials: { twitter: "https://twitter.com/printcircuit" },
  hours: [
    { days: "Monday – Friday", time: "8:00 – 17:00" },
    { days: "Saturday", time: "9:00 – 13:00" },
    { days: "Sunday", time: "Closed" },
  ],
  services: [
    { slug: "printing", label: "Printing Services" },
    { slug: "graphic-design-branding", label: "Graphic Design & Branding" },
    { slug: "signage-advertising", label: "Signage & Advertising" },
    { slug: "stationery-supplies", label: "Stationery & Supplies" },
    { slug: "web-development", label: "Web Development" },
  ],
} as const;
