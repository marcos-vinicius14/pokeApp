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
import { Pokemon } from 'src/app/interfaces/Pokemon';
import { GeminiAiService } from 'src/app/services/gemini-ai.service';
import { finalize } from 'rxjs/operators';

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
  public pokemon: Pokemon | null = null;
  public officialArtworkUrl: string = '';
  public isFavorite: boolean = false;
  public geminiPokedexEntry: string | null = null;
  public isGeneratingEntry: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private pokeapiService: PokeapiService,
    private favoritesService: FavoritesService,
    private geminiAiService: GeminiAiService
  ) { }

  public ngOnInit(): void {
    const pokemonName = this.route.snapshot.paramMap.get('name');
    if (pokemonName) {
      this.pokeapiService.getPokemonDetails(pokemonName).subscribe((details: Pokemon) => {
        this.pokemon = details;
        if (details.sprites.other?.['official-artwork'].front_default) {
          this.officialArtworkUrl = details.sprites.other['official-artwork'].front_default;
        }
        this.checkFavoriteStatus();
      });
    }
  }


  public get formattedId(): string {
    if (this.pokemon && this.pokemon.id) {
      return this.pokemon.id.toString().padStart(3, '0');
    }
    return '...';
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

  public generatePokedexEntry(): void {
    if (!this.pokemon || this.isGeneratingEntry) {
      return;
    }

    this.isGeneratingEntry = true;
    this.geminiPokedexEntry = null;

    this.geminiAiService.generatePokedexEntry(this.pokemon).pipe(
      finalize(() => this.isGeneratingEntry = false)
    ).subscribe({
      next: (entry) => {
        this.geminiPokedexEntry = entry;
      },
      error: (err) => {
        console.error("Erro recebido no componente:", err);
        this.geminiPokedexEntry = "Não foi possível carregar a descrição da Pokédex.";
      }
    });
  }
}
