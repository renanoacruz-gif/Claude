import { Team, TEAMS } from "@/lib/data/teams";
import { predictMatch } from "./poisson";

export interface TournamentResult {
  champion: string;
  finalist: string;
  semifinalists: string[];
  quarterfinalists: string[];
  roundOf16: string[];
  groupAdvancers: string[];
}

export interface SimulationResults {
  championProbability: Record<string, number>;
  finalistProbability: Record<string, number>;
  semifinalistProbability: Record<string, number>;
  quarterfinalistProbability: Record<string, number>;
  roundOf16Probability: Record<string, number>;
  groupAdvanceProbability: Record<string, number>;
  totalSimulations: number;
}

function sampleScore(lambdaHome: number, lambdaAway: number): [number, number] {
  // Poisson random variate (Knuth algorithm)
  const poissonSample = (lambda: number): number => {
    const L = Math.exp(-lambda);
    let k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
  };
  return [poissonSample(lambdaHome), poissonSample(lambdaAway)];
}

function pickWinner(teamA: Team, teamB: Team): string {
  const pred = predictMatch(teamA, teamB);
  const [hg, ag] = sampleScore(pred.lambdaHome, pred.lambdaAway);
  if (hg > ag) return teamA.id;
  if (ag > hg) return teamB.id;
  // penalty shootout: slight home/Elo edge
  return Math.random() < pred.homeWin / (pred.homeWin + pred.awayWin)
    ? teamA.id : teamB.id;
}

function simulateGroups(teams: Team[]): Record<string, string[]> {
  const groups: Record<string, Team[]> = {};
  for (const t of teams) {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push(t);
  }

  const advancers: Record<string, string[]> = {};
  for (const [group, groupTeams] of Object.entries(groups)) {
    const points: Record<string, number> = {};
    const gd: Record<string, number> = {};
    for (const t of groupTeams) { points[t.id] = 0; gd[t.id] = 0; }

    // Round-robin
    for (let i = 0; i < groupTeams.length; i++) {
      for (let j = i + 1; j < groupTeams.length; j++) {
        const pred = predictMatch(groupTeams[i], groupTeams[j]);
        const [hg, ag] = sampleScore(pred.lambdaHome, pred.lambdaAway);
        gd[groupTeams[i].id] += hg - ag;
        gd[groupTeams[j].id] += ag - hg;
        if (hg > ag) points[groupTeams[i].id] += 3;
        else if (hg === ag) { points[groupTeams[i].id]++; points[groupTeams[j].id]++; }
        else points[groupTeams[j].id] += 3;
      }
    }

    const sorted = groupTeams.slice().sort((a, b) => {
      const pd = points[b.id] - points[a.id];
      return pd !== 0 ? pd : gd[b.id] - gd[a.id];
    });

    advancers[group] = [sorted[0].id, sorted[1].id];
  }
  return advancers;
}

export function runSimulations(
  teams: Team[],
  n = 10000,
  onProgress?: (pct: number) => void
): SimulationResults {
  const teamMap = Object.fromEntries(teams.map(t => [t.id, t]));
  const results: SimulationResults = {
    championProbability: {},
    finalistProbability: {},
    semifinalistProbability: {},
    quarterfinalistProbability: {},
    roundOf16Probability: {},
    groupAdvanceProbability: {},
    totalSimulations: n,
  };

  for (const t of teams) {
    results.championProbability[t.id] = 0;
    results.finalistProbability[t.id] = 0;
    results.semifinalistProbability[t.id] = 0;
    results.quarterfinalistProbability[t.id] = 0;
    results.roundOf16Probability[t.id] = 0;
    results.groupAdvanceProbability[t.id] = 0;
  }

  const groups = Object.keys(
    teams.reduce((acc, t) => ({ ...acc, [t.group]: true }), {} as Record<string, boolean>)
  ).sort();

  for (let sim = 0; sim < n; sim++) {
    if (onProgress && sim % 1000 === 0) onProgress(sim / n);

    // Simulate group stage
    const advancers = simulateGroups(teams);
    const allAdvancers: string[] = [];
    for (const g of groups) {
      const [first, second] = advancers[g] ?? [];
      if (first) allAdvancers.push(first);
      if (second) allAdvancers.push(second);
      if (first) results.groupAdvanceProbability[first]++;
      if (second) results.groupAdvanceProbability[second]++;
    }

    // 32 teams in R16 (12 groups × 2 = 24 + 8 best 3rd place — simplified to top 2 per group here)
    // For 48-team tournament we have 12 groups; top 2 + 8 best 3rd = 32 teams
    // Simplified: use top 2 from each group (24 teams) for R16 bracket seeding
    const r16 = allAdvancers.slice(0, 16);
    for (const id of r16) results.roundOf16Probability[id]++;

    // Knockout rounds
    let bracket = r16;
    const rounds = ["quarterfinalists", "semifinalists", "finalists"] as const;
    const resultKeys = [
      results.quarterfinalistProbability,
      results.semifinalistProbability,
      results.finalistProbability,
    ];

    for (let round = 0; round < 4; round++) {
      const nextRound: string[] = [];
      for (let i = 0; i < bracket.length; i += 2) {
        const a = teamMap[bracket[i]];
        const b = teamMap[bracket[i + 1]];
        if (a && b) {
          const winner = pickWinner(a, b);
          nextRound.push(winner);
          if (round < 3 && resultKeys[round]) {
            resultKeys[round][winner] = (resultKeys[round][winner] ?? 0) + 1;
          }
        }
      }
      bracket = nextRound;
    }

    if (bracket[0]) results.championProbability[bracket[0]]++;
  }

  // Normalize
  for (const key of Object.keys(results) as (keyof SimulationResults)[]) {
    if (key === "totalSimulations") continue;
    const obj = results[key] as Record<string, number>;
    for (const id of Object.keys(obj)) {
      obj[id] = obj[id] / n;
    }
  }

  return results;
}
