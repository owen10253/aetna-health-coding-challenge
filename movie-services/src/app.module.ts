import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';

import { Movie } from './movies/entities/movie.entity';
import { Rating } from './movies/entities/rating.entity';

const SafeTypeOrmModule = TypeOrmModule as unknown as {
  forRoot: (options: TypeOrmModuleOptions) => DynamicModule;
  forFeature: (entities: any[], connectionName?: string) => DynamicModule;
};

@Module({
  imports: [
    // Movies database connection
    SafeTypeOrmModule.forRoot({
      name: 'moviesConnection',
      type: 'sqlite',
      database: path.resolve(process.cwd(), '../db/movies.db'),
      entities: [Movie],
      synchronize: false,
    }),
    // Ratings database connection
    SafeTypeOrmModule.forRoot({
      name: 'ratingsConnection',
      type: 'sqlite',
      database: path.resolve(process.cwd(), '../db/ratings.db'),
      entities: [Rating],
      synchronize: false,
    }),
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
