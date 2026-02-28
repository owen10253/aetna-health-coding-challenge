import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): object {
    this.logger.log('Health endpoint accessed');
    return this.appService.getHealth();
  }
}
