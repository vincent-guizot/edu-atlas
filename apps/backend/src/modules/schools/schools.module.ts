import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { School } from '../../database/models/school.model';
import { Region } from '../../database/models/region.model';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';

@Module({
  imports: [SequelizeModule.forFeature([School, Region])],
  controllers: [SchoolsController],
  providers: [SchoolsService],
  exports: [SchoolsService],
})
export class SchoolsModule {}
