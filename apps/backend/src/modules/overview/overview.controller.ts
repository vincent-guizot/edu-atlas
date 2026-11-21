import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OverviewService } from './overview.service';

@ApiTags('Overview')
@Controller('education/overview')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get()
  @ApiOperation({ summary: 'Get national aggregated educational indicators' })
  @ApiQuery({ name: 'period', required: false, example: '2026' })
  @ApiQuery({ name: 'regionId', required: false })
  getOverview(
    @Query('period') period?: string,
    @Query('regionId') regionId?: string,
  ) {
    return this.overviewService.getOverviewData(period, regionId);
  }
}
