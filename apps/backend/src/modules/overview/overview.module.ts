import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OverviewController } from './overview.controller';
import { OverviewService } from './overview.service';
import { Region } from '../../database/models/region.model';
import { School } from '../../database/models/school.model';
import { University } from '../../database/models/university.model';
import { EducationIndicator } from '../../database/models/education-indicator.model';
import { Snapshot } from '../../database/models/snapshot.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Snapshot,
      Region,
      School,
      University,
      EducationIndicator,
    ]),
  ],
  controllers: [OverviewController],
  providers: [OverviewService],
  exports: [OverviewService],
})
export class OverviewModule {}
