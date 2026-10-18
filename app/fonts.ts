import { Poppins, Shadows_Into_Light } from "next/font/google";

// Primary geometric typography — dominant font on onegrafix.co.zw
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

// Creative handwritten script accent — creative alt font on onegrafix.co.zw
export const script = Shadows_Into_Light({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-shadows",
  display: "swap",
});

export const display = poppins;
export const body = poppins;

