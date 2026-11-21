import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import {
  Search,
  ChevronDown,
  ChevronRight,
  School,
  SlidersHorizontal,
  Settings,
  Download,
  Bookmark,
  RotateCcw,
  Maximize2,
  X,
  GripVertical,
  MoreHorizontal,
  ArrowUpDown,
  Filter,
  Check,
  ArrowUp,
  ArrowDown,
  ChevronsDownUp,
  ChevronsUpDown,
  Building,
  GraduationCap,
  Users,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export interface SchoolLeaf {
  id: string;
  name: string;
  level: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'Universitas';
  status: 'Negeri' | 'Swasta';
  schoolCount: number;
  studentCount: number;
  teacherCount: number;
  ratio: number;
  accreditation: string;
  address?: string;
  headmaster?: string;
}

export interface DistrictNode {
  id: string;
  name: string;
  level: string;
  schoolCount: number;
  studentCount: number;
  teacherCount: number;
  ratio: number;
  accreditation: string;
  schools?: SchoolLeaf[];
}

export interface ProvinceNode {
  id: string;
  name: string;
  level: string;
  schoolCount: number;
  studentCount: number;
  teacherCount: number;
  ratio: number;
  accreditation: string;
  districts?: DistrictNode[];
}

interface OutletContextType {
  period?: string;
  setPeriod?: (p: string) => void;
}

// 8 Indonesian Provinces with rich multi-level hierarchical data
export const ADVANCED_TREE_DATASET: ProvinceNode[] = [
  {
    id: 'jawa-barat',
    name: 'Jawa Barat',
    level: 'Semua Jenjang',
    schoolCount: 18254,
    studentCount: 8421235,
    teacherCount: 345812,
    ratio: 24.4,
    accreditation: 'A:38% B:46% C:16%',
    districts: [
      {
        id: 'kota-bandung',
        name: 'Kota Bandung',
        level: 'Semua Jenjang',
        schoolCount: 1245,
        studentCount: 512341,
        teacherCount: 21487,
        ratio: 23.8,
        accreditation: 'A:42% B:44% C:14%',
        schools: [
          {
            id: 'sma-1-bdg',
            name: 'SMA Negeri 1 Bandung',
            level: 'SMA',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 1245,
            teacherCount: 87,
            ratio: 14.3,
            accreditation: 'A',
            address: 'Jl. Ir. H. Juanda No.93, Coblong',
            headmaster: 'Drs. H. Hendrayana, M.M.Pd.',
          },
          {
            id: 'smp-3-bdg',
            name: 'SMP Negeri 3 Bandung',
            level: 'SMP',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 892,
            teacherCount: 64,
            ratio: 13.9,
            accreditation: 'A',
            address: 'Jl. R.E. Martadinata No.42, Citarum',
            headmaster: 'Dra. Hj. Sri Wahyuni, M.Pd.',
          },
          {
            id: 'sd-sukajadi-1',
            name: 'SD Negeri Sukajadi 1',
            level: 'SD',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 356,
            teacherCount: 28,
            ratio: 12.7,
            accreditation: 'A',
            address: 'Jl. Sukajadi No.112, Sukajadi',
            headmaster: 'Drs. Aep Saepudin',
          },
          {
            id: 'smk-tek-bdg',
            name: 'SMK Teknologi Bandung',
            level: 'SMK',
            status: 'Swasta',
            schoolCount: 1,
            studentCount: 680,
            teacherCount: 52,
            ratio: 13.1,
            accreditation: 'B',
            address: 'Jl. Soekarno Hatta No.478, Batununggal',
            headmaster: 'Ir. Budi Santoso, M.T.',
          },
        ],
      },
      {
        id: 'kota-bekasi',
        name: 'Kota Bekasi',
        level: 'Semua Jenjang',
        schoolCount: 892,
        studentCount: 421982,
        teacherCount: 16955,
        ratio: 24.9,
        accreditation: 'A:40% B:45% C:15%',
        schools: [
          {
            id: 'sma-3-bekasi',
            name: 'SMA Negeri 3 Bekasi',
            level: 'SMA',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 1245,
            teacherCount: 87,
            ratio: 14.3,
            accreditation: 'A',
            address: 'Jl. K.H. Agus Salim No.12, Bekasi Timur',
            headmaster: 'Drs. H. Mulyadi, M.Pd.',
          },
          {
            id: 'smp-10-bekasi',
            name: 'SMP Negeri 10 Bekasi',
            level: 'SMP',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 982,
            teacherCount: 62,
            ratio: 15.8,
            accreditation: 'A',
            address: 'Jl. Raya Pekayon No.10, Bekasi Selatan',
            headmaster: 'Dra. Endang Sulistyowati',
          },
          {
            id: 'sd-jatiasih-1',
            name: 'SD Negeri Jatiasih 1',
            level: 'SD',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 620,
            teacherCount: 45,
            ratio: 13.8,
            accreditation: 'B',
            address: 'Jl. Raya Jatiasih No.22, Jatiasih',
            headmaster: 'Drs. Suparman',
          },
          {
            id: 'smk-1-bekasi',
            name: 'SMK Negeri 1 Bekasi',
            level: 'SMK',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 815,
            teacherCount: 58,
            ratio: 14.1,
            accreditation: 'A',
            address: 'Jl. Bintara VIII No.2, Bekasi Barat',
            headmaster: 'Ir. H. Sugiyanto, M.M.',
          },
        ],
      },
      {
        id: 'kab-bogor',
        name: 'Kab. Bogor',
        level: 'Semua Jenjang',
        schoolCount: 1102,
        studentCount: 498231,
        teacherCount: 19642,
        ratio: 25.4,
        accreditation: 'A:36% B:48% C:16%',
        schools: [
          {
            id: 'sd-cibinong-1',
            name: 'SD Negeri Cibinong 01',
            level: 'SD',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 412,
            teacherCount: 32,
            ratio: 12.9,
            accreditation: 'A',
            address: 'Jl. Mayor Oking No.8, Cibinong',
            headmaster: 'Hj. Neneng Surtini, S.Pd.',
          },
          {
            id: 'smp-al-falah',
            name: 'SMP Islam Al-Falah',
            level: 'SMP',
            status: 'Swasta',
            schoolCount: 1,
            studentCount: 742,
            teacherCount: 52,
            ratio: 14.3,
            accreditation: 'B',
            address: 'Jl. Raya Cibinong No.45, Cibinong',
            headmaster: 'H. Ahmad Fauzi, S.Pd.I.',
          },
        ],
      },
      {
        id: 'kota-depok',
        name: 'Kota Depok',
        level: 'Semua Jenjang',
        schoolCount: 756,
        studentCount: 362114,
        teacherCount: 14892,
        ratio: 24.3,
        accreditation: 'A:44% B:44% C:12%',
        schools: [
          {
            id: 'smk-1-depok',
            name: 'SMK Negeri 1 Depok',
            level: 'SMK',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 980,
            teacherCount: 68,
            ratio: 14.4,
            accreditation: 'A',
            address: 'Jl. Bhakti Suci No.100, Tapos',
            headmaster: 'Drs. Tatang Komarudin, M.M.',
          },
        ],
      },
    ],
  },
  {
    id: 'dki-jakarta',
    name: 'DKI Jakarta',
    level: 'Semua Jenjang',
    schoolCount: 8412,
    studentCount: 4125662,
    teacherCount: 162884,
    ratio: 25.3,
    accreditation: 'A:41% B:46% C:13%',
    districts: [
      {
        id: 'jakarta-pusat',
        name: 'Kota Adm. Jakarta Pusat',
        level: 'Semua Jenjang',
        schoolCount: 1420,
        studentCount: 785400,
        teacherCount: 31200,
        ratio: 25.2,
        accreditation: 'A:48% B:42% C:10%',
        schools: [
          {
            id: 'sd-menteng-01',
            name: 'SD Negeri Menteng 01',
            level: 'SD',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 540,
            teacherCount: 32,
            ratio: 16.9,
            accreditation: 'A',
            address: 'Jl. Besuki No.4, Menteng',
            headmaster: 'Drs. Sugiyanta, M.Pd.',
          },
          {
            id: 'sma-kanisius',
            name: 'SMA Kanisius Jakarta',
            level: 'SMA',
            status: 'Swasta',
            schoolCount: 1,
            studentCount: 780,
            teacherCount: 58,
            ratio: 13.4,
            accreditation: 'A',
            address: 'Jl. Menteng Raya No.64, Menteng',
            headmaster: 'P. Eduard C. Ratu Kdang, S.J.',
          },
        ],
      },
      {
        id: 'jakarta-selatan',
        name: 'Kota Adm. Jakarta Selatan',
        level: 'Semua Jenjang',
        schoolCount: 1980,
        studentCount: 964200,
        teacherCount: 38400,
        ratio: 25.1,
        accreditation: 'A:46% B:43% C:11%',
        schools: [
          {
            id: 'sma-8-jkt',
            name: 'SMAN 8 Jakarta',
            level: 'SMA',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 1060,
            teacherCount: 74,
            ratio: 14.3,
            accreditation: 'A',
            address: 'Jl. Taman Bukit Duri No.2, Tebet',
            headmaster: 'Dra. Rita Hastuti, M.Pd.',
          },
          {
            id: 'smp-115-jkt',
            name: 'SMP Negeri 115 Jakarta',
            level: 'SMP',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 960,
            teacherCount: 68,
            ratio: 14.1,
            accreditation: 'A',
            address: 'Jl. KH. Abdullah Syafei No.48, Tebet',
            headmaster: 'Drs. H. Sukimin, M.Pd.',
          },
        ],
      },
      {
        id: 'jakarta-timur',
        name: 'Kota Adm. Jakarta Timur',
        level: 'Semua Jenjang',
        schoolCount: 2210,
        studentCount: 1120000,
        teacherCount: 43200,
        ratio: 25.9,
        accreditation: 'A:42% B:46% C:12%',
        schools: [
          {
            id: 'smk-26-jkt',
            name: 'SMKN 26 Jakarta',
            level: 'SMK',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 1450,
            teacherCount: 98,
            ratio: 14.8,
            accreditation: 'A',
            address: 'Jl. Balai Pustaka Baru I, Rawamangun',
            headmaster: 'Purwosusilo, M.Pd.',
          },
        ],
      },
    ],
  },
  {
    id: 'jawa-timur',
    name: 'Jawa Timur',
    level: 'Semua Jenjang',
    schoolCount: 15892,
    studentCount: 6982114,
    teacherCount: 281004,
    ratio: 24.9,
    accreditation: 'A:36% B:47% C:17%',
    districts: [
      {
        id: 'kota-surabaya',
        name: 'Kota Surabaya',
        level: 'Semua Jenjang',
        schoolCount: 1350,
        studentCount: 620400,
        teacherCount: 24800,
        ratio: 25.0,
        accreditation: 'A:45% B:43% C:12%',
        schools: [
          {
            id: 'sma-5-sby',
            name: 'SMAN 5 Surabaya',
            level: 'SMA',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 1080,
            teacherCount: 70,
            ratio: 15.4,
            accreditation: 'A',
            address: 'Jl. Kusuma Bangsa No.21, Genteng',
            headmaster: 'Dra. Hj. Sukesi, M.Si.',
          },
          {
            id: 'smp-1-sby',
            name: 'SMPN 1 Surabaya',
            level: 'SMP',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 920,
            teacherCount: 54,
            ratio: 17.0,
            accreditation: 'A',
            address: 'Jl. Pacar No.4, Ketabang',
            headmaster: 'Drs. H. Akhmat Suharto, M.Pd.',
          },
        ],
      },
      {
        id: 'kota-malang',
        name: 'Kota Malang',
        level: 'Semua Jenjang',
        schoolCount: 840,
        studentCount: 380200,
        teacherCount: 16100,
        ratio: 23.6,
        accreditation: 'A:43% B:45% C:12%',
        schools: [
          {
            id: 'sd-percobaan-mlg',
            name: 'SDN Percobaan 1 Malang',
            level: 'SD',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 480,
            teacherCount: 34,
            ratio: 14.1,
            accreditation: 'A',
            address: 'Jl. Jakarta No.38, Klojen',
            headmaster: 'Dra. Siti Rahayu, M.Pd.',
          },
          {
            id: 'smk-telkom-mlg',
            name: 'SMK Telkom Malang',
            level: 'SMK',
            status: 'Swasta',
            schoolCount: 1,
            studentCount: 1200,
            teacherCount: 82,
            ratio: 14.6,
            accreditation: 'A',
            address: 'Jl. Danau Ranau, Sawojajar',
            headmaster: 'Rahmat Dwi Djatmiko, S.Kom., M.T.',
          },
        ],
      },
    ],
  },
  {
    id: 'jawa-tengah',
    name: 'Jawa Tengah',
    level: 'Semua Jenjang',
    schoolCount: 12840,
    studentCount: 5421773,
    teacherCount: 213112,
    ratio: 25.4,
    accreditation: 'A:33% B:51% C:16%',
    districts: [
      {
        id: 'kota-semarang',
        name: 'Kota Semarang',
        level: 'Semua Jenjang',
        schoolCount: 980,
        studentCount: 432100,
        teacherCount: 17400,
        ratio: 24.8,
        accreditation: 'A:41% B:47% C:12%',
        schools: [
          {
            id: 'sma-3-smg',
            name: 'SMAN 3 Semarang',
            level: 'SMA',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 1100,
            teacherCount: 71,
            ratio: 15.5,
            accreditation: 'A',
            address: 'Jl. Pemuda No.149, Semarang',
            headmaster: 'Drs. Yuwana, M.Kom.',
          },
        ],
      },
      {
        id: 'kota-surakarta',
        name: 'Kota Surakarta',
        level: 'Semua Jenjang',
        schoolCount: 740,
        studentCount: 312500,
        teacherCount: 13200,
        ratio: 23.7,
        accreditation: 'A:44% B:45% C:11%',
        schools: [
          {
            id: 'smp-1-solo',
            name: 'SMPN 1 Surakarta',
            level: 'SMP',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 840,
            teacherCount: 56,
            ratio: 15.0,
            accreditation: 'A',
            address: 'Jl. Monginsidi No.40, Banjarsari',
            headmaster: 'Hj. Sri Wuryanti, M.Pd.',
          },
          {
            id: 'smk-2-solo',
            name: 'SMK Negeri 2 Surakarta',
            level: 'SMK',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 1320,
            teacherCount: 88,
            ratio: 15.0,
            accreditation: 'B',
            address: 'Jl. LU. Adisucipto No.33, Manahan',
            headmaster: 'Drs. Sugiyarso, M.Eng.',
          },
        ],
      },
    ],
  },
  {
    id: 'di-yogyakarta',
    name: 'D.I. Yogyakarta',
    level: 'Semua Jenjang',
    schoolCount: 4210,
    studentCount: 1842300,
    teacherCount: 78900,
    ratio: 23.3,
    accreditation: 'A:47% B:43% C:10%',
    districts: [
      {
        id: 'kota-yogyakarta',
        name: 'Kota Yogyakarta',
        level: 'Semua Jenjang',
        schoolCount: 650,
        studentCount: 295400,
        teacherCount: 13200,
        ratio: 22.4,
        accreditation: 'A:52% B:40% C:8%',
        schools: [
          {
            id: 'sma-1-jogja',
            name: 'SMAN 1 Yogyakarta',
            level: 'SMA',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 980,
            teacherCount: 69,
            ratio: 14.2,
            accreditation: 'A',
            address: 'Jl. H.O.S. Cokroaminoto No.10, Wirobrajan',
            headmaster: 'Drs. M. Radji, M.Pd.',
          },
        ],
      },
      {
        id: 'kab-sleman',
        name: 'Kab. Sleman',
        level: 'Semua Jenjang',
        schoolCount: 1120,
        studentCount: 492000,
        teacherCount: 21400,
        ratio: 23.0,
        accreditation: 'A:48% B:42% C:10%',
        schools: [
          {
            id: 'ugm-jogja',
            name: 'Universitas Gadjah Mada',
            level: 'Universitas',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 52400,
            teacherCount: 2610,
            ratio: 20.1,
            accreditation: 'A',
            address: 'Bulaksumur, Caturtunggal, Depok',
            headmaster: 'Prof. dr. Ova Emilia, M.Med.Ed., Ph.D.',
          },
        ],
      },
    ],
  },
  {
    id: 'sumatera-utara',
    name: 'Sumatera Utara',
    level: 'Semua Jenjang',
    schoolCount: 7621,
    studentCount: 2984331,
    teacherCount: 118542,
    ratio: 25.2,
    accreditation: 'A:32% B:52% C:16%',
    districts: [
      {
        id: 'kota-medan',
        name: 'Kota Medan',
        level: 'Semua Jenjang',
        schoolCount: 1420,
        studentCount: 610400,
        teacherCount: 24800,
        ratio: 24.6,
        accreditation: 'A:41% B:46% C:13%',
        schools: [
          {
            id: 'smp-1-medan',
            name: 'SMPN 1 Medan',
            level: 'SMP',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 880,
            teacherCount: 50,
            ratio: 17.6,
            accreditation: 'A',
            address: 'Jl. Bunga Asoka No.24, Medan',
            headmaster: 'Drs. H. Marasutan Rambe',
          },
          {
            id: 'sma-sutomo-1',
            name: 'SMA Sutomo 1 Medan',
            level: 'SMA',
            status: 'Swasta',
            schoolCount: 1,
            studentCount: 1350,
            teacherCount: 92,
            ratio: 14.7,
            accreditation: 'A',
            address: 'Jl. Letkol Martinus No.7, Medan',
            headmaster: 'Kurniadi, S.E., M.M.',
          },
        ],
      },
    ],
  },
  {
    id: 'bali',
    name: 'Bali',
    level: 'Semua Jenjang',
    schoolCount: 3840,
    studentCount: 1540200,
    teacherCount: 64200,
    ratio: 24.0,
    accreditation: 'A:45% B:44% C:11%',
    districts: [
      {
        id: 'kota-denpasar',
        name: 'Kota Denpasar',
        level: 'Semua Jenjang',
        schoolCount: 680,
        studentCount: 298400,
        teacherCount: 12800,
        ratio: 23.3,
        accreditation: 'A:50% B:42% C:8%',
        schools: [
          {
            id: 'sma-1-dps',
            name: 'SMAN 1 Denpasar',
            level: 'SMA',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 950,
            teacherCount: 62,
            ratio: 15.3,
            accreditation: 'A',
            address: 'Jl. Kamboja No.4, Denpasar',
            headmaster: 'I Made Rida, M.Pd.',
          },
        ],
      },
    ],
  },
  {
    id: 'sulawesi-selatan',
    name: 'Sulawesi Selatan',
    level: 'Semua Jenjang',
    schoolCount: 5620,
    studentCount: 2240100,
    teacherCount: 91400,
    ratio: 24.5,
    accreditation: 'A:34% B:50% C:16%',
    districts: [
      {
        id: 'kota-makassar',
        name: 'Kota Makassar',
        level: 'Semua Jenjang',
        schoolCount: 1120,
        studentCount: 485200,
        teacherCount: 20100,
        ratio: 24.1,
        accreditation: 'A:42% B:45% C:13%',
        schools: [
          {
            id: 'sma-1-mks',
            name: 'SMAN 1 Makassar',
            level: 'SMA',
            status: 'Negeri',
            schoolCount: 1,
            studentCount: 1020,
            teacherCount: 65,
            ratio: 15.7,
            accreditation: 'A',
            address: 'Jl. Gunung Bawakaraeng No.53, Makassar',
            headmaster: 'Drs. H. Arifin, M.Pd.',
          },
        ],
      },
    ],
  },
];

type SortField = 'name' | 'schools' | 'students' | 'teachers' | 'ratio' | 'accreditation';
type SortDirection = 'asc' | 'desc';

export const AdvancedDataGridPage: React.FC = () => {
  const outlet = useOutletContext<OutletContextType | null>();
  const period = outlet?.period || '2026';
  const setPeriod = outlet?.setPeriod || (() => {});

  // View state
  const [activeTab, setActiveTab] = useState('Data Grid');
  const [search, setSearch] = useState('');
  const [showColumnDrawer, setShowColumnDrawer] = useState(true);
  const [columnSearch, setColumnSearch] = useState('');

  // Dropdown filter states
  const [selectedProv, setSelectedProv] = useState('Semua Provinsi');
  const [selectedCity, setSelectedCity] = useState('Semua Kota/Kabupaten');
  const [selectedLevel, setSelectedLevel] = useState('Semua Jenjang');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [selectedAccred, setSelectedAccred] = useState('Semua');

  // Advanced filter states
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [minSchools, setMinSchools] = useState<number>(0);
  const [onlyAccredA, setOnlyAccredA] = useState(false);

  // Grouping state
  const [activeGroupBy, setActiveGroupBy] = useState<string[]>(['Provinsi', 'Kota/Kabupaten']);

  // Tree Expansion state
  const [expandedProvinces, setExpandedProvinces] = useState<Record<string, boolean>>({
    'jawa-barat': true,
  });
  const [expandedDistricts, setExpandedDistricts] = useState<Record<string, boolean>>({
    'kota-bekasi': true,
  });

  // Row selection state
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination state (for Provinces)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // Detail Modal state
  const [detailModalItem, setDetailModalItem] = useState<{
    title: string;
    level: string;
    schoolCount: number | string;
    studentCount: number | string;
    teacherCount: number | string;
    ratio: number | string;
    accreditation: string;
    address?: string;
    headmaster?: string;
    status?: string;
  } | null>(null);

  // Feedback Toast state (Save View, Reset View, Export)
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Column definitions for the drawer and table
  const [columns, setColumns] = useState([
    { id: 'name', label: 'Nama', checked: true, fixed: true },
    { id: 'level', label: 'Jenis', checked: true, fixed: false },
    { id: 'schools', label: 'Jumlah Sekolah', checked: true, fixed: false },
    { id: 'students', label: 'Jumlah Siswa', checked: true, fixed: false },
    { id: 'teachers', label: 'Jumlah Guru', checked: true, fixed: false },
    { id: 'ratio', label: 'Rasio Siswa:Guru', checked: true, fixed: false },
    { id: 'accreditation', label: 'Akreditasi', checked: true, fixed: false },
    { id: 'actions', label: 'Aksi', checked: true, fixed: false },
  ]);

  const isColVisible = (id: string) => {
    const col = columns.find((c) => c.id === id);
    return col ? col.checked : true;
  };

  const toggleColumnCheck = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id && !col.fixed ? { ...col, checked: !col.checked } : col)),
    );
  };

  // Expand / Collapse toggles
  const toggleProvince = (id: string) => {
    setExpandedProvinces((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDistrict = (id: string) => {
    setExpandedDistricts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const provs: Record<string, boolean> = {};
    const dists: Record<string, boolean> = {};
    ADVANCED_TREE_DATASET.forEach((p) => {
      provs[p.id] = true;
      p.districts?.forEach((d) => {
        dists[d.id] = true;
      });
    });
    setExpandedProvinces(provs);
    setExpandedDistricts(dists);
  };

  const collapseAll = () => {
    setExpandedProvinces({});
    setExpandedDistricts({});
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Provinces list for dropdown
  const availableProvinces = useMemo(() => {
    return ADVANCED_TREE_DATASET.map((p) => p.name).sort();
  }, []);

  // Cities list cascading from selected province
  const availableCities = useMemo(() => {
    if (selectedProv === 'Semua Provinsi') {
      const allDistricts = ADVANCED_TREE_DATASET.flatMap((p) =>
        p.districts ? p.districts.map((d) => d.name) : [],
      );
      return Array.from(new Set(allDistricts)).sort();
    }
    const targetProv = ADVANCED_TREE_DATASET.find((p) => p.name === selectedProv);
    return targetProv && targetProv.districts
      ? targetProv.districts.map((d) => d.name).sort()
      : [];
  }, [selectedProv]);

  // Handle province change
  const handleProvChange = (prov: string) => {
    setSelectedProv(prov);
    setSelectedCity('Semua Kota/Kabupaten');
    setCurrentPage(1);
  };

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    const q = search.toLowerCase().trim();

    return ADVANCED_TREE_DATASET.filter((province) => {
      // 1. Province Dropdown Filter
      if (selectedProv !== 'Semua Provinsi' && province.name !== selectedProv) {
        return false;
      }

      // 2. City Dropdown Filter
      if (selectedCity !== 'Semua Kota/Kabupaten') {
        const hasCity = province.districts?.some((d) => d.name === selectedCity);
        if (!hasCity) return false;
      }

      // 3. Min Schools (Advanced)
      if (minSchools > 0 && province.schoolCount < minSchools) {
        return false;
      }

      // 4. Only Accred A (Advanced)
      if (onlyAccredA && !province.accreditation.includes('A:')) {
        return false;
      }

      // 5. Search query matching
      if (q) {
        const provMatch = province.name.toLowerCase().includes(q);
        const distMatch = province.districts?.some((d) => d.name.toLowerCase().includes(q));
        const schoolMatch = province.districts?.some((d) =>
          d.schools?.some(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.level.toLowerCase().includes(q) ||
              s.accreditation.toLowerCase().includes(q),
          ),
        );

        if (!provMatch && !distMatch && !schoolMatch) {
          return false;
        }
      }

      // 6. Level Filter (Jenjang)
      if (selectedLevel !== 'Semua Jenjang') {
        const hasMatchingSchool = province.districts?.some((d) =>
          d.schools?.some((s) => s.level === selectedLevel),
        );
        if (!hasMatchingSchool) return false;
      }

      // 7. Status Filter
      if (selectedStatus !== 'Semua Status') {
        const hasMatchingStatus = province.districts?.some((d) =>
          d.schools?.some((s) => s.status === selectedStatus),
        );
        if (!hasMatchingStatus) return false;
      }

      // 8. Accreditation Filter
      if (selectedAccred !== 'Semua') {
        const hasMatchingAccred = province.districts?.some((d) =>
          d.schools?.some((s) => s.accreditation === selectedAccred),
        );
        if (!hasMatchingAccred) return false;
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
    minSchools,
    onlyAccredA,
  ]);

  // Sort logic for provinces
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'schools') {
        valA = a.schoolCount;
        valB = b.schoolCount;
      } else if (sortField === 'students') {
        valA = a.studentCount;
        valB = b.studentCount;
      } else if (sortField === 'teachers') {
        valA = a.teacherCount;
        valB = b.teacherCount;
      } else if (sortField === 'ratio') {
        valA = a.ratio;
        valB = b.ratio;
      }

      if (typeof valA === 'string') {
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

  // Pagination calculations
  const totalProvinces = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalProvinces / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalProvinces);
  const paginatedProvinces = sortedData.slice(startIndex, endIndex);

  // Total summary calculations across all filtered data
  const totalStats = useMemo(() => {
    const totalSch = filteredData.reduce((acc, p) => acc + p.schoolCount, 0);
    const totalStu = filteredData.reduce((acc, p) => acc + p.studentCount, 0);
    const totalTea = filteredData.reduce((acc, p) => acc + p.teacherCount, 0);
    const avgRatio = totalTea > 0 ? (totalStu / totalTea).toFixed(1).replace('.', ',') : '0';
    return { totalSch, totalStu, totalTea, avgRatio };
  }, [filteredData]);

  // Sorting handlers
  const handleSortClick = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      if (['schools', 'students', 'teachers', 'ratio'].includes(field)) {
        setSortDirection('desc');
      } else {
        setSortDirection('asc');
      }
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <span className="text-gray-400 ml-1">⇅</span>;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#25A9A1] inline ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#25A9A1] inline ml-1" />
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
    setMinSchools(0);
    setOnlyAccredA(false);
    setCurrentPage(1);
    setSelectedRows({});
    showNotification('Filter telah direset ke setelan awal.');
  };

  // Filter tags list
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
        onRemove: () => {
          setSelectedLevel('Semua Jenjang');
          setCurrentPage(1);
        },
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

    if (minSchools > 0) {
      list.push({
        id: 'minSchools',
        label: `Min. Sekolah: ${minSchools.toLocaleString('id-ID')}`,
        onRemove: () => setMinSchools(0),
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
    minSchools,
    onlyAccredA,
  ]);

  // Selected rows calculation & select all
  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  const isAllCurrentPageSelected =
    paginatedProvinces.length > 0 &&
    paginatedProvinces.every((p) => selectedRows[p.id]);

  const toggleSelectAll = () => {
    if (isAllCurrentPageSelected) {
      const next = { ...selectedRows };
      paginatedProvinces.forEach((p) => {
        delete next[p.id];
        p.districts?.forEach((d) => {
          delete next[d.id];
          d.schools?.forEach((s) => delete next[s.id]);
        });
      });
      setSelectedRows(next);
    } else {
      const next = { ...selectedRows };
      paginatedProvinces.forEach((p) => {
        next[p.id] = true;
        p.districts?.forEach((d) => {
          next[d.id] = true;
          d.schools?.forEach((s) => {
            next[s.id] = true;
          });
        });
      });
      setSelectedRows(next);
    }
  };

  // Quick Preset Columns in Toolbar
  const handleQuickPresetColumns = (preset: string) => {
    if (preset === 'Semua Kolom') {
      setColumns((prev) => prev.map((c) => ({ ...c, checked: true })));
    } else if (preset === 'Kolom Utama') {
      setColumns((prev) =>
        prev.map((c) => ({
          ...c,
          checked: ['name', 'level', 'students', 'accreditation', 'actions'].includes(c.id),
        })),
      );
    } else if (preset === 'Statistik Saja') {
      setColumns((prev) =>
        prev.map((c) => ({
          ...c,
          checked: ['name', 'schools', 'students', 'teachers', 'ratio', 'actions'].includes(c.id),
        })),
      );
    }
    showNotification(`Tampilan kolom disesuaikan: ${preset}`);
  };

  // Donut distribution data
  const donutData = [
    { name: 'SD', value: 45.2, color: '#0284c7' },
    { name: 'SMP', value: 28.1, color: '#06b6d4' },
    { name: 'SMA', value: 20.4, color: '#f59e0b' },
    { name: 'SMK', value: 6.3, color: '#8b5cf6' },
  ];

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'SD':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7]">
            SD
          </span>
        );
      case 'SMP':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E0F7F6] text-[#0D9488]">
            SMP
          </span>
        );
      case 'SMA':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#D97706]">
            SMA
          </span>
        );
      case 'SMK':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EDE9FE] text-[#7C3AED]">
            SMK
          </span>
        );
      case 'Universitas':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFE4E6] text-[#E11D48]">
            Universitas
          </span>
        );
      default:
        return <span className="text-gray-600 font-medium">{level}</span>;
    }
  };

  const getAccreditationBadge = (acc: string) => {
    if (acc === 'A') {
      return <span className="font-bold text-[#10B981]">{acc}</span>;
    }
    if (acc === 'B') {
      return <span className="font-bold text-[#F59E0B]">{acc}</span>;
    }
    if (acc === 'C') {
      return <span className="font-bold text-[#EF4444]">{acc}</span>;
    }
    return <span className="text-gray-500 font-mono text-[11px]">{acc}</span>;
  };

  return (
    <div className="space-y-5">
      {/* Universal Page Header */}
      <PageHeader
        title="Advanced Data Grid"
        subtitle="Eksplorasi data pendidikan secara mendalam dengan fitur grouping, agregasi, dan kustomisasi kolom."
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Action Notification Toast */}
      {actionNotice && (
        <div
          data-testid="action-notification-toast"
          className="fixed top-5 right-5 z-50 bg-[#153B66] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border border-white/20 animate-fade-in"
        >
          <Check className="w-4 h-4 text-[#25A9A1]" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top 5 Cards Row (4 KPI + 1 Donut) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Total Sekolah */}
        <div
          data-testid="kpi-total-sekolah"
          onClick={() =>
            setDetailModalItem({
              title: 'Metrik Total Sekolah Nasional',
              level: 'Nasional',
              schoolCount: '125.482',
              studentCount: '42.560.321',
              teacherCount: '2.843.921',
              ratio: '25,0',
              accreditation: 'A: 38% | B: 46% | C: 16%',
              address: 'Seluruh 38 Provinsi di Indonesia',
            })
          }
          className="bg-white border border-[#DCE5EF] rounded-xl p-4 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#25A9A1] transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-[#FEF9EE] text-[#F59E0B]">
              <School className="w-5 h-5" />
            </div>
            <span className="text-gray-400 text-sm hover:text-[#25A9A1]">›</span>
          </div>
          <div className="mt-2">
            <div className="text-[11px] font-medium text-[#526579]">Total Sekolah</div>
            <div className="text-xl font-bold text-[#172B4D] font-heading mt-0.5">125.482</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#10B981] font-medium">
              <span>↑ 2,8%</span>
              <span className="text-gray-400">dari 2025</span>
            </div>
          </div>
          <div className="flex items-end gap-1 h-5 mt-2">
            {[40, 50, 45, 60, 55, 75, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-[#FDE68A] rounded-t-xs" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* KPI 2: Total Siswa */}
        <div
          data-testid="kpi-total-siswa"
          onClick={() =>
            setDetailModalItem({
              title: 'Metrik Total Siswa Nasional',
              level: 'Nasional',
              schoolCount: '125.482',
              studentCount: '42.560.321',
              teacherCount: '2.843.921',
              ratio: '25,0',
              accreditation: 'Angka Partisipasi Murni: 98,2%',
              address: 'Peserta didik aktif seluruh jenjang',
            })
          }
          className="bg-white border border-[#DCE5EF] rounded-xl p-4 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#25A9A1] transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-[#EBF7FD] text-[#0284C7]">
              <span className="text-lg">👥</span>
            </div>
            <span className="text-gray-400 text-sm hover:text-[#25A9A1]">›</span>
          </div>
          <div className="mt-2">
            <div className="text-[11px] font-medium text-[#526579]">Total Siswa</div>
            <div className="text-xl font-bold text-[#172B4D] font-heading mt-0.5">42.560.321</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#10B981] font-medium">
              <span>↑ 3,1%</span>
              <span className="text-gray-400">dari 2025</span>
            </div>
          </div>
          <div className="flex items-end gap-1 h-5 mt-2">
            {[35, 45, 55, 50, 65, 75, 90].map((h, i) => (
              <div key={i} className="flex-1 bg-[#BAE6FD] rounded-t-xs" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* KPI 3: Total Guru */}
        <div
          data-testid="kpi-total-guru"
          onClick={() =>
            setDetailModalItem({
              title: 'Metrik Total Tenaga Pendidik Nasional',
              level: 'Nasional',
              schoolCount: '125.482',
              studentCount: '42.560.321',
              teacherCount: '2.843.921',
              ratio: '25,0',
              accreditation: 'Sertifikasi Guru: 84,6%',
              address: 'Tenaga pendidik terdaftar Dapodik',
            })
          }
          className="bg-white border border-[#DCE5EF] rounded-xl p-4 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#25A9A1] transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-[#F5F3FF] text-[#7C3AED]">
              <span className="text-lg">👤</span>
            </div>
            <span className="text-gray-400 text-sm hover:text-[#25A9A1]">›</span>
          </div>
          <div className="mt-2">
            <div className="text-[11px] font-medium text-[#526579]">Total Guru</div>
            <div className="text-xl font-bold text-[#172B4D] font-heading mt-0.5">2.843.921</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#10B981] font-medium">
              <span>↑ 1,9%</span>
              <span className="text-gray-400">dari 2025</span>
            </div>
          </div>
          <div className="flex items-end gap-1 h-5 mt-2">
            {[30, 40, 45, 55, 60, 70, 80].map((h, i) => (
              <div key={i} className="flex-1 bg-[#DDD6FE] rounded-t-xs" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* KPI 4: Total Universitas */}
        <div
          data-testid="kpi-total-univ"
          onClick={() =>
            setDetailModalItem({
              title: 'Metrik Pendidikan Tinggi (Universitas & Institut)',
              level: 'Pendidikan Tinggi',
              schoolCount: '3.216',
              studentCount: '8.940.120',
              teacherCount: '312.450',
              ratio: '28,6',
              accreditation: 'PTN-BH: 21 | PTN-BLU: 38 | PTS: 3.157',
              address: 'Perguruan Tinggi di bawah Kemendiktisaintek',
            })
          }
          className="bg-white border border-[#DCE5EF] rounded-xl p-4 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#25A9A1] transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-[#E6F8F6] text-[#0D9488]">
              <span className="text-lg">🎓</span>
            </div>
            <span className="text-gray-400 text-sm hover:text-[#25A9A1]">›</span>
          </div>
          <div className="mt-2">
            <div className="text-[11px] font-medium text-[#526579]">Total Universitas</div>
            <div className="text-xl font-bold text-[#172B4D] font-heading mt-0.5">3.216</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#10B981] font-medium">
              <span>↑ 4,5%</span>
              <span className="text-gray-400">dari 2025</span>
            </div>
          </div>
          <div className="flex items-end gap-1 h-5 mt-2">
            {[45, 50, 55, 65, 70, 80, 88].map((h, i) => (
              <div key={i} className="flex-1 bg-[#A7F3D0] rounded-t-xs" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* KPI 5: Distribusi Jenjang Donut */}
        <div className="bg-white border border-[#DCE5EF] rounded-xl p-3 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-bold text-[#172B4D]">Distribusi Jenjang</div>
          <div className="flex items-center justify-between gap-1 mt-1">
            <div className="relative w-24 h-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={42}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] font-bold text-[#172B4D] leading-tight">125.482</span>
                <span className="text-[8px] text-gray-400">Sekolah</span>
              </div>
            </div>
            <div className="space-y-1 text-[10px] font-medium shrink-0">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
                  <span>SD</span>
                </span>
                <span className="text-gray-500 font-semibold">45,2%</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
                  <span>SMP</span>
                </span>
                <span className="text-gray-500 font-semibold">28,1%</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <span>SMA</span>
                </span>
                <span className="text-gray-500 font-semibold">20,4%</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                  <span>SMK</span>
                </span>
                <span className="text-gray-500 font-semibold">6,3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* View Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['Data Grid', 'Pivot View', 'Aggregation', 'Group Analysis', 'Comparison'].map((tab) => (
            <button
              key={tab}
              type="button"
              data-testid={`view-tab-${tab.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#0F2942] text-white shadow-xs font-bold'
                  : 'bg-white border border-[#DCE5EF] text-[#526579] hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="btn-simpan-view"
            onClick={() => showNotification('Konfigurasi View berhasil disimpan sebagai bookmark.')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DCE5EF] rounded-lg text-xs font-semibold text-[#526579] hover:bg-gray-50 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-gray-400" />
            <span>Simpan View</span>
          </button>
          <button
            type="button"
            data-testid="btn-reset-view"
            onClick={resetFilter}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DCE5EF] rounded-lg text-xs font-semibold text-[#526579] hover:bg-gray-50 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span>Reset View</span>
          </button>
          <button
            type="button"
            data-testid="btn-expand-all"
            onClick={expandAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DCE5EF] rounded-lg text-xs font-semibold text-[#526579] hover:bg-gray-50 cursor-pointer"
            title="Buka seluruh cabang provinsi dan kabupaten"
          >
            <ChevronsUpDown className="w-3.5 h-3.5 text-[#25A9A1]" />
            <span>Buka Semua</span>
          </button>
          <button
            type="button"
            data-testid="btn-collapse-all"
            onClick={collapseAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DCE5EF] rounded-lg text-xs font-semibold text-[#526579] hover:bg-gray-50 cursor-pointer"
            title="Tutup seluruh cabang"
          >
            <ChevronsDownUp className="w-3.5 h-3.5 text-gray-400" />
            <span>Tutup Semua</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        {[
          { label: 'Semua Jenjang', key: 'Semua Jenjang' },
          { label: 'SD', key: 'SD' },
          { label: 'SMP', key: 'SMP' },
          { label: 'SMA', key: 'SMA' },
          { label: 'SMK', key: 'SMK' },
          { label: 'Universitas', key: 'Universitas' },
        ].map((cat) => {
          const isActive = selectedLevel === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              data-testid={`grid-cat-${cat.key}`}
              onClick={() => {
                setSelectedLevel(cat.key);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#0F2942] text-white shadow-xs font-bold'
                  : 'bg-white border border-[#DCE5EF] text-[#526579] hover:bg-[#F8FAFC] hover:text-[#0F2942]'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#DCE5EF] rounded-xl p-3 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-4 flex items-center bg-[#F5F8FC] border border-[#DCE5EF] rounded-lg px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              data-testid="grid-search-input"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama provinsi, kota/kabupaten, atau sekolah..."
              className="bg-transparent border-none outline-none text-[#172B4D] w-full placeholder:text-gray-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCurrentPage(1);
                }}
                className="text-gray-400 hover:text-gray-700 ml-1.5"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdown Filters */}
          <div className="md:col-span-8 flex flex-wrap items-center gap-2">
            {/* Provinsi */}
            <div className="flex-1 min-w-[120px]">
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Provinsi
              </label>
              <select
                data-testid="grid-filter-prov"
                value={selectedProv}
                onChange={(e) => handleProvChange(e.target.value)}
                className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-lg px-2.5 py-1.5 outline-none text-[#172B4D] cursor-pointer hover:border-[#25A9A1]"
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
            <div className="flex-1 min-w-[130px]">
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Kota/Kabupaten
              </label>
              <select
                data-testid="grid-filter-city"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-lg px-2.5 py-1.5 outline-none text-[#172B4D] cursor-pointer hover:border-[#25A9A1]"
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
            <div className="flex-1 min-w-[110px]">
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Jenjang
              </label>
              <select
                data-testid="grid-filter-level"
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-lg px-2.5 py-1.5 outline-none text-[#172B4D] cursor-pointer hover:border-[#25A9A1]"
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
            <div className="flex-1 min-w-[100px]">
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Status
              </label>
              <select
                data-testid="grid-filter-status"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-lg px-2.5 py-1.5 outline-none text-[#172B4D] cursor-pointer hover:border-[#25A9A1]"
              >
                <option value="Semua Status">Semua Status</option>
                <option value="Negeri">Negeri</option>
                <option value="Swasta">Swasta</option>
              </select>
            </div>

            {/* Akreditasi */}
            <div className="flex-1 min-w-[80px]">
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Akreditasi
              </label>
              <select
                data-testid="grid-filter-accred"
                value={selectedAccred}
                onChange={(e) => {
                  setSelectedAccred(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-lg px-2.5 py-1.5 outline-none text-[#172B4D] cursor-pointer hover:border-[#25A9A1]"
              >
                <option value="Semua">Semua</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>

            {/* Filter Lanjutan Button */}
            <div className="pt-3">
              <button
                type="button"
                data-testid="btn-grid-advanced-filter"
                onClick={() => setShowAdvancedFilter((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  showAdvancedFilter || minSchools > 0 || onlyAccredA
                    ? 'bg-[#25A9A1] text-white shadow-xs'
                    : 'bg-white border border-[#DCE5EF] text-[#526579] hover:bg-gray-50'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Lanjutan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Lanjutan Collapsible Drawer */}
        {showAdvancedFilter && (
          <div
            data-testid="grid-advanced-panel"
            className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-2"
          >
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-[#172B4D]">Minimal Jumlah Sekolah:</label>
                <input
                  type="number"
                  data-testid="input-min-schools"
                  value={minSchools || ''}
                  onChange={(e) => {
                    setMinSchools(Number(e.target.value) || 0);
                    setCurrentPage(1);
                  }}
                  placeholder="Contoh: 10000"
                  className="bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 w-32 outline-none text-[#172B4D]"
                />
              </div>

              <label className="flex items-center gap-2 font-semibold text-[#172B4D] cursor-pointer">
                <input
                  type="checkbox"
                  data-testid="check-only-accred-a-grid"
                  checked={onlyAccredA}
                  onChange={(e) => {
                    setOnlyAccredA(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded text-[#25A9A1] focus:ring-[#25A9A1]"
                />
                Hanya Akreditasi Mayoritas A
              </label>

              {(minSchools > 0 || onlyAccredA) && (
                <button
                  type="button"
                  onClick={() => {
                    setMinSchools(0);
                    setOnlyAccredA(false);
                    setCurrentPage(1);
                  }}
                  className="text-xs text-[#25A9A1] hover:underline font-bold"
                >
                  Bersihkan Filter Lanjutan
                </button>
              )}
            </div>
          </div>
        )}

        {/* Active Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#F0F4F8] text-xs">
          <span className="text-[#526579] font-medium text-[11px]">Filter Aktif:</span>
          {activeTags.length === 0 ? (
            <span className="text-gray-400 italic text-[11px]">
              Tidak ada filter aktif (menampilkan seluruh wilayah)
            </span>
          ) : (
            activeTags.map((tag) => (
              <span
                key={tag.id}
                data-testid={`grid-tag-${tag.id}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#475569] font-medium border border-[#DCE5EF]"
              >
                {tag.label}
                <button
                  type="button"
                  data-testid={`grid-remove-tag-${tag.id}`}
                  onClick={tag.onRemove}
                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                  title="Hapus filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}

          {activeTags.length > 0 && (
            <button
              type="button"
              data-testid="btn-grid-reset-filters"
              onClick={resetFilter}
              className="flex items-center gap-1 text-[#25A9A1] font-semibold text-xs ml-2 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Grouping & Toolbar Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#DCE5EF] rounded-xl px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <SlidersHorizontal className="w-4 h-4 text-[#25A9A1] shrink-0" />
          <span className="text-gray-500 font-semibold">Group by:</span>
          {activeGroupBy.map((group) => (
            <span
              key={group}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EBF7FD] text-[#0284C7] font-medium"
            >
              {group}
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() =>
                  setActiveGroupBy((prev) => prev.filter((item) => item !== group))
                }
              />
            </span>
          ))}
          {activeGroupBy.length < 2 && (
            <button
              type="button"
              onClick={() => setActiveGroupBy(['Provinsi', 'Kota/Kabupaten'])}
              className="text-[#25A9A1] font-semibold hover:underline"
            >
              + Reset Group
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Preset Columns Selector */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>Tampilkan:</span>
            <select
              data-testid="select-columns-preset"
              onChange={(e) => handleQuickPresetColumns(e.target.value)}
              className="bg-[#F5F8FC] border border-[#DCE5EF] rounded-lg px-2 py-1 font-semibold text-[#172B4D] outline-none cursor-pointer"
            >
              <option value="Semua Kolom">Semua Kolom</option>
              <option value="Kolom Utama">Kolom Utama</option>
              <option value="Statistik Saja">Statistik Saja</option>
            </select>
          </div>

          {/* Atur Kolom Drawer Toggle */}
          <button
            type="button"
            data-testid="btn-toggle-column-drawer"
            onClick={() => setShowColumnDrawer(!showColumnDrawer)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              showColumnDrawer
                ? 'bg-[#EBF7FD] text-[#0284C7] border-[#0284C7]'
                : 'bg-white border-[#DCE5EF] text-[#526579] hover:bg-gray-50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Atur Kolom</span>
          </button>

          {/* Export Tampilan Button */}
          <button
            type="button"
            data-testid="btn-export-view"
            onClick={() => showNotification('Data tampilan saat ini siap diunduh (CSV / XLSX / PDF).')}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DCE5EF] rounded-lg text-xs font-semibold text-[#526579] hover:bg-gray-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Tampilan ⌄</span>
          </button>
        </div>
      </div>

      {/* Row Selection Banner */}
      {selectedCount > 0 && (
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-[#1E40AF]">
          <span className="font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-[#2563EB]" />
            {selectedCount} item wilayah/sekolah dipilih
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedRows({})}
              className="text-[#1D4ED8] hover:underline font-bold cursor-pointer"
            >
              Batalkan Pilihan
            </button>
            <button
              type="button"
              onClick={() => showNotification(`Mengekspor ${selectedCount} item terpilih...`)}
              className="px-2.5 py-1 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-[#1D4ED8] cursor-pointer"
            >
              Ekspor Terpilih
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area: Data Grid / Pivot / Aggregation / Group Analysis / Comparison */}
      {activeTab === 'Pivot View' ? (
        /* Pivot Matrix View */
        <div
          data-testid="pivot-view-container"
          className="bg-white border border-[#DCE5EF] rounded-xl p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#F0F4F8] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#172B4D]">
                Pivot Matrix: Wilayah × Jenjang Pendidikan
              </h3>
              <p className="text-xs text-gray-500">
                Ringkasan komparasi jumlah institusi per jenjang di setiap provinsi
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-teal-50 text-[#25A9A1] font-bold text-xs border border-teal-200">
              Pivot Agregat
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#DCE5EF] text-[#526579] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Provinsi</th>
                  <th className="py-2.5 px-3 text-right">SD (Sekolah Dasar)</th>
                  <th className="py-2.5 px-3 text-right">SMP</th>
                  <th className="py-2.5 px-3 text-right">SMA</th>
                  <th className="py-2.5 px-3 text-right">SMK</th>
                  <th className="py-2.5 px-3 text-right">Total Sekolah</th>
                  <th className="py-2.5 px-3 text-right">Total Siswa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {sortedData.map((prov) => (
                  <tr key={prov.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-[#172B4D]">{prov.name}</td>
                    <td className="py-2.5 px-3 text-right text-gray-600">
                      {Math.round(prov.schoolCount * 0.452).toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-600">
                      {Math.round(prov.schoolCount * 0.281).toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-600">
                      {Math.round(prov.schoolCount * 0.204).toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-600">
                      {Math.round(prov.schoolCount * 0.063).toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#25A9A1]">
                      {prov.schoolCount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#172B4D]">
                      {prov.studentCount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'Aggregation' ? (
        /* Aggregation Analysis View */
        <div
          data-testid="aggregation-view-container"
          className="bg-white border border-[#DCE5EF] rounded-xl p-5 shadow-xs space-y-4"
        >
          <div className="border-b border-[#F0F4F8] pb-3">
            <h3 className="text-sm font-bold text-[#172B4D]">Analisis Agregasi Nasional</h3>
            <p className="text-xs text-gray-500">
              Statistik agregat sekolah, rasio siswa-guru, dan kapasitas per provinsi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#DCE5EF]">
              <p className="text-xs text-gray-500 font-semibold">Total Institusi</p>
              <p className="text-xl font-bold text-[#172B4D] mt-1 font-heading">
                {totalStats.totalSch.toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Seluruh jenjang pendidikan</p>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#DCE5EF]">
              <p className="text-xs text-gray-500 font-semibold">Rata-rata Siswa / Sekolah</p>
              <p className="text-xl font-bold text-[#172B4D] mt-1 font-heading">
                {totalStats.totalSch > 0
                  ? Math.round(totalStats.totalStu / totalStats.totalSch).toLocaleString('id-ID')
                  : '0'}
              </p>
              <p className="text-[11px] text-[#10B981] font-bold mt-0.5">Kapasitas Optimal</p>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#DCE5EF]">
              <p className="text-xs text-gray-500 font-semibold">Rasio Siswa : Guru Nasional</p>
              <p className="text-xl font-bold text-[#25A9A1] mt-1 font-heading">
                1 : {totalStats.avgRatio}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Standar Nasional: &le; 28,0</p>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#DCE5EF]">
              <p className="text-xs text-gray-500 font-semibold">Total Guru Terdata</p>
              <p className="text-xl font-bold text-[#172B4D] mt-1 font-heading">
                {totalStats.totalTea.toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Tenaga pendidik terverifikasi</p>
            </div>
          </div>
        </div>
      ) : activeTab === 'Group Analysis' ? (
        /* Group Analysis View */
        <div
          data-testid="group-analysis-view-container"
          className="bg-white border border-[#DCE5EF] rounded-xl p-5 shadow-xs space-y-4"
        >
          <div className="border-b border-[#F0F4F8] pb-3">
            <h3 className="text-sm font-bold text-[#172B4D]">Analisis Komposisi Group</h3>
            <p className="text-xs text-gray-500">Peringkat dan proporsi sekolah antar provinsi</p>
          </div>
          <div className="space-y-3">
            {sortedData.map((prov, idx) => {
              const share = totalStats.totalSch > 0 ? (prov.schoolCount / totalStats.totalSch) * 100 : 0;
              return (
                <div key={prov.id} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-[#172B4D]">
                      #{idx + 1} {prov.name}
                    </span>
                    <span className="text-gray-500">
                      {prov.schoolCount.toLocaleString('id-ID')} sekolah ({share.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#25A9A1] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, share * 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === 'Comparison' ? (
        /* Regional Comparison View */
        <div
          data-testid="comparison-view-container"
          className="bg-white border border-[#DCE5EF] rounded-xl p-5 shadow-xs space-y-4"
        >
          <div className="border-b border-[#F0F4F8] pb-3">
            <h3 className="text-sm font-bold text-[#172B4D]">Komparasi Wilayah Side-by-Side</h3>
            <p className="text-xs text-gray-500">Perbandingan head-to-head indikator pendidikan antar wilayah</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sortedData.slice(0, 3).map((prov) => (
              <div key={prov.id} className="p-4 bg-[#F8FAFC] border border-[#DCE5EF] rounded-xl space-y-3">
                <div className="border-b border-gray-200 pb-2">
                  <h4 className="font-bold text-[#172B4D] text-sm">{prov.name}</h4>
                  <p className="text-[11px] text-[#25A9A1] font-semibold">{prov.level}</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Jumlah Sekolah:</span>
                    <span className="font-bold text-[#172B4D]">{prov.schoolCount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Jumlah Siswa:</span>
                    <span className="font-bold text-[#172B4D]">{prov.studentCount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Jumlah Guru:</span>
                    <span className="font-bold text-[#172B4D]">{prov.teacherCount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rasio Siswa:Guru:</span>
                    <span className="font-bold text-[#25A9A1]">1 : {prov.ratio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Akreditasi:</span>
                    <span className="font-medium text-[#172B4D] text-[11px]">{prov.accreditation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Default: Hierarchical Data Grid Tree Table */
        <div className="flex items-start gap-4">
          {/* Tree Table Container */}
          <div className="flex-1 bg-white border border-[#DCE5EF] rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#172B4D]">
                <thead className="bg-[#F8FAFC] border-b border-[#DCE5EF] text-[#526579] font-bold">
                  <tr>
                    <th className="py-3 px-3 w-8 text-center">
                      <input
                        type="checkbox"
                        data-testid="grid-select-all"
                        checked={isAllCurrentPageSelected}
                        onChange={toggleSelectAll}
                        className="rounded text-[#25A9A1] focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th
                      onClick={() => handleSortClick('name')}
                      data-testid="th-grid-name"
                      className="py-3 px-3 cursor-pointer select-none hover:text-[#172B4D]"
                    >
                      Nama {getSortIcon('name')}
                    </th>
                    {isColVisible('level') && (
                      <th data-testid="th-grid-level" className="py-3 px-3">Jenis</th>
                    )}
                    {isColVisible('schools') && (
                      <th
                        onClick={() => handleSortClick('schools')}
                        data-testid="th-grid-schools"
                        className="py-3 px-3 text-right cursor-pointer select-none hover:text-[#172B4D]"
                      >
                        Jumlah Sekolah {getSortIcon('schools')}
                      </th>
                    )}
                    {isColVisible('students') && (
                      <th
                        onClick={() => handleSortClick('students')}
                        data-testid="th-grid-students"
                        className="py-3 px-3 text-right cursor-pointer select-none hover:text-[#172B4D]"
                      >
                        Jumlah Siswa {getSortIcon('students')}
                      </th>
                    )}
                    {isColVisible('teachers') && (
                      <th
                        onClick={() => handleSortClick('teachers')}
                        className="py-3 px-3 text-right cursor-pointer select-none hover:text-[#172B4D]"
                      >
                        Jumlah Guru {getSortIcon('teachers')}
                      </th>
                    )}
                    {isColVisible('ratio') && (
                      <th
                        onClick={() => handleSortClick('ratio')}
                        className="py-3 px-3 text-right cursor-pointer select-none hover:text-[#172B4D]"
                      >
                        Rasio Siswa:Guru {getSortIcon('ratio')}
                      </th>
                    )}
                    {isColVisible('accreditation') && (
                      <th className="py-3 px-3 text-center">Akreditasi (A/B/C)</th>
                    )}
                    {isColVisible('actions') && (
                      <th className="py-3 px-3 text-center">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {paginatedProvinces.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-500">
                        <School className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="font-semibold text-sm text-[#172B4D]">
                          Tidak ada data yang cocok dengan kriteria pencarian atau filter Anda
                        </p>
                        <button
                          type="button"
                          onClick={resetFilter}
                          className="mt-3 px-3 py-1.5 bg-[#25A9A1] text-white font-semibold text-xs rounded-lg hover:bg-[#1f8d86]"
                        >
                          Reset Filter
                        </button>
                      </td>
                    </tr>
                  ) : (
                    paginatedProvinces.map((province) => {
                      const isProvExpanded = expandedProvinces[province.id];

                      return (
                        <React.Fragment key={province.id}>
                          {/* Province Row */}
                          <tr
                            data-testid={`row-prov-${province.id}`}
                            className={`bg-[#FAFBFD] font-bold text-[#172B4D] hover:bg-[#F1F5F9] transition-colors ${
                              selectedRows[province.id] ? 'bg-teal-50/50' : ''
                            }`}
                          >
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={!!selectedRows[province.id]}
                                onChange={() => toggleSelectRow(province.id)}
                                className="rounded text-[#25A9A1] focus:ring-0 cursor-pointer"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <button
                                type="button"
                                data-testid={`btn-expand-prov-${province.id}`}
                                onClick={() => toggleProvince(province.id)}
                                className="flex items-center gap-1.5 text-left font-bold text-[#172B4D] hover:text-[#25A9A1] cursor-pointer"
                              >
                                {isProvExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                                <span>{province.name}</span>
                              </button>
                            </td>
                            {isColVisible('level') && (
                              <td className="py-2.5 px-3 font-normal text-gray-500">
                                {province.level}
                              </td>
                            )}
                            {isColVisible('schools') && (
                              <td className="py-2.5 px-3 text-right font-bold">
                                {province.schoolCount.toLocaleString('id-ID')}
                              </td>
                            )}
                            {isColVisible('students') && (
                              <td className="py-2.5 px-3 text-right font-bold">
                                {province.studentCount.toLocaleString('id-ID')}
                              </td>
                            )}
                            {isColVisible('teachers') && (
                              <td className="py-2.5 px-3 text-right font-bold">
                                {province.teacherCount.toLocaleString('id-ID')}
                              </td>
                            )}
                            {isColVisible('ratio') && (
                              <td className="py-2.5 px-3 text-right font-normal text-[#25A9A1] font-semibold">
                                {province.ratio.toFixed(1).replace('.', ',')}
                              </td>
                            )}
                            {isColVisible('accreditation') && (
                              <td className="py-2.5 px-3 text-center font-normal">
                                {getAccreditationBadge(province.accreditation)}
                              </td>
                            )}
                            {isColVisible('actions') && (
                              <td className="py-2.5 px-3 text-center text-gray-400">
                                <button
                                  type="button"
                                  data-testid={`btn-detail-prov-${province.id}`}
                                  onClick={() =>
                                    setDetailModalItem({
                                      title: province.name,
                                      level: 'Provinsi',
                                      schoolCount: province.schoolCount,
                                      studentCount: province.studentCount,
                                      teacherCount: province.teacherCount,
                                      ratio: province.ratio,
                                      accreditation: province.accreditation,
                                      address: `Provinsi ${province.name}, Indonesia`,
                                    })
                                  }
                                  className="p-1 hover:text-[#172B4D] cursor-pointer"
                                  title="Lihat Detail Wilayah"
                                >
                                  <MoreHorizontal className="w-4 h-4 mx-auto" />
                                </button>
                              </td>
                            )}
                          </tr>

                          {/* Districts (if province expanded) */}
                          {isProvExpanded &&
                            province.districts?.map((district) => {
                              const isDistExpanded = expandedDistricts[district.id];

                              return (
                                <React.Fragment key={district.id}>
                                  <tr
                                    data-testid={`row-dist-${district.id}`}
                                    className={`bg-white hover:bg-[#F8FAFC] transition-colors ${
                                      selectedRows[district.id] ? 'bg-teal-50/30' : ''
                                    }`}
                                  >
                                    <td className="py-2.5 px-3 text-center">
                                      <input
                                        type="checkbox"
                                        checked={!!selectedRows[district.id]}
                                        onChange={() => toggleSelectRow(district.id)}
                                        className="rounded text-[#25A9A1] focus:ring-0 cursor-pointer"
                                      />
                                    </td>
                                    <td className="py-2.5 px-3 pl-8">
                                      <button
                                        type="button"
                                        data-testid={`btn-expand-dist-${district.id}`}
                                        onClick={() => toggleDistrict(district.id)}
                                        className="flex items-center gap-1.5 text-left font-medium text-[#172B4D] hover:text-[#25A9A1] cursor-pointer"
                                      >
                                        {district.schools ? (
                                          isDistExpanded ? (
                                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                          ) : (
                                            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                          )
                                        ) : (
                                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                        )}
                                        <span>{district.name}</span>
                                      </button>
                                    </td>
                                    {isColVisible('level') && (
                                      <td className="py-2.5 px-3 text-gray-500">
                                        {district.level}
                                      </td>
                                    )}
                                    {isColVisible('schools') && (
                                      <td className="py-2.5 px-3 text-right">
                                        {district.schoolCount.toLocaleString('id-ID')}
                                      </td>
                                    )}
                                    {isColVisible('students') && (
                                      <td className="py-2.5 px-3 text-right">
                                        {district.studentCount.toLocaleString('id-ID')}
                                      </td>
                                    )}
                                    {isColVisible('teachers') && (
                                      <td className="py-2.5 px-3 text-right">
                                        {district.teacherCount.toLocaleString('id-ID')}
                                      </td>
                                    )}
                                    {isColVisible('ratio') && (
                                      <td className="py-2.5 px-3 text-right text-[#25A9A1] font-semibold">
                                        {district.ratio.toFixed(1).replace('.', ',')}
                                      </td>
                                    )}
                                    {isColVisible('accreditation') && (
                                      <td className="py-2.5 px-3 text-center">
                                        {getAccreditationBadge(district.accreditation)}
                                      </td>
                                    )}
                                    {isColVisible('actions') && (
                                      <td className="py-2.5 px-3 text-center text-gray-400">
                                        <button
                                          type="button"
                                          data-testid={`btn-detail-dist-${district.id}`}
                                          onClick={() =>
                                            setDetailModalItem({
                                              title: district.name,
                                              level: 'Kota/Kabupaten',
                                              schoolCount: district.schoolCount,
                                              studentCount: district.studentCount,
                                              teacherCount: district.teacherCount,
                                              ratio: district.ratio,
                                              accreditation: district.accreditation,
                                              address: `${district.name}, ${province.name}`,
                                            })
                                          }
                                          className="p-1 hover:text-[#172B4D] cursor-pointer"
                                          title="Lihat Detail Kota"
                                        >
                                          <MoreHorizontal className="w-4 h-4 mx-auto" />
                                        </button>
                                      </td>
                                    )}
                                  </tr>

                                  {/* Leaf Schools (if district expanded) */}
                                  {isDistExpanded &&
                                    district.schools?.map((school) => (
                                      <tr
                                        key={school.id}
                                        data-testid={`row-school-${school.id}`}
                                        className={`bg-[#FAFBFD] hover:bg-[#F1F5F9] transition-colors ${
                                          selectedRows[school.id] ? 'bg-teal-50/40' : ''
                                        }`}
                                      >
                                        <td className="py-2 px-3 text-center">
                                          <input
                                            type="checkbox"
                                            checked={!!selectedRows[school.id]}
                                            onChange={() => toggleSelectRow(school.id)}
                                            className="rounded text-[#25A9A1] focus:ring-0 cursor-pointer"
                                          />
                                        </td>
                                        <td className="py-2 px-3 pl-14">
                                          <div
                                            onClick={() =>
                                              setDetailModalItem({
                                                title: school.name,
                                                level: school.level,
                                                status: school.status,
                                                schoolCount: school.schoolCount,
                                                studentCount: school.studentCount,
                                                teacherCount: school.teacherCount,
                                                ratio: school.ratio,
                                                accreditation: school.accreditation,
                                                address: school.address,
                                                headmaster: school.headmaster,
                                              })
                                            }
                                            className="flex items-center gap-2 cursor-pointer hover:text-[#25A9A1]"
                                          >
                                            <div className="p-1 rounded bg-blue-50 text-blue-600 shrink-0">
                                              <School className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="font-semibold text-[#172B4D]">
                                              {school.name}
                                            </span>
                                          </div>
                                        </td>
                                        {isColVisible('level') && (
                                          <td className="py-2 px-3">
                                            {getLevelBadge(school.level)}
                                          </td>
                                        )}
                                        {isColVisible('schools') && (
                                          <td className="py-2 px-3 text-right font-medium">
                                            {school.schoolCount}
                                          </td>
                                        )}
                                        {isColVisible('students') && (
                                          <td className="py-2 px-3 text-right font-medium">
                                            {school.studentCount.toLocaleString('id-ID')}
                                          </td>
                                        )}
                                        {isColVisible('teachers') && (
                                          <td className="py-2 px-3 text-right font-medium">
                                            {school.teacherCount.toLocaleString('id-ID')}
                                          </td>
                                        )}
                                        {isColVisible('ratio') && (
                                          <td className="py-2 px-3 text-right font-bold text-[#25A9A1]">
                                            {school.ratio.toFixed(1).replace('.', ',')}
                                          </td>
                                        )}
                                        {isColVisible('accreditation') && (
                                          <td className="py-2 px-3 text-center font-bold">
                                            {getAccreditationBadge(school.accreditation)}
                                          </td>
                                        )}
                                        {isColVisible('actions') && (
                                          <td className="py-2 px-3 text-center text-gray-400">
                                            <button
                                              type="button"
                                              data-testid={`btn-detail-school-${school.id}`}
                                              onClick={() =>
                                                setDetailModalItem({
                                                  title: school.name,
                                                  level: school.level,
                                                  status: school.status,
                                                  schoolCount: school.schoolCount,
                                                  studentCount: school.studentCount,
                                                  teacherCount: school.teacherCount,
                                                  ratio: school.ratio,
                                                  accreditation: school.accreditation,
                                                  address: school.address,
                                                  headmaster: school.headmaster,
                                                })
                                              }
                                              className="cursor-pointer hover:text-gray-700 p-1"
                                              title="Lihat Detail Sekolah"
                                            >
                                              ⋮
                                            </button>
                                          </td>
                                        )}
                                      </tr>
                                    ))}
                                </React.Fragment>
                              );
                            })}
                        </React.Fragment>
                      );
                    })
                  )}

                  {/* Summary Aggregation Total Row */}
                  <tr className="bg-[#F8FAFC] font-bold text-[#172B4D] border-t-2 border-[#DCE5EF]">
                    <td className="py-3 px-3 text-center"></td>
                    <td className="py-3 px-3 font-bold">
                      Total ({filteredData.length} Provinsi Terfilter)
                    </td>
                    {isColVisible('level') && (
                      <td className="py-3 px-3 font-normal text-gray-500">Semua Jenjang</td>
                    )}
                    {isColVisible('schools') && (
                      <td className="py-3 px-3 text-right font-bold">
                        {totalStats.totalSch.toLocaleString('id-ID')}
                      </td>
                    )}
                    {isColVisible('students') && (
                      <td className="py-3 px-3 text-right font-bold">
                        {totalStats.totalStu.toLocaleString('id-ID')}
                      </td>
                    )}
                    {isColVisible('teachers') && (
                      <td className="py-3 px-3 text-right font-bold">
                        {totalStats.totalTea.toLocaleString('id-ID')}
                      </td>
                    )}
                    {isColVisible('ratio') && (
                      <td className="py-3 px-3 text-right font-bold text-[#25A9A1]">
                        {totalStats.avgRatio}
                      </td>
                    )}
                    {isColVisible('accreditation') && (
                      <td className="py-3 px-3 text-center font-normal">
                        {getAccreditationBadge('A:38% B:46% C:16%')}
                      </td>
                    )}
                    {isColVisible('actions') && <td className="py-3 px-3 text-center"></td>}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-[#FAFBFD] border-t border-[#DCE5EF] text-xs text-[#526579]">
              <div data-testid="grid-pagination-info">
                Menampilkan {totalProvinces === 0 ? 0 : startIndex + 1}–{endIndex} dari{' '}
                {totalProvinces} data (dikelompokkan per provinsi)
              </div>

              {/* Page Buttons */}
              <div className="flex items-center gap-1 font-semibold">
                <button
                  type="button"
                  data-testid="btn-grid-prev"
                  disabled={validCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={`px-2 py-1 rounded border border-[#DCE5EF] transition-colors ${
                    validCurrentPage <= 1
                      ? 'text-gray-300 cursor-not-allowed bg-slate-50'
                      : 'hover:bg-white text-[#172B4D] cursor-pointer'
                  }`}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    data-testid={`btn-grid-page-${page}`}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                      validCurrentPage === page
                        ? 'bg-[#25A9A1] text-white shadow-xs'
                        : 'border border-[#DCE5EF] text-[#172B4D] hover:bg-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  data-testid="btn-grid-next"
                  disabled={validCurrentPage >= totalPages || totalProvinces === 0}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={`px-2 py-1 rounded border border-[#DCE5EF] transition-colors ${
                    validCurrentPage >= totalPages || totalProvinces === 0
                      ? 'text-gray-300 cursor-not-allowed bg-slate-50'
                      : 'hover:bg-white text-[#172B4D] cursor-pointer'
                  }`}
                >
                  ›
                </button>
              </div>

              {/* Rows Per Page Dropdown */}
              <div className="flex items-center gap-1.5">
                <span>Baris per halaman:</span>
                <select
                  data-testid="select-grid-page-size"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-[#DCE5EF] rounded px-2 py-1 font-semibold text-[#172B4D] outline-none cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Drawer: Atur Kolom (Column Customization) */}
          {showColumnDrawer && (
            <div
              data-testid="column-customization-drawer"
              className="w-64 bg-white border border-[#DCE5EF] rounded-xl p-4 shadow-xs shrink-0 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F4F8]">
                <h4 className="text-xs font-bold text-[#172B4D] flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-[#25A9A1]" />
                  Atur Kolom
                </h4>
                <button
                  type="button"
                  data-testid="btn-close-column-drawer"
                  onClick={() => setShowColumnDrawer(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                  title="Tutup Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Columns inside Drawer */}
              <div>
                <div className="flex items-center bg-[#F5F8FC] border border-[#DCE5EF] rounded-lg px-2.5 py-1.5 text-xs">
                  <Search className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />
                  <input
                    type="text"
                    data-testid="input-search-columns"
                    value={columnSearch}
                    onChange={(e) => setColumnSearch(e.target.value)}
                    placeholder="Cari kolom..."
                    className="bg-transparent border-none outline-none text-[#172B4D] w-full text-xs"
                  />
                  {columnSearch && (
                    <button
                      type="button"
                      onClick={() => setColumnSearch('')}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Columns Checkbox List */}
              <div className="space-y-1.5 max-h-[440px] overflow-y-auto pr-1">
                {columns
                  .filter((col) =>
                    col.label.toLowerCase().includes(columnSearch.toLowerCase().trim()),
                  )
                  .map((col) => (
                    <div
                      key={col.id}
                      className="flex items-center justify-between p-1.5 rounded hover:bg-gray-50 text-xs text-[#172B4D]"
                    >
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          data-testid={`checkbox-col-${col.id}`}
                          checked={col.checked}
                          disabled={col.fixed}
                          onChange={() => toggleColumnCheck(col.id)}
                          className="rounded text-[#25A9A1] focus:ring-0 cursor-pointer disabled:opacity-50"
                        />
                        <span className={col.fixed ? 'font-bold' : ''}>{col.label}</span>
                      </label>
                      {col.fixed ? (
                        <span className="text-[10px] text-gray-400 italic">Fixed</span>
                      ) : (
                        <GripVertical className="w-3.5 h-3.5 text-gray-400 cursor-grab" />
                      )}
                    </div>
                  ))}
              </div>

              {/* Reset Columns button */}
              <div className="pt-2 border-t border-[#F0F4F8]">
                <button
                  type="button"
                  data-testid="btn-reset-columns"
                  onClick={() => {
                    setColumns((prev) => prev.map((c) => ({ ...c, checked: true })));
                    showNotification('Seluruh kolom dikembalikan ke posisi aktif.');
                  }}
                  className="w-full py-1 text-center text-xs font-semibold text-[#25A9A1] hover:underline cursor-pointer"
                >
                  Aktifkan Semua Kolom
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Item Detail Modal */}
      {detailModalItem && (
        <div
          data-testid="grid-detail-modal"
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4"
          onClick={() => setDetailModalItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-[#DCE5EF]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#F1F5F9] pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6F8F6] text-[#0D9488]">
                    {detailModalItem.level}
                  </span>
                  {detailModalItem.status && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7]">
                      {detailModalItem.status}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200 bg-emerald-50 text-[#059669]">
                    Akreditasi {detailModalItem.accreditation}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#172B4D] font-heading">
                  {detailModalItem.title}
                </h3>
              </div>
              <button
                type="button"
                data-testid="btn-close-grid-modal"
                onClick={() => setDetailModalItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Info */}
            <div className="space-y-3 text-xs">
              {detailModalItem.address && (
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#DCE5EF]">
                  <p className="font-semibold text-[#172B4D]">Alamat / Lokasi</p>
                  <p className="text-gray-500 mt-0.5">{detailModalItem.address}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-[#DCE5EF]">
                  <p className="text-gray-400 text-[10px] font-semibold">Jumlah Sekolah</p>
                  <p className="text-base font-bold text-[#172B4D] mt-0.5">
                    {typeof detailModalItem.schoolCount === 'number'
                      ? detailModalItem.schoolCount.toLocaleString('id-ID')
                      : detailModalItem.schoolCount}
                  </p>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-[#DCE5EF]">
                  <p className="text-gray-400 text-[10px] font-semibold">Jumlah Siswa</p>
                  <p className="text-base font-bold text-[#172B4D] mt-0.5">
                    {typeof detailModalItem.studentCount === 'number'
                      ? detailModalItem.studentCount.toLocaleString('id-ID')
                      : detailModalItem.studentCount}
                  </p>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-[#DCE5EF]">
                  <p className="text-gray-400 text-[10px] font-semibold">Rasio Siswa:Guru</p>
                  <p className="text-base font-bold text-[#25A9A1] mt-0.5">
                    1 :{' '}
                    {typeof detailModalItem.ratio === 'number'
                      ? detailModalItem.ratio.toFixed(1).replace('.', ',')
                      : detailModalItem.ratio}
                  </p>
                </div>
              </div>

              {detailModalItem.headmaster && (
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#DCE5EF] flex items-center justify-between">
                  <span className="text-gray-500">Kepala Sekolah / Pimpinan:</span>
                  <span className="font-bold text-[#172B4D]">{detailModalItem.headmaster}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#172B4D] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
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

export default AdvancedDataGridPage;
