import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { applyMigrations } from './scripts/migrate';
import { seedAllDemoData } from './seeders/card-demo';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await applyMigrations(this.sequelize);
    if (this.config.get<string>('DB_AUTO_SEED', 'false') === 'true') {
      await this.seedDatabase();
    }
  }

  async seedDatabase() {
    await seedAllDemoData(this.sequelize);
    this.logger.log('Demo seed completed; existing records preserved.');
  }
}
