import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import {
  Share2,
  Network,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronDown,
  Layers,
  MapPin,
  ExternalLink,
  X,
  Building2,
  GraduationCap,
  Users,
  UserCheck,
  Award,
  ArrowRight,
  Check,
  Compass,
  Briefcase,
  GitPullRequest,
  ArrowUpRight,
  Info,
  Sparkles,
  GitFork,
  BookOpen,
  School,
} from 'lucide-react';

export interface NetworkNodeItem {
  id: string;
  name: string;
  type: 'Universitas' | 'Politeknik' | 'SMA' | 'SMK' | 'SMP' | 'SD' | 'Lainnya';
  color: string;
  connections: number;
  location: string;
  programs: number;
  description: string;
}

export const FlowPage: React.FC = () => {
  // Top category tabs
  const [activeTab, setActiveTab] = useState<
    | 'Education Flow'
    | 'Institution Network'
    | 'Collaboration Network'
    | 'Student Pathway'
    | 'Teacher Mobility'
    | 'Program Dependency'
    | 'Other'
  >('Education Flow');

  const [institutionSearch, setInstitutionSearch] = useState('');
  const [networkZoom, setNetworkZoom] = useState(1);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedScope, setSelectedScope] = useState('Semua Jenjang');

  // Modal inspection state for clicked node or collaboration row
  const [selectedNodeModal, setSelectedNodeModal] = useState<NetworkNodeItem | null>(null);

  // Top 10 Collaboration pairs dataset
  const topCollaborations = useMemo(() => {
    switch (activeTab) {
      case 'Collaboration Network':
        return [
          { id: 1, instA: 'Universitas Indonesia', instB: 'PT Telkom Indonesia', programs: 48, max: 50 },
          { id: 2, instA: 'ITB', instB: 'PT Dirgantara Indonesia', programs: 44, max: 50 },
          { id: 3, instA: 'UGM', instB: 'PT Bio Farma', programs: 39, max: 50 },
          { id: 4, instA: 'Politeknik Negeri Bandung', instB: 'PT Astra Honda Motor', programs: 34, max: 50 },
          { id: 5, instA: 'SMK 2 Bandung', instB: 'PT Len Industri', programs: 31, max: 50 },
          { id: 6, instA: 'UNPAD', instB: 'Pemprov Jawa Barat', programs: 29, max: 50 },
          { id: 7, instA: 'ITS Surabaya', instB: 'PT PAL Indonesia', programs: 28, max: 50 },
          { id: 8, instA: 'IPB University', instB: 'Kementerian Pertanian', programs: 26, max: 50 },
          { id: 9, instA: 'Politeknik Negeri Jakarta', instB: 'PT Schneider Electric', programs: 24, max: 50 },
          { id: 10, instA: 'UNY', instB: 'Dinas Dikpora DIY', programs: 21, max: 50 },
        ];
      case 'Student Pathway':
        return [
          { id: 1, instA: 'SMA Negeri 1 Bandung', instB: 'ITB (Jalur SNBP)', programs: 62, max: 70 },
          { id: 2, instA: 'SMA Negeri 3 Semarang', instB: 'UGM (Jalur SNBP)', programs: 58, max: 70 },
          { id: 3, instA: 'SMA Negeri 8 Jakarta', instB: 'Universitas Indonesia', programs: 55, max: 70 },
          { id: 4, instA: 'SMK Negeri 1 Cimahi', instB: 'Politeknik Manufaktur', programs: 46, max: 70 },
          { id: 5, instA: 'SMA Negeri 3 Bandung', instB: 'UNPAD (SNBP/SNBT)', programs: 42, max: 70 },
          { id: 6, instA: 'SMK Negeri 2 Surabaya', instB: 'PENS Surabaya', programs: 38, max: 70 },
          { id: 7, instA: 'SMA Negeri 1 Yogyakarta', instB: 'UGM (Jalur Mandiri)', programs: 36, max: 70 },
          { id: 8, instA: 'SMP Negeri 5 Bandung', instB: 'SMA 3 & 5 Bandung', programs: 34, max: 70 },
          { id: 9, instA: 'SMA Negeri 5 Surabaya', instB: 'Universitas Airlangga', programs: 32, max: 70 },
          { id: 10, instA: 'SMK Negeri 2 Bandung', instB: 'Politeknik Negeri Bandung', programs: 29, max: 70 },
        ];
      case 'Teacher Mobility':
        return [
          { id: 1, instA: 'DKI Jakarta', instB: 'Kab. Timor Tengah Selatan (NTT)', programs: 142, max: 150 },
          { id: 2, instA: 'Jawa Barat', instB: 'Kab. Asmat (Papua Selatan)', programs: 118, max: 150 },
          { id: 3, instA: 'Jawa Timur', instB: 'Kab. Kepulauan Talaud (Sulut)', programs: 98, max: 150 },
          { id: 4, instA: 'DI Yogyakarta', instB: 'Kab. Nunukan (Kaltara)', programs: 84, max: 150 },
          { id: 5, instA: 'Jawa Tengah', instB: 'Kab. Nias Barat (Sumut)', programs: 76, max: 150 },
          { id: 6, instA: 'Sumatera Barat', instB: 'Kab. Kepulauan Mentawai', programs: 72, max: 150 },
          { id: 7, instA: 'Bali', instB: 'Kab. Rote Ndao (NTT)', programs: 64, max: 150 },
          { id: 8, instA: 'Sulawesi Selatan', instB: 'Kab. Pangkep Kepulauan', programs: 58, max: 150 },
          { id: 9, instA: 'Jawa Barat', instB: 'Kab. Sambas (Kalbar)', programs: 52, max: 150 },
          { id: 10, instA: 'Jawa Timur', instB: 'Kab. Maluku Tenggara Barat', programs: 48, max: 150 },
        ];
      case 'Program Dependency':
        return [
          { id: 1, instA: 'Dapodik Pusat', instB: 'Rapor Pendidikan', programs: 100, max: 100 },
          { id: 2, instA: 'Rapor Pendidikan', instB: 'Perencanaan Berbasis Data (PBD)', programs: 95, max: 100 },
          { id: 3, instA: 'Asesmen Nasional', instB: 'Evaluasi Mutu Sekolah', programs: 90, max: 100 },
          { id: 4, instA: 'Platform Merdeka Mengajar', instB: 'Sertifikasi Pendidik', programs: 85, max: 100 },
          { id: 5, instA: 'BOSP Salur', instB: 'ARKAS Digital Kemendikbud', programs: 82, max: 100 },
          { id: 6, instA: 'Kampus Merdeka (MBKM)', instB: 'Konversi SKS Perguruan Tinggi', programs: 78, max: 100 },
          { id: 7, instA: 'Akreditasi BAN-PDM', instB: 'Bantuan Operasional Sekolah', programs: 75, max: 100 },
          { id: 8, instA: 'Program Indonesia Pintar', instB: 'Verifikasi DTKS Kemensos', programs: 72, max: 100 },
          { id: 9, instA: 'Revitalisasi SMK', instB: 'Pusat Keunggulan (SMK PK)', programs: 68, max: 100 },
          { id: 10, instA: 'Guru Penggerak', instB: 'Rekrutmen Kepala Sekolah', programs: 64, max: 100 },
        ];
      default:
        // Default: Education Flow & Institution Network
        return [
          { id: 1, instA: 'Universitas Indonesia', instB: 'ITB', programs: 42, max: 50 },
          { id: 2, instA: 'UGM', instB: 'UNY', programs: 38, max: 50 },
          { id: 3, instA: 'UNPAD', instB: 'ITB', programs: 35, max: 50 },
          { id: 4, instA: 'Politeknik Negeri Bandung', instB: 'SMK 2 Bandung', programs: 28, max: 50 },
          { id: 5, instA: 'Universitas Indonesia', instB: 'SMA 3 Bandung', programs: 26, max: 50 },
          { id: 6, instA: 'UNY', instB: 'SMA 1 Yogyakarta', programs: 24, max: 50 },
          { id: 7, instA: 'ITB', instB: 'SMK 5 Bandung', programs: 22, max: 50 },
          { id: 8, instA: 'UGM', instB: 'SMA 1 Surabaya', programs: 21, max: 50 },
          { id: 9, instA: 'Politeknik Negeri Jakarta', instB: 'SMK 1 Jakarta', programs: 19, max: 50 },
          { id: 10, instA: 'UNPAD', instB: 'SMA 5 Bandung', programs: 18, max: 50 },
        ];
    }
  }, [activeTab]);

  // Types of relationships dataset
  const relationTypes = useMemo(() => {
    switch (activeTab) {
      case 'Collaboration Network':
        return [
          { label: 'Magang & Praktik Industri', count: 168, color: '#0284c7', max: 180 },
          { label: 'Riset Kolaboratif & Inovasi', count: 142, color: '#0d9488', max: 180 },
          { label: 'Program Pertukaran Mahasiswa', count: 124, color: '#f59e0b', max: 180 },
          { label: 'Penyusunan Kurikulum DUDI', count: 96, color: '#8b5cf6', max: 180 },
          { label: 'MoU Kerjasama Strategis', count: 74, color: '#ec4899', max: 180 },
          { label: 'Beasiswa Ikatan Dinas', count: 58, color: '#10b981', max: 180 },
          { label: 'Lainnya', count: 32, color: '#94a3b8', max: 180 },
        ];
      case 'Student Pathway':
        return [
          { label: 'Jalur Prestasi Rapor (SNBP)', count: 148, color: '#0284c7', max: 160 },
          { label: 'Jalur Tes Nasional (UTBK-SNBT)', count: 136, color: '#0d9488', max: 160 },
          { label: 'Jalur Vokasi & Politeknik', count: 98, color: '#f59e0b', max: 160 },
          { label: 'Jalur Mandiri PTN', count: 82, color: '#8b5cf6', max: 160 },
          { label: 'Jalur Beasiswa KIP Kuliah', count: 68, color: '#ec4899', max: 160 },
          { label: 'Perguruan Tinggi Swasta', count: 54, color: '#10b981', max: 160 },
          { label: 'Bekerja Langsung / Wirausaha', count: 36, color: '#94a3b8', max: 160 },
        ];
      case 'Teacher Mobility':
        return [
          { label: 'Penugasan Khusus Daerah 3T', count: 154, color: '#0284c7', max: 160 },
          { label: 'Program Guru Penggerak', count: 138, color: '#0d9488', max: 160 },
          { label: 'Pertukaran Guru Antar Provinsi', count: 92, color: '#f59e0b', max: 160 },
          { label: 'Magang Industri Guru SMK', count: 78, color: '#8b5cf6', max: 160 },
          { label: 'Pemberdayaan MGMP / KKG', count: 64, color: '#ec4899', max: 160 },
          { label: 'Rotasi Mutasi Berkala', count: 48, color: '#10b981', max: 160 },
          { label: 'Lainnya', count: 26, color: '#94a3b8', max: 160 },
        ];
      case 'Program Dependency':
        return [
          { label: 'Integrasi Dapodik & Emis', count: 162, color: '#0284c7', max: 170 },
          { label: 'Perencanaan Berbasis Data (PBD)', count: 144, color: '#0d9488', max: 170 },
          { label: 'Sinkronisasi Rapor Pendidikan', count: 118, color: '#f59e0b', max: 170 },
          { label: 'Koneksi ARKAS & BOSP Salur', count: 92, color: '#8b5cf6', max: 170 },
          { label: 'Adopsi Platform Merdeka Belajar', count: 76, color: '#ec4899', max: 170 },
          { label: 'Sertifikasi Kompetensi BNSP', count: 54, color: '#10b981', max: 170 },
          { label: 'Lainnya', count: 28, color: '#94a3b8', max: 170 },
        ];
      default:
        return [
          { label: 'Program Pertukaran Siswa', count: 124, color: '#0284c7', max: 130 },
          { label: 'Penelitian Bersama', count: 98, color: '#0d9488', max: 130 },
          { label: 'Pengabdian Masyarakat', count: 86, color: '#f59e0b', max: 130 },
          { label: 'Praktik Kerja Lapangan', count: 72, color: '#8b5cf6', max: 130 },
          { label: 'MOU / MoA', count: 58, color: '#ec4899', max: 130 },
          { label: 'Program Beasiswa', count: 46, color: '#10b981', max: 130 },
          { label: 'Lainnya', count: 24, color: '#94a3b8', max: 130 },
        ];
    }
  }, [activeTab]);

  // Dynamic KPI Card Values per activeTab
  const kpiData = useMemo(() => {
    switch (activeTab) {
      case 'Institution Network':
        return {
          title1: 'Nodus Terhubung',
          val1: '8.420',
          badge1: '↑ 5,2% thd 2025',
          title2: 'Kluster Jaringan',
          val2: '34 Kluster',
          badge2: '↑ 2 kluster baru',
          title3: 'Sentralitas Hub',
          val3: '0,84 (UI/ITB)',
          badge3: 'Tinggi',
          title4: 'Densitas Jejaring',
          val4: '78,2%',
          badge4: '↑ 4,1%',
        };
      case 'Collaboration Network':
        return {
          title1: 'Program Kerja Sama',
          val1: '456 Program',
          badge1: '↑ 12,4% thd 2025',
          title2: 'MoU & MoA Aktif',
          val2: '124 Dokumen',
          badge2: 'Aktif Berjalan',
          title3: 'Mitra Dunia Usaha',
          val3: '88 Industri',
          badge3: '↑ 15 mitra',
          title4: 'Kemitraan Global',
          val4: '32 Negara',
          badge4: '↑ 6 program',
        };
      case 'Student Pathway':
        return {
          title1: 'Transisi SD ➔ SMP',
          val1: '98,2%',
          badge1: 'Tinggi (Retensi Baik)',
          title2: 'Transisi SMP ➔ SMA',
          val2: '82,5%',
          badge2: 'Target 85%',
          title3: 'Angka Lanjut PT',
          val3: '34,4%',
          badge3: '↑ 2,8% thd 2025',
          title4: 'Peminat Jalur Vokasi',
          val4: '19,5%',
          badge4: 'SMK & Politeknik',
        };
      case 'Teacher Mobility':
        return {
          title1: 'Total Guru Bergerak',
          val1: '14.280',
          badge1: 'Tahun 2026',
          title2: 'Penugasan Daerah 3T',
          val2: '3.420 Guru',
          badge2: '↑ 8,4% pemenuhan',
          title3: 'Guru Penggerak',
          val3: '28.400 Guru',
          badge3: 'Terakreditasi',
          title4: 'Sertifikasi Pendidik',
          val4: '82,4%',
          badge4: 'Target 90%',
        };
      case 'Program Dependency':
        return {
          title1: 'Program Terintegrasi',
          val1: '18 Program',
          badge1: 'Kemendikbud',
          title2: 'Dependensi Kritis',
          val2: '6 Prasyarat',
          badge2: 'Terkonsolidasi',
          title3: 'Tingkat Integrasi Data',
          val3: '88,5%',
          badge3: 'Dapodik & PBD',
          title4: 'Modul Aktif',
          val4: '42 Modul',
          badge4: 'Merdeka Belajar',
        };
      case 'Other':
        return {
          title1: 'Total Nodus Graf',
          val1: '12.450',
          badge1: 'Komprehensif',
          title2: 'Total Tautan (Edges)',
          val2: '38.200',
          badge2: 'Multi-layer',
          title3: 'Modularity Score',
          val3: '0,84',
          badge3: 'Struktur Kuat',
          title4: 'Rata-Rata Derajat',
          val4: '6,1 Koneksi',
          badge4: 'Per Nodus',
        };
      default:
        // Education Flow
        return {
          title1: 'Total Sekolah',
          val1: '125.482',
          badge1: '↑ 2,8% dari 2025',
          title2: 'Total Siswa',
          val2: '42.560.321',
          badge2: '↑ 3,1% dari 2025',
          title3: 'Total Guru',
          val3: '2.843.921',
          badge3: '↑ 1,9% dari 2025',
          title4: 'Total Universitas',
          val4: '3.216',
          badge4: '↑ 4,5% dari 2025',
        };
    }
  }, [activeTab]);

  // Contextual Banner description
  const tabDescription = useMemo(() => {
    switch (activeTab) {
      case 'Institution Network':
        return 'Fokus pada topologi jejaring perguruan tinggi (PTN/PTS) dan sekolah mitra, sentralitas kluster, serta sebaran nodus konektivitas.';
      case 'Collaboration Network':
        return 'Menganalisis kemitraan antar lembaga pendidikan, program kerja sama aktif (MoU, Riset, PKL, Magang), dan intensitas keterlibatan industri.';
      case 'Student Pathway':
        return 'Analisis jalur transisi akademik vs vokasi, angka melanjutkan sekolah (retention rate), serta titik kebocoran siswa (dropout) per jenjang.';
      case 'Teacher Mobility':
        return 'Distribusi dan pergerakan tenaga pendidik antar wilayah, pemerataan Guru Penggerak, dan penugasan prioritas di daerah 3T.';
      case 'Program Dependency':
        return 'Peta keterkaitan program prioritas nasional (Kurikulum Merdeka, Asesmen Nasional, PIP, Kampus Merdeka, dan Akreditasi).';
      case 'Other':
        return 'Metrik matriks graf jaringan global, modularitas, densitas konektivitas, serta repositori data relasi antarentitas pendidikan.';
      default:
        return 'Visualisasi alur proses makro siswa antar jenjang pendidikan, diagram alir transisi (Sankey), jejaring institusi, dan peta mobilitas provinsi.';
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Flow & Network"
        subtitle="Visualisasi alur proses, hubungan antarentitas, dan jaringan pendidikan di Indonesia."
      />

      {/* 2. Top Category Pills Strip (Standard Navy #0F2942 & rounded-xl) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          'Education Flow',
          'Institution Network',
          'Collaboration Network',
          'Student Pathway',
          'Teacher Mobility',
          'Program Dependency',
          'Other',
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
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

      {/* 3. Contextual Tab Focus Banner */}
      <div className="bg-gradient-to-r from-[#F0F7FF] via-[#E6F8F6] to-white border border-[#DCE5EF] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0F2942] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <GitFork className="w-4 h-4 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">
                Fokus Tampilan: {activeTab}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#25A9A1] text-white">
                Aktif
              </span>
            </div>
            <p className="text-xs text-[#526579] mt-0.5">{tabDescription}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-[#DCE5EF] text-xs font-semibold rounded-xl px-3 py-1.5 text-[#172B4D] outline-none cursor-pointer hover:border-[#25A9A1] transition-colors shadow-2xs"
          >
            <option value="2026">Tahun 2026</option>
            <option value="2025">Tahun 2025</option>
          </select>
        </div>
      </div>

      {/* 4. Dynamic KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-4 shadow-2xs hover:border-[#25A9A1] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {kpiData.title1}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
              <School className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#172B4D] mt-2">{kpiData.val1}</div>
          <div className="text-[11px] font-semibold text-[#10B981] mt-1 flex items-center gap-1">
            <span>{kpiData.badge1}</span>
          </div>
        </div>

        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-4 shadow-2xs hover:border-[#25A9A1] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {kpiData.title2}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#E6F8F6] text-[#25A9A1] flex items-center justify-center font-bold">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#172B4D] mt-2">{kpiData.val2}</div>
          <div className="text-[11px] font-semibold text-[#0284C7] mt-1 flex items-center gap-1">
            <span>{kpiData.badge2}</span>
          </div>
        </div>

        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-4 shadow-2xs hover:border-[#25A9A1] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {kpiData.title3}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#F5F3FF] text-[#8B5CF6] flex items-center justify-center font-bold">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#172B4D] mt-2">{kpiData.val3}</div>
          <div className="text-[11px] font-semibold text-[#8B5CF6] mt-1 flex items-center gap-1">
            <span>{kpiData.badge3}</span>
          </div>
        </div>

        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-4 shadow-2xs hover:border-[#25A9A1] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {kpiData.title4}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#DEF7EC] text-[#059669] flex items-center justify-center font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#172B4D] mt-2">{kpiData.val4}</div>
          <div className="text-[11px] font-semibold text-[#059669] mt-1 flex items-center gap-1">
            <span>{kpiData.badge4}</span>
          </div>
        </div>
      </div>

      {/* 5. Middle Row (2 Big Visualizations: Sankey Flow + Network Graph) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Visualization: Alur Siswa Antar Jenjang / Matriks Alir */}
        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#172B4D]">
                    {activeTab === 'Teacher Mobility'
                      ? 'Alur Mobilitas Guru Antar Wilayah'
                      : activeTab === 'Program Dependency'
                      ? 'Alur Ketergantungan Program Nasional'
                      : activeTab === 'Collaboration Network'
                      ? 'Alur Kemitraan Kampus & Industri'
                      : 'Alur Siswa Antar Jenjang Pendidikan'}
                  </h3>
                </div>
                <p className="text-[11px] text-[#526579] mt-1">
                  {activeTab === 'Teacher Mobility'
                    ? 'Transisi penugasan guru dari sentra perkotaan ke daerah 3T'
                    : activeTab === 'Program Dependency'
                    ? 'Hierarki prasyarat dan integrasi data antar program'
                    : activeTab === 'Collaboration Network'
                    ? 'Distribusi kemitraan pendidikan ke dunia usaha & dunia industri'
                    : 'Menampilkan transisi siswa dari tiap jenjang pendidikan nasional.'}
                </p>
              </div>

              <select
                value={selectedScope}
                onChange={(e) => setSelectedScope(e.target.value)}
                className="bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-semibold rounded-xl px-2.5 py-1 text-[#172B4D] outline-none cursor-pointer"
              >
                <option>Semua Jenjang</option>
                <option>Pendidikan Dasar</option>
                <option>Pendidikan Menengah</option>
                <option>Pendidikan Tinggi</option>
              </select>
            </div>

            {/* Sankey Flow Visual Diagram */}
            <div className="mt-4 relative bg-[#FAFCFF] border border-[#EDF2F7] rounded-xl p-4 min-h-[360px] flex flex-col justify-between overflow-hidden">
              {/* Headers */}
              <div className="grid grid-cols-3 text-center text-xs font-bold text-[#526579] border-b border-[#E2E8F0] pb-2">
                <div className="text-left pl-2">Pendidikan Dasar</div>
                <div className="text-left pl-4">Pendidikan Menengah</div>
                <div className="text-left pl-4">Pendidikan Tinggi & Lainnya</div>
              </div>

              {/* SVG Connecting Flow Paths */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ top: '35px', height: 'calc(100% - 35px)' }}
              >
                <defs>
                  <linearGradient id="flow-sd-smp" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0.45" />
                  </linearGradient>
                  <linearGradient id="flow-sd-drop" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.35" />
                  </linearGradient>
                  <linearGradient id="flow-sd-other" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="flow-smp-sma" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.45" />
                  </linearGradient>
                  <linearGradient id="flow-smp-smk" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.45" />
                  </linearGradient>
                  <linearGradient id="flow-sma-univ" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.45" />
                  </linearGradient>
                </defs>

                {/* Curved paths between stages */}
                <path d="M 120 120 C 180 120, 200 65, 270 65" fill="none" stroke="url(#flow-sd-smp)" strokeWidth="48" />
                <path d="M 120 180 C 180 180, 200 170, 270 170" fill="none" stroke="url(#flow-sd-drop)" strokeWidth="22" />
                <path d="M 120 220 C 180 220, 200 230, 270 230" fill="none" stroke="url(#flow-sd-other)" strokeWidth="22" />

                <path d="M 370 55 C 430 55, 450 45, 520 45" fill="none" stroke="url(#flow-smp-sma)" strokeWidth="32" />
                <path d="M 370 85 C 430 85, 450 115, 520 115" fill="none" stroke="url(#flow-smp-smk)" strokeWidth="24" />
                <path d="M 610 40 C 660 40, 680 40, 740 40" fill="none" stroke="url(#flow-sma-univ)" strokeWidth="20" />
              </svg>

              {/* Stage Columns & Node Cards */}
              <div className="grid grid-cols-3 gap-6 relative z-10 my-auto py-2">
                {/* Column 1: Pendidikan Dasar */}
                <div className="flex flex-col justify-center">
                  <div
                    onClick={() =>
                      setSelectedNodeModal({
                        id: 'sd-main',
                        name: 'Sekolah Dasar (SD)',
                        type: 'SD',
                        color: '#0284C7',
                        connections: 125482,
                        location: 'Seluruh Indonesia',
                        programs: 4,
                        description: 'Tahap fondasi pendidikan dasar nasional dengan 18,2 juta siswa aktif terdaftar.',
                      })
                    }
                    className="bg-white border-l-4 border-l-[#0284C7] border border-[#DCE5EF] rounded-xl p-3 shadow-xs hover:border-[#0284C7] transition-all cursor-pointer"
                  >
                    <div className="text-xs font-bold text-[#172B4D]">SD</div>
                    <div className="text-sm font-extrabold text-[#0284C7] mt-0.5">18.254.641</div>
                    <div className="text-[10px] text-gray-400 font-semibold">(100% Basis)</div>
                  </div>
                </div>

                {/* Column 2: Pendidikan Menengah */}
                <div className="flex flex-col justify-between space-y-3">
                  <div
                    onClick={() =>
                      setSelectedNodeModal({
                        id: 'smp-main',
                        name: 'Sekolah Menengah Pertama (SMP)',
                        type: 'SMP',
                        color: '#0D9488',
                        connections: 42100,
                        location: 'Seluruh Indonesia',
                        programs: 4,
                        description: 'Transisi pendidikan menengah pertama dengan 11,9 juta siswa (retensi 65,5%).',
                      })
                    }
                    className="bg-white border-l-4 border-l-[#0D9488] border border-[#DCE5EF] rounded-xl p-2.5 shadow-xs hover:border-[#0D9488] transition-all cursor-pointer"
                  >
                    <div className="text-xs font-bold text-[#172B4D]">SMP</div>
                    <div className="text-xs font-extrabold text-[#0D9488] mt-0.5">11.958.324</div>
                    <div className="text-[9px] text-gray-400 font-semibold">(65,5%)</div>
                  </div>

                  <div className="bg-white border-l-4 border-l-[#38BDF8] border border-[#DCE5EF] rounded-xl p-2 shadow-xs">
                    <div className="text-[11px] font-bold text-[#172B4D]">Tidak Melanjutkan</div>
                    <div className="text-xs font-bold text-[#38BDF8] mt-0.5">3.102.541</div>
                    <div className="text-[9px] text-gray-400 font-semibold">(17,0%)</div>
                  </div>

                  <div className="bg-white border-l-4 border-l-gray-400 border border-[#DCE5EF] rounded-xl p-2 shadow-xs">
                    <div className="text-[11px] font-bold text-[#172B4D]">Lainnya / Informal</div>
                    <div className="text-xs font-bold text-gray-600 mt-0.5">3.193.776</div>
                    <div className="text-[9px] text-gray-400 font-semibold">(17,5%)</div>
                  </div>
                </div>

                {/* Column 3: Pendidikan Tinggi & Sub-items */}
                <div className="flex flex-col justify-between space-y-2">
                  <div className="bg-white border-l-4 border-l-[#F59E0B] border border-[#DCE5EF] rounded-xl p-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#172B4D]">SMA</span>
                      <span className="text-[9px] text-gray-400 font-semibold">(47,6%)</span>
                    </div>
                    <div className="text-xs font-bold text-[#F59E0B]">8.686.412</div>
                  </div>

                  <div className="bg-white border-l-4 border-l-[#8B5CF6] border border-[#DCE5EF] rounded-xl p-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#172B4D]">SMK</span>
                      <span className="text-[9px] text-gray-400 font-semibold">(14,8%)</span>
                    </div>
                    <div className="text-xs font-bold text-[#8B5CF6]">2.679.944</div>
                  </div>

                  <div className="bg-white border-l-4 border-l-[#EC4899] border border-[#DCE5EF] rounded-xl p-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#172B4D]">Universitas</span>
                      <span className="text-[9px] text-gray-400 font-semibold">(11,8%)</span>
                    </div>
                    <div className="text-xs font-bold text-[#EC4899]">2.145.332</div>
                  </div>

                  <div className="bg-white border-l-4 border-l-[#06B6D4] border border-[#DCE5EF] rounded-xl p-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#172B4D]">Vokasi / Poltek</span>
                      <span className="text-[9px] text-gray-400 font-semibold">(4,7%)</span>
                    </div>
                    <div className="text-xs font-bold text-[#06B6D4]">860.421</div>
                  </div>

                  <div className="bg-white border-l-4 border-l-[#10B981] border border-[#DCE5EF] rounded-xl p-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#172B4D]">Tidak Melanjutkan</span>
                      <span className="text-[9px] text-gray-400 font-semibold">(27,9%)</span>
                    </div>
                    <div className="text-xs font-bold text-[#10B981]">5.089.113</div>
                  </div>

                  <div className="bg-white border-l-4 border-l-gray-400 border border-[#DCE5EF] rounded-xl p-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#172B4D]">Lainnya</span>
                      <span className="text-[9px] text-gray-400 font-semibold">(9,6%)</span>
                    </div>
                    <div className="text-xs font-bold text-gray-600">1.751.490</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0F4F8] text-[11px] text-[#526579] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" /> Transisi Berkesinambungan
            </span>
            <span className="font-semibold text-[#0F2942]">Sistem Dapodik Pusat</span>
          </div>
        </div>

        {/* Right Visualization: Jaringan Institusi Pendidikan (Network Graph) */}
        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#F5F3FF] text-[#8B5CF6] flex items-center justify-center font-bold">
                    <Network className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#172B4D]">Jaringan Institusi Pendidikan</h3>
                </div>
                <p className="text-[11px] text-[#526579] mt-1">
                  Hubungan antar sekolah, universitas, dan kolaborasi terpadu.
                </p>
              </div>

              <span className="text-xs font-bold text-[#8B5CF6] bg-[#F5F3FF] px-2.5 py-1 rounded-xl">
                Multi-Node Graph
              </span>
            </div>

            {/* Interactive Force Graph Canvas Simulation */}
            <div className="mt-3 relative bg-[#FAFCFF] border border-[#EDF2F7] rounded-xl h-[360px] overflow-hidden">
              {/* Legend on top right */}
              <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs border border-[#DCE5EF] rounded-xl p-2.5 text-[10px] font-semibold space-y-1 z-20 shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                  <span className="text-[#172B4D]">Universitas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                  <span className="text-[#172B4D]">Politeknik</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className="text-[#172B4D]">SMA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" />
                  <span className="text-[#172B4D]">SMK</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
                  <span className="text-[#172B4D]">SMP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-[#172B4D]">SD</span>
                </div>
              </div>

              {/* SVG Network Graph with Clickable Nodes */}
              <svg
                className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-300"
                style={{ transform: `scale(${networkZoom})` }}
                viewBox="0 0 600 360"
              >
                {/* Edges / Connector Lines */}
                <g stroke="#CBD5E1" strokeWidth="1.5" strokeOpacity="0.6">
                  <line x1="380" y1="180" x2="380" y2="90" />
                  <line x1="380" y1="180" x2="480" y2="120" />
                  <line x1="380" y1="180" x2="490" y2="220" />
                  <line x1="380" y1="180" x2="430" y2="280" />
                  <line x1="380" y1="180" x2="300" y2="270" />
                  <line x1="380" y1="180" x2="260" y2="200" />
                  <line x1="380" y1="180" x2="240" y2="140" />
                  <line x1="380" y1="180" x2="320" y2="140" />

                  {/* Secondary Connections */}
                  <line x1="380" y1="90" x2="480" y2="120" />
                  <line x1="480" y1="120" x2="490" y2="220" />
                  <line x1="240" y1="140" x2="160" y2="110" />
                  <line x1="260" y1="200" x2="180" y2="240" />
                  <line x1="260" y1="200" x2="300" y2="270" />
                  <line x1="300" y1="270" x2="320" y2="310" />
                  <line x1="240" y1="140" x2="220" y2="80" />
                  <line x1="480" y1="120" x2="520" y2="90" />
                  <line x1="490" y1="220" x2="530" y2="260" />
                </g>

                {/* Central Major Hub: Universitas Indonesia */}
                <g
                  onClick={() =>
                    setSelectedNodeModal({
                      id: 'ui',
                      name: 'Universitas Indonesia (UI)',
                      type: 'Universitas',
                      color: '#8B5CF6',
                      connections: 42,
                      location: 'Depok / DKI Jakarta',
                      programs: 68,
                      description: 'Hub perguruan tinggi sentral dengan jaringan kolaborasi terluas di Indonesia.',
                    })
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <circle cx="380" cy="180" r="28" fill="#8B5CF6" opacity="0.9" />
                  <text x="380" y="178" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                    Universitas
                  </text>
                  <text x="380" y="190" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                    Indonesia
                  </text>
                </g>

                {/* Major University Nodes */}
                {/* ITB */}
                <g
                  onClick={() =>
                    setSelectedNodeModal({
                      id: 'itb',
                      name: 'Institut Teknologi Bandung (ITB)',
                      type: 'Universitas',
                      color: '#8B5CF6',
                      connections: 38,
                      location: 'Bandung, Jawa Barat',
                      programs: 54,
                      description: 'Pusat riset sains dan rekayasa terkemuka dalam jejaring perguruan tinggi negeri.',
                    })
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <circle cx="380" cy="90" r="18" fill="#8B5CF6" />
                  <text x="380" y="94" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                    ITB
                  </text>
                </g>

                {/* UGM */}
                <g
                  onClick={() =>
                    setSelectedNodeModal({
                      id: 'ugm',
                      name: 'Universitas Gadjah Mada (UGM)',
                      type: 'Universitas',
                      color: '#8B5CF6',
                      connections: 36,
                      location: 'Sleman, DI Yogyakarta',
                      programs: 52,
                      description: 'Kampus kerakyatan dengan kolaborasi KKN terluas di 38 provinsi.',
                    })
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <circle cx="480" cy="120" r="18" fill="#8B5CF6" />
                  <text x="480" y="124" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                    UGM
                  </text>
                </g>

                {/* UNPAD */}
                <g
                  onClick={() =>
                    setSelectedNodeModal({
                      id: 'unpad',
                      name: 'Universitas Padjadjaran (UNPAD)',
                      type: 'Universitas',
                      color: '#8B5CF6',
                      connections: 28,
                      location: 'Jatinangor, Jawa Barat',
                      programs: 36,
                      description: 'Pusat unggulan riset kesehatan, hukum, dan sains lingkungan.',
                    })
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <circle cx="490" cy="220" r="18" fill="#8B5CF6" />
                  <text x="490" y="224" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
                    UNPAD
                  </text>
                </g>

                {/* UNY */}
                <g
                  onClick={() =>
                    setSelectedNodeModal({
                      id: 'uny',
                      name: 'Universitas Negeri Yogyakarta (UNY)',
                      type: 'Universitas',
                      color: '#8B5CF6',
                      connections: 24,
                      location: 'Yogyakarta, DIY',
                      programs: 32,
                      description: 'Lembaga penghasil tenaga kependidikan dan guru penggerak utama di Indonesia.',
                    })
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <circle cx="430" cy="280" r="16" fill="#8B5CF6" />
                  <text x="430" y="284" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
                    UNY
                  </text>
                </g>

                {/* Connected Schools Nodes */}
                {/* SMA 1 Bandung */}
                <g
                  onClick={() =>
                    setSelectedNodeModal({
                      id: 'sma1bdg',
                      name: 'SMA Negeri 1 Bandung',
                      type: 'SMA',
                      color: '#F59E0B',
                      connections: 18,
                      location: 'Bandung, Jawa Barat',
                      programs: 14,
                      description: 'Sekolah mitra rujukan pembelajaran sains dan adopsi kurikulum merdeka.',
                    })
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <circle cx="160" cy="110" r="12" fill="#F59E0B" />
                  <text x="160" y="93" textAnchor="middle" fill="#172B4D" fontSize="8" fontWeight="bold">
                    SMA 1 Bandung
                  </text>
                </g>

                {/* SMA 3 Bandung */}
                <g
                  onClick={() =>
                    setSelectedNodeModal({
                      id: 'sma3bdg',
                      name: 'SMA Negeri 3 Bandung',
                      type: 'SMA',
                      color: '#F59E0B',
                      connections: 22,
                      location: 'Bandung, Jawa Barat',
                      programs: 16,
                      description: 'Sekolah unggulan dengan tingkat serapan PTN tertinggi di Jawa Barat.',
                    })
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <circle cx="240" cy="140" r="10" fill="#F59E0B" />
                  <text x="240" y="125" textAnchor="middle" fill="#172B4D" fontSize="8" fontWeight="bold">
                    SMA 3 Bandung
                  </text>
                </g>

                {/* SMP 5 Bandung */}
                <g
                  onClick={() =>
                    setSelectedNodeModal({
                      id: 'smp5bdg',
                      name: 'SMP Negeri 5 Bandung',
                      type: 'SMP',
                      color: '#06B6D4',
                      connections: 12,
                      location: 'Bandung, Jawa Barat',
                      programs: 8,
                      description: 'Sekolah menengah pertama percontohan literasi numerasi nasional.',
                    })
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <circle cx="180" cy="240" r="11" fill="#06B6D4" />
                  <text x="180" y="260" textAnchor="middle" fill="#172B4D" fontSize="8" fontWeight="bold">
                    SMP 5 Bandung
                  </text>
                </g>

                {/* SD 1 Bandung */}
                <g
                  onClick={() =>
                    setSelectedNodeModal({
                      id: 'sd1bdg',
                      name: 'SD Negeri 1 Bandung',
                      type: 'SD',
                      color: '#10B981',
                      connections: 8,
                      location: 'Bandung, Jawa Barat',
                      programs: 6,
                      description: 'Sekolah dasar ramah anak dan percontohan program makan siang bergizi.',
                    })
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <circle cx="320" cy="310" r="10" fill="#10B981" />
                  <text x="320" y="328" textAnchor="middle" fill="#172B4D" fontSize="8" fontWeight="bold">
                    SD 1 Bandung
                  </text>
                </g>

                {/* SMK 2 Bandung */}
                <g
                  onClick={() =>
                    setSelectedNodeModal({
                      id: 'smk2bdg',
                      name: 'SMK Negeri 2 Bandung',
                      type: 'SMK',
                      color: '#EC4899',
                      connections: 16,
                      location: 'Bandung, Jawa Barat',
                      programs: 18,
                      description: 'SMK Pusat Keunggulan dengan kemitraan vokasi industri terakreditasi.',
                    })
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <circle cx="300" cy="270" r="11" fill="#EC4899" />
                  <text x="330" y="268" textAnchor="start" fill="#172B4D" fontSize="8" fontWeight="bold">
                    SMK 2 Bandung
                  </text>
                </g>

                {/* Small Satellite Nodes */}
                <circle cx="220" cy="80" r="6" fill="#0284C7" />
                <circle cx="520" cy="90" r="5" fill="#06B6D4" />
                <circle cx="530" cy="260" r="5" fill="#94A3B8" />
                <circle cx="260" cy="200" r="7" fill="#EC4899" />
                <circle cx="320" cy="140" r="6" fill="#F59E0B" />
              </svg>

              {/* Bottom Search & Control bar */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center bg-white/95 backdrop-blur-xs border border-[#DCE5EF] rounded-xl px-2.5 py-1 text-xs w-52 shadow-2xs">
                  <Search className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                  <input
                    type="text"
                    placeholder="Cari institusi..."
                    value={institutionSearch}
                    onChange={(e) => setInstitutionSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-[#172B4D] text-xs w-full"
                  />
                </div>

                <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xs border border-[#DCE5EF] rounded-xl p-0.5 shadow-2xs">
                  <button
                    onClick={() => setNetworkZoom((z) => Math.min(z + 0.2, 1.8))}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors cursor-pointer"
                    title="Perbesar"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setNetworkZoom((z) => Math.max(z - 0.2, 0.6))}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors cursor-pointer"
                    title="Perkecil"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setNetworkZoom(1)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors cursor-pointer"
                    title="Reset Zoom"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0F4F8] text-[11px] text-[#526579] flex items-center justify-between">
            <span>Klik nodus untuk detail institusi</span>
            <span className="font-semibold text-[#0F2942]">Jejaring Terkoneksi</span>
          </div>
        </div>
      </div>

      {/* 6. Bottom Row (3 Cards: Peta Arus + Top Kolaborasi + Jenis Hubungan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 1 (Col 1-5): Peta Alur Pendidikan per Provinsi */}
        <div className="lg:col-span-5 bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#172B4D]">
                    {activeTab === 'Teacher Mobility'
                      ? 'Peta Koridor Mobilitas Guru'
                      : activeTab === 'Student Pathway'
                      ? 'Peta Arus Migrasi Studi Lanjutan'
                      : 'Peta Alur Pendidikan per Provinsi'}
                  </h4>
                </div>
                <p className="text-[11px] text-[#526579] mt-1">
                  Menampilkan arus siswa antar jenjang dan mobilitas di setiap provinsi.
                </p>
              </div>
              <span className="text-xs font-bold text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded-lg">
                Indonesia
              </span>
            </div>

            <div className="mt-3 relative bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl h-[230px] overflow-hidden flex items-center justify-center">
              {/* Indonesia Map SVG with Flow Arcs */}
              <svg viewBox="0 0 600 280" className="w-full h-full">
                {/* Island shapes simplified */}
                <g fill="#93C5FD" stroke="#60A5FA" strokeWidth="1">
                  {/* Sumatra */}
                  <path d="M 60 70 L 120 140 L 140 180 L 120 190 L 80 140 L 40 90 Z" />
                  {/* Java */}
                  <path d="M 140 210 L 280 220 L 270 235 L 140 225 Z" fill="#60A5FA" />
                  {/* Kalimantan */}
                  <path d="M 190 100 L 260 90 L 280 150 L 210 160 Z" />
                  {/* Sulawesi */}
                  <path d="M 310 100 L 340 120 L 320 160 L 340 180 L 320 190 L 300 140 Z" />
                  {/* Papua */}
                  <path d="M 440 130 L 520 140 L 530 190 L 470 200 L 430 160 Z" />
                </g>

                {/* Flow Curved Arcs connecting provinces */}
                <g fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 2">
                  <path d="M 100 120 Q 150 160, 180 215" stroke="#F59E0B" />
                  <path d="M 230 130 Q 210 180, 200 215" stroke="#F59E0B" />
                  <path d="M 320 150 Q 260 190, 220 215" stroke="#F59E0B" />
                  <path d="M 460 160 Q 320 200, 240 220" stroke="#F59E0B" />
                  <path d="M 180 215 Q 220 205, 260 220" stroke="#0284C7" strokeWidth="2.5" />
                </g>

                {/* City / Hub Nodes */}
                <circle cx="180" cy="215" r="5" fill="#1E3A8A" />
                <circle cx="220" cy="218" r="4" fill="#0284C7" />
                <circle cx="260" cy="220" r="4" fill="#0284C7" />
                <circle cx="100" cy="120" r="3.5" fill="#0284C7" />
                <circle cx="230" cy="130" r="3.5" fill="#0284C7" />
                <circle cx="320" cy="150" r="3.5" fill="#0284C7" />
              </svg>

              {/* Legend card on bottom left */}
              <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs border border-[#DCE5EF] rounded-xl p-2 text-[9px] font-semibold space-y-1 shadow-2xs">
                <div className="text-gray-500 font-bold mb-1">Jumlah Siswa (arus keluar)</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
                  <span>&gt; 1.000.000</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>500.001 – 1.000.000</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                  <span>200.001 – 500.000</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                  <span>50.001 – 200.000</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#BAE6FD]" />
                  <span>≤ 50.000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-gray-400">
            Arus mobilitas dihitung dari data transisi Dapodik tahun {selectedYear}
          </div>
        </div>

        {/* Card 2 (Col 6-9): Top 10 Kolaborasi Institusi */}
        <div className="lg:col-span-4 bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E6F8F6] text-[#25A9A1] flex items-center justify-center font-bold">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#172B4D]">
                    {activeTab === 'Teacher Mobility'
                      ? 'Top Koridor Penempatan Guru'
                      : activeTab === 'Program Dependency'
                      ? 'Top Keterkaitan Program'
                      : activeTab === 'Student Pathway'
                      ? 'Top Sekolah ➔ PTN Penerima'
                      : 'Top 10 Kolaborasi Institusi'}
                  </h4>
                </div>
                <p className="text-[11px] text-[#526579] mt-1">Berdasarkan jumlah program kerja sama.</p>
              </div>
              <span className="text-xs font-bold text-[#25A9A1] bg-[#E6F8F6] px-2 py-0.5 rounded-lg">
                Top 10
              </span>
            </div>

            <div className="mt-2 overflow-y-auto max-h-[230px] border border-[#F1F5F9] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[10px] text-[#526579] font-bold border-b border-[#EDF2F7]">
                  <tr>
                    <th className="py-2 px-2.5 w-6 text-center">#</th>
                    <th className="py-2 px-2.5">Entitas A</th>
                    <th className="py-2 px-2.5">Entitas B</th>
                    <th className="py-2 px-2.5 text-right">Program</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-[11px]">
                  {topCollaborations.map((collab) => (
                    <tr
                      key={collab.id}
                      onClick={() =>
                        setSelectedNodeModal({
                          id: `collab-${collab.id}`,
                          name: `${collab.instA} ➔ ${collab.instB}`,
                          type: 'Universitas',
                          color: '#0284C7',
                          connections: collab.programs,
                          location: 'Indonesia',
                          programs: collab.programs,
                          description: `Kerjasama aktif antara ${collab.instA} dan ${collab.instB} dalam ${collab.programs} inisiatif bersama.`,
                        })
                      }
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="py-1.5 px-2.5 text-center text-gray-400 font-bold">{collab.id}</td>
                      <td className="py-1.5 px-2.5 font-semibold text-[#172B4D] truncate max-w-[95px]">
                        {collab.instA}
                      </td>
                      <td className="py-1.5 px-2.5 text-gray-600 truncate max-w-[95px]">{collab.instB}</td>
                      <td className="py-1.5 px-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="font-bold text-[#0284C7]">{collab.programs}</span>
                          <div className="w-10 h-1.5 bg-[#E0F2FE] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#0284C7] rounded-full"
                              style={{ width: `${(collab.programs / collab.max) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-gray-400">
            Diperbarui secara berkala melalui sistem kemitraan terpadu
          </div>
        </div>

        {/* Card 3 (Col 10-12): Jenis Hubungan */}
        <div className="lg:col-span-3 bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
              <div className="flex items-center gap-2">
                <span className="text-base">🤝</span>
                <h4 className="text-sm font-bold text-[#172B4D]">Jenis Hubungan</h4>
              </div>
              <span className="text-[11px] font-bold text-[#0F2942] bg-[#F1F5F9] px-2 py-0.5 rounded-lg">
                {relationTypes.length} Kategori
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {relationTypes.map((rel) => (
                <div key={rel.label}>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-[#172B4D] truncate max-w-[150px]">{rel.label}</span>
                    <span className="font-bold text-[#172B4D]">{rel.count}</span>
                  </div>
                  <div className="w-full h-2 bg-[#F1F5F9] rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(rel.count / rel.max) * 100}%`,
                        backgroundColor: rel.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0F4F8] text-[11px] text-[#526579] flex items-center justify-between">
            <span>Konektivitas Aktif</span>
            <span className="font-bold text-[#10B981]">Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* 7. MODAL INSPECTION DETAIL */}
      {selectedNodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#DCE5EF] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: selectedNodeModal.color }}
                />
                <span className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">
                  Detail Entitas Jejaring Pendidikan
                </span>
              </div>
              <button
                onClick={() => setSelectedNodeModal(null)}
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
                  style={{ backgroundColor: selectedNodeModal.color }}
                >
                  {selectedNodeModal.type}
                </span>
                <h3 className="text-lg font-bold text-[#172B4D] leading-snug">
                  {selectedNodeModal.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F5F8FC] rounded-xl border border-[#EDF2F7] text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">
                    Koneksi / Derajat Hubungan
                  </span>
                  <span className="font-semibold text-[#172B4D] mt-0.5 block text-sm">
                    {selectedNodeModal.connections} Mitra Aktif
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">
                    Inisiatif & Program
                  </span>
                  <span className="font-semibold text-[#172B4D] mt-0.5 block text-sm">
                    {selectedNodeModal.programs} Program Bersama
                  </span>
                </div>

                <div className="col-span-2 pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">
                    Lokasi / Cakupan Wilayah
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[#172B4D] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#25A9A1]" />
                    <span>{selectedNodeModal.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-1">
                  Keterangan Profil Jejaring
                </h4>
                <p className="text-xs text-[#526579] leading-relaxed">
                  {selectedNodeModal.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end gap-2">
              <button
                onClick={() => setSelectedNodeModal(null)}
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
