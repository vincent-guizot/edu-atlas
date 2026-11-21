import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Region } from '../../database/models/region.model';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Region) private regionModel: typeof Region,
  ) {}

  async getTeacherStatistics(regionId?: string) {
    const regions = await this.regionModel.findAll();
    const filtered = regionId ? regions.filter(r => r.id === regionId) : regions;

    const totalTeachers = filtered.reduce((acc, r) => acc + r.totalTeachers, 0);
    const totalStudents = filtered.reduce((acc, r) => acc + r.totalStudents, 0);

    const employmentStatus = [
      { status: 'PNS / ASN', count: Math.round(totalTeachers * 0.44), percentage: 44.0, color: '#153B66' },
      { status: 'PPPK (Pegawai Pemerintah dengan Perjanjian Kerja)', count: Math.round(totalTeachers * 0.28), percentage: 28.0, color: '#25A9A1' },
      { status: 'Guru Tetap Yayasan (Swasta)', count: Math.round(totalTeachers * 0.18), percentage: 18.0, color: '#FFC857' },
      { status: 'Guru Honorer / Kontrak', count: Math.round(totalTeachers * 0.10), percentage: 10.0, color: '#526579' },
    ];

    const certification = [
      { label: 'Tersertifikasi Pendidik', count: Math.round(totalTeachers * 0.62), percentage: 62.0 },
      { label: 'Belum Tersertifikasi', count: Math.round(totalTeachers * 0.38), percentage: 38.0 },
    ];

    const qualification = [
      { degree: 'S2 / S3', count: Math.round(totalTeachers * 0.08), percentage: 8.0 },
      { degree: 'S1 / D4', count: Math.round(totalTeachers * 0.88), percentage: 88.0 },
      { degree: 'Diploma (D1 - D3)', count: Math.round(totalTeachers * 0.04), percentage: 4.0 },
    ];

    const regionalRatios = filtered.map(r => ({
      regionId: r.id,
      regionName: r.name,
      teachers: r.totalTeachers,
      students: r.totalStudents,
      ratio: r.totalTeachers > 0 ? Number((r.totalStudents / r.totalTeachers).toFixed(1)) : 0,
    }));

    return {
      totalTeachers,
      nationalRatio: totalTeachers > 0 ? Number((totalStudents / totalTeachers).toFixed(1)) : 0,
      employmentStatus,
      certification,
      qualification,
      regionalRatios,
    };
  }
}
