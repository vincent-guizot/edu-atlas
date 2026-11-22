import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Region } from '../../database/models/region.model';
import { EducationIndicator } from '../../database/models/education-indicator.model';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Region) private regionModel: typeof Region,
    @InjectModel(EducationIndicator) private indicatorModel: typeof EducationIndicator,
  ) {}

  async getEnrollmentAnalytics() {
    const indicators = await this.indicatorModel.findAll({
      where: { category: 'enrollment' },
      order: [['year', 'ASC']],
    });

    const yearlyMap = new Map<number, any>();
    indicators.forEach(i => {
      if (!yearlyMap.has(i.year)) {
        yearlyMap.set(i.year, { year: i.year });
      }
      const entry = yearlyMap.get(i.year);
      entry[i.metricName] = i.value;
    });

    return Array.from(yearlyMap.values());
  }

  async getGraduationAnalytics() {
    const graduationIndicators = await this.indicatorModel.findAll({
      where: { category: 'graduation' },
      order: [['year', 'ASC']],
    });

    const levelGraduationRates = [
      { level: 'SD', rate: 99.4, dropoutRate: 0.6 },
      { level: 'SMP', rate: 98.7, dropoutRate: 1.3 },
      { level: 'SMA', rate: 98.2, dropoutRate: 1.8 },
      { level: 'SMK', rate: 96.8, dropoutRate: 3.2 },
      { level: 'Perguruan Tinggi (S1)', rate: 89.5, dropoutRate: 10.5 },
    ];

    return {
      trends: graduationIndicators,
      levelGraduationRates,
    };
  }

  async getPerformanceAnalytics() {
    const regions = await this.regionModel.findAll({
      order: [['avgPerformanceScore', 'DESC']],
    });

    const radarCategories = [
      { metric: 'Kualitas Guru', max: 100 },
      { metric: 'Kelayakan Fasilitas', max: 100 },
      { metric: 'Rasio Akreditasi A', max: 100 },
      { metric: 'Aksesibilitas Digital', max: 100 },
      { metric: 'Angka Kelulusan', max: 100 },
      { metric: 'Dukungan Riset', max: 100 },
    ];

    const radarData = [
      { region: 'Jawa & Bali', KualitasGuru: 88, Fasilitas: 85, AkreditasiA: 82, Digital: 90, Kelulusan: 99, Riset: 86 },
      { region: 'Sumatera', KualitasGuru: 78, Fasilitas: 74, AkreditasiA: 70, Digital: 76, Kelulusan: 97, Riset: 72 },
      { region: 'Kalimantan', KualitasGuru: 76, Fasilitas: 75, AkreditasiA: 68, Digital: 74, Kelulusan: 96, Riset: 69 },
      { region: 'Sulawesi', KualitasGuru: 75, Fasilitas: 72, AkreditasiA: 65, Digital: 72, Kelulusan: 96, Riset: 68 },
      { region: 'Papua & Maluku', KualitasGuru: 70, Fasilitas: 64, AkreditasiA: 52, Digital: 61, Kelulusan: 94, Riset: 58 },
    ];

    return {
      regionalScores: regions.map(r => ({
        region: r.name,
        island: r.island,
        score: r.avgPerformanceScore,
        accreditationA: r.accreditationA,
        accreditationB: r.accreditationB,
        accreditationC: r.accreditationC,
      })),
      radarCategories,
      radarData,
    };
  }

  async getDistributionAnalytics() {
    const regions = await this.regionModel.findAll();

    const islandMap = new Map<string, { schools: number; students: number; teachers: number; universities: number }>();

    regions.forEach(r => {
      if (!islandMap.has(r.island)) {
        islandMap.set(r.island, { schools: 0, students: 0, teachers: 0, universities: 0 });
      }
      const entry = islandMap.get(r.island)!;
      entry.schools += r.totalSchools;
      entry.students += r.totalStudents;
      entry.teachers += r.totalTeachers;
      entry.universities += r.totalUniversities;
    });

    const byIsland = Array.from(islandMap.entries()).map(([island, data]) => ({
      island,
      ...data,
      studentTeacherRatio: data.teachers > 0 ? Number((data.students / data.teachers).toFixed(1)) : 0,
    }));

    return {
      byIsland,
    };
  }

  async getDisparity3tAnalytics() {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(__dirname, '../../../data/disparity-3t-snapshot.json');
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch {}
    return { status: 'fallback', message: 'Disparity snapshot data unavailable' };
  }

  async getBudgetEfficiencyAnalytics() {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(__dirname, '../../../data/budget-efficiency-snapshot.json');
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch {}
    return { status: 'fallback', message: 'Budget efficiency snapshot data unavailable' };
  }

  async getForecastingBaselineAnalytics() {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(__dirname, '../../../data/forecasting-baseline-snapshot.json');
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch {}
    return { status: 'fallback', message: 'Forecasting snapshot data unavailable' };
  }

  async getPolicyBriefsAnalytics() {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(__dirname, '../../../data/policy-briefs-snapshot.json');
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch {}
    return [];
  }
}
