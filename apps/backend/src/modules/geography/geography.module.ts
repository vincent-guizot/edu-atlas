import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Region } from '../../database/models/region.model';
import { School } from '../../database/models/school.model';
import { University } from '../../database/models/university.model';
import { GeographyController } from './geography.controller';
import { GeographyService } from './geography.service';

@Module({
  imports: [SequelizeModule.forFeature([Region, School, University])],
  controllers: [GeographyController],
  providers: [GeographyService],
  exports: [GeographyService],
})
export class GeographyModule {}
