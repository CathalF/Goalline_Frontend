export interface Season {
  _id: string;
  competition_id: string;
  slug?: string;
  name?: string;
  start_date: string;
  end_date?: string;
  current_matchday?: number;
  winner_id?: string;
  winner?: string;
}
