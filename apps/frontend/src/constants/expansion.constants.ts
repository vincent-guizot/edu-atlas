/**
 * EduAtlas v1.2.0 Expansion Constants
 * Fallback Snapshot Data for 5 New Executive Features
 * 1. Simulator Proyeksi Kebijakan (/simulator)
 * 2. Policy Brief & Research Studio (/policy-brief)
 * 3. Studio Disparitas & Intervensi 3T (/equity-studio)
 * 4. Transparansi & Efisiensi Anggaran (/budget-analytics)
 * 5. Komparator Institusi Head-to-Head (/comparator)
 */

export interface RegencyItem {
  regencyId: string;
  regencyName: string;
  type: string;
  provinceId: string;
  provinceName: string;
  islandGroup: string;
  is3T: boolean;
  ipmScore: number;
  povertyRate: number;
  studentCount: number;
  teacherCount: number;
  studentTeacherRatio: number;
  facilityScore: number;
  annualBudgetPerStudent: number;
  priorityIntervention: string;
}

export interface Disparity3TSnapshot {
  generated_at: string;
  summary: {
    totalRegencies: number;
    total3TRegencies: number;
    totalNon3TRegencies: number;
    percentage3T: number;
    kmeansClusters: Record<string, number>;
  };
  spm5Pillars: Array<{
    pillar: string;
    standardMin: number;
    scoreNon3T: number;
    score3T: number;
    gap: number;
  }>;
  islandComparison: Array<{
    island: string;
    regencies: number;
    ratio3T: number;
    avgIpm: number;
    avgStr: number;
    facilityIndex: number;
  }>;
  regencies: RegencyItem[];
}

export interface ProvinceBudgetItem {
  provinceId: string;
  provinceName: string;
  islandGroup: string;
  apbdEducationPct: number;
  totalEducationBudgetTrillion: number;
  spendingPerStudent: number;
  bosAbsorptionRate: number;
  dakFisikAbsorptionRate: number;
  ipmEducation: number;
  efficiencyStatus: string;
}

export interface BudgetEfficiencySnapshot {
  generated_at: string;
  nationalBudgetSummary: {
    nationalEducationBudgetTrillion: number;
    avgApbdEducationPct: number;
    avgSpendingPerStudentNational: number;
    nationalBosAbsorptionRate: number;
    nationalDakFisikAbsorptionRate: number;
    fundingComponents: Array<{
      name: string;
      allocationTrillion: number;
      sharePct: number;
    }>;
  };
  provinces: ProvinceBudgetItem[];
}

export interface ForecastingBaselineSnapshot {
  generated_at: string;
  baselineYear: number;
  projectionEndYear: number;
  nationalBaseline: {
    totalStudents: number;
    totalTeachers: number;
    currentStr: number;
    targetStrStandard: number;
    annualRetirementCohortAvg: number;
    annualNewClassroomCostRp: number;
    annualTeacherSalaryStandardRp: number;
  };
  islandBaselines: Array<{
    island: string;
    students: number;
    teachers: number;
    str: number;
    annualRetirement: number;
  }>;
  defaultParameters: {
    annualTeacherRetirementRate: number;
    annualPppkRecruitmentQuota: number;
    annualStudentGrowthRate: number;
    targetStrNational: number;
    inflationBOSCost: number;
  };
}

export interface PolicyBriefItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  targetAgencies: string[];
  status: string;
  date: string;
  author: string;
  executiveSummary: string;
  keyEvidence: Array<{ label: string; value: string }>;
  rootCauses: string[];
  shortTermActions: string[];
  mediumTermActions: string[];
}

export const DISPARITY_3T_SNAPSHOT: Disparity3TSnapshot = {
  "generated_at": "2026-11-22",
  "summary": {
    "totalRegencies": 514,
    "total3TRegencies": 132,
    "totalNon3TRegencies": 382,
    "percentage3T": 25.7,
    "kmeansClusters": {
      "Tier 1: Unggul & Fasilitas Memadai": 99,
      "Tier 2: Berkembang (Standar Nasional)": 114,
      "Tier 3: Butuh Dukungan / Intervensi": 87
    }
  },
  "spm5Pillars": [
    {
      "pillar": "Kualifikasi Guru S1/Gr",
      "standardMin": 90.0,
      "scoreNon3T": 88.5,
      "score3T": 54.2,
      "gap": 34.3
    },
    {
      "pillar": "Kelayakan Ruang Kelas",
      "standardMin": 85.0,
      "scoreNon3T": 82.1,
      "score3T": 49.8,
      "gap": 32.3
    },
    {
      "pillar": "Akses Air Bersih & Sanitasi",
      "standardMin": 100.0,
      "scoreNon3T": 91.4,
      "score3T": 42.0,
      "gap": 49.4
    },
    {
      "pillar": "Koneksi Listrik & Internet",
      "standardMin": 95.0,
      "scoreNon3T": 89.2,
      "score3T": 38.6,
      "gap": 50.6
    },
    {
      "pillar": "Kelengkapan Lab & Perpustakaan",
      "standardMin": 80.0,
      "scoreNon3T": 76.5,
      "score3T": 33.1,
      "gap": 43.4
    }
  ],
  "islandComparison": [
    {
      "island": "Jawa",
      "regencies": 118,
      "ratio3T": 0.0,
      "avgIpm": 76.1,
      "avgStr": 17.6,
      "facilityIndex": 84.5
    },
    {
      "island": "Sumatera",
      "regencies": 154,
      "ratio3T": 8.4,
      "avgIpm": 73.1,
      "avgStr": 18.2,
      "facilityIndex": 76.2
    },
    {
      "island": "Bali & Nusa Tenggara",
      "regencies": 41,
      "ratio3T": 39.0,
      "avgIpm": 71.3,
      "avgStr": 19.8,
      "facilityIndex": 68.4
    },
    {
      "island": "Kalimantan",
      "regencies": 56,
      "ratio3T": 14.3,
      "avgIpm": 73.1,
      "avgStr": 18.9,
      "facilityIndex": 74.0
    },
    {
      "island": "Sulawesi",
      "regencies": 81,
      "ratio3T": 17.3,
      "avgIpm": 71.6,
      "avgStr": 19.4,
      "facilityIndex": 71.8
    },
    {
      "island": "Maluku & Papua",
      "regencies": 64,
      "ratio3T": 71.9,
      "avgIpm": 63.8,
      "avgStr": 25.4,
      "facilityIndex": 51.2
    }
  ],
  "regencies": [
    {
      "regencyId": "REG-001",
      "regencyName": "Kota Aceh Pusat",
      "type": "Kota",
      "provinceId": "ID-AC",
      "provinceName": "Aceh",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 73.28,
      "povertyRate": 9.57,
      "studentCount": 87072,
      "teacherCount": 4947,
      "studentTeacherRatio": 17.6,
      "facilityScore": 73.6,
      "annualBudgetPerStudent": 4448747,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-002",
      "regencyName": "Kota Aceh 2",
      "type": "Kota",
      "provinceId": "ID-AC",
      "provinceName": "Aceh",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 70.94,
      "povertyRate": 12.0,
      "studentCount": 150998,
      "teacherCount": 9648,
      "studentTeacherRatio": 15.65,
      "facilityScore": 91.8,
      "annualBudgetPerStudent": 3209892,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-003",
      "regencyName": "Kabupaten Aceh Wilayah 3",
      "type": "Kabupaten",
      "provinceId": "ID-AC",
      "provinceName": "Aceh",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 76.22,
      "povertyRate": 5.54,
      "studentCount": 72430,
      "teacherCount": 4446,
      "studentTeacherRatio": 16.29,
      "facilityScore": 71.4,
      "annualBudgetPerStudent": 4198416,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-004",
      "regencyName": "Kabupaten Aceh Wilayah 4",
      "type": "Kabupaten",
      "provinceId": "ID-AC",
      "provinceName": "Aceh",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 71.14,
      "povertyRate": 12.12,
      "studentCount": 71004,
      "teacherCount": 3912,
      "studentTeacherRatio": 18.15,
      "facilityScore": 88.3,
      "annualBudgetPerStudent": 3988913,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-005",
      "regencyName": "Kabupaten Aceh Wilayah 5",
      "type": "Kabupaten",
      "provinceId": "ID-AC",
      "provinceName": "Aceh",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 76.68,
      "povertyRate": 12.06,
      "studentCount": 36960,
      "teacherCount": 2016,
      "studentTeacherRatio": 18.33,
      "facilityScore": 90.1,
      "annualBudgetPerStudent": 3714315,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-006",
      "regencyName": "Kabupaten Aceh Wilayah 6",
      "type": "Kabupaten",
      "provinceId": "ID-AC",
      "provinceName": "Aceh",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 69.11,
      "povertyRate": 5.14,
      "studentCount": 51781,
      "teacherCount": 2904,
      "studentTeacherRatio": 17.83,
      "facilityScore": 82.7,
      "annualBudgetPerStudent": 2887760,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-007",
      "regencyName": "Kabupaten Aceh Wilayah 7",
      "type": "Kabupaten",
      "provinceId": "ID-AC",
      "provinceName": "Aceh",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 73.63,
      "povertyRate": 10.39,
      "studentCount": 62291,
      "teacherCount": 3472,
      "studentTeacherRatio": 17.94,
      "facilityScore": 74.3,
      "annualBudgetPerStudent": 3369851,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-008",
      "regencyName": "Kabupaten Aceh Wilayah 8",
      "type": "Kabupaten",
      "provinceId": "ID-AC",
      "provinceName": "Aceh",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 76.27,
      "povertyRate": 12.08,
      "studentCount": 36999,
      "teacherCount": 1940,
      "studentTeacherRatio": 19.07,
      "facilityScore": 83.4,
      "annualBudgetPerStudent": 3664337,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-009",
      "regencyName": "Kabupaten Aceh Wilayah 9",
      "type": "Kabupaten",
      "provinceId": "ID-AC",
      "provinceName": "Aceh",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 72.6,
      "povertyRate": 11.87,
      "studentCount": 53878,
      "teacherCount": 2989,
      "studentTeacherRatio": 18.02,
      "facilityScore": 88.7,
      "annualBudgetPerStudent": 3227300,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-010",
      "regencyName": "Kabupaten Aceh Wilayah 10",
      "type": "Kabupaten",
      "provinceId": "ID-AC",
      "provinceName": "Aceh",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 72.39,
      "povertyRate": 9.52,
      "studentCount": 69272,
      "teacherCount": 5001,
      "studentTeacherRatio": 13.85,
      "facilityScore": 80.9,
      "annualBudgetPerStudent": 4272997,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-011",
      "regencyName": "Kabupaten Aceh Wilayah 11",
      "type": "Kabupaten",
      "provinceId": "ID-AC",
      "provinceName": "Aceh",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 76.09,
      "povertyRate": 12.15,
      "studentCount": 49131,
      "teacherCount": 2617,
      "studentTeacherRatio": 18.77,
      "facilityScore": 86.0,
      "annualBudgetPerStudent": 3505217,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-012",
      "regencyName": "Kabupaten Aceh Wilayah 12",
      "type": "Kabupaten",
      "provinceId": "ID-AC",
      "provinceName": "Aceh",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 72.79,
      "povertyRate": 6.94,
      "studentCount": 19675,
      "teacherCount": 1365,
      "studentTeacherRatio": 14.41,
      "facilityScore": 71.3,
      "annualBudgetPerStudent": 3140230,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-013",
      "regencyName": "Kota Sumatera Utara Pusat",
      "type": "Kota",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 76.0,
      "povertyRate": 6.32,
      "studentCount": 154556,
      "teacherCount": 7995,
      "studentTeacherRatio": 19.33,
      "facilityScore": 89.3,
      "annualBudgetPerStudent": 3909070,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-014",
      "regencyName": "Kota Sumatera Utara 2",
      "type": "Kota",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 72.07,
      "povertyRate": 10.26,
      "studentCount": 146330,
      "teacherCount": 7309,
      "studentTeacherRatio": 20.02,
      "facilityScore": 79.5,
      "annualBudgetPerStudent": 4282163,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-015",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 3",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 74.14,
      "povertyRate": 7.8,
      "studentCount": 19788,
      "teacherCount": 1239,
      "studentTeacherRatio": 15.97,
      "facilityScore": 84.9,
      "annualBudgetPerStudent": 4001921,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-016",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 4",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 69.72,
      "povertyRate": 9.1,
      "studentCount": 57922,
      "teacherCount": 3334,
      "studentTeacherRatio": 17.37,
      "facilityScore": 73.5,
      "annualBudgetPerStudent": 4222794,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-017",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 5",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 71.73,
      "povertyRate": 6.35,
      "studentCount": 68391,
      "teacherCount": 3827,
      "studentTeacherRatio": 17.87,
      "facilityScore": 79.2,
      "annualBudgetPerStudent": 3118185,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-018",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 6",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 74.78,
      "povertyRate": 7.56,
      "studentCount": 17116,
      "teacherCount": 967,
      "studentTeacherRatio": 17.7,
      "facilityScore": 84.1,
      "annualBudgetPerStudent": 3413880,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-019",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 7",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 73.26,
      "povertyRate": 11.92,
      "studentCount": 76179,
      "teacherCount": 5051,
      "studentTeacherRatio": 15.08,
      "facilityScore": 76.7,
      "annualBudgetPerStudent": 3680130,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-020",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 8",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 74.17,
      "povertyRate": 5.87,
      "studentCount": 72424,
      "teacherCount": 3844,
      "studentTeacherRatio": 18.84,
      "facilityScore": 75.2,
      "annualBudgetPerStudent": 4426223,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-021",
      "regencyName": "Kabupaten Tojo Una-Una",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": true,
      "ipmScore": 66.74,
      "povertyRate": 24.16,
      "studentCount": 73888,
      "teacherCount": 2920,
      "studentTeacherRatio": 25.3,
      "facilityScore": 55.7,
      "annualBudgetPerStudent": 7398518,
      "priorityIntervention": "BOS Kinerja & Pelatihan Guru SPM"
    },
    {
      "regencyId": "REG-022",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 10",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 69.2,
      "povertyRate": 12.66,
      "studentCount": 50299,
      "teacherCount": 3114,
      "studentTeacherRatio": 16.15,
      "facilityScore": 84.1,
      "annualBudgetPerStudent": 3027367,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-023",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 11",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 68.32,
      "povertyRate": 12.01,
      "studentCount": 29872,
      "teacherCount": 1732,
      "studentTeacherRatio": 17.24,
      "facilityScore": 90.4,
      "annualBudgetPerStudent": 3959939,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-024",
      "regencyName": "Kabupaten Kepulauan Sula",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": true,
      "ipmScore": 68.36,
      "povertyRate": 35.1,
      "studentCount": 50407,
      "teacherCount": 1732,
      "studentTeacherRatio": 29.09,
      "facilityScore": 58.8,
      "annualBudgetPerStudent": 7572086,
      "priorityIntervention": "BOS Kinerja & Pelatihan Guru SPM"
    },
    {
      "regencyId": "REG-025",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 13",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 67.96,
      "povertyRate": 5.91,
      "studentCount": 83445,
      "teacherCount": 4191,
      "studentTeacherRatio": 19.91,
      "facilityScore": 84.3,
      "annualBudgetPerStudent": 4030536,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-026",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 14",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 75.15,
      "povertyRate": 4.7,
      "studentCount": 70350,
      "teacherCount": 4805,
      "studentTeacherRatio": 14.64,
      "facilityScore": 86.5,
      "annualBudgetPerStudent": 4095569,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-027",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 15",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 75.79,
      "povertyRate": 8.88,
      "studentCount": 71363,
      "teacherCount": 3918,
      "studentTeacherRatio": 18.21,
      "facilityScore": 86.6,
      "annualBudgetPerStudent": 2850115,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-028",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 16",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 75.72,
      "povertyRate": 5.47,
      "studentCount": 26893,
      "teacherCount": 1452,
      "studentTeacherRatio": 18.52,
      "facilityScore": 90.0,
      "annualBudgetPerStudent": 4060425,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-029",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 17",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 69.37,
      "povertyRate": 6.37,
      "studentCount": 20480,
      "teacherCount": 1180,
      "studentTeacherRatio": 17.35,
      "facilityScore": 90.1,
      "annualBudgetPerStudent": 3954950,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-030",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 18",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 76.94,
      "povertyRate": 5.06,
      "studentCount": 30919,
      "teacherCount": 1625,
      "studentTeacherRatio": 19.02,
      "facilityScore": 77.2,
      "annualBudgetPerStudent": 3903197,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-031",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 19",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 69.74,
      "povertyRate": 5.2,
      "studentCount": 74377,
      "teacherCount": 4102,
      "studentTeacherRatio": 18.13,
      "facilityScore": 77.9,
      "annualBudgetPerStudent": 3960596,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-032",
      "regencyName": "Kabupaten Boven Digoel",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": true,
      "ipmScore": 69.17,
      "povertyRate": 30.22,
      "studentCount": 81649,
      "teacherCount": 3595,
      "studentTeacherRatio": 22.71,
      "facilityScore": 56.3,
      "annualBudgetPerStudent": 5625743,
      "priorityIntervention": "BOS Kinerja & Pelatihan Guru SPM"
    },
    {
      "regencyId": "REG-033",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 21",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 71.78,
      "povertyRate": 7.14,
      "studentCount": 54351,
      "teacherCount": 3504,
      "studentTeacherRatio": 15.51,
      "facilityScore": 85.2,
      "annualBudgetPerStudent": 2814054,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-034",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 22",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 70.79,
      "povertyRate": 8.03,
      "studentCount": 68714,
      "teacherCount": 4360,
      "studentTeacherRatio": 15.76,
      "facilityScore": 86.6,
      "annualBudgetPerStudent": 2913145,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-035",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 23",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 68.34,
      "povertyRate": 11.74,
      "studentCount": 71063,
      "teacherCount": 3978,
      "studentTeacherRatio": 17.86,
      "facilityScore": 78.7,
      "annualBudgetPerStudent": 3147457,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-036",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 24",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 74.55,
      "povertyRate": 6.25,
      "studentCount": 20143,
      "teacherCount": 1359,
      "studentTeacherRatio": 14.82,
      "facilityScore": 91.3,
      "annualBudgetPerStudent": 4079385,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-037",
      "regencyName": "Kabupaten Sumatera Utara Wilayah 25",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 69.38,
      "povertyRate": 6.61,
      "studentCount": 57207,
      "teacherCount": 4068,
      "studentTeacherRatio": 14.06,
      "facilityScore": 74.9,
      "annualBudgetPerStudent": 3172101,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-038",
      "regencyName": "Kabupaten Lanny Jaya",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": true,
      "ipmScore": 69.4,
      "povertyRate": 27.41,
      "studentCount": 67945,
      "teacherCount": 2922,
      "studentTeacherRatio": 23.25,
      "facilityScore": 66.0,
      "annualBudgetPerStudent": 6389186,
      "priorityIntervention": "BOS Kinerja & Pelatihan Guru SPM"
    },
    {
      "regencyId": "REG-039",
      "regencyName": "Kabupaten Yalimo",
      "type": "Kabupaten",
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "is3T": true,
      "ipmScore": 66.9,
      "povertyRate": 26.83,
      "studentCount": 72910,
      "teacherCount": 2813,
      "studentTeacherRatio": 25.91,
      "facilityScore": 62.2,
      "annualBudgetPerStudent": 7362605,
      "priorityIntervention": "BOS Kinerja & Pelatihan Guru SPM"
    },
    {
      "regencyId": "REG-040",
      "regencyName": "Kota Sumatera Barat Pusat",
      "type": "Kota",
      "provinceId": "ID-SB",
      "provinceName": "Sumatera Barat",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 71.51,
      "povertyRate": 11.14,
      "studentCount": 56901,
      "teacherCount": 3294,
      "studentTeacherRatio": 17.27,
      "facilityScore": 85.3,
      "annualBudgetPerStudent": 2923836,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-041",
      "regencyName": "Kota Sumatera Barat 2",
      "type": "Kota",
      "provinceId": "ID-SB",
      "provinceName": "Sumatera Barat",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 75.09,
      "povertyRate": 8.28,
      "studentCount": 49419,
      "teacherCount": 3033,
      "studentTeacherRatio": 16.29,
      "facilityScore": 91.6,
      "annualBudgetPerStudent": 2881765,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-042",
      "regencyName": "Kabupaten Sumatera Barat Wilayah 3",
      "type": "Kabupaten",
      "provinceId": "ID-SB",
      "provinceName": "Sumatera Barat",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 72.54,
      "povertyRate": 8.84,
      "studentCount": 84442,
      "teacherCount": 4776,
      "studentTeacherRatio": 17.68,
      "facilityScore": 83.5,
      "annualBudgetPerStudent": 3923017,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-043",
      "regencyName": "Kabupaten Sumatera Barat Wilayah 4",
      "type": "Kabupaten",
      "provinceId": "ID-SB",
      "provinceName": "Sumatera Barat",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 69.1,
      "povertyRate": 13.83,
      "studentCount": 62147,
      "teacherCount": 3288,
      "studentTeacherRatio": 18.9,
      "facilityScore": 86.4,
      "annualBudgetPerStudent": 2864605,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-044",
      "regencyName": "Kabupaten Deiyai",
      "type": "Kabupaten",
      "provinceId": "ID-SB",
      "provinceName": "Sumatera Barat",
      "islandGroup": "Sumatera",
      "is3T": true,
      "ipmScore": 62.48,
      "povertyRate": 29.17,
      "studentCount": 26466,
      "teacherCount": 1083,
      "studentTeacherRatio": 24.42,
      "facilityScore": 63.4,
      "annualBudgetPerStudent": 6629763,
      "priorityIntervention": "BOS Kinerja & Pelatihan Guru SPM"
    },
    {
      "regencyId": "REG-045",
      "regencyName": "Kabupaten Sumatera Barat Wilayah 6",
      "type": "Kabupaten",
      "provinceId": "ID-SB",
      "provinceName": "Sumatera Barat",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 71.93,
      "povertyRate": 6.55,
      "studentCount": 72700,
      "teacherCount": 3699,
      "studentTeacherRatio": 19.65,
      "facilityScore": 75.9,
      "annualBudgetPerStudent": 3881981,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-046",
      "regencyName": "Kabupaten Tambrauw",
      "type": "Kabupaten",
      "provinceId": "ID-SB",
      "provinceName": "Sumatera Barat",
      "islandGroup": "Sumatera",
      "is3T": true,
      "ipmScore": 69.49,
      "povertyRate": 26.72,
      "studentCount": 25588,
      "teacherCount": 1098,
      "studentTeacherRatio": 23.3,
      "facilityScore": 47.3,
      "annualBudgetPerStudent": 8528710,
      "priorityIntervention": "BOS Afirmasi & DAK Fisik Prioritas 1"
    },
    {
      "regencyId": "REG-047",
      "regencyName": "Kabupaten Sumatera Barat Wilayah 8",
      "type": "Kabupaten",
      "provinceId": "ID-SB",
      "provinceName": "Sumatera Barat",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 69.83,
      "povertyRate": 4.92,
      "studentCount": 15158,
      "teacherCount": 999,
      "studentTeacherRatio": 15.16,
      "facilityScore": 77.7,
      "annualBudgetPerStudent": 3419839,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-048",
      "regencyName": "Kabupaten Sumatera Barat Wilayah 9",
      "type": "Kabupaten",
      "provinceId": "ID-SB",
      "provinceName": "Sumatera Barat",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 75.51,
      "povertyRate": 8.51,
      "studentCount": 51757,
      "teacherCount": 2593,
      "studentTeacherRatio": 19.96,
      "facilityScore": 86.1,
      "annualBudgetPerStudent": 3607344,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-049",
      "regencyName": "Kabupaten Sumatera Barat Wilayah 10",
      "type": "Kabupaten",
      "provinceId": "ID-SB",
      "provinceName": "Sumatera Barat",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 70.05,
      "povertyRate": 12.41,
      "studentCount": 64934,
      "teacherCount": 3230,
      "studentTeacherRatio": 20.1,
      "facilityScore": 81.7,
      "annualBudgetPerStudent": 4123838,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-050",
      "regencyName": "Kabupaten Sorong Selatan",
      "type": "Kabupaten",
      "provinceId": "ID-SB",
      "provinceName": "Sumatera Barat",
      "islandGroup": "Sumatera",
      "is3T": true,
      "ipmScore": 69.4,
      "povertyRate": 19.81,
      "studentCount": 53916,
      "teacherCount": 2119,
      "studentTeacherRatio": 25.44,
      "facilityScore": 64.8,
      "annualBudgetPerStudent": 8585777,
      "priorityIntervention": "BOS Kinerja & Pelatihan Guru SPM"
    },
    {
      "regencyId": "REG-051",
      "regencyName": "Kabupaten Sumatera Barat Wilayah 12",
      "type": "Kabupaten",
      "provinceId": "ID-SB",
      "provinceName": "Sumatera Barat",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 71.41,
      "povertyRate": 11.04,
      "studentCount": 59957,
      "teacherCount": 3467,
      "studentTeacherRatio": 17.29,
      "facilityScore": 83.0,
      "annualBudgetPerStudent": 3871924,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-052",
      "regencyName": "Kota Riau Pusat",
      "type": "Kota",
      "provinceId": "ID-RI",
      "provinceName": "Riau",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 68.85,
      "povertyRate": 7.56,
      "studentCount": 140777,
      "teacherCount": 7024,
      "studentTeacherRatio": 20.04,
      "facilityScore": 79.4,
      "annualBudgetPerStudent": 4573101,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-053",
      "regencyName": "Kota Riau 2",
      "type": "Kota",
      "provinceId": "ID-RI",
      "provinceName": "Riau",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 74.93,
      "povertyRate": 9.89,
      "studentCount": 64462,
      "teacherCount": 3996,
      "studentTeacherRatio": 16.13,
      "facilityScore": 81.4,
      "annualBudgetPerStudent": 2842051,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-054",
      "regencyName": "Kabupaten Nias Utara",
      "type": "Kabupaten",
      "provinceId": "ID-RI",
      "provinceName": "Riau",
      "islandGroup": "Sumatera",
      "is3T": true,
      "ipmScore": 62.4,
      "povertyRate": 30.5,
      "studentCount": 41853,
      "teacherCount": 1627,
      "studentTeacherRatio": 25.72,
      "facilityScore": 62.6,
      "annualBudgetPerStudent": 7011220,
      "priorityIntervention": "BOS Kinerja & Pelatihan Guru SPM"
    },
    {
      "regencyId": "REG-055",
      "regencyName": "Kabupaten Riau Wilayah 4",
      "type": "Kabupaten",
      "provinceId": "ID-RI",
      "provinceName": "Riau",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 72.58,
      "povertyRate": 8.8,
      "studentCount": 65116,
      "teacherCount": 4525,
      "studentTeacherRatio": 14.39,
      "facilityScore": 78.3,
      "annualBudgetPerStudent": 3576269,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-056",
      "regencyName": "Kabupaten Mentawai",
      "type": "Kabupaten",
      "provinceId": "ID-RI",
      "provinceName": "Riau",
      "islandGroup": "Sumatera",
      "is3T": true,
      "ipmScore": 63.81,
      "povertyRate": 22.53,
      "studentCount": 54743,
      "teacherCount": 1791,
      "studentTeacherRatio": 30.55,
      "facilityScore": 48.5,
      "annualBudgetPerStudent": 5571496,
      "priorityIntervention": "BOS Afirmasi & DAK Fisik Prioritas 1"
    },
    {
      "regencyId": "REG-057",
      "regencyName": "Kabupaten Riau Wilayah 6",
      "type": "Kabupaten",
      "provinceId": "ID-RI",
      "provinceName": "Riau",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 71.98,
      "povertyRate": 8.42,
      "studentCount": 50811,
      "teacherCount": 2808,
      "studentTeacherRatio": 18.09,
      "facilityScore": 81.1,
      "annualBudgetPerStudent": 4197783,
      "priorityIntervention": "Penguatan Digitalisasi & Vokasi"
    },
    {
      "regencyId": "REG-058",
      "regencyName": "Kabupaten Riau Wilayah 7",
      "type": "Kabupaten",
      "provinceId": "ID-RI",
      "provinceName": "Riau",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 75.19,
      "povertyRate": 9.74,
      "studentCount": 69321,
      "teacherCount": 4437,
      "studentTeacherRatio": 15.62,
      "facilityScore": 78.5,
      "annualBudgetPerStudent": 3576237,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-059",
      "regencyName": "Kabupaten Riau Wilayah 8",
      "type": "Kabupaten",
      "provinceId": "ID-RI",
      "provinceName": "Riau",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 76.17,
      "povertyRate": 5.47,
      "studentCount": 80439,
      "teacherCount": 5313,
      "studentTeacherRatio": 15.14,
      "facilityScore": 73.4,
      "annualBudgetPerStudent": 4200643,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    },
    {
      "regencyId": "REG-060",
      "regencyName": "Kabupaten Riau Wilayah 9",
      "type": "Kabupaten",
      "provinceId": "ID-RI",
      "provinceName": "Riau",
      "islandGroup": "Sumatera",
      "is3T": false,
      "ipmScore": 75.85,
      "povertyRate": 13.49,
      "studentCount": 18879,
      "teacherCount": 1057,
      "studentTeacherRatio": 17.85,
      "facilityScore": 71.0,
      "annualBudgetPerStudent": 4709400,
      "priorityIntervention": "Peningkatan Sarana Ruang Kelas"
    }
  ]
};

export const BUDGET_EFFICIENCY_SNAPSHOT: BudgetEfficiencySnapshot = {
  "generated_at": "2026-11-22",
  "nationalBudgetSummary": {
    "nationalEducationBudgetTrillion": 665.0,
    "avgApbdEducationPct": 21.8,
    "avgSpendingPerStudentNational": 5420000,
    "nationalBosAbsorptionRate": 96.8,
    "nationalDakFisikAbsorptionRate": 88.4,
    "fundingComponents": [
      {
        "name": "Dana Bantuan Operasional Satuan Pendidikan (BOSP/BOS)",
        "allocationTrillion": 59.4,
        "sharePct": 42.1
      },
      {
        "name": "Dana Alokasi Khusus (DAK Fisik & Non-Fisik Sarpras)",
        "allocationTrillion": 32.8,
        "sharePct": 23.3
      },
      {
        "name": "Gaji & Tunjangan Profesi Guru (TPG/PPPK)",
        "allocationTrillion": 36.2,
        "sharePct": 25.7
      },
      {
        "name": "Kartu Indonesia Pintar (KIP Kuliah & PIP)",
        "allocationTrillion": 12.6,
        "sharePct": 8.9
      }
    ]
  },
  "provinces": [
    {
      "provinceId": "ID-AC",
      "provinceName": "Aceh",
      "islandGroup": "Sumatera",
      "apbdEducationPct": 21.6,
      "totalEducationBudgetTrillion": 0.83,
      "spendingPerStudent": 6393743,
      "bosAbsorptionRate": 97.7,
      "dakFisikAbsorptionRate": 91.2,
      "ipmEducation": 73.1,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-SU",
      "provinceName": "Sumatera Utara",
      "islandGroup": "Sumatera",
      "apbdEducationPct": 26.0,
      "totalEducationBudgetTrillion": 1.57,
      "spendingPerStudent": 4195766,
      "bosAbsorptionRate": 95.3,
      "dakFisikAbsorptionRate": 95.0,
      "ipmEducation": 73.8,
      "efficiencyStatus": "Butuh Intervensi Fiskal (Biaya Rendah, Output Rendah)"
    },
    {
      "provinceId": "ID-SB",
      "provinceName": "Sumatera Barat",
      "islandGroup": "Sumatera",
      "apbdEducationPct": 21.4,
      "totalEducationBudgetTrillion": 0.69,
      "spendingPerStudent": 4477741,
      "bosAbsorptionRate": 98.8,
      "dakFisikAbsorptionRate": 80.4,
      "ipmEducation": 74.2,
      "efficiencyStatus": "Sangat Efisien (Output Tinggi, Biaya Terkendali)"
    },
    {
      "provinceId": "ID-RI",
      "provinceName": "Riau",
      "islandGroup": "Sumatera",
      "apbdEducationPct": 23.7,
      "totalEducationBudgetTrillion": 1.06,
      "spendingPerStudent": 4324287,
      "bosAbsorptionRate": 93.3,
      "dakFisikAbsorptionRate": 90.9,
      "ipmEducation": 74.5,
      "efficiencyStatus": "Sangat Efisien (Output Tinggi, Biaya Terkendali)"
    },
    {
      "provinceId": "ID-JA",
      "provinceName": "Jambi",
      "islandGroup": "Sumatera",
      "apbdEducationPct": 24.0,
      "totalEducationBudgetTrillion": 0.57,
      "spendingPerStudent": 4943915,
      "bosAbsorptionRate": 99.4,
      "dakFisikAbsorptionRate": 78.8,
      "ipmEducation": 72.8,
      "efficiencyStatus": "Butuh Intervensi Fiskal (Biaya Rendah, Output Rendah)"
    },
    {
      "provinceId": "ID-SS",
      "provinceName": "Sumatera Selatan",
      "islandGroup": "Sumatera",
      "apbdEducationPct": 24.7,
      "totalEducationBudgetTrillion": 1.09,
      "spendingPerStudent": 5704601,
      "bosAbsorptionRate": 97.5,
      "dakFisikAbsorptionRate": 95.4,
      "ipmEducation": 71.9,
      "efficiencyStatus": "Butuh Intervensi Fiskal (Biaya Rendah, Output Rendah)"
    },
    {
      "provinceId": "ID-BE",
      "provinceName": "Bengkulu",
      "islandGroup": "Sumatera",
      "apbdEducationPct": 24.2,
      "totalEducationBudgetTrillion": 0.45,
      "spendingPerStudent": 6129154,
      "bosAbsorptionRate": 97.0,
      "dakFisikAbsorptionRate": 86.7,
      "ipmEducation": 72.5,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-LA",
      "provinceName": "Lampung",
      "islandGroup": "Sumatera",
      "apbdEducationPct": 24.4,
      "totalEducationBudgetTrillion": 0.95,
      "spendingPerStudent": 6327422,
      "bosAbsorptionRate": 93.1,
      "dakFisikAbsorptionRate": 81.0,
      "ipmEducation": 71.1,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-BB",
      "provinceName": "Kepulauan Bangka Belitung",
      "islandGroup": "Sumatera",
      "apbdEducationPct": 21.0,
      "totalEducationBudgetTrillion": 0.39,
      "spendingPerStudent": 6228709,
      "bosAbsorptionRate": 96.0,
      "dakFisikAbsorptionRate": 93.2,
      "ipmEducation": 73.3,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-KR",
      "provinceName": "Kepulauan Riau",
      "islandGroup": "Sumatera",
      "apbdEducationPct": 25.8,
      "totalEducationBudgetTrillion": 0.62,
      "spendingPerStudent": 5581329,
      "bosAbsorptionRate": 98.0,
      "dakFisikAbsorptionRate": 96.3,
      "ipmEducation": 77.2,
      "efficiencyStatus": "Sangat Efisien (Output Tinggi, Biaya Terkendali)"
    },
    {
      "provinceId": "ID-JK",
      "provinceName": "DKI Jakarta",
      "islandGroup": "Jawa",
      "apbdEducationPct": 26.5,
      "totalEducationBudgetTrillion": 4.61,
      "spendingPerStudent": 8043363,
      "bosAbsorptionRate": 94.7,
      "dakFisikAbsorptionRate": 83.1,
      "ipmEducation": 82.4,
      "efficiencyStatus": "Investasi Strategis (Output Tinggi, Biaya Tinggi)"
    },
    {
      "provinceId": "ID-JB",
      "provinceName": "Jawa Barat",
      "islandGroup": "Jawa",
      "apbdEducationPct": 21.1,
      "totalEducationBudgetTrillion": 2.97,
      "spendingPerStudent": 6523678,
      "bosAbsorptionRate": 98.1,
      "dakFisikAbsorptionRate": 87.8,
      "ipmEducation": 73.7,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-JT",
      "provinceName": "Jawa Tengah",
      "islandGroup": "Jawa",
      "apbdEducationPct": 23.2,
      "totalEducationBudgetTrillion": 2.63,
      "spendingPerStudent": 7340371,
      "bosAbsorptionRate": 97.4,
      "dakFisikAbsorptionRate": 87.5,
      "ipmEducation": 73.4,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-YO",
      "provinceName": "DI Yogyakarta",
      "islandGroup": "Jawa",
      "apbdEducationPct": 24.9,
      "totalEducationBudgetTrillion": 0.8,
      "spendingPerStudent": 7654491,
      "bosAbsorptionRate": 99.3,
      "dakFisikAbsorptionRate": 89.5,
      "ipmEducation": 81.1,
      "efficiencyStatus": "Investasi Strategis (Output Tinggi, Biaya Tinggi)"
    },
    {
      "provinceId": "ID-JI",
      "provinceName": "Jawa Timur",
      "islandGroup": "Jawa",
      "apbdEducationPct": 20.3,
      "totalEducationBudgetTrillion": 2.35,
      "spendingPerStudent": 5130704,
      "bosAbsorptionRate": 97.5,
      "dakFisikAbsorptionRate": 82.7,
      "ipmEducation": 74.1,
      "efficiencyStatus": "Sangat Efisien (Output Tinggi, Biaya Terkendali)"
    },
    {
      "provinceId": "ID-BT",
      "provinceName": "Banten",
      "islandGroup": "Jawa",
      "apbdEducationPct": 21.9,
      "totalEducationBudgetTrillion": 1.24,
      "spendingPerStudent": 9127348,
      "bosAbsorptionRate": 93.0,
      "dakFisikAbsorptionRate": 93.9,
      "ipmEducation": 73.9,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-BA",
      "provinceName": "Bali",
      "islandGroup": "Bali & Nusa Tenggara",
      "apbdEducationPct": 26.6,
      "totalEducationBudgetTrillion": 0.76,
      "spendingPerStudent": 3620551,
      "bosAbsorptionRate": 95.6,
      "dakFisikAbsorptionRate": 93.5,
      "ipmEducation": 76.8,
      "efficiencyStatus": "Sangat Efisien (Output Tinggi, Biaya Terkendali)"
    },
    {
      "provinceId": "ID-NB",
      "provinceName": "Nusa Tenggara Barat",
      "islandGroup": "Bali & Nusa Tenggara",
      "apbdEducationPct": 23.2,
      "totalEducationBudgetTrillion": 0.62,
      "spendingPerStudent": 5283558,
      "bosAbsorptionRate": 94.3,
      "dakFisikAbsorptionRate": 81.7,
      "ipmEducation": 70.2,
      "efficiencyStatus": "Butuh Intervensi Fiskal (Biaya Rendah, Output Rendah)"
    },
    {
      "provinceId": "ID-NT",
      "provinceName": "Nusa Tenggara Timur",
      "islandGroup": "Bali & Nusa Tenggara",
      "apbdEducationPct": 22.5,
      "totalEducationBudgetTrillion": 0.68,
      "spendingPerStudent": 5297124,
      "bosAbsorptionRate": 95.6,
      "dakFisikAbsorptionRate": 79.6,
      "ipmEducation": 66.8,
      "efficiencyStatus": "Butuh Intervensi Fiskal (Biaya Rendah, Output Rendah)"
    },
    {
      "provinceId": "ID-KB",
      "provinceName": "Kalimantan Barat",
      "islandGroup": "Kalimantan",
      "apbdEducationPct": 23.9,
      "totalEducationBudgetTrillion": 0.82,
      "spendingPerStudent": 4467305,
      "bosAbsorptionRate": 94.3,
      "dakFisikAbsorptionRate": 91.8,
      "ipmEducation": 69.7,
      "efficiencyStatus": "Butuh Intervensi Fiskal (Biaya Rendah, Output Rendah)"
    },
    {
      "provinceId": "ID-KT",
      "provinceName": "Kalimantan Tengah",
      "islandGroup": "Kalimantan",
      "apbdEducationPct": 21.5,
      "totalEducationBudgetTrillion": 0.52,
      "spendingPerStudent": 6503524,
      "bosAbsorptionRate": 93.3,
      "dakFisikAbsorptionRate": 84.8,
      "ipmEducation": 72.1,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-KS",
      "provinceName": "Kalimantan Selatan",
      "islandGroup": "Kalimantan",
      "apbdEducationPct": 22.5,
      "totalEducationBudgetTrillion": 0.66,
      "spendingPerStudent": 6295656,
      "bosAbsorptionRate": 98.0,
      "dakFisikAbsorptionRate": 84.8,
      "ipmEducation": 72.6,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-KI",
      "provinceName": "Kalimantan Timur",
      "islandGroup": "Kalimantan",
      "apbdEducationPct": 20.3,
      "totalEducationBudgetTrillion": 1.03,
      "spendingPerStudent": 5955428,
      "bosAbsorptionRate": 97.3,
      "dakFisikAbsorptionRate": 95.7,
      "ipmEducation": 78.2,
      "efficiencyStatus": "Sangat Efisien (Output Tinggi, Biaya Terkendali)"
    },
    {
      "provinceId": "ID-KU",
      "provinceName": "Kalimantan Utara",
      "islandGroup": "Kalimantan",
      "apbdEducationPct": 20.6,
      "totalEducationBudgetTrillion": 0.36,
      "spendingPerStudent": 6408867,
      "bosAbsorptionRate": 98.1,
      "dakFisikAbsorptionRate": 89.1,
      "ipmEducation": 72.9,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-SA",
      "provinceName": "Sulawesi Utara",
      "islandGroup": "Sulawesi",
      "apbdEducationPct": 26.3,
      "totalEducationBudgetTrillion": 0.67,
      "spendingPerStudent": 6635568,
      "bosAbsorptionRate": 99.2,
      "dakFisikAbsorptionRate": 86.4,
      "ipmEducation": 74.4,
      "efficiencyStatus": "Investasi Strategis (Output Tinggi, Biaya Tinggi)"
    },
    {
      "provinceId": "ID-ST",
      "provinceName": "Sulawesi Tengah",
      "islandGroup": "Sulawesi",
      "apbdEducationPct": 23.0,
      "totalEducationBudgetTrillion": 0.6,
      "spendingPerStudent": 4432022,
      "bosAbsorptionRate": 97.5,
      "dakFisikAbsorptionRate": 83.8,
      "ipmEducation": 70.9,
      "efficiencyStatus": "Butuh Intervensi Fiskal (Biaya Rendah, Output Rendah)"
    },
    {
      "provinceId": "ID-SN",
      "provinceName": "Sulawesi Selatan",
      "islandGroup": "Sulawesi",
      "apbdEducationPct": 20.7,
      "totalEducationBudgetTrillion": 1.34,
      "spendingPerStudent": 4355604,
      "bosAbsorptionRate": 95.3,
      "dakFisikAbsorptionRate": 81.5,
      "ipmEducation": 73.5,
      "efficiencyStatus": "Butuh Intervensi Fiskal (Biaya Rendah, Output Rendah)"
    },
    {
      "provinceId": "ID-SG",
      "provinceName": "Sulawesi Tenggara",
      "islandGroup": "Sulawesi",
      "apbdEducationPct": 26.4,
      "totalEducationBudgetTrillion": 0.64,
      "spendingPerStudent": 5607955,
      "bosAbsorptionRate": 94.2,
      "dakFisikAbsorptionRate": 80.5,
      "ipmEducation": 72.2,
      "efficiencyStatus": "Butuh Intervensi Fiskal (Biaya Rendah, Output Rendah)"
    },
    {
      "provinceId": "ID-GO",
      "provinceName": "Gorontalo",
      "islandGroup": "Sulawesi",
      "apbdEducationPct": 23.0,
      "totalEducationBudgetTrillion": 0.31,
      "spendingPerStudent": 4293898,
      "bosAbsorptionRate": 93.6,
      "dakFisikAbsorptionRate": 89.4,
      "ipmEducation": 70.8,
      "efficiencyStatus": "Butuh Intervensi Fiskal (Biaya Rendah, Output Rendah)"
    },
    {
      "provinceId": "ID-SR",
      "provinceName": "Sulawesi Barat",
      "islandGroup": "Sulawesi",
      "apbdEducationPct": 24.5,
      "totalEducationBudgetTrillion": 0.42,
      "spendingPerStudent": 3771246,
      "bosAbsorptionRate": 96.2,
      "dakFisikAbsorptionRate": 85.7,
      "ipmEducation": 67.9,
      "efficiencyStatus": "Butuh Intervensi Fiskal (Biaya Rendah, Output Rendah)"
    },
    {
      "provinceId": "ID-MA",
      "provinceName": "Maluku",
      "islandGroup": "Maluku & Papua",
      "apbdEducationPct": 24.7,
      "totalEducationBudgetTrillion": 0.51,
      "spendingPerStudent": 11493121,
      "bosAbsorptionRate": 93.9,
      "dakFisikAbsorptionRate": 93.6,
      "ipmEducation": 70.9,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-MU",
      "provinceName": "Maluku Utara",
      "islandGroup": "Maluku & Papua",
      "apbdEducationPct": 22.8,
      "totalEducationBudgetTrillion": 0.43,
      "spendingPerStudent": 7275847,
      "bosAbsorptionRate": 98.8,
      "dakFisikAbsorptionRate": 86.6,
      "ipmEducation": 70.6,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-PA",
      "provinceName": "Papua",
      "islandGroup": "Maluku & Papua",
      "apbdEducationPct": 21.5,
      "totalEducationBudgetTrillion": 0.75,
      "spendingPerStudent": 9640634,
      "bosAbsorptionRate": 95.3,
      "dakFisikAbsorptionRate": 92.2,
      "ipmEducation": 62.8,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-PB",
      "provinceName": "Papua Barat",
      "islandGroup": "Maluku & Papua",
      "apbdEducationPct": 21.6,
      "totalEducationBudgetTrillion": 0.52,
      "spendingPerStudent": 8101757,
      "bosAbsorptionRate": 95.9,
      "dakFisikAbsorptionRate": 83.3,
      "ipmEducation": 66.9,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-PS",
      "provinceName": "Papua Selatan",
      "islandGroup": "Maluku & Papua",
      "apbdEducationPct": 21.4,
      "totalEducationBudgetTrillion": 0.45,
      "spendingPerStudent": 8860818,
      "bosAbsorptionRate": 97.0,
      "dakFisikAbsorptionRate": 89.8,
      "ipmEducation": 61.9,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-PT",
      "provinceName": "Papua Tengah",
      "islandGroup": "Maluku & Papua",
      "apbdEducationPct": 23.4,
      "totalEducationBudgetTrillion": 0.49,
      "spendingPerStudent": 8895128,
      "bosAbsorptionRate": 97.5,
      "dakFisikAbsorptionRate": 95.8,
      "ipmEducation": 59.2,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-PE",
      "provinceName": "Papua Pegunungan",
      "islandGroup": "Maluku & Papua",
      "apbdEducationPct": 23.3,
      "totalEducationBudgetTrillion": 0.53,
      "spendingPerStudent": 9656384,
      "bosAbsorptionRate": 94.2,
      "dakFisikAbsorptionRate": 86.1,
      "ipmEducation": 54.8,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    },
    {
      "provinceId": "ID-PD",
      "provinceName": "Papua Barat Daya",
      "islandGroup": "Maluku & Papua",
      "apbdEducationPct": 20.5,
      "totalEducationBudgetTrillion": 0.41,
      "spendingPerStudent": 11641425,
      "bosAbsorptionRate": 93.9,
      "dakFisikAbsorptionRate": 80.2,
      "ipmEducation": 67.2,
      "efficiencyStatus": "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)"
    }
  ]
};

export const FORECASTING_BASELINE_SNAPSHOT: ForecastingBaselineSnapshot = {
  "generated_at": "2026-11-22",
  "baselineYear": 2026,
  "projectionEndYear": 2030,
  "nationalBaseline": {
    "totalStudents": 44850000,
    "totalTeachers": 2850000,
    "currentStr": 15.74,
    "targetStrStandard": 18.0,
    "annualRetirementCohortAvg": 72500,
    "annualNewClassroomCostRp": 185000000,
    "annualTeacherSalaryStandardRp": 68000000
  },
  "islandBaselines": [
    {
      "island": "Jawa",
      "students": 24200000,
      "teachers": 1420000,
      "str": 17.0,
      "annualRetirement": 38000
    },
    {
      "island": "Sumatera",
      "students": 9800000,
      "teachers": 620000,
      "str": 15.8,
      "annualRetirement": 15500
    },
    {
      "island": "Bali & Nusa Tenggara",
      "students": 2950000,
      "teachers": 195000,
      "str": 15.1,
      "annualRetirement": 4800
    },
    {
      "island": "Kalimantan",
      "students": 3100000,
      "teachers": 210000,
      "str": 14.8,
      "annualRetirement": 5100
    },
    {
      "island": "Sulawesi",
      "students": 3400000,
      "teachers": 265000,
      "str": 12.8,
      "annualRetirement": 6200
    },
    {
      "island": "Maluku & Papua",
      "students": 1400000,
      "teachers": 140000,
      "str": 10.0,
      "annualRetirement": 2900
    }
  ],
  "defaultParameters": {
    "annualTeacherRetirementRate": 2.8,
    "annualPppkRecruitmentQuota": 65000,
    "annualStudentGrowthRate": 1.2,
    "targetStrNational": 17.5,
    "inflationBOSCost": 4.5
  }
};

export const POLICY_BRIEFS_SNAPSHOT: PolicyBriefItem[] = [
  {
    "id": "PB-2026-001",
    "slug": "disparitas-guru-wilayah-3t",
    "title": "Mitigasi Kesenjangan Distribusi & Kualifikasi Pendidik di Wilayah 3T Indonesia",
    "category": "Pemerataan Tenaga Pendidik",
    "targetAgencies": [
      "Ditjen GTK Kemendikbudristek",
      "KemenPAN-RB",
      "Bappenas"
    ],
    "status": "Rekomendasi Siap Diserahkan",
    "date": "22 November 2026",
    "author": "Kelompok Kerja Analitik Kebijakan EduAtlas",
    "executiveSummary": "Sebanyak 71,9% kabupaten di Maluku dan Papua berstatus 3T dengan defisit guru berkeahlian sains dan vokasi. Penataan formasi PPPK berbasis afirmasi lokasi mutlak diperlukan guna mencegah kekosongan ruang kelas.",
    "keyEvidence": [
      {
        "label": "Rata-rata Rasio Murid:Guru 3T",
        "value": "25,4 : 1 (vs 17,6 : 1 di Jawa)"
      },
      {
        "label": "Guru Bersertifikat Pendidik di 3T",
        "value": "54,2% (Target Nasional 90%)"
      },
      {
        "label": "Kekosongan Guru Tetap per Sekolah 3T",
        "value": "Rata-rata 2,8 Guru per Satuan Pendidikan"
      }
    ],
    "rootCauses": [
      "Formasi seleksi ASN/PPPK terpusat di wilayah perkotaan akibat minimnya insentif tunjangan kemahalan daerah terpencil.",
      "Tingkat mutasi guru kembali ke ibukota provinsi setelah masa dinas 2 tahun masih di atas 40%.",
      "Fasilitas perumahan guru dinas di perbatasan pulau belum teralokasi optimal dalam DAK Fisik."
    ],
    "shortTermActions": [
      "Pemberian Tunjangan Khusus Guru (TKG) 1,5x gaji pokok yang cair tepat waktu bulanan secara terotomasi via Dapodik.",
      "Moratorium kepindahan mutasi guru ASN di satuan pendidikan 3T minimal 8 tahun masa pengabdian."
    ],
    "mediumTermActions": [
      "Program beasiswa ikatan dinas sarjana kependidikan putra daerah (PPG Prajabatan Terikat Daerah 3T).",
      "Rehabilitasi terpadu 12.000 rumah dinas guru di pulau terluar dan daerah pegunungan."
    ]
  },
  {
    "id": "PB-2026-002",
    "slug": "efisiensi-dana-bos-kinerja",
    "title": "Akselerasi Efektivitas Penyaluran Dana BOS Kinerja untuk Transformasi Pembelajaran Digital",
    "category": "Tata Kelola Anggaran",
    "targetAgencies": [
      "Kementerian Pendidikan Dasar dan Menengah",
      "Kementerian Keuangan",
      "Dinas Pendidikan Provinsi"
    ],
    "status": "Rekomendasi Siap Diserahkan",
    "date": "20 November 2026",
    "author": "Unit Riset Fiskal EduAtlas",
    "executiveSummary": "Meskipun serapan BOS nasional mencapai 96,8%, sekolah dengan akreditasi C mengalami keterlambatan eksekusi anggaran akibat beban administrasi pelaporan ARKAS yang belum terintegrasi.",
    "keyEvidence": [
      {
        "label": "Serapan BOS Reguler Nasional",
        "value": "96,8%"
      },
      {
        "label": "Alokasi Belanja Modal TIK Sekolah",
        "value": "Hanya 14,2% dari total dana BOS"
      },
      {
        "label": "Sekolah Akreditasi C Penerima Kinerja",
        "value": "39 Sekolah dari 300 Sampel Terdata"
      }
    ],
    "rootCauses": [
      "Rendahnya kapasitas bendahara sekolah dalam perencanaan berbasis data (Rapor Pendidikan).",
      "Kekakuan aturan batas maksimal honorarium guru non-ASN pada sekolah berstatus swasta pedesaan."
    ],
    "shortTermActions": [
      "Penyederhanaan pelaporan ARKAS dengan validasi otomatis e-Katalog LKPP.",
      "Bimbingan teknis intensif PBD (Perencanaan Berbasis Data) untuk 500 sekolah prioritas."
    ],
    "mediumTermActions": [
      "Digitalisasi audit dana operasional sekolah secara real-time bersama BPKP.",
      "Peningkatan unit cost BOS per siswa di kabupaten berindeks kemahalan konstruksi tinggi."
    ]
  },
  {
    "id": "PB-2026-003",
    "slug": "pensiun-massal-guru-2026-2030",
    "title": "Strategi Penanganan Lonjakan Pensiun 360.000 Guru Periode 2026–2030 Melalui PPG Prajabatan",
    "category": "Manajemen SDM Pendidikan",
    "targetAgencies": [
      "Kemendikbudristek",
      "KemenPAN-RB",
      "Asosiasi Pemerintah Kabupaten Seluruh Indonesia (APKASI)"
    ],
    "status": "Draf Siap Dikirim",
    "date": "18 November 2026",
    "author": "Laboratorium Proyeksi Masa Depan EduAtlas",
    "executiveSummary": "Sebanyak 72.500 guru berstatus PNS memasuki batas usia pensiun setiap tahunnya hingga 2030. Jika kuota rekrutmen tidak disesuaikan, defisit guru nasional diproyeksikan melonjak hingga 18,4% pada 2029.",
    "keyEvidence": [
      {
        "label": "Pensiun Tahunan Rata-Rata",
        "value": "72.500 Orang / Tahun"
      },
      {
        "label": "Guru Usia di Atas 55 Tahun",
        "value": "24,8% dari total pendidik aktif"
      },
      {
        "label": "Proyeksi Defisit Pendidik 2028",
        "value": "112.000 Pendidik jika kuota tetap"
      }
    ],
    "rootCauses": [
      "Efek moratorium pengangkatan PNS masa lampau yang terkonsentrasi pada cohort usia pensiun 2025-2030.",
      "Kapasitas LPTK mencetak lulusan PPG Prajabatan bidang studi produktif masih di bawah kebutuhan riil."
    ],
    "shortTermActions": [
      "Peningkatan kuota penerimaan PPG Prajabatan bersubsidi pemerintah hingga 80.000 mahasiswa per tahun.",
      "Skema perpanjangan kontrak purna tugas guru teladan dengan kompensasi keahlian khusus."
    ],
    "mediumTermActions": [
      "Kemitraan strategis LPTK dengan perguruan tinggi vokasi untuk percepatan sertifikasi guru produktif SMK.",
      "Penyusunan dashboard talenta pendidik berbasis AI untuk penempatan formasi presisi."
    ]
  },
  {
    "id": "PB-2026-004",
    "slug": "revitalisasi-sarpras-vokasi",
    "title": "Harmonisasi Revitalisasi Fasilitas SMK & Politeknik dengan Kebutuhan Koridor Industri Daerah",
    "category": "Vokasi & Kemitraan Industri",
    "targetAgencies": [
      "Ditjen Vokasi",
      "Kementerian Perindustrian",
      "KADIN Indonesia"
    ],
    "status": "Rekomendasi Siap Diserahkan",
    "date": "15 November 2026",
    "author": "Pokja Kemitraan Dunia Usaha EduAtlas",
    "executiveSummary": "Hanya 34,2% SMK di luar Jawa yang memiliki sarana bengkel praktik berstandar sertifikasi industri internasional. Revitalisasi sarpras berbasis konsorsium industri lokal adalah kunci penyerapan lulusan.",
    "keyEvidence": [
      {
        "label": "Skor Kelayakan Sarpras SMK Luar Jawa",
        "value": "64,8 dari 100"
      },
      {
        "label": "Ketersediaan Guru Produktif Bersertifikat",
        "value": "41,2%"
      },
      {
        "label": "Daya Serap Lulusan Vokasi Relevan",
        "value": "68,4%"
      }
    ],
    "rootCauses": [
      "Tingginya depresiasi mesin perkakas sekolah kejuruan tanpa anggaran pemeliharaan berkala.",
      "Minimnya insentif Super Tax Deduction yang dimanfaatkan industri manufaktur daerah."
    ],
    "shortTermActions": [
      "Pengalokasian DAK Fisik tematik SMK berbasis komitmen Teaching Factory (TeFa) dengan mitra industri.",
      "Sosialisasi masif kemudahan klaim insentif pajak 200% bagi industri pembina SMK."
    ],
    "mediumTermActions": [
      "Pembangunan Shared Facilities Center (Balai Latihan Bersama) di tiap kawasan industri strategis.",
      "Sertifikasi kompetensi berkala bagi instruktur kejuruan langsung di lini manufaktur."
    ]
  },
  {
    "id": "PB-2026-005",
    "slug": "efisiensi-anggaran-ipm-daerah",
    "title": "Optimalisasi Pengeluaran Belanja Pendidikan APBD Terhadap Percepatan Peningkatan IPM Pendidikan",
    "category": "Efisiensi Fiskal & IPM",
    "targetAgencies": [
      "Kementerian Dalam Negeri",
      "Bappenas",
      "Kementerian Keuangan"
    ],
    "status": "Draf Siap Dikirim",
    "date": "10 November 2026",
    "author": "Divisi Kebijakan Publik EduAtlas",
    "executiveSummary": "Beberapa daerah mencatatkan spending per student di atas Rp 7,5 juta namun skor IPM Pendidikan tetap di bawah 68. Pergeseran proporsi belanja dari birokrasi ke beasiswa dan ruang belajar sangat mendesak.",
    "keyEvidence": [
      {
        "label": "Rata-rata Belanja Per Siswa",
        "value": "Rp 5.420.000 / Tahun"
      },
      {
        "label": "Korelasi Anggaran vs IPM",
        "value": "Koefisien R = 0,64"
      },
      {
        "label": "Daerah Kategori Kuadran Butuh Optimalisasi",
        "value": "48 Kabupaten/Kota"
      }
    ],
    "rootCauses": [
      "Proporsi belanja barang/jasa dan perjalanan dinas aparatur dinas pendidikan yang melampaui 35% APBD fungsi pendidikan.",
      "Belum adanya indikator kinerja capaian pembelajaran yang diikatkan dengan transfer dana insentif fiskal."
    ],
    "shortTermActions": [
      "Penerapan batas pagu maksimal belanja operasional aparatur dinas pendidikan maksimal 15% dari total APBD pendidikan.",
      "Pengalokasian dana insentif daerah (DID) berbasis kenaikan literasi dan numerasi Rapor Pendidikan."
    ],
    "mediumTermActions": [
      "Audit kepatuhan mandatory spending 20% yang murni mengalir ke satuan pendidikan peserta didik.",
      "Pengembangan sistem akuntansi pendidikan berbasis satuan biaya standar regional (SBSR)."
    ]
  }
];
