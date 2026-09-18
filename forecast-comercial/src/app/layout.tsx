import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forecast Comercial",
  description: "Forecast + Pipeline + Reporte Gerencial para Executivos de Soluções e Negócios.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
