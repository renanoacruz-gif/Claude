export interface Team {
  id: string;
  name: string;
  shortName: string;
  flag: string;
  group: string;
  eloRating: number;
  fifaRanking: number;
  avgGoalsFor: number;
  avgGoalsAgainst: number;
  recentForm: number; // 0-1
  worldCupTitles: number;
  continent: string;
  color: string;
}

export const TEAMS: Team[] = [
  // Group A
  { id: "USA", name: "Estados Unidos", shortName: "USA", flag: "🇺🇸", group: "A", eloRating: 1796, fifaRanking: 11, avgGoalsFor: 1.8, avgGoalsAgainst: 1.1, recentForm: 0.62, worldCupTitles: 0, continent: "CONCACAF", color: "#3B82F6" },
  { id: "MEX", name: "México", shortName: "MEX", flag: "🇲🇽", group: "A", eloRating: 1765, fifaRanking: 15, avgGoalsFor: 1.7, avgGoalsAgainst: 1.2, recentForm: 0.58, worldCupTitles: 0, continent: "CONCACAF", color: "#22C55E" },
  { id: "CAN", name: "Canadá", shortName: "CAN", flag: "🇨🇦", group: "A", eloRating: 1720, fifaRanking: 38, avgGoalsFor: 1.4, avgGoalsAgainst: 1.3, recentForm: 0.54, worldCupTitles: 0, continent: "CONCACAF", color: "#EF4444" },
  { id: "MAR", name: "Marrocos", shortName: "MAR", flag: "🇲🇦", group: "A", eloRating: 1811, fifaRanking: 13, avgGoalsFor: 1.5, avgGoalsAgainst: 0.8, recentForm: 0.70, worldCupTitles: 0, continent: "CAF", color: "#F59E0B" },

  // Group B
  { id: "ARG", name: "Argentina", shortName: "ARG", flag: "🇦🇷", group: "B", eloRating: 2066, fifaRanking: 1, avgGoalsFor: 2.3, avgGoalsAgainst: 0.7, recentForm: 0.88, worldCupTitles: 3, continent: "CONMEBOL", color: "#60A5FA" },
  { id: "POL", name: "Polônia", shortName: "POL", flag: "🇵🇱", group: "B", eloRating: 1730, fifaRanking: 25, avgGoalsFor: 1.4, avgGoalsAgainst: 1.1, recentForm: 0.52, worldCupTitles: 0, continent: "UEFA", color: "#EF4444" },
  { id: "CHI", name: "Chile", shortName: "CHI", flag: "🇨🇱", group: "B", eloRating: 1700, fifaRanking: 32, avgGoalsFor: 1.3, avgGoalsAgainst: 1.2, recentForm: 0.48, worldCupTitles: 0, continent: "CONMEBOL", color: "#EF4444" },
  { id: "UKR", name: "Ucrânia", shortName: "UKR", flag: "🇺🇦", group: "B", eloRating: 1714, fifaRanking: 21, avgGoalsFor: 1.4, avgGoalsAgainst: 1.0, recentForm: 0.50, worldCupTitles: 0, continent: "UEFA", color: "#FCD34D" },

  // Group C
  { id: "BRA", name: "Brasil", shortName: "BRA", flag: "🇧🇷", group: "C", eloRating: 2050, fifaRanking: 5, avgGoalsFor: 2.1, avgGoalsAgainst: 0.8, recentForm: 0.80, worldCupTitles: 5, continent: "CONMEBOL", color: "#22C55E" },
  { id: "SRB", name: "Sérvia", shortName: "SRB", flag: "🇷🇸", group: "C", eloRating: 1756, fifaRanking: 33, avgGoalsFor: 1.5, avgGoalsAgainst: 1.1, recentForm: 0.55, worldCupTitles: 0, continent: "UEFA", color: "#EF4444" },
  { id: "TUN", name: "Tunísia", shortName: "TUN", flag: "🇹🇳", group: "C", eloRating: 1680, fifaRanking: 30, avgGoalsFor: 1.2, avgGoalsAgainst: 1.2, recentForm: 0.48, worldCupTitles: 0, continent: "CAF", color: "#EF4444" },
  { id: "PAN", name: "Panamá", shortName: "PAN", flag: "🇵🇦", group: "C", eloRating: 1650, fifaRanking: 49, avgGoalsFor: 1.0, avgGoalsAgainst: 1.4, recentForm: 0.44, worldCupTitles: 0, continent: "CONCACAF", color: "#EF4444" },

  // Group D
  { id: "FRA", name: "França", shortName: "FRA", flag: "🇫🇷", group: "D", eloRating: 2005, fifaRanking: 2, avgGoalsFor: 2.2, avgGoalsAgainst: 0.9, recentForm: 0.82, worldCupTitles: 2, continent: "UEFA", color: "#3B82F6" },
  { id: "DEN", name: "Dinamarca", shortName: "DEN", flag: "🇩🇰", group: "D", eloRating: 1822, fifaRanking: 19, avgGoalsFor: 1.8, avgGoalsAgainst: 0.9, recentForm: 0.65, worldCupTitles: 0, continent: "UEFA", color: "#EF4444" },
  { id: "AUS", name: "Austrália", shortName: "AUS", flag: "🇦🇺", group: "D", eloRating: 1694, fifaRanking: 22, avgGoalsFor: 1.4, avgGoalsAgainst: 1.3, recentForm: 0.52, worldCupTitles: 0, continent: "AFC", color: "#F59E0B" },
  { id: "NGA", name: "Nigéria", shortName: "NGA", flag: "🇳🇬", group: "D", eloRating: 1698, fifaRanking: 40, avgGoalsFor: 1.3, avgGoalsAgainst: 1.2, recentForm: 0.50, worldCupTitles: 0, continent: "CAF", color: "#22C55E" },

  // Group E
  { id: "ESP", name: "Espanha", shortName: "ESP", flag: "🇪🇸", group: "E", eloRating: 2010, fifaRanking: 3, avgGoalsFor: 2.0, avgGoalsAgainst: 0.7, recentForm: 0.83, worldCupTitles: 1, continent: "UEFA", color: "#EF4444" },
  { id: "GER", name: "Alemanha", shortName: "GER", flag: "🇩🇪", group: "E", eloRating: 1930, fifaRanking: 12, avgGoalsFor: 1.9, avgGoalsAgainst: 0.9, recentForm: 0.72, worldCupTitles: 4, continent: "UEFA", color: "#F59E0B" },
  { id: "JPN", name: "Japão", shortName: "JPN", flag: "🇯🇵", group: "E", eloRating: 1789, fifaRanking: 17, avgGoalsFor: 1.6, avgGoalsAgainst: 1.0, recentForm: 0.68, worldCupTitles: 0, continent: "AFC", color: "#EF4444" },
  { id: "CRC", name: "Costa Rica", shortName: "CRC", flag: "🇨🇷", group: "E", eloRating: 1640, fifaRanking: 39, avgGoalsFor: 0.9, avgGoalsAgainst: 1.3, recentForm: 0.40, worldCupTitles: 0, continent: "CONCACAF", color: "#3B82F6" },

  // Group F
  { id: "POR", name: "Portugal", shortName: "POR", flag: "🇵🇹", group: "F", eloRating: 1975, fifaRanking: 6, avgGoalsFor: 2.1, avgGoalsAgainst: 0.8, recentForm: 0.78, worldCupTitles: 0, continent: "UEFA", color: "#EF4444" },
  { id: "BEL", name: "Bélgica", shortName: "BEL", flag: "🇧🇪", group: "F", eloRating: 1883, fifaRanking: 4, avgGoalsFor: 1.9, avgGoalsAgainst: 0.9, recentForm: 0.70, worldCupTitles: 0, continent: "UEFA", color: "#EF4444" },
  { id: "CRO", name: "Croácia", shortName: "CRO", flag: "🇭🇷", group: "F", eloRating: 1820, fifaRanking: 9, avgGoalsFor: 1.6, avgGoalsAgainst: 0.9, recentForm: 0.64, worldCupTitles: 0, continent: "UEFA", color: "#EF4444" },
  { id: "EGY", name: "Egito", shortName: "EGY", flag: "🇪🇬", group: "F", eloRating: 1630, fifaRanking: 44, avgGoalsFor: 1.1, avgGoalsAgainst: 1.2, recentForm: 0.42, worldCupTitles: 0, continent: "CAF", color: "#EF4444" },

  // Group G
  { id: "ENG", name: "Inglaterra", shortName: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "G", eloRating: 1960, fifaRanking: 5, avgGoalsFor: 2.0, avgGoalsAgainst: 0.8, recentForm: 0.76, worldCupTitles: 1, continent: "UEFA", color: "#EF4444" },
  { id: "NED", name: "Holanda", shortName: "NED", flag: "🇳🇱", group: "G", eloRating: 1898, fifaRanking: 7, avgGoalsFor: 1.9, avgGoalsAgainst: 0.9, recentForm: 0.72, worldCupTitles: 0, continent: "UEFA", color: "#F97316" },
  { id: "MEX2", name: "Irã", shortName: "IRN", flag: "🇮🇷", group: "G", eloRating: 1685, fifaRanking: 22, avgGoalsFor: 1.1, avgGoalsAgainst: 1.1, recentForm: 0.50, worldCupTitles: 0, continent: "AFC", color: "#22C55E" },
  { id: "SEN", name: "Senegal", shortName: "SEN", flag: "🇸🇳", group: "G", eloRating: 1728, fifaRanking: 20, avgGoalsFor: 1.5, avgGoalsAgainst: 1.0, recentForm: 0.60, worldCupTitles: 0, continent: "CAF", color: "#22C55E" },

  // Group H
  { id: "URU", name: "Uruguai", shortName: "URU", flag: "🇺🇾", group: "H", eloRating: 1870, fifaRanking: 14, avgGoalsFor: 1.7, avgGoalsAgainst: 0.9, recentForm: 0.68, worldCupTitles: 2, continent: "CONMEBOL", color: "#60A5FA" },
  { id: "KOR", name: "Coreia do Sul", shortName: "KOR", flag: "🇰🇷", group: "H", eloRating: 1737, fifaRanking: 23, avgGoalsFor: 1.5, avgGoalsAgainst: 1.1, recentForm: 0.56, worldCupTitles: 0, continent: "AFC", color: "#EF4444" },
  { id: "COL", name: "Colômbia", shortName: "COL", flag: "🇨🇴", group: "H", eloRating: 1777, fifaRanking: 10, avgGoalsFor: 1.6, avgGoalsAgainst: 1.0, recentForm: 0.64, worldCupTitles: 0, continent: "CONMEBOL", color: "#FCD34D" },
  { id: "SVK", name: "Eslováquia", shortName: "SVK", flag: "🇸🇰", group: "H", eloRating: 1680, fifaRanking: 47, avgGoalsFor: 1.2, avgGoalsAgainst: 1.2, recentForm: 0.46, worldCupTitles: 0, continent: "UEFA", color: "#3B82F6" },

  // Group I
  { id: "ITA", name: "Itália", shortName: "ITA", flag: "🇮🇹", group: "I", eloRating: 1921, fifaRanking: 8, avgGoalsFor: 1.8, avgGoalsAgainst: 0.8, recentForm: 0.74, worldCupTitles: 4, continent: "UEFA", color: "#3B82F6" },
  { id: "ECU", name: "Equador", shortName: "ECU", flag: "🇪🇨", group: "I", eloRating: 1702, fifaRanking: 36, avgGoalsFor: 1.3, avgGoalsAgainst: 1.2, recentForm: 0.50, worldCupTitles: 0, continent: "CONMEBOL", color: "#FCD34D" },
  { id: "SWI", name: "Suíça", shortName: "SUI", flag: "🇨🇭", group: "I", eloRating: 1789, fifaRanking: 18, avgGoalsFor: 1.6, avgGoalsAgainst: 0.9, recentForm: 0.65, worldCupTitles: 0, continent: "UEFA", color: "#EF4444" },
  { id: "CMR", name: "Camarões", shortName: "CMR", flag: "🇨🇲", group: "I", eloRating: 1632, fifaRanking: 46, avgGoalsFor: 1.1, avgGoalsAgainst: 1.3, recentForm: 0.44, worldCupTitles: 0, continent: "CAF", color: "#22C55E" },

  // Group J
  { id: "NOR", name: "Noruega", shortName: "NOR", flag: "🇳🇴", group: "J", eloRating: 1821, fifaRanking: 16, avgGoalsFor: 1.9, avgGoalsAgainst: 0.9, recentForm: 0.70, worldCupTitles: 0, continent: "UEFA", color: "#EF4444" },
  { id: "MEX3", name: "Paraguai", shortName: "PAR", flag: "🇵🇾", group: "J", eloRating: 1680, fifaRanking: 51, avgGoalsFor: 1.2, avgGoalsAgainst: 1.2, recentForm: 0.46, worldCupTitles: 0, continent: "CONMEBOL", color: "#3B82F6" },
  { id: "SAU", name: "Arábia Saudita", shortName: "SAU", flag: "🇸🇦", group: "J", eloRating: 1680, fifaRanking: 56, avgGoalsFor: 1.0, avgGoalsAgainst: 1.3, recentForm: 0.42, worldCupTitles: 0, continent: "AFC", color: "#22C55E" },
  { id: "GHA", name: "Gana", shortName: "GHA", flag: "🇬🇭", group: "J", eloRating: 1650, fifaRanking: 58, avgGoalsFor: 1.1, avgGoalsAgainst: 1.3, recentForm: 0.44, worldCupTitles: 0, continent: "CAF", color: "#F59E0B" },

  // Group K
  { id: "NZL", name: "Nova Zelândia", shortName: "NZL", flag: "🇳🇿", group: "K", eloRating: 1601, fifaRanking: 93, avgGoalsFor: 1.0, avgGoalsAgainst: 1.5, recentForm: 0.38, worldCupTitles: 0, continent: "OFC", color: "#1D4ED8" },
  { id: "VEN", name: "Venezuela", shortName: "VEN", flag: "🇻🇪", group: "K", eloRating: 1665, fifaRanking: 34, avgGoalsFor: 1.2, avgGoalsAgainst: 1.3, recentForm: 0.46, worldCupTitles: 0, continent: "CONMEBOL", color: "#FCD34D" },
  { id: "AUT", name: "Áustria", shortName: "AUT", flag: "🇦🇹", group: "K", eloRating: 1750, fifaRanking: 26, avgGoalsFor: 1.5, avgGoalsAgainst: 1.1, recentForm: 0.58, worldCupTitles: 0, continent: "UEFA", color: "#EF4444" },
  { id: "CIV", name: "Costa do Marfim", shortName: "CIV", flag: "🇨🇮", group: "K", eloRating: 1662, fifaRanking: 54, avgGoalsFor: 1.2, avgGoalsAgainst: 1.2, recentForm: 0.48, worldCupTitles: 0, continent: "CAF", color: "#F97316" },

  // Group L
  { id: "PER", name: "Peru", shortName: "PER", flag: "🇵🇪", group: "L", eloRating: 1718, fifaRanking: 37, avgGoalsFor: 1.3, avgGoalsAgainst: 1.1, recentForm: 0.52, worldCupTitles: 0, continent: "CONMEBOL", color: "#EF4444" },
  { id: "SLO", name: "Eslovênia", shortName: "SVN", flag: "🇸🇮", group: "L", eloRating: 1694, fifaRanking: 52, avgGoalsFor: 1.2, avgGoalsAgainst: 1.1, recentForm: 0.50, worldCupTitles: 0, continent: "UEFA", color: "#3B82F6" },
  { id: "MEX4", name: "Irlanda", shortName: "IRL", flag: "🇮🇪", group: "L", eloRating: 1700, fifaRanking: 48, avgGoalsFor: 1.1, avgGoalsAgainst: 1.1, recentForm: 0.48, worldCupTitles: 0, continent: "UEFA", color: "#22C55E" },
  { id: "ALG", name: "Argélia", shortName: "ALG", flag: "🇩🇿", group: "L", eloRating: 1705, fifaRanking: 42, avgGoalsFor: 1.3, avgGoalsAgainst: 1.1, recentForm: 0.52, worldCupTitles: 0, continent: "CAF", color: "#22C55E" },
];

export const TEAM_MAP = Object.fromEntries(TEAMS.map(t => [t.id, t]));

export function getTeamsByGroup(): Record<string, Team[]> {
  const groups: Record<string, Team[]> = {};
  for (const t of TEAMS) {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push(t);
  }
  return groups;
}
