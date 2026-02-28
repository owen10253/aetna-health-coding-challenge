import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { Rating } from './entities/rating.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie], 'moviesConnection'),
    TypeOrmModule.forFeature([Rating], 'ratingsConnection'),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
