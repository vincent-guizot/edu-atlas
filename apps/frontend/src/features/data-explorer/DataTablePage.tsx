import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import {
  Search,
  Filter,
  Columns,
  ArrowUpDown,
  MapPin,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Building2,
  GraduationCap,
  Users,
  Award,
  BookOpen,
} from 'lucide-react';

export interface InstitutionItem {
  id: number;
  name: string;
  npsn: string;
  level: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'Universitas';
  status: 'Negeri' | 'Swasta';
  prov: string;
  city: string;
  siswa: number;
  guru: number;
  rasio: number;
  accred: 'A' | 'B' | 'C';
  address: string;
  curriculum?: string;
  headmaster?: string;
}

// Comprehensive realistic dataset with 34 items across regions and educational stages
export const INSTITUTIONS_DATASET: InstitutionItem[] = [
  {
    id: 1,
    name: 'SMA Negeri 1 Bandung',
    npsn: '20234567',
    level: 'SMA',
    status: 'Negeri',
    prov: 'Jawa Barat',
    city: 'Kota Bandung',
    siswa: 1245,
    guru: 87,
    rasio: 14.3,
    accred: 'A',
    address: 'Jl. Ir. H. Juanda No.93, Coblong',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Drs. H. Hendrayana, M.M.Pd.',
  },
  {
    id: 2,
    name: 'SMP Negeri 3 Bekasi',
    npsn: '20234568',
    level: 'SMP',
    status: 'Negeri',
    prov: 'Jawa Barat',
    city: 'Kota Bekasi',
    siswa: 892,
    guru: 64,
    rasio: 13.9,
    accred: 'A',
    address: 'Jl. K.H. Agus Salim No.12, Bekasi Timur',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Dra. Hj. Sri Wahyuni, M.Pd.',
  },
  {
    id: 3,
    name: 'SD Negeri Sukajadi 1',
    npsn: '20234569',
    level: 'SD',
    status: 'Negeri',
    prov: 'Jawa Barat',
    city: 'Kota Bandung',
    siswa: 356,
    guru: 28,
    rasio: 12.7,
    accred: 'A',
    address: 'Jl. Sukajadi No.112, Sukajadi',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Drs. Aep Saepudin',
  },
  {
    id: 4,
    name: 'SMK Teknologi Bandung',
    npsn: '20234570',
    level: 'SMK',
    status: 'Swasta',
    prov: 'Jawa Barat',
    city: 'Kota Bandung',
    siswa: 680,
    guru: 52,
    rasio: 13.1,
    accred: 'B',
    address: 'Jl. Soekarno Hatta No.478, Batununggal',
    curriculum: 'Kurikulum Merdeka - Vokasi',
    headmaster: 'Ir. Budi Santoso, M.T.',
  },
  {
    id: 5,
    name: 'Universitas Pendidikan Indonesia',
    npsn: '20234571',
    level: 'Universitas',
    status: 'Negeri',
    prov: 'Jawa Barat',
    city: 'Kota Bandung',
    siswa: 24532,
    guru: 1852,
    rasio: 13.2,
    accred: 'A',
    address: 'Jl. Dr. Setiabudi No.229, Sukasari',
    curriculum: 'Kampus Merdeka (OBE)',
    headmaster: 'Prof. Dr. M. Solehuddin, M.Pd., M.A.',
  },
  {
    id: 6,
    name: 'SMA Negeri 2 Bogor',
    npsn: '20234572',
    level: 'SMA',
    status: 'Negeri',
    prov: 'Jawa Barat',
    city: 'Kota Bogor',
    siswa: 1102,
    guru: 78,
    rasio: 14.1,
    accred: 'A',
    address: 'Jl. Kranji No.1, Tanah Sareal',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Drs. H. Dede Rohadi, M.Pd.',
  },
  {
    id: 7,
    name: 'SMP Islam Al-Falah',
    npsn: '20234573',
    level: 'SMP',
    status: 'Swasta',
    prov: 'Jawa Barat',
    city: 'Kab. Bogor',
    siswa: 742,
    guru: 52,
    rasio: 14.3,
    accred: 'B',
    address: 'Jl. Raya Cibinong No.45, Cibinong',
    curriculum: 'Kurikulum Terpadu & Karakter',
    headmaster: 'H. Ahmad Fauzi, S.Pd.I.',
  },
  {
    id: 8,
    name: 'SD Negeri Cibinong 01',
    npsn: '20234574',
    level: 'SD',
    status: 'Negeri',
    prov: 'Jawa Barat',
    city: 'Kab. Bogor',
    siswa: 412,
    guru: 32,
    rasio: 12.9,
    accred: 'A',
    address: 'Jl. Mayor Oking No.8, Cibinong',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Hj. Neneng Surtini, S.Pd.',
  },
  {
    id: 9,
    name: 'SMK Negeri 1 Depok',
    npsn: '20234575',
    level: 'SMK',
    status: 'Negeri',
    prov: 'Jawa Barat',
    city: 'Kota Depok',
    siswa: 980,
    guru: 68,
    rasio: 14.4,
    accred: 'A',
    address: 'Jl. Bhakti Suci No.100, Cimpaeun, Tapos',
    curriculum: 'Kurikulum Merdeka - Industri',
    headmaster: 'Drs. Tatang Komarudin, M.M.',
  },
  {
    id: 10,
    name: 'SMA Plus Bina Insani',
    npsn: '20234576',
    level: 'SMA',
    status: 'Swasta',
    prov: 'Jawa Barat',
    city: 'Kota Bogor',
    siswa: 754,
    guru: 49,
    rasio: 15.4,
    accred: 'B',
    address: 'Jl. KH. Sholeh Iskandar, Tanah Sareal',
    curriculum: 'Kurikulum Nasional & Bilingual',
    headmaster: 'Drs. H. Mulyadi, M.Pd.',
  },
  {
    id: 11,
    name: 'SMAN 8 Jakarta',
    npsn: '20100107',
    level: 'SMA',
    status: 'Negeri',
    prov: 'DKI Jakarta',
    city: 'Kota Adm. Jakarta Selatan',
    siswa: 1060,
    guru: 74,
    rasio: 14.3,
    accred: 'A',
    address: 'Jl. Taman Bukit Duri No.2, Tebet',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Dra. Rita Hastuti, M.Pd.',
  },
  {
    id: 12,
    name: 'SMP Negeri 115 Jakarta',
    npsn: '20100115',
    level: 'SMP',
    status: 'Negeri',
    prov: 'DKI Jakarta',
    city: 'Kota Adm. Jakarta Selatan',
    siswa: 960,
    guru: 68,
    rasio: 14.1,
    accred: 'A',
    address: 'Jl. KH. Abdullah Syafei No.48, Tebet',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Drs. H. Sukimin, M.Pd.',
  },
  {
    id: 13,
    name: 'SD Negeri Menteng 01',
    npsn: '20100106',
    level: 'SD',
    status: 'Negeri',
    prov: 'DKI Jakarta',
    city: 'Kota Adm. Jakarta Pusat',
    siswa: 540,
    guru: 32,
    rasio: 16.9,
    accred: 'A',
    address: 'Jl. Besuki No.4, Menteng',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Drs. Sugiyanta, M.Pd.',
  },
  {
    id: 14,
    name: 'SMKN 26 Jakarta',
    npsn: '20100126',
    level: 'SMK',
    status: 'Negeri',
    prov: 'DKI Jakarta',
    city: 'Kota Adm. Jakarta Timur',
    siswa: 1450,
    guru: 98,
    rasio: 14.8,
    accred: 'A',
    address: 'Jl. Balai Pustaka Baru I, Rawamangun',
    curriculum: 'Kurikulum Merdeka - Rekayasa',
    headmaster: 'Purwosusilo, M.Pd.',
  },
  {
    id: 15,
    name: 'SMA Kanisius Jakarta',
    npsn: '20100108',
    level: 'SMA',
    status: 'Swasta',
    prov: 'DKI Jakarta',
    city: 'Kota Adm. Jakarta Pusat',
    siswa: 780,
    guru: 58,
    rasio: 13.4,
    accred: 'A',
    address: 'Jl. Menteng Raya No.64, Menteng',
    curriculum: 'Kurikulum Merdeka & Kolese',
    headmaster: 'P. Eduard C. Ratu Kdang, S.J.',
  },
  {
    id: 16,
    name: 'Universitas Indonesia',
    npsn: '20100201',
    level: 'Universitas',
    status: 'Negeri',
    prov: 'Jawa Barat',
    city: 'Kota Depok',
    siswa: 47200,
    guru: 2350,
    rasio: 20.1,
    accred: 'A',
    address: 'Kampus UI Pondok Cina, Beji',
    curriculum: 'Kampus Merdeka Terakreditasi Internasional',
    headmaster: 'Prof. Ari Kuncoro, Ph.D.',
  },
  {
    id: 17,
    name: 'Institut Teknologi Bandung',
    npsn: '20100202',
    level: 'Universitas',
    status: 'Negeri',
    prov: 'Jawa Barat',
    city: 'Kota Bandung',
    siswa: 26800,
    guru: 1420,
    rasio: 18.9,
    accred: 'A',
    address: 'Jl. Ganesha No.10, Coblong',
    curriculum: 'Kurikulum Terpadu Berbasis Riset & Inovasi',
    headmaster: 'Prof. Reini Wirahadikusumah, Ph.D.',
  },
  {
    id: 18,
    name: 'SMAN 5 Surabaya',
    npsn: '20100105',
    level: 'SMA',
    status: 'Negeri',
    prov: 'Jawa Timur',
    city: 'Kota Surabaya',
    siswa: 1080,
    guru: 70,
    rasio: 15.4,
    accred: 'A',
    address: 'Jl. Kusuma Bangsa No.21, Genteng',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Dra. Hj. Sukesi, M.Si.',
  },
  {
    id: 19,
    name: 'SMPN 1 Surabaya',
    npsn: '20100104',
    level: 'SMP',
    status: 'Negeri',
    prov: 'Jawa Timur',
    city: 'Kota Surabaya',
    siswa: 920,
    guru: 54,
    rasio: 17.0,
    accred: 'A',
    address: 'Jl. Pacar No.4, Ketabang, Genteng',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Drs. H. Akhmat Suharto, M.Pd.',
  },
  {
    id: 20,
    name: 'SDN Percobaan 1 Malang',
    npsn: '20100120',
    level: 'SD',
    status: 'Negeri',
    prov: 'Jawa Timur',
    city: 'Kota Malang',
    siswa: 480,
    guru: 34,
    rasio: 14.1,
    accred: 'A',
    address: 'Jl. Jakarta No.38, Penanggungan, Klojen',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Dra. Siti Rahayu, M.Pd.',
  },
  {
    id: 21,
    name: 'SMK Telkom Malang',
    npsn: '20100121',
    level: 'SMK',
    status: 'Swasta',
    prov: 'Jawa Timur',
    city: 'Kota Malang',
    siswa: 1200,
    guru: 82,
    rasio: 14.6,
    accred: 'A',
    address: 'Jl. Danau Ranau, Sawojajar, Kedungkandang',
    curriculum: 'Kurikulum Merdeka - Teknologi Informasi',
    headmaster: 'Rahmat Dwi Djatmiko, S.Kom., M.T.',
  },
  {
    id: 22,
    name: 'Universitas Brawijaya',
    npsn: '20100203',
    level: 'Universitas',
    status: 'Negeri',
    prov: 'Jawa Timur',
    city: 'Kota Malang',
    siswa: 42500,
    guru: 2100,
    rasio: 20.2,
    accred: 'A',
    address: 'Jl. Veteran, Ketawanggede, Lowokwaru',
    curriculum: 'Kampus Merdeka (OBE)',
    headmaster: 'Prof. Widodo, S.Si., M.Si., Ph.D.',
  },
  {
    id: 23,
    name: 'SMAN 3 Semarang',
    npsn: '20100109',
    level: 'SMA',
    status: 'Negeri',
    prov: 'Jawa Tengah',
    city: 'Kota Semarang',
    siswa: 1100,
    guru: 71,
    rasio: 15.5,
    accred: 'A',
    address: 'Jl. Pemuda No.149, Sekayu, Semarang Tengah',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Drs. Yuwana, M.Kom.',
  },
  {
    id: 24,
    name: 'SMPN 1 Surakarta',
    npsn: '20100124',
    level: 'SMP',
    status: 'Negeri',
    prov: 'Jawa Tengah',
    city: 'Kota Surakarta',
    siswa: 840,
    guru: 56,
    rasio: 15.0,
    accred: 'A',
    address: 'Jl. Monginsidi No.40, Banjarsari',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Hj. Sri Wuryanti, M.Pd.',
  },
  {
    id: 25,
    name: 'SMK Negeri 2 Surakarta',
    npsn: '20100125',
    level: 'SMK',
    status: 'Negeri',
    prov: 'Jawa Tengah',
    city: 'Kota Surakarta',
    siswa: 1320,
    guru: 88,
    rasio: 15.0,
    accred: 'B',
    address: 'Jl. LU. Adisucipto No.33, Manahan, Banjarsari',
    curriculum: 'Kurikulum Merdeka - Manufaktur',
    headmaster: 'Drs. Sugiyarso, M.Eng.',
  },
  {
    id: 26,
    name: 'SD Kristen Kalam Kudus Surakarta',
    npsn: '20100126',
    level: 'SD',
    status: 'Swasta',
    prov: 'Jawa Tengah',
    city: 'Kota Surakarta',
    siswa: 380,
    guru: 29,
    rasio: 13.1,
    accred: 'A',
    address: 'Jl. Suharso No.15, Jajar, Laweyan',
    curriculum: 'Kurikulum Karakter & Merdeka',
    headmaster: 'Drs. Hendro Wibowo, M.Pd.',
  },
  {
    id: 27,
    name: 'SMAN 1 Yogyakarta',
    npsn: '20100127',
    level: 'SMA',
    status: 'Negeri',
    prov: 'D.I. Yogyakarta',
    city: 'Kota Yogyakarta',
    siswa: 980,
    guru: 69,
    rasio: 14.2,
    accred: 'A',
    address: 'Jl. H.O.S. Cokroaminoto No.10, Pakuncen, Wirobrajan',
    curriculum: 'Kurikulum Merdeka Teladan',
    headmaster: 'Drs. M. Radji, M.Pd.',
  },
  {
    id: 28,
    name: 'Universitas Gadjah Mada',
    npsn: '20100204',
    level: 'Universitas',
    status: 'Negeri',
    prov: 'D.I. Yogyakarta',
    city: 'Kab. Sleman',
    siswa: 52400,
    guru: 2610,
    rasio: 20.1,
    accred: 'A',
    address: 'Bulaksumur, Caturtunggal, Depok',
    curriculum: 'Kampus Merdeka Terakreditasi Global',
    headmaster: 'Prof. dr. Ova Emilia, M.Med.Ed., Ph.D.',
  },
  {
    id: 29,
    name: 'SMPN 1 Medan',
    npsn: '20100110',
    level: 'SMP',
    status: 'Negeri',
    prov: 'Sumatera Utara',
    city: 'Kota Medan',
    siswa: 880,
    guru: 50,
    rasio: 17.6,
    accred: 'A',
    address: 'Jl. Bunga Asoka No.24, Asam Kumbang, Medan Selayang',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Drs. H. Marasutan Rambe',
  },
  {
    id: 30,
    name: 'SMA Sutomo 1 Medan',
    npsn: '20100130',
    level: 'SMA',
    status: 'Swasta',
    prov: 'Sumatera Utara',
    city: 'Kota Medan',
    siswa: 1350,
    guru: 92,
    rasio: 14.7,
    accred: 'A',
    address: 'Jl. Letkol Martinus No.7, Pusat Pasar, Medan Kota',
    curriculum: 'Kurikulum Merdeka Berbasis Sains',
    headmaster: 'Kurniadi, S.E., M.M.',
  },
  {
    id: 31,
    name: 'SMAN 1 Denpasar',
    npsn: '20100112',
    level: 'SMA',
    status: 'Negeri',
    prov: 'Bali',
    city: 'Kota Denpasar',
    siswa: 950,
    guru: 62,
    rasio: 15.3,
    accred: 'A',
    address: 'Jl. Kamboja No.4, Dangin Puri Kangin, Denpasar Utara',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'I Made Rida, M.Pd.',
  },
  {
    id: 32,
    name: 'SMAN 1 Makassar',
    npsn: '20100111',
    level: 'SMA',
    status: 'Negeri',
    prov: 'Sulawesi Selatan',
    city: 'Kota Makassar',
    siswa: 1020,
    guru: 65,
    rasio: 15.7,
    accred: 'A',
    address: 'Jl. Gunung Bawakaraeng No.53, Gaddong, Bontoala',
    curriculum: 'Kurikulum Merdeka',
    headmaster: 'Drs. H. Arifin, M.Pd.',
  },
  {
    id: 33,
    name: 'SD Cendikia Mandiri Bandung',
    npsn: '20234580',
    level: 'SD',
    status: 'Swasta',
    prov: 'Jawa Barat',
    city: 'Kota Bandung',
    siswa: 290,
    guru: 22,
    rasio: 13.2,
    accred: 'C',
    address: 'Jl. Cihampelas No.88, Cipaganti, Coblong',
    curriculum: 'Kurikulum Merdeka Dasar',
    headmaster: 'Dra. Endang Sulistyowati',
  },
  {
    id: 34,
    name: 'SMK Karya Bahari Bekasi',
    npsn: '20234581',
    level: 'SMK',
    status: 'Swasta',
    prov: 'Jawa Barat',
    city: 'Kota Bekasi',
    siswa: 410,
    guru: 30,
    rasio: 13.7,
    accred: 'C',
    address: 'Jl. Cut Mutia No.55, Margahayu, Bekasi Timur',
    curriculum: 'Kurikulum Vokasi Maritim',
    headmaster: 'Kapten H. Suparman, M.Mar.',
  },
];

interface OutletContextType {
  period?: string;
  setPeriod?: (p: string) => void;
}

type SortField =
  | 'id'
  | 'name'
  | 'npsn'
  | 'level'
  | 'status'
  | 'prov'
  | 'city'
  | 'siswa'
  | 'guru'
  | 'rasio'
  | 'accred';
type SortDirection = 'asc' | 'desc';

export const DataTablePage: React.FC = () => {
  const outlet = useOutletContext<OutletContextType | null>();
  const period = outlet?.period || '2026';
  const setPeriod = outlet?.setPeriod || (() => {});

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedProv, setSelectedProv] = useState('Semua Provinsi');
  const [selectedCity, setSelectedCity] = useState('Semua Kota/Kabupaten');
  const [selectedLevel, setSelectedLevel] = useState('Semua Jenjang');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [selectedAccred, setSelectedAccred] = useState('Semua');

  // Category Tab state (synchronized with selectedLevel)
  const categoryTabs = [
    { label: 'Semua Jenjang', key: 'Semua Jenjang' },
    { label: 'SD', key: 'SD' },
    { label: 'SMP', key: 'SMP' },
    { label: 'SMA', key: 'SMA' },
    { label: 'SMK', key: 'SMK' },
    { label: 'Universitas', key: 'Universitas' },
  ];

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection state
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

  // Column visibility state
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    npsn: true,
    level: true,
    status: true,
    prov: true,
    city: true,
    siswa: true,
    guru: true,
    rasio: true,
    accred: true,
    lokasi: true,
  });

  // Advanced Filter state & Drawer toggle
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [minSiswa, setMinSiswa] = useState<number>(0);
  const [onlyAccredA, setOnlyAccredA] = useState(false);

  // Institution Detail Modal
  const [detailModalItem, setDetailModalItem] = useState<InstitutionItem | null>(null);

  // Dynamic Provinces list
  const availableProvinces = useMemo(() => {
    const set = new Set(INSTITUTIONS_DATASET.map((i) => i.prov));
    return Array.from(set).sort();
  }, []);

  // Dynamic Cities list based on selected province
  const availableCities = useMemo(() => {
    const list =
      selectedProv === 'Semua Provinsi'
        ? INSTITUTIONS_DATASET
        : INSTITUTIONS_DATASET.filter((i) => i.prov === selectedProv);
    const set = new Set(list.map((i) => i.city));
    return Array.from(set).sort();
  }, [selectedProv]);

  // Handle province change with city reset
  const handleProvChange = (prov: string) => {
    setSelectedProv(prov);
    setSelectedCity('Semua Kota/Kabupaten');
    setCurrentPage(1);
  };

  // Handle Level / Category change
  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    setCurrentPage(1);
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return INSTITUTIONS_DATASET.filter((item) => {
      // Search matching (name, NPSN, city, province)
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchNpsn = item.npsn.toLowerCase().includes(q);
        const matchCity = item.city.toLowerCase().includes(q);
        const matchProv = item.prov.toLowerCase().includes(q);
        if (!matchName && !matchNpsn && !matchCity && !matchProv) return false;
      }

      // Province filter
      if (selectedProv !== 'Semua Provinsi' && item.prov !== selectedProv) {
        return false;
      }

      // City filter
      if (selectedCity !== 'Semua Kota/Kabupaten' && item.city !== selectedCity) {
        return false;
      }

      // Level / Category filter
      if (selectedLevel !== 'Semua Jenjang' && item.level !== selectedLevel) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'Semua Status' && item.status !== selectedStatus) {
        return false;
      }

      // Accreditation filter
      if (selectedAccred !== 'Semua' && item.accred !== selectedAccred) {
        return false;
      }

      // Advanced filters
      if (minSiswa > 0 && item.siswa < minSiswa) {
        return false;
      }
      if (onlyAccredA && item.accred !== 'A') {
        return false;
      }

      return true;
    });
  }, [
    search,
    selectedProv,
    selectedCity,
    selectedLevel,
    selectedStatus,
    selectedAccred,
    minSiswa,
    onlyAccredA,
  ]);

  // Sorted dataset
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  // Pagination calculation
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Sorting handlers
  const handleSortClick = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      // default numeric columns to desc for high-to-low, strings to asc
      if (['siswa', 'guru', 'rasio'].includes(field)) {
        setSortDirection('desc');
      } else {
        setSortDirection('asc');
      }
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <span className="text-[#94A3B8] ml-1">⇅</span>;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#00A896] inline ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#00A896] inline ml-1" />
    );
  };

  // Reset all filters
  const resetFilter = () => {
    setSearch('');
    setSelectedProv('Semua Provinsi');
    setSelectedCity('Semua Kota/Kabupaten');
    setSelectedLevel('Semua Jenjang');
    setSelectedStatus('Semua Status');
    setSelectedAccred('Semua');
    setMinSiswa(0);
    setOnlyAccredA(false);
    setCurrentPage(1);
    setSelectedRowIds([]);
  };

  // Dynamic filter tags list
  const activeTags = useMemo(() => {
    const list: { id: string; label: string; onRemove: () => void }[] = [];

    if (search.trim()) {
      list.push({
        id: 'search',
        label: `Cari: "${search}"`,
        onRemove: () => {
          setSearch('');
          setCurrentPage(1);
        },
      });
    }

    if (selectedProv !== 'Semua Provinsi') {
      list.push({
        id: 'prov',
        label: `Provinsi: ${selectedProv}`,
        onRemove: () => handleProvChange('Semua Provinsi'),
      });
    }

    if (selectedCity !== 'Semua Kota/Kabupaten') {
      list.push({
        id: 'city',
        label: `Kota: ${selectedCity}`,
        onRemove: () => {
          setSelectedCity('Semua Kota/Kabupaten');
          setCurrentPage(1);
        },
      });
    }

    if (selectedLevel !== 'Semua Jenjang') {
      list.push({
        id: 'level',
        label: `Jenjang: ${selectedLevel}`,
        onRemove: () => handleLevelChange('Semua Jenjang'),
      });
    }

    if (selectedStatus !== 'Semua Status') {
      list.push({
        id: 'status',
        label: `Status: ${selectedStatus}`,
        onRemove: () => {
          setSelectedStatus('Semua Status');
          setCurrentPage(1);
        },
      });
    }

    if (selectedAccred !== 'Semua') {
      list.push({
        id: 'accred',
        label: `Akreditasi: ${selectedAccred}`,
        onRemove: () => {
          setSelectedAccred('Semua');
          setCurrentPage(1);
        },
      });
    }

    if (minSiswa > 0) {
      list.push({
        id: 'minSiswa',
        label: `Min. Siswa: ${minSiswa.toLocaleString('id-ID')}`,
        onRemove: () => setMinSiswa(0),
      });
    }

    if (onlyAccredA) {
      list.push({
        id: 'onlyAccredA',
        label: 'Hanya Akreditasi A',
        onRemove: () => setOnlyAccredA(false),
      });
    }

    return list;
  }, [
    search,
    selectedProv,
    selectedCity,
    selectedLevel,
    selectedStatus,
    selectedAccred,
    minSiswa,
    onlyAccredA,
  ]);

  // Row selection handlers
  const isAllCurrentSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedRowIds.includes(row.id));

  const toggleSelectAll = () => {
    if (isAllCurrentSelected) {
      const currentIds = paginatedData.map((r) => r.id);
      setSelectedRowIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      const currentIds = paginatedData.map((r) => r.id);
      setSelectedRowIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const toggleSelectRow = (id: number) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'SD':
        return 'bg-[#DBEAFE] text-[#1D4ED8]';
      case 'SMP':
        return 'bg-[#CCFBF1] text-[#0D9488]';
      case 'SMA':
        return 'bg-[#FEF3C7] text-[#D97706]';
      case 'SMK':
        return 'bg-[#F3E8FF] text-[#9333EA]';
      case 'Universitas':
        return 'bg-[#FFE4E6] text-[#E11D48]';
      default:
        return 'bg-slate-100 text-[#475569]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Universal Page Header */}
      <PageHeader
        title="Data Table (Data Explorer)"
        subtitle="Jelajahi data institusi pendidikan dengan pencarian, filter, dan tampilan tabel yang interaktif."
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Top 5 KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Sekolah */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs">
          <p className="text-xs font-semibold text-[#64748B]">Total Sekolah</p>
          <h3 className="text-2xl font-extrabold text-[#0F2942] tracking-tight mt-0.5 font-heading">
            125.482
          </h3>
          <p className="text-[11px] text-[#059669] font-bold mt-1">
            ↑ 2,8% <span className="font-normal text-[#64748B]">dari 2025</span>
          </p>
        </div>

        {/* Total Siswa */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs">
          <p className="text-xs font-semibold text-[#64748B]">Total Siswa</p>
          <h3 className="text-2xl font-extrabold text-[#0F2942] tracking-tight mt-0.5 font-heading">
            42.560.321
          </h3>
          <p className="text-[11px] text-[#059669] font-bold mt-1">
            ↑ 3,1% <span className="font-normal text-[#64748B]">dari 2025</span>
          </p>
        </div>

        {/* Total Guru */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs">
          <p className="text-xs font-semibold text-[#64748B]">Total Guru</p>
          <h3 className="text-2xl font-extrabold text-[#0F2942] tracking-tight mt-0.5 font-heading">
            2.843.921
          </h3>
          <p className="text-[11px] text-[#059669] font-bold mt-1">
            ↑ 1,9% <span className="font-normal text-[#64748B]">dari 2025</span>
          </p>
        </div>

        {/* Total Universitas */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs">
          <p className="text-xs font-semibold text-[#64748B]">Total Universitas</p>
          <h3 className="text-2xl font-extrabold text-[#0F2942] tracking-tight mt-0.5 font-heading">
            3.216
          </h3>
          <p className="text-[11px] text-[#059669] font-bold mt-1">
            ↑ 4,5% <span className="font-normal text-[#64748B]">dari 2025</span>
          </p>
        </div>

        {/* Distribusi Jenjang Mini Card */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-bold text-[#0F2942]">Distribusi Jenjang</p>
          <div className="flex h-3 rounded-full overflow-hidden my-2">
            <div style={{ width: '45.2%' }} className="bg-[#1D4ED8]" title="SD: 45.2%" />
            <div style={{ width: '28.1%' }} className="bg-[#00A896]" title="SMP: 28.1%" />
            <div style={{ width: '20.4%' }} className="bg-[#F59E0B]" title="SMA: 20.4%" />
            <div style={{ width: '6.3%' }} className="bg-[#9333EA]" title="SMK: 6.3%" />
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#64748B] font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]" /> 45,2%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]" /> 28,1%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> 20,4%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA]" /> 6,3%
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills (Functional Jenjang Tabs) */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        {categoryTabs.map((cat) => {
          const count =
            cat.key === 'Semua Jenjang'
              ? INSTITUTIONS_DATASET.length
              : INSTITUTIONS_DATASET.filter((i) => i.level === cat.key).length;
          const isActive = selectedLevel === cat.key;

          return (
            <button
              key={cat.key}
              type="button"
              data-testid={`cat-tab-${cat.key}`}
              onClick={() => handleLevelChange(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#0F2942] text-white shadow-2xs font-bold'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F2942]'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 flex-1 min-w-[260px] text-xs">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] mr-2 shrink-0" />
            <input
              type="text"
              data-testid="search-input"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama sekolah, NPSN, kota, atau provinsi..."
              className="bg-transparent border-none outline-none text-[#0F2942] w-full placeholder:text-[#94A3B8]"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCurrentPage(1);
                }}
                className="text-[#94A3B8] hover:text-[#0F2942] ml-1.5"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* Provinsi */}
          <div className="text-xs">
            <select
              data-testid="filter-prov"
              value={selectedProv}
              onChange={(e) => handleProvChange(e.target.value)}
              className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 font-medium text-[#475569] cursor-pointer outline-none hover:border-[#00A896]"
            >
              <option value="Semua Provinsi">Semua Provinsi</option>
              {availableProvinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          {/* Kota/Kabupaten */}
          <div className="text-xs">
            <select
              data-testid="filter-city"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 font-medium text-[#475569] cursor-pointer outline-none hover:border-[#00A896]"
            >
              <option value="Semua Kota/Kabupaten">Semua Kota/Kabupaten</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Jenjang */}
          <div className="text-xs">
            <select
              data-testid="filter-level"
              value={selectedLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 font-medium text-[#475569] cursor-pointer outline-none hover:border-[#00A896]"
            >
              <option value="Semua Jenjang">Semua Jenjang</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="SMK">SMK</option>
              <option value="Universitas">Universitas</option>
            </select>
          </div>

          {/* Status */}
          <div className="text-xs">
            <select
              data-testid="filter-status"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 font-medium text-[#475569] cursor-pointer outline-none hover:border-[#00A896]"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Negeri">Negeri</option>
              <option value="Swasta">Swasta</option>
            </select>
          </div>

          {/* Akreditasi */}
          <div className="text-xs">
            <select
              data-testid="filter-accred"
              value={selectedAccred}
              onChange={(e) => {
                setSelectedAccred(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 font-medium text-[#475569] cursor-pointer outline-none hover:border-[#00A896]"
            >
              <option value="Semua">Semua Akreditasi</option>
              <option value="A">Akreditasi A</option>
              <option value="B">Akreditasi B</option>
              <option value="C">Akreditasi C</option>
            </select>
          </div>

          {/* Filter Lanjutan Button */}
          <button
            type="button"
            data-testid="btn-advanced-filter"
            onClick={() => setShowAdvancedFilter((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              showAdvancedFilter || minSiswa > 0 || onlyAccredA
                ? 'bg-[#00A896] text-white'
                : 'bg-white border border-[#E2E8F0] text-[#0F2942] hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter Lanjutan
          </button>
        </div>

        {/* Filter Lanjutan Collapsible Drawer */}
        {showAdvancedFilter && (
          <div
            data-testid="advanced-filter-panel"
            className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-3"
          >
            <div className="flex flex-wrap items-center gap-6">
              {/* Minimal Siswa */}
              <div className="flex items-center gap-2">
                <label className="font-semibold text-[#0F2942]">Minimal Siswa:</label>
                <input
                  type="number"
                  data-testid="input-min-siswa"
                  value={minSiswa || ''}
                  onChange={(e) => {
                    setMinSiswa(Number(e.target.value) || 0);
                    setCurrentPage(1);
                  }}
                  placeholder="Contoh: 1000"
                  className="bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 w-32 outline-none text-[#0F2942]"
                />
              </div>

              {/* Hanya Akreditasi A */}
              <label className="flex items-center gap-2 font-semibold text-[#0F2942] cursor-pointer">
                <input
                  type="checkbox"
                  data-testid="check-only-accred-a"
                  checked={onlyAccredA}
                  onChange={(e) => {
                    setOnlyAccredA(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded text-[#00A896] focus:ring-[#00A896]"
                />
                Hanya Akreditasi A
              </label>

              {/* Reset filter lanjutan */}
              {(minSiswa > 0 || onlyAccredA) && (
                <button
                  type="button"
                  onClick={() => {
                    setMinSiswa(0);
                    setOnlyAccredA(false);
                    setCurrentPage(1);
                  }}
                  className="text-xs text-[#00A896] hover:underline font-bold"
                >
                  Bersihkan Filter Lanjutan
                </button>
              )}
            </div>
          </div>
        )}

        {/* Active Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F1F5F9] text-xs">
          <span className="text-[#64748B] font-medium text-[11px]">Filter Aktif:</span>
          {activeTags.length === 0 ? (
            <span className="text-[#94A3B8] italic text-[11px]">
              Tidak ada filter aktif (menampilkan seluruh data)
            </span>
          ) : (
            activeTags.map((tag) => (
              <span
                key={tag.id}
                data-testid={`tag-${tag.id}`}
                className="inline-flex items-center gap-1.5 bg-[#F1F5F9] text-[#0F2942] px-2.5 py-1 rounded-lg font-medium text-xs border border-[#E2E8F0]"
              >
                {tag.label}
                <button
                  type="button"
                  data-testid={`remove-tag-${tag.id}`}
                  onClick={tag.onRemove}
                  className="text-[#94A3B8] hover:text-[#DC2626] cursor-pointer"
                  title="Hapus filter"
                >
                  ✕
                </button>
              </span>
            ))
          )}

          {activeTags.length > 0 && (
            <button
              type="button"
              data-testid="btn-reset-filters"
              onClick={resetFilter}
              className="flex items-center gap-1 text-[#00A896] font-bold text-xs hover:underline ml-2 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Row Selection Banner */}
      {selectedRowIds.length > 0 && (
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-[#1E40AF]">
          <span className="font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-[#2563EB]" />
            {selectedRowIds.length} institusi pendidikan dipilih
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedRowIds([])}
              className="text-[#1D4ED8] hover:underline font-bold cursor-pointer"
            >
              Batalkan Pilihan
            </button>
          </div>
        </div>
      )}

      {/* Table Container Card */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl overflow-hidden shadow-2xs">
        {/* Table Top Controls */}
        <div className="p-4 border-b border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative">
          <div>
            <h3 className="text-base font-bold text-[#0F2942] font-heading">
              Daftar Institusi Pendidikan
            </h3>
            <p data-testid="table-info-top" className="text-xs text-[#64748B]">
              {totalItems === 0
                ? 'Menampilkan 0 data'
                : `Menampilkan ${startIndex + 1}–${endIndex} dari ${totalItems} data`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Kolom Toggle */}
            <div className="relative">
              <button
                type="button"
                data-testid="btn-columns-menu"
                onClick={() => setShowColumnsMenu((prev) => !prev)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl font-semibold text-[#0F2942] hover:bg-slate-50 cursor-pointer"
              >
                <Columns className="w-3.5 h-3.5 text-[#64748B]" />
                Kolom ⌄
              </button>

              {showColumnsMenu && (
                <div
                  data-testid="columns-dropdown"
                  className="absolute right-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-2.5 z-30 space-y-1.5 text-xs text-[#0F2942]"
                >
                  <p className="font-bold text-[11px] text-[#64748B] px-1 border-b border-[#F1F5F9] pb-1">
                    Atur Kolom Tabel
                  </p>
                  {[
                    { key: 'npsn', label: 'NPSN' },
                    { key: 'level', label: 'Jenjang' },
                    { key: 'status', label: 'Status' },
                    { key: 'prov', label: 'Provinsi' },
                    { key: 'city', label: 'Kota/Kabupaten' },
                    { key: 'siswa', label: 'Jumlah Siswa' },
                    { key: 'guru', label: 'Jumlah Guru' },
                    { key: 'rasio', label: 'Rasio' },
                    { key: 'accred', label: 'Akreditasi' },
                    { key: 'lokasi', label: 'Lokasi & Detail' },
                  ].map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 px-1 py-0.5 hover:bg-slate-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns[col.key as keyof typeof visibleColumns]}
                        onChange={(e) =>
                          setVisibleColumns((prev) => ({
                            ...prev,
                            [col.key]: e.target.checked,
                          }))
                        }
                        className="rounded text-[#00A896]"
                      />
                      <span>{col.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Urutkan Button & Menu */}
            <div className="relative">
              <button
                type="button"
                data-testid="btn-sort-menu"
                onClick={() => setShowSortMenu((prev) => !prev)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold cursor-pointer ${
                  showSortMenu
                    ? 'bg-[#00A896] text-white'
                    : 'bg-white border border-[#E2E8F0] text-[#0F2942] hover:bg-slate-50'
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                Urutkan ⌄
              </button>

              {showSortMenu && (
                <div
                  data-testid="sort-dropdown"
                  className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1.5 z-30 text-xs space-y-0.5"
                >
                  <p className="font-bold text-[11px] text-[#64748B] px-2 py-1 border-b border-[#F1F5F9]">
                    Pilih Pengurutan
                  </p>
                  {[
                    { label: 'Nama Sekolah (A–Z)', field: 'name' as SortField, dir: 'asc' as SortDirection },
                    { label: 'Nama Sekolah (Z–A)', field: 'name' as SortField, dir: 'desc' as SortDirection },
                    { label: 'Siswa Terbanyak', field: 'siswa' as SortField, dir: 'desc' as SortDirection },
                    { label: 'Siswa Tersedikit', field: 'siswa' as SortField, dir: 'asc' as SortDirection },
                    { label: 'Guru Terbanyak', field: 'guru' as SortField, dir: 'desc' as SortDirection },
                    { label: 'Rasio Siswa/Guru Tertinggi', field: 'rasio' as SortField, dir: 'desc' as SortDirection },
                    { label: 'Akreditasi Terbaik (A–C)', field: 'accred' as SortField, dir: 'asc' as SortDirection },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        setSortField(opt.field);
                        setSortDirection(opt.dir);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-slate-50 ${
                        sortField === opt.field && sortDirection === opt.dir
                          ? 'font-bold text-[#00A896] bg-teal-50/50'
                          : 'text-[#0F2942]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortField === opt.field && sortDirection === opt.dir && (
                        <Check className="w-3.5 h-3.5 text-[#00A896]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Per Page Select */}
            <select
              data-testid="select-page-size"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 font-semibold text-[#0F2942] outline-none cursor-pointer hover:border-[#00A896]"
            >
              <option value={10}>10 per halaman</option>
              <option value={25}>25 per halaman</option>
              <option value={50}>50 per halaman</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    data-testid="select-all-checkbox"
                    checked={isAllCurrentSelected}
                    onChange={toggleSelectAll}
                    className="rounded-xs text-[#00A896] focus:ring-[#00A896] cursor-pointer"
                  />
                </th>
                <th
                  onClick={() => handleSortClick('id')}
                  className="py-3 px-3 cursor-pointer select-none hover:text-[#0F2942]"
                >
                  # {getSortIcon('id')}
                </th>
                <th
                  onClick={() => handleSortClick('name')}
                  data-testid="th-name"
                  className="py-3 px-3 cursor-pointer select-none hover:text-[#0F2942]"
                >
                  Nama Institusi {getSortIcon('name')}
                </th>
                {visibleColumns.npsn && (
                  <th
                    onClick={() => handleSortClick('npsn')}
                    className="py-3 px-3 cursor-pointer select-none hover:text-[#0F2942]"
                  >
                    NPSN {getSortIcon('npsn')}
                  </th>
                )}
                {visibleColumns.level && (
                  <th
                    onClick={() => handleSortClick('level')}
                    className="py-3 px-3 cursor-pointer select-none hover:text-[#0F2942]"
                  >
                    Jenjang {getSortIcon('level')}
                  </th>
                )}
                {visibleColumns.status && (
                  <th
                    onClick={() => handleSortClick('status')}
                    className="py-3 px-3 cursor-pointer select-none hover:text-[#0F2942]"
                  >
                    Status {getSortIcon('status')}
                  </th>
                )}
                {visibleColumns.prov && (
                  <th
                    onClick={() => handleSortClick('prov')}
                    className="py-3 px-3 cursor-pointer select-none hover:text-[#0F2942]"
                  >
                    Provinsi {getSortIcon('prov')}
                  </th>
                )}
                {visibleColumns.city && (
                  <th
                    onClick={() => handleSortClick('city')}
                    className="py-3 px-3 cursor-pointer select-none hover:text-[#0F2942]"
                  >
                    Kota/Kabupaten {getSortIcon('city')}
                  </th>
                )}
                {visibleColumns.siswa && (
                  <th
                    onClick={() => handleSortClick('siswa')}
                    data-testid="th-siswa"
                    className="py-3 px-3 text-right cursor-pointer select-none hover:text-[#0F2942]"
                  >
                    Jumlah Siswa {getSortIcon('siswa')}
                  </th>
                )}
                {visibleColumns.guru && (
                  <th
                    onClick={() => handleSortClick('guru')}
                    className="py-3 px-3 text-right cursor-pointer select-none hover:text-[#0F2942]"
                  >
                    Jumlah Guru {getSortIcon('guru')}
                  </th>
                )}
                {visibleColumns.rasio && (
                  <th
                    onClick={() => handleSortClick('rasio')}
                    className="py-3 px-3 text-right cursor-pointer select-none hover:text-[#0F2942]"
                  >
                    Rasio {getSortIcon('rasio')}
                  </th>
                )}
                {visibleColumns.accred && (
                  <th
                    onClick={() => handleSortClick('accred')}
                    className="py-3 px-3 text-center cursor-pointer select-none hover:text-[#0F2942]"
                  >
                    Akreditasi {getSortIcon('accred')}
                  </th>
                )}
                {visibleColumns.lokasi && (
                  <th className="py-3 px-3 text-center">Lokasi</th>
                )}
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#0F2942]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-[#64748B]">
                    <Building2 className="w-8 h-8 text-[#94A3B8] mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-sm text-[#0F2942]">
                      Tidak ada institusi pendidikan yang cocok
                    </p>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      Coba sesuaikan kata kunci pencarian atau ubah kombinasi filter Anda.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilter}
                      className="mt-3 px-3 py-1.5 bg-[#00A896] text-white font-semibold text-xs rounded-xl hover:bg-[#009282] transition-colors"
                    >
                      Reset Semua Filter
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr
                    key={row.id}
                    data-testid={`row-${row.id}`}
                    className={`hover:bg-[#F8FAFC] transition-colors ${
                      selectedRowIds.includes(row.id) ? 'bg-teal-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(row.id)}
                        onChange={() => toggleSelectRow(row.id)}
                        className="rounded-xs text-[#00A896] focus:ring-[#00A896] cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3 text-[#64748B] font-medium">
                      {startIndex + idx + 1}
                    </td>
                    <td
                      onClick={() => setDetailModalItem(row)}
                      className="py-3 px-3 font-bold text-[#0F2942] hover:text-[#00A896] cursor-pointer"
                    >
                      {row.name}
                    </td>
                    {visibleColumns.npsn && (
                      <td className="py-3 px-3 font-mono text-[#64748B]">{row.npsn}</td>
                    )}
                    {visibleColumns.level && (
                      <td className="py-3 px-3">
                        <span
                          className={`font-bold text-[10px] px-2 py-0.5 rounded ${getLevelBadge(
                            row.level,
                          )}`}
                        >
                          {row.level}
                        </span>
                      </td>
                    )}
                    {visibleColumns.status && (
                      <td className="py-3 px-3">
                        <span
                          className={`font-semibold text-[10px] px-2 py-0.5 rounded ${
                            row.status === 'Negeri'
                              ? 'bg-[#ECFDF5] text-[#059669]'
                              : 'bg-[#FEF2F2] text-[#DC2626]'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    )}
                    {visibleColumns.prov && (
                      <td className="py-3 px-3 text-[#475569]">{row.prov}</td>
                    )}
                    {visibleColumns.city && (
                      <td className="py-3 px-3 text-[#475569]">{row.city}</td>
                    )}
                    {visibleColumns.siswa && (
                      <td className="py-3 px-3 text-right font-medium">
                        {row.siswa.toLocaleString('id-ID')}
                      </td>
                    )}
                    {visibleColumns.guru && (
                      <td className="py-3 px-3 text-right font-medium">
                        {row.guru.toLocaleString('id-ID')}
                      </td>
                    )}
                    {visibleColumns.rasio && (
                      <td className="py-3 px-3 text-right font-bold text-[#00A896]">
                        {row.rasio.toFixed(1).replace('.', ',')}
                      </td>
                    )}
                    {visibleColumns.accred && (
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-bold text-[11px] px-2 py-0.5 rounded border ${
                            row.accred === 'A'
                              ? 'bg-emerald-50 text-[#059669] border-emerald-200'
                              : row.accred === 'B'
                              ? 'bg-amber-50 text-[#D97706] border-amber-200'
                              : 'bg-rose-50 text-[#E11D48] border-rose-200'
                          }`}
                        >
                          {row.accred}
                        </span>
                      </td>
                    )}
                    {visibleColumns.lokasi && (
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          data-testid={`btn-location-${row.id}`}
                          onClick={() => setDetailModalItem(row)}
                          className="text-[#0284C7] hover:text-[#00A896] cursor-pointer p-1"
                          title="Lihat Alamat & Lokasi"
                        >
                          <MapPin className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    )}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        data-testid={`btn-more-${row.id}`}
                        onClick={() => setDetailModalItem(row)}
                        className="text-[#94A3B8] hover:text-[#0F2942] cursor-pointer p-1"
                        title="Lihat Detail Institusi"
                      >
                        <MoreVertical className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <p data-testid="table-info-bottom">
            {totalItems === 0
              ? 'Menampilkan 0 data'
              : `Menampilkan ${startIndex + 1}–${endIndex} dari ${totalItems} data`}
          </p>

          <div className="flex items-center gap-1 font-semibold">
            {/* Prev Button */}
            <button
              type="button"
              data-testid="btn-prev-page"
              disabled={validCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                validCurrentPage <= 1
                  ? 'border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed bg-slate-50'
                  : 'border-[#E2E8F0] text-[#0F2942] hover:bg-slate-50 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                data-testid={`btn-page-${page}`}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold transition-all cursor-pointer ${
                  validCurrentPage === page
                    ? 'bg-[#00A896] text-white shadow-xs'
                    : 'border border-[#E2E8F0] text-[#0F2942] hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              type="button"
              data-testid="btn-next-page"
              disabled={validCurrentPage >= totalPages || totalItems === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                validCurrentPage >= totalPages || totalItems === 0
                  ? 'border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed bg-slate-50'
                  : 'border-[#E2E8F0] text-[#0F2942] hover:bg-slate-50 cursor-pointer'
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Institution Detail Modal */}
      {detailModalItem && (
        <div
          data-testid="institution-detail-modal"
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4"
          onClick={() => setDetailModalItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 border border-[#E5EAF2]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#F1F5F9] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded ${getLevelBadge(
                      detailModalItem.level,
                    )}`}
                  >
                    {detailModalItem.level}
                  </span>
                  <span
                    className={`font-semibold text-[10px] px-2 py-0.5 rounded ${
                      detailModalItem.status === 'Negeri'
                        ? 'bg-[#ECFDF5] text-[#059669]'
                        : 'bg-[#FEF2F2] text-[#DC2626]'
                    }`}
                  >
                    {detailModalItem.status}
                  </span>
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded border ${
                      detailModalItem.accred === 'A'
                        ? 'bg-emerald-50 text-[#059669] border-emerald-200'
                        : 'bg-amber-50 text-[#D97706] border-amber-200'
                    }`}
                  >
                    Akreditasi {detailModalItem.accred}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0F2942] font-heading">
                  {detailModalItem.name}
                </h3>
                <p className="text-xs text-[#64748B]">NPSN: {detailModalItem.npsn}</p>
              </div>
              <button
                type="button"
                data-testid="btn-close-modal"
                onClick={() => setDetailModalItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#64748B] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Info */}
            <div className="space-y-4 text-xs">
              {/* Lokasi */}
              <div className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <MapPin className="w-4 h-4 text-[#00A896] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#0F2942]">Alamat Lengkap</p>
                  <p className="text-[#64748B] mt-0.5">{detailModalItem.address}</p>
                  <p className="text-[#64748B] font-medium mt-0.5">
                    {detailModalItem.city}, {detailModalItem.prov}
                  </p>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <p className="text-[#64748B] text-[11px] font-semibold">Total Siswa</p>
                  <p className="text-base font-extrabold text-[#0F2942] mt-0.5 font-heading">
                    {detailModalItem.siswa.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <p className="text-[#64748B] text-[11px] font-semibold">Total Guru</p>
                  <p className="text-base font-extrabold text-[#0F2942] mt-0.5 font-heading">
                    {detailModalItem.guru.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <p className="text-[#64748B] text-[11px] font-semibold">Rasio Siswa/Guru</p>
                  <p className="text-base font-extrabold text-[#00A896] mt-0.5 font-heading">
                    1 : {detailModalItem.rasio.toFixed(1).replace('.', ',')}
                  </p>
                </div>
              </div>

              {/* Kurikulum & Pimpinan */}
              <div className="space-y-2 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#64748B]" />
                    Kurikulum:
                  </span>
                  <span className="font-bold text-[#0F2942]">
                    {detailModalItem.curriculum || 'Kurikulum Merdeka'}
                  </span>
                </div>
                {detailModalItem.headmaster && (
                  <div className="flex items-center justify-between pt-1.5 border-t border-[#E2E8F0]">
                    <span className="text-[#64748B] flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#64748B]" />
                      Kepala Sekolah / Rektor:
                    </span>
                    <span className="font-bold text-[#0F2942]">
                      {detailModalItem.headmaster}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F2942] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
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

export default DataTablePage;
