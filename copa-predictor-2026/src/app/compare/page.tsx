"use client";
import { useState } from "react";
import { TEAMS, TEAM_MAP, Team } from "@/lib/data/teams";
import { predictMatch } from "@/lib/models/poisson";
import { SimRunner } from "@/components/SimRunner";

export default function ComparePage() {
  const [aId, setAId] = useState("BRA");
  const [bId, setBId] = useState("FRA");

  const teamA = TEAM_MAP[aId];
  const teamB = TEAM_MAP[bId];
  const pred = teamA && teamB ? predictMatch(teamA, teamB) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <SimRunner />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black">⚔️ Comparador de Seleções</h1>
        <p style={{ color: "var(--muted-foreground)" }}>Compare estatísticas e probabilidades head-to-head</p>
      </div>

      {/* Selectors */}
      <div className="card-glass rounded-xl p-6">
        <div className="grid grid-cols-3 gap-6 items-center">
          <div className="space-y-3 text-center">
            <div className="text-5xl">{teamA?.flag}</div>
            <select
              value={aId}
              onChange={e => setAId(e.target.value)}
              className="w-full text-sm rounded-lg px-3 py-2"
              style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              {TEAMS.filter(t => t.id !== bId).map(t => (
                <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
              ))}
            </select>
          </div>

          {pred && (
            <div className="text-center space-y-2">
              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>PROBABILIDADE</div>
              <div className="space-y-1">
                <div className="text-2xl font-black" style={{ color: "#22c55e" }}>
                  {(pred.homeWin * 100).toFixed(1)}%
                </div>
                <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  Empate {(pred.draw * 100).toFixed(1)}%
                </div>
                <div className="text-2xl font-black" style={{ color: "#3b82f6" }}>
                  {(pred.awayWin * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 text-center">
            <div className="text-5xl">{teamB?.flag}</div>
            <select
              value={bId}
              onChange={e => setBId(e.target.value)}
              className="w-full text-sm rounded-lg px-3 py-2"
              style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              {TEAMS.filter(t => t.id !== aId).map(t => (
                <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats comparison */}
      {teamA && teamB && (
        <StatsGrid teamA={teamA} teamB={teamB} />
      )}
    </div>
  );
}

function StatsGrid({ teamA, teamB }: { teamA: Team; teamB: Team }) {
  const rows = [
    { label: "Elo Rating", a: teamA.eloRating, b: teamB.eloRating, format: (v: number) => v.toString() },
    { label: "Ranking FIFA", a: teamA.fifaRanking, b: teamB.fifaRanking, format: (v: number) => `#${v}`, lower: true },
    { label: "Gols Marcados/Jogo", a: teamA.avgGoalsFor, b: teamB.avgGoalsFor, format: (v: number) => v.toFixed(2) },
    { label: "Gols Sofridos/Jogo", a: teamA.avgGoalsAgainst, b: teamB.avgGoalsAgainst, format: (v: number) => v.toFixed(2), lower: true },
    { label: "Forma Recente", a: teamA.recentForm * 100, b: teamB.recentForm * 100, format: (v: number) => `${v.toFixed(0)}%` },
    { label: "Títulos Mundiais", a: teamA.worldCupTitles, b: teamB.worldCupTitles, format: (v: number) => v.toString() },
    { label: "Continente", a: -1, b: -1, format: () => "", labelA: teamA.continent, labelB: teamB.continent, noBar: true },
  ];

  return (
    <div className="card-glass rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 font-bold">
          <span className="text-2xl">{teamA.flag}</span>
          <span>{teamA.name}</span>
        </div>
        <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>vs</span>
        <div className="flex items-center gap-2 font-bold">
          <span>{teamB.name}</span>
          <span className="text-2xl">{teamB.flag}</span>
        </div>
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        {rows.map(row => {
          const aWins = row.lower ? row.a < row.b : row.a > row.b;
          const bWins = row.lower ? row.b < row.a : row.b > row.a;
          const total = row.a + row.b || 1;
          return (
            <div key={row.label} className="px-6 py-4">
              <div className="text-xs font-medium text-center mb-3" style={{ color: "var(--muted-foreground)" }}>
                {row.label}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right w-24">
                  <span className={`font-bold text-lg ${aWins ? "text-green-400" : ""}`}>
                    {(row as any).labelA ?? row.format(row.a)}
                  </span>
                </div>
                {!(row as any).noBar && (
                  <div className="flex-1 h-2 rounded-full overflow-hidden flex" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div style={{
                      flex: row.a,
                      background: aWins ? "#22c55e" : "#475569",
                      opacity: 0.7,
                    }} />
                    <div style={{
                      flex: row.b,
                      background: bWins ? "#3b82f6" : "#475569",
                      opacity: 0.7,
                    }} />
                  </div>
                )}
                {(row as any).noBar && <div className="flex-1" />}
                <div className="w-24">
                  <span className={`font-bold text-lg ${bWins ? "text-blue-400" : ""}`}>
                    {(row as any).labelB ?? row.format(row.b)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
