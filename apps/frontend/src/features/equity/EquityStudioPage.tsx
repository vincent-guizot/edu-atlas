import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import {
  Scale,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  Shield,
  Layers,
  ArrowUpDown,
  Building,
  GraduationCap,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  DISPARITY_3T_SNAPSHOT,
  RegencyItem,
} from '../../constants/expansion.constants';
import { expansionService } from '../../services/expansion.service';

const KMEANS_COLORS = ['#25A9A1', '#3B82F6', '#EF4444'];

export const EquityStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'regencies' | 'affirmation'>('overview');
  const [allRegencies, setAllRegencies] = useState<RegencyItem[]>(DISPARITY_3T_SNAPSHOT.regencies);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter3TOnly, setFilter3TOnly] = useState(false);
  const [selectedIsland, setSelectedIsland] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Load all 514 regencies from json asset
  useEffect(() => {
    let isMounted = true;
    expansionService.getAll514Regencies().then((data) => {
      if (isMounted && data && data.length > 0) {
        setAllRegencies(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const summary = DISPARITY_3T_SNAPSHOT.summary;

  // K-Means Pie Chart Data
  const kmeansPieData = useMemo(() => {
    return Object.entries(summary.kmeansClusters).map(([name, value]) => ({
      name,
      value,
    }));
  }, [summary]);

  // Radar SPM Comparison Data
  const spmRadarData = useMemo(() => {
    return DISPARITY_3T_SNAPSHOT.spm5Pillars.map((p) => ({
      pillar: p.pillar,
      'Wilayah Non-3T': p.scoreNon3T,
      'Wilayah 3T': p.score3T,
      'Standar Minimal': p.standardMin,
    }));
  }, []);

  // Filtered 514 Regencies List
  const filteredRegencies = useMemo(() => {
    return allRegencies.filter((r) => {
      const matchSearch =
        r.regencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.provinceName.toLowerCase().includes(searchQuery.toLowerCase());
      const match3T = filter3TOnly ? r.is3T : true;
      const matchIsland = selectedIsland === 'Semua' ? true : r.islandGroup === selectedIsland;
      return matchSearch && match3T && matchIsland;
    });
  }, [allRegencies, searchQuery, filter3TOnly, selectedIsland]);

  const totalPages = Math.ceil(filteredRegencies.length / pageSize);
  const paginatedRegencies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRegencies.slice(start, start + pageSize);
  }, [filteredRegencies, currentPage, pageSize]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter3TOnly, selectedIsland]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Studio Disparitas & Intervensi 3T"
        subtitle="Analisis kesenjangan pendidikan regional, klaster K-Means (K=3), dan pemetaan 514 Kabupaten/Kota se-Indonesia"
      />

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-xl p-4.5 border border-[#EAF0F6] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#526579]">Kabupaten/Kota Terdata</span>
            <div className="w-8 h-8 rounded-lg bg-[#E6F8F6] text-[#25A9A1] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#153B66] tracking-tight">514</span>
            <span className="text-xs text-[#526579]">Daerah</span>
          </div>
          <p className="text-[11px] text-[#526579] mt-1">
            Mencakup 38 Provinsi & 6 Gugus Pulau
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl p-4.5 border border-[#EAF0F6] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#526579]">Kategori Wilayah 3T</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-700 tracking-tight">
              {summary.total3TRegencies}
            </span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
              {summary.percentage3T}% Nasional
            </span>
          </div>
          <p className="text-[11px] text-[#526579] mt-1">
            Penetapan Perpres 63/2020 & Perbatasan
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl p-4.5 border border-[#EAF0F6] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#526579]">Kesenjangan SPM Tertinggi</span>
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#153B66] tracking-tight">50,6%</span>
            <span className="text-xs font-bold text-rose-600">Selisih Gap</span>
          </div>
          <p className="text-[11px] text-[#526579] mt-1">
            Pilar Akses Listrik & Jaringan Internet
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-xl p-4.5 border border-[#EAF0F6] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#526579]">Klaster Prioritas Intervensi</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#153B66] tracking-tight">Tier 3</span>
            <span className="text-xs text-[#526579]">87 Sekolah Sampel</span>
          </div>
          <p className="text-[11px] text-[#526579] mt-1">
            Penerima BOS Afirmasi & DAK Fisik 2026
          </p>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 bg-[#F1F5F9] p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-white text-[#153B66] shadow-sm'
              : 'text-[#526579] hover:text-[#172B4D]'
          }`}
        >
          Analisis Disparitas & Klaster ML
        </button>
        <button
          onClick={() => setActiveTab('regencies')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'regencies'
              ? 'bg-white text-[#153B66] shadow-sm'
              : 'text-[#526579] hover:text-[#172B4D]'
          }`}
        >
          Direktori 514 Kabupaten/Kota ({allRegencies.length})
        </button>
        <button
          onClick={() => setActiveTab('affirmation')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'affirmation'
              ? 'bg-white text-[#153B66] shadow-sm'
              : 'text-[#526579] hover:text-[#172B4D]'
          }`}
        >
          Matriks Intervensi Afirmatif
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CLUSTERS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Radar Chart 5 Pilar SPM (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#EAF0F6] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#153B66]">
                  Radar 5 Pilar Standar Pelayanan Minimal (SPM)
                </h3>
                <p className="text-xs text-[#526579]">
                  Perbandingan capaian pemenuhan standar mutu antara daerah 3T vs Non-3T
                </p>
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={spmRadarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 10, fill: '#172B4D', fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar
                    name="Wilayah Non-3T"
                    dataKey="Wilayah Non-3T"
                    stroke="#25A9A1"
                    fill="#25A9A1"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="Wilayah 3T"
                    dataKey="Wilayah 3T"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.3}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #EAF0F6' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-[11px] text-[#526579] space-y-1">
              <strong className="text-[#153B66]">Temuan Utama SPM:</strong>
              <p>
                Kesenjangan terbesar terdapat pada akses infrastruktur digital/listrik (gap 50,6%) dan sanitasi layak (gap 49,4%), yang berdampak langsung pada terhambatnya asesmen nasional berbasis komputer (ANBK) di daerah 3T.
              </p>
            </div>
          </div>

          {/* K-Means Clusters & Island Breakdown (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* K-Means Donut */}
            <div className="bg-white rounded-xl border border-[#EAF0F6] p-5 shadow-sm space-y-3">
              <div className="border-b border-[#F1F5F9] pb-3">
                <h3 className="text-sm font-bold text-[#153B66]">
                  Segmentasi K-Means Disparitas (K=3)
                </h3>
                <p className="text-xs text-[#526579]">
                  Model ML terlatih dari feature store 300 sekolah sampel
                </p>
              </div>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={kmeansPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {kmeansPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={KMEANS_COLORS[index % KMEANS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [`${val} Sekolah`, name]}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #EAF0F6' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-1">
                {kmeansPieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: KMEANS_COLORS[idx] }} />
                      <span className="text-[#172B4D] font-medium">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-[#153B66]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Island Comparison Card */}
            <div className="bg-white rounded-xl border border-[#EAF0F6] p-4 shadow-sm">
              <h4 className="text-xs font-bold text-[#153B66] uppercase tracking-wider mb-2">
                Proporsi Wilayah 3T per Gugus Pulau
              </h4>
              <div className="space-y-2">
                {DISPARITY_3T_SNAPSHOT.islandComparison.map((i) => (
                  <div key={i.island} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium text-[#172B4D]">{i.island}</span>
                      <span className="font-bold text-[#526579]">{i.ratio3T}% (3T)</span>
                    </div>
                    <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${i.ratio3T}%`,
                          backgroundColor: i.ratio3T > 50 ? '#EF4444' : (i.ratio3T > 20 ? '#F59E0B' : '#25A9A1'),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 514 REGENCIES DIRECTORY */}
      {activeTab === 'regencies' && (
        <div className="bg-white rounded-xl border border-[#EAF0F6] p-5 shadow-sm space-y-4">
          {/* Controls Strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-[#526579] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari Kabupaten / Kota / Provinsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-medium pl-8 pr-3 py-1.5 border border-[#DCE5EF] rounded-lg text-[#172B4D] focus:outline-none focus:ring-1 focus:ring-[#25A9A1]"
                />
              </div>

              {/* Island Filter */}
              <select
                value={selectedIsland}
                onChange={(e) => setSelectedIsland(e.target.value)}
                className="text-xs font-medium border border-[#DCE5EF] rounded-lg px-2.5 py-1.5 text-[#172B4D] focus:outline-none focus:ring-1 focus:ring-[#25A9A1]"
              >
                <option value="Semua">Semua Pulau</option>
                <option value="Jawa">Jawa</option>
                <option value="Sumatera">Sumatera</option>
                <option value="Bali & Nusa Tenggara">Bali & Nusa Tenggara</option>
                <option value="Kalimantan">Kalimantan</option>
                <option value="Sulawesi">Sulawesi</option>
                <option value="Maluku & Papua">Maluku & Papua</option>
              </select>

              {/* 3T Toggle */}
              <button
                onClick={() => setFilter3TOnly(!filter3TOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  filter3TOnly
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-[#F8FAFC] border border-[#DCE5EF] text-[#526579] hover:text-[#172B4D]'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Hanya Daerah 3T
              </button>
            </div>

            <div className="text-xs text-[#526579]">
              Ditemukan <strong className="text-[#153B66]">{filteredRegencies.length}</strong> daerah
            </div>
          </div>

          {/* Regencies Table */}
          <div className="overflow-x-auto border border-[#EAF0F6] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#526579] font-bold border-b border-[#EAF0F6]">
                <tr>
                  <th className="py-2.5 px-3">Kabupaten / Kota</th>
                  <th className="py-2.5 px-3">Provinsi</th>
                  <th className="py-2.5 px-3">Status 3T</th>
                  <th className="py-2.5 px-3">IPM</th>
                  <th className="py-2.5 px-3">Kemiskinan</th>
                  <th className="py-2.5 px-3">Rasio Murid:Guru</th>
                  <th className="py-2.5 px-3">Skor Fasilitas</th>
                  <th className="py-2.5 px-3">Intervensi Prioritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {paginatedRegencies.map((reg) => (
                  <tr key={reg.regencyId} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#153B66]">
                      {reg.regencyName}
                    </td>
                    <td className="py-2.5 px-3 text-[#526579]">{reg.provinceName}</td>
                    <td className="py-2.5 px-3">
                      {reg.is3T ? (
                        <span className="inline-block bg-rose-50 text-rose-700 font-extrabold text-[10px] px-2 py-0.5 rounded border border-rose-200">
                          Wilayah 3T
                        </span>
                      ) : (
                        <span className="inline-block bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded">
                          Reguler
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#172B4D]">{reg.ipmScore}</td>
                    <td className="py-2.5 px-3 text-[#526579]">{reg.povertyRate}%</td>
                    <td className="py-2.5 px-3 font-bold text-[#172B4D]">{reg.studentTeacherRatio} : 1</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-bold ${
                          reg.facilityScore < 60 ? 'text-rose-600' : 'text-[#25A9A1]'
                        }`}
                      >
                        {reg.facilityScore} / 100
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[11px] font-medium text-[#153B66]">
                        {reg.priorityIntervention}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-[#526579]">
                Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded border border-[#DCE5EF] text-[#526579] disabled:opacity-40 hover:bg-[#F8FAFC]"
                >
                  Sebelumnya
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded border border-[#DCE5EF] text-[#526579] disabled:opacity-40 hover:bg-[#F8FAFC]"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AFFIRMATION MATRIX */}
      {activeTab === 'affirmation' && (
        <div className="bg-white rounded-xl border border-[#EAF0F6] p-5 shadow-sm space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3">
            <h3 className="text-sm font-bold text-[#153B66]">
              Matriks Alokasi Kebijakan Afirmasi 2026
            </h3>
            <p className="text-xs text-[#526579]">
              Kriteria penyaluran Dana BOS Afirmasi, BOS Kinerja, dan DAK Fisik berbasis skor kemiskinan dan sarpras
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-extrabold text-emerald-900">1. BOS Afirmasi Prioritas 1</h4>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                Ditujukan untuk 74 daerah 3T dengan skor fasilitas di bawah 55. Memberikan tambahan unit cost Rp 1,8 Juta per murid untuk pengadaan buku cetak dan genset/panel surya.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#3B82F6]" />
                <h4 className="text-xs font-extrabold text-blue-900">2. BOS Kinerja Kemajuan Terbaik</h4>
              </div>
              <p className="text-xs text-blue-950 leading-relaxed">
                Diberikan kepada 114 sekolah di Tier 2 yang berhasil meningkatkan skor literasi/numerasi Rapor Pendidikan lebih dari 15% dibanding tahun sebelumnya.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <h4 className="text-xs font-extrabold text-amber-900">3. DAK Fisik Tematik Vokasi & 3T</h4>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                Prioritas revitalisasi 1.200 laboratorium komputer satelit di Papua, Maluku, dan NTT yang terkoneksi langsung dengan satelit SATRIA-1.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
