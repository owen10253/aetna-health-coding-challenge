import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(MoviesService.name);

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

    this.logger.debug(`Starting findAll query`, {
      page: pageNum,
      limit,
      offset,
    });

    try {
      // Get total count
      const total = await this.movieRepository.count();
      this.logger.debug(`Total movie count: ${total}`);

      // Get paginated movies
      const movies = await this.movieRepository.find({
        order: { releaseDate: 'ASC' },
        skip: offset,
        take: limit,
      });

      this.logger.log(`Successfully fetched ${movies.length} movies`, {
        page: pageNum,
        limit,
        total,
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
      this.logger.error('Error fetching movies', error, {
        page: pageNum,
        limit,
      });
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
    this.logger.debug(`Finding movie by ID`, { imdbId: id });

    try {
      const movie = await this.movieRepository.findOne({
        where: { imdbId: id },
      });

      if (!movie) {
        this.logger.warn(`Movie not found`, { imdbId: id });
        return null;
      }

      this.logger.log(`Movie found successfully`, {
        imdbId: id,
        title: movie.title,
      });

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
      this.logger.error('Error fetching movie by ID', error, { imdbId: id });
      return null;
    }
  }

  async findDetailById(id: string): Promise<MovieDetail | null> {
    this.logger.debug(`Finding movie details by ID`, { imdbId: id });

    try {
      // Get movie details from movies database
      const movie = await this.movieRepository.findOne({
        where: { imdbId: id },
      });

      if (!movie) {
        this.logger.warn(`Movie not found for details`, { imdbId: id });
        return null;
      }

      this.logger.debug(`Movie found, fetching ratings`, {
        imdbId: id,
        movieId: movie.movieId,
      });

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
        this.logger.debug(`Rating calculation completed`, {
          imdbId: id,
          averageRating,
        });
      } catch (ratingError) {
        this.logger.error('Error fetching ratings', ratingError, {
          imdbId: id,
          movieId: movie.movieId,
        });
      }

      const movieDetail: MovieDetail = {
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

      this.logger.log(`Movie details fetched successfully`, {
        imdbId: id,
        title: movie.title,
        averageRating,
      });

      return movieDetail;
    } catch (error) {
      this.logger.error('Error fetching movie details', error, { imdbId: id });
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

    this.logger.debug(`Finding movies by year`, {
      year,
      page: pageNum,
      sortOrder,
      limit,
      offset,
    });

    try {
      // Create query builder for year filtering
      const queryBuilder = this.movieRepository
        .createQueryBuilder('movie')
        .where("strftime('%Y', movie.releaseDate) = :year", {
          year: year.toString(),
        });

      // Get total count for pagination
      const total = await queryBuilder.getCount();
      this.logger.debug(`Total movies found for year ${year}: ${total}`);

      // Get paginated movies with sorting
      const movies = await queryBuilder
        .orderBy('movie.releaseDate', sortOrder.toUpperCase() as 'ASC' | 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();

      this.logger.log(
        `Successfully fetched ${movies.length} movies for year ${year}`,
        {
          year,
          page: pageNum,
          total,
          sortOrder,
        },
      );

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
      this.logger.error(`Error fetching movies for year ${year}`, error, {
        year,
        page: pageNum,
        sortOrder,
      });
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

    this.logger.debug(`Finding movies by genre`, {
      genre,
      page: pageNum,
      limit,
      offset,
    });

    try {
      // Create query builder for genre filtering
      // Use LIKE to match genres in comma-separated string
      const queryBuilder = this.movieRepository
        .createQueryBuilder('movie')
        .where('movie.genres LIKE :genre', { genre: `%${genre}%` });

      // Get total count for pagination
      const total = await queryBuilder.getCount();
      this.logger.debug(`Total movies found for genre '${genre}': ${total}`);

      // Get paginated movies
      const movies = await queryBuilder
        .orderBy('movie.releaseDate', 'ASC')
        .skip(offset)
        .take(limit)
        .getMany();

      this.logger.log(
        `Successfully fetched ${movies.length} movies for genre '${genre}'`,
        {
          genre,
          page: pageNum,
          total,
        },
      );

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
      this.logger.error(`Error fetching movies for genre '${genre}'`, error, {
        genre,
        page: pageNum,
      });
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
