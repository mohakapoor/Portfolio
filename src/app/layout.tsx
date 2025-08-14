import type { Metadata } from "next";
import {
  Bebas_Neue,
  Crimson_Text,
  Source_Sans_3,
  Courier_Prime,
} from "next/font/google";
import "./globals.css";
import HeaderSocials from "@/components/HeaderSocials";

// Spider-Man Noir font stack
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const crimson = Crimson_Text({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const courier = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohak Kapoor | Quantitative Detective",
  description: "Investigating market mysteries with machine learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={[
          bebas.variable,
          crimson.variable,
          sourceSans.variable,
          courier.variable,
          "antialiased",
        ].join(" ")}
      >
        <HeaderSocials />
        {children}
      </body>
    </html>
  );
}
