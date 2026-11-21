import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { CardFilter } from './card-queries';
import { pageCardCatalog } from './page-card-catalog';

@Injectable()
export class PageCardsService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  private page(id: string) {
    const page = pageCardCatalog.find(item => item.id === id);
    if (!page) throw new NotFoundException(`Unknown page: ${id}`);
    return page;
  }

  catalog(pageId?: string) {
    const pages = pageId ? [this.page(pageId)] : pageCardCatalog;
    return {
      data: pages.map(page => ({
        page: page.id, title: page.title, sidebarPath: page.sidebarPath,
        cards: page.cards.map(card => ({
          cardId: card.id, title: card.title,
          // Relative to API_PREFIX, so custom deployments need no hardcoded base URL.
          endpoint: `/pages/${page.id}/cards/${card.id}`,
          supported: Boolean(card.query),
          expectedStatus: card.query ? 200 : 501,
          kind: card.query?.kind ?? null,
          tables: card.query?.tables ?? [],
          filters: card.query?.filters ?? [],
          defaultLimit: card.query && card.query.kind !== 'metric' ?
            card.defaultLimit ?? (card.query.kind === 'series' ? 100 : 20) : null,
          coverage: card.query?.coverage ?? null,
          unavailableReason: card.unavailableReason ?? null,
        })),
      })),
      meta: { source: 'Page card catalog', isDemoData: null },
    };
  }

  async getCard(pageId: string, cardId: string, raw: Record<string, unknown>) {
    const page = this.page(pageId);
    const card = page.cards.find(item => item.id === cardId);
    if (!card) throw new NotFoundException(`Unknown card ${cardId} on page ${pageId}`);
    const definition = card.query;
    if (!definition) throw new NotImplementedException({
      statusCode: 501, page: pageId, cardId, message: card.unavailableReason,
    });
    const filters: Partial<Record<CardFilter, string | number>> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (!definition.filters.includes(key as CardFilter)) {
        throw new BadRequestException(`Filter ${key} is not supported by ${pageId}/${cardId}`);
      }
      if (typeof value !== 'string' || !value.trim()) {
        throw new BadRequestException(`Filter ${key} must be a single nonempty string`);
      }
      if (key === 'regionId') {
        if (!/^[a-zA-Z0-9_-]{1,100}$/.test(value)) throw new BadRequestException('Invalid regionId');
        filters.regionId = value;
      } else if (key === 'year') {
        if (!/^\d{4}$/.test(value) || Number(value) < 1900 || Number(value) > 2200) {
          throw new BadRequestException('year must be an integer from 1900 to 2200');
        }
        filters.year = Number(value);
      } else if (key === 'limit') {
        if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 100) {
          throw new BadRequestException('limit must be an integer from 1 to 100');
        }
        filters.limit = Number(value);
      } else if (key === 'date') {
        const parsed = new Date(`${value}T00:00:00Z`);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(parsed.getTime()) ||
          parsed.toISOString().slice(0, 10) !== value) {
          throw new BadRequestException('date must be a valid YYYY-MM-DD date');
        }
        filters.date = value;
      }
    }
    if (definition.kind !== 'metric') {
      filters.limit ??= card.defaultLimit ?? (definition.kind === 'series' ? 100 : 20);
    }
    if (definition.filters.includes('date')) filters.date ??= new Date().toISOString().slice(0, 10);
    const sql = definition.kind === 'series' ? `${definition.sql} LIMIT $limit` : definition.sql;
    const rows = await this.sequelize.query<Record<string, any>>(sql, {
      type: QueryTypes.SELECT,
      bind: {
        regionId: filters.regionId ?? null, year: filters.year ?? null,
        yearStart: filters.year ? `${filters.year}-01-01` : null,
        yearEnd: filters.year ? `${filters.year}-12-31` : null,
        limit: filters.limit ?? 100, date: filters.date ?? null,
      },
    });
    const demoFlags = rows.map(row => row.__demo ?? row.isDemoData);
    const knownFlags = demoFlags.filter(flag => typeof flag === 'boolean');
    const isDemoData = knownFlags.some(Boolean) ? true :
      rows.length > 0 && knownFlags.length === rows.length ? false : null;
    const results = rows.map(row => Object.fromEntries(Object.entries(row).filter(([key]) => !key.startsWith('__'))));
    return {
      data: {
        page: pageId, cardId, title: card.title, kind: definition.kind,
        result: definition.kind === 'metric' ? results[0] ?? null : results,
      },
      meta: {
        tables: definition.tables, coverage: definition.coverage, filters,
        isDemoData, provenance: isDemoData === null ? 'unverified' : 'record-flags',
        rowCount: results.length,
        ...(definition.kind === 'list' ? { totalRecords: rows[0]?.__total ?? 0 } : {}),
        ...(definition.kind === 'series' ? { possiblyTruncated: rows.length === filters.limit } : {}),
        generatedAt: new Date().toISOString(),
      },
    };
  }
}
