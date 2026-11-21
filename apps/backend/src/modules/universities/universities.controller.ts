import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UniversitiesService } from './universities.service';

@ApiTags('Universities')
@Controller('education/universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of universities with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'regionId', required: false })
  @ApiQuery({ name: 'type', required: false, enum: ['PTN', 'PTS', 'PTKIN', 'Politeknik'] })
  @ApiQuery({ name: 'accreditation', required: false, enum: ['Unggul', 'Baik Sekali', 'Baik'] })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('regionId') regionId?: string,
    @Query('type') type?: string,
    @Query('accreditation') accreditation?: string,
  ) {
    return this.universitiesService.findAll({
      page,
      limit,
      search,
      regionId,
      type,
      accreditation,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get university details by ID' })
  findById(@Param('id') id: string) {
    return this.universitiesService.findById(id);
  }
}
