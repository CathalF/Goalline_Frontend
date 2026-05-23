export interface User {
  _id: string;
  email: string;
  username?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at?: string;
  favorite_teams?: string[];
  token?: string;
}
