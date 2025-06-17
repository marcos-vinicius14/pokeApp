import { Component, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  IonIcon
} from '@ionic/angular/standalone';
import { PokeapiService } from '../../services/pokeapi.service';

export interface PokemonListItem {
  name: string;
  url: string;
  id: string;
  imageUrl: string;
}

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonIcon
  ],
})
export class PokemonListPage implements OnInit {
  @ViewChild(IonInfiniteScroll)
  public infiniteScroll!: IonInfiniteScroll;

  public pokemons: WritableSignal<PokemonListItem[]> = signal([]);
  private offset: number = 0;

  constructor(private pokeapiService: PokeapiService) {}

  public ngOnInit(): void {
    this.loadPokemons();
  }

  public loadPokemons(event?: InfiniteScrollCustomEvent): void {
    this.pokeapiService.getPokemonList(this.offset).subscribe((newPokemons: PokemonListItem[]) => {
      this.pokemons.update((currentPokemons) => [...currentPokemons, ...newPokemons]);

      if (event) {
        event.target.complete();
      }

      if (newPokemons.length < 25) {
        if (this.infiniteScroll) {
          this.infiniteScroll.disabled = true;
        }
      }
    });
  }

  public loadMore(event: InfiniteScrollCustomEvent): void {
    this.offset += 25;
    this.loadPokemons(event);
  }

   public handleImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
  }
}
