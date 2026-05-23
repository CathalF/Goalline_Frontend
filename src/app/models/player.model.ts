export interface Player {
  _id: string;
  name: string;
  slug?: string;
  current_team_id?: string;
  position?: string;
  nationality?: string;
  date_of_birth?: string;
  height?: number;
  weight?: number;
  jersey_number?: number;
  market_value?: number;
  foot?: 'left' | 'right' | 'both';
  image_url?: string;
}
