import type { Metadata } from "next";
import { display, body } from "./fonts";
import { SITE } from "@/lib/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/providers/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Print Circuit | Printing & Branding in Zimbabwe",
    template: "%s | Print Circuit",
  },
  description:
    "Print Circuit is a Harare-based printing, branding, signage and design company serving businesses across Zimbabwe.",
  openGraph: {
    title: "Print Circuit",
    siteName: "Print Circuit",
    url: SITE.url,
    type: "website",
    locale: "en_ZW",
  },
  twitter: {
    card: "summary_large_image",
    title: "Print Circuit",
    description:
      "Harare-based printing, branding, signage and design for businesses across Zimbabwe.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-base text-primary font-body antialiased">
        <SmoothScroll>
          <Navbar />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
