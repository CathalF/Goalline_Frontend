export interface MatchNote {
  _id: string;
  match_id: string;
  content: string;
  created_by: {
    user_id: string;
    username?: string;
    email?: string;
  };
  created_at: string;
  updated_at?: string;
  is_private?: boolean;
  tags?: string[];
}
