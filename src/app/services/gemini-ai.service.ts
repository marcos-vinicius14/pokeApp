import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Pokemon } from '../interfaces/Pokemon'; 
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiAiService {
  private apiUrl = environment.geminiApiUrl;

  constructor(private http: HttpClient) { }

  public generatePokedexEntry(pokemon: Pokemon): Observable<string> {
    const types = pokemon.types.map(t => t.type.name).join(', ');
    const abilities = pokemon.abilities.map(a => a.ability.name).join(', ');

    const prompt = `Você é um Professor Pokémon, como o Professor Carvalho. Escreva uma entrada de Pokédex cativante e criativa para o Pokémon a seguir. Descreva seu habitat natural, comportamento típico e uma curiosidade surpreendente que poucos conhecem. Mantenha um tom enciclopédico, mas acessível e divertido.

---

Nome: ${pokemon.name}
Tipos: ${types}
Habilidades: ${abilities}`;

    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = environment.geminiApiKey
    const fullApiUrl = `${this.apiUrl}?key=${apiKey}`;


    return this.http.post<any>(fullApiUrl, payload).pipe(
      map(response => {
        if (response.candidates && response.candidates.length > 0) {
          return response.candidates[0].content.parts[0].text;
        }
        return "Não foi possível gerar a descrição. Tente novamente.";
      }),
      catchError(error => {
        console.error('Erro ao chamar a API do Gemini:', error);
        return of("Ocorreu um erro de comunicação com a Pokédex. Verifique a conexão e tente novamente.");
      })
    );
  }
}
