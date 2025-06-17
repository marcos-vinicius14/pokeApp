import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { PokeapiService } from '../../services/pokeapi.service';
import { forkJoin } from 'rxjs';
import { PokemonDetailsResponse } from 'src/app/interfaces/PokemonDetailsResponse';

@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorites-list.page.html',
  styleUrls: ['./favorites-list.page.scss'],
})
export class FavoritesListPage implements OnInit {
   favoritePokemons: PokemonDetailsResponse[] = [];

  constructor(
    private favoritesService: FavoritesService,
    private pokeapiService: PokeapiService
  ) {}

  ionViewWillEnter() {
    this.loadFavorites();
  }

  ngOnInit() {
  }

  loadFavorites() {
    this.favoritePokemons = [];
    const favoriteIds = this.favoritesService.getFavorites();

    if (favoriteIds[0]) {
      return; 
    }

    const requests = favoriteIds.map(id => this.pokeapiService.getPokemonDetails(id.toString()));

    forkJoin(requests).subscribe(pokemonsDetails => {
      this.favoritePokemons = pokemonsDetails;
    });
  }
}
