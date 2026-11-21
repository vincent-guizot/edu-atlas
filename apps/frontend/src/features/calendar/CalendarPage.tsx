import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import {
  Calendar as CalIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  MapPin,
  MoreHorizontal,
  RotateCcw,
  Check,
  ChevronDown,
  Search,
  X,
  Building2,
  GraduationCap,
  Tag,
  Eye,
  Info,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export interface CalendarEvent {
  id: string;
  title: string;
  category: 'Kegiatan Akademik' | 'Ujian' | 'Pendaftaran' | 'Libur' | 'Hari Besar Nasional' | 'Kegiatan Khusus';
  color: string;
  year: number;
  month: number; // 0-indexed: 0 = Jan, 1 = Feb, etc.
  day: number;
  time: string;
  level: string; // 'Semua Jenjang' | 'SD' | 'SMP' | 'SMA' | 'SMK' | 'Universitas'
  provinsi: string;
  institutionType: string;
  description: string;
  organizer: string;
  location: string;
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Libur Tahun Baru 2026',
    category: 'Libur',
    color: '#EF4444',
    year: 2026,
    month: 0,
    day: 1,
    time: 'Sepanjang Hari',
    level: 'Semua Jenjang',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Hari libur nasional memperingati Tahun Baru Masehi 2026 bagi seluruh satuan pendidikan.',
    organizer: 'Pemerintah Republik Indonesia',
    location: 'Seluruh Indonesia',
  },
  {
    id: 'evt-2',
    title: 'Awal Semester Genap TA 2025/2026',
    category: 'Kegiatan Akademik',
    color: '#3B82F6',
    year: 2026,
    month: 0,
    day: 2,
    time: '07:00 – 14:00 WIB',
    level: 'Semua Jenjang',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Hari pertama masuk sekolah semester genap Tahun Ajaran 2025/2026 untuk jenjang PAUD, SD, SMP, SMA, dan SMK.',
    organizer: 'Kemendikbudristek & Kemenag',
    location: 'Seluruh Satuan Pendidikan',
  },
  {
    id: 'evt-3',
    title: 'MPLS SMA/SMK Semester Genap',
    category: 'Kegiatan Akademik',
    color: '#3B82F6',
    year: 2026,
    month: 0,
    day: 6,
    time: '07:30 – 12:00 WIB',
    level: 'SMA',
    provinsi: 'Jawa Barat',
    institutionType: 'Sekolah Negeri',
    description: 'Masa Pengenalan Lingkungan Sekolah orientasi lanjutan dan evaluasi pembelajaran siswa SMA/SMK.',
    organizer: 'Dinas Pendidikan Jawa Barat',
    location: 'SMA & SMK se-Jawa Barat',
  },
  {
    id: 'evt-4',
    title: 'MPLS Siswa Baru SMP',
    category: 'Kegiatan Akademik',
    color: '#3B82F6',
    year: 2026,
    month: 0,
    day: 7,
    time: '08:00 – 12:00 WIB',
    level: 'SMP',
    provinsi: 'DKI Jakarta',
    institutionType: 'Sekolah Negeri',
    description: 'Pengenalan tata tertib, program OSIS, dan sosialisasi kurikulum berbasis karakter bagi peserta didik SMP.',
    organizer: 'Dinas Pendidikan DKI Jakarta',
    location: 'SMP se-DKI Jakarta',
  },
  {
    id: 'evt-5',
    title: 'Pengenalan Siswa Baru SD',
    category: 'Kegiatan Akademik',
    color: '#3B82F6',
    year: 2026,
    month: 0,
    day: 8,
    time: '07:30 – 10:30 WIB',
    level: 'SD',
    provinsi: 'Jawa Timur',
    institutionType: 'Sekolah Negeri',
    description: 'Orientasi menyenangkan peserta didik baru Sekolah Dasar menyambut semester genap.',
    organizer: 'Dinas Pendidikan Jawa Timur',
    location: 'SD se-Jawa Timur',
  },
  {
    id: 'evt-6',
    title: 'Workshop Peningkatan Kompetensi Guru',
    category: 'Kegiatan Khusus',
    color: '#06B6D4',
    year: 2026,
    month: 0,
    day: 9,
    time: '09:00 – 15:30 WIB',
    level: 'Semua Jenjang',
    provinsi: 'Jawa Tengah',
    institutionType: 'Sekolah Negeri',
    description: 'Pelatihan pemanfaatan kecerdasan buatan (AI) dan platform digital dalam evaluasi belajar Kurikulum Merdeka.',
    organizer: 'Balai Guru Penggerak Jawa Tengah',
    location: 'Auditorium LPMP Jawa Tengah & Daring',
  },
  {
    id: 'evt-7',
    title: 'Sosialisasi Pendaftaran SNPMB 2026',
    category: 'Pendaftaran',
    color: '#10B981',
    year: 2026,
    month: 0,
    day: 10,
    time: '13:00 – 16:00 WIB',
    level: 'SMA',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Sosialisasi alur seleksi penerimaan mahasiswa baru jalur SNBP dan UTBK-SNBT tahun 2026 oleh panitia SNPMB Pusat.',
    organizer: 'Panitia SNPMB PTN',
    location: 'Siaran Langsung Nasional & YouTube SNPMB',
  },
  {
    id: 'evt-8',
    title: 'Pendaftaran Ulang Mahasiswa Baru PTN',
    category: 'Pendaftaran',
    color: '#10B981',
    year: 2026,
    month: 0,
    day: 12,
    time: '08:00 – 17:00 WIB',
    level: 'Universitas',
    provinsi: 'DKI Jakarta',
    institutionType: 'Perguruan Tinggi',
    description: 'Verifikasi dokumen administrasi dan pembayaran UKT mahasiswa baru program sarjana dan diploma.',
    organizer: 'Kementerian Pendidikan Tinggi & Rektorat',
    location: 'Kampus PTN se-Indonesia',
  },
  {
    id: 'evt-9',
    title: 'Batas Akhir Pengisian PDSS',
    category: 'Pendaftaran',
    color: '#10B981',
    year: 2026,
    month: 0,
    day: 13,
    time: 'Batas Waktu: 23:59 WIB',
    level: 'SMA',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Batas finalisasi pengisian Pangkalan Data Sekolah dan Siswa (PDSS) oleh kepala sekolah untuk eligible SNBP.',
    organizer: 'Panitia SNPMB',
    location: 'Portal Resmi SNPMB Kemendikbud',
  },
  {
    id: 'evt-10',
    title: 'Try Out Akbar Nasional SNBT 2026',
    category: 'Ujian',
    color: '#8B5CF6',
    year: 2026,
    month: 0,
    day: 14,
    time: '08:00 – 12:30 WIB',
    level: 'SMA',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Simulasi ujian UTBK-SNBT serentak menguji Tes Potensi Skolastik (TPS) dan Literasi Bahasa Indonesia & Inggris.',
    organizer: 'Forum Guru Indonesia & PTN Mitra',
    location: 'Portal Ujian Online Terdistribusi',
  },
  {
    id: 'evt-11',
    title: 'Ujian Praktek Kejuruan SMK Tahap 1',
    category: 'Ujian',
    color: '#8B5CF6',
    year: 2026,
    month: 0,
    day: 15,
    time: '08:00 – 15:00 WIB',
    level: 'SMK',
    provinsi: 'Jawa Barat',
    institutionType: 'Sekolah Negeri',
    description: 'Uji kompetensi keahlian dan standardisasi sertifikasi BNSP bagi siswa tingkat akhir SMK.',
    organizer: 'Lembaga Sertifikasi Profesi (LSP) P1 SMK',
    location: 'Bengkel & Laboratorium SMK se-Jawa Barat',
  },
  {
    id: 'evt-12',
    title: 'Peringatan Hari Guru & Mutu Pendidikan',
    category: 'Hari Besar Nasional',
    color: '#F59E0B',
    year: 2026,
    month: 0,
    day: 17,
    time: '08:00 – 11:00 WIB',
    level: 'Semua Jenjang',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Upacara bendera dan penganugerahan tanda kehormatan guru inspiratif serta tenaga kependidikan berprestasi.',
    organizer: 'Kementerian Pendidikan Dasar & Menengah',
    location: 'Plaza Insan Berprestasi Jakarta & Tiap Satker',
  },
  {
    id: 'evt-13',
    title: 'Ujian Tengah Semester (Hari 1: Matematika)',
    category: 'Ujian',
    color: '#8B5CF6',
    year: 2026,
    month: 0,
    day: 19,
    time: '07:30 – 11:30 WIB',
    level: 'Semua Jenjang',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Pelaksanaan asesmen sumatif tengah semester genap hari pertama bidang studi Matematika dan Numerasi.',
    organizer: 'Satuan Pendidikan & Musyawarah Guru Mapel',
    location: 'Seluruh Ruang Kelas Sekolah',
  },
  {
    id: 'evt-14',
    title: 'Ujian Tengah Semester (Hari 2: Bahasa)',
    category: 'Ujian',
    color: '#8B5CF6',
    year: 2026,
    month: 0,
    day: 20,
    time: '08:00 – 12:00 WIB',
    level: 'Semua Jenjang',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Asesmen sumatif tengah semester bidang Bahasa Indonesia, Literasi Membaca, dan Bahasa Inggris.',
    organizer: 'Satuan Pendidikan Nasional',
    location: 'Seluruh Sekolah di Indonesia',
  },
  {
    id: 'evt-15',
    title: 'Ujian Tengah Semester (Hari 3: IPA / Sains)',
    category: 'Ujian',
    color: '#8B5CF6',
    year: 2026,
    month: 0,
    day: 21,
    time: '08:00 – 11:30 WIB',
    level: 'Semua Jenjang',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Asesmen sumatif tengah semester bidang Sains Terintegrasi, Fisika, Biologi, dan Kimia.',
    organizer: 'Satuan Pendidikan Nasional',
    location: 'Seluruh Sekolah di Indonesia',
  },
  {
    id: 'evt-16',
    title: 'Ujian Tengah Semester (Hari 4: IPS & Sosial)',
    category: 'Ujian',
    color: '#8B5CF6',
    year: 2026,
    month: 0,
    day: 22,
    time: '08:00 – 11:30 WIB',
    level: 'Semua Jenjang',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Asesmen sumatif tengah semester bidang IPS, Ekonomi, Geografi, dan Sosiologi.',
    organizer: 'Satuan Pendidikan Nasional',
    location: 'Seluruh Sekolah di Indonesia',
  },
  {
    id: 'evt-17',
    title: 'Seminar Pendidikan & Transformasi Digital',
    category: 'Kegiatan Khusus',
    color: '#06B6D4',
    year: 2026,
    month: 0,
    day: 24,
    time: '09:00 – 16:00 WIB',
    level: 'Universitas',
    provinsi: 'DKI Jakarta',
    institutionType: 'Perguruan Tinggi',
    description: 'Simposium internasional inovasi kurikulum abad 21 bersama praktisi EdTech dan pakar pedagogi.',
    organizer: 'Universitas Indonesia & Ditjen Diktiristek',
    location: 'Balai Sidang Jakarta Convention Center (JCC)',
  },
  {
    id: 'evt-18',
    title: 'Pembukaan Pendaftaran SNBP 2026',
    category: 'Pendaftaran',
    color: '#10B981',
    year: 2026,
    month: 0,
    day: 26,
    time: 'Mulai 15:00 WIB',
    level: 'SMA',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Pembukaan portal resmi pendaftaran Seleksi Nasional Berdasarkan Prestasi bagi siswa yang dinyatakan eligible.',
    organizer: 'Panitia Seleksi Nasional Penerimaan Mahasiswa Baru',
    location: 'Portal Resmi SNPMB BPPP',
  },
  {
    id: 'evt-19',
    title: 'Verifikasi Berkas Prestasi & Portofolio Seni',
    category: 'Pendaftaran',
    color: '#10B981',
    year: 2026,
    month: 0,
    day: 27,
    time: '08:00 – 16:00 WIB',
    level: 'SMA',
    provinsi: 'Jawa Timur',
    institutionType: 'Sekolah Negeri',
    description: 'Verifikasi keaslian dokumen sertifikat lomba sains, seni, dan olahraga tingkat provinsi/nasional.',
    organizer: 'Dinas Pendidikan & Panitia Penerimaan Kampus',
    location: 'Pusat Layanan Siswa Prestasi Jawa Timur',
  },
  {
    id: 'evt-20',
    title: 'Pembagian Rapor Sisipan Semester Genap',
    category: 'Kegiatan Akademik',
    color: '#3B82F6',
    year: 2026,
    month: 0,
    day: 29,
    time: '08:00 – 13:00 WIB',
    level: 'Semua Jenjang',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Pertemuan orang tua murid dan wali kelas dalam penyerahan evaluasi laporan kemajuan belajar sisipan.',
    organizer: 'Komite Sekolah & Satuan Pendidikan',
    location: 'Ruang Kelas Masing-masing Sekolah',
  },
  // February Events
  {
    id: 'evt-feb-1',
    title: 'Try Out Tahap 2 SNBT 2026',
    category: 'Ujian',
    color: '#8B5CF6',
    year: 2026,
    month: 1,
    day: 14,
    time: '08:00 – 12:00 WIB',
    level: 'SMA',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Simulasi ujian berbasis komputer nasional gelombang 2.',
    organizer: 'Panitia UTBK Bersama',
    location: 'Lab Komputer Satuan Pendidikan',
  },
  {
    id: 'evt-feb-2',
    title: 'Hari Libur Nasional Isra Mi’raj',
    category: 'Libur',
    color: '#EF4444',
    year: 2026,
    month: 1,
    day: 17,
    time: 'Sepanjang Hari',
    level: 'Semua Jenjang',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Libur resmi nasional peringatan Isra Mi’raj Nabi Muhammad SAW.',
    organizer: 'Pemerintah Republik Indonesia',
    location: 'Seluruh Indonesia',
  },
  // March Events
  {
    id: 'evt-mar-1',
    title: 'Ujian Praktik Kejuruan Mandiri SMK',
    category: 'Ujian',
    color: '#8B5CF6',
    year: 2026,
    month: 2,
    day: 1,
    time: '08:00 – 16:00 WIB',
    level: 'SMK',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Sekolah Negeri',
    description: 'Ujian unjuk keahlian teknis dan produksi di hadapan asesor industri mitra.',
    organizer: 'Direktorat SMK & Asosiasi Industri',
    location: 'Workshop SMK di Seluruh Indonesia',
  },
  {
    id: 'evt-mar-2',
    title: 'Hari Suci Nyepi Tahun Baru Saka 1948',
    category: 'Hari Besar Nasional',
    color: '#F59E0B',
    year: 2026,
    month: 2,
    day: 17,
    time: 'Sepanjang Hari',
    level: 'Semua Jenjang',
    provinsi: 'Seluruh Indonesia',
    institutionType: 'Semua Institusi',
    description: 'Hari libur nasional dan cuti bersama perayaan Hari Suci Nyepi.',
    organizer: 'Pemerintah Republik Indonesia',
    location: 'Seluruh Indonesia',
  },
];

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const CalendarPage: React.FC = () => {
  // Navigation Tabs at the very top
  const [activeTab, setActiveTab] = useState('Kalender Akademik');

  // Month navigation: default to Jan 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = Jan

  // View switch: 'Hari' | 'Minggu' | 'Bulan' | 'Tahun'
  const [calendarView, setCalendarView] = useState<'Hari' | 'Minggu' | 'Bulan' | 'Tahun'>('Bulan');

  // Level selector for bottom heatmap matrix
  const [selectedLevelMatrix, setSelectedLevelMatrix] = useState('SMA');

  // Modal state for viewing event detail
  const [selectedEventModal, setSelectedEventModal] = useState<CalendarEvent | null>(null);

  // Top Filter state
  const [search, setSearch] = useState('');
  const [selectedProv, setSelectedProv] = useState('Semua Provinsi');
  const [selectedLevel, setSelectedLevel] = useState('Semua Jenjang');
  const [selectedCategoryType, setSelectedCategoryType] = useState('Semua Jenis');
  const [selectedInstitutionType, setSelectedInstitutionType] = useState('Semua Institusi');

  // Category toggle badges
  const [categories, setCategories] = useState([
    { id: 'Kegiatan Akademik', label: 'Kegiatan Akademik', color: '#3B82F6', checked: true },
    { id: 'Ujian', label: 'Ujian', color: '#8B5CF6', checked: true },
    { id: 'Pendaftaran', label: 'Pendaftaran', color: '#10B981', checked: true },
    { id: 'Libur', label: 'Libur', color: '#EF4444', checked: true },
    { id: 'Hari Besar Nasional', label: 'Hari Besar Nasional', color: '#F59E0B', checked: true },
    { id: 'Kegiatan Khusus', label: 'Kegiatan Khusus', color: '#06B6D4', checked: true },
  ]);

  // Institution checkboxes
  const [institutions, setInstitutions] = useState([
    { id: 'sd', label: 'SD', checked: true },
    { id: 'smp', label: 'SMP', checked: true },
    { id: 'sma', label: 'SMA', checked: true },
    { id: 'smk', label: 'SMK', checked: true },
    { id: 'univ', label: 'Universitas', checked: true },
  ]);

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  const toggleInstitution = (id: string) => {
    setInstitutions((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, checked: !inst.checked } : inst))
    );
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedProv('Semua Provinsi');
    setSelectedLevel('Semua Jenjang');
    setSelectedCategoryType('Semua Jenis');
    setSelectedInstitutionType('Semua Institusi');
    setCategories((prev) => prev.map((c) => ({ ...c, checked: true })));
    setInstitutions((prev) => prev.map((i) => ({ ...i, checked: true })));
  };

  // Filtered Events based on all criteria
  const filteredEvents = useMemo(() => {
    return CALENDAR_EVENTS.filter((evt) => {
      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesDesc = evt.description.toLowerCase().includes(q);
        const matchesLoc = evt.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }

      // Provinsi
      if (selectedProv !== 'Semua Provinsi') {
        if (evt.provinsi !== 'Seluruh Indonesia' && evt.provinsi !== selectedProv) {
          return false;
        }
      }

      // Jenjang
      if (selectedLevel !== 'Semua Jenjang') {
        if (evt.level !== 'Semua Jenjang' && evt.level !== selectedLevel) {
          return false;
        }
      }

      // Jenis Kegiatan dropdown
      if (selectedCategoryType !== 'Semua Jenis') {
        if (evt.category !== selectedCategoryType) {
          return false;
        }
      }

      // Institusi dropdown
      if (selectedInstitutionType !== 'Semua Institusi') {
        if (
          evt.institutionType !== 'Semua Institusi' &&
          evt.institutionType !== selectedInstitutionType
        ) {
          return false;
        }
      }

      // Category toggle checkboxes
      const catConfig = categories.find((c) => c.id === evt.category);
      if (catConfig && !catConfig.checked) {
        return false;
      }

      return true;
    });
  }, [
    search,
    selectedProv,
    selectedLevel,
    selectedCategoryType,
    selectedInstitutionType,
    categories,
  ]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(0); // January 2026
  };

  // Build calendar matrix for currentMonth & currentYear
  // Senin = 1, Minggu = 7
  const calendarCells = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // In JS getDay(): 0 is Sunday, 1 is Monday ...
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
    // Convert so Monday = 0, Tuesday = 1, ... Sunday = 6
    const startOffset = (firstDayOfWeek + 6) % 7;

    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const cells: {
      day: number;
      isCurrentMonth: boolean;
      year: number;
      month: number;
      events: CalendarEvent[];
    }[] = [];

    // Previous month filler days
    for (let i = startOffset - 1; i >= 0; i--) {
      const prevDay = prevMonthDays - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dayEvts = filteredEvents.filter(
        (e) => e.year === prevYear && e.month === prevMonth && e.day === prevDay
      );
      cells.push({
        day: prevDay,
        isCurrentMonth: false,
        year: prevYear,
        month: prevMonth,
        events: dayEvts,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEvts = filteredEvents.filter(
        (e) => e.year === currentYear && e.month === currentMonth && e.day === d
      );
      cells.push({
        day: d,
        isCurrentMonth: true,
        year: currentYear,
        month: currentMonth,
        events: dayEvts,
      });
    }

    // Next month filler days up to full 35 or 42 cells
    const remaining = (7 - (cells.length % 7)) % 7;
    const totalNeeded = cells.length + remaining < 35 ? 35 - cells.length : remaining;
    for (let nextDay = 1; nextDay <= totalNeeded; nextDay++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dayEvts = filteredEvents.filter(
        (e) => e.year === nextYear && e.month === nextMonth && e.day === nextDay
      );
      cells.push({
        day: nextDay,
        isCurrentMonth: false,
        year: nextYear,
        month: nextMonth,
        events: dayEvts,
      });
    }

    return cells;
  }, [currentYear, currentMonth, filteredEvents]);

  // Statistics Data
  const statsData = useMemo(() => {
    const counts: Record<string, number> = {
      'Kegiatan Akademik': 42,
      Ujian: 28,
      Pendaftaran: 19,
      Libur: 25,
      'Hari Besar Nasional': 12,
      'Kegiatan Khusus': 16,
    };
    return [
      { name: 'Kegiatan Akademik', count: counts['Kegiatan Akademik'], color: '#3B82F6' },
      { name: 'Ujian', count: counts['Ujian'], color: '#8B5CF6' },
      { name: 'Pendaftaran', count: counts['Pendaftaran'], color: '#10B981' },
      { name: 'Libur', count: counts['Libur'], color: '#EF4444' },
      { name: 'Hari Besar Nasional', count: counts['Hari Besar Nasional'], color: '#F59E0B' },
      { name: 'Kegiatan Khusus', count: counts['Kegiatan Khusus'], color: '#06B6D4' },
    ];
  }, []);

  // Matrix months & levels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  const levels = ['SD', 'SMP', 'SMA', 'SMK', 'Universitas'];

  // Agenda Hari Ini items
  const todayAgenda = useMemo(() => {
    return [
      {
        id: 'agenda-1',
        time: '08:00 – 10:00',
        title: 'Ujian Tengah Semester SMA/SMK (Matematika)',
        location: 'Seluruh Indonesia',
        level: 'SMA/SMK',
        category: 'Ujian',
        color: '#8B5CF6',
        description: 'Pelaksanaan ujian tengah semester mata pelajaran matematika serentak se-Indonesia.',
        organizer: 'Satuan Pendidikan Nasional',
      },
      {
        id: 'agenda-2',
        time: '10:00 – 12:00',
        title: 'Ujian Tengah Semester SMP (Matematika)',
        location: 'Seluruh Indonesia',
        level: 'SMP',
        category: 'Ujian',
        color: '#8B5CF6',
        description: 'Asesmen tengah semester tingkat SMP se-Indonesia.',
        organizer: 'Dinas Pendidikan Daerah',
      },
      {
        id: 'agenda-3',
        time: '13:00 – 15:00',
        title: 'Ujian Tengah Semester SD (Bahasa Indonesia)',
        location: 'Seluruh Indonesia',
        level: 'SD',
        category: 'Ujian',
        color: '#8B5CF6',
        description: 'Asesmen tengah semester tingkat SD bidang literasi Bahasa Indonesia.',
        organizer: 'Sekolah Dasar se-Indonesia',
      },
      {
        id: 'agenda-4',
        time: '15:00 – 16:30',
        title: 'Rapat Koordinasi Kepala Sekolah & Dinas',
        location: 'Provinsi Jawa Barat',
        level: 'Semua Jenjang',
        category: 'Kegiatan Akademik',
        color: '#3B82F6',
        description: 'Sinkronisasi program sekolah ramah anak dan kurikulum merdeka semester genap.',
        organizer: 'Dinas Pendidikan Jawa Barat',
      },
    ];
  }, []);

  // Upcoming events items
  const upcomingEvents = useMemo(() => {
    return [
      {
        id: 'upcoming-1',
        date: '24',
        month: 'Jan',
        title: 'Seminar Pendidikan & Transformasi Digital',
        category: 'Kegiatan Khusus',
        location: 'Jakarta Convention Center',
        color: '#06B6D4',
        level: 'Universitas',
        time: '09:00 – 16:00 WIB',
        description: 'Simposium internasional inovasi kurikulum abad 21 bersama praktisi EdTech dan pakar pedagogi.',
        organizer: 'Universitas Indonesia & Kemendikbudristek',
      },
      {
        id: 'upcoming-2',
        date: '26',
        month: 'Jan',
        title: 'Pembukaan Pendaftaran SNBP 2026',
        category: 'Pendaftaran',
        location: 'Portal SNPMB Pusat',
        color: '#10B981',
        level: 'SMA',
        time: '15:00 WIB',
        description: 'Pembukaan resmi pendaftaran Seleksi Nasional Berdasarkan Prestasi oleh BPPP.',
        organizer: 'Panitia SNPMB PTN',
      },
      {
        id: 'upcoming-3',
        date: '14',
        month: 'Feb',
        title: 'Try Out Akbar SNBT 2026 Tahap 2',
        category: 'Ujian',
        location: 'Daring / Seluruh Indonesia',
        color: '#8B5CF6',
        level: 'SMA/SMK',
        time: '08:00 – 12:00 WIB',
        description: 'Simulasi ujian UTBK nasional berbasis komputer untuk persiapan tes PTN.',
        organizer: 'Konsorsium Perguruan Tinggi Negeri',
      },
      {
        id: 'upcoming-4',
        date: '01',
        month: 'Mar',
        title: 'Ujian Praktik Kejuruan Mandiri SMK',
        category: 'Ujian',
        location: 'Workshop SMK Nasional',
        color: '#8B5CF6',
        level: 'SMK',
        time: '08:00 – 16:00 WIB',
        description: 'Uji kompetensi kejuruan SMK bersama asosiasi industri mitra.',
        organizer: 'Direktorat Pembinaan SMK',
      },
      {
        id: 'upcoming-5',
        date: '17',
        month: 'Mar',
        title: 'Hari Raya Nyepi Tahun Baru Saka 1948',
        category: 'Hari Besar Nasional',
        location: 'Seluruh Indonesia',
        color: '#F59E0B',
        level: 'Semua Jenjang',
        time: 'Sepanjang Hari',
        description: 'Libur resmi nasional peringatan Hari Raya Nyepi Tahun Baru Saka 1948.',
        organizer: 'Pemerintah Republik Indonesia',
      },
    ];
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Calendar & Scheduling"
        subtitle="Lihat kalender akademik, jadwal kegiatan, dan agenda penting pendidikan di seluruh Indonesia."
      />

      {/* 2. Top Category Pills Strip (Standard Navy #0F2942 & rounded-xl) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          'Kalender Akademik',
          'Jadwal Ujian',
          'Jadwal Pendaftaran',
          'Libur & Hari Besar',
          'Kegiatan Pendidikan',
          'Scheduler',
          'Daftar Agenda',
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

      {/* 3. FILTER BAR SECTION (Horizontal Full-Width placed before Calendar) */}
      <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs space-y-4">
        {/* Filter Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0F4F8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E6F8F6] text-[#25A9A1] flex items-center justify-center font-bold">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172B4D]">Filter Kalender & Kegiatan</h3>
              <p className="text-[11px] text-[#526579]">
                Sesuaikan provinsi, jenjang pendidikan, jenis kegiatan, dan instansi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-[#526579] bg-[#F5F8FC] border border-[#DCE5EF] px-3 py-1.5 rounded-xl">
              Menampilkan <span className="font-bold text-[#0F2942]">{filteredEvents.length}</span> kegiatan
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#25A9A1] hover:bg-[#E6F8F6] rounded-xl transition-colors cursor-pointer border border-[#25A9A1]/20"
              title="Kembalikan semua filter ke pengaturan awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        </div>

        {/* Row 1: Dropdown Filters & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-1">
            <label className="block text-[10px] font-bold text-[#526579] uppercase tracking-wider mb-1">
              Pencarian
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kegiatan / acara..."
                className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs rounded-xl pl-8 pr-7 py-2 text-[#172B4D] placeholder-gray-400 outline-none focus:border-[#25A9A1] focus:bg-white transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Provinsi Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-[#526579] uppercase tracking-wider mb-1">
              Provinsi
            </label>
            <div className="relative">
              <select
                value={selectedProv}
                onChange={(e) => setSelectedProv(e.target.value)}
                className="w-full appearance-none bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-xl px-3 py-2 text-[#172B4D] outline-none focus:border-[#25A9A1] focus:bg-white transition-colors cursor-pointer pr-8"
              >
                <option>Semua Provinsi</option>
                <option>DKI Jakarta</option>
                <option>Jawa Barat</option>
                <option>Jawa Tengah</option>
                <option>DI Yogyakarta</option>
                <option>Jawa Timur</option>
                <option>Sumatera Utara</option>
                <option>Bali</option>
                <option>Sulawesi Selatan</option>
                <option>Kalimantan Timur</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Jenjang Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-[#526579] uppercase tracking-wider mb-1">
              Jenjang Pendidikan
            </label>
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full appearance-none bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-xl px-3 py-2 text-[#172B4D] outline-none focus:border-[#25A9A1] focus:bg-white transition-colors cursor-pointer pr-8"
              >
                <option>Semua Jenjang</option>
                <option>SD</option>
                <option>SMP</option>
                <option>SMA</option>
                <option>SMK</option>
                <option>Universitas</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Jenis Kegiatan Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-[#526579] uppercase tracking-wider mb-1">
              Jenis Kegiatan
            </label>
            <div className="relative">
              <select
                value={selectedCategoryType}
                onChange={(e) => setSelectedCategoryType(e.target.value)}
                className="w-full appearance-none bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-xl px-3 py-2 text-[#172B4D] outline-none focus:border-[#25A9A1] focus:bg-white transition-colors cursor-pointer pr-8"
              >
                <option>Semua Jenis</option>
                <option>Kegiatan Akademik</option>
                <option>Ujian</option>
                <option>Pendaftaran</option>
                <option>Libur</option>
                <option>Hari Besar Nasional</option>
                <option>Kegiatan Khusus</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Institusi Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-[#526579] uppercase tracking-wider mb-1">
              Institusi
            </label>
            <div className="relative">
              <select
                value={selectedInstitutionType}
                onChange={(e) => setSelectedInstitutionType(e.target.value)}
                className="w-full appearance-none bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-xl px-3 py-2 text-[#172B4D] outline-none focus:border-[#25A9A1] focus:bg-white transition-colors cursor-pointer pr-8"
              >
                <option>Semua Institusi</option>
                <option>Sekolah Negeri</option>
                <option>Sekolah Swasta</option>
                <option>Perguruan Tinggi</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2: Category Toggle Badges & Instansi Pills */}
        <div className="pt-3 border-t border-[#F0F4F8] flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#172B4D] flex items-center gap-1.5 mr-1">
              <Tag className="w-3.5 h-3.5 text-[#526579]" /> Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                  cat.checked
                    ? 'bg-white border-[#DCE5EF] text-[#172B4D] shadow-2xs'
                    : 'bg-[#F8FAFC] border-dashed border-[#CBD5E1] text-[#94A3B8] opacity-60'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-[11px] font-semibold">{cat.label}</span>
                {cat.checked && <Check className="w-3 h-3 text-[#25A9A1] ml-0.5" />}
              </button>
            ))}
          </div>

          {/* Quick Instansi Filter Chips */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#172B4D] flex items-center gap-1 mr-1">
              <Building2 className="w-3.5 h-3.5 text-[#526579]" /> Jenjang:
            </span>
            {institutions.map((inst) => (
              <button
                key={inst.id}
                onClick={() => toggleInstitution(inst.id)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer border ${
                  inst.checked
                    ? 'bg-[#0F2942] text-white border-[#0F2942]'
                    : 'bg-[#F8FAFC] text-[#526579] border-[#DCE5EF] hover:bg-gray-100'
                }`}
              >
                {inst.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. CALENDAR FULL WIDTH ("calendar full") */}
      <div className="w-full bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs space-y-4">
        {/* Calendar Controls & Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F0F4F8]">
          {/* Left: View Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F5F8FC] border border-[#DCE5EF] rounded-xl p-1 text-xs">
              {(['Hari', 'Minggu', 'Bulan', 'Tahun'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setCalendarView(view)}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    calendarView === view
                      ? 'bg-[#0F2942] text-white shadow-xs'
                      : 'text-[#526579] hover:text-[#172B4D] hover:bg-white/60'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-[#E6F8F6] text-[#25A9A1] rounded-lg text-xs font-bold">
              <CalendarDays className="w-3.5 h-3.5" />
              Tahun Ajaran 2025/2026
            </span>
          </div>

          {/* Center: Month Navigator */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-[#DCE5EF] hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer shadow-2xs"
              title="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-base font-bold text-[#172B4D] min-w-[140px] text-center tracking-tight">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-[#DCE5EF] hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer shadow-2xs"
              title="Bulan berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#DCE5EF] rounded-xl text-[#0F2942] hover:bg-gray-50 ml-1 transition-colors cursor-pointer shadow-2xs"
            >
              Hari Ini
            </button>
          </div>

          {/* Right: Legend Tags Preview */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-semibold text-[#526579]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]" /> Akademik
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Ujian
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Pendaftaran
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Libur
            </span>
          </div>
        </div>

        {/* View Content */}
        {calendarView === 'Bulan' && (
          <div className="w-full">
            {/* Days Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#526579] py-2.5 bg-[#F8FAFC] rounded-xl border border-[#EDF2F7]">
              <div>Senin</div>
              <div>Selasa</div>
              <div>Rabu</div>
              <div>Kamis</div>
              <div>Jumat</div>
              <div>Sabtu</div>
              <div>Minggu</div>
            </div>

            {/* Days Cells Grid */}
            <div className="grid grid-cols-7 gap-2 mt-2">
              {calendarCells.map((cell, idx) => {
                const isToday =
                  cell.isCurrentMonth &&
                  cell.day === 20 &&
                  cell.month === 0 &&
                  cell.year === 2026;

                return (
                  <div
                    key={idx}
                    className={`min-h-[110px] border rounded-xl p-2 transition-all flex flex-col justify-between ${
                      cell.isCurrentMonth
                        ? 'bg-white border-[#E2E8F0] hover:border-[#25A9A1] hover:shadow-sm'
                        : 'bg-[#F8FAFC] border-[#EDF2F7] text-gray-300'
                    }`}
                  >
                    {/* Top Day Number Row */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-gray-400">
                        {cell.events.length > 0 && cell.isCurrentMonth && (
                          <span className="text-[9px] font-bold text-[#25A9A1]">
                            {cell.events.length} event
                          </span>
                        )}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          isToday
                            ? 'w-6 h-6 inline-flex items-center justify-center rounded-full bg-[#0F2942] text-white font-bold shadow-xs'
                            : cell.isCurrentMonth
                            ? 'text-[#172B4D]'
                            : 'text-gray-300'
                        }`}
                      >
                        {cell.day}
                      </span>
                    </div>

                    {/* Events List inside Day Cell */}
                    <div className="space-y-1.5 mt-1.5 flex-1 overflow-y-auto max-h-[85px] scrollbar-none">
                      {cell.events.slice(0, 2).map((evt) => (
                        <div
                          key={evt.id}
                          onClick={() => setSelectedEventModal(evt)}
                          className="px-2 py-1 rounded-md text-[10px] font-semibold text-white truncate cursor-pointer shadow-2xs hover:brightness-105 transition-all flex items-center gap-1.5"
                          style={{ backgroundColor: evt.color }}
                          title={`${evt.title} (${evt.time})`}
                        >
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                          <span className="truncate">{evt.title}</span>
                        </div>
                      ))}

                      {/* "+N lainnya" if more than 2 events */}
                      {cell.events.length > 2 && (
                        <button
                          onClick={() => setSelectedEventModal(cell.events[2])}
                          className="w-full text-center py-0.5 text-[9px] font-bold text-[#0F2942] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded transition-colors cursor-pointer"
                        >
                          +{cell.events.length - 2} lainnya
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View Content: Hari */}
        {calendarView === 'Hari' && (
          <div className="p-6 bg-[#F8FAFC] rounded-xl border border-[#EDF2F7] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-[#172B4D]">
                  Jadwal Kegiatan: Selasa, 20 Januari 2026
                </h4>
                <p className="text-xs text-[#526579]">
                  Rincian seluruh sesi pembelajaran, ujian, dan koordinasi pendidikan hari ini.
                </p>
              </div>
              <span className="px-3 py-1 bg-[#25A9A1] text-white rounded-lg text-xs font-bold">
                Hari Ini Aktif
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {todayAgenda.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#DCE5EF] rounded-xl p-4 flex items-center justify-between shadow-2xs hover:border-[#25A9A1] transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0F2942] bg-[#F1F5F9] px-2 py-0.5 rounded">
                          {item.time}
                        </span>
                        <span className="text-xs font-bold text-[#172B4D]">{item.title}</span>
                      </div>
                      <p className="text-xs text-[#526579] mt-1">{item.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-[#526579]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {item.location}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-[#0F2942]">{item.level}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedEventModal({
                        id: item.id,
                        title: item.title,
                        category: item.category as any,
                        color: item.color,
                        year: 2026,
                        month: 0,
                        day: 20,
                        time: item.time,
                        level: item.level,
                        provinsi: item.location,
                        institutionType: 'Semua Institusi',
                        description: item.description,
                        organizer: item.organizer,
                        location: item.location,
                      })
                    }
                    className="px-3 py-1.5 text-xs font-bold text-[#25A9A1] border border-[#25A9A1]/30 hover:bg-[#E6F8F6] rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Detail
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Content: Minggu */}
        {calendarView === 'Minggu' && (
          <div className="p-6 bg-[#F8FAFC] rounded-xl border border-[#EDF2F7]">
            <h4 className="text-sm font-bold text-[#172B4D] mb-3">
              Jadwal Mingguan: 19 - 25 Januari 2026 (Pekan Asesmen Sumatif Tengah Semester)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mt-2">
              {[
                { day: 'Senin, 19 Jan', title: 'UTS Matematika', color: '#8B5CF6' },
                { day: 'Selasa, 20 Jan', title: 'UTS Bhs Indonesia', color: '#8B5CF6' },
                { day: 'Rabu, 21 Jan', title: 'UTS IPA / Sains', color: '#8B5CF6' },
                { day: 'Kamis, 22 Jan', title: 'UTS IPS & Agama', color: '#8B5CF6' },
                { day: 'Jumat, 23 Jan', title: 'Remedial & Review', color: '#3B82F6' },
                { day: 'Sabtu, 24 Jan', title: 'Seminar EdTech', color: '#06B6D4' },
                { day: 'Minggu, 25 Jan', title: 'Libur Akhir Pekan', color: '#EF4444' },
              ].map((w, i) => (
                <div key={i} className="bg-white border border-[#DCE5EF] rounded-xl p-3 shadow-2xs">
                  <div className="text-xs font-bold text-[#0F2942] pb-1 border-b border-[#F0F4F8]">
                    {w.day}
                  </div>
                  <div
                    className="mt-2 text-[11px] font-semibold text-white p-2 rounded-lg"
                    style={{ backgroundColor: w.color }}
                  >
                    {w.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Content: Tahun */}
        {calendarView === 'Tahun' && (
          <div className="p-6 bg-[#F8FAFC] rounded-xl border border-[#EDF2F7]">
            <h4 className="text-sm font-bold text-[#172B4D] mb-3">
              Kalender Tahunan Akademik 2026 (12 Bulan)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
              {MONTH_NAMES.map((mName, mIdx) => (
                <div
                  key={mName}
                  onClick={() => {
                    setCurrentMonth(mIdx);
                    setCalendarView('Bulan');
                  }}
                  className={`bg-white border rounded-xl p-3 shadow-2xs hover:border-[#25A9A1] cursor-pointer transition-all ${
                    currentMonth === mIdx ? 'border-[#25A9A1] ring-2 ring-[#25A9A1]/20' : 'border-[#DCE5EF]'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#F0F4F8]">
                    <span className="text-xs font-bold text-[#172B4D]">{mName}</span>
                    <span className="text-[10px] text-[#25A9A1] font-semibold">2026</span>
                  </div>
                  <div className="text-[11px] text-[#526579] mt-2">
                    {mIdx === 0 && '20 Kegiatan Terjadwal (UTS, SNBP)'}
                    {mIdx === 1 && '12 Kegiatan (SNBT TO 2, Isra Miraj)'}
                    {mIdx === 2 && '15 Kegiatan (Ujian Praktik, Nyepi)'}
                    {mIdx > 2 && `${8 + (mIdx % 5)} Kegiatan Terjadwal`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. "SISANYA DI BAWAHNYA" - SECTION 1: Agenda Hari Ini & Upcoming Events (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Agenda Hari Ini */}
        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
                  <CalIcon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#172B4D]">Agenda Hari Ini</h4>
              </div>
              <p className="text-[11px] text-[#526579] mt-1">Selasa, 20 Januari 2026</p>
            </div>
            <span className="text-xs font-bold text-[#0284C7] bg-[#E0F2FE] px-2.5 py-1 rounded-xl">
              4 Kegiatan
            </span>
          </div>

          <div className="space-y-3">
            {todayAgenda.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-[#F0F4F8] hover:border-[#DCE5EF] hover:bg-[#F8FAFC] transition-all bg-white"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-md">
                    {item.time}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                    {item.level}
                  </span>
                </div>

                <div className="flex items-start gap-2 mt-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="text-xs font-bold text-[#172B4D] leading-snug">
                    {item.title}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F1F5F9] text-[11px] text-[#526579]">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span>{item.location}</span>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedEventModal({
                        id: item.id,
                        title: item.title,
                        category: item.category as any,
                        color: item.color,
                        year: 2026,
                        month: 0,
                        day: 20,
                        time: item.time,
                        level: item.level,
                        provinsi: item.location,
                        institutionType: 'Semua Institusi',
                        description: item.description,
                        organizer: item.organizer,
                        location: item.location,
                      })
                    }
                    className="text-[#0284C7] hover:underline font-bold text-[11px] cursor-pointer"
                  >
                    Detail →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Upcoming Events */}
        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E6F8F6] text-[#25A9A1] flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#172B4D]">Upcoming Events</h4>
                <p className="text-[11px] text-[#526579]">Agenda penting 30 hari ke depan</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#25A9A1] bg-[#E6F8F6] px-2.5 py-1 rounded-xl">
              5 Kegiatan
            </span>
          </div>

          <div className="space-y-2.5">
            {upcomingEvents.map((ev, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-[#F0F4F8] hover:border-[#DCE5EF] hover:bg-[#F8FAFC] transition-all bg-white"
              >
                {/* Date Square Badge */}
                <div className="w-12 h-12 rounded-xl bg-[#0F2942] text-white flex flex-col items-center justify-center shrink-0 shadow-2xs">
                  <span className="text-sm font-black leading-none">{ev.date}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-teal-300 mt-0.5">
                    {ev.month}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: ev.color }}
                    />
                    <div className="text-xs font-bold text-[#172B4D] truncate">{ev.title}</div>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#526579]">
                    <span className="font-semibold text-[#0F2942]">{ev.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 truncate text-gray-500">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {ev.location}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedEventModal({
                      id: ev.id,
                      title: ev.title,
                      category: ev.category as any,
                      color: ev.color,
                      year: 2026,
                      month: 0,
                      day: parseInt(ev.date),
                      time: ev.time,
                      level: ev.level,
                      provinsi: ev.location,
                      institutionType: 'Semua Institusi',
                      description: ev.description,
                      organizer: ev.organizer,
                      location: ev.location,
                    })
                  }
                  className="px-2.5 py-1 text-xs font-bold text-[#25A9A1] hover:bg-[#E6F8F6] rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Detail
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. "SISANYA DI BAWAHNYA" - SECTION 2: Analytics, Roadmap Timeline, and Matrix (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Statistik Kegiatan Tahun 2026 */}
        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
              <div className="flex items-center gap-2">
                <span className="text-base">📊</span>
                <h4 className="text-xs font-bold text-[#172B4D]">Statistik Kegiatan Tahun 2026</h4>
              </div>
              <span className="text-[11px] font-bold text-[#0F2942] bg-[#F1F5F9] px-2 py-0.5 rounded-lg">
                Total 142 Event
              </span>
            </div>

            <div className="h-48 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData} margin={{ top: 15, right: 10, left: -25, bottom: 25 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: '#526579' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
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
                    {statsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0F4F8] grid grid-cols-3 gap-1.5 text-center text-[10px]">
            <div className="bg-[#F8FAFC] p-1.5 rounded-lg">
              <span className="font-bold text-[#3B82F6] block text-xs">42</span>
              <span className="text-gray-500">Akademik</span>
            </div>
            <div className="bg-[#F8FAFC] p-1.5 rounded-lg">
              <span className="font-bold text-[#8B5CF6] block text-xs">28</span>
              <span className="text-gray-500">Ujian</span>
            </div>
            <div className="bg-[#F8FAFC] p-1.5 rounded-lg">
              <span className="font-bold text-[#10B981] block text-xs">19</span>
              <span className="text-gray-500">Pendaftaran</span>
            </div>
          </div>
        </div>

        {/* Card 2: Timeline Kegiatan Penting */}
        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
              <div className="flex items-center gap-2">
                <span className="text-base">⏳</span>
                <h4 className="text-xs font-bold text-[#172B4D]">Timeline Kegiatan Penting</h4>
              </div>
              <span className="text-[11px] font-bold text-[#25A9A1] bg-[#E6F8F6] px-2 py-0.5 rounded-lg">
                Semester Genap
              </span>
            </div>

            <div className="mt-6 px-3">
              <div className="relative">
                {/* Horizontal milestone bar */}
                <div className="w-full h-1.5 bg-gray-200 rounded-full relative my-8">
                  {/* Milestone 1 */}
                  <div className="absolute -top-2 left-[5%] flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#3B82F6] border-2 border-white shadow-xs flex items-center justify-center text-white text-[9px] font-bold">
                      1
                    </div>
                    <span className="text-[9px] font-bold text-[#172B4D] mt-2 whitespace-nowrap">
                      Awal Semester
                    </span>
                    <span className="text-[8px] text-gray-400">2 Jan 2026</span>
                  </div>

                  {/* Milestone 2 */}
                  <div className="absolute -top-2 left-[28%] flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#8B5CF6] border-2 border-white shadow-xs flex items-center justify-center text-white text-[9px] font-bold">
                      2
                    </div>
                    <span className="text-[9px] font-bold text-[#172B4D] mt-2 whitespace-nowrap">
                      UTS Nasional
                    </span>
                    <span className="text-[8px] text-gray-400">19-22 Jan</span>
                  </div>

                  {/* Milestone 3 */}
                  <div className="absolute -top-2 left-[50%] flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#10B981] border-2 border-white shadow-xs flex items-center justify-center text-white text-[9px] font-bold">
                      3
                    </div>
                    <span className="text-[9px] font-bold text-[#172B4D] mt-2 whitespace-nowrap">
                      SNBP 2026
                    </span>
                    <span className="text-[8px] text-gray-400">26 Jan</span>
                  </div>

                  {/* Milestone 4 */}
                  <div className="absolute -top-2 left-[73%] flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#8B5CF6] border-2 border-white shadow-xs flex items-center justify-center text-white text-[9px] font-bold">
                      4
                    </div>
                    <span className="text-[9px] font-bold text-[#172B4D] mt-2 whitespace-nowrap">
                      Ujian Akhir
                    </span>
                    <span className="text-[8px] text-gray-400">Mar-Apr</span>
                  </div>

                  {/* Milestone 5 */}
                  <div className="absolute -top-2 left-[95%] flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#F59E0B] border-2 border-white shadow-xs flex items-center justify-center text-white text-[9px] font-bold">
                      5
                    </div>
                    <span className="text-[9px] font-bold text-[#172B4D] mt-2 whitespace-nowrap">
                      Kelulusan
                    </span>
                    <span className="text-[8px] text-gray-400">Juni 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0F4F8] text-[11px] text-[#526579] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" /> Milestone Terpadu
            </span>
            <span className="font-semibold text-[#0F2942]">Kurikulum Merdeka</span>
          </div>
        </div>

        {/* Card 3: Kalender per Jenjang Heatmap */}
        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
              <div className="flex items-center gap-2">
                <span className="text-base">📚</span>
                <h4 className="text-xs font-bold text-[#172B4D]">Kalender per Jenjang</h4>
              </div>
              <select
                value={selectedLevelMatrix}
                onChange={(e) => setSelectedLevelMatrix(e.target.value)}
                className="bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-semibold rounded-lg px-2.5 py-1 outline-none text-[#172B4D] cursor-pointer"
              >
                <option>SMA</option>
                <option>SMP</option>
                <option>SD</option>
                <option>SMK</option>
                <option>Universitas</option>
              </select>
            </div>

            <div className="mt-3 overflow-x-auto">
              <div className="min-w-[280px]">
                {/* Header months */}
                <div className="grid grid-cols-13 gap-1 text-[9px] font-bold text-gray-400 mb-1.5 text-center">
                  <div className="text-left font-normal text-transparent">L</div>
                  {months.map((m) => (
                    <div key={m}>{m}</div>
                  ))}
                </div>

                {/* Rows */}
                {levels.map((lvl, lIdx) => (
                  <div key={lvl} className="grid grid-cols-13 gap-1 items-center mb-1.5">
                    <span className="text-[9px] font-bold text-[#526579] truncate">{lvl}</span>
                    {months.map((m, mIdx) => {
                      const colorPalette = [
                        '#E0F2FE',
                        '#BAE6FD',
                        '#A7F3D0',
                        '#FEF3C7',
                        '#FDE68A',
                        '#FBCFE8',
                        '#DDD6FE',
                        '#CFFAFE',
                      ];
                      const colorIndex = (lIdx * 3 + mIdx) % colorPalette.length;
                      const bg = colorPalette[colorIndex];

                      return (
                        <div
                          key={m}
                          className="h-4.5 rounded-xs transition-transform hover:scale-115 cursor-pointer shadow-2xs"
                          style={{ backgroundColor: bg }}
                          title={`${lvl} - ${m}: Jadwal Kegiatan Aktif`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0F4F8] flex items-center justify-between text-[11px] text-[#526579]">
            <span>Intensitas Kegiatan</span>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-400">Rendah</span>
              <div className="w-3 h-3 rounded-xs bg-[#E0F2FE]" />
              <div className="w-3 h-3 rounded-xs bg-[#BAE6FD]" />
              <div className="w-3 h-3 rounded-xs bg-[#DDD6FE]" />
              <div className="w-3 h-3 rounded-xs bg-[#FDE68A]" />
              <span className="text-[9px] text-gray-400">Tinggi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. EVENT DETAIL MODAL */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#DCE5EF] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: selectedEventModal.color }}
                />
                <span className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">
                  Detail Kegiatan Kalender
                </span>
              </div>
              <button
                onClick={() => setSelectedEventModal(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white mb-2"
                  style={{ backgroundColor: selectedEventModal.color }}
                >
                  {selectedEventModal.category}
                </span>
                <h3 className="text-lg font-bold text-[#172B4D] leading-snug">
                  {selectedEventModal.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F5F8FC] rounded-xl border border-[#EDF2F7] text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">
                    Waktu Pelaksanaan
                  </span>
                  <span className="font-semibold text-[#172B4D] mt-0.5 block">
                    {selectedEventModal.day} {MONTH_NAMES[selectedEventModal.month]} {selectedEventModal.year}
                  </span>
                  <span className="text-gray-500 text-[11px]">{selectedEventModal.time}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">
                    Sasaran & Jenjang
                  </span>
                  <span className="font-semibold text-[#172B4D] mt-0.5 block">
                    {selectedEventModal.level}
                  </span>
                  <span className="text-gray-500 text-[11px]">
                    {selectedEventModal.institutionType}
                  </span>
                </div>

                <div className="col-span-2 pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">
                    Lokasi / Cakupan
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[#172B4D] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#25A9A1]" />
                    <span>{selectedEventModal.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-1">
                  Deskripsi Kegiatan
                </h4>
                <p className="text-xs text-[#526579] leading-relaxed">
                  {selectedEventModal.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F0F4F8] flex items-center justify-between text-xs text-gray-400">
                <span>Penyelenggara:</span>
                <span className="font-semibold text-[#172B4D]">
                  {selectedEventModal.organizer}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end gap-2">
              <button
                onClick={() => setSelectedEventModal(null)}
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
