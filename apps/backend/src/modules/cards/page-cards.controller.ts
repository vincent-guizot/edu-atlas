import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PageCardsService } from './page-cards.service';

@ApiTags('Page Cards')
@Controller('pages')
export class PageCardsController {
  constructor(private readonly cards: PageCardsService) {}

  @Get()
  @ApiOperation({ summary: 'QA catalog: sidebar pages, card IDs, source tables, filters and expected statuses' })
  catalog() { return this.cards.catalog(); }

  @Get(':page/cards')
  @ApiOperation({ summary: 'List cards for one sidebar page' })
  @ApiParam({ name: 'page', example: 'overview' })
  pageCatalog(@Param('page') page: string) { return this.cards.catalog(page); }

  @Get(':page/cards/:cardId')
  @ApiOperation({ summary: 'Query exactly one card; accepted filters depend on the catalog entry' })
  @ApiParam({ name: 'page', example: 'overview' })
  @ApiParam({ name: 'cardId', example: 'total-schools' })
  @ApiQuery({ name: 'regionId', required: false })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'date', required: false, example: '2026-11-21' })
  @ApiResponse({ status: 400, description: 'Invalid, repeated or unsupported filter' })
  @ApiResponse({ status: 404, description: 'Unknown page or card' })
  @ApiResponse({ status: 501, description: 'Known UI card has no sufficient database source yet' })
  getCard(@Param('page') page: string, @Param('cardId') cardId: string,
    @Query() filters: Record<string, unknown>) {
    return this.cards.getCard(page, cardId, filters);
  }
}
