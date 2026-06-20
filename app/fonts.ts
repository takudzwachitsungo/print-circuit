import { Space_Grotesk, Inter } from "next/font/google";

// Display / headings — bold geometric grotesk
export const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Body — clean, highly legible
export const body = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
