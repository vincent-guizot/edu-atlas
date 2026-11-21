import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Region } from '../../database/models/region.model';
import { EducationIndicator } from '../../database/models/education-indicator.model';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Region) private regionModel: typeof Region,
    @InjectModel(EducationIndicator) private indicatorModel: typeof EducationIndicator,
  ) {}

  async getStudentStatistics(regionId?: string) {
    const regions = await this.regionModel.findAll();
    const filtered = regionId ? regions.filter(r => r.id === regionId) : regions;

    const totalStudents = filtered.reduce((acc, r) => acc + r.totalStudents, 0);

    const levelBreakdown = [
      { level: 'SD / Madrasah Ibtidaiyah', count: Math.round(totalStudents * 0.46), percentage: 46.0 },
      { level: 'SMP / Madrasah Tsanawiyah', count: Math.round(totalStudents * 0.23), percentage: 23.0 },
      { level: 'SMA / Madrasah Aliyah', count: Math.round(totalStudents * 0.14), percentage: 14.0 },
      { level: 'SMK (Kejuruan)', count: Math.round(totalStudents * 0.11), percentage: 11.0 },
      { level: 'Perguruan Tinggi', count: Math.round(totalStudents * 0.06), percentage: 6.0 },
    ];

    const genderDistribution = [
      { gender: 'Laki-laki', count: Math.round(totalStudents * 0.512), percentage: 51.2, color: '#153B66' },
      { gender: 'Perempuan', count: Math.round(totalStudents * 0.488), percentage: 48.8, color: '#25A9A1' },
    ];

    const historical = await this.indicatorModel.findAll({
      where: { category: 'enrollment' },
      order: [['year', 'ASC']],
    });

    return {
      totalStudents,
      levelBreakdown,
      genderDistribution,
      retentionRate: 94.2, // Simulated national transition rate
      grossEnrollmentRatio: {
        sd: 106.2,
        smp: 92.4,
        smaSmk: 85.8,
        perguruanTinggi: 31.5,
      },
      regionalDistribution: filtered.map(r => ({
        regionId: r.id,
        name: r.name,
        students: r.totalStudents,
      })),
    };
  }
}
