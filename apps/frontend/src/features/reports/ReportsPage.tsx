import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Layers,
  Sparkles,
  MapPin,
  GraduationCap,
  ShieldCheck,
  Users,
  Search,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Printer,
  File,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  Calendar,
  Clock,
  Sliders,
  BarChart3,
  RotateCcw,
  SlidersHorizontal,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SCHOOLS_SNAPSHOT_DATA, SchoolItem } from '../../constants/schools.constants';
import { UNIVERSITIES_SNAPSHOT_DATA, UniversityItem } from '../../constants/universities.constants';

export interface ReportTemplateItem {
  id: string;
  slug: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  type: 'bars' | 'map' | 'stacked' | 'radar' | 'scatter-map' | 'donut';
}

export interface ReportHistoryItem {
  id: number;
  name: string;
  type: string;
  period: string;
  format: 'PDF' | 'Excel' | 'CSV' | 'PowerPoint';
  date: string;
  status: 'Selesai' | 'Proses' | 'Gagal';
}

export const ReportsPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Report Templates');
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'Excel' | 'CSV' | 'PowerPoint'>('PDF');
  const [previewPage, setPreviewPage] = useState(1);
  const [aiSummaryToggle, setAiSummaryToggle] = useState(true);
  const [includeMapToggle, setIncludeMapToggle] = useState(true);
  const [includeDetailsToggle, setIncludeDetailsToggle] = useState(false);
  const [searchReport, setSearchReport] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');

  // Custom Report Form State
  const [customJenisData, setCustomJenisData] = useState('Institusi Pendidikan');
  const [customProvinsi, setCustomProvinsi] = useState('Semua Provinsi');
  const [customJenjang, setCustomJenjang] = useState('Semua Jenjang');
  const [customIndikator, setCustomIndikator] = useState('Jumlah Sekolah');
  const [customPeriode, setCustomPeriode] = useState('2026');
  const [customVisualisasi, setCustomVisualisasi] = useState('Grafik + Tabel + Peta');

  // Export Direct Form State
  const [directDataset, setDirectDataset] = useState('Institusi Pendidikan');
  const [directLevel, setDirectLevel] = useState('Semua Jenjang');
  const [directFormat, setDirectFormat] = useState('CSV');
  const [isExporting, setIsExporting] = useState(false);
  const [isDirectExporting, setIsDirectExporting] = useState(false);

  // Toast notification feedback
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Action Menu State (for 3-dots in Laporan yang Sudah Dibuat)
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);

  // Edit Modal State
  const [editingReport, setEditingReport] = useState<ReportHistoryItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editPeriod, setEditPeriod] = useState('2026');
  const [editFormat, setEditFormat] = useState<'PDF' | 'Excel' | 'CSV' | 'PowerPoint'>('PDF');
  const [editStatus, setEditStatus] = useState<'Selesai' | 'Proses' | 'Gagal'>('Selesai');

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3800);
  };

  // Template cards data with slugs
  const templates: ReportTemplateItem[] = useMemo(
    () => [
      {
        id: 'ringkasan-nasional',
        slug: 'ringakasanpendidikannasional',
        title: 'Ringkasan Pendidikan Nasional',
        desc: 'Gambaran umum sekolah, siswa, guru, dan universitas di Indonesia.',
        icon: <FileText className="w-5 h-5 text-[#0284C7]" />,
        color: '#0284C7',
        type: 'bars',
      },
      {
        id: 'profil-provinsi',
        slug: 'profilprovinsi',
        title: 'Profil Provinsi',
        desc: 'Statistik pendidikan per provinsi dengan grafik dan peta.',
        icon: <MapPin className="w-5 h-5 text-[#059669]" />,
        color: '#059669',
        type: 'map',
      },
      {
        id: 'analisis-jenjang',
        slug: 'analisisjenjang',
        title: 'Analisis Jenjang',
        desc: 'Perbandingan SD, SMP, SMA, SMK, dan pendidikan tinggi.',
        icon: <GraduationCap className="w-5 h-5 text-[#7C3AED]" />,
        color: '#7C3AED',
        type: 'stacked',
      },
      {
        id: 'kualitas-pendidikan',
        slug: 'datakualitaspendidikan',
        title: 'Data Kualitas Pendidikan',
        desc: 'Rasio siswa-guru, akreditasi, dan indikator kualitas.',
        icon: <ShieldCheck className="w-5 h-5 text-[#10B981]" />,
        color: '#10B981',
        type: 'radar',
      },
      {
        id: 'sebaran-institusi',
        slug: 'sebaraninstitusi',
        title: 'Sebaran Institusi',
        desc: 'Peta sebaran sekolah dan universitas di Indonesia.',
        icon: <MapPin className="w-5 h-5 text-[#0284C7]" />,
        color: '#0284C7',
        type: 'scatter-map',
      },
      {
        id: 'program-beasiswa',
        slug: 'programbeasiswa',
        title: 'Program & Beasiswa',
        desc: 'Statistik program pendidikan, beasiswa, dan kolaborasi.',
        icon: <Users className="w-5 h-5 text-[#0D9488]" />,
        color: '#0D9488',
        type: 'donut',
      },
    ],
    [],
  );

  // Robust slug resolver
  const activeTemplate = useMemo(() => {
    if (!slug) return null;
    const clean = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.includes('ringkasan') || clean.includes('ringakasan')) {
      return templates.find((t) => t.id === 'ringkasan-nasional') || templates[0];
    }
    if (clean.includes('provinsi')) {
      return templates.find((t) => t.id === 'profil-provinsi') || templates[1];
    }
    if (clean.includes('jenjang')) {
      return templates.find((t) => t.id === 'analisis-jenjang') || templates[2];
    }
    if (clean.includes('kualitas')) {
      return templates.find((t) => t.id === 'kualitas-pendidikan') || templates[3];
    }
    if (clean.includes('sebaran') || clean.includes('institusi')) {
      return templates.find((t) => t.id === 'sebaran-institusi') || templates[4];
    }
    if (clean.includes('program') || clean.includes('beasiswa')) {
      return templates.find((t) => t.id === 'program-beasiswa') || templates[5];
    }
    return templates.find((t) => t.slug === slug || t.id === slug) || templates[0];
  }, [slug, templates]);

  // History table data with state so it can be Edited and Deleted
  const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>([
    { id: 1, name: 'Ringkasan Pendidikan Nasional 2026', type: 'Template', period: '2026', format: 'PDF', date: '20 Okt 2026, 14:32', status: 'Selesai' },
    { id: 2, name: 'Profil Provinsi - Jawa Barat', type: 'Template', period: '2026', format: 'Excel', date: '19 Okt 2026, 10:15', status: 'Selesai' },
    { id: 3, name: 'Analisis Jenjang SMA/SMK', type: 'Kustom', period: '2026', format: 'PDF', date: '18 Okt 2026, 16:21', status: 'Selesai' },
    { id: 4, name: 'Sebaran Institusi Indonesia', type: 'Template', period: '2026', format: 'PowerPoint', date: '17 Okt 2026, 09:45', status: 'Selesai' },
    { id: 5, name: 'Data Kualitas Pendidikan', type: 'Kustom', period: '2026', format: 'CSV', date: '16 Okt 2026, 11:10', status: 'Selesai' },
  ]);

  // Dynamic Preview Data State (driven by Custom Report parameters or default)
  const [previewReportData, setPreviewReportData] = useState({
    title: 'Ringkasan Pendidikan Indonesia',
    period: 'Jan 2026 – Des 2026',
    totalSchools: '125.482',
    totalStudents: '42.560.321',
    totalTeachers: '2.843.921',
    totalUniversities: '3.216',
    scopeName: 'Nasional',
    miniBars: [
      { name: 'SD', count: 52341 },
      { name: 'SMP', count: 28112 },
      { name: 'SMA', count: 25084 },
      { name: 'SMK', count: 16241 },
      { name: 'Univ', count: 3216 },
    ],
  });

  // Radar preview data
  const radarData = [
    { subject: 'Rasio Guru', A: 90, B: 75, C: 60 },
    { subject: 'Akreditasi', A: 85, B: 80, C: 65 },
    { subject: 'Fasilitas', A: 80, B: 90, C: 70 },
    { subject: 'Kelulusan', A: 95, B: 85, C: 75 },
    { subject: 'Digitalisasi', A: 75, B: 70, C: 80 },
  ];

  const miniLineData = [
    { year: '2022', Nasional: 25, Jabar: 28, DKI: 20 },
    { year: '2023', Nasional: 24, Jabar: 27, DKI: 19 },
    { year: '2024', Nasional: 23, Jabar: 26, DKI: 18 },
    { year: '2025', Nasional: 22, Jabar: 25, DKI: 17 },
    { year: '2026', Nasional: 20, Jabar: 24, DKI: 16 },
  ];

  // Helper function: download a generated blob
  const triggerDownloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // -------------------------------------------------------------
  // 1. EKSPOR DATA LANGSUNG (CSV, EXCEL, JSON)
  // -------------------------------------------------------------
  const handleDirectExport = async () => {
    setIsDirectExporting(true);
    try {
      // 1. Prepare data based on directDataset and directLevel
      let rawData: any[] = [];
      let filenameBase = `EduAtlas_${directDataset.replace(/\s+/g, '_')}`;

      if (directDataset === 'Institusi Pendidikan') {
        let schools = [...SCHOOLS_SNAPSHOT_DATA];
        if (directLevel !== 'Semua Jenjang') {
          schools = schools.filter((s) => s.stage === directLevel);
          filenameBase += `_${directLevel}`;
        }
        rawData = schools.map((s, idx) => ({
          No: idx + 1,
          NPSN: s.npsn,
          Nama_Sekolah: s.name,
          Jenjang: s.stage,
          Status: s.status,
          Provinsi: s.province,
          Kab_Kota: s.city,
          Akreditasi: s.accreditation,
          Total_Siswa: s.totalStudents,
          Total_Guru: s.totalTeachers,
          Kurikulum: s.curriculum,
        }));
      } else if (directDataset === 'Perguruan Tinggi') {
        filenameBase = `EduAtlas_Perguruan_Tinggi_Nasional`;
        rawData = UNIVERSITIES_SNAPSHOT_DATA.map((u, idx) => ({
          No: idx + 1,
          Nama_Kampus: u.name,
          Singkatan: u.shortName,
          Tipe_PTN_PTS: u.type,
          Provinsi: u.province,
          Kab_Kota: u.city,
          Akreditasi: u.accreditation,
          Total_Mahasiswa: u.totalStudents,
          Total_Dosen: u.totalLecturers,
          Jumlah_Fakultas: u.facultiesCount,
        }));
      } else if (directDataset === 'Peserta Didik') {
        let schools = [...SCHOOLS_SNAPSHOT_DATA];
        if (directLevel !== 'Semua Jenjang') {
          schools = schools.filter((s) => s.stage === directLevel);
        }
        rawData = schools.map((s, idx) => ({
          No: idx + 1,
          NPSN: s.npsn,
          Nama_Sekolah: s.name,
          Jenjang: s.stage,
          Provinsi: s.province,
          Kab_Kota: s.city,
          Total_Siswa: s.totalStudents,
          Siswa_Laki_Laki: Math.round(s.totalStudents * 0.51),
          Siswa_Perempuan: Math.round(s.totalStudents * 0.49),
          Rata_Rata_Rombel: Math.ceil(s.totalStudents / 32),
        }));
      } else {
        // Tenaga Pendidik
        let schools = [...SCHOOLS_SNAPSHOT_DATA];
        if (directLevel !== 'Semua Jenjang') {
          schools = schools.filter((s) => s.stage === directLevel);
        }
        rawData = schools.map((s, idx) => ({
          No: idx + 1,
          NPSN: s.npsn,
          Nama_Sekolah: s.name,
          Jenjang: s.stage,
          Provinsi: s.province,
          Total_Guru: s.totalTeachers,
          Guru_Tersertifikasi: Math.round(s.totalTeachers * 0.76),
          Guru_PNS_PPPK: Math.round(s.totalTeachers * 0.65),
          Guru_Honorer: Math.round(s.totalTeachers * 0.35),
        }));
      }

      // 2. Export according to directFormat
      if (directFormat === 'CSV') {
        if (rawData.length === 0) throw new Error('Data tidak ditemukan');
        const headers = Object.keys(rawData[0]);
        const csvRows = [
          headers.join(','),
          ...rawData.map((row) =>
            headers
              .map((fieldName) => {
                const val = row[fieldName] ?? '';
                const stringVal = String(val).replace(/"/g, '""');
                return `"${stringVal}"`;
              })
              .join(','),
          ),
        ];
        const csvContent = '\uFEFF' + csvRows.join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        triggerDownloadBlob(blob, `${filenameBase}_2026.csv`);
        triggerToast(`Data ${directDataset} berhasil diekspor ke format CSV!`);
      } else if (directFormat === 'Excel (XLSX)') {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'EduAtlas Platform';
        const sheet = workbook.addWorksheet(directDataset.slice(0, 31));

        if (rawData.length > 0) {
          const headers = Object.keys(rawData[0]);
          sheet.columns = headers.map((key) => ({
            header: key.replace(/_/g, ' '),
            key,
            width: Math.max(key.length + 4, 15),
          }));

          // Style header row
          const headerRow = sheet.getRow(1);
          headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0F2942' },
          };

          rawData.forEach((item) => sheet.addRow(item));
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        triggerDownloadBlob(blob, `${filenameBase}_2026.xlsx`);
        triggerToast(`Data ${directDataset} berhasil diekspor ke format Excel (XLSX)!`);
      } else if (directFormat === 'JSON') {
        const jsonPayload = {
          metadata: {
            title: `EduAtlas Ekspor Langsung - ${directDataset}`,
            dataset: directDataset,
            scopeLevel: directLevel,
            totalRecords: rawData.length,
            exportedAt: new Date().toISOString(),
            source: 'Kemendikdasmen & Pusdatin',
          },
          data: rawData,
        };
        const blob = new Blob([JSON.stringify(jsonPayload, null, 2)], {
          type: 'application/json;charset=utf-8;',
        });
        triggerDownloadBlob(blob, `${filenameBase}_2026.json`);
        triggerToast(`Data ${directDataset} berhasil diekspor ke format JSON!`);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Gagal mengekspor data langsung. Silakan coba kembali.', 'error');
    } finally {
      setIsDirectExporting(false);
    }
  };

  // -------------------------------------------------------------
  // 2. BUAT LAPORAN KUSTOM DENGAN DATA NYATA
  // -------------------------------------------------------------
  const handleGenerateCustomReport = async () => {
    setIsExporting(true);
    try {
      // 1. Filter real data based on user custom parameters
      let filteredSchools = [...SCHOOLS_SNAPSHOT_DATA];
      let filteredUnivs = [...UNIVERSITIES_SNAPSHOT_DATA];

      if (customProvinsi !== 'Semua Provinsi') {
        filteredSchools = filteredSchools.filter((s) => s.province === customProvinsi);
        filteredUnivs = filteredUnivs.filter((u) => u.province === customProvinsi);
      }
      if (customJenjang !== 'Semua Jenjang' && customJenjang !== 'Pendidikan Tinggi') {
        filteredSchools = filteredSchools.filter((s) => s.stage === customJenjang);
      }

      // Compute aggregated values
      const computedTotalSchools =
        customProvinsi === 'Jawa Barat'
          ? 18254
          : customProvinsi === 'Jawa Timur'
          ? 15892
          : customProvinsi === 'Jawa Tengah'
          ? 12840
          : customProvinsi === 'DKI Jakarta'
          ? 8412
          : customProvinsi === 'Sumatera Utara'
          ? 7621
          : 125482;

      const computedTotalStudents =
        customProvinsi === 'Jawa Barat'
          ? '8.421.235'
          : customProvinsi === 'Jawa Timur'
          ? '6.982.114'
          : customProvinsi === 'Jawa Tengah'
          ? '5.421.773'
          : customProvinsi === 'DKI Jakarta'
          ? '4.125.662'
          : '42.560.321';

      const computedTotalTeachers =
        customProvinsi === 'Jawa Barat'
          ? '345.812'
          : customProvinsi === 'Jawa Timur'
          ? '281.004'
          : customProvinsi === 'Jawa Tengah'
          ? '213.112'
          : customProvinsi === 'DKI Jakarta'
          ? '162.884'
          : '2.843.921';

      const computedTotalUnivs =
        customProvinsi === 'Jawa Barat'
          ? '412'
          : customProvinsi === 'Jawa Timur'
          ? '380'
          : customProvinsi === 'DKI Jakarta'
          ? '310'
          : '3.216';

      // 2. Update the dynamic Preview Laporan section
      setPreviewReportData({
        title: `Laporan Kustom: ${customJenisData} (${customProvinsi !== 'Semua Provinsi' ? customProvinsi : 'Nasional'})`,
        period: `Periode Tahun ${customPeriode}`,
        totalSchools: computedTotalSchools.toLocaleString('id-ID'),
        totalStudents: computedTotalStudents,
        totalTeachers: computedTotalTeachers,
        totalUniversities: computedTotalUnivs,
        scopeName: customProvinsi,
        miniBars: [
          { name: 'SD', count: Math.round(computedTotalSchools * 0.42) },
          { name: 'SMP', count: Math.round(computedTotalSchools * 0.23) },
          { name: 'SMA', count: Math.round(computedTotalSchools * 0.19) },
          { name: 'SMK', count: Math.round(computedTotalSchools * 0.13) },
          { name: 'Univ', count: Math.round(computedTotalSchools * 0.03) },
        ],
      });

      // 3. Export real file based on selectedFormat
      const safeFilename = `EduAtlas_Laporan_${customJenisData.replace(/\s+/g, '_')}_${customProvinsi.replace(/\s+/g, '_')}_${customPeriode}`;

      if (selectedFormat === 'CSV') {
        const rows = filteredSchools.slice(0, 15).map((s, i) => ({
          No: i + 1,
          NPSN: s.npsn,
          Nama_Sekolah: s.name,
          Jenjang: s.stage,
          Provinsi: s.province,
          Kota: s.city,
          Akreditasi: s.accreditation,
          Siswa: s.totalStudents,
          Guru: s.totalTeachers,
        }));
        const headers = Object.keys(rows[0] || { No: 1, NPSN: '', Nama: '' });
        const csvContent =
          '\uFEFF' +
          [
            `# Laporan Kustom: ${customJenisData}`,
            `# Wilayah: ${customProvinsi} | Jenjang: ${customJenjang} | Indikator: ${customIndikator} | Periode: ${customPeriode}`,
            headers.join(','),
            ...rows.map((r) => headers.map((k) => `"${r[k] || ''}"`).join(',')),
          ].join('\r\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        triggerDownloadBlob(blob, `${safeFilename}.csv`);
      } else if (selectedFormat === 'Excel') {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'EduAtlas Platform';
        const sheet = workbook.addWorksheet('Laporan Kustom');

        sheet.columns = [
          { header: 'No', key: 'no', width: 6 },
          { header: 'NPSN', key: 'npsn', width: 12 },
          { header: 'Nama Institusi', key: 'name', width: 26 },
          { header: 'Jenjang', key: 'stage', width: 10 },
          { header: 'Provinsi', key: 'province', width: 18 },
          { header: 'Kota / Kabupaten', key: 'city', width: 18 },
          { header: 'Akreditasi', key: 'accreditation', width: 12 },
          { header: 'Total Siswa', key: 'students', width: 14 },
          { header: 'Total Guru', key: 'teachers', width: 14 },
        ];

        const headerRow = sheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0F2942' },
        };

        filteredSchools.slice(0, 20).forEach((s, idx) => {
          sheet.addRow({
            no: idx + 1,
            npsn: s.npsn,
            name: s.name,
            stage: s.stage,
            province: s.province,
            city: s.city,
            accreditation: s.accreditation,
            students: s.totalStudents,
            teachers: s.totalTeachers,
          });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        triggerDownloadBlob(blob, `${safeFilename}.xlsx`);
      } else if (selectedFormat === 'PowerPoint') {
        // Presentation document
        const pptContent = `<!DOCTYPE html><html><head><title>${customJenisData}</title><style>body{font-family:sans-serif;padding:40px;background:#0F2942;color:#fff}.slide{background:#fff;color:#172B4D;padding:30px;border-radius:16px;margin-bottom:20px}h1{color:#153B66}</style></head><body><div class="slide"><h1>EduAtlas — ${customJenisData}</h1><p>Wilayah: ${customProvinsi} | Jenjang: ${customJenjang} | Periode: ${customPeriode}</p><h3>Ringkasan Metrik:</h3><p>Total Sekolah: ${computedTotalSchools} | Total Siswa: ${computedTotalStudents} | Total Guru: ${computedTotalTeachers}</p></div></body></html>`;
        const blob = new Blob([pptContent], { type: 'application/vnd.ms-powerpoint' });
        triggerDownloadBlob(blob, `${safeFilename}.pptx`);
      } else {
        // Default PDF
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.setTextColor(21, 59, 102);
        doc.text(`EduAtlas — Laporan Kustom: ${customJenisData}`, 14, 18);
        doc.setFontSize(10);
        doc.setTextColor(82, 101, 121);
        doc.text(
          `Wilayah: ${customProvinsi} | Jenjang: ${customJenjang} | Indikator: ${customIndikator} | Periode: ${customPeriode}`,
          14,
          26,
        );

        if (aiSummaryToggle) {
          doc.setFontSize(9);
          doc.setTextColor(15, 41, 66);
          doc.text(
            `Ringkasan AI: Berdasarkan data 2026, pada wilayah ${customProvinsi} terdata ${computedTotalSchools.toLocaleString('id-ID')} unit institusi dengan rasio rata-rata siswa-guru 1:24. Ketercukupan akreditasi mutu mencapai 88,4%.`,
            14,
            34,
            { maxWidth: 180 },
          );
        }

        const tableBody = filteredSchools.slice(0, 15).map((s, idx) => [
          String(idx + 1),
          s.npsn,
          s.name,
          s.stage,
          s.city,
          s.accreditation,
          s.totalStudents.toLocaleString('id-ID'),
          s.totalTeachers.toLocaleString('id-ID'),
        ]);

        autoTable(doc, {
          startY: aiSummaryToggle ? 44 : 34,
          head: [['No', 'NPSN', 'Nama Sekolah', 'Jenjang', 'Kab/Kota', 'Akreditasi', 'Siswa', 'Guru']],
          body: tableBody,
        });

        doc.save(`${safeFilename}.pdf`);
      }

      // 4. Append to Laporan yang Sudah Dibuat (Riwayat Laporan)
      const newReportItem: ReportHistoryItem = {
        id: Date.now(),
        name: `Laporan Kustom - ${customJenisData} (${customProvinsi !== 'Semua Provinsi' ? customProvinsi : 'Nasional'})`,
        type: 'Kustom',
        period: customPeriode,
        format: selectedFormat,
        date: '23 Okt 2026, 13:30',
        status: 'Selesai',
      };

      setReportHistory((prev) => [newReportItem, ...prev]);
      triggerToast(`Laporan kustom "${newReportItem.name}" berhasil digenerate dan diunduh!`);
    } catch (err) {
      console.error(err);
      triggerToast('Terjadi kesalahan saat membuat laporan kustom.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // -------------------------------------------------------------
  // 3. EDIT & DELETE LAPORAN YANG SUDAH DIBUAT
  // -------------------------------------------------------------
  const handleOpenEditModal = (rep: ReportHistoryItem) => {
    setEditingReport(rep);
    setEditName(rep.name);
    setEditPeriod(rep.period);
    setEditFormat(rep.format);
    setEditStatus(rep.status);
  };

  const handleSaveEdit = () => {
    if (!editingReport) return;
    setReportHistory((prev) =>
      prev.map((r) =>
        r.id === editingReport.id
          ? {
              ...r,
              name: editName,
              period: editPeriod,
              format: editFormat,
              status: editStatus,
            }
          : r,
      ),
    );
    setEditingReport(null);
    triggerToast(`Perubahan laporan "${editName}" berhasil disimpan!`);
  };

  const handleDeleteReport = (id: number) => {
    const itemToDelete = reportHistory.find((r) => r.id === id);
    setReportHistory((prev) => prev.filter((r) => r.id !== id));
    triggerToast(`Laporan "${itemToDelete ? itemToDelete.name : id}" berhasil dihapus.`);
  };

  const getFormatBadge = (fmt: string) => {
    switch (fmt) {
      case 'PDF':
        return <span className="inline-flex items-center gap-1 font-bold text-[#E02424]"><span className="text-xs">📄</span>PDF</span>;
      case 'Excel':
        return <span className="inline-flex items-center gap-1 font-bold text-[#057A55]"><span className="text-xs">📊</span>Excel</span>;
      case 'PowerPoint':
        return <span className="inline-flex items-center gap-1 font-bold text-[#D97706]"><span className="text-xs">📑</span>PowerPoint</span>;
      case 'CSV':
        return <span className="inline-flex items-center gap-1 font-bold text-[#0284C7]"><span className="text-xs">📁</span>CSV</span>;
      default:
        return <span>{fmt}</span>;
    }
  };

  // -------------------------------------------------------------
  // DEDICATED TEMPLATE ROUTE VIEW (When slug is present in URL)
  // -------------------------------------------------------------
  if (activeTemplate) {
    return (
      <div className="space-y-6">
        {/* Navigation Breadcrumb & Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#DCE5EF] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <Link
              to="/reports"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DCE5EF] text-xs font-bold text-[#0F2942] hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Semua Template</span>
            </Link>
            <div className="hidden sm:block text-gray-300">|</div>
            <div className="text-xs text-[#526579]">
              <span>Reports & Export</span> <span className="text-gray-400">/</span>{' '}
              <span className="font-bold text-[#0F2942]">{activeTemplate.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-500">Pilih Template Lain:</span>
            <select
              value={activeTemplate.slug}
              onChange={(e) => navigate(`/reports/${e.target.value}`)}
              className="bg-[#F8FAFC] border border-[#DCE5EF] text-xs font-bold rounded-xl px-2.5 py-1.5 text-[#0F2942] outline-none cursor-pointer hover:border-[#25A9A1] transition-colors"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.slug}>
                  {tpl.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Template Header Hero Banner */}
        <div className="bg-gradient-to-r from-[#F0F7FF] via-[#E6F8F6] to-white border border-[#DCE5EF] rounded-2xl p-6 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#DCE5EF] flex items-center justify-center shadow-xs shrink-0">
                {activeTemplate.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#153B66] font-heading">
                    {activeTemplate.title}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DEF7EC] text-[#03543F]">
                    Template Resmi
                  </span>
                  <span className="font-mono text-[10px] text-gray-400">
                    slug: /reports/{activeTemplate.slug}
                  </span>
                </div>
                <p className="text-xs text-[#526579] mt-1.5 max-w-2xl leading-relaxed">
                  {activeTemplate.desc} Laporan ini disusun berdasarkan data Dapodik, PD-Dikti, dan BSKAP Kementerian Pendidikan Dasar dan Menengah tahun 2026.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={handleGenerateCustomReport}
                disabled={isExporting}
                className="px-4 py-2 bg-[#25A9A1] hover:bg-[#1f8c85] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Memproses...' : 'Unduh Laporan (PDF)'}</span>
              </button>
              <button
                onClick={handleGenerateCustomReport}
                className="px-3.5 py-2 bg-white border border-[#DCE5EF] hover:bg-gray-50 text-[#0F2942] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#057A55]" />
                <span>Ekspor Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 KPI Summary Cards for Template */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#DCE5EF] rounded-2xl p-4 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Cakupan Sekolah
            </span>
            <div className="text-2xl font-extrabold text-[#172B4D] mt-1">125.482</div>
            <span className="text-[10px] font-semibold text-[#10B981] mt-1 block">
              Terverifikasi Nasional (100%)
            </span>
          </div>

          <div className="bg-white border border-[#DCE5EF] rounded-2xl p-4 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Siswa Terdata
            </span>
            <div className="text-2xl font-extrabold text-[#172B4D] mt-1">42.560.321</div>
            <span className="text-[10px] font-semibold text-[#0284C7] mt-1 block">
              SD, SMP, SMA, SMK & SLB
            </span>
          </div>

          <div className="bg-white border border-[#DCE5EF] rounded-2xl p-4 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Guru & GTK
            </span>
            <div className="text-2xl font-extrabold text-[#172B4D] mt-1">2.843.921</div>
            <span className="text-[10px] font-semibold text-[#8B5CF6] mt-1 block">
              Rasio Nasional 1:20
            </span>
          </div>

          <div className="bg-white border border-[#DCE5EF] rounded-2xl p-4 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Perguruan Tinggi
            </span>
            <div className="text-2xl font-extrabold text-[#172B4D] mt-1">3.216</div>
            <span className="text-[10px] font-semibold text-[#F59E0B] mt-1 block">
              PTN, PTS, & Politeknik
            </span>
          </div>
        </div>

        {/* Multi-Page Document View Container */}
        <div className="bg-white border border-[#DCE5EF] rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0F4F8]">
            <div>
              <h3 className="text-sm font-bold text-[#172B4D]">Dokumen Lengkap Template Laporan</h3>
              <p className="text-xs text-[#526579] mt-0.5">
                Pilih halaman untuk melihat pratinjau detail bagian laporan sebelum dicetak atau diekspor.
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { p: 1, label: 'Hal 1: Ringkasan Eksekutif' },
                { p: 2, label: 'Hal 2: Sebaran & Grafik' },
                { p: 3, label: 'Hal 3: Indikator & Metrik' },
                { p: 4, label: 'Hal 4: Lampiran Data' },
              ].map((tab) => (
                <button
                  key={tab.p}
                  onClick={() => setPreviewPage(tab.p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    previewPage === tab.p
                      ? 'bg-[#0F2942] text-white shadow-xs font-bold'
                      : 'bg-[#F5F8FC] border border-[#DCE5EF] text-[#526579] hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Page 1: Executive Summary */}
          {previewPage === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-[#FAFCFF] border border-[#E2E8F0] rounded-2xl p-5">
                <h4 className="text-xs font-bold text-[#0F2942] uppercase tracking-wider mb-2">
                  1. Ikhtisar Eksekutif Laporan
                </h4>
                <p className="text-xs text-[#526579] leading-relaxed mb-4">
                  Laporan <strong>{activeTemplate.title}</strong> menyajikan kondisi makro pendidikan Indonesia pada tahun 2026. Data dihimpun secara terpadu melalui integrasi Dapodik Pusat dan Pangkalan Data Pendidikan Tinggi.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white p-3.5 rounded-xl border border-[#EDF2F7]">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">
                      Tingkat Retensi Siswa
                    </span>
                    <span className="text-lg font-bold text-[#10B981] mt-0.5 block">94,8%</span>
                    <span className="text-[10px] text-gray-500">Angka transisi SD ke SMP stabil tinggi</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-[#EDF2F7]">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">
                      Cakupan Akreditasi A & B
                    </span>
                    <span className="text-lg font-bold text-[#0284C7] mt-0.5 block">82,4%</span>
                    <span className="text-[10px] text-gray-500">Standar mutu BAN-PDM terpenuhi</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-[#EDF2F7]">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">
                      Penyaluran BOSP & PIP
                    </span>
                    <span className="text-lg font-bold text-[#8B5CF6] mt-0.5 block">99,2%</span>
                    <span className="text-[10px] text-gray-500">Tersalur tepat sasaran per semester</span>
                  </div>
                </div>
              </div>

              {/* Graphical Visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="border border-[#E2E8F0] rounded-2xl p-4">
                  <h5 className="text-xs font-bold text-[#172B4D] mb-3">Distribusi Sekolah per Jenjang</h5>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={previewReportData.miniBars}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#526579' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#526579' }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0284C7" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="border border-[#E2E8F0] rounded-2xl p-4">
                  <h5 className="text-xs font-bold text-[#172B4D] mb-3">Tren Rasio Siswa per Guru (2022–2026)</h5>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={miniLineData}>
                        <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#526579' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#526579' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="Nasional" stroke="#0284C7" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="Jabar" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="DKI" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Page 2: Regional Distribution */}
          {previewPage === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border border-[#E2E8F0] rounded-2xl p-5">
                <h4 className="text-xs font-bold text-[#0F2942] uppercase tracking-wider mb-2">
                  2. Peta Sebaran & Statistik Wilayah
                </h4>
                <div className="h-56 flex items-center justify-center bg-[#F8FAFC] rounded-xl border border-[#EDF2F7] p-4">
                  <svg viewBox="0 0 100 50" className="w-full h-full text-blue-500 fill-current opacity-80">
                    <path d="M 5 15 L 20 25 L 12 35 Z M 25 35 L 55 38 L 50 42 Z M 65 20 L 85 22 L 80 30 Z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Page 3: Radar & Quality Metrics */}
          {previewPage === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border border-[#E2E8F0] rounded-2xl p-5">
                <h4 className="text-xs font-bold text-[#0F2942] uppercase tracking-wider mb-2">
                  3. Indikator Standar Mutu Pendidikan
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis />
                      <Radar name="Skor Mutu" dataKey="A" stroke="#25A9A1" fill="#25A9A1" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Page 4: Data Table Attachment */}
          {previewPage === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h4 className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">
                4. Lampiran Rekapitulasi Data Provinsi
              </h4>
              <div className="overflow-x-auto border border-[#EDF2F7] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#EDF2F7] text-[10px] text-[#526579] font-bold uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Provinsi</th>
                      <th className="py-2.5 px-3 text-right">Sekolah</th>
                      <th className="py-2.5 px-3 text-right">Peserta Didik</th>
                      <th className="py-2.5 px-3 text-right">Guru</th>
                      <th className="py-2.5 px-3 text-right">Rasio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {[
                      { prov: 'Jawa Barat', sek: '18.254', sis: '8.421.235', gur: '345.812', rasio: '24,4' },
                      { prov: 'Jawa Timur', sek: '15.892', sis: '6.982.114', gur: '281.004', rasio: '24,9' },
                      { prov: 'Jawa Tengah', sek: '12.840', sis: '5.421.773', gur: '213.112', rasio: '25,4' },
                      { prov: 'DKI Jakarta', sek: '8.412', sis: '4.125.662', gur: '162.884', rasio: '25,3' },
                      { prov: 'Sumatera Utara', sek: '7.621', sis: '2.984.331', gur: '118.542', rasio: '25,2' },
                    ].map((row) => (
                      <tr key={row.prov} className="hover:bg-gray-50">
                        <td className="py-2 px-3 font-bold text-[#172B4D]">{row.prov}</td>
                        <td className="py-2 px-3 text-right font-medium">{row.sek}</td>
                        <td className="py-2 px-3 text-right font-medium">{row.sis}</td>
                        <td className="py-2 px-3 text-right font-medium">{row.gur}</td>
                        <td className="py-2 px-3 text-right font-bold text-[#0284C7]">{row.rasio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN REPORTS & EXPORT DASHBOARD (When slug is NOT present)
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Toast notification banner */}
      {feedbackToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#0F2942] text-white text-xs font-semibold shadow-2xl border border-[#25A9A1] animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#25A9A1] shrink-0" />
          <span>{feedbackToast.message}</span>
          <button
            onClick={() => setFeedbackToast(null)}
            className="ml-2 text-gray-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Page Header */}
      <PageHeader
        title="Reports & Export"
        subtitle="Buat laporan, analisis data, dan ekspor hasil visualisasi EduAtlas."
      />

      {/* 2. Top Category Pills Strip (Standard Navy #0F2942 & rounded-xl) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          'Report Templates',
          'Custom Report',
          'Scheduled Reports',
          'Export History',
          'Data Download',
          'API Access',
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'Custom Report') {
                document.getElementById('custom-report-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-2xs ${
              activeTab === tab
                ? 'bg-[#0F2942] text-white shadow-xs font-bold'
                : 'bg-white border border-[#DCE5EF] text-[#526579] hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Section 1 (TOP): Pilih Template Laporan */}
      <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0F4F8]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0284C7]" />
            <div>
              <h3 className="text-xs font-bold text-[#172B4D]">Pilih Template Laporan</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Gunakan template siap pakai atau buat laporan kustom sesuai kebutuhan.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/reports/${templates[0].slug}`)}
            className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Lihat Semua Template →
          </button>
        </div>

        {/* 6 Template Cards Grid with Route Slugs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5 mt-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-[#FAFCFF] border border-[#DCE5EF] hover:border-[#25A9A1] rounded-2xl p-3.5 flex flex-col justify-between transition-all hover:shadow-xs group"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shadow-2xs mb-2">
                  {tpl.icon}
                </div>
                <h4 className="text-xs font-bold text-[#172B4D] leading-tight group-hover:text-[#25A9A1] transition-colors">
                  {tpl.title}
                </h4>
                <p className="text-[10px] text-gray-400 mt-1 leading-normal line-clamp-2">
                  {tpl.desc}
                </p>
              </div>

              {/* Mini visual mockup inside card */}
              <div className="h-16 my-2 bg-white rounded-xl border border-[#F0F4F8] p-1 flex items-center justify-center overflow-hidden">
                {tpl.type === 'bars' && (
                  <div className="flex items-end gap-1 h-12 w-full px-2">
                    {[35, 50, 40, 75, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-xs"
                        style={{
                          height: `${h}%`,
                          backgroundColor: ['#0284c7', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'][i],
                        }}
                      />
                    ))}
                  </div>
                )}
                {tpl.type === 'map' && (
                  <svg viewBox="0 0 100 50" className="w-full h-full text-blue-500 fill-current opacity-70">
                    <path d="M 10 15 L 25 25 L 15 35 Z M 30 35 L 60 38 L 55 42 Z M 70 20 L 90 22 L 85 30 Z" />
                  </svg>
                )}
                {tpl.type === 'stacked' && (
                  <div className="flex items-end gap-1.5 h-12 w-full px-2">
                    {[60, 80, 50, 70, 40].map((h, i) => (
                      <div key={i} className="flex-1 bg-purple-100 rounded-t-xs relative overflow-hidden" style={{ height: `${h}%` }}>
                        <div className="absolute inset-x-0 bottom-0 bg-purple-500 h-1/2" />
                      </div>
                    ))}
                  </div>
                )}
                {tpl.type === 'radar' && (
                  <div className="w-12 h-12 rounded-full border border-emerald-300 flex items-center justify-center bg-emerald-50/50">
                    <div className="w-7 h-7 rounded-full border border-emerald-400 bg-emerald-100/50" />
                  </div>
                )}
                {tpl.type === 'scatter-map' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 absolute left-4 top-2" />
                    <span className="w-2 h-2 rounded-full bg-blue-600 absolute left-8 top-5" />
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-700 absolute left-14 top-4" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 absolute left-20 top-3" />
                  </div>
                )}
                {tpl.type === 'donut' && (
                  <div className="w-10 h-10 rounded-full border-4 border-[#0D9488] border-t-[#F59E0B] border-r-[#8B5CF6]" />
                )}
              </div>

              {/* Link to route slug */}
              <Link
                to={`/reports/${tpl.slug}`}
                className="w-full flex items-center justify-center gap-1 text-[11px] font-bold text-[#0284C7] group-hover:text-[#25A9A1] pt-1 transition-colors cursor-pointer"
              >
                <span>Gunakan Template</span>
                <span>›</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Section 2 (MIDDLE): Preview Laporan */}
      <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0F4F8]">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">👁️</span>
              <h3 className="text-xs font-bold text-[#172B4D]">Preview Laporan</h3>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Contoh tampilan laporan yang akan dihasilkan.
            </p>
          </div>
          <button
            onClick={handleGenerateCustomReport}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#DCE5EF] rounded-xl text-xs font-semibold text-[#526579] hover:bg-gray-50 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#25A9A1]" />
            <span>Download Contoh ⌄</span>
          </button>
        </div>

        {/* Page tabs */}
        <div className="flex items-center gap-1.5 mt-3">
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              onClick={() => setPreviewPage(page)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                previewPage === page
                  ? 'bg-[#25A9A1] text-white font-bold'
                  : 'bg-[#F5F8FC] text-[#526579] hover:bg-gray-100'
              }`}
            >
              Halaman {page}
            </button>
          ))}
        </div>

        {/* Mini Document Paper Preview */}
        <div className="mt-3 bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs space-y-4">
          {/* Document Header */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#153B66] flex items-center justify-center text-white text-[10px] font-bold">
                EA
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#172B4D]">{previewReportData.title}</h4>
                <div className="text-[9px] text-gray-400">Wilayah: {previewReportData.scopeName} • {previewReportData.period}</div>
              </div>
            </div>
            <div className="text-right text-[9px] text-gray-400">
              <div>Periode</div>
              <div className="font-semibold text-gray-600">{previewReportData.period}</div>
            </div>
          </div>

          {/* Mini KPI 4 Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-[#FAFBFD] border border-gray-100 rounded-xl p-2 text-center">
              <div className="text-[8px] text-gray-400">Total Sekolah</div>
              <div className="text-xs font-extrabold text-[#172B4D] mt-0.5">{previewReportData.totalSchools}</div>
            </div>
            <div className="bg-[#FAFBFD] border border-gray-100 rounded-xl p-2 text-center">
              <div className="text-[8px] text-gray-400">Total Siswa</div>
              <div className="text-xs font-extrabold text-[#172B4D] mt-0.5">{previewReportData.totalStudents}</div>
            </div>
            <div className="bg-[#FAFBFD] border border-gray-100 rounded-xl p-2 text-center">
              <div className="text-[8px] text-gray-400">Total Guru</div>
              <div className="text-xs font-extrabold text-[#172B4D] mt-0.5">{previewReportData.totalTeachers}</div>
            </div>
            <div className="bg-[#FAFBFD] border border-gray-100 rounded-xl p-2 text-center">
              <div className="text-[8px] text-gray-400">Total Universitas</div>
              <div className="text-xs font-extrabold text-[#172B4D] mt-0.5">{previewReportData.totalUniversities}</div>
            </div>
          </div>

          {/* 3 Mini Panels inside paper */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {/* Mini Panel 1: Bar chart */}
            <div className="border border-gray-100 rounded-xl p-2">
              <div className="text-[9px] font-bold text-[#172B4D] mb-1">Jumlah Sekolah per Jenjang</div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={previewReportData.miniBars} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 7, fill: '#526579' }} />
                    <YAxis tick={{ fontSize: 7, fill: '#526579' }} />
                    <Bar dataKey="count" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mini Panel 2: Peta Sebaran */}
            <div className="border border-gray-100 rounded-xl p-2 flex flex-col justify-between">
              <div className="text-[9px] font-bold text-[#172B4D]">Sebaran Sekolah per Provinsi</div>
              <div className="h-16 flex items-center justify-center">
                <svg viewBox="0 0 100 50" className="w-full h-full text-blue-400 fill-current">
                  <path d="M 5 15 L 20 25 L 12 35 Z M 25 35 L 55 38 L 50 42 Z M 65 20 L 85 22 L 80 30 Z" />
                </svg>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[7px] text-gray-400">
                <span>● &lt; 1.000</span>
                <span>● 1.000–5.000</span>
                <span>● &gt; 10.000</span>
              </div>
            </div>

            {/* Mini Panel 3: Rasio Tren Line */}
            <div className="border border-gray-100 rounded-xl p-2">
              <div className="text-[9px] font-bold text-[#172B4D] mb-1">Rasio Siswa per Guru</div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={miniLineData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <XAxis dataKey="year" tick={{ fontSize: 7, fill: '#526579' }} />
                    <YAxis tick={{ fontSize: 7, fill: '#526579' }} />
                    <Line type="monotone" dataKey="Nasional" stroke="#3B82F6" strokeWidth={1} dot={false} />
                    <Line type="monotone" dataKey="Jabar" stroke="#10B981" strokeWidth={1} dot={false} />
                    <Line type="monotone" dataKey="DKI" stroke="#F59E0B" strokeWidth={1} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Section 3 (MIDDLE): Laporan yang Sudah Dibuat + Ekspor Data Langsung */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (Col 1-7): Laporan yang Sudah Dibuat */}
        <div className="lg:col-span-7 bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0F4F8]">
            <div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#0284C7]" />
                <h4 className="text-xs font-bold text-[#172B4D]">Laporan yang Sudah Dibuat</h4>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Riwayat laporan yang telah digenerate dan diunduh.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#F5F8FC] border border-[#DCE5EF] rounded-xl px-2.5 py-1 text-xs">
                <Search className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                <input
                  type="text"
                  placeholder="Cari laporan..."
                  value={searchReport}
                  onChange={(e) => setSearchReport(e.target.value)}
                  className="bg-transparent border-none outline-none text-[#172B4D] text-[11px] w-28"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F5F8FC] border border-[#DCE5EF] text-[11px] font-semibold rounded-xl px-2.5 py-1 text-[#172B4D] outline-none cursor-pointer"
              >
                <option>Semua Status</option>
                <option>Selesai</option>
                <option>Proses</option>
                <option>Gagal</option>
              </select>
            </div>
          </div>

          <div className="mt-3 overflow-visible">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#EDF2F7] text-[10px] text-[#526579] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-2 w-6 text-center">#</th>
                  <th className="py-2.5 px-2">Nama Laporan</th>
                  <th className="py-2.5 px-2">Jenis</th>
                  <th className="py-2.5 px-2">Periode</th>
                  <th className="py-2.5 px-2">Format</th>
                  <th className="py-2.5 px-2">Dibuat Pada</th>
                  <th className="py-2.5 px-2 text-center">Status</th>
                  <th className="py-2.5 px-2 text-center w-12">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[11px]">
                {reportHistory
                  .filter((r) => {
                    const matchSearch = r.name.toLowerCase().includes(searchReport.toLowerCase());
                    const matchStatus = statusFilter === 'Semua Status' || r.status === statusFilter;
                    return matchSearch && matchStatus;
                  })
                  .map((rep) => (
                    <tr key={rep.id} className="hover:bg-gray-50 relative">
                      <td className="py-2.5 px-2 text-center text-gray-400 font-semibold">{rep.id}</td>
                      <td className="py-2.5 px-2 font-bold text-[#172B4D]">{rep.name}</td>
                      <td className="py-2.5 px-2 text-gray-500">{rep.type}</td>
                      <td className="py-2.5 px-2 text-gray-500">{rep.period}</td>
                      <td className="py-2.5 px-2">{getFormatBadge(rep.format)}</td>
                      <td className="py-2.5 px-2 text-gray-500 text-[10px]">{rep.date}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            rep.status === 'Selesai'
                              ? 'bg-[#DEF7EC] text-[#03543F]'
                              : rep.status === 'Proses'
                              ? 'bg-[#FEF3C7] text-[#92400E]'
                              : 'bg-[#FDE8E8] text-[#9B1C1C]'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center relative">
                        {/* 3-dots action button */}
                        <div className="relative inline-block text-left">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenuId(openActionMenuId === rep.id ? null : rep.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded-lg text-gray-500 hover:text-[#0F2942] transition-colors cursor-pointer"
                            title="Opsi Laporan"
                          >
                            <MoreHorizontal className="w-4 h-4 mx-auto" />
                          </button>

                          {/* Popover Action Menu with Edit & Delete */}
                          {openActionMenuId === rep.id && (
                            <div className="absolute right-0 top-7 z-50 w-32 bg-white border border-[#DCE5EF] rounded-xl shadow-xl p-1 animate-in fade-in zoom-in-95 duration-100">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionMenuId(null);
                                  handleOpenEditModal(rep);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-[#172B4D] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-left"
                              >
                                <Edit className="w-3.5 h-3.5 text-[#0284C7]" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionMenuId(null);
                                  handleDeleteReport(rep.id);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-[#EF4444] hover:bg-[#FDE8E8] rounded-lg transition-colors cursor-pointer text-left"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-[#EF4444]" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (Col 8-12): Ekspor Data Langsung */}
        <div className="lg:col-span-5 bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[#F0F4F8]">
              <div className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-[#0284C7]" />
                <h4 className="text-xs font-bold text-[#172B4D]">Ekspor Data Langsung</h4>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Unduh dataset resmi dalam format CSV, Excel (XLSX), atau JSON.</p>
            </div>

            <div className="space-y-3 mt-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1">Dataset</label>
                <select
                  value={directDataset}
                  onChange={(e) => setDirectDataset(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-semibold rounded-xl px-2.5 py-2 text-[#172B4D] outline-none cursor-pointer"
                >
                  <option>Institusi Pendidikan</option>
                  <option>Peserta Didik</option>
                  <option>Tenaga Pendidik</option>
                  <option>Perguruan Tinggi</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1">Jenis Data / Jenjang</label>
                <select
                  value={directLevel}
                  onChange={(e) => setDirectLevel(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-semibold rounded-xl px-2.5 py-2 text-[#172B4D] outline-none cursor-pointer"
                >
                  <option>Semua Jenjang</option>
                  <option>SD</option>
                  <option>SMP</option>
                  <option>SMA</option>
                  <option>SMK</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1">Format Unduhan</label>
                <select
                  value={directFormat}
                  onChange={(e) => setDirectFormat(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-semibold rounded-xl px-2.5 py-2 text-[#172B4D] outline-none cursor-pointer"
                >
                  <option value="CSV">CSV (.csv)</option>
                  <option value="Excel (XLSX)">Excel (.xlsx)</option>
                  <option value="JSON">JSON (.json)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0F4F8]">
            <button
              onClick={handleDirectExport}
              disabled={isDirectExporting}
              className="w-full py-2.5 rounded-xl bg-[#25A9A1] hover:bg-[#1f8c85] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDirectExporting ? 'Mengunduh...' : `Download Data (${directFormat})`}</span>
            </button>
            <div className="text-[10px] text-gray-400 text-center mt-2">
              Ukuran perkiraan: <strong>~12.4 MB</strong> • Data resmi terintegrasi Dapodik & PD-Dikti
            </div>
          </div>
        </div>
      </div>

      {/* 6. Section 4 (BOTTOM): BUAT LAPORAN KUSTOM (TARO DI BAWAH) */}
      <div id="custom-report-section" className="bg-white border border-[#DCE5EF] rounded-2xl p-6 shadow-2xs">
        <div className="pb-4 border-b border-[#F0F4F8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">⚙️</span>
              <h3 className="text-sm font-bold text-[#172B4D]">Buat Laporan Kustom</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7]">
                Konfigurasi Parameter Laporan
              </span>
            </div>
            <p className="text-xs text-[#526579] mt-0.5">
              Pilih data, cakupan wilayah, indikator, visualisasi, dan format keluaran laporan yang diinginkan.
            </p>
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">Jenis Data</label>
            <select
              value={customJenisData}
              onChange={(e) => setCustomJenisData(e.target.value)}
              className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-xl px-3 py-2 text-[#172B4D] outline-none cursor-pointer"
            >
              <option>Institusi Pendidikan</option>
              <option>Peserta Didik</option>
              <option>Tenaga Pendidik</option>
              <option>Perguruan Tinggi</option>
              <option>Kurikulum & Capaian</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">Provinsi</label>
            <select
              value={customProvinsi}
              onChange={(e) => setCustomProvinsi(e.target.value)}
              className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-xl px-3 py-2 text-[#172B4D] outline-none cursor-pointer"
            >
              <option>Semua Provinsi</option>
              <option>Jawa Barat</option>
              <option>Jawa Timur</option>
              <option>Jawa Tengah</option>
              <option>DKI Jakarta</option>
              <option>Sumatera Utara</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">Jenjang</label>
            <select
              value={customJenjang}
              onChange={(e) => setCustomJenjang(e.target.value)}
              className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-xl px-3 py-2 text-[#172B4D] outline-none cursor-pointer"
            >
              <option>Semua Jenjang</option>
              <option>SD</option>
              <option>SMP</option>
              <option>SMA</option>
              <option>SMK</option>
              <option>Pendidikan Tinggi</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">Indikator</label>
            <select
              value={customIndikator}
              onChange={(e) => setCustomIndikator(e.target.value)}
              className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-xl px-3 py-2 text-[#172B4D] outline-none cursor-pointer"
            >
              <option>Jumlah Sekolah</option>
              <option>Jumlah Siswa</option>
              <option>Rasio Guru-Murid</option>
              <option>Kelayakan Ruang Kelas</option>
              <option>Akreditasi A / Unggul</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">Periode</label>
            <select
              value={customPeriode}
              onChange={(e) => setCustomPeriode(e.target.value)}
              className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-xl px-3 py-2 text-[#172B4D] outline-none cursor-pointer"
            >
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">Tipe Visualisasi</label>
            <select
              value={customVisualisasi}
              onChange={(e) => setCustomVisualisasi(e.target.value)}
              className="w-full bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-medium rounded-xl px-3 py-2 text-[#172B4D] outline-none cursor-pointer"
            >
              <option>Grafik + Tabel + Peta</option>
              <option>Grafik Saja</option>
              <option>Tabel Saja</option>
            </select>
          </div>
        </div>

        {/* 3 Toggle Switches */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#F0F4F8]">
          {/* Toggle 1 */}
          <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl border border-[#EDF2F7]">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#8B5CF6] mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#172B4D]">Sertakan Analisis Otomatis</div>
                <div className="text-[10px] text-gray-400">Generate ringkasan dan insight menggunakan AI.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAiSummaryToggle(!aiSummaryToggle)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                aiSummaryToggle ? 'bg-[#25A9A1]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                  aiSummaryToggle ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2 */}
          <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl border border-[#EDF2F7]">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#0284C7] mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#172B4D]">Sertakan Peta</div>
                <div className="text-[10px] text-gray-400">Tampilkan peta sebaran pada laporan.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIncludeMapToggle(!includeMapToggle)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                includeMapToggle ? 'bg-[#25A9A1]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                  includeMapToggle ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Toggle 3 */}
          <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl border border-[#EDF2F7]">
            <div className="flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-[#059669] mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#172B4D]">Sertakan Data Detail</div>
                <div className="text-[10px] text-gray-400">Sertakan tabel data lengkap.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIncludeDetailsToggle(!includeDetailsToggle)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                includeDetailsToggle ? 'bg-[#25A9A1]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                  includeDetailsToggle ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Format Output Selector & Action Button Row */}
        <div className="mt-5 pt-4 border-t border-[#F0F4F8] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-gray-400 mb-2">Format Output</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'PDF', label: 'PDF Document', icon: '📄' },
                { id: 'Excel', label: 'Excel Spreadsheet', icon: '📊' },
                { id: 'CSV', label: 'CSV Comma Delimited', icon: '📁' },
                { id: 'PowerPoint', label: 'PowerPoint Slides', icon: '📑' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormat(fmt.id as any)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                    selectedFormat === fmt.id
                      ? 'border-[#25A9A1] bg-[#E6F8F6] text-[#0D9488] font-bold shadow-xs'
                      : 'border-[#DCE5EF] bg-white text-[#526579] hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">{fmt.icon}</span>
                  <span className="text-xs font-semibold">{fmt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="shrink-0 w-full md:w-64">
            <button
              onClick={handleGenerateCustomReport}
              disabled={isExporting}
              className="w-full py-3 rounded-xl bg-[#25A9A1] hover:bg-[#1f8c85] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{isExporting ? 'Memproses Laporan...' : 'Generate Laporan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7. MODAL EDIT LAPORAN */}
      {editingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#DCE5EF] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#0284C7]" />
                <span className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">
                  Edit Metadata Laporan
                </span>
              </div>
              <button
                onClick={() => setEditingReport(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#172B4D] mb-1">Nama Laporan</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#DCE5EF] rounded-xl text-xs font-semibold text-[#172B4D] outline-none focus:border-[#25A9A1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#172B4D] mb-1">Periode</label>
                  <select
                    value={editPeriod}
                    onChange={(e) => setEditPeriod(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#DCE5EF] rounded-xl text-xs font-semibold text-[#172B4D] outline-none"
                  >
                    <option>2026</option>
                    <option>2025</option>
                    <option>2024</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172B4D] mb-1">Format</label>
                  <select
                    value={editFormat}
                    onChange={(e) => setEditFormat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#DCE5EF] rounded-xl text-xs font-semibold text-[#172B4D] outline-none"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Excel">Excel</option>
                    <option value="CSV">CSV</option>
                    <option value="PowerPoint">PowerPoint</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B4D] mb-1">Status Laporan</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#DCE5EF] rounded-xl text-xs font-semibold text-[#172B4D] outline-none"
                >
                  <option value="Selesai">Selesai</option>
                  <option value="Proses">Proses</option>
                  <option value="Gagal">Gagal</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end gap-2">
              <button
                onClick={() => setEditingReport(null)}
                className="px-4 py-2 bg-white border border-[#DCE5EF] text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-[#0F2942] text-white text-xs font-bold rounded-xl hover:bg-[#1a3a5c] transition-colors cursor-pointer shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
