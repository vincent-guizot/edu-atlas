import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Region } from '../../database/models/region.model';
import { School } from '../../database/models/school.model';
import { University } from '../../database/models/university.model';
import { Snapshot } from '../../database/models/snapshot.model';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Snapshot) private snapshotModel: typeof Snapshot,
    @InjectModel(Region) private regionModel: typeof Region,
    @InjectModel(School) private schoolModel: typeof School,
    @InjectModel(University) private universityModel: typeof University,
  ) {}

  async getExecutiveSummary(period = '2026') {
    const snapshot = await this.snapshotModel.findOne({ order: [['snapshotDate', 'DESC']] });
    const regions = await this.regionModel.findAll();

    const totalSchools = regions.reduce((sum, r) => sum + r.totalSchools, 0);
    const totalStudents = regions.reduce((sum, r) => sum + r.totalStudents, 0);
    const totalTeachers = regions.reduce((sum, r) => sum + r.totalTeachers, 0);
    const totalUniversities = regions.reduce((sum, r) => sum + r.totalUniversities, 0);

    const highestPerforming = [...regions].sort((a, b) => b.avgPerformanceScore - a.avgPerformanceScore)[0];
    const largestStudentBase = [...regions].sort((a, b) => b.totalStudents - a.totalStudents)[0];

    return {
      title: 'Laporan Eksekutif Statistik Pendidikan Indonesia',
      snapshotId: snapshot?.id || 'snp-2026-10-20',
      snapshotDate: snapshot?.snapshotDate || '2026-10-20',
      period,
      source: snapshot?.source || 'EduAtlas Demo Dataset',
      isDemoData: true,
      summary: {
        totalSchools,
        totalStudents,
        totalTeachers,
        totalUniversities,
        studentTeacherRatio: totalTeachers > 0 ? Number((totalStudents / totalTeachers).toFixed(1)) : 0,
        avgNationalScore: 80.5,
      },
      highlights: [
        {
          topic: 'Pencapaian Mutu Terbaik',
          detail: `Wilayah dengan indeks mutu pendidikan tertinggi adalah ${highestPerforming.name} dengan skor rata-rata ${highestPerforming.avgPerformanceScore}.`,
        },
        {
          topic: 'Konsentrasi Siswa Terbesar',
          detail: `${largestStudentBase.name} menaungi populasi siswa terbesar sebanyak ${largestStudentBase.totalStudents.toLocaleString('id-ID')} siswa.`,
        },
        {
          topic: 'Rasio Kecukupan Pendidik',
          detail: 'Rasio nasional berada pada kisaran 1 guru berbanding 14.8 murid, tergolong sangat ideal menurut standar UNESCO.',
        },
      ],
      recommendations: [
        'Akselerasi peningkatan fasilitas laboratorium dan akses digital di wilayah Indonesia Timur.',
        'Pemerataan sertifikasi kompetensi pendidik pada jenjang sekolah menengah kejuruan (SMK).',
        'Peningkatan kolaborasi hilirisasi riset universitas PTN-BH dengan industri strategis nasional.',
      ],
    };
  }

  async getExportData(type: 'all' | 'regions' | 'schools' | 'universities' = 'all') {
    const snapshot = await this.snapshotModel.findOne({ order: [['snapshotDate', 'DESC']] });

    const result: any = {
      meta: {
        generatedAt: new Date().toISOString(),
        snapshotId: snapshot?.id || 'snp-2026-10-20',
        period: snapshot?.period || '2026',
        source: snapshot?.source || 'EduAtlas Demo Dataset',
        isDemoData: true,
      },
    };

    if (type === 'all' || type === 'regions') {
      const regions = await this.regionModel.findAll();
      result.regions = regions.map(r => ({
        ID: r.id,
        Provinsi: r.name,
        Pulau: r.island,
        Ibukota: r.capital,
        Total_Sekolah: r.totalSchools,
        Total_Siswa: r.totalStudents,
        Total_Guru: r.totalTeachers,
        Total_Universitas: r.totalUniversities,
        Skor_Mutu: r.avgPerformanceScore,
        Akreditasi_A: r.accreditationA,
      }));
    }

    if (type === 'all' || type === 'schools') {
      const schools = await this.schoolModel.findAll();
      result.schools = schools.map(s => ({
        ID: s.id,
        Nama_Sekolah: s.name,
        NPSN: s.npsn,
        Jenjang: s.educationLevel,
        Status: s.ownership,
        Provinsi: s.regionName,
        Kota: s.city,
        Jumlah_Siswa: s.studentCount,
        Jumlah_Guru: s.teacherCount,
        Akreditasi: s.accreditation,
        Skor_Fasilitas: s.facilitiesScore,
      }));
    }

    if (type === 'all' || type === 'universities') {
      const universities = await this.universityModel.findAll();
      result.universities = universities.map(u => ({
        ID: u.id,
        Nama_Kampus: u.name,
        Kode: u.code,
        Kategori: u.type,
        Provinsi: u.regionName,
        Kota: u.city,
        Fakultas: u.facultyCount,
        Prodi: u.programCount,
        Jumlah_Mahasiswa: u.studentCount,
        Jumlah_Dosen: u.lecturerCount,
        Akreditasi: u.accreditation,
        Peringkat_Nasional: u.nationalRank,
      }));
    }

    return result;
  }
}
