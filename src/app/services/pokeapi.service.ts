import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface PokemonListResponse {
  count: number;
  next: string;
  previous: string | null;
  results: { name: string; url: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  private baseUrl = environment.pokeApiBaseUrl;
  private imageUrl = environment.pokeApiImageUrl;

  constructor(private http: HttpClient) { }


  getPokemonList(offset = 0, limit = 25): Observable<any> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`)
      .pipe(
        map(response => {
          return response.results.map(pokemon => {
            const id = pokemon.url.split('/').filter(Boolean).pop();
            return {
              ...pokemon,
              id: id,
              imageUrl: `${this.imageUrl}${id}.png`
            };
          });
        })
      );
  }



  getPokemonDetails(name: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon/${name}`);
  }
}
