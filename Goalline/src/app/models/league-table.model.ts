export interface LeagueTable {
  competition_id: string;
  season_id?: string;
  standings: TeamStanding[];
  updated_at: string;
}

export interface TeamStanding {
  position: number;
  team_id: string;
  team_name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  form?: string[];
}
