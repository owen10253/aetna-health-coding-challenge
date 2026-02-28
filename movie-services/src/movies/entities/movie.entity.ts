import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  movieId: number;
  
  @Column()
  imdbId: string;
  
  @Column()
  title: string;
  
  @Column({ nullable: true })
  overview?: string;
  
  @Column({ nullable: true })
  productionCompanies?: string;
  
  @Column({ nullable: true })
  releaseDate?: string;
  
  @Column({ nullable: true })
  budget?: number;
  
  @Column({ nullable: true })
  revenue?: number;
  
  @Column({ nullable: true })
  runtime?: number;
  
  @Column({ nullable: true })
  language?: string;
  
  @Column({ nullable: true })
  genres?: string;
  
  @Column({ nullable: true })
  status?: string;

  constructor(data?: Partial<Movie>) {
    if (data) {
      this.movieId = data.movieId || 0;
      this.imdbId = data.imdbId || '';
      this.title = data.title || '';
      this.overview = data.overview;
      this.productionCompanies = data.productionCompanies;
      this.releaseDate = data.releaseDate;
      this.budget = data.budget;
      this.revenue = data.revenue;
      this.runtime = data.runtime;
      this.language = data.language;
      this.genres = data.genres;
      this.status = data.status;
    }
  }

  // Helper methods for data transformation
  getGenresArray(): string[] {
    return this.genres ? this.genres.split(',').map((g) => g.trim()) : [];
  }

  getProductionCompaniesArray(): string[] {
    return this.productionCompanies
      ? this.productionCompanies.split(',').map((c) => c.trim())
      : [];
  }

  getFormattedBudget(): string {
    if (!this.budget || this.budget === 0) return '$0';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(this.budget);
  }

  getFormattedRevenue(): string {
    if (!this.revenue || this.revenue === 0) return '$0';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(this.revenue);
  }

  // Convert to API response formats
  toListItem(): {
    imdbId: string;
    title: string;
    genres: string[];
    releaseDate: string;
    budget: string;
  } {
    return {
      imdbId: this.imdbId,
      title: this.title,
      genres: this.getGenresArray(),
      releaseDate: this.releaseDate || '',
      budget: this.getFormattedBudget(),
    };
  }

  toDetail(averageRating: number = 0): {
    imdbId: string;
    title: string;
    description: string;
    releaseDate: string;
    budget: string;
    runtime: number;
    averageRating: number;
    genres: string[];
    originalLanguage: string;
    productionCompanies: string[];
  } {
    return {
      imdbId: this.imdbId,
      title: this.title,
      description: this.overview || '',
      releaseDate: this.releaseDate || '',
      budget: this.getFormattedBudget(),
      runtime: this.runtime || 0,
      averageRating: parseFloat(averageRating.toFixed(1)),
      genres: this.getGenresArray(),
      originalLanguage: this.language || '',
      productionCompanies: this.getProductionCompaniesArray(),
    };
  }
}
