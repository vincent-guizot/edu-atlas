import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { University } from '../../database/models/university.model';
import { AcademicProgram } from '../../database/models/academic-program.model';
import { Region } from '../../database/models/region.model';
import { UniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';

@Module({
  imports: [SequelizeModule.forFeature([University, AcademicProgram, Region])],
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
  exports: [UniversitiesService],
})
export class UniversitiesModule {}
