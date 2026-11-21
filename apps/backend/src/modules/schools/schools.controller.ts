import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SchoolsService } from './schools.service';

@ApiTags('Schools')
@Controller('education/schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of schools with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'regionId', required: false })
  @ApiQuery({ name: 'educationLevel', required: false, enum: ['SD', 'SMP', 'SMA', 'SMK'] })
  @ApiQuery({ name: 'ownership', required: false, enum: ['Negeri', 'Swasta'] })
  @ApiQuery({ name: 'accreditation', required: false, enum: ['A', 'B', 'C'] })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('regionId') regionId?: string,
    @Query('educationLevel') educationLevel?: string,
    @Query('ownership') ownership?: string,
    @Query('accreditation') accreditation?: string,
  ) {
    return this.schoolsService.findAll({
      page,
      limit,
      search,
      regionId,
      educationLevel,
      ownership,
      accreditation,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get school details by ID' })
  findById(@Param('id') id: string) {
    return this.schoolsService.findById(id);
  }
}
