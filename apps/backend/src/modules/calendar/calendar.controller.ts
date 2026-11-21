import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';

@ApiTags('Calendar')
@Controller('education/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  @ApiOperation({ summary: 'Get academic events and schedules' })
  @ApiQuery({ name: 'category', required: false, enum: ['Akademik', 'Ujian', 'Libur', 'Pendaftaran', 'Milestone'] })
  @ApiQuery({ name: 'status', required: false, enum: ['Upcoming', 'Ongoing', 'Completed'] })
  @ApiQuery({ name: 'targetAudience', required: false, enum: ['Semua', 'Sekolah', 'Universitas'] })
  findAll(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('targetAudience') targetAudience?: string,
  ) {
    return this.calendarService.findAll({ category, status, targetAudience });
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming events for widgets' })
  getUpcoming() {
    return this.calendarService.getUpcoming();
  }
}
