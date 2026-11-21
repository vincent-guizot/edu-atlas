import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SnapshotsService } from './snapshots.service';

@ApiTags('Snapshots')
@Controller('education/snapshots')
export class SnapshotsController {
  constructor(private readonly snapshotsService: SnapshotsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all snapshot metadata' })
  findAll() {
    return this.snapshotsService.findAll();
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest educational snapshot metadata' })
  getLatest() {
    return this.snapshotsService.getLatest();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get snapshot metadata by ID' })
  findById(@Param('id') id: string) {
    return this.snapshotsService.findById(id);
  }
}
