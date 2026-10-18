import { Poppins } from "next/font/google";

// Primary geometric typography — font from onegrafix.co.zw
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const display = poppins;
export const body = poppins;

