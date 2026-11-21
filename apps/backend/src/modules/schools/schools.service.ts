import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { School } from '../../database/models/school.model';
import { Region } from '../../database/models/region.model';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectModel(School) private schoolModel: typeof School,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    regionId?: string;
    educationLevel?: string;
    ownership?: string;
    accreditation?: string;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${query.search}%` } },
        { npsn: { [Op.iLike]: `%${query.search}%` } },
        { city: { [Op.iLike]: `%${query.search}%` } },
      ];
    }
    if (query.regionId) {
      where.regionId = query.regionId;
    }
    if (query.educationLevel) {
      where.educationLevel = query.educationLevel;
    }
    if (query.ownership) {
      where.ownership = query.ownership;
    }
    if (query.accreditation) {
      where.accreditation = query.accreditation;
    }

    const { rows, count } = await this.schoolModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']],
      include: [{ model: Region, attributes: ['name', 'island'] }],
    });

    return {
      rows,
      count,
      page,
      limit,
    };
  }

  async findById(id: string) {
    const school = await this.schoolModel.findByPk(id, {
      include: [Region],
    });
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }
}
