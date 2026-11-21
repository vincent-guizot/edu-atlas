import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { Grid, LayoutList, MoreHorizontal } from 'lucide-react';

export const ChartPlaygroundPage: React.FC = () => {
  const { period, setPeriod } = useOutletContext<{ period: string; setPeriod: (p: string) => void }>();
  const [activeCategory, setActiveCategory] = useState('Semua Chart');
  const [viewMode, setViewMode] = useState<'grid' | 'gallery'>('grid');

  const categories = [
    'Semua Chart',
    'Line',
    'Bar',
    'Area',
    'Pie & Donut',
    'Stacked',
    'Comparison',
    'Composition',
    'Other',
  ];

  // 1. Line Chart Data
  const lineData = [
    { year: '2022', SD: 10.4, SMP: 6.1, SMA: 3.2, SMK: 1.9 },
    { year: '2023', SD: 13.0, SMP: 7.6, SMA: 4.6, SMK: 2.15 },
    { year: '2024', SD: 15.3, SMP: 9.0, SMA: 5.9, SMK: 2.35 },
    { year: '2025', SD: 17.3, SMP: 10.5, SMA: 7.3, SMK: 2.52 },
    { year: '2026', SD: 19.24, SMP: 11.96, SMA: 8.69, SMK: 2.68 },
  ];

  // 2. Bar Chart Data (Schools per Province)
  const barData = [
    { province: 'Jawa Barat', schools: 18254, color: '#0284C7' },
    { province: 'Jawa Timur', schools: 15892, color: '#06B6D4' },
    { province: 'Jawa Tengah', schools: 12840, color: '#F59E0B' },
    { province: 'DKI Jakarta', schools: 8412, color: '#38BDF8' },
    { province: 'Sumatera Utara', schools: 7621, color: '#A855F7' },
  ];

  // 3. Area Chart Data (Teachers)
  const areaData = [
    { year: '2022', SD: 1.15, SMP: 0.65, SMA: 0.45, SMK: 0.28 },
    { year: '2023', SD: 1.18, SMP: 0.68, SMA: 0.47, SMK: 0.30 },
    { year: '2024', SD: 1.20, SMP: 0.70, SMA: 0.49, SMK: 0.32 },
    { year: '2025', SD: 1.22, SMP: 0.73, SMA: 0.52, SMK: 0.34 },
    { year: '2026', SD: 1.25, SMP: 0.76, SMA: 0.54, SMK: 0.36 },
  ];

  // 4. Pie & Donut
  const pieData = [
    { name: 'SD (Sekolah Dasar)', value: 19235641, percent: '45,2%', color: '#2563EB' },
    { name: 'SMP (Sekolah Menengah Pertama)', value: 11958324, percent: '28,1%', color: '#00A896' },
    { name: 'SMA (Sekolah Menengah Atas)', value: 8686412, percent: '20,4%', color: '#FBBF24' },
    { name: 'SMK (Sekolah Menengah Kejuruan)', value: 2679944, percent: '6,3%', color: '#A855F7' },
  ];

  // 6. Stacked Horizontal Bars (5 Provinces)
  const stackedData = [
    { name: 'Sumatera Utara', SD: 3.8, SMP: 2.2, SMA: 1.5, SMK: 0.8 },
    { name: 'DKI Jakarta', SD: 4.5, SMP: 2.8, SMA: 1.9, SMK: 0.9 },
    { name: 'Jawa Tengah', SD: 6.2, SMP: 3.5, SMA: 2.2, SMK: 1.1 },
    { name: 'Jawa Timur', SD: 7.5, SMP: 4.2, SMA: 2.8, SMK: 1.4 },
    { name: 'Jawa Barat', SD: 8.8, SMP: 5.1, SMA: 3.2, SMK: 1.6 },
  ];

  // 7. Horizontal Bar Chart (10 Provinces Students)
  const horizontalData = [
    { name: 'Sumatera Utara', value: 3.38, color: '#7DD3FC' },
    { name: 'DKI Jakarta', value: 4.13, color: '#C084FC' },
    { name: 'Jawa Tengah', value: 5.42, color: '#FBBF24' },
    { name: 'Jawa Timur', value: 6.98, color: '#2DD4BF' },
    { name: 'Jawa Barat', value: 8.42, color: '#0284C7' },
  ];

  // 8. Column Grouped (Universities)
  const groupedData = [
    { year: '2022', Negeri: 450, Swasta: 420 },
    { year: '2023', Negeri: 480, Swasta: 530 },
    { year: '2024', Negeri: 505, Swasta: 590 },
    { year: '2025', Negeri: 520, Swasta: 640 },
    { year: '2026', Negeri: 540, Swasta: 720 },
  ];

  // 9. Combo Chart (Line + Bar)
  const comboData = [
    { year: '2022', schools: 118, growth: 3.8 },
    { year: '2023', schools: 120, growth: 4.2 },
    { year: '2024', schools: 122, growth: 4.9 },
    { year: '2025', schools: 124, growth: 4.6 },
    { year: '2026', schools: 125.4, growth: 5.4 },
  ];

  return (
    <div className="space-y-6">
      {/* Universal Page Header */}
      <PageHeader
        title="Chart Playground"
        subtitle="Jelajahi berbagai jenis visualisasi data pendidikan dengan dataset yang dapat difilter."
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Filter Category Pills + View Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Horizontal Category Pills */}
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

        {/* View Mode Buttons */}
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

      {/* 3x3 Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Line Chart */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Line Chart</h4>
              <p className="text-[11px] text-[#64748B]">Tren jumlah siswa berdasarkan jenjang pendidikan.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}M`} />
                <Tooltip />
                <Line type="monotone" dataKey="SD" stroke="#1D4ED8" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="SMP" stroke="#00A896" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="SMA" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="SMK" stroke="#9333EA" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] font-semibold text-[#64748B] pt-2 border-t border-[#F1F5F9]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1D4ED8]" /> SD</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00A896]" /> SMP</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> SMA</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#9333EA]" /> SMK</span>
          </div>
        </div>

        {/* 2. Bar Chart */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Bar Chart</h4>
              <p className="text-[11px] text-[#64748B]">Perbandingan jumlah sekolah per provinsi.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="province" stroke="#94A3B8" fontSize={9} interval={0} angle={-15} textAnchor="end" tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip />
                <Bar dataKey="schools" radius={[4, 4, 0, 0]}>
                  {barData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Area Chart */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Area Chart</h4>
              <p className="text-[11px] text-[#64748B]">Tren jumlah guru dengan area bertumpuk.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}M`} />
                <Tooltip />
                <Area type="monotone" dataKey="SD" stackId="1" stroke="#1D4ED8" fill="#1D4ED8" fillOpacity={0.8} />
                <Area type="monotone" dataKey="SMP" stackId="1" stroke="#00A896" fill="#00A896" fillOpacity={0.8} />
                <Area type="monotone" dataKey="SMA" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.8} />
                <Area type="monotone" dataKey="SMK" stackId="1" stroke="#9333EA" fill="#9333EA" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] font-semibold text-[#64748B] pt-2 border-t border-[#F1F5F9]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1D4ED8]" /> SD</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00A896]" /> SMP</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> SMA</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#9333EA]" /> SMK</span>
          </div>
        </div>

        {/* 4. Pie Chart */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Pie Chart</h4>
              <p className="text-[11px] text-[#64748B]">Persentase jumlah sekolah berdasarkan jenjang.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="flex items-center justify-between gap-2 h-[210px]">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70}>
                    {pieData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2 text-[10px]">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="flex items-center gap-1 truncate text-[#475569]">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="truncate">{d.name.split(' ')[0]}</span>
                  </span>
                  <span className="font-bold text-[#0F2942]">{d.percent}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Donut Chart */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Donut Chart</h4>
              <p className="text-[11px] text-[#64748B]">Distribusi jumlah siswa per jenjang pendidikan.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="flex items-center justify-between gap-2 h-[210px]">
            <div className="w-1/2 h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={42} outerRadius={68} paddingAngle={2}>
                    {pieData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xs font-black text-[#0F2942]">42,56 jt</span>
                <span className="text-[8px] text-[#64748B]">Total Siswa</span>
              </div>
            </div>
            <div className="w-1/2 space-y-1.5 text-[10px]">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="flex items-center gap-1 truncate text-[#475569]">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="truncate">{d.name.split(' ')[0]}</span>
                  </span>
                  <span className="font-bold text-[#0F2942]">{d.percent}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. Stacked Bar Chart */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Stacked Bar Chart</h4>
              <p className="text-[11px] text-[#64748B]">Jumlah siswa per jenjang di 5 provinsi teratas.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={stackedData} margin={{ top: 5, right: 10, left: 35, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={9} tickLine={false} tickFormatter={(v) => `${v}M`} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <Tooltip />
                <Bar dataKey="SD" stackId="a" fill="#1D4ED8" />
                <Bar dataKey="SMP" stackId="a" fill="#00A896" />
                <Bar dataKey="SMA" stackId="a" fill="#F59E0B" />
                <Bar dataKey="SMK" stackId="a" fill="#9333EA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. Horizontal Bar Chart */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Horizontal Bar Chart</h4>
              <p className="text-[11px] text-[#64748B]">10 provinsi dengan jumlah siswa terbanyak.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={horizontalData} margin={{ top: 5, right: 25, left: 35, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={9} tickLine={false} tickFormatter={(v) => `${v}M`} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {horizontalData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 8. Column Grouped */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Column Chart (Grouped)</h4>
              <p className="text-[11px] text-[#64748B]">Perbandingan jumlah universitas negeri dan swasta.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={groupedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Bar dataKey="Negeri" fill="#0F4C5C" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Swasta" fill="#00A896" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] font-semibold text-[#64748B] pt-2 border-t border-[#F1F5F9]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#0F4C5C]" /> Universitas Negeri</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#00A896]" /> Universitas Swasta</span>
          </div>
        </div>

        {/* 9. Combo Chart (Line + Bar) */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-[#0F2942] font-heading">Line + Bar (Combo Chart)</h4>
              <p className="text-[11px] text-[#64748B]">Jumlah sekolah dan pertumbuhan tahun ke tahun.</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
          </div>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={comboData} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis yAxisId="left" stroke="#94A3B8" fontSize={9} tickLine={false} tickFormatter={(v) => `${v}K`} />
                <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={9} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip />
                <Bar yAxisId="left" dataKey="schools" fill="#BAE6FD" radius={[3, 3, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4, fill: '#F59E0B' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] font-semibold text-[#64748B] pt-2 border-t border-[#F1F5F9]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#BAE6FD]" /> Jumlah Sekolah</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Pertumbuhan (YoY)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
