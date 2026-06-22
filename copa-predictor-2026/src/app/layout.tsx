import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Copa Predictor 2026 | Simulador Avançado FIFA",
  description: "Simulador estatístico da Copa do Mundo FIFA 2026 com Monte Carlo, Elo Rating e modelos de Poisson",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ background: "var(--background)" }}>
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--muted-foreground)]">
          Copa Predictor 2026 · Modelos: Elo · Poisson · Monte Carlo · xG · Bayesian
        </footer>
      </body>
    </html>
  );
}
