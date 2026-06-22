"use client";
import { useSimStore } from "@/lib/stores/simulation";
import { TEAMS, TEAM_MAP, getTeamsByGroup, Team } from "@/lib/data/teams";
import { SimulationResults } from "@/lib/models/montecarlo";
import { SimRunner } from "@/components/SimRunner";

export default function BracketPage() {
  const { results } = useSimStore();
  const groups = getTeamsByGroup();
  const groupKeys = Object.keys(groups).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <SimRunner />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black">🗓️ Chaveamento Copa 2026</h1>
        <p style={{ color: "var(--muted-foreground)" }}>
          Probabilidades baseadas em {results?.totalSimulations.toLocaleString() ?? "…"} simulações Monte Carlo
        </p>
      </div>

      {/* Group stage */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Fase de Grupos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {groupKeys.map(g => (
            <GroupTable key={g} group={g} teams={groups[g]} results={results} />
          ))}
        </div>
      </section>

      {/* Knockout bracket */}
      {results && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Mata-Mata — Probabilidade de Avanço</h2>
          <KnockoutBracket results={results} />
        </section>
      )}
    </div>
  );
}

function GroupTable({ group, teams, results }: {
  group: string;
  teams: Team[];
  results: SimulationResults | null;
}) {
  const sorted = teams.slice().sort((a, b) => {
    const pa = results?.groupAdvanceProbability[a.id] ?? a.eloRating;
    const pb = results?.groupAdvanceProbability[b.id] ?? b.eloRating;
    return pb - pa;
  });

  return (
    <div className="card-glass rounded-xl overflow-hidden">
      <div className="px-4 py-3 font-bold text-sm" style={{ background: "rgba(34,197,94,0.1)", borderBottom: "1px solid var(--border)" }}>
        Grupo {group}
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-xs" style={{ color: "var(--muted-foreground)", borderBottom: "1px solid var(--border)" }}>
            <th className="text-left px-4 py-2">Seleção</th>
            <th className="text-right px-4 py-2">Class.</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, i) => {
            const adv = results?.groupAdvanceProbability[t.id];
            return (
              <tr
                key={t.id}
                style={{
                  borderBottom: i < sorted.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  opacity: i >= 2 ? 0.6 : 1,
                }}
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span>{t.flag}</span>
                    <span className="text-sm font-medium">{t.shortName}</span>
                    {i < 2 && (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                        2
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right text-sm font-bold" style={{ color: i < 2 ? "#22c55e" : "var(--muted-foreground)" }}>
                  {adv !== undefined ? `${(adv * 100).toFixed(0)}%` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function KnockoutBracket({ results }: { results: import("@/lib/models/montecarlo").SimulationResults }) {
  const rounds = [
    { label: "Oitavas", key: "roundOf16Probability" as const, top: 16 },
    { label: "Quartas", key: "quarterfinalistProbability" as const, top: 8 },
    { label: "Semifinal", key: "semifinalistProbability" as const, top: 4 },
    { label: "Final", key: "finalistProbability" as const, top: 2 },
    { label: "Campeão", key: "championProbability" as const, top: 1 },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-w-max pb-4">
        {rounds.map(round => {
          const probs = results[round.key] as Record<string, number>;
          const sorted = TEAMS.slice()
            .sort((a, b) => (probs[b.id] ?? 0) - (probs[a.id] ?? 0))
            .slice(0, round.top);

          return (
            <div key={round.key} className="w-52 space-y-2">
              <h3 className="text-xs font-bold tracking-wider text-center px-3 py-1.5 rounded-full"
                style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
                {round.label}
              </h3>
              <div className="space-y-1.5">
                {sorted.map((t, i) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{
                      background: i === 0 && round.key === "championProbability"
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(255,255,255,0.04)",
                      border: i === 0 && round.key === "championProbability"
                        ? "1px solid rgba(34,197,94,0.3)"
                        : "none",
                    }}
                  >
                    <span className="text-base">{t.flag}</span>
                    <span className="text-xs font-medium flex-1">{t.shortName}</span>
                    <span className="text-xs font-bold" style={{ color: "#22c55e" }}>
                      {((probs[t.id] ?? 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
