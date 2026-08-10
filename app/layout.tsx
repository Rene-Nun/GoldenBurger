import type { Metadata } from "next";
import { Anton, Karla } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const body = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Golden Burger — La misma esquina de siempre",
  description:
    "Golden Burger, la hamburguesería de barrio de los 2000, reconstruida tal como la recordabas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${display.variable} ${body.variable} bg-cream font-body text-ink antialiased`}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}