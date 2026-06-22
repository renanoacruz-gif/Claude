"use client";
import { useSimStore } from "@/lib/stores/simulation";
import { SimRunner } from "@/components/SimRunner";
import { FavoritesPanel } from "@/components/dashboard/FavoritesPanel";
import { GroupsOverview } from "@/components/dashboard/GroupsOverview";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { TopScorers } from "@/components/dashboard/TopScorers";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { results, isRunning, progress } = useSimStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <SimRunner />

      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-black gradient-text">Copa Predictor 2026</h1>
        <p style={{ color: "var(--muted-foreground)" }} className="text-lg">
          Simulações Monte Carlo · Elo Rating · Distribuição de Poisson · xG
        </p>
        {isRunning && (
          <div className="flex items-center justify-center gap-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
            <Loader2 size={16} className="animate-spin text-green-400" />
            <span>Executando {(10000).toLocaleString()} simulações… {Math.round(progress * 100)}%</span>
            <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress * 100}%`, background: "var(--primary)" }}
              />
            </div>
          </div>
        )}
        {results && (
          <p className="text-xs text-green-400">
            ✓ {results.totalSimulations.toLocaleString()} simulações concluídas
          </p>
        )}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FavoritesPanel />
        </div>
        <div>
          <InsightsPanel />
        </div>
      </div>

      <GroupsOverview />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopScorers />
        <TournamentInfo />
      </div>
    </div>
  );
}

function TournamentInfo() {
  return (
    <div className="card-glass rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-bold">Torneio</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Seleções", value: "48" },
          { label: "Grupos", value: "12" },
          { label: "Partidas", value: "104" },
          { label: "Países-sede", value: "3" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg p-3 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="text-2xl font-black text-green-400">{value}</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>{label}</div>
          </div>
        ))}
      </div>
      <div className="text-xs space-y-1 pt-2" style={{ color: "var(--muted-foreground)", borderTop: "1px solid var(--border)" }}>
        <p className="pt-2">📍 EUA, Canadá e México — 11 jun a 19 jul 2026</p>
        <p>🏟️ 16 estádios · 3 países-sede</p>
        <p>🌍 6 confederações representadas</p>
        <p>🥅 48 seleções · formato inédito</p>
      </div>
    </div>
  );
}
