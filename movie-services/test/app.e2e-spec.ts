import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Movie Services API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'OK');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('uptime');
          expect(res.body).toHaveProperty('service', 'movie-services');
        });
    });
  });

  describe('/movies (GET)', () => {
    it('should return paginated movies list', () => {
      return request(app.getHttpServer())
        .get('/movies?page=1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('page', 1);
          expect(res.body).toHaveProperty('limit');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('totalPages');
          expect(Array.isArray(res.body.data)).toBe(true);
          
          // Check movie structure if data exists
          if (res.body.data.length > 0) {
            const movie = res.body.data[0];
            expect(movie).toHaveProperty('imdbId');
            expect(movie).toHaveProperty('title');
            expect(movie).toHaveProperty('genres');
            expect(movie).toHaveProperty('releaseDate');
            expect(movie).toHaveProperty('budget');
          }
        });
    });

    it('should handle different page numbers', () => {
      return request(app.getHttpServer())
        .get('/movies?page=2')
        .expect(200)
        .expect((res) => {
          expect(res.body.page).toBe(2);
        });
    });
  });

  describe('/movies/year/:year (GET)', () => {
    it('should return movies by year with ascending sort', () => {
      return request(app.getHttpServer())
        .get('/movies/year/2020?page=1&sort=asc')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('page', 1);
          expect(res.body).toHaveProperty('total');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should return movies by year with descending sort', () => {
      return request(app.getHttpServer())
        .get('/movies/year/2020?page=1&sort=desc')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('/movies/genre/:genre (GET)', () => {
    it('should return movies by genre', () => {
      return request(app.getHttpServer())
        .get('/movies/genre/Action?page=1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('page', 1);
          expect(res.body).toHaveProperty('total');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should handle genre with spaces', () => {
      return request(app.getHttpServer())
        .get('/movies/genre/Science Fiction?page=1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('/movies/:id (GET)', () => {
    it('should return movie details for valid ID', async () => {
      // First get a list of movies to find a valid ID
      const moviesResponse = await request(app.getHttpServer())
        .get('/movies?page=1')
        .expect(200);

      if (moviesResponse.body.data.length > 0) {
        const validId = moviesResponse.body.data[0].imdbId;
        
        if (validId) {
          return request(app.getHttpServer())
            .get(`/movies/${validId}`)
            .expect(200)
            .expect((res) => {
              expect(res.body).toHaveProperty('imdbId');
              expect(res.body).toHaveProperty('title');
              expect(res.body).toHaveProperty('description');
              expect(res.body).toHaveProperty('releaseDate');
              expect(res.body).toHaveProperty('budget');
              expect(res.body).toHaveProperty('runtime');
              expect(res.body).toHaveProperty('averageRating');
              expect(res.body).toHaveProperty('genres');
              expect(res.body).toHaveProperty('originalLanguage');
              expect(res.body).toHaveProperty('productionCompanies');
            });
        }
      }
    });

    it('should return 404 for non-existent movie ID', () => {
      return request(app.getHttpServer())
        .get('/movies/tt9999999')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Movie with ID tt9999999 not found');
        });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid year parameter', () => {
      return request(app.getHttpServer())
        .get('/movies/year/invalid')
        .expect(200);
    });

    it('should handle negative page numbers gracefully', () => {
      return request(app.getHttpServer())
        .get('/movies?page=-1')
        .expect(200)
        .expect((res) => {
          expect(res.body.page).toBeGreaterThanOrEqual(1);
        });
    });

    it('should handle non-numeric page parameters', () => {
      return request(app.getHttpServer())
        .get('/movies?page=abc')
        .expect(200)
        .expect((res) => {
          expect(res.body.page).toBe(1);
        });
    });
  });

  describe('Response Headers', () => {
    it('should return JSON content type', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect('Content-Type', /json/);
    });
  });
});
