import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { IndonesiaMap } from '../../components/common/IndonesiaMap';
import { Grid, LayoutList, MoreHorizontal, ChevronDown, Plus, Minus } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export const AdvancedVisualizationPage: React.FC = () => {
  const { period, setPeriod } = useOutletContext<{ period: string; setPeriod: (p: string) => void }>();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [viewMode, setViewMode] = useState<'grid' | 'gallery'>('grid');

  const categories = [
    'Semua',
    'Heatmap',
    'Treemap',
    'Sankey',
    'Radar',
    'Gauge',
    'Scatter',
    'Calendar Heatmap',
    'Parallel',
    'Other',
  ];

  // 1. Heatmap Config
  const heatmapHours = ['Sumatera', 'Jawa', 'Kalimantan', 'Sulawesi', 'Bali-Nusa', 'Maluku', 'Papua'];
  const heatmapDays = ['SMK', 'SMA', 'SMP', 'SD'];
  const heatmapData = [
    [0, 3, 280], [1, 3, 520], [2, 3, 150], [3, 3, 190], [4, 3, 90], [5, 3, 40], [6, 3, 60],
    [0, 2, 180], [1, 2, 420], [2, 2, 90], [3, 2, 120], [4, 2, 60], [5, 2, 30], [6, 2, 40],
    [0, 1, 90], [1, 1, 320], [2, 1, 60], [3, 1, 80], [4, 1, 40], [5, 1, 20], [6, 1, 25],
    [0, 0, 70], [1, 0, 290], [2, 0, 50], [3, 0, 70], [4, 0, 35], [5, 0, 15], [6, 0, 20],
  ];

  const heatmapOption = {
    tooltip: { position: 'top' },
    grid: { top: '5%', bottom: '25%', left: '15%', right: '15%' },
    xAxis: {
      type: 'category',
      data: heatmapHours,
      splitArea: { show: true },
      axisLabel: { fontSize: 9, interval: 0 },
    },
    yAxis: {
      type: 'category',
      data: heatmapDays,
      splitArea: { show: true },
      axisLabel: { fontSize: 9 },
    },
    visualMap: {
      min: 10,
      max: 500,
      calculable: false,
      orient: 'vertical',
      right: 0,
      top: 'center',
      itemWidth: 10,
      itemHeight: 70,
      inRange: { color: ['#E0F2FE', '#38BDF8', '#0284C7', '#0F4C5C'] },
      text: ['> 500K', '< 10K'],
      textStyle: { fontSize: 8 },
    },
    series: [
      {
        name: 'Jumlah Siswa',
        type: 'heatmap',
        data: heatmapData,
        label: { show: false },
        itemStyle: { borderWidth: 1, borderColor: '#fff' },
      },
    ],
  };

  // 2. Treemap Config
  const treemapOption = {
    series: [
      {
        type: 'treemap',
        data: [
          { name: 'Jawa\n38,2%', value: 382, itemStyle: { color: '#0F4C5C' } },
          { name: 'Sumatera\n22,1%', value: 221, itemStyle: { color: '#00A896' } },
          { name: 'Kalimantan\n10,4%', value: 104, itemStyle: { color: '#7DD3FC' } },
          { name: 'Sulawesi\n9,6%', value: 96, itemStyle: { color: '#FDE047' } },
          { name: 'Bali-Nusa\n6,8%', value: 68, itemStyle: { color: '#C084FC' } },
          { name: 'Papua\n3,7%', value: 37, itemStyle: { color: '#FB923C' } },
          { name: 'Maluku\n4,1%', value: 41, itemStyle: { color: '#F87171' } },
          { name: 'Lainnya\n4,1%', value: 41, itemStyle: { color: '#E2E8F0' } },
        ],
        leafDepth: 1,
        label: { fontSize: 10, fontWeight: 'bold' },
        breadcrumb: { show: false },
      },
    ],
  };

  // 3. Sankey Option
  const sankeyOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'sankey',
        data: [
          { name: 'SD\n4,2 jt', itemStyle: { color: '#1D4ED8' } },
          { name: 'SMP\n3,1 jt', itemStyle: { color: '#00A896' } },
          { name: 'SMA\n2,1 jt', itemStyle: { color: '#F59E0B' } },
          { name: 'SMK\n0,9 jt', itemStyle: { color: '#9333EA' } },
          { name: 'Melanjutkan\n5,8 jt', itemStyle: { color: '#10B981' } },
          { name: 'Tidak Melanjutkan\n1,5 jt', itemStyle: { color: '#F43F5E' } },
          { name: 'Perguruan Tinggi\n3,9 jt', itemStyle: { color: '#3B82F6' } },
          { name: 'Vokasi/Diploma\n1,2 jt', itemStyle: { color: '#6366F1' } },
          { name: 'Lainnya\n0,7 jt', itemStyle: { color: '#64748B' } },
        ],
        links: [
          { source: 'SD\n4,2 jt', target: 'SMP\n3,1 jt', value: 3.1 },
          { source: 'SD\n4,2 jt', target: 'Tidak Melanjutkan\n1,5 jt', value: 0.4 },
          { source: 'SMP\n3,1 jt', target: 'SMA\n2,1 jt', value: 2.1 },
          { source: 'SMP\n3,1 jt', target: 'SMK\n0,9 jt', value: 0.9 },
          { source: 'SMA\n2,1 jt', target: 'Melanjutkan\n5,8 jt', value: 1.8 },
          { source: 'SMK\n0,9 jt', target: 'Melanjutkan\n5,8 jt', value: 0.6 },
          { source: 'Melanjutkan\n5,8 jt', target: 'Perguruan Tinggi\n3,9 jt', value: 3.9 },
          { source: 'Melanjutkan\n5,8 jt', target: 'Vokasi/Diploma\n1,2 jt', value: 1.2 },
          { source: 'Melanjutkan\n5,8 jt', target: 'Lainnya\n0,7 jt', value: 0.7 },
        ],
        lineStyle: { color: 'gradient', curveness: 0.5 },
        label: { fontSize: 8 },
      },
    ],
  };

  // 4. Radar Option
  const radarOption = {
    color: ['#0284C7', '#00A896', '#F59E0B', '#9333EA', '#EF4444'],
    radar: {
      indicator: [
        { name: 'Angka Partisipasi\nSekolah', max: 100 },
        { name: 'Rasio Guru\nSiswa', max: 100 },
        { name: 'Tingkat\nKelulusan', max: 100 },
        { name: 'Akses\nFasilitas', max: 100 },
        { name: 'Kualitas\nInfrastruktur', max: 100 },
      ],
      radius: '65%',
      name: { textStyle: { fontSize: 8, color: '#64748B' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          { value: [92, 75, 98, 85, 88], name: 'Jawa Barat' },
          { value: [88, 70, 96, 80, 84], name: 'Jawa Timur' },
          { value: [86, 72, 95, 78, 80], name: 'Jawa Tengah' },
          { value: [96, 82, 99, 90, 94], name: 'DKI Jakarta' },
          { value: [82, 65, 94, 72, 75], name: 'Sumatera Utara' },
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Universal Page Header */}
      <PageHeader
        title="Advanced Visualization"
        subtitle="Eksplorasi visualisasi data pendidikan menggunakan chart yang lebih kompleks dan interaktif."
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Filter Category Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#0F2942] text-white shadow-xs font-bold'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] p-1 rounded-xl shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid' ? 'bg-[#0F2942] text-white' : 'text-[#64748B] hover:text-[#0F2942]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Grid View
          </button>
          <button
            onClick={() => setViewMode('gallery')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'gallery' ? 'bg-[#0F2942] text-white' : 'text-[#64748B] hover:text-[#0F2942]'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            Gallery View
          </button>
        </div>
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Heatmap */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Heatmap</h4>
              <p className="text-[11px] text-[#64748B]">Jumlah siswa berdasarkan provinsi dan jenjang pendidikan.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="h-[210px] w-full">
            <ReactECharts option={heatmapOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* 2. Treemap */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Treemap</h4>
              <p className="text-[11px] text-[#64748B]">Proporsi jumlah sekolah berdasarkan jenjang dan provinsi.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="h-[210px] w-full">
            <ReactECharts option={treemapOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* 3. Sankey Diagram */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Sankey Diagram</h4>
              <p className="text-[11px] text-[#64748B]">Alur transisi siswa dari jenjang pendidikan ke jenjang berikutnya.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="h-[210px] w-full">
            <ReactECharts option={sankeyOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* 4. Radar Chart */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Radar Chart</h4>
              <p className="text-[11px] text-[#64748B]">Perbandingan indikator pendidikan antar provinsi.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="h-[210px] w-full flex items-center justify-center">
            <ReactECharts option={radarOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* 5. Gauge Chart */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Gauge Chart</h4>
              <p className="text-[11px] text-[#64748B]">Capaian indikator pendidikan terhadap target nasional.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="grid grid-cols-2 gap-4 h-[210px] pt-2">
            {/* 4 Semi-circular gauges */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative w-24 h-12 overflow-hidden">
                <div className="w-24 h-24 rounded-full border-[7px] border-slate-100 border-t-[#00A896] border-r-[#00A896] transform rotate-[-45deg]" />
              </div>
              <span className="text-base font-black text-[#0F2942] mt-1">82%</span>
              <span className="text-[10px] text-[#475569] font-medium leading-tight">Angka Partisipasi Sekolah<br /><span className="text-[9px] text-[#94A3B8]">Target: 95%</span></span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative w-24 h-12 overflow-hidden">
                <div className="w-24 h-24 rounded-full border-[7px] border-slate-100 border-t-[#F59E0B] border-r-[#F59E0B] transform rotate-[-45deg]" />
              </div>
              <span className="text-base font-black text-[#0F2942] mt-1">68%</span>
              <span className="text-[10px] text-[#475569] font-medium leading-tight">Rasio Guru Siswa<br /><span className="text-[9px] text-[#94A3B8]">Target: 75%</span></span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative w-24 h-12 overflow-hidden">
                <div className="w-24 h-24 rounded-full border-[7px] border-slate-100 border-t-[#38BDF8] border-r-[#38BDF8] transform rotate-[-45deg]" />
              </div>
              <span className="text-base font-black text-[#0F2942] mt-1">76%</span>
              <span className="text-[10px] text-[#475569] font-medium leading-tight">Tingkat Kelulusan<br /><span className="text-[9px] text-[#94A3B8]">Target: 90%</span></span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative w-24 h-12 overflow-hidden">
                <div className="w-24 h-24 rounded-full border-[7px] border-slate-100 border-t-[#9333EA] border-r-[#9333EA] transform rotate-[-45deg]" />
              </div>
              <span className="text-base font-black text-[#0F2942] mt-1">61%</span>
              <span className="text-[10px] text-[#475569] font-medium leading-tight">Akses Fasilitas<br /><span className="text-[9px] text-[#94A3B8]">Target: 80%</span></span>
            </div>
          </div>
        </div>

        {/* 6. Scatter / Bubble Chart */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Scatter / Bubble Chart</h4>
              <p className="text-[11px] text-[#64748B]">Hubungan antara jumlah sekolah, siswa, dan rasio guru per provinsi.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="h-[210px] w-full relative">
            <svg viewBox="0 0 300 180" className="w-full h-full">
              {/* Axes */}
              <line x1="25" y1="160" x2="290" y2="160" stroke="#E2E8F0" />
              <line x1="25" y1="10" x2="25" y2="160" stroke="#E2E8F0" />
              {/* Bubbles */}
              <circle cx="210" cy="80" r="14" fill="#3B82F6" opacity="0.8" />
              <circle cx="160" cy="95" r="10" fill="#14B8A6" opacity="0.8" />
              <circle cx="120" cy="110" r="8" fill="#F59E0B" opacity="0.8" />
              <circle cx="80" cy="120" r="7" fill="#A855F7" opacity="0.8" />
              <circle cx="50" cy="130" r="6" fill="#F43F5E" opacity="0.8" />
              <circle cx="250" cy="115" r="12" fill="#8B5CF6" opacity="0.8" />
              <circle cx="95" cy="70" r="9" fill="#FBBF24" opacity="0.8" />
              {/* Tooltip Card */}
              <g transform="translate(160, 40)">
                <rect width="80" height="36" rx="4" fill="#FFFFFF" stroke="#E2E8F0" />
                <text x="6" y="14" fontSize="8" fontWeight="bold" fill="#0F2942">Jawa Barat</text>
                <text x="6" y="24" fontSize="7" fill="#64748B">3.1M siswa</text>
                <text x="6" y="32" fontSize="7" fill="#64748B">Rasio 16,2</text>
              </g>
            </svg>
          </div>
        </div>

        {/* 7. Calendar Heatmap */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Calendar Heatmap</h4>
              <p className="text-[11px] text-[#64748B]">Aktivitas akademik dan jumlah event sepanjang tahun.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="h-[210px] w-full flex flex-col justify-center text-[9px] text-[#64748B]">
            <div className="grid grid-cols-13 gap-1 mb-1 font-bold text-center">
              <span />
              {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
            {['Kegiatan Belajar', 'Ujian', 'Penerimaan Siswa', 'Kegiatan Akademik', 'Libur'].map((row, rIdx) => (
              <div key={row} className="grid grid-cols-13 gap-1 items-center mb-1">
                <span className="truncate pr-1 text-right text-[8px] font-medium">{row}</span>
                {Array.from({ length: 12 }).map((_, cIdx) => {
                  const val = (rIdx + cIdx) % 5;
                  const colors = ['#E2E8F0', '#BAE6FD', '#38BDF8', '#0284C7', '#0F4C5C'];
                  return (
                    <div
                      key={cIdx}
                      className="h-4 rounded-xs"
                      style={{ backgroundColor: colors[val] }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 8. Parallel Coordinates */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Parallel Coordinates</h4>
              <p className="text-[11px] text-[#64748B]">Perbandingan multi-indikator antar provinsi.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="h-[210px] w-full">
            <svg viewBox="0 0 300 160" className="w-full h-full">
              {/* 5 Vertical Axes */}
              {[30, 90, 150, 210, 270].map((x, i) => (
                <line key={i} x1={x} y1="20" x2={x} y2="140" stroke="#CBD5E1" strokeWidth="1.5" />
              ))}
              {/* Lines across axes */}
              <polyline points="30,30 90,40 150,50 210,60 270,30" fill="none" stroke="#0284C7" strokeWidth="2" opacity="0.8" />
              <polyline points="30,50 90,60 150,70 210,80 270,40" fill="none" stroke="#00A896" strokeWidth="2" opacity="0.8" />
              <polyline points="30,70 90,80 150,90 210,95 270,55" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.8" />
              <polyline points="30,90 90,100 150,110 210,115 270,75" fill="none" stroke="#9333EA" strokeWidth="2" opacity="0.8" />
              {/* Axis labels */}
              <text x="30" y="15" textAnchor="middle" fontSize="7" fill="#64748B">Sekolah</text>
              <text x="90" y="15" textAnchor="middle" fontSize="7" fill="#64748B">Siswa</text>
              <text x="150" y="15" textAnchor="middle" fontSize="7" fill="#64748B">Guru</text>
              <text x="210" y="15" textAnchor="middle" fontSize="7" fill="#64748B">Rasio</text>
              <text x="270" y="15" textAnchor="middle" fontSize="7" fill="#64748B">Kelulusan</text>
            </svg>
          </div>
        </div>

        {/* 9. Choropleth Map */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Choropleth Map</h4>
              <p className="text-[11px] text-[#64748B]">Tingkat angka partisipasi sekolah per provinsi.</p>
            </div>
            <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] px-2 py-0.5 rounded text-[10px] font-semibold text-[#0F2942]">
              <span>Angka Partisipasi Sekolah</span>
              <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </div>
          </div>
          <div className="h-[210px] w-full bg-[#E0F7FA]/30 rounded-xl relative p-2 overflow-hidden flex items-center justify-center">
            {/* Zoom Controls */}
            <div className="absolute top-2 left-2 flex flex-col bg-white border border-[#E2E8F0] rounded shadow-2xs z-10">
              <button className="p-1 text-[#64748B] hover:bg-slate-50"><Plus className="w-3 h-3" /></button>
              <button className="p-1 text-[#64748B] hover:bg-slate-50"><Minus className="w-3 h-3" /></button>
            </div>
            {/* Map Silhouette (shared choropleth component) */}
            <IndonesiaMap
              className="w-full h-full object-contain"
              interactive={false}
              fills={{
                sumatera: '#0F4C5C',
                kalimantan: '#38BDF8',
                jawa: '#00A896',
                sulawesi: '#0284C7',
                papua: '#00A896',
                maluku: '#38BDF8',
                malukuUtara: '#8ED8E4',
                bali: '#BAE6FD',
                ntb: '#8ED8E4',
                ntt: '#0284C7',
                bangka: '#BAE6FD',
              }}
            />
            <div className="absolute bottom-2 left-2 bg-white/95 border border-[#E2E8F0] rounded p-1.5 text-[8px] space-y-0.5 z-10">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-[#0F4C5C]" /> &gt; 95%</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-[#00A896]" /> 85% – 95%</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-[#0284C7]" /> 75% – 85%</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-[#38BDF8]" /> 60% – 75%</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-[#BAE6FD]" /> &lt; 60%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
