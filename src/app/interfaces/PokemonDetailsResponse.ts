import { PokemonAbilityInfo } from "./PokemonAbilityInfo";
import { PokemonStatInfo } from "./PokemonStatInfo";
import { PokemonTypeInfo } from "./PokemonTypeInfo";

export interface PokemonDetailsResponse {
  id: number;
  name: string;
  sprites: {
    other?: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: PokemonTypeInfo[];
  abilities: PokemonAbilityInfo[];
  stats: PokemonStatInfo[];
}