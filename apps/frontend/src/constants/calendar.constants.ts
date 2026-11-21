export interface CalendarEventItem {
  id: string;
  title: string;
  start: string;
  end?: string;
  category: 'academic' | 'exam' | 'holiday' | 'workshop';
  description: string;
  scope: 'Nasional' | 'Provinsi' | 'Institusi';
}

export const CALENDAR_SNAPSHOT_DATA: CalendarEventItem[] = [
  {
    id: 'evt-001',
    title: 'Awal Tahun Ajaran 2026/2027',
    start: '2026-07-13',
    end: '2026-07-15',
    category: 'academic',
    description: 'Hari pertama masuk sekolah dan Masa Pengenalan Lingkungan Sekolah (MPLS) serentak nasional.',
    scope: 'Nasional',
  },
  {
    id: 'evt-002',
    title: 'Asesmen Nasional (ANBK) Jenjang SMA/SMK',
    start: '2026-08-24',
    end: '2026-08-27',
    category: 'exam',
    description: 'Pelaksanaan ANBK Gelombang 1 & 2 untuk jenjang SMA/SMK/MA sederajat.',
    scope: 'Nasional',
  },
  {
    id: 'evt-003',
    title: 'Penilaian Tengah Semester (PTS) Ganjil',
    start: '2026-09-21',
    end: '2026-09-26',
    category: 'exam',
    description: 'Ujian evaluasi capaian pembelajaran paruh semester ganjil.',
    scope: 'Provinsi',
  },
  {
    id: 'evt-004',
    title: 'Hari Guru Nasional & Simposium Pendidik',
    start: '2026-11-25',
    category: 'workshop',
    description: 'Peringatan Hari Guru Nasional dan workshop transformasi digital kurikulum.',
    scope: 'Nasional',
  },
  {
    id: 'evt-005',
    title: 'Penilaian Akhir Semester (PAS) Ganjil',
    start: '2026-12-01',
    end: '2026-12-11',
    category: 'exam',
    description: 'Pelaksanaan ujian akhir semester ganjil seluruh jenjang pendidikan.',
    scope: 'Nasional',
  },
  {
    id: 'evt-006',
    title: 'Libur Semester Ganjil & Tahun Baru 2027',
    start: '2026-12-21',
    end: '2027-01-02',
    category: 'holiday',
    description: 'Libur akhir semester ganjil kalender pendidikan.',
    scope: 'Nasional',
  },
];
