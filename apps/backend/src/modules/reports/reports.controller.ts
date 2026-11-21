import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('education/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get executive education summary report' })
  @ApiQuery({ name: 'period', required: false, example: '2026' })
  getSummary(@Query('period') period?: string) {
    return this.reportsService.getExecutiveSummary(period);
  }

  @Get('export-data')
  @ApiOperation({ summary: 'Get structured export dataset (Excel/PDF compatible)' })
  @ApiQuery({ name: 'type', required: false, enum: ['all', 'regions', 'schools', 'universities'] })
  getExportData(@Query('type') type?: 'all' | 'regions' | 'schools' | 'universities') {
    return this.reportsService.getExportData(type);
  }
}
