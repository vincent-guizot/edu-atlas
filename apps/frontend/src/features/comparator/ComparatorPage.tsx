import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import {
  Scale,
  Building2,
  GraduationCap,
  Plus,
  X,
  Check,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Users,
  Award,
  Layers,
  Printer,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
} from 'recharts';
import { SCHOOLS_SNAPSHOT_DATA, SchoolItem } from '../../constants/schools.constants';
import { UNIVERSITIES_SNAPSHOT_DATA, UniversityItem } from '../../constants/universities.constants';

const ENTITY_COLORS = ['#25A9A1', '#3B82F6', '#F59E0B', '#EC4899'];

export const ComparatorPage: React.FC = () => {
  const [mode, setMode] = useState<'schools' | 'universities'>('schools');

  // Selected School IDs (default 3 top schools)
  const [selectedSchoolIds, setSelectedSchoolIds] = useState<string[]>([
    SCHOOLS_SNAPSHOT_DATA[0]?.id || 'SCH-001',
    SCHOOLS_SNAPSHOT_DATA[1]?.id || 'SCH-002',
    SCHOOLS_SNAPSHOT_DATA[2]?.id || 'SCH-003',
  ]);

  // Selected University IDs (default 3 top universities)
  const [selectedUnivIds, setSelectedUnivIds] = useState<string[]>([
    UNIVERSITIES_SNAPSHOT_DATA[0]?.id || 'univ-001',
    UNIVERSITIES_SNAPSHOT_DATA[1]?.id || 'univ-002',
    UNIVERSITIES_SNAPSHOT_DATA[2]?.id || 'univ-003',
  ]);

  const [searchSchoolQuery, setSearchSchoolQuery] = useState('');
  const [searchUnivQuery, setSearchUnivQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Active Selected Entities
  const selectedSchools = useMemo(() => {
    return selectedSchoolIds
      .map((id) => SCHOOLS_SNAPSHOT_DATA.find((s) => s.id === id))
      .filter(Boolean) as SchoolItem[];
  }, [selectedSchoolIds]);

  const selectedUniversities = useMemo(() => {
    return selectedUnivIds
      .map((id) => UNIVERSITIES_SNAPSHOT_DATA.find((u) => u.id === id))
      .filter(Boolean) as UniversityItem[];
  }, [selectedUnivIds]);

  // Quick Preset Actions
  const handlePresetSchools = (type: 'sma' | 'smk' | 'negeri') => {
    if (type === 'sma') {
      const smas = SCHOOLS_SNAPSHOT_DATA.filter((s) => s.stage === 'SMA').slice(0, 3);
      setSelectedSchoolIds(smas.map((s) => s.id));
    } else if (type === 'smk') {
      const smks = SCHOOLS_SNAPSHOT_DATA.filter((s) => s.stage === 'SMK').slice(0, 3);
      setSelectedSchoolIds(smks.map((s) => s.id));
    } else {
      const negeris = SCHOOLS_SNAPSHOT_DATA.filter((s) => s.status === 'Negeri').slice(0, 3);
      setSelectedSchoolIds(negeris.map((s) => s.id));
    }
  };

  const handlePresetUniversities = (type: 'ptn' | 'pts') => {
    if (type === 'ptn') {
      const ptns = UNIVERSITIES_SNAPSHOT_DATA.filter((u) => u.type.startsWith('PTN')).slice(0, 3);
      setSelectedUnivIds(ptns.map((u) => u.id));
    } else {
      const pts = UNIVERSITIES_SNAPSHOT_DATA.filter((u) => u.type === 'PTS').slice(0, 3);
      setSelectedUnivIds(pts.map((u) => u.id));
    }
  };

  const handleAddSchool = (id: string) => {
    if (selectedSchoolIds.length < 4 && !selectedSchoolIds.includes(id)) {
      setSelectedSchoolIds([...selectedSchoolIds, id]);
    }
    setIsDropdownOpen(false);
  };

  const handleRemoveSchool = (id: string) => {
    if (selectedSchoolIds.length > 2) {
      setSelectedSchoolIds(selectedSchoolIds.filter((item) => item !== id));
    }
  };

  const handleAddUniv = (id: string) => {
    if (selectedUnivIds.length < 4 && !selectedUnivIds.includes(id)) {
      setSelectedUnivIds([...selectedUnivIds, id]);
    }
    setIsDropdownOpen(false);
  };

  const handleRemoveUniv = (id: string) => {
    if (selectedUnivIds.length > 2) {
      setSelectedUnivIds(selectedUnivIds.filter((item) => item !== id));
    }
  };

  // Radar Data for Schools
  const schoolRadarData = useMemo(() => {
    const metrics = [
      { key: 'ratioScore', label: 'Rasio Pendidik (Ideal)' },
      { key: 'studentsNorm', label: 'Kapasitas Murid' },
      { key: 'teachersNorm', label: 'Kelengkapan Guru' },
      { key: 'accredScore', label: 'Bobot Akreditasi' },
      { key: 'facilityScore', label: 'Skor Sarpras' },
    ];

    return metrics.map((m) => {
      const entry: any = { metric: m.label };
      selectedSchools.forEach((s) => {
        let val = 75;
        if (m.key === 'ratioScore') {
          const str = s.totalStudents / Math.max(1, s.totalTeachers);
          val = Math.max(20, Math.min(100, Math.round(100 - Math.abs(str - 18) * 4)));
        } else if (m.key === 'studentsNorm') {
          val = Math.min(100, Math.round((s.totalStudents / 1200) * 100));
        } else if (m.key === 'teachersNorm') {
          val = Math.min(100, Math.round((s.totalTeachers / 80) * 100));
        } else if (m.key === 'accredScore') {
          val = s.accreditation === 'A' ? 95 : s.accreditation === 'B' ? 75 : 55;
        } else if (m.key === 'facilityScore') {
          val = s.status === 'Negeri' ? 88 : 82;
        }
        entry[s.name] = val;
      });
      return entry;
    });
  }, [selectedSchools]);

  // Radar Data for Universities
  const univRadarData = useMemo(() => {
    const metrics = [
      { key: 'rankScore', label: 'Peringkat Nasional' },
      { key: 'ratioScore', label: 'Rasio Dosen:Mhs' },
      { key: 'programsCount', label: 'Keragaman Fakultas' },
      { key: 'accredScore', label: 'Akreditasi Kampus' },
      { key: 'capacityScore', label: 'Daya Tampung' },
    ];

    return metrics.map((m) => {
      const entry: any = { metric: m.label };
      selectedUniversities.forEach((u) => {
        let val = 75;
        const rankIdx = UNIVERSITIES_SNAPSHOT_DATA.findIndex((x) => x.id === u.id) + 1;
        if (m.key === 'rankScore') {
          val = Math.max(30, 100 - rankIdx * 2);
        } else if (m.key === 'ratioScore') {
          const ratio = u.totalStudents / Math.max(1, u.totalLecturers);
          val = Math.max(20, Math.min(100, Math.round(100 - Math.abs(ratio - 20) * 3)));
        } else if (m.key === 'programsCount') {
          val = Math.min(100, Math.round((u.facultiesCount / 20) * 100));
        } else if (m.key === 'accredScore') {
          val = u.accreditation === 'Unggul' || u.accreditation === 'A' ? 98 : 80;
        } else if (m.key === 'capacityScore') {
          val = Math.min(100, Math.round((u.totalStudents / 55000) * 100));
        }
        entry[u.name] = val;
      });
      return entry;
    });
  }, [selectedUniversities]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Komparator Institusi Head-to-Head"
        subtitle="Analisis perbandingan komparatif multi-entitas secara berdampingan untuk sekolah (K-12) dan perguruan tinggi"
      />

      {/* Mode Switcher + Preset Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#EAF0F6] shadow-sm">
        <div className="flex items-center gap-2 bg-[#F1F5F9] p-1 rounded-xl">
          <button
            onClick={() => setMode('schools')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'schools'
                ? 'bg-[#153B66] text-white shadow-sm'
                : 'text-[#526579] hover:text-[#172B4D]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Mode Sekolah (K-12)
          </button>
          <button
            onClick={() => setMode('universities')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'universities'
                ? 'bg-[#153B66] text-white shadow-sm'
                : 'text-[#526579] hover:text-[#172B4D]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Mode Perguruan Tinggi
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#526579] font-medium hidden md:inline">Preset Cepat:</span>
          {mode === 'schools' ? (
            <>
              <button
                onClick={() => handlePresetSchools('sma')}
                className="px-2.5 py-1 rounded-lg border border-[#DCE5EF] text-[#172B4D] hover:bg-[#F8FAFC] text-[11px] font-semibold"
              >
                Top 3 SMA
              </button>
              <button
                onClick={() => handlePresetSchools('smk')}
                className="px-2.5 py-1 rounded-lg border border-[#DCE5EF] text-[#172B4D] hover:bg-[#F8FAFC] text-[11px] font-semibold"
              >
                Top 3 SMK
              </button>
              <button
                onClick={() => handlePresetSchools('negeri')}
                className="px-2.5 py-1 rounded-lg border border-[#DCE5EF] text-[#172B4D] hover:bg-[#F8FAFC] text-[11px] font-semibold"
              >
                Sekolah Negeri
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handlePresetUniversities('ptn')}
                className="px-2.5 py-1 rounded-lg border border-[#DCE5EF] text-[#172B4D] hover:bg-[#F8FAFC] text-[11px] font-semibold"
              >
                Top 3 PTN
              </button>
              <button
                onClick={() => handlePresetUniversities('pts')}
                className="px-2.5 py-1 rounded-lg border border-[#DCE5EF] text-[#172B4D] hover:bg-[#F8FAFC] text-[11px] font-semibold"
              >
                Top 3 PTS
              </button>
            </>
          )}
        </div>
      </div>

      {/* MODE 1: SCHOOLS COMPARATOR */}
      {mode === 'schools' && (
        <div className="space-y-6">
          {/* Side-by-Side Cards (Up to 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedSchools.map((school, idx) => {
              const str = Number((school.totalStudents / Math.max(1, school.totalTeachers)).toFixed(1));
              return (
                <div
                  key={school.id}
                  className="bg-white rounded-xl border-2 p-4 shadow-sm relative transition-all"
                  style={{ borderColor: ENTITY_COLORS[idx] }}
                >
                  {/* Remove Button if > 2 */}
                  {selectedSchools.length > 2 && (
                    <button
                      onClick={() => handleRemoveSchool(school.id)}
                      className="absolute top-3 right-3 text-[#526579] hover:text-rose-600 transition-colors"
                      title="Hapus dari komparasi"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: ENTITY_COLORS[idx] }}
                    />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#526579]">
                      {school.stage} • {school.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-[#153B66] leading-snug line-clamp-1">
                    {school.name}
                  </h4>
                  <p className="text-[11px] text-[#526579] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#25A9A1]" />
                    {school.city}, {school.province}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-[#F1F5F9] text-xs">
                    <div>
                      <span className="text-[10px] text-[#526579]">Total Siswa</span>
                      <p className="font-extrabold text-[#153B66]">{school.totalStudents.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#526579]">Total Guru</span>
                      <p className="font-extrabold text-[#153B66]">{school.totalTeachers.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#526579]">Rasio Murid:Guru</span>
                      <p className="font-extrabold text-[#25A9A1]">{str} : 1</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#526579]">Akreditasi</span>
                      <p className="font-extrabold text-emerald-700">Tingkat {school.accreditation}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add Entity Card (if < 4) */}
            {selectedSchools.length < 4 && (
              <div className="bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 min-h-[160px]">
                <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#526579]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#153B66]">Tambah Sekolah</h5>
                  <p className="text-[10px] text-[#526579]">Maksimal 4 entitas komparasi</p>
                </div>
                <div className="relative w-full max-w-[200px]">
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleAddSchool(e.target.value);
                    }}
                    value=""
                    className="w-full text-xs font-medium border border-[#DCE5EF] rounded-lg p-1.5 text-[#172B4D] bg-white cursor-pointer"
                  >
                    <option value="" disabled>Pilih sekolah...</option>
                    {SCHOOLS_SNAPSHOT_DATA.filter(
                      (s) => !selectedSchoolIds.includes(s.id)
                    ).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Radar Visualization & Delta Matrix Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Radar Chart (6 Cols) */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-[#EAF0F6] p-5 shadow-sm space-y-3">
              <div className="border-b border-[#F1F5F9] pb-3">
                <h3 className="text-sm font-bold text-[#153B66]">Spider Radar Komparasi Mutu Sekolah</h3>
                <p className="text-xs text-[#526579]">Perbandingan relatif 5 indikator mutu antar-sekolah terpilih</p>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={85} data={schoolRadarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#172B4D', fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    {selectedSchools.map((s, idx) => (
                      <Radar
                        key={s.id}
                        name={s.name}
                        dataKey={s.name}
                        stroke={ENTITY_COLORS[idx]}
                        fill={ENTITY_COLORS[idx]}
                        fillOpacity={0.25}
                      />
                    ))}
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #EAF0F6' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Delta Comparison Matrix Table (6 Cols) */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-[#EAF0F6] p-5 shadow-sm space-y-3">
              <div className="border-b border-[#F1F5F9] pb-3">
                <h3 className="text-sm font-bold text-[#153B66]">Matriks Delta Perbandingan Indikator</h3>
                <p className="text-xs text-[#526579]">Detail komparasi head-to-head parameter operasional</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#526579] font-bold border-b border-[#EAF0F6]">
                    <tr>
                      <th className="py-2.5 px-3">Indikator</th>
                      {selectedSchools.map((s, idx) => (
                        <th key={s.id} className="py-2.5 px-3" style={{ color: ENTITY_COLORS[idx] }}>
                          {s.name.split(' ')[0]}...
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-[#172B4D]">Jenjang & Status</td>
                      {selectedSchools.map((s) => (
                        <td key={s.id} className="py-2.5 px-3 text-[#526579]">
                          {s.stage} ({s.status})
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-[#172B4D]">Akreditasi BAN-S/M</td>
                      {selectedSchools.map((s) => (
                        <td key={s.id} className="py-2.5 px-3 font-bold text-emerald-700">
                          Peringkat {s.accreditation}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-[#172B4D]">Rasio Murid : Guru</td>
                      {selectedSchools.map((s) => {
                        const ratio = (s.totalStudents / Math.max(1, s.totalTeachers)).toFixed(1);
                        return (
                          <td key={s.id} className="py-2.5 px-3 font-extrabold text-[#153B66]">
                            {ratio} : 1
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-[#172B4D]">Kurikulum</td>
                      {selectedSchools.map((s) => (
                        <td key={s.id} className="py-2.5 px-3 text-[#526579]">
                          {s.curriculum}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-[#172B4D]">Kota / Provinsi</td>
                      {selectedSchools.map((s) => (
                        <td key={s.id} className="py-2.5 px-3 text-[#526579]">
                          {s.city}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: UNIVERSITIES COMPARATOR */}
      {mode === 'universities' && (
        <div className="space-y-6">
          {/* Side-by-Side Cards (Up to 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedUniversities.map((univ, idx) => {
              const ratio = Number((univ.totalStudents / Math.max(1, univ.totalLecturers)).toFixed(1));
              const rankIdx = UNIVERSITIES_SNAPSHOT_DATA.findIndex((x) => x.id === univ.id) + 1;
              return (
                <div
                  key={univ.id}
                  className="bg-white rounded-xl border-2 p-4 shadow-sm relative transition-all"
                  style={{ borderColor: ENTITY_COLORS[idx] }}
                >
                  {selectedUniversities.length > 2 && (
                    <button
                      onClick={() => handleRemoveUniv(univ.id)}
                      className="absolute top-3 right-3 text-[#526579] hover:text-rose-600 transition-colors"
                      title="Hapus dari komparasi"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: ENTITY_COLORS[idx] }}
                    />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#526579]">
                      {univ.type} • Rank #{rankIdx}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-[#153B66] leading-snug line-clamp-1">
                    {univ.name}
                  </h4>
                  <p className="text-[11px] text-[#526579] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#25A9A1]" />
                    {univ.city}, {univ.province}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-[#F1F5F9] text-xs">
                    <div>
                      <span className="text-[10px] text-[#526579]">Mahasiswa Aktif</span>
                      <p className="font-extrabold text-[#153B66]">{univ.totalStudents.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#526579]">Total Dosen</span>
                      <p className="font-extrabold text-[#153B66]">{univ.totalLecturers.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#526579]">Rasio Dosen:Mhs</span>
                      <p className="font-extrabold text-[#25A9A1]">1 : {ratio}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#526579]">Fakultas</span>
                      <p className="font-extrabold text-[#153B66]">{univ.facultiesCount} Fakultas</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add Univ Card if < 4 */}
            {selectedUniversities.length < 4 && (
              <div className="bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 min-h-[160px]">
                <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#526579]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#153B66]">Tambah Kampus</h5>
                  <p className="text-[10px] text-[#526579]">Maksimal 4 entitas komparasi</p>
                </div>
                <div className="relative w-full max-w-[200px]">
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleAddUniv(e.target.value);
                    }}
                    value=""
                    className="w-full text-xs font-medium border border-[#DCE5EF] rounded-lg p-1.5 text-[#172B4D] bg-white cursor-pointer"
                  >
                    <option value="" disabled>Pilih universitas...</option>
                    {UNIVERSITIES_SNAPSHOT_DATA.filter(
                      (u) => !selectedUnivIds.includes(u.id)
                    ).map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Radar Visualization for Universities */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white rounded-xl border border-[#EAF0F6] p-5 shadow-sm space-y-3">
              <div className="border-b border-[#F1F5F9] pb-3">
                <h3 className="text-sm font-bold text-[#153B66]">Spider Radar Komparasi Akademik Kampus</h3>
                <p className="text-xs text-[#526579]">Perbandingan peringkat, rasio pengajaran, dan kapasitas prodi</p>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={85} data={univRadarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#172B4D', fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    {selectedUniversities.map((u, idx) => (
                      <Radar
                        key={u.id}
                        name={u.name}
                        dataKey={u.name}
                        stroke={ENTITY_COLORS[idx]}
                        fill={ENTITY_COLORS[idx]}
                        fillOpacity={0.25}
                      />
                    ))}
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #EAF0F6' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* University Delta Matrix */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-[#EAF0F6] p-5 shadow-sm space-y-3">
              <div className="border-b border-[#F1F5F9] pb-3">
                <h3 className="text-sm font-bold text-[#153B66]">Matriks Indikator Perguruan Tinggi</h3>
                <p className="text-xs text-[#526579]">Detail perbandingan tri dharma perguruan tinggi</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#526579] font-bold border-b border-[#EAF0F6]">
                    <tr>
                      <th className="py-2.5 px-3">Indikator</th>
                      {selectedUniversities.map((u, idx) => (
                        <th key={u.id} className="py-2.5 px-3" style={{ color: ENTITY_COLORS[idx] }}>
                          {u.name.split(' ')[0]}...
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-[#172B4D]">Jenis PT</td>
                      {selectedUniversities.map((u) => (
                        <td key={u.id} className="py-2.5 px-3 text-[#526579]">{u.type}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-[#172B4D]">Peringkat Nasional</td>
                      {selectedUniversities.map((u) => {
                        const rankIdx = UNIVERSITIES_SNAPSHOT_DATA.findIndex((x) => x.id === u.id) + 1;
                        return (
                          <td key={u.id} className="py-2.5 px-3 font-extrabold text-[#153B66]">
                            #{rankIdx}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-[#172B4D]">Akreditasi BAN-PT</td>
                      {selectedUniversities.map((u) => (
                        <td key={u.id} className="py-2.5 px-3 font-bold text-emerald-700">{u.accreditation}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-[#172B4D]">Fakultas</td>
                      {selectedUniversities.map((u) => (
                        <td key={u.id} className="py-2.5 px-3 text-[#526579]">
                          {u.facultiesCount} Fakultas
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-[#172B4D]">Kota</td>
                      {selectedUniversities.map((u) => (
                        <td key={u.id} className="py-2.5 px-3 text-[#526579]">{u.city}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
