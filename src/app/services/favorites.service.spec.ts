import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';

describe('FavoritesService (Unit Test)', () => {
  let service: FavoritesService;
  let store: { [key: string]: string } = {};
  const favoritesKey = 'pokemonFavorites';

  beforeEach(() => {
    const mockLocalStorage = {
      getItem: jest.fn((key: string): string | null => {
        return key in store ? store[key] : null;
      }),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    TestBed.configureTestingModule({
      providers: [FavoritesService],
    });

    service = TestBed.inject(FavoritesService);
  });

  afterEach(() => {
    store = {};
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve adicionar um favorito e notificar os subscritores', (done) => {
    const pokemonId = 25;

    service.getFavoritesObservable().subscribe(favorites => {
      if (favorites.length > 0) {
        expect(favorites).toContain(pokemonId);
        done();
      }
    });

    service.addFavorite(pokemonId);
    expect(localStorage.setItem).toHaveBeenCalledWith(favoritesKey, JSON.stringify([pokemonId]));
  });

  it('deve remover um favorito', () => {
    const pokemonIdToRemove = 1;
    const pokemonIdToKeep = 7;
    
    service.addFavorite(pokemonIdToRemove);
    service.addFavorite(pokemonIdToKeep);

    service.removeFavorite(pokemonIdToRemove);
    
    expect(service.isFavorite(pokemonIdToRemove)).toBe(false);
    expect(service.isFavorite(pokemonIdToKeep)).toBe(true);
  });

  it('não deve adicionar um favorito que já existe', () => {
    const pokemonId = 4;
    service.addFavorite(pokemonId);
    service.addFavorite(pokemonId);

    let favoritesList: number[] = [];
    service.getFavoritesObservable().subscribe(favs => favoritesList = favs);

    expect(favoritesList.length).toBe(1);
  });
});
