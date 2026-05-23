export interface MatchEvent {
  type: "goal" | "yellow_card" | "red_card" | "substitution" | "penalty" | "own_goal";
  minute: number;
  player_id?: string;
  player_name?: string;
  team_id?: string;
  team_name?: string;
  assist_player_id?: string;
  assist_player_name?: string;
  extra_time?: number;
  description?: string;
}
