export interface Match {
  _id: string;
  date: string;
  competition_id?: string;
  competition?: string;
  season_id?: string;
  season?: string;
  home_team_id: string;
  away_team_id: string;
  home_team?: string;
  away_team?: string;
  score?: {
    ft?: [number, number] | { home: number, away: number };
    ht?: [number, number];
  } | string;
  status?: string;
  round?: string | number;
  venue?: string;
  attendance?: number;
}
