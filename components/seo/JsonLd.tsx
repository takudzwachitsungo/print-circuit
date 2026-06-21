import { SITE } from "@/lib/site";

export default function JsonLd() {
  // Decompose the single-line SITE.address ("street..., locality, country")
  // into schema parts so there is one source of truth and no drift.
  const parts = SITE.address.split(",").map((p) => p.trim());
  const streetAddress = parts.slice(0, parts.length - 2).join(", ");
  const addressLocality = parts[parts.length - 2];

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phones[0],
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      addressCountry: "ZW",
    },
    areaServed: "Zimbabwe",
    sameAs: Object.values(SITE.socials),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
