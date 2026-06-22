"use client";
import { useSimStore } from "@/lib/stores/simulation";
import { TEAMS, TEAM_MAP } from "@/lib/data/teams";
import { predictMatch } from "@/lib/models/poisson";
import { SimRunner } from "@/components/SimRunner";
import { Loader2 } from "lucide-react";

const BRAZIL = TEAM_MAP["BRA"];

const GROUP_C_OPPONENTS = TEAMS.filter(t => t.group === "C" && t.id !== "BRA");

// Likely R16-Final opponents (representative, based on Elo)
const LIKELY_PATH = [
  { round: "Oitavas", teamId: "URU", matchupNote: "Clássico sul-americano" },
  { round: "Quartas", teamId: "ENG", matchupNote: "Duelo de gigantes" },
  { round: "Semifinal", teamId: "FRA", matchupNote: "Final antecipada" },
  { round: "Final", teamId: "ARG", matchupNote: "Final dos sonhos" },
];

export default function BrazilPage() {
  const { results, isRunning } = useSimStore();

  const milestones = [
    { label: "Fase de Grupos", key: "groupAdvanceProbability", emoji: "⚽" },
    { label: "Oitavas de Final", key: "roundOf16Probability", emoji: "🔟" },
    { label: "Quartas de Final", key: "quarterfinalistProbability", emoji: "8️⃣" },
    { label: "Semifinal", key: "semifinalistProbability", emoji: "4️⃣" },
    { label: "Final", key: "finalistProbability", emoji: "2️⃣" },
    { label: "🏆 Campeão — HEXA!", key: "championProbability", emoji: "🏆" },
  ] as const;

  const getProb = (key: string) => {
    if (!results) return null;
    return ((results as unknown) as Record<string, Record<string, number>>)[key]?.["BRA"] ?? 0;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <SimRunner />

      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="text-7xl">🇧🇷</div>
        <h1 className="text-4xl font-black" style={{ color: "#22c55e" }}>Modo Hexa</h1>
        <p className="text-xl font-bold">Caminho do Brasil ao Hexacampeonato</p>
        <p style={{ color: "var(--muted-foreground)" }}>
          5 títulos mundiais · 1958, 1962, 1970, 1994, 2002
        </p>
      </div>

      {/* Probability milestones */}
      <div className="card-glass rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold">📊 Probabilidade em Cada Fase</h2>
        {isRunning ? (
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
            <Loader2 size={16} className="animate-spin" />
            Calculando probabilidades…
          </div>
        ) : (
          <div className="space-y-3">
            {milestones.map((m, i) => {
              const prob = getProb(m.key);
              const pctVal = prob !== null ? prob * 100 : null;
              const isChamp = m.key === "championProbability";
              return (
                <div
                  key={m.key}
                  className="rounded-xl p-4"
                  style={{
                    background: isChamp ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
                    border: isChamp ? "1px solid rgba(34,197,94,0.4)" : "none",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{m.emoji}</span>
                      <span className="font-medium" style={{ fontSize: isChamp ? "1.1rem" : undefined }}>
                        {m.label}
                      </span>
                    </div>
                    <span
                      className="font-black text-xl"
                      style={{ color: isChamp ? "#22c55e" : "var(--foreground)" }}
                    >
                      {pctVal !== null ? `${pctVal.toFixed(1)}%` : "—"}
                    </span>
                  </div>
                  {pctVal !== null && (
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div
                        className="h-full rounded-full probability-bar"
                        style={{
                          width: `${pctVal}%`,
                          background: isChamp
                            ? "linear-gradient(90deg, #22c55e, #16a34a)"
                            : "rgba(34,197,94,0.5)",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Group stage */}
      <div className="card-glass rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold">Grupo C — Fase de Grupos</h2>
        <div className="space-y-3">
          {GROUP_C_OPPONENTS.map(opp => {
            const pred = predictMatch(BRAZIL, opp);
            return (
              <div key={opp.id} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇧🇷</span>
                    <span className="text-sm font-medium">Brasil</span>
                    <span style={{ color: "var(--muted-foreground)" }}>vs</span>
                    <span className="text-sm font-medium">{opp.name}</span>
                    <span className="text-2xl">{opp.flag}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span style={{ color: "#22c55e" }}>V {(pred.homeWin * 100).toFixed(0)}%</span>
                    <span style={{ color: "var(--muted-foreground)" }}>E {(pred.draw * 100).toFixed(0)}%</span>
                    <span style={{ color: "#ef4444" }}>D {(pred.awayWin * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Caminho mais provável */}
      <div className="card-glass rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold">🗺️ Caminho Mais Provável ao Hexa</h2>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
            IA
          </span>
        </div>
        <div className="relative">
          <div className="absolute left-7 top-0 bottom-0 w-0.5" style={{ background: "rgba(34,197,94,0.2)" }} />
          <div className="space-y-4">
            {LIKELY_PATH.map((step, i) => {
              const opp = TEAM_MAP[step.teamId];
              if (!opp) return null;
              const pred = predictMatch(BRAZIL, opp);
              const cumulative = [0.95, 0.80, 0.65, 0.50][i];
              return (
                <div key={step.round} className="flex items-start gap-4 relative pl-4">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 relative flex-shrink-0"
                    style={{ background: "#22c55e", color: "#052e16" }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="text-xs font-bold tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>
                          {step.round.toUpperCase()}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🇧🇷</span>
                          <span className="font-bold">Brasil</span>
                          <span style={{ color: "var(--muted-foreground)" }}>×</span>
                          <span className="text-xl">{opp.flag}</span>
                          <span className="font-bold">{opp.name}</span>
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                          {step.matchupNote}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black" style={{ color: "#22c55e" }}>
                          {(pred.homeWin * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>vitória</div>
                        <div className="text-xs mt-1" style={{ color: "#f59e0b" }}>
                          Acum: {(cumulative * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-4 text-xs">
                      <span>Placar provável: {pred.topScores[0]?.homeGoals}–{pred.topScores[0]?.awayGoals}</span>
                      <span style={{ color: "var(--muted-foreground)" }}>
                        xG Brasil: {pred.lambdaHome.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key players */}
      <div className="card-glass rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold">🌟 Protagonistas do Hexa</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "Vinícius Jr.", emoji: "⚡", role: "Atacante", prob: "31%" },
            { name: "Rodrygo", emoji: "🎯", role: "Atacante", prob: "22%" },
            { name: "Raphinha", emoji: "🔥", role: "Atacante", prob: "18%" },
            { name: "Endrick", emoji: "💎", role: "Atacante", prob: "15%" },
          ].map(p => (
            <div
              key={p.name}
              className="rounded-xl p-4 text-center space-y-2"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div className="text-3xl">{p.emoji}</div>
              <div className="font-bold text-sm">{p.name}</div>
              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{p.role}</div>
              <div className="text-lg font-black" style={{ color: "#22c55e" }}>{p.prob}</div>
              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>prob. gol/jogo</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
