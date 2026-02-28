import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return health status object', () => {
      const result = appController.getHealth();
      expect(result).toHaveProperty('status', 'OK');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('service', 'movie-services');
    });

    it('should return valid timestamp format', () => {
      const result = appController.getHealth() as any;
      expect(new Date(result.timestamp).getTime()).toBeGreaterThan(0);
    });

    it('should return positive uptime', () => {
      const result = appController.getHealth() as any;
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });
  });
});
