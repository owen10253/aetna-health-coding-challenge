import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHealth(): object {
    this.logger.log('Health check endpoint accessed');

    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'movie-services',
    };

    this.logger.debug('Health check data generated', { healthData });
    return healthData;
  }
}
