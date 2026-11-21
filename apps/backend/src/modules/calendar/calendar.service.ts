import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AcademicEvent } from '../../database/models/academic-event.model';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(AcademicEvent) private eventModel: typeof AcademicEvent,
  ) {}

  async findAll(query?: { category?: string; status?: string; targetAudience?: string }) {
    const where: any = {};
    if (query?.category) {
      where.category = query.category;
    }
    if (query?.status) {
      where.status = query.status;
    }
    if (query?.targetAudience) {
      where.targetAudience = { [Op.in]: [query.targetAudience, 'Semua'] };
    }

    return this.eventModel.findAll({
      where,
      order: [['startDate', 'ASC']],
    });
  }

  async getUpcoming() {
    return this.eventModel.findAll({
      where: {
        status: { [Op.in]: ['Upcoming', 'Ongoing'] },
      },
      order: [['startDate', 'ASC']],
      limit: 10,
    });
  }
}
