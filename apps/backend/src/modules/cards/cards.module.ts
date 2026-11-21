import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { DatabaseModule } from '../../database/database.module';
import { PageCardsController } from './page-cards.controller';
import { PageCardsService } from './page-cards.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CardsController, PageCardsController],
  providers: [CardsService, PageCardsService],
})
export class CardsModule {}
