import { Controller, Get, Query, Param } from '@nestjs/common';
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
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async findAll(
    @Query('page') page: string = '1',
  ): Promise<PaginatedResponse<MovieListItem>> {
    const pageNum = parseInt(page) || 1;
    return this.moviesService.findAll(pageNum);
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

    return this.moviesService.findByYear(yearNum, pageNum, sortOrder);
  }

  @Get('genre/:genre')
  async findByGenre(
    @Param('genre') genre: string,
    @Query('page') page: string = '1',
  ): Promise<PaginatedResponse<MovieListItem>> {
    const pageNum = parseInt(page) || 1;
    return this.moviesService.findByGenre(genre, pageNum);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MovieDetail | null> {
    return this.moviesService.findDetailById(id);
  }
}
