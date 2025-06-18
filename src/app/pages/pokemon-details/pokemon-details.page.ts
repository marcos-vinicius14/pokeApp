import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokeapiService } from '../../services/pokeapi.service';
import { FavoritesService } from '../../services/favorites.service';
import { CommonModule } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSpinner,
  IonChip,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonNote 
} from '@ionic/angular/standalone';
import { PokemonAbilityInfo } from 'src/app/interfaces/PokemonAbilityInfo';
import { PokemonTypeInfo } from 'src/app/interfaces/PokemonTypeInfo';
import { PokemonDetailsResponse } from 'src/app/interfaces/PokemonDetailsResponse';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.page.html',
  styleUrls: ['./pokemon-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent, IonFab, IonFabButton, IonIcon, IonSpinner,
    IonChip, IonButton, IonList, IonItem, IonLabel, IonNote
  ],
})
export class PokemonDetailsPage implements OnInit {
  public pokemon: PokemonDetailsResponse | null = null;
  public officialArtworkUrl: string = '';
  public isFavorite: boolean = false;
  public geminiPokedexEntry: string | null = null;
  public isGeneratingEntry: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private pokeapiService: PokeapiService,
    private favoritesService: FavoritesService
  ) {}

  public ngOnInit(): void {
    const pokemonName = this.route.snapshot.paramMap.get('name');
    if (pokemonName) {
      this.pokeapiService.getPokemonDetails(pokemonName).subscribe((details: PokemonDetailsResponse) => {
        this.pokemon = details;
        if (details.sprites.other?.['official-artwork'].front_default) {
          this.officialArtworkUrl = details.sprites.other['official-artwork'].front_default;
        }
        this.checkFavoriteStatus();
      });
    }
  }

  public checkFavoriteStatus(): void {
    if (this.pokemon) {
      this.isFavorite = this.favoritesService.isFavorite(this.pokemon.id);
    }
  }

  public toggleFavorite(): void {
    if (!this.pokemon) return;

    if (this.isFavorite) {
      this.favoritesService.removeFavorite(this.pokemon.id);
      this.isFavorite = false;
      return;
    }

    this.favoritesService.addFavorite(this.pokemon.id);
    this.isFavorite = true;
  }

  public async generatePokedexEntry(): Promise<void> {
    if (!this.pokemon || this.isGeneratingEntry) {
      return;
    }

    this.isGeneratingEntry = true;
    this.geminiPokedexEntry = null;

    const types: string = this.pokemon.types.map((t: PokemonTypeInfo) => t.type.name).join(', ');
    const abilities: string = this.pokemon.abilities.map((a: PokemonAbilityInfo) => a.ability.name).join(', ');
    const prompt = `Você é um Professor Pokémon, como o Professor Carvalho. Escreva uma entrada de Pokédex cativante e criativa para o Pokémon a seguir. Descreva seu habitat natural, comportamento típico e uma curiosidade surpreendente que poucos conhecem. Mantenha um tom enciclopédico, mas acessível e divertido.

---

Nome: ${this.pokemon.name}
Tipos: ${types}
Habilidades: ${abilities}`;

    try {
      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiKey = "" 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0) {
        this.geminiPokedexEntry = result.candidates[0].content.parts[0].text;
      } else {
        this.geminiPokedexEntry = "Não foi possível gerar a descrição. Tente novamente.";
      }

    } catch (error) {
      console.error('Erro ao chamar a API do Gemini:', error);
      this.geminiPokedexEntry = "Ocorreu um erro de comunicação com a Pokédex. Verifique a conexão e tente novamente.";
    } finally {
      this.isGeneratingEntry = false;
    }
  }
}
