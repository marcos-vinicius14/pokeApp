export interface PokemonDetailsResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork': {
        front_default: string;
      }
    }
  };
}