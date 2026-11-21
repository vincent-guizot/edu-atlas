export interface ReportItem {
  id: string;
  title: string;
  category: string;
  format: 'PDF' | 'Excel' | 'CSV';
  size: string;
  generatedAt: string;
  status: 'Ready' | 'Generating' | 'Failed';
  downloadUrl: string;
}

export const REPORTS_SNAPSHOT_DATA: ReportItem[] = [
  {
    id: 'rep-001',
    title: 'Laporan Agregat Pendidikan Nasional 2026',
    category: 'National Overview',
    format: 'PDF',
    size: '4.2 MB',
    generatedAt: '20 Okt 2026, 08:30 WIB',
    status: 'Ready',
    downloadUrl: '/api/v1/reports/download/rep-001',
  },
  {
    id: 'rep-002',
    title: 'Data Sebaran Sekolah & Akreditasi Provinsi Jawa Barat',
    category: 'Regional Detail',
    format: 'Excel',
    size: '1.8 MB',
    generatedAt: '18 Okt 2026, 14:15 WIB',
    status: 'Ready',
    downloadUrl: '/api/v1/reports/download/rep-002',
  },
  {
    id: 'rep-003',
    title: 'Statistik APK dan APM Jenjang Dikdasmen 2022-2026',
    category: 'Indicators',
    format: 'CSV',
    size: '620 KB',
    generatedAt: '15 Okt 2026, 09:00 WIB',
    status: 'Ready',
    downloadUrl: '/api/v1/reports/download/rep-003',
  },
  {
    id: 'rep-004',
    title: 'Katalog Program Studi Perguruan Tinggi Terakreditasi Unggul',
    category: 'Higher Education',
    format: 'PDF',
    size: '3.1 MB',
    generatedAt: '12 Okt 2026, 11:45 WIB',
    status: 'Ready',
    downloadUrl: '/api/v1/reports/download/rep-004',
  },
];
