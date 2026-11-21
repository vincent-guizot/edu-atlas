import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { University } from '../../database/models/university.model';
import { AcademicProgram } from '../../database/models/academic-program.model';
import { Region } from '../../database/models/region.model';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectModel(University) private universityModel: typeof University,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    regionId?: string;
    type?: string;
    accreditation?: string;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${query.search}%` } },
        { code: { [Op.iLike]: `%${query.search}%` } },
        { city: { [Op.iLike]: `%${query.search}%` } },
      ];
    }
    if (query.regionId) {
      where.regionId = query.regionId;
    }
    if (query.type) {
      where.type = query.type;
    }
    if (query.accreditation) {
      where.accreditation = query.accreditation;
    }

    const { rows, count } = await this.universityModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['nationalRank', 'ASC']],
      include: [
        { model: Region, attributes: ['name', 'island'] },
        { model: AcademicProgram, attributes: ['id', 'name', 'degree', 'faculty', 'studentCount'] },
      ],
    });

    return {
      rows,
      count,
      page,
      limit,
    };
  }

  async findById(id: string) {
    const univ = await this.universityModel.findByPk(id, {
      include: [Region, AcademicProgram],
    });
    if (!univ) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return univ;
  }
}
