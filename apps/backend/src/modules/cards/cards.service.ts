import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { summaryQueries } from './card-queries';

export interface DataCard {
  key: string;
  title: string;
  value: number;
  secondaryLabel: string;
  secondaryValue: number;
  isDemoData: boolean;
}

@Injectable()
export class CardsService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async getCards(): Promise<DataCard[]> {
    const sql = Object.values(summaryQueries).map(query => query.sql).join(' UNION ALL ');
    return this.sequelize.query<DataCard>(`SELECT * FROM (${sql}) cards ORDER BY CASE key
      WHEN 'sources' THEN 1 WHEN 'imports' THEN 2 WHEN 'programs' THEN 3
      WHEN 'partnerships' THEN 4 WHEN 'reports' THEN 5 END`, { type: QueryTypes.SELECT });
  }
}
