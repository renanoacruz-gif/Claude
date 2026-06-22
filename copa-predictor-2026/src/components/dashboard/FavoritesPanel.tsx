"use client";
import { useSimStore } from "@/lib/stores/simulation";
import { TEAMS } from "@/lib/data/teams";

export function FavoritesPanel() {
  const { results } = useSimStore();

  const ranked = TEAMS.slice()
    .sort((a, b) => {
      const pa = results?.championProbability[a.id] ?? 0;
      const pb = results?.championProbability[b.id] ?? 0;
      return pb - pa;
    })
    .slice(0, 10);

  const maxProb = results?.championProbability[ranked[0]?.id] ?? 0.25;

  return (
    <div className="card-glass rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">🏆 Favoritos ao Título</h2>
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
          Monte Carlo
        </span>
      </div>
      <div className="space-y-3">
        {ranked.map((team, i) => {
          const prob = results?.championProbability[team.id] ?? 0;
          const pct = (prob * 100).toFixed(1);
          const barW = maxProb > 0 ? (prob / maxProb) * 100 : 0;
          return (
            <div key={team.id} className="flex items-center gap-3">
              <span className="text-xs w-4 text-center" style={{ color: "var(--muted-foreground)" }}>
                {i + 1}
              </span>
              <span className="text-xl w-8 text-center">{team.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{team.shortName}</span>
                  <span className="text-sm font-bold" style={{ color: i === 0 ? "#22c55e" : "inherit" }}>
                    {results ? `${pct}%` : "—"}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full probability-bar"
                    style={{
                      width: results ? `${barW}%` : "0%",
                      background: i === 0
                        ? "linear-gradient(90deg, #22c55e, #16a34a)"
                        : i < 3
                        ? "linear-gradient(90deg, #3b82f6, #2563eb)"
                        : "rgba(255,255,255,0.3)",
                    }}
                  />
                </div>
              </div>
              <span className="text-xs w-8 text-right" style={{ color: "var(--muted-foreground)" }}>
                #{team.fifaRanking}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
