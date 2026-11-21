import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { KpiCardsRow } from '../../components/common/KpiCardsRow';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ChevronDown, MoreVertical, Plus, Minus, Trophy, ArrowUp, X, MapPin } from 'lucide-react';
import { IndonesiaMap, IslandKey } from '../../components/common/IndonesiaMap';
import regionalStatsData from '../../constants/regionalStats.json';
import {
  OVERVIEW_TOP_PROVINCES,
  OVERVIEW_TREND_DATA,
  OVERVIEW_DISTRIBUTION_DATA,
} from '../../constants/overview.constants';

interface IslandStat {
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

const REGIONAL_STATS: Record<string, IslandStat> = regionalStatsData;

export const OverviewPage: React.FC = () => {
  const { period, setPeriod } = useOutletContext<{ period: string; setPeriod: (p: string) => void }>();
  const [trendView, setTrendView] = useState<'chart' | 'table'>('chart');
  const [trendJenjang, setTrendJenjang] = useState<string>('all');
  const [distYear, setDistYear] = useState<string>('2026');
  const [selectedMapIsland, setSelectedMapIsland] = useState<IslandKey | null>(null);

  const yoyMap: Record<string, string> = {
    '2022': '-',
    '2023': '+26,6%',
    '2024': '+19,0%',
    '2025': '+15,6%',
    '2026': '+13,2%',
  };

  const trendData = OVERVIEW_TREND_DATA.map((d) => ({
    ...d,
    total: Number((d.SD + d.SMP + d.SMA + d.SMK).toFixed(2)),
    yoy: yoyMap[d.year] || '-',
  }));

  const distributionDataByYear: Record<
    string,
    { name: string; value: number; percent: string; color: string }[]
  > = {
    '2026': OVERVIEW_DISTRIBUTION_DATA,
    '2025': [
      { name: 'SD (Sekolah Dasar)', value: 17300000, percent: '46,0%', color: '#153B66' },
      { name: 'SMP (Sekolah Menengah Pertama)', value: 10500000, percent: '27,9%', color: '#25A9A1' },
      { name: 'SMA (Sekolah Menengah Atas)', value: 7300000, percent: '19,4%', color: '#8ED8E4' },
      { name: 'SMK (Sekolah Menengah Kejuruan)', value: 2520000, percent: '6,7%', color: '#FFC857' },
    ],
    '2024': [
      { name: 'SD (Sekolah Dasar)', value: 15300000, percent: '47,0%', color: '#153B66' },
      { name: 'SMP (Sekolah Menengah Pertama)', value: 9000000, percent: '27,6%', color: '#25A9A1' },
      { name: 'SMA (Sekolah Menengah Atas)', value: 5900000, percent: '18,1%', color: '#8ED8E4' },
      { name: 'SMK (Sekolah Menengah Kejuruan)', value: 2350000, percent: '7,3%', color: '#FFC857' },
    ],
  };

  const activeDistributionData = distributionDataByYear[distYear] || distributionDataByYear['2026'];
  const totalStudentsInYear = activeDistributionData.reduce((acc, cur) => acc + cur.value, 0);
  const topProvinces = OVERVIEW_TOP_PROVINCES;

  const selectedStats = selectedMapIsland ? REGIONAL_STATS[selectedMapIsland] : null;

  return (
    <div className="space-y-6">
      {/* Universal Page Header with exactly 3 Global Filters */}
      <PageHeader
        title="Overview Dashboard"
        subtitle="Ringkasan data pendidikan kategori sekolah, siswa, guru, dan perguruan tinggi berdasarkan snapshot terbaru."
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* 4 KPI Metric Cards with Interactive Detail Modals */}
      <KpiCardsRow />

      {/* Middle Row (Trend Chart/Table + Donut Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Trend Jumlah Siswa (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#DCE5EF] rounded-2xl p-6 shadow-2xs flex flex-col justify-between overflow-hidden">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className="text-base font-bold text-[#153B66] font-heading">
                Tren Jumlah Siswa (2022 – 2026)
              </h3>
              <p className="text-xs text-[#526579] mt-0.5">
                Total siswa di seluruh jenjang pendidikan nasional
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Buttons: Grafik vs Tabel */}
              <div className="flex items-center bg-[#F5F8FC] border border-[#DCE5EF] p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setTrendView('chart')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    trendView === 'chart' ? 'bg-[#0F2942] text-white shadow-xs font-bold' : 'text-[#526579] hover:text-[#172B4D]'
                  }`}
                >
                  Grafik
                </button>
                <button
                  type="button"
                  onClick={() => setTrendView('table')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    trendView === 'table' ? 'bg-[#0F2942] text-white shadow-xs font-bold' : 'text-[#526579] hover:text-[#172B4D]'
                  }`}
                >
                  Tabel
                </button>
              </div>

              {/* Jenjang Filter Dropdown */}
              <div className="flex items-center gap-1 bg-white border border-[#DCE5EF] px-2.5 py-1 rounded-lg text-xs font-semibold text-[#172B4D]">
                <select
                  aria-label="Filter Jenjang Tren"
                  value={trendJenjang}
                  onChange={(e) => setTrendJenjang(e.target.value)}
                  className="bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="all">Semua Jenjang</option>
                  <option value="SD">Jenjang SD</option>
                  <option value="SMP">Jenjang SMP</option>
                  <option value="SMA">Jenjang SMA</option>
                  <option value="SMK">Jenjang SMK</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#526579] pointer-events-none -ml-1" />
              </div>
            </div>
          </div>

          {/* Conditional Content: Chart vs Table */}
          {trendView === 'chart' ? (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    domain={[0, 20]}
                    ticks={[0, 5, 10, 15, 20]}
                    tickFormatter={(v) => `${v}M`}
                  />
                  <Tooltip
                    formatter={(val: any) => `${val} Juta`}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: 8, borderColor: '#DCE5EF', fontSize: 12 }}
                  />
                  {(trendJenjang === 'all' || trendJenjang === 'SD') && (
                    <Line type="monotone" dataKey="SD" stroke="#0284C7" strokeWidth={2.5} dot={{ r: 4, fill: '#0284C7' }} />
                  )}
                  {(trendJenjang === 'all' || trendJenjang === 'SMP') && (
                    <Line type="monotone" dataKey="SMP" stroke="#25A9A1" strokeWidth={2.5} dot={{ r: 4, fill: '#25A9A1' }} />
                  )}
                  {(trendJenjang === 'all' || trendJenjang === 'SMA') && (
                    <Line type="monotone" dataKey="SMA" stroke="#FFC857" strokeWidth={2.5} dot={{ r: 4, fill: '#FFC857' }} />
                  )}
                  {(trendJenjang === 'all' || trendJenjang === 'SMK') && (
                    <Line type="monotone" dataKey="SMK" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 4, fill: '#8B5CF6' }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[280px] w-full overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#526579] font-semibold border-b border-[#DCE5EF] sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Tahun</th>
                    <th className="py-2.5 px-3 text-right">SD (Jt)</th>
                    <th className="py-2.5 px-3 text-right">SMP (Jt)</th>
                    <th className="py-2.5 px-3 text-right">SMA (Jt)</th>
                    <th className="py-2.5 px-3 text-right">SMK (Jt)</th>
                    <th className="py-2.5 px-3 text-right">Total (Jt)</th>
                    <th className="py-2.5 px-3 text-center">YoY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-[#172B4D]">
                  {trendData.map((row) => (
                    <tr key={row.year} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-2.5 px-3 font-bold text-[#153B66]">{row.year}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{row.SD}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{row.SMP}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{row.SMA}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{row.SMK}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#153B66]">{row.total}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center text-[11px] font-bold text-[#16835D] bg-[#DEF7EC] px-1.5 py-0.5 rounded">
                          {row.yoy}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Legend dots below */}
          <div className="flex items-center justify-center gap-6 mt-3 text-xs font-semibold text-[#526579] pt-2 border-t border-[#F1F5F9]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" /> SD</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#25A9A1]" /> SMP</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FFC857]" /> SMA</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> SMK</span>
          </div>
        </div>

        {/* Right: Distribusi Siswa per Jenjang Donut (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#DCE5EF] rounded-2xl p-6 shadow-2xs flex flex-col justify-between overflow-hidden">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-[#153B66] font-heading">
                Distribusi Siswa per Jenjang
              </h3>
              <p className="text-xs text-[#526579] mt-0.5">
                Persentase jumlah siswa berdasarkan jenjang pendidikan
              </p>
            </div>

            {/* Functioning Year Selector Dropdown */}
            <div className="flex items-center gap-1 bg-white border border-[#DCE5EF] px-2.5 py-1 rounded-lg text-xs font-semibold text-[#172B4D]">
              <select
                aria-label="Pilih Tahun Distribusi"
                value={distYear}
                onChange={(e) => setDistYear(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="2026">Tahun 2026</option>
                <option value="2025">Tahun 2025</option>
                <option value="2024">Tahun 2024</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#526579] pointer-events-none -ml-1" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto min-w-0">
            {/* Donut Chart with center label */}
            <div className="relative w-[160px] h-[160px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeDistributionData}
                    dataKey="value"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                  >
                    {activeDistributionData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-base font-black text-[#153B66] font-heading">
                  {(totalStudentsInYear / 1000000).toFixed(1)} jt
                </span>
                <span className="text-[10px] text-[#526579] font-medium">Total Siswa</span>
              </div>
            </div>

            {/* Squeeze-proof Legend with numbers & percentages */}
            <div className="flex-1 space-y-2.5 text-xs w-full min-w-0">
              {activeDistributionData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[#526579] font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-[#172B4D]">
                      {(item.value / 1000000).toFixed(2)} Jt
                    </span>
                    <span className="font-semibold text-[#526579] w-11 text-right">{item.percent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#F1F5F9] text-center text-[11px] text-[#526579]">
            Data snapshot agregat jenjang pendidikan nasional periode {distYear}
          </div>
        </div>
      </div>

      {/* Bottom Row (Interactive Map + 10 Provinces Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sebaran Sekolah di Indonesia Map (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[#DCE5EF] rounded-2xl p-6 shadow-2xs flex flex-col justify-between relative overflow-hidden min-h-[380px]">
          <div className="flex items-start justify-between mb-3 z-10">
            <div>
              <h3 className="text-base font-bold text-[#153B66] font-heading">
                Sebaran Sekolah di Indonesia
              </h3>
              <p className="text-xs text-[#526579] mt-0.5">
                Peta sebaran institusi pendidikan per pulau / wilayah
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#153B66] bg-[#E6F8F6] px-2.5 py-1 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-[#25A9A1]" />
              <span>Interaktif</span>
            </div>
          </div>

          {/* Map Canvas with Click-to-Inspect details */}
          <div className="relative h-[280px] w-full bg-[#F5F8FC] rounded-xl overflow-hidden border border-[#DCE5EF] p-2 flex items-center justify-center">
            {/* Zoom Controls */}
            <div className="absolute top-3 left-3 flex flex-col bg-white border border-[#DCE5EF] rounded-lg shadow-2xs overflow-hidden z-20">
              <button
                type="button"
                aria-label="Zoom In"
                className="p-1.5 hover:bg-slate-50 text-[#526579] border-b border-[#DCE5EF] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                aria-label="Zoom Out"
                className="p-1.5 hover:bg-slate-50 text-[#526579] cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive Indonesia Map */}
            <IndonesiaMap
              className="w-full h-full object-contain"
              interactive={true}
              selectedIsland={selectedMapIsland}
              onIslandClick={(key) => setSelectedMapIsland(key)}
              fills={{
                jawa: '#153B66',
                sumatera: '#0284C7',
                sulawesi: '#25A9A1',
                kalimantan: '#8ED8E4',
                papua: '#0284C7',
                maluku: '#8ED8E4',
                malukuUtara: '#BAE6FD',
                bali: '#BAE6FD',
                ntb: '#BAE6FD',
                ntt: '#8ED8E4',
                bangka: '#BAE6FD',
              }}
            />

            {/* Detail Card: Only displayed when an island/region is clicked */}
            {selectedStats ? (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-[#DCE5EF] rounded-xl p-3.5 shadow-lg z-30 text-xs w-56 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#25A9A1]" />
                    <span className="font-bold text-[#153B66] text-sm">{selectedStats.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMapIsland(null)}
                    aria-label="Tutup Rincian Peta"
                    className="p-1 text-[#526579] hover:bg-slate-100 rounded-lg hover:text-[#172B4D] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between font-bold text-[#172B4D] pb-1 border-b border-[#F8FAFC]">
                    <span>Total Sekolah</span>
                    <span className="text-[#25A9A1]">{selectedStats.totalSchools.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-[#526579]">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" /> SD</span>
                    <span>{selectedStats.sd.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-[#526579]">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#25A9A1]" /> SMP</span>
                    <span>{selectedStats.smp.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-[#526579]">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#FFC857]" /> SMA</span>
                    <span>{selectedStats.sma.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-[#526579]">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" /> SMK</span>
                    <span>{selectedStats.smk.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="pt-1.5 border-t border-[#F8FAFC] flex justify-between text-[#526579]">
                    <span>Siswa:</span>
                    <strong className="text-[#172B4D]">{selectedStats.students}</strong>
                  </div>
                </div>
              </div>
            ) : (
              /* Helpful prompt shown initially before any island is clicked */
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs border border-[#DCE5EF] px-3 py-1.5 rounded-lg text-[11px] text-[#526579] font-medium shadow-2xs z-20 flex items-center gap-1.5">
                <span>💡 Klik pulau pada peta untuk melihat rincian sebaran</span>
              </div>
            )}

            {/* Bottom Legend */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-[#DCE5EF] rounded-lg p-2 text-[10px] space-y-1 shadow-2xs z-20">
              <div className="flex items-center gap-2"><span className="w-3 h-2 rounded-xs bg-[#153B66]" /> &gt; 25.000 Sekolah</div>
              <div className="flex items-center gap-2"><span className="w-3 h-2 rounded-xs bg-[#0284C7]" /> 10.001 – 25.000</div>
              <div className="flex items-center gap-2"><span className="w-3 h-2 rounded-xs bg-[#25A9A1]" /> 5.001 – 10.000</div>
              <div className="flex items-center gap-2"><span className="w-3 h-2 rounded-xs bg-[#8ED8E4]" /> 2.001 – 5.000</div>
              <div className="flex items-center gap-2"><span className="w-3 h-2 rounded-xs bg-[#BAE6FD]" /> ≤ 2.000</div>
            </div>
          </div>
        </div>

        {/* Right: 10 Provinsi dengan Jumlah Siswa Terbanyak (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[#DCE5EF] rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FFC857]" />
              <div>
                <h3 className="text-base font-bold text-[#153B66] font-heading">
                  10 Provinsi dengan Jumlah Siswa Terbanyak
                </h3>
              </div>
            </div>
            <div className="text-xs font-semibold text-[#153B66] bg-[#F5F8FC] border border-[#DCE5EF] px-2.5 py-1 rounded-lg">
              Periode {period}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#526579] font-semibold border-b border-[#DCE5EF]">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Provinsi</th>
                  <th className="py-2.5 px-3 text-right">Total Siswa</th>
                  <th className="py-2.5 px-3 text-right">Pertumbuhan</th>
                  <th className="py-2.5 px-3 text-right">Jumlah Sekolah</th>
                  <th className="py-2.5 px-3 text-center">Tren</th>
                  <th className="py-2.5 px-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[#172B4D]">
                {topProvinces.map((prov) => (
                  <tr key={prov.rank} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-2 px-3 text-[#526579] font-medium">{prov.rank}</td>
                    <td className="py-2 px-3 font-semibold">{prov.name}</td>
                    <td className="py-2 px-3 text-right font-medium">{prov.students}</td>
                    <td className="py-2 px-3 text-right">
                      <span className="inline-flex items-center gap-0.5 text-[#16835D] font-bold">
                        <ArrowUp className="w-3 h-3" />
                        {prov.yoy}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-[#526579]">{prov.schools}</td>
                    <td className="py-2 px-3 text-center">
                      <svg width="48" height="16" className="mx-auto text-[#25A9A1]">
                        <path
                          d="M2,12 Q14,6 24,10 T46,3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </td>
                    <td className="py-2 px-3 text-center text-[#526579] cursor-pointer hover:text-[#172B4D]">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
