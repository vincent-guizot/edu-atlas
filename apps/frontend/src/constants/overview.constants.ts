export interface KpiMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
}

export const OVERVIEW_KPIS: KpiMetric[] = [
  {
    title: 'Total Sekolah Terdaftar',
    value: '125.482',
    change: '+2,4%',
    isPositive: true,
    subtext: 'vs tahun ajaran 2024/2025',
  },
  {
    title: 'Total Siswa Aktif',
    value: '42.560.321',
    change: '+1,8%',
    isPositive: true,
    subtext: 'seluruh jenjang (SD - SMA/SMK)',
  },
  {
    title: 'Total Guru & Pengajar',
    value: '3.128.450',
    change: '+3,1%',
    isPositive: true,
    subtext: 'rasio siswa-guru 13,6 : 1',
  },
  {
    title: 'Perguruan Tinggi Aktif',
    value: '4.521',
    change: '+0,8%',
    isPositive: true,
    subtext: 'PTN, PTS, PTK terakreditasi',
  },
];

export const OVERVIEW_TREND_DATA = [
  { year: '2022', SD: 10.4, SMP: 6.1, SMA: 3.2, SMK: 1.9 },
  { year: '2023', SD: 13.0, SMP: 7.6, SMA: 4.6, SMK: 2.15 },
  { year: '2024', SD: 15.3, SMP: 9.0, SMA: 5.9, SMK: 2.35 },
  { year: '2025', SD: 17.3, SMP: 10.5, SMA: 7.3, SMK: 2.52 },
  { year: '2026', SD: 19.24, SMP: 11.96, SMA: 8.69, SMK: 2.68 },
];

export const OVERVIEW_DISTRIBUTION_DATA = [
  { name: 'SD (Sekolah Dasar)', value: 19235641, percent: '45,2%', color: '#153B66' },
  { name: 'SMP (Sekolah Menengah Pertama)', value: 11958324, percent: '28,1%', color: '#25A9A1' },
  { name: 'SMA (Sekolah Menengah Atas)', value: 8686412, percent: '20,4%', color: '#8ED8E4' },
  { name: 'SMK (Sekolah Menengah Kejuruan)', value: 2679944, percent: '6,3%', color: '#FFC857' },
];

export const OVERVIEW_TOP_PROVINCES = [
  { rank: 1, name: 'Jawa Barat', students: '8.421.235', yoy: '+3,6%', schools: '18.254' },
  { rank: 2, name: 'Jawa Timur', students: '6.982.114', yoy: '+3,1%', schools: '15.892' },
  { rank: 3, name: 'Jawa Tengah', students: '5.421.773', yoy: '+2,9%', schools: '12.840' },
  { rank: 4, name: 'DKI Jakarta', students: '4.125.662', yoy: '+2,5%', schools: '8.412' },
  { rank: 5, name: 'Sumatera Utara', students: '2.984.331', yoy: '+3,0%', schools: '7.621' },
  { rank: 6, name: 'Banten', students: '2.654.882', yoy: '+2,7%', schools: '6.418' },
  { rank: 7, name: 'Sulawesi Selatan', students: '2.421.773', yoy: '+3,2%', schools: '5.893' },
  { rank: 8, name: 'Lampung', students: '1.982.441', yoy: '+2,8%', schools: '4.712' },
  { rank: 9, name: 'Riau', students: '1.862.551', yoy: '+2,6%', schools: '4.125' },
  { rank: 10, name: 'Sumatera Selatan', students: '1.641.930', yoy: '+2,9%', schools: '3.984' },
];

export const OVERVIEW_SNAPSHOT_META = {
  id: 'snp-2026-10-20',
  date: '2026-10-20',
  period: '2026',
  source: 'EduAtlas Demo Dataset',
  isDemoData: true,
  lastUpdated: '20 Okt 2026, 10:24 WIB',
};
