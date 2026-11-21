import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TeachersService } from './teachers.service';

@ApiTags('Teachers')
@Controller('education/teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  @ApiOperation({ summary: 'Get aggregated teacher statistics and ratios' })
  @ApiQuery({ name: 'regionId', required: false })
  getTeachers(@Query('regionId') regionId?: string) {
    return this.teachersService.getTeacherStatistics(regionId);
  }
}
