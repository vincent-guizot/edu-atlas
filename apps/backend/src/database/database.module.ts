import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Snapshot } from './models/snapshot.model';
import { Region } from './models/region.model';
import { School } from './models/school.model';
import { University } from './models/university.model';
import { AcademicProgram } from './models/academic-program.model';
import { EducationIndicator } from './models/education-indicator.model';
import { AcademicEvent } from './models/academic-event.model';
import { SeedService } from './seed.service';
import { CARD_MODELS } from './models/card-models';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASS', 'admin'),
        database: config.get<string>('DB_NAME', 'eduatlas_db'),
        models: [
          ...CARD_MODELS,
          Snapshot,
          Region,
          School,
          University,
          AcademicProgram,
          EducationIndicator,
          AcademicEvent,
        ],
        autoLoadModels: true,
        synchronize: false,
        logging: false,
      }),
    }),
    SequelizeModule.forFeature([
      ...CARD_MODELS,
      Snapshot,
      Region,
      School,
      University,
      AcademicProgram,
      EducationIndicator,
      AcademicEvent,
    ]),
  ],
  providers: [SeedService],
  exports: [SequelizeModule, SeedService],
})
export class DatabaseModule {}
