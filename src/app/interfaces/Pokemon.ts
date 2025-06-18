export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other?: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: { slot: number; type: { name: string; } }[];
  abilities: { ability: { name: string; } }[];
  stats: { base_stat: number; stat: { name: string; } }[];
}