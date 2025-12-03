export interface Actor {
  name: string;
  salary: number;
  box_office: number;
  rating: number;
  versatility: number;
  risk: number;
}

export interface Character {
  name: string;
  gender: string;
  traits: string;
  budget_min_display: number;
  budget_max_display: number;
  actors: Actor[];
}

export interface OptimizationResult {
  role: string;
  actor_name: string;
  salary: number;
  box_office: number;
  rating: number;
  risk: number;
}

export interface Project {
  id: number;
  title: string;
  plot: string;
  budget_cap: number;
  industry: 'Hollywood' | 'Bollywood';
  status: 'pending' | 'completed' | 'failed';
  raw_characters: { characters: Character[] };
  optimization_result: OptimizationResult[];
  created_at: string;
}