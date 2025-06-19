import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription, forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonAvatar, IonLabel, IonIcon
} from '@ionic/angular/standalone';
import { PokeapiService } from '../../services/pokeapi.service';
import { FavoritesService } from '../../services/favorites.service';
import { Pokemon } from 'src/app/interfaces/Pokemon';

@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorite-list.page.html',
  styleUrls: ['./favorite-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonItem, IonAvatar, IonLabel, IonIcon
  ],
})
export class FavoritesListPage implements OnInit, OnDestroy {
  public favoritePokemons: Pokemon[] = [];
  private favoritesSub: Subscription = new Subscription();

  constructor(
    private favoritesService: FavoritesService,
    private pokeapiService: PokeapiService
  ) { }

  public ngOnInit(): void {
    this.favoritesSub = this.favoritesService.getFavoritesObservable().pipe(
      switchMap((ids: number[]) => {
        if (ids.length === 0) {
          return of([]);
        }
        const requests = ids.map(id => this.pokeapiService.getPokemonDetails(id.toString()));
        return forkJoin(requests);
      })
    ).subscribe(pokemonsDetails => {
      this.favoritePokemons = pokemonsDetails;
    });
  }

  public getRouterLink(pokemon: Pokemon): string[] {
    if (pokemon && pokemon.name) {
      return ['/tabs/pokemons', pokemon.name];
    }
    return ['/tabs/pokemons'];
  }

  public handleImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
  }

  public ngOnDestroy(): void {
    if (this.favoritesSub) {
      this.favoritesSub.unsubscribe();
    }
  }
}
