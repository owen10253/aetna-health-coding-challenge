import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { Rating } from './entities/rating.entity';

describe('MoviesService', () => {
  let service: MoviesService;

  const mockMovie: Partial<Movie> = {
    movieId: 1,
    imdbId: 'tt0111161',
    title: 'The Shawshank Redemption',
    overview: 'Two imprisoned men bond over a number of years...',
    productionCompanies: 'Castle Rock Entertainment,Columbia Pictures',
    releaseDate: '1994-09-23',
    budget: 25000000,
    revenue: 16000000,
    runtime: 142,
    language: 'en',
    genres: 'Drama,Crime',
    status: 'Released',
  };

  const mockMovies: Partial<Movie>[] = [
    mockMovie,
    {
      movieId: 2,
      imdbId: 'tt0068646',
      title: 'The Godfather',
      overview: 'The aging patriarch of an organized crime dynasty...',
      productionCompanies: 'Paramount Pictures',
      releaseDate: '1972-03-24',
      budget: 6000000,
      revenue: 245000000,
      runtime: 175,
      language: 'en',
      genres: 'Drama,Crime',
      status: 'Released',
    },
  ];

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
    getMany: jest.fn(),
    select: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
  };

  const mockMovieRepository = {
    count: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockRatingRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie, 'moviesConnection'),
          useValue: mockMovieRepository,
        },
        {
          provide: getRepositoryToken(Rating, 'ratingsConnection'),
          useValue: mockRatingRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated movies with default page', async () => {
      mockMovieRepository.count.mockResolvedValue(2);
      mockMovieRepository.find.mockResolvedValue(mockMovies);

      const result = await service.findAll();

      expect(result).toEqual({
        data: [
          {
            imdbId: 'tt0111161',
            title: 'The Shawshank Redemption',
            genres: ['Drama', 'Crime'],
            releaseDate: '1994-09-23',
            budget: '$25,000,000',
          },
          {
            imdbId: 'tt0068646',
            title: 'The Godfather',
            genres: ['Drama', 'Crime'],
            releaseDate: '1972-03-24',
            budget: '$6,000,000',
          },
        ],
        page: 1,
        limit: 50,
        total: 2,
        totalPages: 1,
      });

      expect(mockMovieRepository.count).toHaveBeenCalled();
      expect(mockMovieRepository.find).toHaveBeenCalledWith({
        order: { releaseDate: 'ASC' },
        skip: 0,
        take: 50,
      });
    });

    it('should return paginated movies with specified page', async () => {
      mockMovieRepository.count.mockResolvedValue(100);
      mockMovieRepository.find.mockResolvedValue(mockMovies);

      const result = await service.findAll(2);

      expect(result.page).toBe(2);
      expect(mockMovieRepository.find).toHaveBeenCalledWith({
        order: { releaseDate: 'ASC' },
        skip: 50,
        take: 50,
      });
    });

    it('should handle errors and return empty result', async () => {
      mockMovieRepository.count.mockRejectedValue(new Error('Database error'));

      const result = await service.findAll();

      expect(result).toEqual({
        data: [],
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      });
    });
  });

  describe('findById', () => {
    it('should return movie by imdbId', async () => {
      mockMovieRepository.findOne.mockResolvedValue(mockMovie);

      const result = await service.findById('tt0111161');

      expect(result).toEqual({
        imdbId: 'tt0111161',
        title: 'The Shawshank Redemption',
        genres: ['Drama', 'Crime'],
        releaseDate: '1994-09-23',
        budget: '$25,000,000',
      });

      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { imdbId: 'tt0111161' },
      });
    });

    it('should return null when movie not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);

      const result = await service.findById('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle errors and return null', async () => {
      mockMovieRepository.findOne.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await service.findById('tt0111161');

      expect(result).toBeNull();
    });
  });

  describe('findDetailById', () => {
    it('should return detailed movie information with rating', async () => {
      mockMovieRepository.findOne.mockResolvedValue(mockMovie);
      mockQueryBuilder.getRawOne.mockResolvedValue({ averageRating: 9.3 });

      const result = await service.findDetailById('tt0111161');

      expect(result).toEqual({
        imdbId: 'tt0111161',
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years...',
        releaseDate: '1994-09-23',
        budget: '$25,000,000',
        runtime: 142,
        averageRating: 9.3,
        genres: ['Drama', 'Crime'],
        originalLanguage: 'en',
        productionCompanies: ['Castle Rock Entertainment', 'Columbia Pictures'],
      });

      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { imdbId: 'tt0111161' },
      });
      expect(mockRatingRepository.createQueryBuilder).toHaveBeenCalledWith(
        'rating',
      );
    });

    it('should return movie details with zero rating when no ratings found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(mockMovie);
      mockQueryBuilder.getRawOne.mockResolvedValue({ averageRating: null });

      const result = await service.findDetailById('tt0111161');

      expect(result?.averageRating).toBe(0);
    });

    it('should return null when movie not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);

      const result = await service.findDetailById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findByYear', () => {
    it('should return movies from specified year with ascending order', async () => {
      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue([mockMovie]);

      const result = await service.findByYear(1994, 1, 'asc');

      expect(result.data).toHaveLength(1);
      expect(result.data[0].imdbId).toBe('tt0111161');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        "strftime('%Y', movie.releaseDate) = :year",
        { year: '1994' },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'movie.releaseDate',
        'ASC',
      );
    });

    it('should return movies with descending order', async () => {
      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue([mockMovie]);

      await service.findByYear(1994, 1, 'desc');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'movie.releaseDate',
        'DESC',
      );
    });

    it('should handle pagination correctly', async () => {
      mockQueryBuilder.getCount.mockResolvedValue(100);
      mockQueryBuilder.getMany.mockResolvedValue(mockMovies);

      const result = await service.findByYear(1994, 2);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(50);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(50);
      expect(result.page).toBe(2);
    });

    it('should handle errors and return empty result', async () => {
      mockQueryBuilder.getCount.mockRejectedValue(new Error('Database error'));

      const result = await service.findByYear(1994);

      expect(result).toEqual({
        data: [],
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      });
    });
  });

  describe('findByGenre', () => {
    it('should return movies with specified genre', async () => {
      mockQueryBuilder.getCount.mockResolvedValue(2);
      mockQueryBuilder.getMany.mockResolvedValue(mockMovies);

      const result = await service.findByGenre('Drama');

      expect(result.data).toHaveLength(2);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'movie.genres LIKE :genre',
        { genre: '%Drama%' },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'movie.releaseDate',
        'ASC',
      );
    });

    it('should handle pagination correctly', async () => {
      mockQueryBuilder.getCount.mockResolvedValue(100);
      mockQueryBuilder.getMany.mockResolvedValue(mockMovies);

      const result = await service.findByGenre('Action', 3);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(100);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(50);
      expect(result.page).toBe(3);
    });

    it('should handle errors and return empty result', async () => {
      mockQueryBuilder.getCount.mockRejectedValue(new Error('Database error'));

      const result = await service.findByGenre('Drama');

      expect(result).toEqual({
        data: [],
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      });
    });
  });

  describe('budget formatting', () => {
    it('should format budget correctly in findAll', async () => {
      const movieWithZeroBudget = { ...mockMovie, budget: 0 };
      mockMovieRepository.count.mockResolvedValue(1);
      mockMovieRepository.find.mockResolvedValue([movieWithZeroBudget]);

      const result = await service.findAll();

      expect(result.data[0].budget).toBe('$0');
    });

    it('should handle null budget', async () => {
      const movieWithNullBudget = { ...mockMovie, budget: null };
      mockMovieRepository.count.mockResolvedValue(1);
      mockMovieRepository.find.mockResolvedValue([movieWithNullBudget]);

      const result = await service.findAll();

      expect(result.data[0].budget).toBe('$0');
    });
  });
});
