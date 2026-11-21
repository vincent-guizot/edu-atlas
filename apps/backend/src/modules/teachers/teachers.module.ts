import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Region } from '../../database/models/region.model';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';

@Module({
  imports: [SequelizeModule.forFeature([Region])],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
