import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsappFloat } from "@/components/WhatsappFloat";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGRO TRADES, LDA — Soberania começa no prato",
  description:
    "Empresa moçambicana dedicada à produção agrícola em Nampula. Arroz, cereais, mecanização agrícola, preparação de terras e processamento industrial.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <WhatsappFloat />
      </body>
    </html>
  );
}
