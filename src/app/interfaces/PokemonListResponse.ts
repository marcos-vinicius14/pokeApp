export interface PokemonListResponse {
    count: number;
    next: string;
    previous: string | null;
    results: { name: string; url: string }[];
}