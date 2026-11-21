import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('education/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('enrollment')
  @ApiOperation({ summary: 'Get enrollment trends across education levels' })
  getEnrollment() {
    return this.analyticsService.getEnrollmentAnalytics();
  }

  @Get('graduation')
  @ApiOperation({ summary: 'Get national and per-level graduation rates' })
  getGraduation() {
    return this.analyticsService.getGraduationAnalytics();
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get radar benchmarks and regional performance scores' })
  getPerformance() {
    return this.analyticsService.getPerformanceAnalytics();
  }

  @Get('distribution')
  @ApiOperation({ summary: 'Get geographical and island distribution indicators' })
  getDistribution() {
    return this.analyticsService.getDistributionAnalytics();
  }
}
