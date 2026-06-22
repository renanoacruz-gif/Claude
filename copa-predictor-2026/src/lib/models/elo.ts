/**
 * Elo-based win probability calculation.
 * Uses World Football Elo Ratings formula with 400-point scale.
 */
export function eloWinProbability(eloA: number, eloB: number, homeAdvantage = 0): number {
  const diff = eloA - eloB + homeAdvantage;
  return 1 / (1 + Math.pow(10, -diff / 400));
}

export function eloExpectedGoals(eloA: number, eloB: number, baseRate = 1.3): number {
  const winP = eloWinProbability(eloA, eloB);
  // scale xG by relative strength
  return baseRate * (0.5 + winP);
}
