import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — Printing & Branding`,
    short_name: SITE.name,
    description:
      "Harare-based printing, branding, signage and design for businesses across Zimbabwe.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0C",
    theme_color: "#0A0A0C",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
