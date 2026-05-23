export interface HeadToHead {
  team1: string;
  team2: string;
  played: number;
  wins: { [team: string]: number };
  draws: number;
  goals: { [team: string]: number };
  matches: H2HMatch[];
}

export interface H2HMatch {
  date: string;
  round?: string;
  team1: string;
  team2: string;
  score: string;
}

export interface Streak {
  team: string;
  length: number;
  gf: number;
  ga: number;
}

export interface FormGuide {
  team: string;
  n: number;
  form: string[];
  form_str: string;
}
