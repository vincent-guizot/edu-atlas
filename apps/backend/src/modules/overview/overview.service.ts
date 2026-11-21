import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Region } from '../../database/models/region.model';
import { School } from '../../database/models/school.model';
import { University } from '../../database/models/university.model';
import { EducationIndicator } from '../../database/models/education-indicator.model';
import { Snapshot } from '../../database/models/snapshot.model';

@Injectable()
export class OverviewService {
  constructor(
    @InjectModel(Snapshot) private snapshotModel: typeof Snapshot,
    @InjectModel(Region) private regionModel: typeof Region,
    @InjectModel(School) private schoolModel: typeof School,
    @InjectModel(University) private universityModel: typeof University,
    @InjectModel(EducationIndicator) private indicatorModel: typeof EducationIndicator,
  ) {}

  async getOverviewData(period = '2026', regionId?: string) {
    const snapshot = await this.snapshotModel.findOne({ order: [['snapshotDate', 'DESC']] });

    const regions = await this.regionModel.findAll();
    const filteredRegions = regionId ? regions.filter(r => r.id === regionId) : regions;

    const totalSchools = filteredRegions.reduce((sum, r) => sum + r.totalSchools, 0);
    const totalStudents = filteredRegions.reduce((sum, r) => sum + r.totalStudents, 0);
    const totalTeachers = filteredRegions.reduce((sum, r) => sum + r.totalTeachers, 0);
    const totalUniversities = filteredRegions.reduce((sum, r) => sum + r.totalUniversities, 0);
    const studentTeacherRatio = totalTeachers > 0 ? Number((totalStudents / totalTeachers).toFixed(1)) : 0;

    // Distribution by Education Level (Simulated representative proportion)
    const levelDistribution = [
      { level: 'SD (Sekolah Dasar)', count: Math.round(totalSchools * 0.58), students: Math.round(totalStudents * 0.48), color: '#153B66' },
      { level: 'SMP (Menengah Pertama)', count: Math.round(totalSchools * 0.22), students: Math.round(totalStudents * 0.24), color: '#25A9A1' },
      { level: 'SMA (Menengah Atas)', count: Math.round(totalSchools * 0.11), students: Math.round(totalStudents * 0.14), color: '#8ED8E4' },
      { level: 'SMK (Kejuruan)', count: Math.round(totalSchools * 0.09), students: Math.round(totalStudents * 0.14), color: '#FFC857' },
    ];

    // Enrollment trends from indicators table
    const indicators = await this.indicatorModel.findAll({
      where: { category: 'enrollment' },
      order: [['year', 'ASC']],
    });

    // Group indicators by year
    const trendMap = new Map<number, any>();
    indicators.forEach(ind => {
      if (!trendMap.has(ind.year)) {
        trendMap.set(ind.year, { year: ind.year });
      }
      const entry = trendMap.get(ind.year);
      entry[ind.metricName] = ind.value;
    });
    const enrollmentTrends = Array.from(trendMap.values());

    // Top Regions summary
    const topRegions = regions
      .map(r => ({
        id: r.id,
        name: r.name,
        island: r.island,
        schools: r.totalSchools,
        students: r.totalStudents,
        teachers: r.totalTeachers,
        universities: r.totalUniversities,
        performanceScore: r.avgPerformanceScore,
      }))
      .sort((a, b) => b.performanceScore - a.performanceScore);

    return {
      kpi: {
        totalSchools,
        totalStudents,
        totalTeachers,
        totalUniversities,
        studentTeacherRatio,
        avgNationalScore: 80.5,
        nationalGraduationRate: 98.9,
      },
      levelDistribution,
      enrollmentTrends,
      topRegions,
      snapshotInfo: {
        id: snapshot?.id || 'snp-2026-10-20',
        date: snapshot?.snapshotDate || '2026-10-20',
        period,
        source: snapshot?.source || 'EduAtlas Demo Dataset',
        isDemoData: true,
      },
    };
  }
}
