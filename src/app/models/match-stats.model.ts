export interface MatchStats {
  possession?: { home: number; away: number };
  shots?: { home: number; away: number };
  shots_on_target?: { home: number; away: number };
  corners?: { home: number; away: number };
  fouls?: { home: number; away: number };
  yellow_cards?: { home: number; away: number };
  red_cards?: { home: number; away: number };
}
