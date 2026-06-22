/**
 * Poisson model for football score prediction.
 * Given expected goals for each team, returns a matrix of score probabilities.
 */
import { Team } from "@/lib/data/teams";

export function factorial(n: number): number {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export function poissonPMF(lambda: number, k: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

export interface ScoreProb {
  homeGoals: number;
  awayGoals: number;
  probability: number;
}

export interface MatchPrediction {
  homeWin: number;
  draw: number;
  awayWin: number;
  scores: ScoreProb[];
  topScores: ScoreProb[];
  lambdaHome: number;
  lambdaAway: number;
}

export function predictMatch(home: Team, away: Team): MatchPrediction {
  // Ensemble: Elo strength ratio + historical attack/defence
  const eloRatio = home.eloRating / away.eloRating;
  const attackHome = home.avgGoalsFor * eloRatio * 0.6 + home.avgGoalsFor * 0.4;
  const defenceAway = away.avgGoalsAgainst;
  const attackAway = away.avgGoalsFor / eloRatio * 0.6 + away.avgGoalsFor * 0.4;
  const defenceHome = home.avgGoalsAgainst;

  // Form adjustment
  const formBoost = (home.recentForm - away.recentForm) * 0.15;

  const lambdaHome = Math.max(0.3, attackHome * (defenceAway / 1.2) + formBoost);
  const lambdaAway = Math.max(0.3, attackAway * (defenceHome / 1.2) - formBoost);

  const MAX_GOALS = 7;
  const scores: ScoreProb[] = [];
  let homeWin = 0, draw = 0, awayWin = 0;

  for (let h = 0; h <= MAX_GOALS; h++) {
    for (let a = 0; a <= MAX_GOALS; a++) {
      const p = poissonPMF(lambdaHome, h) * poissonPMF(lambdaAway, a);
      scores.push({ homeGoals: h, awayGoals: a, probability: p });
      if (h > a) homeWin += p;
      else if (h === a) draw += p;
      else awayWin += p;
    }
  }

  const topScores = [...scores]
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 6);

  return { homeWin, draw, awayWin, scores, topScores, lambdaHome, lambdaAway };
}
