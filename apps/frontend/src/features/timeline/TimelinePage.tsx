import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  MoreHorizontal,
  ZoomIn,
  ZoomOut,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Flag,
  X,
  Sliders,
  List as ListIcon,
  CalendarDays,
  Check,
  ChevronLeft,
  ArrowRight,
  Eye,
  Building2,
  Sparkles,
  TrendingUp,
  BarChart2,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from 'recharts';

export interface GanttSubTask {
  id: string;
  name: string;
  programId: string;
  category: string;
  startDate: string;
  endDate: string;
  duration: string;
  startMonthIdx: number; // 0 to 11
  endMonthIdx: number; // 0 to 11
  color: string;
  status: 'Selesai' | 'Berjalan' | 'Belum Mulai';
  progress: number;
  description: string;
  organizer: string;
  target: string;
}

export interface GanttProgram {
  id: string;
  num: number;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  duration: string;
  startMonthIdx: number;
  endMonthIdx: number;
  color: string;
  status: 'Selesai' | 'Berjalan' | 'Belum Mulai';
  progress: number;
  description: string;
  organizer: string;
  target: string;
  subTasks: GanttSubTask[];
}

export interface ModalActivityItem {
  id: string | number;
  title: string;
  programName?: string;
  category: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: 'Selesai' | 'Berjalan' | 'Belum Mulai';
  progress: number;
  color: string;
  description: string;
  organizer: string;
  target: string;
}

export const GANTT_PROGRAMS: GanttProgram[] = [
  {
    id: 'prog-1',
    num: 1,
    name: 'Penerimaan Peserta Didik Baru (PPDB)',
    category: 'PPDB',
    startDate: '01 Jan 2026',
    endDate: '30 Jun 2026',
    duration: '181 hari',
    startMonthIdx: 0,
    endMonthIdx: 5,
    color: '#0284C7',
    status: 'Berjalan',
    progress: 40,
    description: 'Rangkaian seleksi dan penerimaan siswa baru jenjang SD, SMP, SMA, dan SMK secara serentak.',
    organizer: 'Dinas Pendidikan & Kemendikdasmen',
    target: 'Calon Peserta Didik Baru se-Indonesia',
    subTasks: [
      {
        id: 'sub-1-1',
        name: 'Sosialisasi PPDB',
        programId: 'prog-1',
        category: 'PPDB',
        startDate: '01 Jan 2026',
        endDate: '31 Jan 2026',
        duration: '31 hari',
        startMonthIdx: 0,
        endMonthIdx: 0.9,
        color: '#38BDF8',
        status: 'Selesai',
        progress: 100,
        description: 'Penyuluhan juknis jalur zonasi, afirmasi, perpindahan tugas orang tua, dan prestasi.',
        organizer: 'Panitia PPDB Daerah',
        target: 'Orang tua dan sekolah',
      },
      {
        id: 'sub-1-2',
        name: 'Pendaftaran PPDB',
        programId: 'prog-1',
        category: 'PPDB',
        startDate: '01 Feb 2026',
        endDate: '28 Feb 2026',
        duration: '28 hari',
        startMonthIdx: 1,
        endMonthIdx: 1.9,
        color: '#38BDF8',
        status: 'Berjalan',
        progress: 65,
        description: 'Pengajuan akun, aktivasi token, dan pemilihan sekolah pilihan secara daring.',
        organizer: 'Portal PPDB Online',
        target: 'Calon Siswa Baru',
      },
      {
        id: 'sub-1-3',
        name: 'Seleksi PPDB',
        programId: 'prog-1',
        category: 'PPDB',
        startDate: '01 Mar 2026',
        endDate: '31 Mar 2026',
        duration: '31 hari',
        startMonthIdx: 2,
        endMonthIdx: 2.9,
        color: '#38BDF8',
        status: 'Belum Mulai',
        progress: 0,
        description: 'Pemeringkatan otomatis berdasarkan jarak domisili, nilai rapor, dan sertifikat prestasi.',
        organizer: 'Sistem Seleksi Terpusat',
        target: 'Pendaftar Terverifikasi',
      },
      {
        id: 'sub-1-4',
        name: 'Pengumuman PPDB',
        programId: 'prog-1',
        category: 'PPDB',
        startDate: '01 Apr 2026',
        endDate: '07 Apr 2026',
        duration: '7 hari',
        startMonthIdx: 3,
        endMonthIdx: 3.25,
        color: '#0284C7',
        status: 'Belum Mulai',
        progress: 0,
        description: 'Publikasi hasil akhir seleksi calon siswa yang diterima di tiap satuan pendidikan.',
        organizer: 'Dinas Pendidikan',
        target: 'Publik & Sekolah',
      },
      {
        id: 'sub-1-5',
        name: 'Daftar Ulang',
        programId: 'prog-1',
        category: 'PPDB',
        startDate: '08 Apr 2026',
        endDate: '30 Apr 2026',
        duration: '23 hari',
        startMonthIdx: 3.25,
        endMonthIdx: 3.9,
        color: '#38BDF8',
        status: 'Belum Mulai',
        progress: 0,
        description: 'Penyelesaian administrasi dan pemberkasan ulang siswa yang telah diterima.',
        organizer: 'Satuan Pendidikan Masing-masing',
        target: 'Siswa Diterima',
      },
    ],
  },
  {
    id: 'prog-2',
    num: 2,
    name: 'Pelaksanaan Kegiatan Belajar Mengajar',
    category: 'Pembelajaran',
    startDate: '05 Jan 2026',
    endDate: '18 Des 2026',
    duration: '348 hari',
    startMonthIdx: 0.15,
    endMonthIdx: 11.6,
    color: '#059669',
    status: 'Berjalan',
    progress: 35,
    description: 'Siklus pembelajaran terstruktur Kurikulum Merdeka semester genap dan ganjil.',
    organizer: 'Ditjen Guru dan Tenaga Kependidikan',
    target: 'Guru dan Siswa',
    subTasks: [
      {
        id: 'sub-2-1',
        name: 'Orientasi Siswa Baru (MPLS)',
        programId: 'prog-2',
        category: 'Pembelajaran',
        startDate: '05 Jan 2026',
        endDate: '15 Jan 2026',
        duration: '11 hari',
        startMonthIdx: 0.1,
        endMonthIdx: 0.5,
        color: '#34D399',
        status: 'Selesai',
        progress: 100,
        description: 'Pengenalan lingkungan sekolah, tata tertib, dan bimbingan konseling awal semester.',
        organizer: 'Komite Kesiswaan & OSIS',
        target: 'Siswa Baru',
      },
      {
        id: 'sub-2-2',
        name: 'Evaluasi Belajar Semester Genap',
        programId: 'prog-2',
        category: 'Pembelajaran',
        startDate: '10 Jan 2026',
        endDate: '20 Jan 2026',
        duration: '11 hari',
        startMonthIdx: 0.3,
        endMonthIdx: 0.65,
        color: '#34D399',
        status: 'Selesai',
        progress: 100,
        description: 'Review capaian pembelajaran dan penyusunan modul ajar terdiferensiasi.',
        organizer: 'Musyawarah Guru Mapel',
        target: 'Dewan Guru',
      },
      {
        id: 'sub-2-3',
        name: 'Semester Ganjil 2026/2027',
        programId: 'prog-2',
        category: 'Pembelajaran',
        startDate: '13 Jul 2026',
        endDate: '04 Des 2026',
        duration: '145 hari',
        startMonthIdx: 6.4,
        endMonthIdx: 11.1,
        color: '#34D399',
        status: 'Belum Mulai',
        progress: 0,
        description: 'Pelaksanaan KBM efektif semester ganjil tahun ajaran baru.',
        organizer: 'Seluruh Sekolah',
        target: 'Siswa SD - SMA/SMK',
      },
      {
        id: 'sub-2-4',
        name: 'Penilaian Akhir Semester',
        programId: 'prog-2',
        category: 'Pembelajaran',
        startDate: '07 Des 2026',
        endDate: '18 Des 2026',
        duration: '12 hari',
        startMonthIdx: 11.2,
        endMonthIdx: 11.6,
        color: '#34D399',
        status: 'Belum Mulai',
        progress: 0,
        description: 'Asesmen sumatif akhir semester dan pelaporan hasil belajar (Rapor).',
        organizer: 'Satuan Pendidikan',
        target: 'Siswa',
      },
    ],
  },
  {
    id: 'prog-3',
    num: 3,
    name: 'Ujian Nasional & Asesmen Terpadu',
    category: 'Ujian',
    startDate: '15 Jan 2026',
    endDate: '30 Apr 2026',
    duration: '106 hari',
    startMonthIdx: 0.5,
    endMonthIdx: 3.9,
    color: '#7C3AED',
    status: 'Berjalan',
    progress: 30,
    description: 'Asesmen Nasional, UTBK-SNBT, dan evaluasi capaian mutu literasi serta numerasi.',
    organizer: 'Badan Standar, Kurikulum, & Asesmen Pendidikan',
    target: 'Peserta Ujian Nasional',
    subTasks: [
      {
        id: 'sub-3-1',
        name: 'Simulasi Sistem Ujian CBT',
        programId: 'prog-3',
        category: 'Ujian',
        startDate: '15 Jan 2026',
        endDate: '25 Jan 2026',
        duration: '11 hari',
        startMonthIdx: 0.5,
        endMonthIdx: 0.8,
        color: '#C084FC',
        status: 'Selesai',
        progress: 100,
        description: 'Uji beban server dan kesiapan infrastruktur komputer laboratorium sekolah.',
        organizer: 'Pusmenjar',
        target: 'Sekolah Penyelenggara',
      },
      {
        id: 'sub-3-2',
        name: 'Try Out Asesmen Nasional',
        programId: 'prog-3',
        category: 'Ujian',
        startDate: '01 Mar 2026',
        endDate: '31 Mar 2026',
        duration: '31 hari',
        startMonthIdx: 2,
        endMonthIdx: 2.9,
        color: '#C084FC',
        status: 'Belum Mulai',
        progress: 0,
        description: 'Simulasi asesmen kompetensi minimum bagi siswa kelas 5, 8, dan 11.',
        organizer: 'Musyawarah Kerja Kepala Sekolah',
        target: 'Siswa Peserta Ujian',
      },
      {
        id: 'sub-3-3',
        name: 'Pelaksanaan Ujian Nasional',
        programId: 'prog-3',
        category: 'Ujian',
        startDate: '01 Apr 2026',
        endDate: '30 Apr 2026',
        duration: '30 hari',
        startMonthIdx: 3,
        endMonthIdx: 3.9,
        color: '#C084FC',
        status: 'Belum Mulai',
        progress: 0,
        description: 'Pelaksanaan asesmen sumatif terstandar nasional secara digital.',
        organizer: 'Kemendikbudristek',
        target: 'Siswa Tingkat Akhir',
      },
    ],
  },
  {
    id: 'prog-4',
    num: 4,
    name: 'Program Beasiswa Pendidikan',
    category: 'Beasiswa',
    startDate: '01 Feb 2026',
    endDate: '31 Mei 2026',
    duration: '120 hari',
    startMonthIdx: 1,
    endMonthIdx: 4.9,
    color: '#D97706',
    status: 'Berjalan',
    progress: 45,
    description: 'Penyaluran Program Indonesia Pintar (PIP), beasiswa afirmasi, dan talenta berprestasi.',
    organizer: 'Puslapdik Kemendikbud',
    target: 'Siswa Kategori Kurang Mampu & Berprestasi',
    subTasks: [
      {
        id: 'sub-4-1',
        name: 'Pendaftaran Beasiswa PIP',
        programId: 'prog-4',
        category: 'Beasiswa',
        startDate: '01 Feb 2026',
        endDate: '31 Mar 2026',
        duration: '59 hari',
        startMonthIdx: 1,
        endMonthIdx: 2.9,
        color: '#FBBF24',
        status: 'Berjalan',
        progress: 55,
        description: 'Pengusulan DTKS dan verifikasi kelayakan calon penerima bantuan pendidikan.',
        organizer: 'Puslapdik & Sekolah',
        target: 'Siswa Eligible',
      },
      {
        id: 'sub-4-2',
        name: 'Seleksi Berkas & Verifikasi',
        programId: 'prog-4',
        category: 'Beasiswa',
        startDate: '01 Apr 2026',
        endDate: '30 Apr 2026',
        duration: '30 hari',
        startMonthIdx: 3,
        endMonthIdx: 3.9,
        color: '#FBBF24',
        status: 'Belum Mulai',
        progress: 0,
        description: 'Pencocokan data kependudukan dan validasi rekening simpanan pelajar.',
        organizer: 'Bank Himbara & Tim Verifikator',
        target: 'Pendaftar Beasiswa',
      },
      {
        id: 'sub-4-3',
        name: 'Pengumuman & Pencairan',
        programId: 'prog-4',
        category: 'Beasiswa',
        startDate: '01 Mei 2026',
        endDate: '31 Mei 2026',
        duration: '31 hari',
        startMonthIdx: 4,
        endMonthIdx: 4.9,
        color: '#FBBF24',
        status: 'Belum Mulai',
        progress: 0,
        description: 'Penerbitan SK penerima dan penyaluran dana langsung ke rekening siswa.',
        organizer: 'Kemendikbud',
        target: 'Penerima Beasiswa',
      },
    ],
  },
  {
    id: 'prog-5',
    num: 5,
    name: 'Infrastruktur & Digitalisasi Sekolah',
    category: 'Infrastruktur',
    startDate: '15 Jan 2026',
    endDate: '31 Agu 2026',
    duration: '229 hari',
    startMonthIdx: 0.5,
    endMonthIdx: 7.9,
    color: '#06B6D4',
    status: 'Berjalan',
    progress: 35,
    description: 'Peningkatan sarana digital sekolah, laboratorium TIK, dan konektivitas daerah 3T.',
    organizer: 'Biro Umum & Pengadaan Barang/Jasa',
    target: 'Sekolah Sasaran Transformasi Digital',
    subTasks: [
      {
        id: 'sub-5-1',
        name: 'Pengadaan Perangkat TIK',
        programId: 'prog-5',
        category: 'Infrastruktur',
        startDate: '15 Jan 2026',
        endDate: '15 Apr 2026',
        duration: '91 hari',
        startMonthIdx: 0.5,
        endMonthIdx: 3.5,
        color: '#22D3EE',
        status: 'Berjalan',
        progress: 50,
        description: 'Distribusi Chromebook, proyektor nirkabel, dan modem internet satelit.',
        organizer: 'Ditjen Paudasmen',
        target: 'Laboratorium Sekolah',
      },
      {
        id: 'sub-5-2',
        name: 'Peningkatan Jaringan Internet',
        programId: 'prog-5',
        category: 'Infrastruktur',
        startDate: '01 Mei 2026',
        endDate: '31 Agu 2026',
        duration: '123 hari',
        startMonthIdx: 4,
        endMonthIdx: 7.9,
        color: '#22D3EE',
        status: 'Belum Mulai',
        progress: 0,
        description: 'Pemasangan fiber optik dan penguatan sinyal BTS seluler sekolah terpencil.',
        organizer: 'Kemenkomdigi & Kemendikbud',
        target: 'Sekolah Daerah 3T',
      },
    ],
  },
  {
    id: 'prog-6',
    num: 6,
    name: 'Pengembangan & Pelatihan Guru',
    category: 'Lainnya',
    startDate: '08 Jan 2026',
    endDate: '28 Jan 2026',
    duration: '21 hari',
    startMonthIdx: 0.25,
    endMonthIdx: 0.9,
    color: '#94A3B8',
    status: 'Selesai',
    progress: 100,
    description: 'Pelatihan berkelanjutan guru penggerak, kepala sekolah, dan pengawas.',
    organizer: 'Balai Guru Penggerak (BGP)',
    target: 'Tenaga Pendidik',
    subTasks: [
      {
        id: 'sub-6-1',
        name: 'Pelatihan Guru Inspiratif',
        programId: 'prog-6',
        category: 'Lainnya',
        startDate: '08 Jan 2026',
        endDate: '28 Jan 2026',
        duration: '21 hari',
        startMonthIdx: 0.25,
        endMonthIdx: 0.9,
        color: '#CBD5E1',
        status: 'Selesai',
        progress: 100,
        description: 'Workshop pemanfaatan kecerdasan buatan (AI) dalam pembuatan materi pembelajaran interaktif.',
        organizer: 'Balai Penjaminan Mutu Pendidikan',
        target: 'Guru Terdaftar',
      },
    ],
  },
];

// Flat activities dataset (18 activities)
export const ALL_ACTIVITIES = GANTT_PROGRAMS.flatMap((prog) =>
  prog.subTasks.map((sub, sIdx) => ({
    id: `${prog.num}-${sIdx + 1}`,
    name: sub.name,
    programName: prog.name,
    category: prog.category,
    start: sub.startDate,
    end: sub.endDate,
    duration: sub.duration,
    status: sub.status,
    progress: sub.progress,
    color: prog.color,
    description: sub.description,
    organizer: sub.organizer,
    target: sub.target,
  }))
);

// 7 Key milestones
export const MILESTONES_2026 = [
  {
    id: 'm-1',
    date: '1 Jan 2026',
    title: 'Mulai Sosialisasi PPDB Nasional',
    color: '#0284C7',
    category: 'PPDB',
    description: 'Dimulainya publikasi pedoman petunjuk teknis penerimaan siswa baru seluruh jalur.',
    organizer: 'Kementerian Pendidikan Dasar & Menengah',
  },
  {
    id: 'm-2',
    date: '1 Feb 2026',
    title: 'Pembukaan Pendaftaran PPDB',
    color: '#10B981',
    category: 'PPDB',
    description: 'Pembukaan registrasi akun calon siswa baru melalui platform terintegrasi provinsi.',
    organizer: 'Dinas Pendidikan Provinsi & Kabupaten/Kota',
  },
  {
    id: 'm-3',
    date: '1 Apr 2026',
    title: 'Pengumuman Hasil Seleksi PPDB',
    color: '#F59E0B',
    category: 'PPDB',
    description: 'Pengumuman serentak hasil verifikasi berkas dan kuota zonasi peserta didik.',
    organizer: 'Panitia PPDB Terpusat',
  },
  {
    id: 'm-4',
    date: '1 Apr 2026',
    title: 'Pelaksanaan Ujian Nasional',
    color: '#0284C7',
    category: 'Ujian',
    description: 'Pelaksanaan serentak asesmen sumatif akhir jenjang berbasis komputer.',
    organizer: 'Badan Standar Nasional Pendidikan',
  },
  {
    id: 'm-5',
    date: '13 Jul 2026',
    title: 'Mulai Semester Ganjil 2026/2027',
    color: '#10B981',
    category: 'Pembelajaran',
    description: 'Hari pertama tahun ajaran baru 2026/2027 bagi seluruh jenjang pendidikan di Indonesia.',
    organizer: 'Satuan Pendidikan Nasional',
  },
  {
    id: 'm-6',
    date: '4 Des 2026',
    title: 'Akhir Semester Ganjil',
    color: '#25A9A1',
    category: 'Pembelajaran',
    description: 'Penuntasan seluruh agenda pembelajaran dan evaluasi modul ajar semester ganjil.',
    organizer: 'Dewan Guru & Manajemen Sekolah',
  },
  {
    id: 'm-7',
    date: '31 Des 2026',
    title: 'Akhir Tahun Ajaran Kalender',
    color: '#25A9A1',
    category: 'Lainnya',
    description: 'Tutup buku kalender akademik tahun 2026 dan konsolidasi rapor digital Dapodik.',
    organizer: 'Pusdatin Kemendikbudristek',
  },
];

const MONTHS_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// Chart Data 1: Monthly Workload / Active Activities per Month
export const MONTHLY_WORKLOAD_DATA = [
  { month: 'Jan', count: 6, color: '#38BDF8', highlight: false },
  { month: 'Feb', count: 8, color: '#38BDF8', highlight: false },
  { month: 'Mar', count: 11, color: '#0284C7', highlight: true }, // Peak 1
  { month: 'Apr', count: 10, color: '#0284C7', highlight: true }, // Peak 2
  { month: 'Mei', count: 7, color: '#38BDF8', highlight: false },
  { month: 'Jun', count: 5, color: '#94A3B8', highlight: false }, // Low
  { month: 'Jul', count: 8, color: '#10B981', highlight: false },
  { month: 'Agu', count: 6, color: '#10B981', highlight: false },
  { month: 'Sep', count: 7, color: '#10B981', highlight: false },
  { month: 'Okt', count: 8, color: '#10B981', highlight: false },
  { month: 'Nov', count: 6, color: '#10B981', highlight: false },
  { month: 'Des', count: 4, color: '#94A3B8', highlight: false }, // Low
];

// Chart Data 2: S-Curve Progress Trajectory (Planned vs Actual Target)
export const SCURVE_PROGRESS_DATA = [
  { month: 'Jan', target: 8, actual: 12 },
  { month: 'Feb', target: 18, actual: 24 },
  { month: 'Mar', target: 30, actual: 35 },
  { month: 'Apr', target: 45, actual: 48 },
  { month: 'Mei', target: 58, actual: null },
  { month: 'Jun', target: 68, actual: null },
  { month: 'Jul', target: 76, actual: null },
  { month: 'Agu', target: 84, actual: null },
  { month: 'Sep', target: 90, actual: null },
  { month: 'Okt', target: 94, actual: null },
  { month: 'Nov', target: 98, actual: null },
  { month: 'Des', target: 100, actual: null },
];

// Chart Data 3: Operational Days by Program Category
export const DURATION_BY_CATEGORY_DATA = [
  { category: 'Pembelajaran', days: 348, color: '#10B981' },
  { category: 'Infrastruktur', days: 229, color: '#06B6D4' },
  { category: 'PPDB', days: 181, color: '#0284C7' },
  { category: 'Beasiswa', days: 120, color: '#F59E0B' },
  { category: 'Ujian', days: 106, color: '#7C3AED' },
  { category: 'Lainnya', days: 21, color: '#94A3B8' },
];

export const TimelinePage: React.FC = () => {
  // Top Navigation Category Tabs
  const [activeTab, setActiveTab] = useState('Program Nasional');

  // View Mode: 'Gantt View' | 'Timeline View' | 'List View'
  const [viewMode, setViewMode] = useState<'Gantt View' | 'Timeline View' | 'List View'>('Gantt View');

  // Zoom scale for Gantt chart
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [granularity, setGranularity] = useState<'Bulan' | 'Minggu' | 'Hari'>('Bulan');

  // "Timeline nya isi nya jgn dropdown kecuali nomor 1"
  // Default: ONLY prog-1 is expanded (true), all others are false!
  const [expandedPrograms, setExpandedPrograms] = useState<Record<string, boolean>>({
    'prog-1': true,
    'prog-2': false,
    'prog-3': false,
    'prog-4': false,
    'prog-5': false,
    'prog-6': false,
  });

  const toggleProgram = (id: string) => {
    setExpandedPrograms((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Modal State: "bar yg di dlm Gantt nya bisa di modals ya"
  const [modalItem, setModalItem] = useState<ModalActivityItem | null>(null);

  // Daftar Kegiatan State
  const [searchActivity, setSearchActivity] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua Kategori');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // "dropdown Semua Program buat fix" in Ringkasan Program
  const [selectedSummaryProgram, setSelectedSummaryProgram] = useState<string>('Semua Program');

  // Interactive Chart Mode in Section Grafik: 'Beban Bulanan' | 'Kurva-S Progres' | 'Alokasi Durasi'
  const [chartMode, setChartMode] = useState<'Beban Bulanan' | 'Kurva-S Progres' | 'Alokasi Durasi'>('Beban Bulanan');

  // Filtered Activities for Daftar Kegiatan (Full Width)
  const filteredActivities = useMemo(() => {
    return ALL_ACTIVITIES.filter((act) => {
      if (searchActivity.trim()) {
        const q = searchActivity.toLowerCase();
        const matchesName = act.name.toLowerCase().includes(q);
        const matchesProg = act.programName.toLowerCase().includes(q);
        const matchesDesc = act.description.toLowerCase().includes(q);
        if (!matchesName && !matchesProg && !matchesDesc) return false;
      }

      if (filterCategory !== 'Semua Kategori' && act.category !== filterCategory) {
        return false;
      }

      if (filterStatus !== 'Semua Status' && act.status !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [searchActivity, filterCategory, filterStatus]);

  // Pagination for Daftar Kegiatan
  const totalItems = filteredActivities.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedActivities = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize;
    return filteredActivities.slice(start, start + pageSize);
  }, [filteredActivities, validCurrentPage, pageSize]);

  // Fixed & Dynamic Summary Data based on "selectedSummaryProgram"
  const summaryActivities = useMemo(() => {
    if (selectedSummaryProgram === 'Semua Program') {
      return ALL_ACTIVITIES;
    }
    return ALL_ACTIVITIES.filter((a) => a.category === selectedSummaryProgram);
  }, [selectedSummaryProgram]);

  // Donut chart data calculations
  const programSummaryData = useMemo(() => {
    const categoryCounts: Record<string, { count: number; color: string }> = {
      PPDB: { count: 0, color: '#0284C7' },
      Pembelajaran: { count: 0, color: '#10B981' },
      Ujian: { count: 0, color: '#7C3AED' },
      Beasiswa: { count: 0, color: '#F59E0B' },
      Infrastruktur: { count: 0, color: '#06B6D4' },
      Lainnya: { count: 0, color: '#94A3B8' },
    };

    summaryActivities.forEach((act) => {
      if (categoryCounts[act.category]) {
        categoryCounts[act.category].count += 1;
      }
    });

    const total = summaryActivities.length || 1;

    return Object.entries(categoryCounts)
      .filter(([name]) => selectedSummaryProgram === 'Semua Program' || name === selectedSummaryProgram)
      .map(([name, data]) => ({
        name,
        count: data.count,
        pct: `${Math.round((data.count / total) * 1000) / 10}%`,
        color: data.color,
      }));
  }, [summaryActivities, selectedSummaryProgram]);

  // 3 Status counters for Ringkasan Program
  const statusCounts = useMemo(() => {
    const counts = { Selesai: 0, Berjalan: 0, 'Belum Mulai': 0 };
    summaryActivities.forEach((act) => {
      if (counts[act.status] !== undefined) {
        counts[act.status] += 1;
      }
    });
    return counts;
  }, [summaryActivities]);

  // Status Badge Helper
  const getStatusBadge = (status: 'Selesai' | 'Berjalan' | 'Belum Mulai') => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#DEF7EC] text-[#03543F] inline-flex items-center gap-1 border border-[#BCF0DA]">
            <Check className="w-3 h-3" /> Selesai
          </span>
        );
      case 'Berjalan':
        return (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#E1EFFE] text-[#1E429F] inline-flex items-center gap-1 border border-[#BFDBFE]">
            <Clock className="w-3 h-3" /> Berjalan
          </span>
        );
      case 'Belum Mulai':
        return (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#F3F4F6] text-[#4B5563] inline-flex items-center gap-1 border border-[#E5E7EB]">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Belum Mulai
          </span>
        );
      default:
        return null;
    }
  };

  // Open modal handler from any object
  const handleOpenModal = (item: {
    id: string | number;
    name: string;
    programName?: string;
    category: string;
    startDate?: string;
    endDate?: string;
    start?: string;
    end?: string;
    duration: string;
    status: 'Selesai' | 'Berjalan' | 'Belum Mulai';
    progress: number;
    color: string;
    description: string;
    organizer: string;
    target: string;
  }) => {
    setModalItem({
      id: item.id,
      title: item.name,
      programName: item.programName,
      category: item.category,
      startDate: item.startDate || item.start || '2026',
      endDate: item.endDate || item.end || '2026',
      duration: item.duration,
      status: item.status,
      progress: item.progress,
      color: item.color,
      description: item.description,
      organizer: item.organizer,
      target: item.target,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Timeline & Gantt"
        subtitle="Visualisasi timeline program pendidikan, jadwal pelaksanaan, dan dependensi antar kegiatan."
      />

      {/* 2. Top Category Pills Strip (Standard Navy #0F2942 & rounded-xl) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          'Program Nasional',
          'Kalender Akademik',
          'Pendaftaran',
          'Ujian Nasional',
          'Infrastruktur',
          'Beasiswa',
          'Kegiatan Lainnya',
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-2xs ${
              activeTab === tab
                ? 'bg-[#0F2942] text-white shadow-xs font-bold'
                : 'bg-white border border-[#DCE5EF] text-[#526579] hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. MAIN SECTION: Gantt View / Timeline View / List View */}
      <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs space-y-4">
        {/* Card Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#F0F4F8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E6F8F6] text-[#25A9A1] flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172B4D]">Timeline Program Nasional 2026</h3>
              <p className="text-[11px] text-[#526579]">
                Klik pada bar atau kegiatan untuk melihat rincian detail modal
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Switcher: Gantt View, Timeline View, List View */}
            <div className="flex items-center bg-[#F5F8FC] border border-[#DCE5EF] rounded-xl p-1 text-xs">
              {(['Gantt View', 'Timeline View', 'List View'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    viewMode === mode
                      ? 'bg-[#0F2942] text-white shadow-xs font-bold'
                      : 'text-[#526579] hover:text-[#172B4D] hover:bg-white/60'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Zoom Controls */}
            {viewMode === 'Gantt View' && (
              <div className="flex items-center gap-1 bg-[#F5F8FC] border border-[#DCE5EF] rounded-xl p-1">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                  className="p-1.5 rounded-lg hover:bg-white text-gray-600 transition-colors cursor-pointer"
                  title="Perkecil Tampilan"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-bold text-[#0F2942] px-1">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
                  className="p-1.5 rounded-lg hover:bg-white text-gray-600 transition-colors cursor-pointer"
                  title="Perbesar Tampilan"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Granularity Dropdown (Only 1 dropdown in the Timeline header) */}
            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value as any)}
              className="bg-white border border-[#DCE5EF] text-xs font-semibold rounded-xl px-3 py-1.5 text-[#172B4D] outline-none cursor-pointer hover:border-[#25A9A1] transition-colors shadow-2xs"
            >
              <option value="Bulan">Skala Bulan</option>
              <option value="Minggu">Skala Minggu</option>
              <option value="Hari">Skala Hari</option>
            </select>
          </div>
        </div>

        {/* --- VIEW 1: GANTT VIEW --- */}
        {viewMode === 'Gantt View' && (
          <div className="w-full overflow-x-auto border border-[#E2E8F0] rounded-xl">
            <div className="flex items-start min-w-[1000px]">
              {/* Left Table: Program & Sub-tasks */}
              <div className="w-[440px] shrink-0 border-r border-[#DCE5EF] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#DCE5EF] text-[#526579] font-bold">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">#</th>
                      <th className="py-2.5 px-3">Nama Program / Kegiatan</th>
                      <th className="py-2.5 px-3 text-center">Mulai</th>
                      <th className="py-2.5 px-3 text-center">Selesai</th>
                      <th className="py-2.5 px-3 text-right">Durasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F4F8]">
                    {GANTT_PROGRAMS.map((prog) => {
                      const isExp = expandedPrograms[prog.id];

                      return (
                        <React.Fragment key={prog.id}>
                          {/* Program Parent Row */}
                          <tr className="bg-[#FAFBFD] font-bold text-[#172B4D] h-10 hover:bg-[#F1F5F9] transition-colors">
                            <td className="py-2 px-3 text-center text-gray-500 font-bold">{prog.num}</td>
                            <td className="py-2 px-3">
                              <button
                                onClick={() => toggleProgram(prog.id)}
                                className="flex items-center gap-1.5 text-left font-bold text-[#172B4D] hover:text-[#0284C7] transition-colors cursor-pointer w-full"
                              >
                                {isExp ? (
                                  <ChevronDown className="w-4 h-4 text-[#0284C7] shrink-0" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                                )}
                                <span className="truncate max-w-[210px]">{prog.name}</span>
                              </button>
                            </td>
                            <td className="py-2 px-3 text-center font-normal text-gray-500 text-[11px]">
                              {prog.startDate}
                            </td>
                            <td className="py-2 px-3 text-center font-normal text-gray-500 text-[11px]">
                              {prog.endDate}
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-[#172B4D] text-[11px]">
                              {prog.duration}
                            </td>
                          </tr>

                          {/* Sub-tasks Accordion */}
                          {isExp &&
                            prog.subTasks.map((sub) => (
                              <tr
                                key={sub.id}
                                onClick={() => handleOpenModal(sub)}
                                className="bg-white text-gray-600 h-9 hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                              >
                                <td className="py-1 px-3 text-center text-gray-300"></td>
                                <td className="py-1 px-3 pl-8">
                                  <span className="flex items-center gap-1.5 text-xs font-medium text-[#172B4D] hover:text-[#0284C7]">
                                    <span className="text-gray-400 text-xs">›</span>
                                    <span className="truncate max-w-[200px]">{sub.name}</span>
                                  </span>
                                </td>
                                <td className="py-1 px-3 text-center text-[11px] text-gray-500">
                                  {sub.startDate}
                                </td>
                                <td className="py-1 px-3 text-center text-[11px] text-gray-500">
                                  {sub.endDate}
                                </td>
                                <td className="py-1 px-3 text-right text-[11px] text-gray-500">
                                  {sub.duration}
                                </td>
                              </tr>
                            ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Right Gantt Bars Viewport */}
              <div
                className="flex-1 min-w-[640px] overflow-hidden bg-white"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
              >
                {/* Header: Months 2026 */}
                <div className="bg-[#F8FAFC] border-b border-[#DCE5EF] text-center text-xs font-bold text-[#526579]">
                  <div className="py-1 text-[10px] font-bold text-gray-400 border-b border-[#F0F4F8]">
                    Tahun 2026
                  </div>
                  <div className="grid grid-cols-12 text-[11px]">
                    {MONTHS_LIST.map((m) => (
                      <div key={m} className="py-1.5 border-r border-[#EDF2F7] last:border-r-0">
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gantt Canvas Rows with Grid Lines */}
                <div className="relative">
                  {/* Vertical Month Guidelines */}
                  <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                    {MONTHS_LIST.map((m, i) => (
                      <div key={i} className="border-r border-[#F1F5F9] h-full" />
                    ))}
                  </div>

                  {/* Rows */}
                  <div className="relative divide-y divide-[#F0F4F8]">
                    {GANTT_PROGRAMS.map((prog) => {
                      const isExp = expandedPrograms[prog.id];
                      const leftPct = (prog.startMonthIdx / 12) * 100;
                      const widthPct = ((prog.endMonthIdx - prog.startMonthIdx + 1) / 12) * 100;

                      return (
                        <React.Fragment key={prog.id}>
                          {/* Parent Program Bar */}
                          <div className="h-10 relative flex items-center px-2 bg-[#FAFBFD]">
                            <div
                              onClick={() => handleOpenModal(prog)}
                              className="h-6 rounded-md flex items-center px-2.5 text-white text-[10px] font-bold truncate shadow-xs transition-all hover:scale-[1.01] hover:brightness-110 cursor-pointer"
                              style={{
                                marginLeft: `${leftPct}%`,
                                width: `${widthPct}%`,
                                backgroundColor: prog.color,
                              }}
                              title={`Klik untuk detail modal: ${prog.name}`}
                            >
                              <span className="truncate">{prog.name}</span>
                            </div>
                          </div>

                          {/* Sub-tasks Gantt Bars */}
                          {isExp &&
                            prog.subTasks.map((sub) => {
                              const subLeft = (sub.startMonthIdx / 12) * 100;
                              const subWidth = ((sub.endMonthIdx - sub.startMonthIdx) / 12) * 100;

                              return (
                                <div key={sub.id} className="h-9 relative flex items-center px-2 bg-white">
                                  <div
                                    onClick={() => handleOpenModal(sub)}
                                    className="h-5 rounded-md flex items-center px-2.5 text-white text-[9px] font-semibold truncate shadow-2xs transition-all hover:scale-[1.02] hover:brightness-110 cursor-pointer"
                                    style={{
                                      marginLeft: `${subLeft}%`,
                                      width: `${Math.max(subWidth, 4)}%`,
                                      backgroundColor: sub.color,
                                    }}
                                    title={`Klik untuk detail modal: ${sub.name} (${sub.startDate} - ${sub.endDate})`}
                                  >
                                    <span className="truncate">{sub.name}</span>
                                  </div>
                                </div>
                              );
                            })}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW 2: TIMELINE VIEW --- */}
        {viewMode === 'Timeline View' && (
          <div className="space-y-6 p-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F4F8]">
              <div>
                <h4 className="text-sm font-bold text-[#172B4D]">Roadmap Pelaksanaan Kegiatan 2026</h4>
                <p className="text-xs text-[#526579]">
                  Urutan kronologis program dan sub-kegiatan pendidikan sepanjang tahun 2026
                </p>
              </div>
              <span className="px-3 py-1 bg-[#E6F8F6] text-[#25A9A1] rounded-xl text-xs font-bold">
                18 Tahapan Terjadwal
              </span>
            </div>

            {/* Chronological quarters / milestone cards */}
            <div className="relative pl-6 space-y-6">
              {/* Vertical timeline track */}
              <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-[#CBD5E1]" />

              {GANTT_PROGRAMS.map((prog) => (
                <div key={prog.id} className="relative space-y-3">
                  {/* Parent Milestone Header Node */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-white text-xs font-bold shrink-0 -ml-3"
                      style={{ backgroundColor: prog.color }}
                    >
                      {prog.num}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#172B4D]">{prog.name}</span>
                      <span className="text-xs font-semibold text-gray-500">
                        ({prog.startDate} – {prog.endDate})
                      </span>
                      {getStatusBadge(prog.status)}
                    </div>
                  </div>

                  {/* Subtask Cards in Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pl-6">
                    {prog.subTasks.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => handleOpenModal(sub)}
                        className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-2xs hover:border-[#25A9A1] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                              {sub.startDate} – {sub.endDate}
                            </span>
                            {getStatusBadge(sub.status)}
                          </div>
                          <h5 className="text-xs font-bold text-[#172B4D] leading-snug">
                            {sub.name}
                          </h5>
                          <p className="text-[11px] text-[#526579] mt-1 line-clamp-2">
                            {sub.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-gray-500">Durasi: {sub.duration}</span>
                          <span className="font-bold text-[#0284C7] hover:underline flex items-center gap-0.5">
                            Detail <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VIEW 3: LIST VIEW --- */}
        {viewMode === 'List View' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#F0F4F8]">
              <div>
                <h4 className="text-sm font-bold text-[#172B4D]">Daftar Hierarki Program & Kegiatan</h4>
                <p className="text-xs text-[#526579]">
                  Tampilan tabular hierarkis seluruh program nasional dan rincian sub-aktivitas
                </p>
              </div>
              <span className="text-xs font-bold text-[#0F2942] bg-[#F1F5F9] px-3 py-1.5 rounded-xl">
                6 Program Induk • 18 Sub-kegiatan
              </span>
            </div>

            <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#DCE5EF] text-[#526579] font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Program / Kegiatan</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3">Tanggal Mulai</th>
                    <th className="py-2.5 px-3">Tanggal Selesai</th>
                    <th className="py-2.5 px-3 text-right">Durasi</th>
                    <th className="py-2.5 px-3 text-center">Progress</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F4F8]">
                  {GANTT_PROGRAMS.map((prog) => (
                    <React.Fragment key={prog.id}>
                      {/* Main Program Header Row */}
                      <tr className="bg-[#FAFBFD] font-bold text-[#172B4D]">
                        <td className="py-2.5 px-3 flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: prog.color }}
                          />
                          <span className="font-bold">{prog.name}</span>
                        </td>
                        <td className="py-2.5 px-3 text-gray-500">{prog.category}</td>
                        <td className="py-2.5 px-3 text-gray-500">{prog.startDate}</td>
                        <td className="py-2.5 px-3 text-gray-500">{prog.endDate}</td>
                        <td className="py-2.5 px-3 text-right">{prog.duration}</td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 mx-auto">
                            <div
                              className="h-1.5 rounded-full"
                              style={{ width: `${prog.progress}%`, backgroundColor: prog.color }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-500">{prog.progress}%</span>
                        </td>
                        <td className="py-2.5 px-3 text-center">{getStatusBadge(prog.status)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleOpenModal(prog)}
                            className="text-[#0284C7] hover:underline font-bold text-[11px] cursor-pointer"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>

                      {/* Sub-activities */}
                      {prog.subTasks.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-2 px-3 pl-8 text-gray-700">
                            <span className="flex items-center gap-1.5">
                              <span className="text-gray-300 text-xs">›</span>
                              <span>{sub.name}</span>
                            </span>
                          </td>
                          <td className="py-2 px-3 text-gray-400">{sub.category}</td>
                          <td className="py-2 px-3 text-gray-500">{sub.startDate}</td>
                          <td className="py-2 px-3 text-gray-500">{sub.endDate}</td>
                          <td className="py-2 px-3 text-right text-gray-500">{sub.duration}</td>
                          <td className="py-2 px-3 text-center">
                            <span className="text-[11px] font-semibold text-gray-600">
                              {sub.progress}%
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">{getStatusBadge(sub.status)}</td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => handleOpenModal(sub)}
                              className="text-[#25A9A1] hover:underline font-bold text-[11px] cursor-pointer"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 4. DAFTAR KEGIATAN FULL WIDTH (Below Main Gantt/Timeline card) */}
      <div className="w-full bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs space-y-4">
        {/* Header & Filter Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#F0F4F8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#172B4D]">Daftar Kegiatan</h4>
              <p className="text-[11px] text-[#526579]">
                Tabel lengkap seluruh 18 aktivitas pelaksanaan program pendidikan
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kegiatan..."
                value={searchActivity}
                onChange={(e) => {
                  setSearchActivity(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#F5F8FC] border border-[#DCE5EF] rounded-xl pl-8 pr-7 py-1.5 text-xs text-[#172B4D] outline-none focus:border-[#25A9A1] focus:bg-white transition-colors w-44"
              />
              {searchActivity && (
                <button
                  onClick={() => setSearchActivity('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Dropdown */}
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-semibold rounded-xl px-3 py-1.5 text-[#172B4D] outline-none cursor-pointer"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              <option value="PPDB">PPDB</option>
              <option value="Pembelajaran">Pembelajaran</option>
              <option value="Ujian">Ujian</option>
              <option value="Beasiswa">Beasiswa</option>
              <option value="Infrastruktur">Infrastruktur</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            {/* Status Filter Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-semibold rounded-xl px-3 py-1.5 text-[#172B4D] outline-none cursor-pointer"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Selesai">Selesai</option>
              <option value="Berjalan">Berjalan</option>
              <option value="Belum Mulai">Belum Mulai</option>
            </select>
          </div>
        </div>

        {/* Full-Width Table */}
        <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#DCE5EF] text-[11px] text-[#526579] font-bold">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3">Nama Kegiatan</th>
                <th className="py-2.5 px-3">Program Induk</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3 text-center">Mulai</th>
                <th className="py-2.5 px-3 text-center">Selesai</th>
                <th className="py-2.5 px-3 text-right">Durasi</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs">
              {paginatedActivities.map((act, idx) => (
                <tr
                  key={act.id}
                  className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  onClick={() => handleOpenModal(act)}
                >
                  <td className="py-2.5 px-3 text-center text-gray-400 font-bold">
                    {(validCurrentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#172B4D]">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: act.color }}
                      />
                      <span className="hover:text-[#0284C7] transition-colors">{act.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 truncate max-w-[180px]">
                    {act.programName}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F1F5F9] text-[#0F2942]">
                      {act.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center text-gray-500 text-[11px]">{act.start}</td>
                  <td className="py-2.5 px-3 text-center text-gray-500 text-[11px]">{act.end}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-[#172B4D] text-[11px]">
                    {act.duration}
                  </td>
                  <td className="py-2.5 px-3 text-center">{getStatusBadge(act.status)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(act);
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-[#0284C7] hover:bg-[#E0F2FE] rounded-lg transition-colors cursor-pointer"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedActivities.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400 text-xs">
                    Tidak ada kegiatan yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-[#526579]">
          <span>
            Menampilkan <span className="font-bold text-[#0F2942]">{paginatedActivities.length}</span> dari{' '}
            <span className="font-bold text-[#0F2942]">{totalItems}</span> kegiatan
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validCurrentPage === 1}
              className="p-1.5 rounded-lg border border-[#DCE5EF] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  validCurrentPage === pg
                    ? 'bg-[#0F2942] text-white font-bold'
                    : 'border border-[#DCE5EF] hover:bg-gray-50 text-[#526579]'
                }`}
              >
                {pg}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#DCE5EF] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM 3-COLUMN SECTION: Milestone Penting | Ringkasan Program | Grafik Analisis Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Col 1: Milestone Penting 2026 */}
        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-[#EF4444] flex items-center justify-center font-bold">
                  <Flag className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#172B4D]">Milestone Penting 2026</h4>
              </div>
              <span className="text-[11px] font-bold text-[#EF4444] bg-red-50 px-2.5 py-0.5 rounded-lg">
                7 Milestone
              </span>
            </div>

            <div className="mt-4 relative pl-6 space-y-4">
              {/* Vertical connector line */}
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-[#E2E8F0]" />

              {MILESTONES_2026.map((m) => (
                <div
                  key={m.id}
                  onClick={() =>
                    setModalItem({
                      id: m.id,
                      title: m.title,
                      category: m.category,
                      startDate: m.date,
                      endDate: m.date,
                      duration: 'Milestone Tanggal Kunci',
                      status: 'Berjalan',
                      progress: 75,
                      color: m.color,
                      description: m.description,
                      organizer: m.organizer,
                      target: 'Satuan Pendidikan Seluruh Indonesia',
                    })
                  }
                  className="relative flex items-start gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div
                    className="w-3 h-3 rounded-full ring-4 ring-white shrink-0 mt-1 shadow-2xs group-hover:scale-125 transition-transform"
                    style={{ backgroundColor: m.color }}
                  />
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block">{m.date}</span>
                    <h5 className="text-xs font-bold text-[#172B4D] group-hover:text-[#0284C7] transition-colors leading-tight mt-0.5">
                      {m.title}
                    </h5>
                    <p className="text-[11px] text-[#526579] line-clamp-1 mt-0.5">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0F4F8] text-[11px] text-[#526579] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" /> Milestone Kalender Nasional
            </span>
            <span className="font-semibold text-[#0F2942]">Tahun Ajaran 2025/2026</span>
          </div>
        </div>

        {/* Col 2: Ringkasan Program with FIXED Dropdown */}
        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#172B4D]">Ringkasan Program</h4>
              </div>

              {/* FIXED DROPDOWN: "Semua Program buat fix" */}
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedSummaryProgram}
                  onChange={(e) => setSelectedSummaryProgram(e.target.value)}
                  className="bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-semibold rounded-xl px-2.5 py-1 outline-none text-[#172B4D] cursor-pointer hover:border-[#25A9A1] transition-colors max-w-[155px] truncate"
                >
                  <option value="Semua Program">Semua Program (18 Kegiatan)</option>
                  <option value="PPDB">PPDB (5 Kegiatan)</option>
                  <option value="Pembelajaran">Pembelajaran (4 Kegiatan)</option>
                  <option value="Ujian">Ujian (3 Kegiatan)</option>
                  <option value="Beasiswa">Beasiswa (3 Kegiatan)</option>
                  <option value="Infrastruktur">Infrastruktur (2 Kegiatan)</option>
                  <option value="Lainnya">Lainnya (1 Kegiatan)</option>
                </select>
              </div>
            </div>

            {/* Donut Chart + Category Breakdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-2 px-1">
              {/* Donut Chart with center total number */}
              <div className="relative w-32 h-32 shrink-0 mx-auto sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={programSummaryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={52}
                      paddingAngle={3}
                      dataKey="count"
                    >
                      {programSummaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#DCE5EF',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-lg font-extrabold text-[#0F2942] leading-none">
                    {summaryActivities.length}
                  </span>
                  <span className="text-[8px] font-semibold text-gray-400 uppercase mt-0.5">
                    Kegiatan
                  </span>
                </div>
              </div>

              {/* Legend List */}
              <div className="flex-1 space-y-1.5 text-xs font-medium">
                {programSummaryData.map((p) => (
                  <div key={p.name} className="flex items-center justify-between gap-2 p-1 rounded-lg bg-[#F8FAFC]">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="truncate text-[#172B4D] font-semibold text-[11px]">{p.name}</span>
                    </span>
                    <div className="flex items-center gap-1 shrink-0 text-[#0F2942] font-bold text-[11px]">
                      <span>{p.count}</span>
                      <span className="text-gray-400 text-[9px]">({p.pct})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Status KPI Cards (Dynamic based on selectedSummaryProgram) */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F0F4F8]">
            <div className="bg-[#F3FAF7] border border-[#DEF7EC] rounded-xl p-2 text-center transition-all hover:shadow-2xs">
              <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center mx-auto text-xs font-bold">
                ✓
              </div>
              <div className="text-base font-extrabold text-[#172B4D] mt-1">{statusCounts.Selesai}</div>
              <div className="text-[10px] text-[#03543F] font-bold">Selesai</div>
            </div>

            <div className="bg-[#EBF7FD] border border-[#BAE6FD] rounded-xl p-2 text-center transition-all hover:shadow-2xs">
              <div className="w-5 h-5 rounded-full bg-[#0284C7] text-white flex items-center justify-center mx-auto text-xs font-bold">
                ⏱
              </div>
              <div className="text-base font-extrabold text-[#172B4D] mt-1">{statusCounts.Berjalan}</div>
              <div className="text-[10px] text-[#0284C7] font-bold">Berjalan</div>
            </div>

            <div className="bg-[#F8FAFC] border border-[#DCE5EF] rounded-xl p-2 text-center transition-all hover:shadow-2xs">
              <div className="w-5 h-5 rounded-full bg-gray-400 text-white flex items-center justify-center mx-auto text-xs font-bold">
                ···
              </div>
              <div className="text-base font-extrabold text-[#172B4D] mt-1">
                {statusCounts['Belum Mulai']}
              </div>
              <div className="text-[10px] text-gray-500 font-bold">Belum Mulai</div>
            </div>
          </div>
        </div>

        {/* Col 3: SECTION GRAFIK (Beban Bulanan / Kurva S / Alokasi Durasi) */}
        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E6F8F6] text-[#25A9A1] flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#172B4D]">Grafik & Analisis Timeline</h4>
                </div>
              </div>

              {/* Mode Switcher for the 3 Chart Ideas */}
              <select
                value={chartMode}
                onChange={(e) => setChartMode(e.target.value as any)}
                className="bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-semibold rounded-xl px-2.5 py-1 outline-none text-[#172B4D] cursor-pointer hover:border-[#25A9A1] transition-colors"
              >
                <option value="Beban Bulanan">Beban Bulanan (Peak Activity)</option>
                <option value="Kurva-S Progres">Kurva-S Progres (Trajectory)</option>
                <option value="Alokasi Durasi">Alokasi Durasi (Hari Kerja)</option>
              </select>
            </div>

            {/* CHART VIEW 1: Beban Bulanan (Bar Chart Jan-Des with Peak Highlight) */}
            {chartMode === 'Beban Bulanan' && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#526579] px-1">
                  <span>Distribusi jumlah kegiatan aktif per bulan:</span>
                  <span className="font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-md">
                    Puncak: Mar–Apr (11 Event)
                  </span>
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MONTHLY_WORKLOAD_DATA} margin={{ top: 10, right: 5, left: -25, bottom: 5 }}>
                      <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#526579' }} />
                      <YAxis tick={{ fontSize: 9, fill: '#526579' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#DCE5EF',
                          borderRadius: '8px',
                          fontSize: '11px',
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {MONTHLY_WORKLOAD_DATA.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.highlight ? '#0284C7' : '#38BDF8'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* CHART VIEW 2: Kurva-S Progres (Cumulative S-Curve AreaChart) */}
            {chartMode === 'Kurva-S Progres' && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#526579] px-1">
                  <span>Akumulasi target capaian program tahun 2026:</span>
                  <span className="font-bold text-[#10B981] bg-[#DEF7EC] px-2 py-0.5 rounded-md">
                    Status: On Track (+3%)
                  </span>
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SCURVE_PROGRESS_DATA} margin={{ top: 10, right: 5, left: -25, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#526579' }} />
                      <YAxis unit="%" tick={{ fontSize: 9, fill: '#526579' }} />
                      <Tooltip
                        formatter={(val: any) => [`${val}%`, 'Target Progres']}
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#DCE5EF',
                          borderRadius: '8px',
                          fontSize: '11px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="target"
                        stroke="#0284C7"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorTarget)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* CHART VIEW 3: Alokasi Durasi Hari per Kategori */}
            {chartMode === 'Alokasi Durasi' && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#526579] px-1">
                  <span>Alokasi total hari operasional per program:</span>
                  <span className="font-bold text-[#0F2942] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                    Total 348 Hari KBM
                  </span>
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DURATION_BY_CATEGORY_DATA} margin={{ top: 10, right: 5, left: -20, bottom: 20 }}>
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 8, fill: '#526579' }}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis tick={{ fontSize: 9, fill: '#526579' }} />
                      <Tooltip
                        formatter={(val: any) => [`${val} hari`, 'Durasi Hari']}
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#DCE5EF',
                          borderRadius: '8px',
                          fontSize: '11px',
                        }}
                      />
                      <Bar dataKey="days" radius={[4, 4, 0, 0]}>
                        {DURATION_BY_CATEGORY_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Quick Insights Footer */}
          <div className="pt-2.5 border-t border-[#F0F4F8] grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-[#F8FAFC] p-2 rounded-xl border border-[#EDF2F7]">
              <span className="text-gray-400 block font-medium">Beban Rata-Rata</span>
              <span className="font-bold text-[#0F2942] text-xs">7,1 Kegiatan / Bln</span>
            </div>
            <div className="bg-[#F8FAFC] p-2 rounded-xl border border-[#EDF2F7]">
              <span className="text-gray-400 block font-medium">Fase Kritis Utama</span>
              <span className="font-bold text-[#0284C7] text-xs">Maret - Mei 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. MODAL DETAIL KEGIATAN GANTT & TIMELINE */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#DCE5EF] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: modalItem.color }}
                />
                <span className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">
                  Detail Kegiatan Timeline & Gantt
                </span>
              </div>
              <button
                onClick={() => setModalItem(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-2xs"
                    style={{ backgroundColor: modalItem.color }}
                  >
                    {modalItem.category}
                  </span>
                  {getStatusBadge(modalItem.status)}
                </div>
                <h3 className="text-lg font-bold text-[#172B4D] leading-snug">
                  {modalItem.title}
                </h3>
                {modalItem.programName && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Program Induk: <span className="font-semibold text-[#0F2942]">{modalItem.programName}</span>
                  </p>
                )}
              </div>

              {/* Progress Bar in Modal */}
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#EDF2F7]">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#526579]">Progres Pelaksanaan</span>
                  <span className="text-[#0F2942]">{modalItem.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: `${modalItem.progress}%`, backgroundColor: modalItem.color }}
                  />
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F5F8FC] rounded-xl border border-[#EDF2F7] text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">
                    Periode Pelaksanaan
                  </span>
                  <span className="font-semibold text-[#172B4D] mt-0.5 block">
                    {modalItem.startDate} – {modalItem.endDate}
                  </span>
                  <span className="text-gray-500 text-[11px]">Durasi: {modalItem.duration}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">
                    Sasaran & Target
                  </span>
                  <span className="font-semibold text-[#172B4D] mt-0.5 block truncate">
                    {modalItem.target}
                  </span>
                  <span className="text-gray-500 text-[11px]">Penyelenggara: {modalItem.organizer}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-1">
                  Deskripsi Kegiatan
                </h4>
                <p className="text-xs text-[#526579] leading-relaxed">
                  {modalItem.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end gap-2">
              <button
                onClick={() => setModalItem(null)}
                className="px-4 py-2 bg-[#0F2942] text-white text-xs font-bold rounded-xl hover:bg-[#1a3a5c] transition-colors cursor-pointer shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
