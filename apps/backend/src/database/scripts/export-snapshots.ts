import * as fs from 'fs';
import * as path from 'path';
import {
  SEED_REGIONS,
  SEED_SCHOOLS,
  SEED_UNIVERSITIES,
  SEED_ACADEMIC_PROGRAMS,
  SEED_INDICATORS,
  SEED_ACADEMIC_EVENTS,
} from '../seed.data';

const dataDir = path.resolve(__dirname, '../../../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. snapshots.json
const totalSchools = SEED_REGIONS.reduce((acc, r) => acc + r.totalSchools, 0);
const totalStudents = SEED_REGIONS.reduce((acc, r) => acc + r.totalStudents, 0);
const totalTeachers = SEED_REGIONS.reduce((acc, r) => acc + r.totalTeachers, 0);
const totalUniversities = SEED_REGIONS.reduce((acc, r) => acc + r.totalUniversities, 0);

const snapshots = [
  {
    id: 'snp-2026-10-20',
    snapshotDate: '2026-10-20T00:00:00.000Z',
    period: '2026',
    source: 'EduAtlas Demo Dataset',
    version: '1.0.0',
    isDemoData: true,
    totalSchools,
    totalStudents,
    totalTeachers,
    totalUniversities,
    studentTeacherRatio: Number((totalStudents / totalTeachers).toFixed(1)),
    avgNationalScore: 80.5,
    nationalGraduationRate: 98.9,
    notes: 'Simulated education snapshot for Indonesian institutions, verified for consistency.',
  },
  {
    id: 'snp-2025-10-15',
    snapshotDate: '2025-10-15T00:00:00.000Z',
    period: '2025',
    source: 'EduAtlas Demo Dataset',
    version: '0.9.0',
    isDemoData: true,
    totalSchools: Math.round(totalSchools * 0.98),
    totalStudents: Math.round(totalStudents * 0.97),
    totalTeachers: Math.round(totalTeachers * 0.98),
    totalUniversities: totalUniversities - 3,
    studentTeacherRatio: 14.1,
    avgNationalScore: 79.2,
    nationalGraduationRate: 98.4,
    notes: 'Simulated education snapshot for Indonesian institutions (2025 archival reference).',
  },
];

// 2. overview-snapshot.json
const overviewSnapshot = {
  kpi: {
    totalSchools,
    totalStudents,
    totalTeachers,
    totalUniversities,
    studentTeacherRatio: Number((totalStudents / totalTeachers).toFixed(1)),
    avgNationalScore: 80.5,
    nationalGraduationRate: 98.9,
  },
  levelDistribution: [
    { level: 'SD (Sekolah Dasar)', count: 19235641, percent: '45,2%', color: '#153B66' },
    { level: 'SMP (Sekolah Menengah Pertama)', count: 11958324, percent: '28,1%', color: '#25A9A1' },
    { level: 'SMA (Sekolah Menengah Atas)', count: 8686412, percent: '20,4%', color: '#8ED8E4' },
    { level: 'SMK (Sekolah Menengah Kejuruan)', count: 2679944, percent: '6,3%', color: '#FFC857' },
  ],
  enrollmentTrends: [
    { year: 2022, SD: 10.4, SMP: 6.1, SMA: 3.2, SMK: 1.9 },
    { year: 2023, SD: 13.0, SMP: 7.6, SMA: 4.6, SMK: 2.15 },
    { year: 2024, SD: 15.3, SMP: 9.0, SMA: 5.9, SMK: 2.35 },
    { year: 2025, SD: 17.3, SMP: 10.5, SMA: 7.3, SMK: 2.52 },
    { year: 2026, SD: 19.24, SMP: 11.96, SMA: 8.69, SMK: 2.68 },
  ],
  topProvinces: SEED_REGIONS.slice(0, 10).map((r, i) => ({
    rank: i + 1,
    id: r.id,
    name: r.name,
    island: r.island,
    students: r.totalStudents,
    schools: r.totalSchools,
    teachers: r.totalTeachers,
    universities: r.totalUniversities,
    performanceScore: r.avgPerformanceScore,
  })),
  snapshotInfo: {
    id: 'snp-2026-10-20',
    date: '2026-10-20',
    period: '2026',
    source: 'EduAtlas Demo Dataset',
    isDemoData: true,
  },
};

// 3. reports-snapshot.json
const reportsSnapshot = [
  {
    id: 'rep-001',
    title: 'Laporan Agregat Pendidikan Nasional 2026',
    category: 'National Overview',
    format: 'PDF',
    size: '4.2 MB',
    generatedAt: '2026-10-20T08:30:00Z',
    status: 'Ready',
    downloadUrl: '/api/v1/reports/download/rep-001',
  },
  {
    id: 'rep-002',
    title: 'Data Sebaran Sekolah & Akreditasi Provinsi Jawa Barat',
    category: 'Regional Detail',
    format: 'Excel',
    size: '1.8 MB',
    generatedAt: '2026-10-18T14:15:00Z',
    status: 'Ready',
    downloadUrl: '/api/v1/reports/download/rep-002',
  },
  {
    id: 'rep-003',
    title: 'Statistik APK dan APM Jenjang Dikdasmen 2022-2026',
    category: 'Indicators',
    format: 'CSV',
    size: '620 KB',
    generatedAt: '2026-10-15T09:00:00Z',
    status: 'Ready',
    downloadUrl: '/api/v1/reports/download/rep-003',
  },
  {
    id: 'rep-004',
    title: 'Katalog Program Studi Perguruan Tinggi Terakreditasi Unggul',
    category: 'Higher Education',
    format: 'PDF',
    size: '3.1 MB',
    generatedAt: '2026-10-12T11:45:00Z',
    status: 'Ready',
    downloadUrl: '/api/v1/reports/download/rep-004',
  },
];

// Write files
const filesToWrite = [
  { file: 'snapshots.json', data: snapshots },
  { file: 'overview-snapshot.json', data: overviewSnapshot },
  { file: 'regions-snapshot.json', data: SEED_REGIONS },
  { file: 'schools-snapshot.json', data: SEED_SCHOOLS },
  { file: 'universities-snapshot.json', data: SEED_UNIVERSITIES },
  { file: 'academic-programs-snapshot.json', data: SEED_ACADEMIC_PROGRAMS },
  { file: 'indicators-snapshot.json', data: SEED_INDICATORS },
  { file: 'calendar-events-snapshot.json', data: SEED_ACADEMIC_EVENTS },
  { file: 'reports-snapshot.json', data: reportsSnapshot },
];

for (const item of filesToWrite) {
  const filePath = path.join(dataDir, item.file);
  fs.writeFileSync(filePath, JSON.stringify(item.data, null, 2), 'utf-8');
  const count = Array.isArray(item.data) ? `${item.data.length} records` : 'object';
  console.log(`Exported snapshot file: ${item.file} (${count})`);
}

console.log('All snapshot files created successfully in apps/backend/data/');
