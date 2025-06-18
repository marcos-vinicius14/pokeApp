import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { PokeapiService } from '../../services/pokeapi.service';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonIcon 
} from '@ionic/angular/standalone';
import { Pokemon } from 'src/app/interfaces/Pokemon';

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorite-list.page.html',
  styleUrls: ['./favorite-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonIcon
  ],
})
export class FavoritesListPage implements OnInit {
  public favoritePokemons: Pokemon[] = [];

  constructor(
    private favoritesService: FavoritesService,
    private pokeapiService: PokeapiService
  ) {}

  ionViewWillEnter(): void {
    this.loadFavorites();
  }

  ngOnInit(): void {}

  loadFavorites(): void {
    this.favoritePokemons = [];
    const favoriteIds: number[] = this.favoritesService.getFavorites();

    if (favoriteIds.length === 0) {
      return;
    }

    const requests: Observable<Pokemon>[] = favoriteIds.map(id => this.pokeapiService.getPokemonDetails(id.toString()));

    forkJoin(requests).subscribe((pokemonsDetails: Pokemon[]) => {
      this.favoritePokemons = pokemonsDetails;
    });
  }
}
