"use client";
import { useState } from "react";
import { TEAMS, TEAM_MAP, Team } from "@/lib/data/teams";
import { predictMatch, MatchPrediction } from "@/lib/models/poisson";
import { PLAYERS_BY_TEAM } from "@/lib/data/players";
import { SimRunner } from "@/components/SimRunner";

export default function SimulatorPage() {
  const [homeId, setHomeId] = useState("BRA");
  const [awayId, setAwayId] = useState("ARG");

  const home = TEAM_MAP[homeId];
  const away = TEAM_MAP[awayId];
  const pred = home && away ? predictMatch(home, away) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <SimRunner />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black">⚽ Simulador de Partida</h1>
        <p style={{ color: "var(--muted-foreground)" }}>
          Modelo Poisson + Elo + Forma Recente
        </p>
      </div>

      {/* Team selectors */}
      <div className="card-glass rounded-xl p-6">
        <div className="grid grid-cols-3 gap-4 items-center">
          <TeamSelector label="Time da Casa" value={homeId} onChange={setHomeId} exclude={awayId} />
          <div className="text-center text-2xl font-black" style={{ color: "var(--muted-foreground)" }}>VS</div>
          <TeamSelector label="Time Visitante" value={awayId} onChange={setAwayId} exclude={homeId} />
        </div>
      </div>

      {pred && home && away && (
        <>
          <WinProbCard home={home} away={away} pred={pred} />
          <TopScoresCard pred={pred} home={home} away={away} />
          <GoalScorerCard homeId={homeId} awayId={awayId} />
          <TeamStatsCard home={home} away={away} />
        </>
      )}
    </div>
  );
}

function TeamSelector({ label, value, onChange, exclude }: {
  label: string; value: string; onChange: (v: string) => void; exclude: string;
}) {
  const team = TEAM_MAP[value];
  return (
    <div className="space-y-2 text-center">
      <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{label}</p>
      <div className="text-4xl">{team?.flag}</div>
      <div className="text-sm font-bold">{team?.name}</div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-xs rounded-lg px-3 py-2 outline-none"
        style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
      >
        {TEAMS.filter(t => t.id !== exclude).map(t => (
          <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
        ))}
      </select>
    </div>
  );
}

function WinProbCard({ home, away, pred }: { home: Team; away: Team; pred: MatchPrediction }) {
  const outcomes = [
    { label: home.shortName, flag: home.flag, prob: pred.homeWin, color: "#22c55e" },
    { label: "Empate", flag: "🤝", prob: pred.draw, color: "#94a3b8" },
    { label: away.shortName, flag: away.flag, prob: pred.awayWin, color: "#3b82f6" },
  ];
  const top = [...outcomes].sort((a, b) => b.prob - a.prob)[0];

  return (
    <div className="card-glass rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-bold text-center">Probabilidade de Resultado</h2>
      <div className="grid grid-cols-3 gap-4">
        {outcomes.map(o => (
          <div
            key={o.label}
            className="text-center space-y-2 rounded-xl p-4 transition-all"
            style={{
              background: o === top ? `${o.color}20` : "rgba(255,255,255,0.04)",
              border: o === top ? `1px solid ${o.color}40` : "1px solid transparent",
            }}
          >
            <div className="text-3xl">{o.flag}</div>
            <div className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>{o.label}</div>
            <div className="text-3xl font-black" style={{ color: o.color }}>
              {(o.prob * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
      {/* Bar */}
      <div className="h-3 rounded-full overflow-hidden flex">
        <div style={{ width: `${pred.homeWin * 100}%`, background: "#22c55e" }} />
        <div style={{ width: `${pred.draw * 100}%`, background: "#475569" }} />
        <div style={{ width: `${pred.awayWin * 100}%`, background: "#3b82f6" }} />
      </div>
      <div className="text-xs text-center" style={{ color: "var(--muted-foreground)" }}>
        xG esperado — {home.shortName}: <strong style={{ color: "#22c55e" }}>{pred.lambdaHome.toFixed(2)}</strong>
        {" · "}
        {away.shortName}: <strong style={{ color: "#3b82f6" }}>{pred.lambdaAway.toFixed(2)}</strong>
      </div>
    </div>
  );
}

function TopScoresCard({ pred, home, away }: { pred: MatchPrediction; home: Team; away: Team }) {
  return (
    <div className="card-glass rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-bold">Placares Mais Prováveis</h2>
      <div className="grid grid-cols-3 gap-3">
        {pred.topScores.slice(0, 6).map((s, i) => (
          <div
            key={`${s.homeGoals}-${s.awayGoals}`}
            className="rounded-xl p-4 text-center space-y-1"
            style={{ background: i === 0 ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)", border: i === 0 ? "1px solid rgba(34,197,94,0.3)" : "none" }}
          >
            <div className="text-xl font-black">
              {s.homeGoals} – {s.awayGoals}
            </div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {home.shortName} vs {away.shortName}
            </div>
            <div className="text-sm font-bold" style={{ color: i === 0 ? "#22c55e" : "var(--foreground)" }}>
              {(s.probability * 100).toFixed(1)}%
            </div>
            {i === 0 && <div className="text-xs" style={{ color: "#22c55e" }}>Mais provável</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalScorerCard({ homeId, awayId }: { homeId: string; awayId: string }) {
  const players = [
    ...(PLAYERS_BY_TEAM[homeId] ?? []),
    ...(PLAYERS_BY_TEAM[awayId] ?? []),
  ].sort((a, b) => b.scoringProbability - a.scoringProbability);

  if (!players.length) return null;

  return (
    <div className="card-glass rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-bold">⚡ Probabilidade de Marcar</h2>
      <div className="space-y-3">
        {players.map((p, i) => {
          const isHome = p.teamId === homeId;
          const team = TEAM_MAP[p.teamId];
          const pct = (p.scoringProbability * 100).toFixed(0);
          return (
            <div key={p.id} className="flex items-center gap-3">
              <span className="text-sm">{team?.flag}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{p.name}</span>
                  <span className="text-sm font-bold" style={{ color: "#f59e0b" }}>{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(p.scoringProbability / 0.45) * 100}%`,
                      background: isHome ? "#22c55e" : "#3b82f6",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TeamStatsCard({ home, away }: { home: Team; away: Team }) {
  const stats = [
    { label: "Elo Rating", home: home.eloRating, away: away.eloRating, format: (v: number) => v.toString() },
    { label: "Ranking FIFA", home: home.fifaRanking, away: away.fifaRanking, format: (v: number) => `#${v}`, lower: true },
    { label: "Gols/Jogo", home: home.avgGoalsFor, away: away.avgGoalsFor, format: (v: number) => v.toFixed(1) },
    { label: "Gols Sofridos/Jogo", home: home.avgGoalsAgainst, away: away.avgGoalsAgainst, format: (v: number) => v.toFixed(1), lower: true },
    { label: "Forma Recente", home: home.recentForm * 100, away: away.recentForm * 100, format: (v: number) => `${v.toFixed(0)}%` },
    { label: "Títulos Mundiais", home: home.worldCupTitles, away: away.worldCupTitles, format: (v: number) => v.toString() },
  ];

  return (
    <div className="card-glass rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-bold">📊 Comparativo de Seleções</h2>
      <div className="space-y-4">
        {stats.map(s => {
          const homeWins = s.lower ? s.home < s.away : s.home > s.away;
          const awayWins = s.lower ? s.away < s.home : s.away > s.home;
          return (
            <div key={s.label}>
              <div className="flex justify-between mb-1.5 text-sm">
                <span className="font-bold" style={{ color: homeWins ? "#22c55e" : "var(--foreground)" }}>
                  {s.format(s.home)}
                </span>
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s.label}</span>
                <span className="font-bold" style={{ color: awayWins ? "#3b82f6" : "var(--foreground)" }}>
                  {s.format(s.away)}
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden flex" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div style={{ flex: s.home, background: "#22c55e", opacity: 0.6 }} />
                <div style={{ flex: s.away, background: "#3b82f6", opacity: 0.6 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
