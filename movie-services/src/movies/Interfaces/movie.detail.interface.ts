export interface MovieDetail {
  imdbId: string;
  title: string;
  description: string;
  releaseDate: string;
  budget: string; // displayed in dollars
  runtime: number; // in minutes
  averageRating: number;
  genres: string[];
  originalLanguage: string;
  productionCompanies: string[];
}
