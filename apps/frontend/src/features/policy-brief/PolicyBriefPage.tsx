import React, { useState, useMemo, useRef } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building,
  RotateCcw,
  Edit3,
  Calendar,
  Layers,
  Check,
  Send,
  Eye,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { POLICY_BRIEFS_SNAPSHOT, PolicyBriefItem } from '../../constants/expansion.constants';

export const PolicyBriefPage: React.FC = () => {
  const [selectedBriefId, setSelectedBriefId] = useState<string>(POLICY_BRIEFS_SNAPSHOT[0].id);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');

  // Selected policy brief base
  const selectedBase = useMemo(() => {
    return POLICY_BRIEFS_SNAPSHOT.find((b) => b.id === selectedBriefId) || POLICY_BRIEFS_SNAPSHOT[0];
  }, [selectedBriefId]);

  // Editable fields state
  const [customTitle, setCustomTitle] = useState<string>(selectedBase.title);
  const [customSummary, setCustomSummary] = useState<string>(selectedBase.executiveSummary);
  const [customShortActions, setCustomShortActions] = useState<string[]>(selectedBase.shortTermActions);
  const [customMediumActions, setCustomMediumActions] = useState<string[]>(selectedBase.mediumTermActions);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Sync state when brief selector changes
  const handleSelectBrief = (brief: PolicyBriefItem) => {
    setSelectedBriefId(brief.id);
    setCustomTitle(brief.title);
    setCustomSummary(brief.executiveSummary);
    setCustomShortActions([...brief.shortTermActions]);
    setCustomMediumActions([...brief.mediumTermActions]);
  };

  // Reset to verified original draft
  const handleResetDraft = () => {
    setCustomTitle(selectedBase.title);
    setCustomSummary(selectedBase.executiveSummary);
    setCustomShortActions([...selectedBase.shortTermActions]);
    setCustomMediumActions([...selectedBase.mediumTermActions]);
    setSaveSuccess(false);
  };

  // Export PDF via jsPDF
  const handleExportPdf = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header Banner
      doc.setFillColor(21, 59, 102); // Atlas Navy
      doc.rect(0, 0, 210, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('MEMORANDUM KEBIJAKAN PENDIDIKAN NASIONAL', 15, 12);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`KEMENTERIAN PENDIDIKAN & KEBUDAYAAN • REPUBLIK INDONESIA | ${selectedBase.id}`, 15, 18);

      // Metadata block
      doc.setTextColor(23, 43, 77);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Judul: ${customTitle}`, 15, 34);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Kategori: ${selectedBase.category}  |  Tanggal: ${selectedBase.date}  |  Status: ${selectedBase.status}`, 15, 41);
      doc.text(`Target Lembaga: ${selectedBase.targetAgencies.join(', ')}`, 15, 47);

      // Divider line
      doc.setDrawColor(220, 229, 239);
      doc.setLineWidth(0.5);
      doc.line(15, 51, 195, 51);

      // Section 1: Ringkasan Eksekutif
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 169, 161); // Knowledge Teal
      doc.text('1. RINGKASAN EKSEKUTIF', 15, 58);

      doc.setTextColor(40, 50, 60);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const splitSummary = doc.splitTextToSize(customSummary, 180);
      doc.text(splitSummary, 15, 64);

      let currentY = 64 + splitSummary.length * 4.5 + 4;

      // Section 2: Bukti Data Kunci
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 169, 161);
      doc.text('2. INDIKATOR & BUKTI DATA KUNCI (SNAPSHOT 2026)', 15, currentY);
      currentY += 6;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 50, 60);
      selectedBase.keyEvidence.forEach((ev) => {
        doc.text(`• ${ev.label}: ${ev.value}`, 18, currentY);
        currentY += 5;
      });

      currentY += 2;

      // Section 3: Akar Masalah
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 169, 161);
      doc.text('3. IDENTIFIKASI AKAR MASALAH', 15, currentY);
      currentY += 6;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 50, 60);
      selectedBase.rootCauses.forEach((rc) => {
        const splitRc = doc.splitTextToSize(`- ${rc}`, 175);
        doc.text(splitRc, 18, currentY);
        currentY += splitRc.length * 4.5;
      });

      currentY += 2;

      // Section 4: Rekomendasi Tindakan
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 169, 161);
      doc.text('4. MATRIKS REKOMENDASI TINDAKAN STRATEGIS', 15, currentY);
      currentY += 6;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(21, 59, 102);
      doc.text('A. Tindakan Cepat Jangka Pendek (1–2 Tahun):', 18, currentY);
      currentY += 5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 50, 60);
      customShortActions.forEach((act) => {
        const splitAct = doc.splitTextToSize(`• ${act}`, 172);
        doc.text(splitAct, 22, currentY);
        currentY += splitAct.length * 4.5;
      });

      currentY += 2;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(21, 59, 102);
      doc.text('B. Transformasi Struktural Jangka Menengah (3–5 Tahun):', 18, currentY);
      currentY += 5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 50, 60);
      customMediumActions.forEach((act) => {
        const splitAct = doc.splitTextToSize(`• ${act}`, 172);
        doc.text(splitAct, 22, currentY);
        currentY += splitAct.length * 4.5;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 160, 175);
      doc.text('Diterbitkan oleh EduAtlas Platform | Dokumen Rahasia untuk Kebijakan Publik Terbatas', 15, 287);

      doc.save(`EduAtlas-PolicyBrief-${selectedBase.slug}.pdf`);
    } catch (e) {
      console.error('PDF generation error', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Policy Brief & Research Studio"
        subtitle="Pusat perumusan rekomendasi dan memorandum kebijakan pendidikan berbasis bukti data snapshot nasional (Bappenas & Kemendikbud Standards)"
      />

      {/* Selector Strip: 5 Pre-configured Bappenas-style Briefs */}
      <div className="bg-white rounded-xl border border-[#EAF0F6] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#25A9A1]" />
            <h3 className="text-xs font-bold text-[#153B66] uppercase tracking-wider">
              Pilihan Draf Isu Strategis Nasional
            </h3>
          </div>
          <span className="text-[11px] text-[#526579]">
            5 Template Terstandarisasi Bappenas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {POLICY_BRIEFS_SNAPSHOT.map((brief) => {
            const isSelected = brief.id === selectedBriefId;
            return (
              <button
                key={brief.id}
                onClick={() => handleSelectBrief(brief)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[#E6F8F6] border-[#25A9A1] shadow-sm ring-1 ring-[#25A9A1]'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-[#526579]">{brief.id}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-[#25A9A1]' : 'bg-transparent'
                    }`}
                  />
                </div>
                <h4
                  className={`text-xs font-bold leading-snug line-clamp-2 ${
                    isSelected ? 'text-[#153B66]' : 'text-[#334155]'
                  }`}
                >
                  {brief.title}
                </h4>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-[#526579] truncate">{brief.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-[#F1F5F9] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-white text-[#153B66] shadow-sm'
                : 'text-[#526579] hover:text-[#172B4D]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Pratinjau Memo Formal (A4)
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'editor'
                ? 'bg-white text-[#153B66] shadow-sm'
                : 'text-[#526579] hover:text-[#172B4D]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Editor Rekomendasi
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDraft}
            className="px-3 py-1.5 rounded-xl border border-[#DCE5EF] text-xs font-semibold text-[#526579] hover:bg-white flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Draf
          </button>
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="px-4 py-1.5 rounded-xl bg-[#25A9A1] hover:bg-[#1E8A83] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Membuat PDF...' : 'Unduh Executive Memo (PDF)'}
          </button>
        </div>
      </div>

      {/* TAB 1: PREVIEW MODE (A4 FORMAL MEMO) */}
      {activeTab === 'preview' && (
        <div className="bg-white border border-[#EAF0F6] rounded-xl shadow-md p-6 sm:p-10 max-w-4xl mx-auto space-y-7">
          {/* Official Letterhead */}
          <div className="border-b-2 border-[#153B66] pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img src="/brand/icon-mark.png" alt="EduAtlas Logo" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-base font-extrabold text-[#153B66] font-heading tracking-tight">
                  KEMENTERIAN PENDIDIKAN & KEBUDAYAAN • REPUBLIK INDONESIA
                </h1>
                <p className="text-xs text-[#526579] font-medium">
                  BADAN STANDAR, KURIKULUM, DAN ASESMEN PENDIDIKAN (BSKAP) • POKJA KEBIJAKAN
                </p>
                <p className="text-[10px] text-[#25A9A1] font-bold mt-0.5">
                  MEMORANDUM ANALISIS DATA EDUATLAS #{selectedBase.id}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-[#E6F8F6] text-[#25A9A1] font-extrabold text-[11px] px-2.5 py-1 rounded-md border border-[#BCECE8]">
                {selectedBase.status}
              </span>
              <p className="text-[10px] text-[#526579] mt-1">{selectedBase.date}</p>
            </div>
          </div>

          {/* Title & Metadata Strip */}
          <div className="space-y-2">
            <h2 className="text-lg font-extrabold text-[#153B66] leading-snug">
              {customTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#526579] bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
              <div>
                <strong className="text-[#172B4D]">Kategori:</strong> {selectedBase.category}
              </div>
              <span className="text-[#CBD5E1]">|</span>
              <div>
                <strong className="text-[#172B4D]">Sasaran Regulasi:</strong>{' '}
                {selectedBase.targetAgencies.join(', ')}
              </div>
              <span className="text-[#CBD5E1]">|</span>
              <div>
                <strong className="text-[#172B4D]">Penyusun:</strong> {selectedBase.author}
              </div>
            </div>
          </div>

          {/* Section 1: Ringkasan Eksekutif */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#153B66] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25A9A1]" />
              1. Ringkasan Eksekutif & Konteks Strategis
            </div>
            <p className="text-xs text-[#334155] leading-relaxed text-justify bg-[#FAFCFF] p-3.5 rounded-lg border border-[#EAF0F6]">
              {customSummary}
            </p>
          </div>

          {/* Section 2: Indikator & Bukti Data Kunci */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#153B66] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25A9A1]" />
              2. Indikator & Bukti Data Kunci (Snapshot 2026)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedBase.keyEvidence.map((ev, idx) => (
                <div key={idx} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                  <p className="text-[11px] text-[#526579] font-medium">{ev.label}</p>
                  <p className="text-sm font-extrabold text-[#153B66] mt-1">{ev.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Identifikasi Akar Masalah */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#153B66] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25A9A1]" />
              3. Identifikasi Akar Masalah Sistemik
            </div>
            <ul className="space-y-1.5 text-xs text-[#334155]">
              {selectedBase.rootCauses.map((rc, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#F1F5F9]">
                  <span className="w-4 h-4 rounded-full bg-[#FEE2E2] text-rose-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Matriks Rekomendasi Tindakan Strategis */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#153B66] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25A9A1]" />
              4. Matriks Rekomendasi Tindakan Strategis
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Short-Term */}
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-extrabold text-emerald-900">
                    A. Quick Wins Jangka Pendek (1–2 Tahun)
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-emerald-950">
                  {customShortActions.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="font-bold text-emerald-700">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Medium-Term */}
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#3B82F6]" />
                  <h4 className="text-xs font-extrabold text-blue-900">
                    B. Transformasi Jangka Menengah (3–5 Tahun)
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-blue-950">
                  {customMediumActions.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="font-bold text-[#3B82F6]">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Validation Stamp Strip */}
          <div className="pt-4 border-t border-[#EAF0F6] flex items-center justify-between text-[11px] text-[#526579]">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#25A9A1]" />
              <span>Divalidasi menggunakan snapshot deterministik EduAtlas 2026</span>
            </div>
            <div className="text-right font-medium">
              Dokumen Resmi Analis Kebijakan
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDITOR MODE */}
      {activeTab === 'editor' && (
        <div className="bg-white border border-[#EAF0F6] rounded-xl p-6 shadow-sm space-y-5 max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div>
              <h3 className="text-sm font-bold text-[#153B66]">Editor Kustomisasi Rekomendasi</h3>
              <p className="text-xs text-[#526579]">Sunting draf memorandum sebelum mengekspor ke format PDF resmi</p>
            </div>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                <Check className="w-3.5 h-3.5" /> Draf Diperbarui!
              </span>
            )}
          </div>

          {/* Title Editor */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#172B4D]">Judul Memorandum Kebijakan</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full text-xs font-medium border border-[#DCE5EF] rounded-lg p-2.5 text-[#172B4D] focus:outline-none focus:ring-1 focus:ring-[#25A9A1]"
            />
          </div>

          {/* Summary Editor */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#172B4D]">Ringkasan Eksekutif</label>
            <textarea
              rows={4}
              value={customSummary}
              onChange={(e) => setCustomSummary(e.target.value)}
              className="w-full text-xs font-medium border border-[#DCE5EF] rounded-lg p-2.5 text-[#172B4D] focus:outline-none focus:ring-1 focus:ring-[#25A9A1] leading-relaxed"
            />
          </div>

          {/* Short Term Actions Editor */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-800">
              Rekomendasi Tindakan Jangka Pendek (Quick Wins)
            </label>
            {customShortActions.map((act, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-xs font-bold text-[#526579] py-2">#{idx + 1}</span>
                <input
                  type="text"
                  value={act}
                  onChange={(e) => {
                    const next = [...customShortActions];
                    next[idx] = e.target.value;
                    setCustomShortActions(next);
                  }}
                  className="w-full text-xs font-medium border border-[#DCE5EF] rounded-lg p-2 text-[#172B4D] focus:outline-none focus:ring-1 focus:ring-[#25A9A1]"
                />
              </div>
            ))}
          </div>

          {/* Medium Term Actions Editor */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1E40AF]">
              Rekomendasi Tindakan Jangka Menengah (Struktural)
            </label>
            {customMediumActions.map((act, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-xs font-bold text-[#526579] py-2">#{idx + 1}</span>
                <input
                  type="text"
                  value={act}
                  onChange={(e) => {
                    const next = [...customMediumActions];
                    next[idx] = e.target.value;
                    setCustomMediumActions(next);
                  }}
                  className="w-full text-xs font-medium border border-[#DCE5EF] rounded-lg p-2 text-[#172B4D] focus:outline-none focus:ring-1 focus:ring-[#25A9A1]"
                />
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#F1F5F9] flex justify-end gap-2">
            <button
              onClick={() => {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2500);
              }}
              className="px-4 py-2 bg-[#153B66] text-white text-xs font-bold rounded-lg hover:bg-[#0F2942] transition-colors"
            >
              Simpan Perubahan Draf
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className="px-4 py-2 bg-[#25A9A1] text-white text-xs font-bold rounded-lg hover:bg-[#1E8A83] transition-colors"
            >
              Lihat di Format Cetak
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
