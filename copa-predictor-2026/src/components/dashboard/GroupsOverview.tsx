"use client";
import { getTeamsByGroup, Team } from "@/lib/data/teams";
import { useSimStore } from "@/lib/stores/simulation";
import { SimulationResults } from "@/lib/models/montecarlo";

export function GroupsOverview() {
  const { results } = useSimStore();
  const groups = getTeamsByGroup();
  const groupKeys = Object.keys(groups).sort();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">⚽ Fase de Grupos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {groupKeys.map((g) => (
          <GroupCard key={g} group={g} teams={groups[g]} results={results} />
        ))}
      </div>
    </div>
  );
}

function GroupCard({ group, teams, results }: {
  group: string;
  teams: Team[];
  results: SimulationResults | null;
}) {
  const sorted = teams.slice().sort((a, b) => {
    const pa = results?.groupAdvanceProbability[a.id] ?? a.eloRating / 2200;
    const pb = results?.groupAdvanceProbability[b.id] ?? b.eloRating / 2200;
    return pb - pa;
  });

  return (
    <div className="card-glass rounded-xl p-4 space-y-3">
      <div className="text-xs font-bold tracking-wider" style={{ color: "var(--muted-foreground)" }}>
        GRUPO {group}
      </div>
      <ul className="space-y-2">
        {sorted.map((team, i) => {
          const advP = results?.groupAdvanceProbability[team.id];
          return (
            <li key={team.id} className="flex items-center gap-2">
              <span className="text-lg">{team.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{team.shortName}</div>
                {advP !== undefined && (
                  <div className="text-xs" style={{ color: i < 2 ? "#22c55e" : "var(--muted-foreground)" }}>
                    {(advP * 100).toFixed(0)}% classificar
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
