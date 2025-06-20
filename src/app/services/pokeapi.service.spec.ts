import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PokeapiService } from './pokeapi.service';
import { environment } from 'src/environments/environment';
import { Pokemon } from '../interfaces/Pokemon';
import { PokemonListItem } from '../interfaces/PokemonListItem';
import { PokemonListResponse } from '../interfaces/PokemonListResponse';

describe('PokeapiService (Integration Test)', () => {
  let service: PokeapiService;
  let httpMock: HttpTestingController; 
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokeapiService]
    });
    service = TestBed.inject(PokeapiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar uma lista de Pokémon e formatar os dados corretamente', () => {
    const mockApiResponse: PokemonListResponse = {
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
      ]
    };

    service.getPokemonList(0, 2).subscribe((pokemons: PokemonListItem[]) => {
      expect(pokemons.length).toBe(2);
      expect(pokemons[0].name).toBe('bulbasaur');
      expect(pokemons[0].id).toBe('1');
      expect(pokemons[0].imageUrl).toContain('/1.png');
    });

    const req = httpMock.expectOne(`${environment.pokeApiBaseUrl}/pokemon?offset=0&limit=2`);
    expect(req.request.method).toBe('GET');

    req.flush(mockApiResponse);
  });

  it('deve buscar os detalhes de um Pokémon específico', () => {
    const pokemonName = 'pikachu';
    const mockPokemonDetail: Pokemon = {
      id: 25,
      name: 'pikachu',
      sprites: { other: { 'official-artwork': { front_default: 'url_da_imagem' } } },
      types: [],
      abilities: [],
      stats: []
    };

    // 2. Chamamos o método
    service.getPokemonDetails(pokemonName).subscribe((pokemon: Pokemon) => {
      // 4. Verificamos se os detalhes estão corretos
      expect(pokemon).toBeTruthy();
      expect(pokemon.id).toBe(25);
      expect(pokemon.name).toBe('pikachu');
    });

    // 3. Intercetamos o pedido HTTP
    const req = httpMock.expectOne(`${environment.pokeApiBaseUrl}/pokemon/${pokemonName}`);
    expect(req.request.method).toBe('GET');

    // Enviamos a resposta simulada
    req.flush(mockPokemonDetail);
  });
});
