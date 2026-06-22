"use client";
import { PLAYERS } from "@/lib/data/players";
import { TEAM_MAP, TEAMS } from "@/lib/data/teams";
import { SimRunner } from "@/components/SimRunner";
import { useSimStore } from "@/lib/stores/simulation";

export default function StatsPage() {
  const { results } = useSimStore();

  const topScorers = PLAYERS.slice().sort((a, b) => b.scoringProbability - a.scoringProbability);
  const bestDefences = TEAMS.slice().sort((a, b) => a.avgGoalsAgainst - b.avgGoalsAgainst).slice(0, 10);
  const bestAttacks = TEAMS.slice().sort((a, b) => b.avgGoalsFor - a.avgGoalsFor).slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <SimRunner />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black">📊 Centro de Estatísticas</h1>
        <p style={{ color: "var(--muted-foreground)" }}>Análise completa de ataque, defesa e jogadores</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top scorers */}
        <div className="card-glass rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-lg">⚽ Artilheiros Prováveis</h2>
          <div className="space-y-2">
            {topScorers.slice(0, 10).map((p, i) => {
              const team = TEAM_MAP[p.teamId];
              return (
                <div key={p.id} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-right text-xs" style={{ color: "var(--muted-foreground)" }}>{i + 1}</span>
                  <span>{team?.flag}</span>
                  <span className="flex-1 truncate">{p.name}</span>
                  <span className="font-bold" style={{ color: "#f59e0b" }}>
                    {(p.scoringProbability * 100).toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best attacks */}
        <div className="card-glass rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-lg">🔥 Melhores Ataques</h2>
          <div className="space-y-2">
            {bestAttacks.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3 text-sm">
                <span className="w-5 text-right text-xs" style={{ color: "var(--muted-foreground)" }}>{i + 1}</span>
                <span>{t.flag}</span>
                <span className="flex-1">{t.shortName}</span>
                <div className="w-24 text-right">
                  <span className="font-bold" style={{ color: "#ef4444" }}>{t.avgGoalsFor.toFixed(1)}</span>
                  <span className="text-xs ml-1" style={{ color: "var(--muted-foreground)" }}>gl/j</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best defences */}
        <div className="card-glass rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-lg">🛡️ Melhores Defesas</h2>
          <div className="space-y-2">
            {bestDefences.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3 text-sm">
                <span className="w-5 text-right text-xs" style={{ color: "var(--muted-foreground)" }}>{i + 1}</span>
                <span>{t.flag}</span>
                <span className="flex-1">{t.shortName}</span>
                <div className="w-24 text-right">
                  <span className="font-bold" style={{ color: "#22c55e" }}>{t.avgGoalsAgainst.toFixed(1)}</span>
                  <span className="text-xs ml-1" style={{ color: "var(--muted-foreground)" }}>sof/j</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* xG leaders */}
        <div className="card-glass rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-lg">📈 Líderes em xG</h2>
          <div className="space-y-2">
            {PLAYERS.slice().sort((a, b) => b.xG - a.xG).slice(0, 10).map((p, i) => {
              const team = TEAM_MAP[p.teamId];
              return (
                <div key={p.id} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-right text-xs" style={{ color: "var(--muted-foreground)" }}>{i + 1}</span>
                  <span>{team?.flag}</span>
                  <span className="flex-1 truncate">{p.name}</span>
                  <span className="font-bold" style={{ color: "#3b82f6" }}>{p.xG.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tournament favorites */}
        {results && (
          <div className="card-glass rounded-xl p-6 space-y-4">
            <h2 className="font-bold text-lg">🏆 Probabilidade de Título</h2>
            <div className="space-y-2">
              {TEAMS.slice().sort((a, b) =>
                (results.championProbability[b.id] ?? 0) - (results.championProbability[a.id] ?? 0)
              ).slice(0, 10).map((t, i) => {
                const prob = results.championProbability[t.id] ?? 0;
                return (
                  <div key={t.id} className="flex items-center gap-3 text-sm">
                    <span className="w-5 text-right text-xs" style={{ color: "var(--muted-foreground)" }}>{i + 1}</span>
                    <span>{t.flag}</span>
                    <span className="flex-1">{t.shortName}</span>
                    <span className="font-bold" style={{ color: "#22c55e" }}>{(prob * 100).toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Team form */}
        <div className="card-glass rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-lg">⚡ Melhor Forma Recente</h2>
          <div className="space-y-2">
            {TEAMS.slice().sort((a, b) => b.recentForm - a.recentForm).slice(0, 10).map((t, i) => (
              <div key={t.id} className="flex items-center gap-3 text-sm">
                <span className="w-5 text-right text-xs" style={{ color: "var(--muted-foreground)" }}>{i + 1}</span>
                <span>{t.flag}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span>{t.shortName}</span>
                    <span className="font-bold">{(t.recentForm * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ width: `${t.recentForm * 100}%`, height: "100%", background: "#22c55e", borderRadius: "9999px" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All 48 teams Elo table */}
      <div className="card-glass rounded-xl overflow-hidden">
        <div className="px-6 py-4 font-bold" style={{ borderBottom: "1px solid var(--border)" }}>
          📋 Ranking Completo — 48 Seleções
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs" style={{ color: "var(--muted-foreground)", borderBottom: "1px solid var(--border)" }}>
                <th className="text-left px-4 py-3">Pos</th>
                <th className="text-left px-4 py-3">Seleção</th>
                <th className="text-right px-4 py-3">Grupo</th>
                <th className="text-right px-4 py-3">Elo</th>
                <th className="text-right px-4 py-3">FIFA</th>
                <th className="text-right px-4 py-3">GL/J</th>
                <th className="text-right px-4 py-3">GS/J</th>
                <th className="text-right px-4 py-3">Forma</th>
                {results && <th className="text-right px-4 py-3">Campeão</th>}
              </tr>
            </thead>
            <tbody>
              {TEAMS.slice().sort((a, b) => b.eloRating - a.eloRating).map((t, i) => (
                <tr
                  key={t.id}
                  className="text-sm"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                >
                  <td className="px-4 py-2.5" style={{ color: "var(--muted-foreground)" }}>{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span>{t.flag}</span>
                      <span className="font-medium">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right">{t.group}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{t.eloRating}</td>
                  <td className="px-4 py-2.5 text-right">#{t.fifaRanking}</td>
                  <td className="px-4 py-2.5 text-right">{t.avgGoalsFor.toFixed(1)}</td>
                  <td className="px-4 py-2.5 text-right">{t.avgGoalsAgainst.toFixed(1)}</td>
                  <td className="px-4 py-2.5 text-right">{(t.recentForm * 100).toFixed(0)}%</td>
                  {results && (
                    <td className="px-4 py-2.5 text-right font-bold" style={{ color: "#22c55e" }}>
                      {((results.championProbability[t.id] ?? 0) * 100).toFixed(1)}%
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
