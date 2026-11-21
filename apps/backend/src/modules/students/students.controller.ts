import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StudentsService } from './students.service';

@ApiTags('Students')
@Controller('education/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get aggregated student statistics and distribution' })
  @ApiQuery({ name: 'regionId', required: false })
  getStudents(@Query('regionId') regionId?: string) {
    return this.studentsService.getStudentStatistics(regionId);
  }
}
