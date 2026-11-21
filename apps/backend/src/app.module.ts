import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { SnapshotsModule } from './modules/snapshots/snapshots.module';
import { OverviewModule } from './modules/overview/overview.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { GeographyModule } from './modules/geography/geography.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { ReportsModule } from './modules/reports/reports.module';
import { CardsModule } from './modules/cards/cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    DatabaseModule,
    HealthModule,
    SnapshotsModule,
    OverviewModule,
    SchoolsModule,
    UniversitiesModule,
    StudentsModule,
    TeachersModule,
    GeographyModule,
    AnalyticsModule,
    CalendarModule,
    ReportsModule,
    CardsModule,
  ],
})
export class AppModule {}
