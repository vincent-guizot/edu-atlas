import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import {
  Sliders,
  TrendingUp,
  AlertTriangle,
  Users,
  GraduationCap,
  Building2,
  DollarSign,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { FORECASTING_BASELINE_SNAPSHOT } from '../../constants/expansion.constants';

export const SimulatorPage: React.FC = () => {
  // Baseline data
  const baseline = FORECASTING_BASELINE_SNAPSHOT;

  // Simulator Interactive State (Sliders)
  const [retirementRate, setRetirementRate] = useState<number>(2.8); // persen pensiun tahunan
  const [pppkQuota, setPppkQuota] = useState<number>(65000); // kuota guru baru per tahun
  const [studentGrowthRate, setStudentGrowthRate] = useState<number>(1.2); // persen pertumbuhan siswa
  const [targetStr, setTargetStr] = useState<number>(17.5); // target rasio murid:guru
  const [costInflation, setCostInflation] = useState<number>(4.5); // persen inflasi biaya

  const [activeTab, setActiveTab] = useState<'chart' | 'matrix' | 'budget'>('chart');
  const [selectedIslandFilter, setSelectedIslandFilter] = useState<string>('Semua');

  // Reset to default
  const handleReset = () => {
    setRetirementRate(baseline.defaultParameters.annualTeacherRetirementRate);
    setPppkQuota(baseline.defaultParameters.annualPppkRecruitmentQuota);
    setStudentGrowthRate(baseline.defaultParameters.annualStudentGrowthRate);
    setTargetStr(baseline.defaultParameters.targetStrNational);
    setCostInflation(baseline.defaultParameters.inflationBOSCost);
  };

  // Dynamic 5-Year Projection Calculation (2026 - 2030)
  const projectionTimeline = useMemo(() => {
    const years = [2026, 2027, 2028, 2029, 2030];
    let currentStudents = baseline.nationalBaseline.totalStudents;
    let currentTeachers = baseline.nationalBaseline.totalTeachers;

    return years.map((year, idx) => {
      if (idx > 0) {
        currentStudents = Math.round(currentStudents * (1 + studentGrowthRate / 100));
        const retired = Math.round(currentTeachers * (retirementRate / 100));
        const recruited = pppkQuota;
        currentTeachers = currentTeachers - retired + recruited;
      }

      const idealTeachers = Math.round(currentStudents / targetStr);
      const gap = currentTeachers - idealTeachers; // Positif = surplus, Negatif = defisit
      const actualStr = Number((currentStudents / Math.max(1, currentTeachers)).toFixed(2));
      const neededClassrooms = Math.round(currentStudents / 32); // SPM rata-rata 32 siswa/kelas
      const additionalBudgetTrillion = Number(
        (
          ((Math.max(0, -gap) * baseline.nationalBaseline.annualTeacherSalaryStandardRp) / 1e12) *
          Math.pow(1 + costInflation / 100, idx)
        ).toFixed(2)
      );

      return {
        year,
        students: currentStudents,
        teachers: currentTeachers,
        idealTeachers,
        gap,
        str: actualStr,
        neededClassrooms,
        additionalBudgetTrillion,
        isDeficit: gap < 0,
      };
    });
  }, [retirementRate, pppkQuota, studentGrowthRate, targetStr, costInflation, baseline]);

  const latest2030 = projectionTimeline[projectionTimeline.length - 1];

  // Per-Island Simulation Matrix
  const islandMatrix = useMemo(() => {
    return baseline.islandBaselines.map((island) => {
      const studentGrowthFactor = Math.pow(1 + studentGrowthRate / 100, 4);
      const estStudents2030 = Math.round(island.students * studentGrowthFactor);

      // Total pensiun 4 tahun
      const totalRetired = Math.round(island.teachers * (retirementRate / 100) * 4);
      // Proporsi pembagian PPPK berdasarkan share guru
      const share = island.teachers / baseline.nationalBaseline.totalTeachers;
      const totalRecruited = Math.round(pppkQuota * 4 * share);
      const estTeachers2030 = island.teachers - totalRetired + totalRecruited;

      const estStr2030 = Number((estStudents2030 / Math.max(1, estTeachers2030)).toFixed(1));
      const teacherGap = estTeachers2030 - Math.round(estStudents2030 / targetStr);
      const neededRkb = Math.max(0, Math.round((estStudents2030 - island.students) / 32));

      return {
        ...island,
        students2030: estStudents2030,
        teachers2030: estTeachers2030,
        retired4Years: totalRetired,
        recruited4Years: totalRecruited,
        str2030: estStr2030,
        gap: teacherGap,
        neededRkb,
        isDeficit: teacherGap < 0,
      };
    });
  }, [baseline, retirementRate, pppkQuota, studentGrowthRate, targetStr]);

  const filteredIslands = useMemo(() => {
    if (selectedIslandFilter === 'Semua') return islandMatrix;
    return islandMatrix.filter((i) => i.island === selectedIslandFilter);
  }, [islandMatrix, selectedIslandFilter]);

  const isSevereDeficit = latest2030.gap < -25000 || latest2030.str > 19.5;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Simulator Proyeksi Kebijakan 'What-If'"
        subtitle="Eksplorasi dan simulasi dampak kebijakan demografi guru, rekrutmen PPPK, dan kebutuhan sarpras nasional (2026–2030)"
        period="2026–2030"
      />

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-xl p-4.5 border border-[#EAF0F6] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#526579]">Rasio Murid-Guru (2030)</span>
            <div className="w-8 h-8 rounded-lg bg-[#E6F8F6] text-[#25A9A1] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#153B66] tracking-tight">
              {latest2030.str} : 1
            </span>
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                latest2030.str <= targetStr
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              Target: {targetStr}
            </span>
          </div>
          <p className="text-[11px] text-[#526579] mt-1">
            Baseline 2026: {baseline.nationalBaseline.currentStr} : 1
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl p-4.5 border border-[#EAF0F6] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#526579]">Keseimbangan Pendidik 2030</span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                latest2030.gap >= 0
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl font-extrabold tracking-tight ${
                latest2030.gap >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {latest2030.gap >= 0 ? `+${latest2030.gap.toLocaleString('id-ID')}` : latest2030.gap.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-[#526579]">Guru</span>
          </div>
          <p className="text-[11px] text-[#526579] mt-1">
            {latest2030.gap >= 0 ? 'Surplus ketersediaan guru nasional' : 'Defisit guru terhadap standar ideal SPM'}
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl p-4.5 border border-[#EAF0F6] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#526579]">Kebutuhan Ruang Kelas Baru</span>
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#153B66] tracking-tight">
              {Math.max(0, Math.round((latest2030.students - baseline.nationalBaseline.totalStudents) / 32)).toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-[#526579]">RKB</span>
          </div>
          <p className="text-[11px] text-[#526579] mt-1">
            Untuk mengakomodasi pertambahan siswa baru
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-xl p-4.5 border border-[#EAF0F6] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#526579]">Estimasi Kebutuhan Fiskal</span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#153B66] tracking-tight">
              Rp {latest2030.additionalBudgetTrillion} T
            </span>
            <span className="text-xs text-[#526579]">/ Tahun</span>
          </div>
          <p className="text-[11px] text-[#526579] mt-1">
            Tambahan belanja gaji pendidik & sarana RKB
          </p>
        </div>
      </div>

      {/* Crisis Alert Banner if severe deficit */}
      {isSevereDeficit && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-900 animate-fadeIn">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-rose-800 text-sm">
              Peringatan Dini: Potensi Krisis Ketersediaan Pendidik 2030
            </span>
            <p className="text-rose-700 leading-relaxed">
              Dengan laju pensiun saat ini ({retirementRate}%) dan kuota formasi rekrutmen ({pppkQuota.toLocaleString('id-ID')}/tahun), 
              terdapat defisit sebesar <strong>{Math.abs(latest2030.gap).toLocaleString('id-ID')} guru</strong> di tahun 2030. Disarankan menaikkan kuota PPPK atau mempercepat kelulusan PPG Prajabatan.
            </p>
          </div>
        </div>
      )}

      {/* Main Simulator Grid: Control Panel (Left) + Interactive Visualizations (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: PARAMETER CONTROL PANEL (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#EAF0F6] p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#25A9A1]" />
              <h3 className="text-sm font-bold text-[#153B66]">Panel Parameter Kebijakan</h3>
            </div>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-[#526579] hover:text-[#25A9A1] flex items-center gap-1 transition-colors"
              title="Kembalikan ke nilai default baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Slider 1: Laju Pensiun Guru Tahunan */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#172B4D]">Laju Pensiun Guru Tahunan</span>
              <span className="font-extrabold text-[#25A9A1] bg-[#E6F8F6] px-2 py-0.5 rounded">
                {retirementRate}% / thn
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.1"
              value={retirementRate}
              onChange={(e) => setRetirementRate(parseFloat(e.target.value))}
              className="w-full accent-[#25A9A1] cursor-pointer"
            />
            <p className="text-[10px] text-[#526579]">
              Setara ~{Math.round(baseline.nationalBaseline.totalTeachers * (retirementRate / 100)).toLocaleString('id-ID')} guru pensiun/tahun
            </p>
          </div>

          {/* Slider 2: Kuota Rekrutmen PPPK/ASN */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#172B4D]">Kuota Rekrutmen PPPK / ASN</span>
              <span className="font-extrabold text-[#25A9A1] bg-[#E6F8F6] px-2 py-0.5 rounded">
                {pppkQuota.toLocaleString('id-ID')} org / thn
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="150000"
              step="5000"
              value={pppkQuota}
              onChange={(e) => setPppkQuota(parseInt(e.target.value))}
              className="w-full accent-[#25A9A1] cursor-pointer"
            />
            <p className="text-[10px] text-[#526579]">
              Total formasi baru yang disahkan MenPAN-RB & Kemendikbud
            </p>
          </div>

          {/* Slider 3: Pertumbuhan Jumlah Siswa */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#172B4D]">Pertumbuhan Siswa Tahunan</span>
              <span className="font-extrabold text-[#153B66] bg-[#F1F5F9] px-2 py-0.5 rounded">
                {studentGrowthRate > 0 ? `+${studentGrowthRate}%` : `${studentGrowthRate}%`}
              </span>
            </div>
            <input
              type="range"
              min="-1.0"
              max="4.0"
              step="0.1"
              value={studentGrowthRate}
              onChange={(e) => setStudentGrowthRate(parseFloat(e.target.value))}
              className="w-full accent-[#153B66] cursor-pointer"
            />
            <p className="text-[10px] text-[#526579]">
              Faktor angka kelahiran & Angka Partisipasi Kasar (APK)
            </p>
          </div>

          {/* Slider 4: Target Standar SPM Rasio Siswa:Guru */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#172B4D]">Target Standar Rasio (SPM)</span>
              <span className="font-extrabold text-[#153B66] bg-[#F1F5F9] px-2 py-0.5 rounded">
                1 : {targetStr}
              </span>
            </div>
            <input
              type="range"
              min="14.0"
              max="24.0"
              step="0.5"
              value={targetStr}
              onChange={(e) => setTargetStr(parseFloat(e.target.value))}
              className="w-full accent-[#153B66] cursor-pointer"
            />
            <p className="text-[10px] text-[#526579]">
              Batas aman daya dukung pengajaran ideal (SPM: 18:1)
            </p>
          </div>

          {/* Slider 5: Inflasi Biaya Belanja Sarpras & BOS */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#172B4D]">Inflasi Biaya Satuan (BOS & RKB)</span>
              <span className="font-extrabold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded">
                {costInflation}%
              </span>
            </div>
            <input
              type="range"
              min="2.0"
              max="8.0"
              step="0.5"
              value={costInflation}
              onChange={(e) => setCostInflation(parseFloat(e.target.value))}
              className="w-full accent-[#D97706] cursor-pointer"
            />
            <p className="text-[10px] text-[#526579]">
              Kenaikan indeks kemahalan konstruksi & barang operasional
            </p>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-[11px] text-[#526579] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#153B66]">
              <Sparkles className="w-3.5 h-3.5 text-[#25A9A1]" />
              Metodologi Model Proyeksi
            </div>
            <p>
              Simulasi menggunakan algoritma kohort demografi multivariat deterministik yang memetakan guru usia pensiun (58-60 thn) terhadap kuota rekrutmen tahunan.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: SIMULATION OUTPUT VISUALIZATIONS (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#EAF0F6] p-5 shadow-sm space-y-4">
          {/* View Tab Switcher */}
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'chart'
                    ? 'bg-[#153B66] text-white shadow-sm'
                    : 'bg-[#F1F5F9] text-[#526579] hover:text-[#172B4D]'
                }`}
              >
                Grafik Proyeksi 5 Tahun
              </button>
              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'matrix'
                    ? 'bg-[#153B66] text-white shadow-sm'
                    : 'bg-[#F1F5F9] text-[#526579] hover:text-[#172B4D]'
                }`}
              >
                Matriks Wilayah Pulau
              </button>
              <button
                onClick={() => setActiveTab('budget')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'budget'
                    ? 'bg-[#153B66] text-white shadow-sm'
                    : 'bg-[#F1F5F9] text-[#526579] hover:text-[#172B4D]'
                }`}
              >
                Dampak Anggaran Fiskal
              </button>
            </div>

            <span className="text-[11px] text-[#526579] hidden sm:inline">
              Model Update: Real-time Reactive
            </span>
          </div>

          {/* TAB 1: 5-YEAR PROJECTION CHART */}
          {activeTab === 'chart' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-[#153B66]">Tren Ketersediaan Guru vs Kebutuhan Ideal</h4>
                  <p className="text-[#526579]">Proyeksi dinamis jumlah guru riil dibanding kuota ideal rasio {targetStr}:1</p>
                </div>
              </div>

              <div className="h-[290px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#25A9A1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#25A9A1" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorIdeal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#153B66" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#153B66" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#526579' }} />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#526579' }}
                      tickFormatter={(val) => `${(val / 1e6).toFixed(2)}M`}
                    />
                    <Tooltip
                      formatter={(value: any, name: any) => [
                        `${Number(value).toLocaleString('id-ID')} Guru`,
                        name === 'teachers' ? 'Guru Aktif Riil' : 'Kebutuhan Guru Ideal (SPM)',
                      ]}
                      labelFormatter={(label) => `Tahun ${label}`}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #EAF0F6' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area
                      type="monotone"
                      dataKey="teachers"
                      name="teachers"
                      stroke="#25A9A1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorTeachers)"
                    />
                    <Line
                      type="monotone"
                      dataKey="idealTeachers"
                      name="idealTeachers"
                      stroke="#153B66"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Annual Summary Table Strip */}
              <div className="grid grid-cols-5 gap-2 pt-2 border-t border-[#F1F5F9] text-center">
                {projectionTimeline.map((item) => (
                  <div key={item.year} className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="text-[11px] font-bold text-[#526579]">{item.year}</div>
                    <div className="text-xs font-extrabold text-[#153B66] mt-0.5">
                      {item.str} : 1
                    </div>
                    <div
                      className={`text-[10px] font-bold mt-0.5 ${
                        item.gap >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {item.gap >= 0 ? `+${Math.round(item.gap / 1000)}k` : `${Math.round(item.gap / 1000)}k`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PER-ISLAND MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-[#153B66]">Distribusi Proyeksi per Wilayah Kepulauan (2030)</h4>
                  <p className="text-[11px] text-[#526579]">Simulasi dampak laju pensiun dan alokasi guru baru per pulau</p>
                </div>
                <select
                  value={selectedIslandFilter}
                  onChange={(e) => setSelectedIslandFilter(e.target.value)}
                  className="text-xs font-medium border border-[#DCE5EF] rounded-lg px-2.5 py-1 text-[#172B4D] focus:outline-none focus:ring-1 focus:ring-[#25A9A1]"
                >
                  <option value="Semua">Semua Pulau</option>
                  {baseline.islandBaselines.map((b) => (
                    <option key={b.island} value={b.island}>
                      {b.island}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto border border-[#EAF0F6] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#526579] font-bold border-b border-[#EAF0F6]">
                    <tr>
                      <th className="py-2.5 px-3">Gugus Kepulauan</th>
                      <th className="py-2.5 px-3">Siswa 2030</th>
                      <th className="py-2.5 px-3">Guru 2030</th>
                      <th className="py-2.5 px-3">Total Pensiun</th>
                      <th className="py-2.5 px-3">PPPK Masuk</th>
                      <th className="py-2.5 px-3">Rasio (STR)</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredIslands.map((row) => (
                      <tr key={row.island} className="hover:bg-[#F8FAFC]/80 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-[#153B66]">{row.island}</td>
                        <td className="py-2.5 px-3">{(row.students2030 / 1e6).toFixed(2)} Juta</td>
                        <td className="py-2.5 px-3">{row.teachers2030.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 px-3 text-rose-600 font-medium">-{row.retired4Years.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 px-3 text-emerald-600 font-medium">+{row.recruited4Years.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 px-3 font-bold text-[#172B4D]">{row.str2030} : 1</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.isDeficit
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {row.isDeficit ? 'Defisit Guru' : 'Memadai'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: FISCAL IMPACT */}
          {activeTab === 'budget' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-xs text-[#153B66]">Estimasi Kebutuhan Belanja Tambahan APBN (2026–2030)</h4>
                <p className="text-[11px] text-[#526579]">Biaya pemenuhan defisit guru & konstruksi Ruang Kelas Baru (RKB) per tahun</p>
              </div>

              <div className="h-[290px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectionTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#526579' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#526579' }} tickFormatter={(val) => `Rp ${val}T`} />
                    <Tooltip
                      formatter={(val: any) => [`Rp ${val} Triliun`, 'Anggaran Tambahan']}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #EAF0F6' }}
                    />
                    <Bar dataKey="additionalBudgetTrillion" fill="#D97706" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 bg-[#FEF3C7]/40 border border-[#FDE68A] rounded-xl flex items-start gap-2.5 text-xs text-[#92400E]">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Perhitungan anggaran tambahan mengasumsikan standar biaya gaji pokok + tunjangan fungsional pendidik Rp 68 Juta/tahun/guru dan biaya konstruksi RKB Rp 185 Juta/unit dengan tingkat inflasi {costInflation}%.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
