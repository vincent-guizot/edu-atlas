import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Region } from '../../database/models/region.model';
import { School } from '../../database/models/school.model';
import { University } from '../../database/models/university.model';
import { Snapshot } from '../../database/models/snapshot.model';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Snapshot,
      Region,
      School,
      University,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
