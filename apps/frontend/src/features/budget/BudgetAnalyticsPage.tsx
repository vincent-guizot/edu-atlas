import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import {
  DollarSign,
  PieChart as PieIcon,
  TrendingUp,
  BarChart3,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  BUDGET_EFFICIENCY_SNAPSHOT,
  ProvinceBudgetItem,
} from '../../constants/expansion.constants';

const QUADRANT_COLORS: Record<string, string> = {
  'Sangat Efisien (Output Tinggi, Biaya Terkendali)': '#10B981',
  'Investasi Strategis (Output Tinggi, Biaya Tinggi)': '#3B82F6',
  'Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)': '#F59E0B',
  'Butuh Intervensi Fiskal (Biaya Rendah, Output Rendah)': '#EF4444',
};

export const BudgetAnalyticsPage: React.FC = () => {
  const data = BUDGET_EFFICIENCY_SNAPSHOT;
  const summary = data.nationalBudgetSummary;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIsland, setSelectedIsland] = useState('Semua');
  const [selectedQuadrant, setSelectedQuadrant] = useState('Semua');

  // Filtered Province List
  const filteredProvinces = useMemo(() => {
    return data.provinces.filter((p) => {
      const matchSearch = p.provinceName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchIsland = selectedIsland === 'Semua' ? true : p.islandGroup === selectedIsland;
      const matchQuadrant = selectedQuadrant === 'Semua' ? true : p.efficiencyStatus.includes(selectedQuadrant);
      return matchSearch && matchIsland && matchQuadrant;
    });
  }, [data.provinces, searchQuery, selectedIsland, selectedQuadrant]);

  // Scatter Plot Data (Spending vs IPM)
  const scatterData = useMemo(() => {
    return data.provinces.map((p) => ({
      name: p.provinceName,
      x: p.spendingPerStudent / 1e6, // Juta Rupiah
      y: p.ipmEducation,
      island: p.islandGroup,
      status: p.efficiencyStatus,
    }));
  }, [data.provinces]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transparansi & Efisiensi Anggaran Pendidikan"
        subtitle="Analisis alokasi 20% anggaran pendidikan nasional, belanja per siswa, dan efisiensi fiskal terhadap mutu IPM"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-xl p-4.5 border border-[#EAF0F6] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#526579]">Mandatory Spending 20%</span>
            <div className="w-8 h-8 rounded-lg bg-[#E6F8F6] text-[#25A9A1] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#153B66] tracking-tight">
              Rp {summary.nationalEducationBudgetTrillion} T
            </span>
          </div>
          <p className="text-[11px] text-[#526579] mt-1">
            20% APBN Tahun Anggaran 2026
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl p-4.5 border border-[#EAF0F6] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#526579]">Rata-rata Alokasi APBD</span>
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#153B66] tracking-tight">
              {summary.avgApbdEducationPct}%
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Memenuhi Regulasi
            </span>
          </div>
          <p className="text-[11px] text-[#526579] mt-1">
            Rata-rata kepatuhan daerah &gt;= 20%
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl p-4.5 border border-[#EAF0F6] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#526579]">Belanja per Murid (Nasional)</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#153B66] tracking-tight">
              Rp {(summary.avgSpendingPerStudentNational / 1e6).toFixed(2)} Jt
            </span>
            <span className="text-xs text-[#526579]">/ anak / thn</span>
          </div>
          <p className="text-[11px] text-[#526579] mt-1">
            Rata-rata pengeluaran sekolah riil
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-xl p-4.5 border border-[#EAF0F6] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#526579]">Tingkat Penyerapan Dana</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700 tracking-tight">
              {summary.nationalBosAbsorptionRate}%
            </span>
            <span className="text-xs text-[#526579]">BOS</span>
          </div>
          <p className="text-[11px] text-[#526579] mt-1">
            DAK Fisik Terealisasi: {summary.nationalDakFisikAbsorptionRate}%
          </p>
        </div>
      </div>

      {/* Main Charts: Scatter Plot Efficiency (Left) + Funding Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scatter Plot Kuadran Efisiensi (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#EAF0F6] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#153B66]">
                Matriks Kuadran Efisiensi Anggaran vs Capaian IPM Pendidikan
              </h3>
              <p className="text-xs text-[#526579]">
                Sumbu X: Belanja per Siswa (Juta Rp) | Sumbu Y: Indeks Pembangunan Manusia (IPM)
              </p>
            </div>
          </div>

          <div className="h-[310px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Belanja per Siswa"
                  unit=" Jt"
                  domain={[3, 12]}
                  tick={{ fontSize: 10, fill: '#526579' }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="IPM Pendidikan"
                  domain={[50, 85]}
                  tick={{ fontSize: 10, fill: '#526579' }}
                />
                <ZAxis range={[70, 70]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value: any, name: any) => [
                    name === 'Belanja per Siswa' ? `Rp ${value} Juta / Siswa` : `${value} Poin`,
                    name,
                  ]}
                  content={({ payload }) => {
                    if (!payload || !payload[0]) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white p-2.5 rounded-lg border border-[#EAF0F6] shadow-sm text-xs space-y-1">
                        <strong className="text-[#153B66]">{d.name}</strong>
                        <div className="text-[11px] text-[#526579]">Pulau: {d.island}</div>
                        <div className="text-[11px]">Belanja: <strong>Rp {d.x} Juta</strong></div>
                        <div className="text-[11px]">IPM: <strong>{d.y}</strong></div>
                        <div className="text-[10px] font-bold text-[#25A9A1]">{d.status}</div>
                      </div>
                    );
                  }}
                />
                <Scatter name="Provinsi" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={QUADRANT_COLORS[entry.status] || '#25A9A1'}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Quadrant Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#F1F5F9] text-[10px]">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              Sangat Efisien
            </div>
            <div className="flex items-center gap-1.5 text-blue-700 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
              Investasi Strategis
            </div>
            <div className="flex items-center gap-1.5 text-amber-700 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              Perlu Akselerasi
            </div>
            <div className="flex items-center gap-1.5 text-rose-700 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              Butuh Intervensi
            </div>
          </div>
        </div>

        {/* Funding Components Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#EAF0F6] p-5 shadow-sm space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3">
            <h3 className="text-sm font-bold text-[#153B66]">
              Struktur Alokasi Program Nasional
            </h3>
            <p className="text-xs text-[#526579]">
              Distribusi 4 pos utama transfer dana pendidikan pusat ke daerah
            </p>
          </div>

          <div className="space-y-3">
            {summary.fundingComponents.map((item, idx) => (
              <div key={idx} className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] space-y-1.5">
                <div className="flex justify-between items-start text-xs">
                  <span className="font-bold text-[#172B4D] max-w-[70%]">{item.name}</span>
                  <span className="font-extrabold text-[#153B66]">
                    Rp {item.allocationTrillion} T
                  </span>
                </div>
                <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#25A9A1] rounded-full"
                    style={{ width: `${item.sharePct * 2}%` }}
                  />
                </div>
                <div className="text-[10px] text-[#526579] flex justify-between">
                  <span>Porsi APBN: {item.sharePct}%</span>
                  <span className="text-emerald-600 font-bold">Terserap Lancar</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#E6F8F6]/60 rounded-lg border border-[#BCECE8] text-[11px] text-[#172B4D]">
            <strong>Catatan Dana Transfer:</strong> Dana BOS dan DAK langsung disalurkan dari Rekening Kas Umum Negara (RKUN) ke rekening sekolah untuk meminimalkan keterlambatan kas daerah.
          </div>
        </div>
      </div>

      {/* 38 Provinces Table */}
      <div className="bg-white rounded-xl border border-[#EAF0F6] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
          <div>
            <h3 className="text-sm font-bold text-[#153B66]">
              Tabel Anggaran & Belanja Pendidikan per Provinsi (38 Provinsi)
            </h3>
            <p className="text-xs text-[#526579]">
              Data perbandingan alokasi APBD dan realisasi belanja per siswa
            </p>
          </div>

          {/* Search & Island filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-[#526579] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari provinsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-medium pl-8 pr-3 py-1.5 border border-[#DCE5EF] rounded-lg text-[#172B4D] focus:outline-none focus:ring-1 focus:ring-[#25A9A1]"
              />
            </div>

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
          </div>
        </div>

        <div className="overflow-x-auto border border-[#EAF0F6] rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#526579] font-bold border-b border-[#EAF0F6]">
              <tr>
                <th className="py-2.5 px-3">Provinsi</th>
                <th className="py-2.5 px-3">Gugus Pulau</th>
                <th className="py-2.5 px-3">Porsi APBD (%)</th>
                <th className="py-2.5 px-3">Total Anggaran</th>
                <th className="py-2.5 px-3">Belanja / Murid</th>
                <th className="py-2.5 px-3">Serapan BOS</th>
                <th className="py-2.5 px-3">IPM Pendidikan</th>
                <th className="py-2.5 px-3">Status Kuadran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredProvinces.map((prov) => (
                <tr key={prov.provinceId} className="hover:bg-[#F8FAFC]/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#153B66]">
                    {prov.provinceName}
                  </td>
                  <td className="py-2.5 px-3 text-[#526579]">{prov.islandGroup}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#172B4D]">
                    {prov.apbdEducationPct}%
                  </td>
                  <td className="py-2.5 px-3 text-[#526579]">
                    Rp {prov.totalEducationBudgetTrillion} T
                  </td>
                  <td className="py-2.5 px-3 font-extrabold text-[#153B66]">
                    Rp {(prov.spendingPerStudent / 1e6).toFixed(2)} Juta
                  </td>
                  <td className="py-2.5 px-3 text-emerald-600 font-bold">
                    {prov.bosAbsorptionRate}%
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#172B4D]">
                    {prov.ipmEducation}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold inline-block"
                      style={{
                        backgroundColor: `${QUADRANT_COLORS[prov.efficiencyStatus] || '#25A9A1'}15`,
                        color: QUADRANT_COLORS[prov.efficiencyStatus] || '#25A9A1',
                      }}
                    >
                      {prov.efficiencyStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
