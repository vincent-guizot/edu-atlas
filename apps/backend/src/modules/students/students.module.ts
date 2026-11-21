import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Region } from '../../database/models/region.model';
import { EducationIndicator } from '../../database/models/education-indicator.model';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [SequelizeModule.forFeature([Region, EducationIndicator])],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
