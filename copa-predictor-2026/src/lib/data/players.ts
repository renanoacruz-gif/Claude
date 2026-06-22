export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  goals: number;
  assists: number;
  xG: number;
  scoringProbability: number; // per match
  injured: boolean;
  suspended: boolean;
}

export const PLAYERS: Player[] = [
  // Brasil
  { id: "vinicius", name: "Vinícius Jr.", teamId: "BRA", position: "ATA", goals: 0, assists: 0, xG: 0.72, scoringProbability: 0.31, injured: false, suspended: false },
  { id: "rodrygo", name: "Rodrygo", teamId: "BRA", position: "ATA", goals: 0, assists: 0, xG: 0.55, scoringProbability: 0.22, injured: false, suspended: false },
  { id: "raphinha", name: "Raphinha", teamId: "BRA", position: "ATA", goals: 0, assists: 0, xG: 0.48, scoringProbability: 0.18, injured: false, suspended: false },
  { id: "endrick", name: "Endrick", teamId: "BRA", position: "ATA", goals: 0, assists: 0, xG: 0.41, scoringProbability: 0.15, injured: false, suspended: false },

  // Argentina
  { id: "messi", name: "L. Messi", teamId: "ARG", position: "ATA", goals: 0, assists: 0, xG: 0.85, scoringProbability: 0.38, injured: false, suspended: false },
  { id: "lautaro", name: "Lautaro Martínez", teamId: "ARG", position: "ATA", goals: 0, assists: 0, xG: 0.70, scoringProbability: 0.30, injured: false, suspended: false },
  { id: "julianA", name: "J. Álvarez", teamId: "ARG", position: "ATA", goals: 0, assists: 0, xG: 0.55, scoringProbability: 0.22, injured: false, suspended: false },

  // França
  { id: "mbappe", name: "K. Mbappé", teamId: "FRA", position: "ATA", goals: 0, assists: 0, xG: 0.90, scoringProbability: 0.40, injured: false, suspended: false },
  { id: "dembele", name: "O. Dembélé", teamId: "FRA", position: "ATA", goals: 0, assists: 0, xG: 0.52, scoringProbability: 0.20, injured: false, suspended: false },
  { id: "griezmann", name: "A. Griezmann", teamId: "FRA", position: "MEI", goals: 0, assists: 0, xG: 0.48, scoringProbability: 0.18, injured: false, suspended: false },

  // Espanha
  { id: "yamal", name: "Lamine Yamal", teamId: "ESP", position: "ATA", goals: 0, assists: 0, xG: 0.65, scoringProbability: 0.26, injured: false, suspended: false },
  { id: "morata", name: "Álvaro Morata", teamId: "ESP", position: "ATA", goals: 0, assists: 0, xG: 0.60, scoringProbability: 0.24, injured: false, suspended: false },
  { id: "pedri", name: "Pedri", teamId: "ESP", position: "MEI", goals: 0, assists: 0, xG: 0.35, scoringProbability: 0.12, injured: false, suspended: false },

  // Portugal
  { id: "ronaldo", name: "C. Ronaldo", teamId: "POR", position: "ATA", goals: 0, assists: 0, xG: 0.78, scoringProbability: 0.33, injured: false, suspended: false },
  { id: "leao", name: "R. Leão", teamId: "POR", position: "ATA", goals: 0, assists: 0, xG: 0.58, scoringProbability: 0.23, injured: false, suspended: false },
  { id: "bernardo", name: "B. Silva", teamId: "POR", position: "MEI", goals: 0, assists: 0, xG: 0.40, scoringProbability: 0.14, injured: false, suspended: false },

  // Inglaterra
  { id: "saka", name: "B. Saka", teamId: "ENG", position: "ATA", goals: 0, assists: 0, xG: 0.62, scoringProbability: 0.25, injured: false, suspended: false },
  { id: "kane", name: "H. Kane", teamId: "ENG", position: "ATA", goals: 0, assists: 0, xG: 0.82, scoringProbability: 0.36, injured: false, suspended: false },
  { id: "bellingham", name: "J. Bellingham", teamId: "ENG", position: "MEI", goals: 0, assists: 0, xG: 0.50, scoringProbability: 0.20, injured: false, suspended: false },

  // Alemanha
  { id: "havertz", name: "K. Havertz", teamId: "GER", position: "ATA", goals: 0, assists: 0, xG: 0.58, scoringProbability: 0.23, injured: false, suspended: false },
  { id: "musiala", name: "J. Musiala", teamId: "GER", position: "MEI", goals: 0, assists: 0, xG: 0.50, scoringProbability: 0.19, injured: false, suspended: false },

  // Holanda
  { id: "gakpo", name: "C. Gakpo", teamId: "NED", position: "ATA", goals: 0, assists: 0, xG: 0.60, scoringProbability: 0.24, injured: false, suspended: false },

  // Noruega
  { id: "haaland", name: "E. Haaland", teamId: "NOR", position: "ATA", goals: 0, assists: 0, xG: 1.05, scoringProbability: 0.45, injured: false, suspended: false },
];

export const PLAYERS_BY_TEAM: Record<string, Player[]> = {};
for (const p of PLAYERS) {
  if (!PLAYERS_BY_TEAM[p.teamId]) PLAYERS_BY_TEAM[p.teamId] = [];
  PLAYERS_BY_TEAM[p.teamId].push(p);
}
