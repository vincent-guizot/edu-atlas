import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardsService } from './cards.service';

@ApiTags('Cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  @ApiOperation({ summary: 'Get five data cards from domain tables; demo datasets are explicitly flagged' })
  async getCards() {
    const data = await this.cardsService.getCards();
    return {
      data,
      meta: {
        source: 'PostgreSQL domain tables',
        generatedAt: new Date().toISOString(),
        isDemoData: data.some(card => card.isDemoData),
      },
    };
  }
}
