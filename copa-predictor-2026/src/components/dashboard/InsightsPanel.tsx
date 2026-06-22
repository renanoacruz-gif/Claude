"use client";
import { useSimStore } from "@/lib/stores/simulation";
import { TEAMS } from "@/lib/data/teams";

const STATIC_INSIGHTS = [
  "🇧🇷 Brasil tem 5 títulos mundiais — o maior de todos os tempos",
  "⚡ Haaland é o jogador com maior xG da competição: 1.05 por jogo",
  "🛡️ Marrocos tem a melhor defesa do torneio (0.8 gols/jogo sofridos)",
  "📈 Argentina entra como atual campeã e favorita junto a Brasil e França",
  "🌍 48 seleções · formato inédito · 104 partidas na Copa de 2026",
  "🏟️ Nova York/New Jersey será o palco da grande final",
];

export function InsightsPanel() {
  const { results } = useSimStore();

  const insights: string[] = [...STATIC_INSIGHTS];

  if (results) {
    const bra = results.championProbability["BRA"] ?? 0;
    const arg = results.championProbability["ARG"] ?? 0;
    const fra = results.championProbability["FRA"] ?? 0;
    insights.unshift(
      `🤖 Brasil tem ${(bra * 100).toFixed(1)}% de chance de ser campeão`,
      `🤖 Argentina: ${(arg * 100).toFixed(1)}% · França: ${(fra * 100).toFixed(1)}%`,
    );
  }

  return (
    <div className="card-glass rounded-xl p-6 space-y-4 h-full">
      <h2 className="text-lg font-bold">💡 Insights de IA</h2>
      <ul className="space-y-3">
        {insights.slice(0, 7).map((insight, i) => (
          <li
            key={i}
            className="text-sm p-3 rounded-lg leading-relaxed"
            style={{ background: "rgba(255,255,255,0.04)", color: i < 2 && results ? "#22c55e" : "var(--foreground)" }}
          >
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}
