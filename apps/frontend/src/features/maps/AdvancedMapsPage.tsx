import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { IndonesiaMap, IslandKey } from '../../components/common/IndonesiaMap';
import regionalStatsData from '../../constants/regionalStats.json';
import {
  Search,
  Filter,
  Plus,
  Minus,
  Crosshair,
  Layers,
  School,
  Users,
  UserCheck,
  GraduationCap,
  ChevronDown,
  X,
  MapPin,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface IslandRegionalStat {
  name: string;
  totalSchools: number;
  sd: number;
  smp: number;
  sma: number;
  smk: number;
  students: string;
  teachers: string;
  universities: number;
}

const REGIONAL_STATS: Record<string, IslandRegionalStat> = regionalStatsData;

export const AdvancedMapsPage: React.FC = () => {
  const { period, setPeriod } = useOutletContext<{ period: string; setPeriod: (p: string) => void }>();
  const [activeCategory, setActiveCategory] = useState<string>('Choropleth');
  const [selectedMetric, setSelectedMetric] = useState<string>('sekolah');
  const [selectedIsland, setSelectedIsland] = useState<IslandKey | null>(null);
  const [radiusCenter, setRadiusCenter] = useState<string>('Kota Bandung');
  const [radiusKm, setRadiusKm] = useState<string>('25 km');
  const [searchMapQuery, setSearchMapQuery] = useState<string>('');

  const categories = [
    'Choropleth',
    'Heatmap',
    'Point Density',
    'Boundary Layer',
    'Radius Analysis',
    'Region Comparison',
    'Flow Map',
    'Other',
  ];

  // Comparison Bar Chart
  const comparisonData = [
    { province: 'Jawa Barat', SD: 8.4, SMP: 4.8, SMA: 3.6, SMK: 1.3 },
    { province: 'Jawa Timur', SD: 7.2, SMP: 4.1, SMA: 2.9, SMK: 1.4 },
    { province: 'Jawa Tengah', SD: 5.8, SMP: 3.4, SMA: 2.4, SMK: 1.1 },
    { province: 'DKI Jakarta', SD: 3.2, SMP: 2.1, SMA: 1.8, SMK: 0.9 },
    { province: 'Sumatera Utara', SD: 3.6, SMP: 1.9, SMA: 1.4, SMK: 0.7 },
  ];

  // Metric options with labels
  const metricOptions = [
    { id: 'sekolah', label: 'Jumlah Sekolah' },
    { id: 'siswa', label: 'Jumlah Siswa' },
    { id: 'guru', label: 'Jumlah Guru' },
    { id: 'univ', label: 'Jumlah Universitas' },
    { id: 'rasio', label: 'Rasio Guru : Siswa' },
  ];

  // Metric-dependent fills for IndonesiaMap
  const getFillsByMetric = (): Partial<Record<IslandKey, string>> => {
    switch (selectedMetric) {
      case 'siswa':
        return {
          jawa: '#153B66',
          sumatera: '#25A9A1',
          sulawesi: '#0284C7',
          kalimantan: '#0284C7',
          papua: '#8ED8E4',
          bali: '#38BDF8',
          ntb: '#BAE6FD',
          ntt: '#BAE6FD',
          maluku: '#BAE6FD',
          malukuUtara: '#BAE6FD',
          bangka: '#BAE6FD',
        };
      case 'guru':
        return {
          jawa: '#153B66',
          sumatera: '#25A9A1',
          sulawesi: '#0284C7',
          kalimantan: '#0284C7',
          papua: '#8ED8E4',
          bali: '#38BDF8',
          ntb: '#BAE6FD',
          ntt: '#BAE6FD',
          maluku: '#BAE6FD',
          malukuUtara: '#BAE6FD',
          bangka: '#BAE6FD',
        };
      case 'univ':
        return {
          jawa: '#153B66',
          sumatera: '#25A9A1',
          sulawesi: '#0284C7',
          kalimantan: '#0284C7',
          papua: '#8ED8E4',
          bali: '#38BDF8',
          ntb: '#BAE6FD',
          ntt: '#BAE6FD',
          maluku: '#BAE6FD',
          malukuUtara: '#BAE6FD',
          bangka: '#BAE6FD',
        };
      case 'rasio':
        return {
          jawa: '#153B66',
          sumatera: '#25A9A1',
          sulawesi: '#0284C7',
          kalimantan: '#0284C7',
          papua: '#38BDF8',
          bali: '#8ED8E4',
          ntb: '#BAE6FD',
          ntt: '#BAE6FD',
          maluku: '#BAE6FD',
          malukuUtara: '#BAE6FD',
          bangka: '#BAE6FD',
        };
      case 'sekolah':
      default:
        return {
          jawa: '#153B66',
          sumatera: '#25A9A1',
          sulawesi: '#0284C7',
          kalimantan: '#0284C7',
          papua: '#38BDF8',
          bali: '#8ED8E4',
          ntb: '#BAE6FD',
          ntt: '#BAE6FD',
          maluku: '#BAE6FD',
          malukuUtara: '#BAE6FD',
          bangka: '#BAE6FD',
        };
    }
  };

  const selectedStats = selectedIsland ? REGIONAL_STATS[selectedIsland] : null;

  const handleIslandSelect = (island: IslandKey) => {
    setSelectedIsland((prev) => (prev === island ? null : island));
  };

  return (
    <div className="space-y-6">
      {/* Universal Page Header */}
      <PageHeader
        title="Advanced Maps"
        subtitle="Analisis geospasial pendidikan dengan layer data, heatmap, perbandingan wilayah, dan visualisasi spasial yang interaktif."
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Top 2 Columns Row: 1. Ringkasan Nasional & 2. Top 5 Provinsi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom 1: Ringkasan Nasional */}
        <div data-testid="ringkasan-nasional-card" className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#153B66] font-heading flex items-center gap-1.5">
              <School className="w-4 h-4 text-[#25A9A1]" />
              Ringkasan Nasional
            </h4>
            <p className="text-xs text-[#526579] mt-0.5">
              Total agregat metrik spasial pendidikan seluruh Indonesia
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-[#DCE5EF] bg-[#F8FAFC]">
              <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-1">
                <School className="w-4 h-4" />
              </div>
              <p className="text-[10px] text-[#526579]">Total Sekolah</p>
              <h5 className="text-base font-extrabold text-[#153B66]">125.482</h5>
              <p className="text-[9px] text-[#16835D] font-bold">↑ 2,8% YoY</p>
            </div>

            <div className="p-3 rounded-xl border border-[#DCE5EF] bg-[#F8FAFC]">
              <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mb-1">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-[10px] text-[#526579]">Total Siswa</p>
              <h5 className="text-base font-extrabold text-[#153B66]">42.560.321</h5>
              <p className="text-[9px] text-[#16835D] font-bold">↑ 3,1% YoY</p>
            </div>

            <div className="p-3 rounded-xl border border-[#DCE5EF] bg-[#F8FAFC]">
              <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center mb-1">
                <UserCheck className="w-4 h-4" />
              </div>
              <p className="text-[10px] text-[#526579]">Total Guru</p>
              <h5 className="text-base font-extrabold text-[#153B66]">2.843.921</h5>
              <p className="text-[9px] text-[#16835D] font-bold">↑ 1,9% YoY</p>
            </div>

            <div className="p-3 rounded-xl border border-[#DCE5EF] bg-[#F8FAFC]">
              <div className="w-8 h-8 rounded-lg bg-[#CCFBF1] text-[#0D9488] flex items-center justify-center mb-1">
                <GraduationCap className="w-4 h-4" />
              </div>
              <p className="text-[10px] text-[#526579]">Total Universitas</p>
              <h5 className="text-base font-extrabold text-[#153B66]">3.216</h5>
              <p className="text-[9px] text-[#16835D] font-bold">↑ 4,5% YoY</p>
            </div>
          </div>
        </div>

        {/* Kolom 2: Top 5 Provinsi (Jumlah Sekolah) */}
        <div data-testid="top-5-provinsi-card" className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#153B66] font-heading">
                Top 5 Provinsi (Jumlah Sekolah)
              </h4>
              <p className="text-xs text-[#526579] mt-0.5">
                Peringkat provinsi dengan fasilitas pendidikan tertinggi
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#153B66] bg-[#F8FAFC] border border-[#DCE5EF] px-2.5 py-1 rounded-lg">
              Tahun {period}
            </span>
          </div>
          <div className="space-y-2 text-xs">
            {[
              { rank: 1, name: 'Jawa Barat', val: '18.254', w: '90%' },
              { rank: 2, name: 'Jawa Timur', val: '15.892', w: '78%' },
              { rank: 3, name: 'Jawa Tengah', val: '12.840', w: '62%' },
              { rank: 4, name: 'DKI Jakarta', val: '8.412', w: '42%' },
              { rank: 5, name: 'Sumatera Utara', val: '7.621', w: '35%' },
            ].map((p) => (
              <div key={p.rank} className="flex items-center justify-between gap-2">
                <span className="w-3 text-[#526579] font-semibold">{p.rank}</span>
                <span className="w-28 font-semibold text-[#172B4D] truncate">{p.name}</span>
                <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#25A9A1] rounded-full" style={{ width: p.w }} />
                </div>
                <span className="w-16 text-right font-bold text-[#153B66]">{p.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills (Filter Mode Geospasial) */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            data-testid={`category-${cat}`}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#0F2942] text-white shadow-xs font-bold'
                : 'bg-white border border-[#DCE5EF] text-[#526579] hover:bg-[#F8FAFC] hover:text-[#0F2942]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Middle Full-Width Map Container */}
      <div className="bg-white border border-[#DCE5EF] rounded-2xl overflow-hidden shadow-2xs flex flex-col relative h-[560px] w-full">
        {/* Map Top Bar */}
        <div className="p-3 bg-white/95 backdrop-blur-xs border-b border-[#F1F5F9] z-20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center bg-[#F8FAFC] border border-[#DCE5EF] rounded-xl px-3 py-1.5 flex-1 max-w-md text-xs">
            <Search className="w-3.5 h-3.5 text-[#526579] mr-2 shrink-0" />
            <input
              type="text"
              value={searchMapQuery}
              onChange={(e) => setSearchMapQuery(e.target.value)}
              placeholder="Cari pulau atau wilayah (Jawa, Sumatera, Papua...)"
              className="bg-transparent border-none outline-none text-[#172B4D] w-full placeholder:text-[#94A3B8]"
            />
            {searchMapQuery && (
              <button
                type="button"
                onClick={() => setSearchMapQuery('')}
                className="text-[#94A3B8] hover:text-[#172B4D] ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Metric Selector Dropdown/Tabs */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#526579] font-medium hidden sm:inline">Metrik Spasial:</span>
            <div className="flex items-center bg-[#F8FAFC] border border-[#DCE5EF] rounded-xl px-2.5 py-1">
              <select
                aria-label="Pilih Metrik Peta"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="bg-transparent border-none outline-none font-semibold text-[#153B66] cursor-pointer text-xs"
              >
                {metricOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Map Canvas with Interactive IndonesiaMap */}
        <div className="flex-1 w-full bg-[#F5F8FC] relative p-4 flex items-center justify-center overflow-hidden">
          {/* Map Controls (Zoom / Center / Layers) */}
          <div className="absolute top-4 left-4 flex flex-col bg-white border border-[#DCE5EF] rounded-xl shadow-xs z-20 overflow-hidden">
            <button
              type="button"
              aria-label="Perbesar"
              className="p-2 hover:bg-[#F8FAFC] text-[#526579] border-b border-[#DCE5EF] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              aria-label="Perkecil"
              className="p-2 hover:bg-[#F8FAFC] text-[#526579] border-b border-[#DCE5EF] cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              aria-label="Reset Pusat"
              onClick={() => setSelectedIsland(null)}
              className="p-2 hover:bg-[#F8FAFC] text-[#526579] border-b border-[#DCE5EF] cursor-pointer"
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              aria-label="Lapisan Peta"
              className="p-2 hover:bg-[#F8FAFC] text-[#526579] cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Indonesia Map SVG */}
          <IndonesiaMap
            className="w-full h-full max-h-[460px] object-contain select-none"
            fills={getFillsByMetric()}
            interactive={true}
            selectedIsland={selectedIsland}
            onIslandClick={handleIslandSelect}
          />

          {/* Single Detail Popup Card in Top-Right (No Double Popup) */}
          {selectedIsland && selectedStats ? (
            <div
              data-testid="island-detail-card"
              className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#DCE5EF] p-4 text-xs w-72 sm:w-80 z-20 animate-in fade-in zoom-in-95"
            >
              <div className="flex items-start justify-between border-b border-[#F1F5F9] pb-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#25A9A1] bg-[#E0F7F6] px-2 py-0.5 rounded-md">
                    Wilayah Geospasial
                  </span>
                  <h4 className="font-bold text-[#153B66] text-sm mt-1 leading-snug">
                    {selectedStats.name}
                  </h4>
                  <span className="text-[11px] text-[#526579] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#25A9A1] shrink-0" /> Wilayah Kepulauan Indonesia
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Tutup Detail"
                  onClick={() => setSelectedIsland(null)}
                  className="text-[#94A3B8] hover:text-[#172B4D] p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[#526579]">
                  <span>Total Sekolah:</span>
                  <span className="font-bold text-[#172B4D] text-right">
                    {selectedStats.totalSchools.toLocaleString('id-ID')}
                  </span>
                  <span>Total Siswa:</span>
                  <span className="font-bold text-[#172B4D] text-right">{selectedStats.students}</span>
                  <span>Total Guru:</span>
                  <span className="font-bold text-[#172B4D] text-right">{selectedStats.teachers}</span>
                  <span>Perguruan Tinggi:</span>
                  <span className="font-bold text-[#172B4D] text-right">{selectedStats.universities} unit</span>
                  <span>Metrik Terpilih:</span>
                  <span className="font-bold text-[#16835D] text-right">
                    {metricOptions.find((m) => m.id === selectedMetric)?.label}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#F1F5F9]">
                  <span className="text-[10px] text-[#526579] font-medium block mb-1">
                    Rincian Jenjang Sekolah:
                  </span>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
                    <div className="bg-[#F8FAFC] border border-[#DCE5EF] p-1 rounded-md">
                      <span className="text-[#526579] block">SD</span>
                      <strong className="text-[#153B66]">{selectedStats.sd.toLocaleString('id-ID')}</strong>
                    </div>
                    <div className="bg-[#F8FAFC] border border-[#DCE5EF] p-1 rounded-md">
                      <span className="text-[#526579] block">SMP</span>
                      <strong className="text-[#25A9A1]">{selectedStats.smp.toLocaleString('id-ID')}</strong>
                    </div>
                    <div className="bg-[#F8FAFC] border border-[#DCE5EF] p-1 rounded-md">
                      <span className="text-[#526579] block">SMA</span>
                      <strong className="text-[#FFC857]">{selectedStats.sma.toLocaleString('id-ID')}</strong>
                    </div>
                    <div className="bg-[#F8FAFC] border border-[#DCE5EF] p-1 rounded-md">
                      <span className="text-[#526579] block">SMK</span>
                      <strong className="text-[#9333EA]">{selectedStats.smk.toLocaleString('id-ID')}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Helpful Hint in Top-Right initially */
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs rounded-xl shadow-xs border border-[#DCE5EF] px-3.5 py-2 text-[11px] text-[#526579] z-20 pointer-events-none flex items-center gap-1.5">
              <span>💡 Klik salah satu pulau pada peta untuk melihat detail data analitik</span>
            </div>
          )}

          {/* Bottom Left Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs border border-[#DCE5EF] rounded-xl p-2.5 text-[10px] space-y-1 z-20 shadow-xs">
            <p className="font-bold text-[#153B66] mb-1">
              Tingkat Kepadatan: {metricOptions.find((m) => m.id === selectedMetric)?.label}
            </p>
            <div className="flex items-center gap-2">
              <span className="w-3 h-2 rounded-xs bg-[#153B66]" /> Sangat Tinggi (&gt; 25.000)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-2 rounded-xs bg-[#25A9A1]" /> Tinggi (10.001 – 25.000)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-2 rounded-xs bg-[#0284C7]" /> Sedang (5.001 – 10.000)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-2 rounded-xs bg-[#38BDF8]" /> Berkembang (2.001 – 5.000)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-2 rounded-xs bg-[#BAE6FD]" /> Awal (≤ 2.000)
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 3 Cards (Heatmap, Comparison, Radius) - Unchanged 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Heatmap Kepadatan Sekolah */}
        <div data-testid="heatmap-card" className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#153B66] font-heading">Heatmap Kepadatan Sekolah</h4>
              <p className="text-[11px] text-[#526579]">Konsentrasi lokasi sekolah di pulau Jawa.</p>
            </div>
            <span className="text-[10px] text-[#526579] font-semibold border border-[#DCE5EF] px-2 py-0.5 rounded cursor-pointer">
              Semua Jenjang ⌄
            </span>
          </div>
          <div className="h-36 bg-[#F5F8FC] rounded-xl relative overflow-hidden flex items-center justify-center p-2 border border-[#DCE5EF]">
            {/* Java Heatmap SVG simulation */}
            <svg viewBox="0 0 300 100" className="w-full h-full">
              <path d="M20,50 Q80,40 140,55 T260,60 L270,75 L20,70 Z" fill="#90E0EF" opacity="0.6" />
              <circle cx="60" cy="52" r="16" fill="#EF4444" opacity="0.8" filter="blur(4px)" />
              <circle cx="110" cy="55" r="18" fill="#F59E0B" opacity="0.8" filter="blur(4px)" />
              <circle cx="170" cy="58" r="14" fill="#EAB308" opacity="0.8" filter="blur(4px)" />
              <circle cx="230" cy="62" r="16" fill="#EF4444" opacity="0.8" filter="blur(4px)" />
              <text x="45" y="35" fontSize="8" fontWeight="bold" fill="#153B66">DKI Jakarta</text>
              <text x="95" y="40" fontSize="8" fontWeight="bold" fill="#153B66">Jawa Barat</text>
              <text x="160" y="42" fontSize="8" fontWeight="bold" fill="#153B66">Jawa Tengah</text>
              <text x="225" y="46" fontSize="8" fontWeight="bold" fill="#153B66">Jawa Timur</text>
            </svg>
            <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[9px] text-[#526579]">
              <span>Rendah</span>
              <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-cyan-300 via-amber-400 to-rose-500" />
              <span>Tinggi</span>
            </div>
          </div>
        </div>

        {/* 2. Perbandingan Antar Provinsi */}
        <div data-testid="comparison-card" className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#153B66] font-heading">Perbandingan Antar Provinsi</h4>
              <p className="text-[11px] text-[#526579]">Bandingkan indikator pendidikan antar provinsi.</p>
            </div>
            <span className="text-[10px] text-[#526579] font-semibold border border-[#DCE5EF] px-2 py-0.5 rounded cursor-pointer">
              Jumlah Siswa (Jt) ⌄
            </span>
          </div>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="province" stroke="#94A3B8" fontSize={8} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={8} tickLine={false} tickFormatter={(v) => `${v}jt`} />
                <Bar dataKey="SD" fill="#153B66" radius={[2, 2, 0, 0]} />
                <Bar dataKey="SMP" fill="#25A9A1" radius={[2, 2, 0, 0]} />
                <Bar dataKey="SMA" fill="#FFC857" radius={[2, 2, 0, 0]} />
                <Bar dataKey="SMK" fill="#8ED8E4" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Analisis Radius */}
        <div data-testid="radius-card" className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#153B66] font-heading">Analisis Radius</h4>
              <p className="text-[11px] text-[#526579]">Lihat institusi dalam radius tertentu.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2 text-[10px]">
            <select
              aria-label="Pusat Radius"
              value={radiusCenter}
              onChange={(e) => setRadiusCenter(e.target.value)}
              className="bg-white border border-[#DCE5EF] rounded px-2 py-0.5 text-[#172B4D] font-medium"
            >
              <option value="Kota Bandung">Kota Bandung</option>
              <option value="Jakarta Pusat">Jakarta Pusat</option>
              <option value="Surabaya">Surabaya</option>
            </select>
            <select
              aria-label="Jarak Radius"
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
              className="bg-white border border-[#DCE5EF] rounded px-2 py-0.5 text-[#172B4D] font-medium"
            >
              <option value="25 km">25 km</option>
              <option value="50 km">50 km</option>
              <option value="100 km">100 km</option>
            </select>
          </div>
          <div className="h-28 bg-[#F8FAFC] border border-[#DCE5EF] rounded-xl flex items-center justify-between p-3 relative">
            <div className="w-20 h-20 rounded-full border border-dashed border-[#25A9A1] bg-[#CCFBF1]/30 flex items-center justify-center relative">
              <div className="w-10 h-10 rounded-full border border-[#25A9A1] bg-[#CCFBF1]/50 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              </div>
            </div>
            <div className="space-y-1 text-[10px] text-[#526579]">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#153B66]" /> SD: <strong>124</strong></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#25A9A1]" /> SMP: <strong>86</strong></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FFC857]" /> SMA: <strong>45</strong></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#9333EA]" /> SMK: <strong>32</strong></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Univ: <strong>8</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
