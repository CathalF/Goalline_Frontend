export interface Team {
  _id: string;
  name: string;
  slug?: string;
  country?: string;
  stadium?: {
    name?: string;
    location?: {
      type: string;
      coordinates: number[];
    };
    capacity?: number;
  };
  founded?: number;
  colors?: string[];
  manager?: string;
}
