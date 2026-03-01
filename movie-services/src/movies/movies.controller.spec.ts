import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MovieListItem } from './Interfaces/movie.list.item.interface';
import { MovieDetail } from './Interfaces/movie.detail.interface';

describe('MoviesController', () => {
  let controller: MoviesController;

  const mockMovieListItem: MovieListItem = {
    imdbId: 'tt0111161',
    title: 'The Shawshank Redemption',
    genres: ['Drama'],
    releaseDate: '1994-09-23',
    budget: '$25,000,000',
  };

  const mockMovieDetail: MovieDetail = {
    imdbId: 'tt0111161',
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years...',
    releaseDate: '1994-09-23',
    budget: '$25,000,000',
    runtime: 142,
    averageRating: 9.3,
    genres: ['Drama'],
    originalLanguage: 'en',
    productionCompanies: ['Castle Rock Entertainment'],
  };

  const mockPaginatedResponse = {
    data: [mockMovieListItem],
    page: 1,
    limit: 50,
    total: 1,
    totalPages: 1,
  };

  const mockMoviesService = {
    findAll: jest.fn(),
    findByYear: jest.fn(),
    findByGenre: jest.fn(),
    findDetailById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated movies with default page', async () => {
      mockMoviesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll();

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findAll).toHaveBeenCalledWith(1);
    });

    it('should return paginated movies with specified page', async () => {
      mockMoviesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll('2');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findAll).toHaveBeenCalledWith(2);
    });

    it('should handle invalid page parameter and default to 1', async () => {
      mockMoviesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll('invalid');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findAll).toHaveBeenCalledWith(1);
    });

    it('should handle empty page parameter and default to 1', async () => {
      mockMoviesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll('');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('findByYear', () => {
    it('should return movies for specified year with default parameters', async () => {
      mockMoviesService.findByYear.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findByYear('1994');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findByYear).toHaveBeenCalledWith(1994, 1, 'asc');
    });

    it('should return movies for specified year with custom page', async () => {
      mockMoviesService.findByYear.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findByYear('1994', '2');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findByYear).toHaveBeenCalledWith(1994, 2, 'asc');
    });

    it('should return movies for specified year with descending sort', async () => {
      mockMoviesService.findByYear.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findByYear('1994', '1', 'desc');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findByYear).toHaveBeenCalledWith(
        1994,
        1,
        'desc',
      );
    });

    it('should handle invalid sort parameter and default to ascending', async () => {
      mockMoviesService.findByYear.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findByYear('1994', '1', 'invalid');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findByYear).toHaveBeenCalledWith(1994, 1, 'asc');
    });

    it('should handle case insensitive sort parameter', async () => {
      mockMoviesService.findByYear.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findByYear('1994', '1', 'DESC');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findByYear).toHaveBeenCalledWith(
        1994,
        1,
        'desc',
      );
    });

    it('should handle invalid page parameter and default to 1', async () => {
      mockMoviesService.findByYear.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findByYear('1994', 'invalid');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findByYear).toHaveBeenCalledWith(1994, 1, 'asc');
    });
  });

  describe('findByGenre', () => {
    it('should return movies for specified genre with default page', async () => {
      mockMoviesService.findByGenre.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findByGenre('Drama');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findByGenre).toHaveBeenCalledWith('Drama', 1);
    });

    it('should return movies for specified genre with custom page', async () => {
      mockMoviesService.findByGenre.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findByGenre('Action', '3');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findByGenre).toHaveBeenCalledWith('Action', 3);
    });

    it('should handle invalid page parameter and default to 1', async () => {
      mockMoviesService.findByGenre.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findByGenre('Comedy', 'invalid');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findByGenre).toHaveBeenCalledWith('Comedy', 1);
    });

    it('should handle genre names with spaces', async () => {
      mockMoviesService.findByGenre.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findByGenre('Science Fiction');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findByGenre).toHaveBeenCalledWith(
        'Science Fiction',
        1,
      );
    });

    it('should handle genre names with special characters', async () => {
      mockMoviesService.findByGenre.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findByGenre('Sci-Fi');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findByGenre).toHaveBeenCalledWith('Sci-Fi', 1);
    });
  });

  describe('findOne', () => {
    it('should return movie details for valid imdbId', async () => {
      mockMoviesService.findDetailById.mockResolvedValue(mockMovieDetail);

      const result = await controller.findOne('tt0111161');

      expect(result).toEqual(mockMovieDetail);
      expect(mockMoviesService.findDetailById).toHaveBeenCalledWith(
        'tt0111161',
      );
    });

    it('should throw NotFoundException for non-existent movie', async () => {
      mockMoviesService.findDetailById.mockResolvedValue(null);

      await expect(controller.findOne('tt9999999')).rejects.toThrow(
        'Movie with ID tt9999999 not found',
      );

      expect(mockMoviesService.findDetailById).toHaveBeenCalledWith(
        'tt9999999',
      );
    });

    it('should handle imdbId with different formats', async () => {
      mockMoviesService.findDetailById.mockResolvedValue(mockMovieDetail);

      const result = await controller.findOne('0111161');

      expect(result).toEqual(mockMovieDetail);
      expect(mockMoviesService.findDetailById).toHaveBeenCalledWith('0111161');
    });

    it('should handle service errors gracefully', async () => {
      mockMoviesService.findDetailById.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.findOne('tt0111161')).rejects.toThrow(
        'Service error',
      );
      expect(mockMoviesService.findDetailById).toHaveBeenCalledWith(
        'tt0111161',
      );
    });
  });

  describe('Parameter validation', () => {
    it('should handle zero page parameter in findAll', async () => {
      mockMoviesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll('0');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findAll).toHaveBeenCalledWith(1);
    });

    it('should handle negative page parameter in findByYear', async () => {
      mockMoviesService.findByYear.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findByYear('1994', '-1');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findByYear).toHaveBeenCalledWith(
        1994,
        -1,
        'asc',
      );
    });

    it('should handle float page parameter in findByGenre', async () => {
      mockMoviesService.findByGenre.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findByGenre('Drama', '2.5');

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockMoviesService.findByGenre).toHaveBeenCalledWith('Drama', 2);
    });
  });

  describe('Service integration', () => {
    it('should pass through service response in findAll', async () => {
      const customResponse = {
        data: [mockMovieListItem, mockMovieListItem],
        page: 2,
        limit: 50,
        total: 100,
        totalPages: 2,
      };
      mockMoviesService.findAll.mockResolvedValue(customResponse);

      const result = await controller.findAll('2');

      expect(result).toEqual(customResponse);
      expect(result.data).toHaveLength(2);
      expect(result.page).toBe(2);
      expect(result.total).toBe(100);
      expect(result.totalPages).toBe(2);
    });

    it('should pass through service response in findByYear', async () => {
      const emptyResponse = {
        data: [],
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      };
      mockMoviesService.findByYear.mockResolvedValue(emptyResponse);

      const result = await controller.findByYear('2050');

      expect(result).toEqual(emptyResponse);
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });
});
