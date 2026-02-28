import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Rating } from './entities/rating.entity';

import { MovieDetail } from './Interfaces/movie.detail.interface';
import { MovieListItem } from './Interfaces/movie.list.item.interface';

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie, 'moviesConnection')
    private movieRepository: Repository<Movie>,
    @InjectRepository(Rating, 'ratingsConnection')
    private ratingRepository: Repository<Rating>,
  ) {}

  async findAll(page: number = 1): Promise<PaginatedResponse<MovieListItem>> {
    const limit = 50;
    const pageNum = Math.max(1, page);
    const offset = (pageNum - 1) * limit;

    try {
      // Get total count
      const total = await this.movieRepository.count();

      // Get paginated movies
      const movies = await this.movieRepository.find({
        order: { releaseDate: 'ASC' },
        skip: offset,
        take: limit,
      });

      const movieListItems: MovieListItem[] = movies.map((movie) => ({
        imdbId: movie.imdbId,
        title: movie.title,
        genres: movie.genres
          ? movie.genres.split(',').map((g) => g.trim())
          : [],
        releaseDate: movie.releaseDate || '',
        budget: this.formatBudget(movie.budget),
      }));

      const totalPages = Math.ceil(total / limit);

      return {
        data: movieListItems,
        page: pageNum,
        limit,
        total,
        totalPages,
      };
    } catch (error) {
      console.error('Error fetching movies:', error);
      return {
        data: [],
        page: pageNum,
        limit,
        total: 0,
        totalPages: 0,
      };
    }
  }

  async findById(id: string): Promise<MovieListItem | null> {
    try {
      const movie = await this.movieRepository.findOne({
        where: { imdbId: id },
      });

      if (!movie) return null;

      return {
        imdbId: movie.imdbId,
        title: movie.title,
        genres: movie.genres
          ? movie.genres.split(',').map((g) => g.trim())
          : [],
        releaseDate: movie.releaseDate || '',
        budget: this.formatBudget(movie.budget),
      };
    } catch (error) {
      console.error('Error fetching movie by ID:', error);
      return null;
    }
  }

  async findDetailById(id: string): Promise<MovieDetail | null> {
    try {
      // Get movie details from movies database
      const movie = await this.movieRepository.findOne({
        where: { imdbId: id },
      });

      if (!movie) return null;

      // Get average rating from ratings database using TypeORM
      let averageRating = 0;
      try {
        const result: { averageRating: number | string | null } | undefined =
          await this.ratingRepository
            .createQueryBuilder('rating')
            .select('AVG(rating.rating)', 'averageRating')
            .where('rating.movieId = :movieId', { movieId: movie.movieId })
            .getRawOne();

        averageRating = Number(result?.averageRating ?? 0);
      } catch (ratingError) {
        console.error('Error fetching ratings:', ratingError);
      }

      return {
        imdbId: movie.imdbId,
        title: movie.title,
        description: movie.overview || '',
        releaseDate: movie.releaseDate || '',
        budget: this.formatBudget(movie.budget),
        runtime: movie.runtime || 0,
        averageRating: parseFloat(averageRating.toFixed(1)),
        genres: movie.genres
          ? movie.genres.split(',').map((g) => g.trim())
          : [],
        originalLanguage: movie.language || '',
        productionCompanies: movie.productionCompanies
          ? movie.productionCompanies.split(',').map((c) => c.trim())
          : [],
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  }

  async findByYear(
    year: number,
    page: number = 1,
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<PaginatedResponse<MovieListItem>> {
    const limit = 50;
    const pageNum = Math.max(1, page);
    const offset = (pageNum - 1) * limit;

    try {
      // Create query builder for year filtering
      const queryBuilder = this.movieRepository
        .createQueryBuilder('movie')
        .where("strftime('%Y', movie.releaseDate) = :year", {
          year: year.toString(),
        });

      // Get total count for pagination
      const total = await queryBuilder.getCount();

      // Get paginated movies with sorting
      const movies = await queryBuilder
        .orderBy('movie.releaseDate', sortOrder.toUpperCase() as 'ASC' | 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();

      const movieListItems: MovieListItem[] = movies.map((movie) => ({
        imdbId: movie.imdbId,
        title: movie.title,
        genres: movie.genres
          ? movie.genres.split(',').map((g) => g.trim())
          : [],
        releaseDate: movie.releaseDate || '',
        budget: this.formatBudget(movie.budget),
      }));

      const totalPages = Math.ceil(total / limit);

      return {
        data: movieListItems,
        page: pageNum,
        limit,
        total,
        totalPages,
      };
    } catch (error) {
      console.error(`Error fetching movies for year ${year}:`, error);
      return {
        data: [],
        page: pageNum,
        limit,
        total: 0,
        totalPages: 0,
      };
    }
  }

  async findByGenre(
    genre: string,
    page: number = 1,
  ): Promise<PaginatedResponse<MovieListItem>> {
    const limit = 50;
    const pageNum = Math.max(1, page);
    const offset = (pageNum - 1) * limit;

    try {
      // Create query builder for genre filtering
      // Use LIKE to match genres in comma-separated string
      const queryBuilder = this.movieRepository
        .createQueryBuilder('movie')
        .where('movie.genres LIKE :genre', { genre: `%${genre}%` });

      // Get total count for pagination
      const total = await queryBuilder.getCount();

      // Get paginated movies
      const movies = await queryBuilder
        .orderBy('movie.releaseDate', 'ASC')
        .skip(offset)
        .take(limit)
        .getMany();

      const movieListItems: MovieListItem[] = movies.map((movie) => ({
        imdbId: movie.imdbId,
        title: movie.title,
        genres: movie.genres
          ? movie.genres.split(',').map((g) => g.trim())
          : [],
        releaseDate: movie.releaseDate || '',
        budget: this.formatBudget(movie.budget),
      }));

      const totalPages = Math.ceil(total / limit);

      return {
        data: movieListItems,
        page: pageNum,
        limit,
        total,
        totalPages,
      };
    } catch (error) {
      console.error(`Error fetching movies for genre '${genre}':`, error);
      return {
        data: [],
        page: pageNum,
        limit,
        total: 0,
        totalPages: 0,
      };
    }
  }

  private formatBudget(budget: string | number | null | undefined): string {
    if (budget == null || budget === 0 || budget === '') return '$0';

    const budgetNum =
      typeof budget === 'string'
        ? Number.parseFloat(budget)
        : typeof budget === 'number'
          ? budget
          : 0;

    if (!Number.isFinite(budgetNum) || budgetNum <= 0) return '$0';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budgetNum);
  }
}
