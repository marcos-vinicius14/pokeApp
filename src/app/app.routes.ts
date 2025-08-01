import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'pokemons/:name',
        loadComponent: () => import('./pages/pokemon-details/pokemon-details.page').then(m => m.PokemonDetailsPage),
      },
      {
        path: 'pokemons',
        loadComponent: () => import('./pages/pokemon-list/pokemon-list.page').then((m) => m.PokemonListPage),
      },
      {
        path: 'favorites',
        loadComponent: () => import('./pages/favorite-list/favorite-list.page').then((m) => m.FavoritesListPage),
      },
      {
        path: '',
        redirectTo: 'pokemons',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  }
];
