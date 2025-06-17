import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly FAVORITES_KEY = 'pokemonFavorites';

  constructor() { }

 
  getFavorites(): number[] {
    const favorites = localStorage.getItem(this.FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  }

 
  isFavorite(pokemonId: number): boolean {
    const favorites = this.getFavorites();
    return favorites.includes(pokemonId);
  }

  
  addFavorite(pokemonId: number): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(pokemonId)) {
      favorites.push(pokemonId);
      this.saveFavorites(favorites);
    }
  }


  removeFavorite(pokemonId: number): void {
    let favorites = this.getFavorites();
    favorites = favorites.filter(id => id !== pokemonId);
    this.saveFavorites(favorites);
  }


  private saveFavorites(favorites: number[]): void {
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
  }
}
