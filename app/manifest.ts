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
    background_color: "#F7F5F0",
    theme_color: "#F7F5F0",
    icons: [
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { src: "/logo.png", sizes: "48x48", type: "image/png" },
    ],
  };
}
