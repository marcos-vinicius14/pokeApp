import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokeapiService } from '../../services/pokeapi.service';
import { FavoritesService } from '../../services/favorites.service'; 

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.page.html',
  styleUrls: ['./pokemon-details.page.scss'],
})
export class PokemonDetailsPage implements OnInit {
  pokemon: any;
  officialArtworkUrl!: string;
  isFavorite = false; 

  constructor(
    private route: ActivatedRoute,
    private pokeapiService: PokeapiService,
    private favoritesService: FavoritesService 
  ) { }

  ngOnInit() {
    const pokemonName = this.route.snapshot.paramMap.get('name');
    
    this.pokeapiService.getPokemonDetails(pokemonName).subscribe(details => {
      this.pokemon = details;
      this.officialArtworkUrl = this.pokemon.sprites.other['official-artwork'].front_default;
      
      this.checkFavoriteStatus();
    });
  }

  checkFavoriteStatus() {
    this.isFavorite = this.favoritesService.isFavorite(this.pokemon.id);
  }

 
  toggleFavorite() {
    if (this.isFavorite) {
      this.favoritesService.removeFavorite(this.pokemon.id);
      this.isFavorite = false;
      return;
    }

    this.favoritesService.addFavorite(this.pokemon.id);
    this.isFavorite = true;
  }
}
