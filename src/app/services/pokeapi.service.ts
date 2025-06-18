import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pokemon } from '../interfaces/Pokemon';
import { PokemonListResponse } from '../interfaces/PokemonListResponse';
import { PokemonListItem } from '../interfaces/PokemonListItem';


@Injectable({
  providedIn: 'root'
})

export class PokeapiService {
  private baseUrl = environment.pokeApiBaseUrl;
  private imageUrl = environment.pokeApiImageUrl;

  constructor(private http: HttpClient) { }

  public getPokemonList(offset = 0, limit = 25): Observable<PokemonListItem[]> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`)
      .pipe(
        map(response => {
          return response.results.map(pokemon => {
            const id = pokemon.url.split('/').filter(Boolean).pop()!;
            return {
              ...pokemon,
              id: id,
              imageUrl: `${this.imageUrl}${id}.png`
            };
          });
        })
      );
  }


  public getPokemonDetails(pokemonName: string | null): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${pokemonName}`);
  }
}
