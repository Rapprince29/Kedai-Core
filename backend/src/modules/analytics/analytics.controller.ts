import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('weekly-trend')
  getWeeklyTrend() {
    return this.analyticsService.getWeeklySalesTrend();
  }
}
