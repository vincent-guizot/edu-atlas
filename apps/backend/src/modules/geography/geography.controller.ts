import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GeographyService } from './geography.service';

@ApiTags('Geography')
@Controller('education/regions')
export class GeographyController {
  constructor(private readonly geographyService: GeographyService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of Indonesian regions with aggregate stats' })
  findAll() {
    return this.geographyService.findAll();
  }

  @Get('map')
  @ApiOperation({ summary: 'Get GeoJSON and institution markers for map visualization' })
  @ApiQuery({ name: 'island', required: false })
  @ApiQuery({ name: 'institutionType', required: false, enum: ['all', 'school', 'university'] })
  getMapData(
    @Query('island') island?: string,
    @Query('institutionType') institutionType?: string,
  ) {
    return this.geographyService.getMapData({ island, institutionType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get region details and institutions by ID' })
  findById(@Param('id') id: string) {
    return this.geographyService.findById(id);
  }
}
