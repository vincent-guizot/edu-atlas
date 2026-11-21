import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Snapshot } from '../../database/models/snapshot.model';
import { SnapshotsController } from './snapshots.controller';
import { SnapshotsService } from './snapshots.service';

@Module({
  imports: [SequelizeModule.forFeature([Snapshot])],
  controllers: [SnapshotsController],
  providers: [SnapshotsService],
  exports: [SnapshotsService],
})
export class SnapshotsModule {}
