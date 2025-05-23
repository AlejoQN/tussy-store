import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/context/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tussy Store",
  description: "Tienda online de ropa y accesorios - Tussy Store",
  keywords: [
    "Tussy Store",
    "e-commerce",
    "ropa",
    "accesorios",
    "moda",
    "compras online",
    "tienda virtual",
  ],
  authors: [{ name: "Equipo Tussy Store" }],
  openGraph: {
    title: "Tussy Store",
    description: "Tienda online de ropa y accesorios",
    url: "https://tussystore.com",
    siteName: "Tussy Store",
    type: "website",
  },
  themeColor: "#E11D48",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.variable + " antialiased bg-background text-foreground"}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
