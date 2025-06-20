import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { GeminiAiService } from './gemini-ai.service';
import { environment } from 'src/environments/environment';
import { Pokemon } from '../interfaces/Pokemon';

describe('GeminiAiService (Integration Test)', () => {
  let service: GeminiAiService;
  let httpMock: HttpTestingController;
  let mockPokemon: Pokemon;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), 
        provideHttpClientTesting(), 
        GeminiAiService,
      ],
    });
    service = TestBed.inject(GeminiAiService);
    httpMock = TestBed.inject(HttpTestingController);

    mockPokemon = {
      id: 1,
      name: 'bulbasaur',
      types: [{ slot: 1, type: { name: 'grass' } }],
      abilities: [{ ability: { name: 'overgrow' } }],
      sprites: {},
      stats: [],
    };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve gerar uma entrada da Pokédex com sucesso', () => {
    const mockApiResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: 'Esta é uma descrição gerada pela IA.' }],
          },
        },
      ],
    };

    service.generatePokedexEntry(mockPokemon).subscribe((response) => {
      expect(response).toBe('Esta é uma descrição gerada pela IA.');
    });

    const expectedUrl = `${environment.geminiApiUrl}?key=${environment.geminiApiKey}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    
    expect(req.request.body.contents[0].parts[0].text).toContain('Nome: bulbasaur');
    expect(req.request.body.contents[0].parts[0].text).toContain('Tipos: grass');

    req.flush(mockApiResponse);
  });

  it('deve lidar com erros da API graciosamente', () => {
    service.generatePokedexEntry(mockPokemon).subscribe((response) => {
      expect(response).toContain('Ocorreu um erro de comunicação com a Pokédex.');
    });

    const expectedUrl = `${environment.geminiApiUrl}?key=${environment.geminiApiKey}`;
    const req = httpMock.expectOne(expectedUrl);

    req.flush('Erro no servidor', { status: 500, statusText: 'Internal Server Error' });
  });
});
