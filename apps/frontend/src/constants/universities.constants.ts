export interface UniversityItem {
  id: string;
  name: string;
  shortName: string;
  type: 'PTN-BH' | 'PTN-BLU' | 'PTS';
  province: string;
  city: string;
  accreditation: 'Unggul' | 'A' | 'Baik Sekali' | 'B';
  totalStudents: number;
  totalLecturers: number;
  facultiesCount: number;
}

export const UNIVERSITIES_SNAPSHOT_DATA: UniversityItem[] = [
  {
    id: 'univ-001',
    name: 'Universitas Indonesia',
    shortName: 'UI',
    type: 'PTN-BH',
    province: 'Jawa Barat',
    city: 'Kota Depok',
    accreditation: 'Unggul',
    totalStudents: 47200,
    totalLecturers: 2350,
    facultiesCount: 14,
  },
  {
    id: 'univ-002',
    name: 'Institut Teknologi Bandung',
    shortName: 'ITB',
    type: 'PTN-BH',
    province: 'Jawa Barat',
    city: 'Kota Bandung',
    accreditation: 'Unggul',
    totalStudents: 26800,
    totalLecturers: 1420,
    facultiesCount: 12,
  },
  {
    id: 'univ-003',
    name: 'Universitas Gadjah Mada',
    shortName: 'UGM',
    type: 'PTN-BH',
    province: 'D.I. Yogyakarta',
    city: 'Kab. Sleman',
    accreditation: 'Unggul',
    totalStudents: 52400,
    totalLecturers: 2610,
    facultiesCount: 18,
  },
  {
    id: 'univ-004',
    name: 'Institut Teknologi Sepuluh Nopember',
    shortName: 'ITS',
    type: 'PTN-BH',
    province: 'Jawa Timur',
    city: 'Kota Surabaya',
    accreditation: 'Unggul',
    totalStudents: 25100,
    totalLecturers: 1290,
    facultiesCount: 8,
  },
  {
    id: 'univ-005',
    name: 'Universitas Airlangga',
    shortName: 'UNAIR',
    type: 'PTN-BH',
    province: 'Jawa Timur',
    city: 'Kota Surabaya',
    accreditation: 'Unggul',
    totalStudents: 38900,
    totalLecturers: 1780,
    facultiesCount: 16,
  },
  {
    id: 'univ-006',
    name: 'Universitas Diponegoro',
    shortName: 'UNDIP',
    type: 'PTN-BH',
    province: 'Jawa Tengah',
    city: 'Kota Semarang',
    accreditation: 'Unggul',
    totalStudents: 46500,
    totalLecturers: 1950,
    facultiesCount: 11,
  },
  {
    id: 'univ-007',
    name: 'Universitas Padjadjaran',
    shortName: 'UNPAD',
    type: 'PTN-BH',
    province: 'Jawa Barat',
    city: 'Kab. Sumedang',
    accreditation: 'Unggul',
    totalStudents: 41200,
    totalLecturers: 1860,
    facultiesCount: 16,
  },
  {
    id: 'univ-008',
    name: 'Universitas Hasanuddin',
    shortName: 'UNHAS',
    type: 'PTN-BH',
    province: 'Sulawesi Selatan',
    city: 'Kota Makassar',
    accreditation: 'Unggul',
    totalStudents: 39400,
    totalLecturers: 1620,
    facultiesCount: 15,
  },
];
