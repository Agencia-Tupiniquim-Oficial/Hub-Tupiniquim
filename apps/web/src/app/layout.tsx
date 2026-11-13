import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hub Tupiniquim",
  description: "Plataforma interna de análise e gestão de campanhas da Agência Tupiniquim.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
