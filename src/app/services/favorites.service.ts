import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly FAVORITES_KEY = 'pokemonFavorites';
  
  private favorites$: BehaviorSubject<number[]>;

  constructor() {
    this.favorites$ = new BehaviorSubject<number[]>(this.getFavoritesFromStorage());
  }
  
  public getFavoritesObservable(): Observable<number[]> {
    return this.favorites$.asObservable();
  }

  private getFavoritesFromStorage(): number[] {
    const favorites = localStorage.getItem(this.FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  }

  public isFavorite(pokemonId: number): boolean {
    return this.favorites$.getValue().includes(pokemonId);
  }

  public addFavorite(pokemonId: number): void {
    const currentFavorites = this.favorites$.getValue();
    if (!currentFavorites.includes(pokemonId)) {
      const newFavorites = [...currentFavorites, pokemonId];
      this.saveFavorites(newFavorites);
    }
  }

  public removeFavorite(pokemonId: number): void {
    const currentFavorites = this.favorites$.getValue();
    const newFavorites = currentFavorites.filter(id => id !== pokemonId);
    this.saveFavorites(newFavorites);
  }

  private saveFavorites(favorites: number[]): void {
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    // 3. Notifica todos os "ouvintes" (subscribers) sobre a nova lista
    this.favorites$.next(favorites);
  }
}
