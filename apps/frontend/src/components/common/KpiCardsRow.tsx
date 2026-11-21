import React, { useState, useEffect } from 'react';
import {
  School,
  Users,
  UserCheck,
  GraduationCap,
  ChevronRight,
  ArrowUp,
  X,
  CheckCircle2,
  PieChart as PieIcon,
  Award,
  Layers,
} from 'lucide-react';
import { formatNumber } from '../../lib/formatters';

interface KpiCardsRowProps {
  schools?: number;
  students?: number;
  teachers?: number;
  universities?: number;
}

interface DetailMetric {
  label: string;
  count: string;
  percent: string;
  color: string;
}

export const KpiCardsRow: React.FC<KpiCardsRowProps> = ({
  schools = 125482,
  students = 42560321,
  teachers = 2843921,
  universities = 3216,
}) => {
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCardIdx(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const cards = [
    {
      id: 'schools',
      title: 'Total Sekolah',
      value: schools,
      growth: '2,8%',
      icon: School,
      iconBg: 'bg-[#FEF9EE] text-[#F59E0B]',
      barColor: '#FDE68A',
      barHeights: [40, 50, 45, 60, 55, 75, 85],
      modalTitle: 'Rincian Institusi Sekolah Nasional',
      modalSubtitle: 'Distribusi akreditasi, status kepemilikan, dan jenjang sekolah.',
      statsSummary: [
        { label: 'Sekolah Negeri', value: '78.426', sub: '62,5% dari total' },
        { label: 'Sekolah Swasta', value: '47.056', sub: '37,5% dari total' },
        { label: 'Rata-rata Skor Mutu', value: '80,5 / 100', sub: 'Kategori Baik' },
      ],
      breakdown: [
        { label: 'Terakreditasi A (Unggul)', count: '48.210', percent: '38,4%', color: '#16835D' },
        { label: 'Terakreditasi B (Baik)', count: '52.840', percent: '42,1%', color: '#25A9A1' },
        { label: 'Terakreditasi C (Cukup)', count: '18.912', percent: '15,1%', color: '#FFC857' },
        { label: 'Proses Akreditasi', count: '5.520', percent: '4,4%', color: '#94A3B8' },
      ],
    },
    {
      id: 'students',
      title: 'Total Siswa',
      value: students,
      growth: '3,1%',
      icon: Users,
      iconBg: 'bg-[#EBF7FD] text-[#0284C7]',
      barColor: '#BAE6FD',
      barHeights: [35, 45, 55, 50, 65, 75, 90],
      modalTitle: 'Rincian Peserta Didik Aktif',
      modalSubtitle: 'Sebaran siswa berdasarkan jenjang pendidikan dan partisipasi murni.',
      statsSummary: [
        { label: 'Siswa Laki-laki', value: '21.705.764', sub: '51,0% proporsi' },
        { label: 'Siswa Perempuan', value: '20.854.557', sub: '49,0% proporsi' },
        { label: 'APM Nasional', value: '94,8%', sub: 'Angka Partisipasi Murni' },
      ],
      breakdown: [
        { label: 'Sekolah Dasar (SD)', count: '19.235.641', percent: '45,2%', color: '#153B66' },
        { label: 'Menengah Pertama (SMP)', count: '11.958.324', percent: '28,1%', color: '#25A9A1' },
        { label: 'Menengah Atas (SMA)', count: '8.686.412', percent: '20,4%', color: '#8ED8E4' },
        { label: 'Kejuruan (SMK)', count: '2.679.944', percent: '6,3%', color: '#FFC857' },
      ],
    },
    {
      id: 'teachers',
      title: 'Total Guru',
      value: teachers,
      growth: '1,9%',
      icon: UserCheck,
      iconBg: 'bg-[#F5F3FF] text-[#7C3AED]',
      barColor: '#DDD6FE',
      barHeights: [30, 40, 45, 55, 60, 70, 80],
      modalTitle: 'Rincian Tenaga Pendidik & Guru',
      modalSubtitle: 'Status sertifikasi profesi guru, kualifikasi, dan rasio kelas.',
      statsSummary: [
        { label: 'Guru Bersertifikat', value: '2.189.420', sub: '77,0% tersertifikasi' },
        { label: 'Status ASN / PNS', value: '1.642.100', sub: '57,7% aparatur negara' },
        { label: 'Rasio Siswa-Guru', value: '13,6 : 1', sub: 'Standar Ideal (≤ 20:1)' },
      ],
      breakdown: [
        { label: 'Pendidik Jenjang SD', count: '1.240.500', percent: '43,6%', color: '#153B66' },
        { label: 'Pendidik Jenjang SMP', count: '742.300', percent: '26,1%', color: '#25A9A1' },
        { label: 'Pendidik Jenjang SMA', count: '512.121', percent: '18,0%', color: '#8ED8E4' },
        { label: 'Pendidik Jenjang SMK', count: '349.000', percent: '12,3%', color: '#FFC857' },
      ],
    },
    {
      id: 'universities',
      title: 'Total Universitas',
      value: universities,
      growth: '4,5%',
      icon: GraduationCap,
      iconBg: 'bg-[#E6F8F6] text-[#25A9A1]',
      barColor: '#A7F3D0',
      barHeights: [45, 50, 55, 65, 70, 80, 88],
      modalTitle: 'Rincian Perguruan Tinggi Nasional',
      modalSubtitle: 'Badan hukum perguruan tinggi, akreditasi, dan program studi.',
      statsSummary: [
        { label: 'PTN-BH / PTN-BLU', value: '125', sub: 'Kampus Negeri Unggulan' },
        { label: 'PTS (Swasta)', value: '3.091', sub: '96,1% perguruan tinggi' },
        { label: 'Total Program Studi', value: '28.450', sub: 'Aktif terdata di PDDikti' },
      ],
      breakdown: [
        { label: 'Akreditasi Unggul / A', count: '312', percent: '9,7%', color: '#16835D' },
        { label: 'Akreditasi Baik Sekali / B', count: '1.840', percent: '57,2%', color: '#25A9A1' },
        { label: 'Akreditasi Baik / C', count: '942', percent: '29,3%', color: '#FFC857' },
        { label: 'Institusi Baru / Proses', count: '122', percent: '3,8%', color: '#94A3B8' },
      ],
    },
  ];

  const activeCard = selectedCardIdx !== null ? cards[selectedCardIdx] : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => setSelectedCardIdx(idx)}
              className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-[#25A9A1] transition-all cursor-pointer flex flex-col justify-between group"
              role="button"
              tabIndex={0}
              aria-label={`Buka detail ${card.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedCardIdx(idx);
                }
              }}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="p-1 rounded-lg text-[#526579] group-hover:text-[#25A9A1] group-hover:bg-[#E6F8F6] transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>

                <p className="text-xs font-semibold text-[#526579] mt-3">{card.title}</p>
                <h3 className="text-[26px] font-extrabold text-[#172B4D] tracking-tight mt-0.5 font-heading">
                  {formatNumber(card.value)}
                </h3>

                <div className="flex items-center gap-1.5 mt-2 text-xs">
                  <span className="inline-flex items-center gap-0.5 font-bold text-[#16835D] bg-[#DEF7EC] px-1.5 py-0.5 rounded text-[11px]">
                    <ArrowUp className="w-3 h-3" />
                    {card.growth}
                  </span>
                  <span className="text-[#526579]">dari 2025</span>
                </div>
              </div>

              {/* Sparkline mini bars */}
              <div className="flex items-end gap-1.5 h-6 mt-4 pt-1">
                {card.barHeights.map((h, bIdx) => (
                  <div
                    key={bIdx}
                    className="flex-1 rounded-t-xs transition-all duration-300 group-hover:opacity-90"
                    style={{
                      height: `${h}%`,
                      backgroundColor: card.barColor,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal Dialog */}
      {activeCard && (
        <div
          className="fixed inset-0 z-50 bg-[#153B66]/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedCardIdx(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeCard.modalTitle}
        >
          <div
            className="bg-white rounded-2xl border border-[#DCE5EF] shadow-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeCard.iconBg}`}>
                  {React.createElement(activeCard.icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#153B66] font-heading">{activeCard.modalTitle}</h3>
                  <p className="text-xs text-[#526579] mt-0.5">{activeCard.modalSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCardIdx(null)}
                aria-label="Tutup Dialog"
                className="p-1.5 rounded-lg text-[#526579] hover:bg-slate-100 hover:text-[#172B4D] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Metric Banner */}
            <div className="my-5 p-4 rounded-xl bg-[#F5F8FC] border border-[#DCE5EF] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#526579]">Total Nasional Terdata (2026)</span>
                <div className="text-2xl font-black text-[#153B66] font-heading mt-0.5">
                  {formatNumber(activeCard.value)}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 font-bold text-[#16835D] bg-[#DEF7EC] px-2.5 py-1 rounded-md text-xs">
                  <ArrowUp className="w-3.5 h-3.5" />
                  {activeCard.growth} YoY
                </span>
                <p className="text-[11px] text-[#526579] mt-1">vs periode 2025</p>
              </div>
            </div>

            {/* 3 Summary Stat Badges */}
            <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
              {activeCard.statsSummary.map((stat, sIdx) => (
                <div key={sIdx} className="bg-white border border-[#EAF0F6] p-2.5 rounded-xl shadow-2xs">
                  <span className="text-[11px] text-[#526579] font-medium block truncate">{stat.label}</span>
                  <strong className="text-sm text-[#172B4D] font-bold block mt-0.5">{stat.value}</strong>
                  <span className="text-[10px] text-[#25A9A1] font-semibold block mt-0.5">{stat.sub}</span>
                </div>
              ))}
            </div>

            {/* Breakdown List */}
            <div className="space-y-2.5 mb-6">
              <span className="text-xs font-bold text-[#153B66] uppercase tracking-wider block">
                Komposisi & Distribusi:
              </span>
              {activeCard.breakdown.map((item, bIdx) => (
                <div key={bIdx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-[#172B4D]">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#172B4D]">{item.count}</span>
                      <span className="font-semibold text-[#526579] w-12 text-right">{item.percent}</span>
                    </div>
                  </div>
                  {/* Mini progress bar */}
                  <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: item.percent,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setSelectedCardIdx(null)}
                className="px-4 py-2 text-xs font-bold text-[#526579] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <a
                href="/data-explorer"
                className="px-4 py-2 text-xs font-bold bg-[#153B66] hover:bg-[#1f4a7d] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Lihat di Data Explorer
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
