import {
  Controller,
  Get,
  Query,
  Param,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MoviesService } from './movies.service';

import { MovieDetail } from './Interfaces/movie.detail.interface';
import { MovieListItem } from './Interfaces/movie.list.item.interface';

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

@Controller('movies')
export class MoviesController {
  private readonly logger = new Logger(MoviesController.name);

  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async findAll(
    @Query('page') page: string = '1',
  ): Promise<PaginatedResponse<MovieListItem>> {
    const pageNum = parseInt(page) || 1;
    this.logger.log(`Fetching movies - page: ${pageNum}`);

    const result = await this.moviesService.findAll(pageNum);
    this.logger.debug(`Movies fetched successfully`, {
      page: pageNum,
      totalResults: result.total,
      itemsReturned: result.data.length,
    });

    return result;
  }

  @Get('year/:year')
  async findByYear(
    @Param('year') year: string,
    @Query('page') page: string = '1',
    @Query('sort') sort: string = 'asc',
  ): Promise<PaginatedResponse<MovieListItem>> {
    const pageNum = parseInt(page) || 1;
    const yearNum = parseInt(year);
    const sortOrder = sort.toLowerCase() === 'desc' ? 'desc' : 'asc';

    this.logger.log(`Fetching movies by year`, {
      year: yearNum,
      page: pageNum,
      sort: sortOrder,
    });

    const result = await this.moviesService.findByYear(
      yearNum,
      pageNum,
      sortOrder,
    );
    this.logger.debug(`Movies by year fetched successfully`, {
      year: yearNum,
      totalResults: result.total,
      itemsReturned: result.data.length,
    });

    return result;
  }

  @Get('genre/:genre')
  async findByGenre(
    @Param('genre') genre: string,
    @Query('page') page: string = '1',
  ): Promise<PaginatedResponse<MovieListItem>> {
    const pageNum = parseInt(page) || 1;
    this.logger.log(`Fetching movies by genre`, {
      genre,
      page: pageNum,
    });

    const result = await this.moviesService.findByGenre(genre, pageNum);
    this.logger.debug(`Movies by genre fetched successfully`, {
      genre,
      totalResults: result.total,
      itemsReturned: result.data.length,
    });

    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MovieDetail> {
    this.logger.log(`Fetching movie details`, { imdbId: id });

    const result = await this.moviesService.findDetailById(id);

    if (!result) {
      this.logger.warn(`Movie not found`, { imdbId: id });
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    this.logger.debug(`Movie details fetched successfully`, {
      imdbId: id,
      title: result.title,
    });

    return result;
  }
}
