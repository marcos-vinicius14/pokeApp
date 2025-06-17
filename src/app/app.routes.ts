import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pokemons',
    pathMatch: 'full'
  },
  {
    // Rota para a tela principal que exibe a lista
    path: 'pokemons',
    loadChildren: () => import('./pages/pokemon-list/pokemon-list.module').then(m => m.PokemonListPageModule)
  },
  {
    // Rota para a tela de detalhes, que aceita um 'name' como parâmetro na URL
    path: 'pokemons/:name',
    loadChildren: () => import('./pages/pokemon-details/pokemon-details.module').then(m => m.PokemonDetailsPageModule)
  },
  {
    path: 'favorite-list',
    loadComponent: () => import('./pages/favorite-list/favorite-list.page').then( m => m.FavoriteListPage)
  },
  // Se você usou o template 'tabs', pode adaptar as rotas aqui.
  // Por exemplo, a rota 'pokemons' poderia estar dentro de uma rota 'tabs'.
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }