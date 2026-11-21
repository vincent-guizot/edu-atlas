import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import {
  Search,
  MapPin,
  School,
  X,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatNumber } from '../../lib/formatters';
import {
  MAP_INSTITUTIONS_DATA,
  MapInstitution,
  SEBARAN_PROVINSI_DATA,
  SEBARAN_PULAU_DATA,
} from '../../constants/maps.constants';

// Custom Marker Creator
const createMarkerIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div style="
        background-color: ${color};
        width: 26px;
        height: 26px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        border: 2px solid #FFFFFF;
      ">
        <span style="transform: rotate(45deg); color: #fff; font-size: 9px; font-weight: bold;">
          ${label}
        </span>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
  });
};

const icons: Record<string, L.DivIcon> = {
  SD: createMarkerIcon('#1D4ED8', 'SD'),
  SMP: createMarkerIcon('#00A896', 'SMP'),
  SMA: createMarkerIcon('#F59E0B', 'SMA'),
  SMK: createMarkerIcon('#9333EA', 'SMK'),
  Universitas: createMarkerIcon('#EF4444', 'Univ'),
  Politeknik: createMarkerIcon('#0284C7', 'Pol'),
  Akademi: createMarkerIcon('#EA580C', 'Akd'),
  Lainnya: createMarkerIcon('#64748B', 'Lain'),
};

export const InteractiveMapsPage: React.FC = () => {
  const { period, setPeriod } = useOutletContext<{ period: string; setPeriod: (p: string) => void }>();
  const [activeTab, setActiveTab] = useState<string>('Semua');
  const [mapType, setMapType] = useState<'peta' | 'satelit'>('peta');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedInstitution, setSelectedInstitution] = useState<MapInstitution | null>(null);
  const [sebaranScope, setSebaranScope] = useState<'provinsi' | 'pulau'>('provinsi');

  // Pagination State for Table
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  const categories = [
    'Semua',
    'Sekolah Dasar',
    'SMP',
    'SMA',
    'SMK',
    'Universitas',
    'Politeknik',
    'Akademi',
    'Lainnya',
  ];

  // Filter institutions based on active category tab & search query
  const filteredInstitutions = useMemo(() => {
    return MAP_INSTITUTIONS_DATA.filter((item) => {
      // Category tab condition
      const categoryMatch =
        activeTab === 'Semua' ||
        (activeTab === 'Sekolah Dasar' && item.type === 'SD') ||
        item.type === activeTab;

      // Search query condition
      const q = searchQuery.toLowerCase().trim();
      const searchMatch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.prov.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q);

      return categoryMatch && searchMatch;
    });
  }, [activeTab, searchQuery]);

  // Handle Tab Switch with page reset
  const handleTabChange = (cat: string) => {
    setActiveTab(cat);
    setCurrentPage(1);
    if (selectedInstitution) {
      const stillVisible =
        cat === 'Semua' ||
        (cat === 'Sekolah Dasar' && selectedInstitution.type === 'SD') ||
        selectedInstitution.type === cat;
      if (!stillVisible) {
        setSelectedInstitution(null);
      }
    }
  };

  // Handle Search with page reset
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  // Table pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredInstitutions.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedInstitutions = filteredInstitutions.slice(startIndex, startIndex + pageSize);

  const activeSebaranData = sebaranScope === 'provinsi' ? SEBARAN_PROVINSI_DATA : SEBARAN_PULAU_DATA;

  return (
    <div className="space-y-6">
      {/* Universal Page Header */}
      <PageHeader
        title="Interactive Maps"
        subtitle="Jelajahi sebaran sekolah, universitas, dan institusi pendidikan di seluruh Indonesia."
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Top 3 Cards Row: Ringkasan Sebaran | Sebaran Sekolah per Wilayah | Top 5 Provinsi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Ringkasan Sebaran Institusi */}
        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#153B66] font-heading flex items-center gap-1.5">
              <School className="w-4 h-4 text-[#25A9A1]" />
              Ringkasan Sebaran Institusi
            </h4>
            <p className="text-xs text-[#526579] mt-0.5">
              Total institusi terdata menurut jenjang pendidikan
            </p>
          </div>
          <div className="space-y-2 text-xs">
            {[
              { label: 'Sekolah Dasar (SD)', count: '69.482', percent: '45,2%', color: '#1D4ED8', w: '75%' },
              { label: 'SMP', count: '46.215', percent: '28,4%', color: '#00A896', w: '55%' },
              { label: 'SMA', count: '31.420', percent: '20,4%', color: '#F59E0B', w: '40%' },
              { label: 'SMK', count: '9.154', percent: '6,3%', color: '#9333EA', w: '20%' },
              { label: 'Universitas & Lainnya', count: '4.521', percent: '2,9%', color: '#EF4444', w: '12%' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-medium text-[#526579]">{item.label}</span>
                  <span className="font-bold text-[#172B4D]">
                    {item.count} <span className="text-[#526579] font-normal">({item.percent})</span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: item.w, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Sebaran Sekolah Per Wilayah (Pie Chart with Switch Provinsi vs Pulau) */}
        <div data-testid="sebaran-card" className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h4 className="text-sm font-bold text-[#153B66] font-heading">
                Sebaran Sekolah per Wilayah
              </h4>
              <p className="text-xs text-[#526579] mt-0.5">
                Proporsi sebaran institusi pendidikan
              </p>
            </div>
            {/* Scope Switch: Provinsi vs Pulau */}
            <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-lg text-[10px] font-semibold shrink-0">
              <button
                type="button"
                onClick={() => setSebaranScope('provinsi')}
                className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                  sebaranScope === 'provinsi'
                    ? 'bg-[#153B66] text-white shadow-2xs'
                    : 'text-[#526579] hover:text-[#172B4D]'
                }`}
              >
                Provinsi
              </button>
              <button
                type="button"
                onClick={() => setSebaranScope('pulau')}
                className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                  sebaranScope === 'pulau'
                    ? 'bg-[#153B66] text-white shadow-2xs'
                    : 'text-[#526579] hover:text-[#172B4D]'
                }`}
              >
                Pulau
              </button>
            </div>
          </div>

          {/* Pie Chart & Interactive Legend */}
          <div className="flex flex-col items-center">
            <div className="w-full h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeSebaranData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={50}
                    paddingAngle={3}
                  >
                    {activeSebaranData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number, name: string) => [
                      `${val.toLocaleString('id-ID')} institusi`,
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #DCE5EF',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Compact Legend */}
            <div className="w-full grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] pt-1.5 border-t border-[#F1F5F9]">
              {activeSebaranData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-[#526579]">
                  <span className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="font-bold text-[#172B4D] shrink-0 ml-1">{item.percentage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Top 5 Provinsi dengan Sekolah Terbanyak */}
        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#153B66] font-heading">
              Top 5 Provinsi Sekolah Terbanyak
            </h4>
            <p className="text-xs text-[#526579] mt-0.5">
              Peringkat provinsi dengan jumlah sekolah tertinggi
            </p>
          </div>
          <div className="space-y-2 text-[11px]">
            {[
              { rank: 1, name: 'Jawa Barat', count: '18.254', percent: '14,5%', w: '85%' },
              { rank: 2, name: 'Jawa Timur', count: '15.892', percent: '12,6%', w: '70%' },
              { rank: 3, name: 'Jawa Tengah', count: '12.840', percent: '10,2%', w: '55%' },
              { rank: 4, name: 'DKI Jakarta', count: '8.412', percent: '6,7%', w: '35%' },
              { rank: 5, name: 'Sumatera Utara', count: '7.621', percent: '6,0%', w: '30%' },
            ].map((p) => (
              <div key={p.rank} className="flex items-center justify-between gap-2">
                <span className="text-[#526579] w-4 font-semibold">{p.rank}</span>
                <span className="font-semibold text-[#172B4D] truncate w-24">{p.name}</span>
                <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#25A9A1] rounded-full" style={{ width: p.w }} />
                </div>
                <span className="font-bold text-[#172B4D] text-right w-14">{p.count}</span>
                <span className="text-[#526579] w-10 text-right">{p.percent}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Pills (Functional Filter Tabs) */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
        {categories.map((cat) => {
          const count =
            cat === 'Semua'
              ? MAP_INSTITUTIONS_DATA.length
              : MAP_INSTITUTIONS_DATA.filter(
                  (i) => (cat === 'Sekolah Dasar' ? i.type === 'SD' : i.type === cat),
                ).length;

          return (
            <button
              key={cat}
              type="button"
              data-testid={`tab-${cat}`}
              onClick={() => handleTabChange(cat)}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === cat
                  ? 'bg-[#0F2942] text-white shadow-xs font-bold'
                  : 'bg-white border border-[#DCE5EF] text-[#526579] hover:bg-[#F8FAFC] hover:text-[#0F2942]'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                  activeTab === cat
                    ? 'bg-white/20 text-white'
                    : 'bg-[#F1F5F9] text-[#526579]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Full Width Map Container */}
      <div className="bg-white border border-[#DCE5EF] rounded-2xl overflow-hidden shadow-2xs flex flex-col relative h-[560px] w-full">
        {/* Map Top Bar (Search + Info) */}
        <div className="p-3 bg-white/95 backdrop-blur-xs border-b border-[#F1F5F9] z-20 flex items-center gap-3">
          <div className="flex items-center bg-[#F8FAFC] border border-[#DCE5EF] rounded-xl px-3 py-1.5 flex-1 text-xs max-w-md">
            <Search className="w-3.5 h-3.5 text-[#526579] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari nama institusi, kota, atau provinsi..."
              className="bg-transparent border-none outline-none text-[#172B4D] w-full placeholder:text-[#94A3B8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="text-[#94A3B8] hover:text-[#172B4D] ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="text-[11px] text-[#526579] font-medium hidden sm:block">
            Menampilkan <strong className="text-[#153B66]">{filteredInstitutions.length}</strong> institusi di peta
          </div>
        </div>

        {/* Leaflet Map */}
        <div className="flex-1 w-full relative">
          <MapContainer
            center={[-6.9147, 107.6098]}
            zoom={11}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={
                mapType === 'peta'
                  ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              }
            />

            {/* Markers: No default Leaflet popup to avoid double popup. Single popup shown in top-right! */}
            {filteredInstitutions.map((inst) => (
              <Marker
                key={inst.id}
                position={[inst.lat, inst.lng]}
                icon={icons[inst.type] || icons.SMA}
                eventHandlers={{
                  click: () => setSelectedInstitution(inst),
                }}
              />
            ))}
          </MapContainer>

          {/* Single Detail Popup Card in Top-Right of Map (No Double Popup) */}
          {selectedInstitution ? (
            <div
              data-testid="selected-institution-card"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#DCE5EF] p-4 text-xs w-72 sm:w-80 z-[1000] animate-in fade-in zoom-in-95"
            >
              <div className="flex items-start justify-between border-b border-[#F1F5F9] pb-2.5 mb-2.5">
                <div className="pr-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#25A9A1] bg-[#E0F7F6] px-2 py-0.5 rounded-md">
                    {selectedInstitution.type} • {selectedInstitution.status}
                  </span>
                  <h4 className="font-bold text-[#153B66] text-sm mt-1.5 leading-snug">
                    {selectedInstitution.name}
                  </h4>
                  <span className="text-[11px] text-[#526579] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#25A9A1] shrink-0" /> {selectedInstitution.city}, {selectedInstitution.prov}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Tutup Detail"
                  onClick={() => setSelectedInstitution(null)}
                  className="text-[#94A3B8] hover:text-[#172B4D] p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[#526579]">
                  <span>Jumlah Siswa:</span>
                  <span className="font-bold text-[#172B4D] text-right">{formatNumber(selectedInstitution.students)}</span>
                  <span>Jumlah Guru:</span>
                  <span className="font-bold text-[#172B4D] text-right">{selectedInstitution.teachers}</span>
                  <span>Akreditasi:</span>
                  <span className="font-bold text-[#16835D] text-right">Predikat {selectedInstitution.accreditation}</span>
                  <span>Jarak Perkiraan:</span>
                  <span className="font-bold text-[#25A9A1] text-right">{selectedInstitution.distance}</span>
                </div>
                <div className="pt-2 border-t border-[#F1F5F9] text-[11px] text-[#526579]">
                  <span className="font-medium text-[#172B4D]">Alamat: </span>
                  <span>{selectedInstitution.address}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Subtle hint in Top-Right initially */
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-xs rounded-xl shadow-xs border border-[#DCE5EF] px-3.5 py-2 text-[11px] text-[#526579] z-[1000] pointer-events-none flex items-center gap-1.5">
              <span>💡 Klik penanda institusi pada peta atau baris tabel untuk melihat detail</span>
            </div>
          )}

          {/* Bottom Pins Legend */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-[#DCE5EF] rounded-xl px-3 py-1.5 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#526579] shadow-xs z-[1000]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" /> SD</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#00A896]" /> SMP</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> SMA</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#9333EA]" /> SMK</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Univ</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" /> Pol</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" /> Akd</span>
          </div>

          {/* Map / Satellite Toggle */}
          <div className="absolute bottom-3 right-3 bg-white border border-[#DCE5EF] rounded-xl p-0.5 flex items-center text-xs font-semibold shadow-xs z-[1000]">
            <button
              type="button"
              onClick={() => setMapType('peta')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                mapType === 'peta' ? 'bg-[#153B66] text-white shadow-2xs' : 'text-[#526579] hover:text-[#172B4D]'
              }`}
            >
              Peta
            </button>
            <button
              type="button"
              onClick={() => setMapType('satelit')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                mapType === 'satelit' ? 'bg-[#153B66] text-white shadow-2xs' : 'text-[#526579] hover:text-[#172B4D]'
              }`}
            >
              Satelit
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Table: Daftar Institusi Pendidikan with Pagination */}
      <div className="bg-white border border-[#DCE5EF] rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#153B66] font-heading">
              Daftar Institusi Pendidikan Terdata ({filteredInstitutions.length} Institusi)
            </h3>
            <p className="text-xs text-[#526579] mt-0.5">
              Klik salah satu baris untuk menyorot dan melihat detail pada panel kanan atas peta
            </p>
          </div>
          <div className="text-xs text-[#526579]">
            Kategori aktif: <span className="font-bold text-[#153B66]">{activeTab}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#526579] font-semibold border-b border-[#DCE5EF]">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Nama Institusi</th>
                <th className="py-2.5 px-3">Jenis</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Provinsi</th>
                <th className="py-2.5 px-3">Kota/Kabupaten</th>
                <th className="py-2.5 px-3 text-right">Jumlah Siswa</th>
                <th className="py-2.5 px-3 text-right">Jumlah Guru</th>
                <th className="py-2.5 px-3 text-center">Akreditasi</th>
                <th className="py-2.5 px-3 text-center">Lokasi Peta</th>
                <th className="py-2.5 px-3 text-right">Jarak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#172B4D]">
              {paginatedInstitutions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-[#526579]">
                    Tidak ada institusi yang cocok dengan filter atau kata kunci pencarian.
                  </td>
                </tr>
              ) : (
                paginatedInstitutions.map((row, idx) => {
                  const isSelected = selectedInstitution?.id === row.id;

                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedInstitution(row)}
                      className={`hover:bg-[#F8FAFC] cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#E0F7F6]/50 font-semibold' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-[#526579]">{startIndex + idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-[#153B66]">{row.name}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-slate-100 text-[#526579]">
                          {row.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`font-semibold text-[10px] px-2 py-0.5 rounded ${
                            row.status === 'Negeri'
                              ? 'bg-emerald-50 text-[#16835D]'
                              : 'bg-amber-50 text-[#B7791F]'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#526579]">{row.prov}</td>
                      <td className="py-2.5 px-3 text-[#526579]">{row.city}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{formatNumber(row.students)}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{row.teachers}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-bold text-[#16835D] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          {row.accreditation}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-[#25A9A1]">
                        <button
                          type="button"
                          aria-label={`Lihat lokasi ${row.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInstitution(row);
                          }}
                          className="hover:scale-110 transition-transform p-1 cursor-pointer"
                        >
                          <MapPin className="w-4 h-4 mx-auto text-[#25A9A1]" />
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#25A9A1]">{row.distance}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        {filteredInstitutions.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-2 border-t border-[#F1F5F9] text-xs">
            <div data-testid="pagination-info" className="text-[#526579]">
              Menampilkan{' '}
              <strong className="text-[#172B4D]">{startIndex + 1}</strong> –{' '}
              <strong className="text-[#172B4D]">
                {Math.min(startIndex + pageSize, filteredInstitutions.length)}
              </strong>{' '}
              dari <strong className="text-[#172B4D]">{filteredInstitutions.length}</strong> institusi
            </div>

            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  currentPage === 1
                    ? 'border-[#E2E8F0] text-[#94A3B8] bg-slate-50 cursor-not-allowed'
                    : 'border-[#DCE5EF] text-[#172B4D] bg-white hover:bg-[#F8FAFC] cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#153B66] text-white shadow-2xs'
                        : 'bg-white border border-[#DCE5EF] text-[#526579] hover:bg-[#F8FAFC] hover:text-[#172B4D]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  currentPage === totalPages
                    ? 'border-[#E2E8F0] text-[#94A3B8] bg-slate-50 cursor-not-allowed'
                    : 'border-[#DCE5EF] text-[#172B4D] bg-white hover:bg-[#F8FAFC] cursor-pointer'
                }`}
              >
                Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
