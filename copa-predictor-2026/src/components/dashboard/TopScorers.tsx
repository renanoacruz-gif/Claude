"use client";
import { PLAYERS } from "@/lib/data/players";
import { TEAM_MAP } from "@/lib/data/teams";

export function TopScorers() {
  const top = PLAYERS.slice().sort((a, b) => b.scoringProbability - a.scoringProbability).slice(0, 8);

  return (
    <div className="card-glass rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-bold">⚡ Probabilidade de Gol por Jogo</h2>
      <div className="space-y-3">
        {top.map((player, i) => {
          const team = TEAM_MAP[player.teamId];
          const pct = (player.scoringProbability * 100).toFixed(0);
          const barW = (player.scoringProbability / 0.45) * 100;
          return (
            <div key={player.id} className="flex items-center gap-3">
              <span className="text-xs w-4 text-center" style={{ color: "var(--muted-foreground)" }}>{i + 1}</span>
              <span className="text-lg">{team?.flag ?? "🏳️"}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{player.name}</span>
                  <span className="text-sm font-bold" style={{ color: "#f59e0b" }}>{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${barW}%`,
                      background: "linear-gradient(90deg, #f59e0b, #d97706)",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
        Baseado em xG histórico, forma recente e modelo Poisson
      </p>
    </div>
  );
}
