import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import {
  Code,
  Database,
  RotateCcw,
  ShieldCheck,
  Clock,
  Search,
  MoreHorizontal,
  ChevronDown,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Check,
  ExternalLink,
  X,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Globe,
  RefreshCw,
  Sparkles,
  Filter,
  ArrowUpRight,
  Lock,
  Shield,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export type StatusTab =
  | 'API Status'
  | 'Data Status'
  | 'Data Quality'
  | 'Update History'
  | 'System Logs'
  | 'Webhook & Integration'
  | 'Environment';

export interface ModalDetailData {
  type: 'service' | 'dataset' | 'log' | 'webhook' | 'environment';
  title: string;
  badge?: string;
  badgeColor?: string;
  details: { label: string; value: string | React.ReactNode }[];
  description?: string;
  codeSnippet?: string;
}

export const DataStatusPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StatusTab>('API Status');
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceStatusFilter, setServiceStatusFilter] = useState('Semua Status');
  const [datasetCategoryFilter, setDatasetCategoryFilter] = useState('Semua Kategori');
  const [datasetSearch, setDatasetSearch] = useState('');
  const [logSearch, setLogSearch] = useState('');
  const [logLevelFilter, setLogLevelFilter] = useState('Semua Level');
  const [logServiceFilter, setLogServiceFilter] = useState('Semua Service');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('Semua Status');
  const [selectedModal, setSelectedModal] = useState<ModalDetailData | null>(null);
  const [testPingSuccess, setTestPingSuccess] = useState<string | null>(null);

  // Response time time-series (24 hours)
  const responseTimeData = [
    { time: '00:00', Auth: 110, Education: 200, School: 260, Student: 700, Reports: 450 },
    { time: '04:00', Auth: 95, Education: 180, School: 240, Student: 650, Reports: 400 },
    { time: '08:00', Auth: 130, Education: 240, School: 300, Student: 800, Reports: 520 },
    { time: '12:00', Auth: 140, Education: 260, School: 320, Student: 950, Reports: 600 },
    { time: '16:00', Auth: 160, Education: 310, School: 380, Student: 1550, Reports: 800 },
    { time: '20:00', Auth: 125, Education: 230, School: 290, Student: 850, Reports: 500 },
  ];

  // API Services table conforming to screenshot
  const apiServices = [
    { id: 1, name: 'Auth Service', url: '/api/v1/auth', status: 'Online', uptime: '99,9%', avgResponse: '120 ms', lastChecked: '20 Okt 2026, 10:24', method: 'JWT / OAuth2', rateLimit: '10.000 req/min' },
    { id: 2, name: 'Education Core', url: '/api/v1/education', status: 'Online', uptime: '99,6%', avgResponse: '210 ms', lastChecked: '20 Okt 2026, 10:24', method: 'REST / JSON', rateLimit: '50.000 req/min' },
    { id: 3, name: 'School Data', url: '/api/v1/schools', status: 'Online', uptime: '99,8%', avgResponse: '280 ms', lastChecked: '20 Okt 2026, 10:24', method: 'REST / JSON', rateLimit: '25.000 req/min' },
    { id: 4, name: 'Student Data', url: '/api/v1/students', status: 'Online', uptime: '99,5%', avgResponse: '340 ms', lastChecked: '20 Okt 2026, 10:24', method: 'REST / JSON', rateLimit: '20.000 req/min' },
    { id: 5, name: 'Teacher Data', url: '/api/v1/teachers', status: 'Online', uptime: '99,7%', avgResponse: '260 ms', lastChecked: '20 Okt 2026, 10:24', method: 'REST / JSON', rateLimit: '20.000 req/min' },
    { id: 6, name: 'University Data', url: '/api/v1/universities', status: 'Online', uptime: '99,8%', avgResponse: '290 ms', lastChecked: '20 Okt 2026, 10:24', method: 'REST / JSON', rateLimit: '15.000 req/min' },
    { id: 7, name: 'Geospatial Service', url: '/api/v1/geo', status: 'Online', uptime: '99,4%', avgResponse: '520 ms', lastChecked: '20 Okt 2026, 10:24', method: 'GeoJSON / WMS', rateLimit: '10.000 req/min' },
    { id: 8, name: 'Statistics Service', url: '/api/v1/statistics', status: 'Online', uptime: '99,6%', avgResponse: '410 ms', lastChecked: '20 Okt 2026, 10:24', method: 'Aggregation API', rateLimit: '15.000 req/min' },
    { id: 9, name: 'Reports Service', url: '/api/v1/reports', status: 'Degraded', uptime: '98,2%', avgResponse: '1.2 s', lastChecked: '20 Okt 2026, 10:24', method: 'PDF / XLSX Stream', rateLimit: '5.000 req/min' },
    { id: 10, name: 'Notification Service', url: '/api/v1/notifications', status: 'Down', uptime: '95,1%', avgResponse: '-', lastChecked: '20 Okt 2026, 10:20', method: 'SSE / Webhook', rateLimit: '30.000 req/min' },
  ];

  // Datasets table conforming to screenshot + enriched fields
  const datasets = [
    { id: 1, name: 'Institusi Pendidikan', category: 'Master Data', count: '125.482', updated: '20 Okt 2026, 08:12', status: 'Updated', size: '480 MB', syncSchedule: 'Tiap 6 Jam', source: 'Dapodik Kemendikdasmen', icon: '🏛️' },
    { id: 2, name: 'Peserta Didik', category: 'Statistik', count: '42.560.321', updated: '20 Okt 2026, 08:10', status: 'Updated', size: '1.2 GB', syncSchedule: 'Tiap 1 Jam', source: 'Pusdatin Kemendikbud', icon: '👥' },
    { id: 3, name: 'Tenaga Pendidik', category: 'Statistik', count: '2.843.921', updated: '20 Okt 2026, 07:55', status: 'Updated', size: '320 MB', syncSchedule: 'Tiap 3 Jam', source: 'SIMPKB & BKN', icon: '👤' },
    { id: 4, name: 'Universitas & PT', category: 'Master Data', count: '3.216', updated: '19 Okt 2026, 23:45', status: 'Updated', size: '85 MB', syncSchedule: 'Harian (00:00)', source: 'PD-Dikti', icon: '🎓' },
    { id: 5, name: 'Kurikulum', category: 'Referensi', count: '1.862', updated: '19 Okt 2026, 21:30', status: 'Updated', size: '18 MB', syncSchedule: 'Mingguan', source: 'BSKAP Kemendikbud', icon: '📖' },
    { id: 6, name: 'Peta & Geospasial', category: 'Geospasial', count: '34 Provinsi', updated: '20 Okt 2026, 06:15', status: 'Updated', size: '640 MB', syncSchedule: 'Tiap 12 Jam', source: 'Badan Informasi Geospasial', icon: '🗺️' },
    { id: 7, name: 'Kalender Akademik', category: 'Referensi', count: '452', updated: '18 Okt 2026, 18:42', status: 'Delayed', size: '4.2 MB', syncSchedule: 'Bulanan', source: 'Dinas Pendidikan Provinsi', icon: '📅' },
    { id: 8, name: 'Program & Beasiswa', category: 'Program', count: '1.024', updated: '20 Okt 2026, 09:20', status: 'Updated', size: '42 MB', syncSchedule: 'Tiap 2 Jam', source: 'Puslapdik / PIP', icon: '💼' },
  ];

  // Donut data for status
  const donutStatusData = [
    { name: 'Online', value: 22, color: '#10B981', pct: '91,7%' },
    { name: 'Degraded', value: 1, color: '#F59E0B', pct: '4,2%' },
    { name: 'Down', value: 1, color: '#EF4444', pct: '4,2%' },
  ];

  // System logs
  const logs = [
    { id: 'LOG-8941', time: '20 Okt 2026, 10:24', level: 'INFO', service: 'Education Core', msg: 'Request completed (200) - Endpoint /api/v1/education/stats', traceId: 'tr-8f4b11c9', ip: '10.244.0.12' },
    { id: 'LOG-8940', time: '20 Okt 2026, 10:23', level: 'WARN', service: 'Reports Service', msg: 'Response time high (1.2s) - Query latency on aggregation', traceId: 'tr-990a21d4', ip: '10.244.1.84' },
    { id: 'LOG-8939', time: '20 Okt 2026, 10:20', level: 'ERROR', service: 'Notification Service', msg: 'Connection timeout - Upstream webhook endpoint unreachable (504)', traceId: 'tr-71e490fa', ip: '10.244.2.19' },
    { id: 'LOG-8938', time: '20 Okt 2026, 10:19', level: 'INFO', service: 'Student Data', msg: 'Data synced successfully - 42.560.321 records verified', traceId: 'tr-32d84711', ip: '10.244.0.95' },
    { id: 'LOG-8937', time: '20 Okt 2026, 10:15', level: 'INFO', service: 'Geospatial Service', msg: 'Cache refreshed - 34 province GeoJSON boundaries re-cached', traceId: 'tr-66a192bb', ip: '10.244.1.10' },
    { id: 'LOG-8936', time: '20 Okt 2026, 10:12', level: 'WARN', service: 'School Data', msg: 'Slow query detected on NPSN indexing (840 ms)', traceId: 'tr-11c523ab', ip: '10.244.0.44' },
    { id: 'LOG-8935', time: '20 Okt 2026, 10:08', level: 'INFO', service: 'Auth Service', msg: 'Token issued for SSO Pusdatin Client Gateway', traceId: 'tr-55d8919e', ip: '10.244.3.02' },
    { id: 'LOG-8934', time: '20 Okt 2026, 10:02', level: 'INFO', service: 'Statistics Service', msg: 'Hourly aggregated metrics generated into Redis cache', traceId: 'tr-22b740aa', ip: '10.244.2.61' },
  ];

  // Update History / ETL Jobs
  const updateHistories = [
    { id: 'JOB-20261020-01', time: '20 Okt 2026, 10:00', dataset: 'Peserta Didik', type: 'ETL Auto-Sync', records: '42.560.321', duration: '48 detik', status: 'Sukses', executor: 'Airflow Scheduler' },
    { id: 'JOB-20261020-02', time: '20 Okt 2026, 09:30', dataset: 'Institusi Pendidikan', type: 'Incremental Sync', records: '1.240', duration: '12 detik', status: 'Sukses', executor: 'Dapodik Webhook' },
    { id: 'JOB-20261020-03', time: '20 Okt 2026, 09:20', dataset: 'Program & Beasiswa', type: 'API Pull', records: '1.024', duration: '18 detik', status: 'Sukses', executor: 'Puslapdik Worker' },
    { id: 'JOB-20261020-04', time: '20 Okt 2026, 07:55', dataset: 'Tenaga Pendidik', type: 'Batch Sync', records: '2.843.921', duration: '34 detik', status: 'Sukses', executor: 'SIMPKB Job' },
    { id: 'JOB-20261020-05', time: '20 Okt 2026, 06:15', dataset: 'Peta & Geospasial', type: 'Boundary Refresh', records: '34 Wilayah', duration: '22 detik', status: 'Sukses', executor: 'Geo Worker' },
    { id: 'JOB-20261019-06', time: '19 Okt 2026, 23:45', dataset: 'Universitas & PT', type: 'Daily Snapshot', records: '3.216', duration: '15 detik', status: 'Sukses', executor: 'PD-Dikti Sync' },
    { id: 'JOB-20261018-07', time: '18 Okt 2026, 18:42', dataset: 'Kalender Akademik', type: 'Manual Trigger', records: '452', duration: '4 detik', status: 'Tertunda', executor: 'Admin Dinas' },
  ];

  // Webhooks and Integrations
  const integrations = [
    { id: 1, name: 'Pusdatin Kemendikdasmen', type: 'REST API & Webhook', endpoint: 'https://api.kemdikbud.go.id/v2/dapodik/push', status: 'Aktif', successRate: '99,8%', events: 'sekolah.update, siswa.sync', latency: '120 ms' },
    { id: 2, name: 'PD-Dikti (Pangkalan Data PT)', type: 'Scheduled REST Sync', endpoint: 'https://pddikti-sync.kemdiktisaintek.go.id/v1/feeder', status: 'Aktif', successRate: '99,6%', events: 'kampus.sync, prodi.update', latency: '195 ms' },
    { id: 3, name: 'Badan Kepegawaian Negara (BKN)', type: 'OAuth2 REST Gateway', endpoint: 'https://siasn.bkn.go.id/api/asn/guru', status: 'Aktif', successRate: '99,2%', events: 'guru.sertifikasi, pns.mutasi', latency: '240 ms' },
    { id: 4, name: 'DTKS Kemensos (Validasi PIP)', type: 'Webhook Consumer', endpoint: 'https://dtks.kemensos.go.id/integrasi/eduatlas', status: 'Aktif', successRate: '99,5%', events: 'pip.verifikasi, siswa.bansos', latency: '210 ms' },
    { id: 5, name: 'Badan Informasi Geospasial (BIG)', type: 'WMS / GeoJSON Service', endpoint: 'https://tanahair.indonesia.go.id/geoserver/wms', status: 'Aktif', successRate: '99,9%', events: 'wilayah.batas, batas.kabupaten', latency: '310 ms' },
    { id: 6, name: 'BAN-PDM (Badan Akreditasi)', type: 'Webhook Consumer', endpoint: 'https://banpdm.kemdikbud.go.id/api/webhook/status', status: 'Aktif', successRate: '99,4%', events: 'akreditasi.update', latency: '180 ms' },
    { id: 7, name: 'Satu Data Indonesia (SDI Portal)', type: 'CKAN OpenData Sync', endpoint: 'https://data.go.id/api/3/action/package_update', status: 'Aktif', successRate: '99,7%', events: 'dataset.publish', latency: '280 ms' },
    { id: 8, name: 'Notification Gateway (SMS/WA)', type: 'Event Dispatcher', endpoint: 'https://notify.edualas.id/webhook/send', status: 'Degraded', successRate: '96,1%', events: 'alert.downtime, sync.fail', latency: '650 ms' },
  ];

  // Infrastructure nodes
  const envNodes = [
    { name: 'API Gateway (Kong / NGINX)', role: 'Ingress Controller', ip: '10.244.0.1', cpu: '22%', memory: '42%', status: 'Healthy', region: 'JKT-DC1' },
    { name: 'Primary Database (PostgreSQL 16)', role: 'Primary Node (Read/Write)', ip: '10.244.1.10', cpu: '38%', memory: '68%', status: 'Healthy', region: 'JKT-DC1' },
    { name: 'Replica Database (PostgreSQL 16)', role: 'Standby Replica (Read-Only)', ip: '10.244.1.11', cpu: '18%', memory: '54%', status: 'Healthy', region: 'JKT-DC1' },
    { name: 'Caching Cluster (Redis 7.2)', role: 'Distributed Memory Cache', ip: '10.244.2.20', cpu: '14%', memory: '34%', status: 'Healthy', region: 'JKT-DC1' },
    { name: 'Search & Log Engine (OpenSearch)', role: 'Analytics & Full-text Search', ip: '10.244.3.30', cpu: '28%', memory: '62%', status: 'Healthy', region: 'JKT-DC1' },
    { name: 'Object Storage (MinIO S3)', role: 'Asset & Backup Storage', ip: '10.244.4.40', cpu: '11%', memory: '29%', status: 'Healthy', region: 'JKT-DC1' },
  ];

  // Helper for Status Pill badge
  const getStatusPill = (status: string) => {
    switch (status) {
      case 'Online':
      case 'Updated':
      case 'Sukses':
      case 'Aktif':
      case 'Healthy':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DEF7EC] text-[#03543F]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            {status}
          </span>
        );
      case 'Degraded':
      case 'Delayed':
      case 'Tertunda':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEF3C7] text-[#92400E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            {status}
          </span>
        );
      case 'Down':
      case 'Gagal':
      case 'Error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDE8E8] text-[#9B1C1C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getLogLevelBadge = (lvl: string) => {
    switch (lvl) {
      case 'INFO':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E1EFFE] text-[#1E429F]">INFO</span>;
      case 'WARN':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FEF3C7] text-[#92400E]">WARN</span>;
      case 'ERROR':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FDE8E8] text-[#9B1C1C]">ERROR</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-700">{lvl}</span>;
    }
  };

  // Filtered API services
  const filteredApiServices = useMemo(() => {
    return apiServices.filter((svc) => {
      const matchSearch =
        svc.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        svc.url.toLowerCase().includes(serviceSearch.toLowerCase());
      const matchStatus =
        serviceStatusFilter === 'Semua Status' || svc.status === serviceStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [apiServices, serviceSearch, serviceStatusFilter]);

  // Filtered Datasets
  const filteredDatasets = useMemo(() => {
    return datasets.filter((d) => {
      const matchCat =
        datasetCategoryFilter === 'Semua Kategori' || d.category === datasetCategoryFilter;
      const matchSearch =
        d.name.toLowerCase().includes(datasetSearch.toLowerCase()) ||
        d.category.toLowerCase().includes(datasetSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [datasets, datasetCategoryFilter, datasetSearch]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchLevel = logLevelFilter === 'Semua Level' || l.level === logLevelFilter;
      const matchService = logServiceFilter === 'Semua Service' || l.service === logServiceFilter;
      const matchSearch =
        l.msg.toLowerCase().includes(logSearch.toLowerCase()) ||
        l.service.toLowerCase().includes(logSearch.toLowerCase()) ||
        l.traceId.toLowerCase().includes(logSearch.toLowerCase());
      return matchLevel && matchService && matchSearch;
    });
  }, [logs, logLevelFilter, logServiceFilter, logSearch]);

  // Filtered Update History
  const filteredHistories = useMemo(() => {
    return updateHistories.filter((h) => {
      if (historyStatusFilter === 'Semua Status') return true;
      return h.status === historyStatusFilter;
    });
  }, [updateHistories, historyStatusFilter]);

  // Dynamic KPI Card Values per activeTab
  const kpiData = useMemo(() => {
    switch (activeTab) {
      case 'Data Status':
        return [
          { title: 'Total Dataset Aktif', val: '12', sub1: '100% Terdaftar', sub2: 'Terpusat', icon: <Database className="w-5 h-5" />, bgIcon: 'bg-[#EBF7FD] text-[#0284C7]' },
          { title: 'Total Rekod Data', val: '170,8 Juta', sub1: 'Master & Statistik', sub2: 'Dapodik & PD-Dikti', icon: <Layers className="w-5 h-5" />, bgIcon: 'bg-[#EBF7FD] text-[#0284C7]' },
          { title: 'Dataset Terkini', val: '11 Updated', sub1: '1 Delayed (Kalender)', sub2: '91,7% Siap', icon: <CheckCircle2 className="w-5 h-5" />, bgIcon: 'bg-[#DEF7EC] text-[#059669]' },
          { title: 'Frekuensi Sync', val: '1 Jam', sub1: 'Rata-rata Siklus', sub2: 'Airflow Pipeline', icon: <Clock className="w-5 h-5" />, bgIcon: 'bg-[#E6F8F6] text-[#0D9488]' },
          { title: 'Kapasitas Storage', val: '2,4 TB', sub1: 'PostgreSQL & MinIO', sub2: 'Terkompresi LZ4', icon: <HardDrive className="w-5 h-5" />, bgIcon: 'bg-[#FEF9EE] text-[#F59E0B]' },
        ];
      case 'Data Quality':
        return [
          { title: 'Skor Kualitas Rata-rata', val: '95,4%', sub1: '↑ +0,8% dari bulan lalu', sub2: 'Sangat Baik', icon: <Sparkles className="w-5 h-5" />, bgIcon: 'bg-[#DEF7EC] text-[#059669]' },
          { title: 'Kelengkapan Kolom', val: '98,2%', sub1: 'Lulus Ambang 95%', sub2: '12 Dataset', icon: <CheckCircle2 className="w-5 h-5" />, bgIcon: 'bg-[#EBF7FD] text-[#0284C7]' },
          { title: 'Validitas Format Data', val: '96,4%', sub1: 'Standar Kemendagri', sub2: 'NIK / NPSN Sesuai', icon: <ShieldCheck className="w-5 h-5" />, bgIcon: 'bg-[#E6F8F6] text-[#0D9488]' },
          { title: 'Konsistensi Referensi', val: '94,7%', sub1: 'Relasi Foreign Key', sub2: 'Terverifikasi', icon: <Layers className="w-5 h-5" />, bgIcon: 'bg-[#EBF7FD] text-[#0284C7]' },
          { title: 'Duplikasi Rekod', val: '0,12%', sub1: 'Sangat Rendah (Aman)', sub2: 'Deduplikasi Otomatis', icon: <Shield className="w-5 h-5" />, bgIcon: 'bg-[#FEF9EE] text-[#F59E0B]' },
        ];
      case 'Update History':
        return [
          { title: 'Total Job Eksekusi', val: '148 Job', sub1: '24 Jam Terakhir', sub2: 'Automated Pipeline', icon: <RotateCcw className="w-5 h-5" />, bgIcon: 'bg-[#EBF7FD] text-[#0284C7]' },
          { title: 'Tingkat Keberhasilan', val: '99,3%', sub1: '147 Sukses', sub2: '1 Tertunda', icon: <CheckCircle2 className="w-5 h-5" />, bgIcon: 'bg-[#DEF7EC] text-[#059669]' },
          { title: 'Durasi Rata-rata Job', val: '42 Detik', sub1: 'Optimal (Target < 60s)', sub2: 'Batch Stream', icon: <Clock className="w-5 h-5" />, bgIcon: 'bg-[#E6F8F6] text-[#0D9488]' },
          { title: 'Rekod Diproses', val: '46,8 Juta', sub1: 'Hari Ini', sub2: 'Delta Syncing', icon: <Database className="w-5 h-5" />, bgIcon: 'bg-[#EBF7FD] text-[#0284C7]' },
          { title: 'Job Gagal / Retry', val: '0 Kritis', sub1: 'Auto-retry Berhasil', sub2: 'Zero Data Loss', icon: <ShieldCheck className="w-5 h-5" />, bgIcon: 'bg-[#FEF9EE] text-[#F59E0B]' },
        ];
      case 'System Logs':
        return [
          { title: 'Total Peristiwa Log', val: '142.580', sub1: '24 Jam Terakhir', sub2: 'Elasticsearch', icon: <FileText className="w-5 h-5" />, bgIcon: 'bg-[#EBF7FD] text-[#0284C7]' },
          { title: 'Tingkat Error', val: '0,04%', sub1: '↓ Sangat Rendah', sub2: 'Batas Toleransi 1%', icon: <AlertTriangle className="w-5 h-5" />, bgIcon: 'bg-[#DEF7EC] text-[#059669]' },
          { title: 'Peringatan (Warning)', val: '18 Event', sub1: 'Latency Spike / Retrying', sub2: 'Terkontrol', icon: <AlertTriangle className="w-5 h-5" />, bgIcon: 'bg-[#FEF9EE] text-[#F59E0B]' },
          { title: 'Latensi Ingestion', val: '4 ms', sub1: 'Real-time Buffer', sub2: 'Fluentd Stream', icon: <Zap className="w-5 h-5" />, bgIcon: 'bg-[#E6F8F6] text-[#0D9488]' },
          { title: 'Masa Retensi Log', val: '30 Hari', sub1: 'Audit Trail Tersedia', sub2: 'Terarsip S3', icon: <Clock className="w-5 h-5" />, bgIcon: 'bg-[#EBF7FD] text-[#0284C7]' },
        ];
      case 'Webhook & Integration':
        return [
          { title: 'Integrasi Eksternal', val: '8 Sistem', sub1: 'Pusdatin, BKN, BIG', sub2: '100% Terhubung', icon: <Globe className="w-5 h-5" />, bgIcon: 'bg-[#EBF7FD] text-[#0284C7]' },
          { title: 'Webhook Dispatched', val: '38.410', sub1: '24 Jam Terakhir', sub2: 'Event Driven', icon: <Wifi className="w-5 h-5" />, bgIcon: 'bg-[#DEF7EC] text-[#059669]' },
          { title: 'Sukses Pengiriman', val: '99,7%', sub1: '↑ 0,2% thd target', sub2: 'HTTP 200/201', icon: <CheckCircle2 className="w-5 h-5" />, bgIcon: 'bg-[#E6F8F6] text-[#0D9488]' },
          { title: 'Antrean Retry', val: '0 Pending', sub1: 'Queue Bersih', sub2: 'Redis Backing', icon: <ShieldCheck className="w-5 h-5" />, bgIcon: 'bg-[#EBF7FD] text-[#0284C7]' },
          { title: 'Rata-rata Latensi', val: '185 ms', sub1: 'SLA < 500 ms', sub2: 'Respon Cepat', icon: <Clock className="w-5 h-5" />, bgIcon: 'bg-[#FEF9EE] text-[#F59E0B]' },
        ];
      case 'Environment':
        return [
          { title: 'Status Kluster Server', val: 'Operational', sub1: '6 Node Aktif', sub2: 'Zero Outage', icon: <Server className="w-5 h-5" />, bgIcon: 'bg-[#DEF7EC] text-[#059669]' },
          { title: 'Penggunaan CPU', val: '24% Avg', sub1: 'Beban Normal', sub2: '32 Core Tersedia', icon: <Cpu className="w-5 h-5" />, bgIcon: 'bg-[#EBF7FD] text-[#0284C7]' },
          { title: 'Penggunaan RAM', val: '58%', sub1: '37.1 GB / 64 GB', sub2: 'Optimal Buffer', icon: <HardDrive className="w-5 h-5" />, bgIcon: 'bg-[#E6F8F6] text-[#0D9488]' },
          { title: 'Ruang Disk Tersedia', val: '1,8 TB', sub1: 'Dari 4,0 TB SSD', sub2: '45% Terpakai', icon: <HardDrive className="w-5 h-5" />, bgIcon: 'bg-[#EBF7FD] text-[#0284C7]' },
          { title: 'Sertifikat SSL/TLS', val: 'Valid', sub1: '280 Hari Tersisa', sub2: 'Let’s Encrypt / TLS 1.3', icon: <Lock className="w-5 h-5" />, bgIcon: 'bg-[#DEF7EC] text-[#059669]' },
        ];
      default:
        // Default: API Status (screenshot match)
        return [
          { title: 'Total API Endpoints', val: '24', sub1: '22 Online', sub2: '2 Down', icon: <Code className="w-5 h-5" />, bgIcon: 'bg-[#EBF7FD] text-[#0284C7]' },
          { title: 'Total Datasets', val: '12', sub1: '11 Updated', sub2: '1 Delayed', icon: <Database className="w-5 h-5" />, bgIcon: 'bg-[#EBF7FD] text-[#0284C7]' },
          { title: 'Terakhir Diperbarui', val: '20 Okt 2026', sub1: '↑ 2 jam yang lalu', sub2: '', icon: <RotateCcw className="w-5 h-5" />, bgIcon: 'bg-[#E6F8F6] text-[#0D9488]' },
          { title: 'Uptime API', val: '99,6%', sub1: '↑ +0,3%', sub2: 'dari bulan lalu', icon: <ShieldCheck className="w-5 h-5" />, bgIcon: 'bg-[#DEF7EC] text-[#059669]' },
          { title: 'Rata-rata Response Time', val: '312 ms', sub1: '↓ -18%', sub2: 'dari bulan lalu', icon: <Clock className="w-5 h-5" />, bgIcon: 'bg-[#FEF9EE] text-[#F59E0B]' },
        ];
    }
  }, [activeTab]);

  // Contextual Banner description
  const tabDescription = useMemo(() => {
    switch (activeTab) {
      case 'Data Status':
        return 'Katalog dan siklus pembaruan dataset utama nasional: jumlah rekod, kapasitas storage, jadwal sinkronisasi, dan status ketersediaan.';
      case 'Data Quality':
        return 'Evaluasi komprehensif kualitas data pendidikan berdasarkan 4 pilar: kelengkapan data, validitas format, konsistensi relasi, dan reduksi duplikasi.';
      case 'Update History':
        return 'Audit trail dan riwayat eksekusi job sinkronisasi (ETL Pipeline), volume pemrosesan data, durasi batch, serta status keberhasilan.';
      case 'System Logs':
        return 'Pusat pemantauan log transaksi dan peristiwa sistem secara mendalam, audit trace ID, peringatan latensi, dan investigasi error runtime.';
      case 'Webhook & Integration':
        return 'Manajemen titik integrasi antarsistem nasional (Dapodik Kemendikdasmen, PD-Dikti, BKN, DTKS Kemensos, BIG, dan BAN-PDM).';
      case 'Environment':
        return 'Informasi kesehatan arsitektur server, utilisasi komputasi CPU & RAM, database cluster, caching Redis, dan sertifikat keamanan TLS.';
      default:
        return 'Pantau kesehatan API, status dataset, kualitas data, dan aktivitas pembaruan EduAtlas secara real-time.';
    }
  }, [activeTab]);

  return (
    <div className="space-y-5">
      {/* 1. Page Header */}
      <PageHeader
        title="API & Data Status"
        subtitle="Pantau kesehatan API, status dataset, kualitas data, dan aktivitas pembaruan EduAtlas secara real-time."
      />

      {/* 2. Top Category Pills Strip (Standard Navy #0F2942 & rounded-xl) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          'API Status',
          'Data Status',
          'Data Quality',
          'Update History',
          'System Logs',
          'Webhook & Integration',
          'Environment',
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as StatusTab)}
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

      {/* 3. Contextual Tab Focus Banner */}
      <div className="bg-gradient-to-r from-[#F0F7FF] via-[#E6F8F6] to-white border border-[#DCE5EF] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0F2942] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Activity className="w-4 h-4 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">
                Fokus Tampilan: {activeTab}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#25A9A1] text-white">
                Aktif
              </span>
            </div>
            <p className="text-xs text-[#526579] mt-0.5">{tabDescription}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#DCE5EF] text-[#172B4D] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            Live Sync: 20 Okt 2026, 10:24 WIB
          </span>
        </div>
      </div>

      {/* 4. 5 KPI Status Cards Row (Adaptable per activeTab) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiData.map((kpi, index) => (
          <div
            key={kpi.title}
            className="bg-white border border-[#DCE5EF] rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-[#25A9A1] transition-all"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl ${kpi.bgIcon}`}>
                {kpi.icon}
              </div>
              <span className="text-gray-400 text-sm font-bold">#{index + 1}</span>
            </div>
            <div className="mt-2">
              <div className="text-[11px] font-medium text-[#526579]">{kpi.title}</div>
              <div className="text-2xl font-bold text-[#172B4D] font-heading mt-0.5">{kpi.val}</div>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {kpi.sub1 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DEF7EC] text-[#03543F]">
                    {kpi.sub1}
                  </span>
                )}
                {kpi.sub2 && (
                  <span className="text-[10px] font-medium text-gray-500">
                    {kpi.sub2}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. TAB-SPECIFIC CONTENT VIEWS */}

      {/* TAB 1: API STATUS (Screenshot Exact Layout) */}
      {activeTab === 'API Status' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: API Services & Datasets (~7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Box 1: Status API Services */}
            <div className="bg-white border border-[#DCE5EF] rounded-xl p-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0F4F8]">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[#0284C7]" />
                    <h3 className="text-xs font-bold text-[#172B4D]">Status API Services</h3>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Kesehatan dan performa seluruh layanan API EduAtlas.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#F5F8FC] border border-[#DCE5EF] rounded-lg px-2 py-1 text-xs">
                    <Search className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                    <input
                      type="text"
                      placeholder="Cari service atau endpoint..."
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="bg-transparent border-none outline-none text-[#172B4D] text-[11px] w-36"
                    />
                  </div>

                  <select
                    value={serviceStatusFilter}
                    onChange={(e) => setServiceStatusFilter(e.target.value)}
                    className="bg-[#F5F8FC] border border-[#DCE5EF] text-[11px] font-semibold rounded-lg px-2 py-1 text-[#172B4D] outline-none cursor-pointer"
                  >
                    <option>Semua Status</option>
                    <option>Online</option>
                    <option>Degraded</option>
                    <option>Down</option>
                  </select>

                  <button
                    onClick={() => {
                      setServiceSearch('');
                      setServiceStatusFilter('Semua Status');
                    }}
                    className="p-1.5 bg-white border border-[#DCE5EF] rounded-lg text-gray-500 hover:bg-gray-50 cursor-pointer"
                    title="Reset Filter"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#EDF2F7] text-[10px] text-[#526579] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-2 w-6 text-center">#</th>
                      <th className="py-2.5 px-2">Service / Endpoint</th>
                      <th className="py-2.5 px-2">Base URL</th>
                      <th className="py-2.5 px-2 text-center">Status</th>
                      <th className="py-2.5 px-2 text-right">Uptime (30d)</th>
                      <th className="py-2.5 px-2 text-right">Avg. Response</th>
                      <th className="py-2.5 px-2">Last Checked</th>
                      <th className="py-2.5 px-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9] text-[11px]">
                    {filteredApiServices.map((svc) => (
                      <tr
                        key={svc.id}
                        onClick={() =>
                          setSelectedModal({
                            type: 'service',
                            title: svc.name,
                            badge: svc.status,
                            badgeColor: svc.status === 'Online' ? '#10B981' : svc.status === 'Degraded' ? '#F59E0B' : '#EF4444',
                            description: `Layanan microservice resmi untuk ${svc.name} dalam infrastruktur EduAtlas v2.0.`,
                            details: [
                              { label: 'Base URL Endpoint', value: svc.url },
                              { label: 'Status Kesehatan', value: svc.status },
                              { label: 'Tingkat Ketersediaan (Uptime)', value: svc.uptime },
                              { label: 'Rata-rata Respon Latensi', value: svc.avgResponse },
                              { label: 'Metode & Format Protokol', value: svc.method },
                              { label: 'Ambang Rate Limiting', value: svc.rateLimit },
                              { label: 'Pemeriksaan Terakhir', value: svc.lastChecked },
                            ],
                            codeSnippet: `curl -X GET "https://api.eduatlas.id${svc.url}" -H "Authorization: Bearer <TOKEN>"`,
                          })
                        }
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="py-2 px-2 text-center text-gray-400 font-semibold">{svc.id}</td>
                        <td className="py-2 px-2 font-bold text-[#172B4D]">{svc.name}</td>
                        <td className="py-2 px-2 font-mono text-[10px] text-gray-500">{svc.url}</td>
                        <td className="py-2 px-2 text-center">{getStatusPill(svc.status)}</td>
                        <td className="py-2 px-2 text-right font-medium text-[#172B4D]">{svc.uptime}</td>
                        <td className="py-2 px-2 text-right font-medium text-[#172B4D]">{svc.avgResponse}</td>
                        <td className="py-2 px-2 text-gray-500 text-[10px]">{svc.lastChecked}</td>
                        <td className="py-2 px-2 text-center text-gray-400">
                          <MoreHorizontal className="w-3.5 h-3.5 mx-auto cursor-pointer hover:text-gray-600" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Box 2: Status Dataset */}
            <div className="bg-white border border-[#DCE5EF] rounded-xl p-4 shadow-xs">
              <div className="pb-3 border-b border-[#F0F4F8] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-[#0284C7]" />
                    <h3 className="text-xs font-bold text-[#172B4D]">Status Dataset</h3>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Ketersediaan dan pembaruan dataset utama EduAtlas.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('Data Status')}
                  className="text-xs font-semibold text-[#0284C7] hover:underline cursor-pointer"
                >
                  Buka Data Status →
                </button>
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#EDF2F7] text-[10px] text-[#526579] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-2 w-6 text-center">#</th>
                      <th className="py-2.5 px-2">Nama Dataset</th>
                      <th className="py-2.5 px-2">Kategori</th>
                      <th className="py-2.5 px-2 text-right">Jumlah Data</th>
                      <th className="py-2.5 px-2">Terakhir Diperbarui</th>
                      <th className="py-2.5 px-2 text-center">Status</th>
                      <th className="py-2.5 px-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9] text-[11px]">
                    {datasets.map((d) => (
                      <tr
                        key={d.id}
                        onClick={() =>
                          setSelectedModal({
                            type: 'dataset',
                            title: d.name,
                            badge: d.status,
                            badgeColor: d.status === 'Updated' ? '#10B981' : '#F59E0B',
                            description: `Katalog dataset resmi untuk entitas ${d.name} dalam basis data nasional EduAtlas.`,
                            details: [
                              { label: 'Kategori Data', value: d.category },
                              { label: 'Jumlah Baris Rekod', value: d.count },
                              { label: 'Ukuran Penyimpanan', value: d.size },
                              { label: 'Siklus Pembaruan', value: d.syncSchedule },
                              { label: 'Sumber Data Asal', value: d.source },
                              { label: 'Waktu Update Terakhir', value: d.updated },
                            ],
                            codeSnippet: `SELECT COUNT(*) FROM eduatlas_analytics.${d.name.toLowerCase().replace(/[^a-z0-9]/g, '_')};`,
                          })
                        }
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="py-2 px-2 text-center text-gray-400 font-semibold">{d.id}</td>
                        <td className="py-2 px-2 font-bold text-[#172B4D]">
                          <span className="mr-1.5">{d.icon}</span>
                          {d.name}
                        </td>
                        <td className="py-2 px-2 text-gray-500">{d.category}</td>
                        <td className="py-2 px-2 text-right font-bold text-[#172B4D]">{d.count}</td>
                        <td className="py-2 px-2 text-gray-500 text-[10px]">{d.updated}</td>
                        <td className="py-2 px-2 text-center">{getStatusPill(d.status)}</td>
                        <td className="py-2 px-2 text-center text-gray-400">
                          <MoreHorizontal className="w-3.5 h-3.5 mx-auto cursor-pointer hover:text-gray-600" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Response Chart, Donut Status, Gauges, Logs (~5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Card 1: Response Time (24 Jam Terakhir) */}
            <div className="bg-white border border-[#DCE5EF] rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F4F8]">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">📈</span>
                  <h4 className="text-xs font-bold text-[#172B4D]">Response Time (24 Jam Terakhir)</h4>
                </div>
                <select className="bg-[#F5F8FC] border border-[#DCE5EF] text-[10px] font-semibold rounded px-1.5 py-0.5 outline-none text-[#172B4D] cursor-pointer">
                  <option>Semua Service</option>
                  <option>Auth</option>
                  <option>Education</option>
                  <option>School</option>
                  <option>Student</option>
                  <option>Reports</option>
                </select>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 pt-2 text-[10px] font-semibold flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3B82F6]" />Auth</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10B981]" />Education</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" />School</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#EF4444]" />Student</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />Reports</span>
              </div>

              <div className="h-44 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTimeData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#526579' }} />
                    <YAxis tick={{ fontSize: 9, fill: '#526579' }} tickFormatter={(v) => `${v} ms`} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Auth" stroke="#3B82F6" strokeWidth={1.5} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="Education" stroke="#10B981" strokeWidth={1.5} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="School" stroke="#F59E0B" strokeWidth={1.5} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="Student" stroke="#EF4444" strokeWidth={1.5} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="Reports" stroke="#8B5CF6" strokeWidth={1.5} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 2: Distribusi Status API */}
            <div className="bg-white border border-[#DCE5EF] rounded-xl p-4 shadow-xs">
              <div className="flex items-center gap-1.5 pb-2 border-b border-[#F0F4F8]">
                <span className="text-sm">📊</span>
                <h4 className="text-xs font-bold text-[#172B4D]">Distribusi Status API</h4>
              </div>

              <div className="flex items-center justify-between gap-2 mt-2">
                <div className="relative w-24 h-24 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={28}
                        outerRadius={42}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {donutStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-xs font-bold text-[#172B4D] leading-tight">24</span>
                    <span className="text-[8px] text-gray-400">Endpoints</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-medium shrink-0">
                  {donutStatusData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-[#172B4D]">{d.name}</span>
                      </span>
                      <div className="flex items-center gap-1 text-gray-500 font-semibold">
                        <span>{d.value}</span>
                        <span className="text-gray-400 text-[10px]">{d.pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Data Quality Overview */}
            <div className="bg-white border border-[#DCE5EF] rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F4F8]">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🎯</span>
                  <h4 className="text-xs font-bold text-[#172B4D]">Data Quality Overview</h4>
                </div>
                <button
                  onClick={() => setActiveTab('Data Quality')}
                  className="text-[10px] font-semibold text-[#0284C7] hover:underline cursor-pointer"
                >
                  Detail Kualitas →
                </button>
              </div>

              {/* 4 Circular gauges */}
              <div className="grid grid-cols-4 gap-2 text-center mt-3">
                {[
                  { label: 'Kelengkapan Data', val: '98,2%' },
                  { label: 'Validitas Format', val: '96,4%' },
                  { label: 'Konsistensi Referensi', val: '94,7%' },
                  { label: 'Duplikasi Rendah', val: '92,1%' },
                ].map((q) => (
                  <div key={q.label} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full border-4 border-[#25A9A1] flex items-center justify-center bg-[#F0FDF4] shadow-2xs">
                      <span className="text-[11px] font-extrabold text-[#0D9488]">{q.val}</span>
                    </div>
                    <span className="text-[9px] font-semibold text-[#526579] mt-1.5 leading-tight">
                      {q.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: System Logs (Terbaru) */}
            <div className="bg-white border border-[#DCE5EF] rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F4F8]">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#0284C7]" />
                  <h4 className="text-xs font-bold text-[#172B4D]">System Logs (Terbaru)</h4>
                </div>
                <button
                  onClick={() => setActiveTab('System Logs')}
                  className="text-[10px] font-semibold text-[#0284C7] hover:underline cursor-pointer"
                >
                  Lihat Semua →
                </button>
              </div>

              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[10px] text-[#526579] font-bold border-b border-[#EDF2F7]">
                    <tr>
                      <th className="py-1.5 px-2">Waktu</th>
                      <th className="py-1.5 px-2">Level</th>
                      <th className="py-1.5 px-2">Service</th>
                      <th className="py-1.5 px-2">Pesan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9] text-[10px]">
                    {logs.slice(0, 5).map((log, i) => (
                      <tr
                        key={i}
                        onClick={() =>
                          setSelectedModal({
                            type: 'log',
                            title: `System Event: ${log.id}`,
                            badge: log.level,
                            badgeColor: log.level === 'INFO' ? '#0284C7' : log.level === 'WARN' ? '#F59E0B' : '#EF4444',
                            description: `Detail log aktivitas transaksi pada microservice ${log.service}.`,
                            details: [
                              { label: 'Trace ID', value: log.traceId },
                              { label: 'Timestamp Waktu', value: log.time },
                              { label: 'Severity Level', value: log.level },
                              { label: 'Service Sumber', value: log.service },
                              { label: 'Origin Client IP', value: log.ip },
                              { label: 'Pesan Transaksi', value: log.msg },
                            ],
                            codeSnippet: JSON.stringify(log, null, 2),
                          })
                        }
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="py-1.5 px-2 text-gray-400 whitespace-nowrap">{log.time}</td>
                        <td className="py-1.5 px-2">{getLogLevelBadge(log.level)}</td>
                        <td className="py-1.5 px-2 font-medium text-[#172B4D] whitespace-nowrap">{log.service}</td>
                        <td className="py-1.5 px-2 text-gray-600 truncate max-w-[140px]">{log.msg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATA STATUS (Comprehensive Dataset Catalog) */}
      {activeTab === 'Data Status' && (
        <div className="space-y-5">
          <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F0F4F8]">
              <div>
                <h3 className="text-sm font-bold text-[#172B4D] flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#0284C7]" />
                  Katalog Dataset & Status Sinkronisasi Nasional
                </h3>
                <p className="text-xs text-[#526579] mt-0.5">
                  Menampilkan 12 dataset utama sistem pendidikan nasional beserta riwayat partisi dan kapasitas storage.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-[#F5F8FC] border border-[#DCE5EF] rounded-xl px-3 py-1.5 text-xs">
                  <Search className="w-3.5 h-3.5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Cari nama atau kategori..."
                    value={datasetSearch}
                    onChange={(e) => setDatasetSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-[#172B4D] text-xs w-48"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto">
                  {['Semua Kategori', 'Master Data', 'Statistik', 'Referensi', 'Geospasial', 'Program'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setDatasetCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        datasetCategoryFilter === cat
                          ? 'bg-[#0F2942] text-white shadow-xs'
                          : 'bg-white border border-[#DCE5EF] text-[#526579] hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#EDF2F7] text-[10px] text-[#526579] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-8 text-center">#</th>
                    <th className="py-3 px-3">Dataset</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3 text-right">Jumlah Rekod</th>
                    <th className="py-3 px-3 text-right">Ukuran</th>
                    <th className="py-3 px-3">Frekuensi Sync</th>
                    <th className="py-3 px-3">Sumber Data</th>
                    <th className="py-3 px-3">Terakhir Update</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-xs">
                  {filteredDatasets.map((d) => (
                    <tr
                      key={d.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() =>
                        setSelectedModal({
                          type: 'dataset',
                          title: d.name,
                          badge: d.status,
                          badgeColor: d.status === 'Updated' ? '#10B981' : '#F59E0B',
                          description: `Informasi mendalam mengenai skema dan pipeline dataset ${d.name}.`,
                          details: [
                            { label: 'Kategori Data', value: d.category },
                            { label: 'Jumlah Baris Rekod', value: d.count },
                            { label: 'Ukuran di Disk (Postgres)', value: d.size },
                            { label: 'Siklus Otomasi', value: d.syncSchedule },
                            { label: 'Otoritas Penyedia Sumber', value: d.source },
                            { label: 'Waktu Snapshot Terakhir', value: d.updated },
                            { label: 'Format Ekspor Tersedia', value: 'Parquet, CSV, GeoJSON, PostgreSQL' },
                          ],
                          codeSnippet: `-- Schema query for ${d.name}\nSELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${d.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}';`,
                        })
                      }
                    >
                      <td className="py-3 px-3 text-center text-gray-400 font-bold">{d.id}</td>
                      <td className="py-3 px-3 font-bold text-[#172B4D] flex items-center gap-2">
                        <span className="text-base">{d.icon}</span>
                        <span>{d.name}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#F1F5F9] text-[#172B4D]">
                          {d.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-[#172B4D]">{d.count}</td>
                      <td className="py-3 px-3 text-right font-semibold text-[#0284C7]">{d.size}</td>
                      <td className="py-3 px-3 text-gray-600">{d.syncSchedule}</td>
                      <td className="py-3 px-3 text-gray-600 font-medium">{d.source}</td>
                      <td className="py-3 px-3 text-gray-500 text-[11px]">{d.updated}</td>
                      <td className="py-3 px-3 text-center">{getStatusPill(d.status)}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTestPingSuccess(`Sinkronisasi dataset ${d.name} berhasil dipicu!`);
                            setTimeout(() => setTestPingSuccess(null), 3500);
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold bg-[#E6F8F6] text-[#0D9488] rounded-lg hover:bg-[#cbf1ed] transition-colors cursor-pointer"
                        >
                          Sync Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATA QUALITY (Quality Scorecard & Rules) */}
      {activeTab === 'Data Quality' && (
        <div className="space-y-5">
          {/* 4 Dimension Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Kelengkapan Data',
                score: '98,2%',
                desc: 'Seluruh field wajib (NPSN, NIK, Kode Wilayah) terisi lengkap tanpa missing values.',
                status: 'Sangat Baik',
                color: '#0284C7',
                bg: 'bg-[#E0F2FE]',
              },
              {
                title: 'Validitas Format',
                score: '96,4%',
                desc: 'Kepatuhan format angka, pola email, struktur kode pos, dan standar ISO Kemendagri.',
                status: 'Terverifikasi',
                color: '#059669',
                bg: 'bg-[#DEF7EC]',
              },
              {
                title: 'Konsistensi Referensi',
                score: '94,7%',
                desc: 'Korelasi relasional antar tabel master (Sekolah ➔ Guru ➔ Siswa) terjaga utuh.',
                status: 'Lulus Ambang',
                color: '#0D9488',
                bg: 'bg-[#E6F8F6]',
              },
              {
                title: 'Duplikasi Rendah',
                score: '92,1%',
                desc: 'Mekanisme deduplikasi otomatis mencegah rekod ganda pada peserta didik dan GTK.',
                status: 'Terkontrol',
                color: '#8B5CF6',
                bg: 'bg-[#F5F3FF]',
              },
            ].map((dim) => (
              <div key={dim.title} className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{dim.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dim.bg}`} style={{ color: dim.color }}>
                    {dim.status}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-[#172B4D] mt-2">{dim.score}</div>
                <p className="text-xs text-[#526579] mt-2 leading-relaxed">{dim.desc}</p>
                <div className="w-full bg-[#F1F5F9] h-2 rounded-full mt-3 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: dim.score, backgroundColor: dim.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Dataset Quality Scorecard Table */}
          <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#172B4D] mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              Matriks Kualitas Data per Entitas Pendidikan
            </h3>
            <p className="text-xs text-[#526579] mb-4">
              Hasil audit otomatis integritas data EduAtlas yang dieksekusi setiap malam pukul 00:00 WIB.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#EDF2F7] text-[10px] text-[#526579] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Entitas Data</th>
                    <th className="py-2.5 px-3 text-center">Kelengkapan</th>
                    <th className="py-2.5 px-3 text-center">Validitas</th>
                    <th className="py-2.5 px-3 text-center">Konsistensi</th>
                    <th className="py-2.5 px-3 text-center">Keunikan</th>
                    <th className="py-2.5 px-3 text-right">Skor Total</th>
                    <th className="py-2.5 px-3 text-center">Status Akreditasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {[
                    { name: 'Institusi Pendidikan (Sekolah)', k: '99,4%', v: '98,1%', r: '97,2%', u: '99,9%', total: '98,6%', grade: 'Grade A+' },
                    { name: 'Peserta Didik (Siswa)', k: '97,8%', v: '95,4%', r: '93,8%', u: '98,9%', total: '96,4%', grade: 'Grade A' },
                    { name: 'Tenaga Pendidik (Guru & GTK)', k: '98,2%', v: '96,7%', r: '95,1%', u: '99,5%', total: '97,3%', grade: 'Grade A+' },
                    { name: 'Perguruan Tinggi & Prodi', k: '99,1%', v: '97,8%', r: '96,5%', u: '100%', total: '98,3%', grade: 'Grade A+' },
                    { name: 'Kurikulum & Capaian', k: '96,5%', v: '94,2%', r: '92,8%', u: '98,2%', total: '95,4%', grade: 'Grade A' },
                    { name: 'Peta Geospasial Wilayah', k: '98,9%', v: '97,5%', r: '96,0%', u: '99,8%', total: '98,0%', grade: 'Grade A+' },
                  ].map((row) => (
                    <tr key={row.name} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-bold text-[#172B4D]">{row.name}</td>
                      <td className="py-3 px-3 text-center font-semibold text-[#0284C7]">{row.k}</td>
                      <td className="py-3 px-3 text-center font-semibold text-[#0D9488]">{row.v}</td>
                      <td className="py-3 px-3 text-center font-semibold text-[#8B5CF6]">{row.r}</td>
                      <td className="py-3 px-3 text-center font-semibold text-[#10B981]">{row.u}</td>
                      <td className="py-3 px-3 text-right font-extrabold text-[#172B4D]">{row.total}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DEF7EC] text-[#03543F]">
                          {row.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: UPDATE HISTORY (ETL Jobs & Audit Trail) */}
      {activeTab === 'Update History' && (
        <div className="space-y-5">
          <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0F4F8]">
              <div>
                <h3 className="text-sm font-bold text-[#172B4D] flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#0284C7]" />
                  Riwayat Eksekusi Pipeline Sinkronisasi Data (ETL)
                </h3>
                <p className="text-xs text-[#526579] mt-0.5">
                  Daftar eksekusi job otomatis Apache Airflow dan webhook ingestion dari kementerian terkait.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={historyStatusFilter}
                  onChange={(e) => setHistoryStatusFilter(e.target.value)}
                  className="bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-semibold rounded-xl px-3 py-1.5 text-[#172B4D] outline-none cursor-pointer"
                >
                  <option>Semua Status</option>
                  <option>Sukses</option>
                  <option>Tertunda</option>
                </select>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#EDF2F7] text-[10px] text-[#526579] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Job ID</th>
                    <th className="py-3 px-3">Waktu Eksekusi</th>
                    <th className="py-3 px-3">Dataset Sasaran</th>
                    <th className="py-3 px-3">Tipe Eksekusi</th>
                    <th className="py-3 px-3 text-right">Rekod Diproses</th>
                    <th className="py-3 px-3 text-right">Durasi</th>
                    <th className="py-3 px-3">Executor Pipeline</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredHistories.map((h) => (
                    <tr
                      key={h.id}
                      onClick={() =>
                        setSelectedModal({
                          type: 'log',
                          title: `Detail Job Pipeline: ${h.id}`,
                          badge: h.status,
                          badgeColor: h.status === 'Sukses' ? '#10B981' : '#F59E0B',
                          description: `Riwayat eksekusi batch synchronization untuk dataset ${h.dataset}.`,
                          details: [
                            { label: 'Job ID Pipeline', value: h.id },
                            { label: 'Waktu Mulai Eksekusi', value: h.time },
                            { label: 'Dataset Target', value: h.dataset },
                            { label: 'Metode Ingestion', value: h.type },
                            { label: 'Total Rekod Diproses', value: h.records },
                            { label: 'Durasi Komputasi', value: h.duration },
                            { label: 'Runner / Executor Engine', value: h.executor },
                            { label: 'Hasil Akhir', value: h.status },
                          ],
                        })
                      }
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3 font-mono font-bold text-[#0284C7]">{h.id}</td>
                      <td className="py-3 px-3 text-gray-500 text-[11px]">{h.time}</td>
                      <td className="py-3 px-3 font-bold text-[#172B4D]">{h.dataset}</td>
                      <td className="py-3 px-3 text-gray-600">{h.type}</td>
                      <td className="py-3 px-3 text-right font-extrabold text-[#172B4D]">{h.records}</td>
                      <td className="py-3 px-3 text-right font-medium text-gray-500">{h.duration}</td>
                      <td className="py-3 px-3 text-gray-600 font-semibold">{h.executor}</td>
                      <td className="py-3 px-3 text-center">{getStatusPill(h.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM LOGS (Full-featured Log Browser) */}
      {activeTab === 'System Logs' && (
        <div className="space-y-5">
          <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F0F4F8]">
              <div>
                <h3 className="text-sm font-bold text-[#172B4D] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0284C7]" />
                  Log Sistem & Jejak Audit Transaksi
                </h3>
                <p className="text-xs text-[#526579] mt-0.5">
                  Pemantauan real-time aktivitas microservice, trace ID, latensi kueri, dan penanganan exception.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-[#F5F8FC] border border-[#DCE5EF] rounded-xl px-3 py-1.5 text-xs">
                  <Search className="w-3.5 h-3.5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Cari pesan, trace ID..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-[#172B4D] text-xs w-44"
                  />
                </div>

                <select
                  value={logLevelFilter}
                  onChange={(e) => setLogLevelFilter(e.target.value)}
                  className="bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-semibold rounded-xl px-3 py-1.5 text-[#172B4D] outline-none cursor-pointer"
                >
                  <option>Semua Level</option>
                  <option>INFO</option>
                  <option>WARN</option>
                  <option>ERROR</option>
                </select>

                <select
                  value={logServiceFilter}
                  onChange={(e) => setLogServiceFilter(e.target.value)}
                  className="bg-[#F5F8FC] border border-[#DCE5EF] text-xs font-semibold rounded-xl px-3 py-1.5 text-[#172B4D] outline-none cursor-pointer"
                >
                  <option>Semua Service</option>
                  <option>Education Core</option>
                  <option>Reports Service</option>
                  <option>Notification Service</option>
                  <option>Student Data</option>
                  <option>Geospatial Service</option>
                  <option>School Data</option>
                  <option>Auth Service</option>
                </select>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#EDF2F7] text-[10px] text-[#526579] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Log ID</th>
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3 text-center">Level</th>
                    <th className="py-3 px-3">Service</th>
                    <th className="py-3 px-3">Trace ID</th>
                    <th className="py-3 px-3">Origin IP</th>
                    <th className="py-3 px-3">Pesan Transaksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] font-mono text-[11px]">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() =>
                        setSelectedModal({
                          type: 'log',
                          title: `Pemeriksaan Log: ${log.id}`,
                          badge: log.level,
                          badgeColor: log.level === 'INFO' ? '#0284C7' : log.level === 'WARN' ? '#F59E0B' : '#EF4444',
                          description: `Pemeriksaan detail stack trace dan payload log untuk event ${log.id}.`,
                          details: [
                            { label: 'Log ID', value: log.id },
                            { label: 'Timestamp Waktu', value: log.time },
                            { label: 'Severity Level', value: log.level },
                            { label: 'Service Sumber', value: log.service },
                            { label: 'Trace Identifier', value: log.traceId },
                            { label: 'Host IP Address', value: log.ip },
                            { label: 'Keterangan Pesan', value: log.msg },
                          ],
                          codeSnippet: JSON.stringify(
                            {
                              id: log.id,
                              timestamp: log.time,
                              level: log.level,
                              service: log.service,
                              trace_id: log.traceId,
                              ip: log.ip,
                              message: log.msg,
                              context: {
                                runtime: 'node-20-lts',
                                pod: `pod-eduatlas-${log.service.toLowerCase().replace(/\s+/g, '-')}-74f`,
                                environment: 'production-jkt1',
                              },
                            },
                            null,
                            2,
                          ),
                        })
                      }
                      className="hover:bg-gray-50 cursor-pointer font-sans"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-[#0284C7]">{log.id}</td>
                      <td className="py-2.5 px-3 text-gray-500 text-[11px] whitespace-nowrap">{log.time}</td>
                      <td className="py-2.5 px-3 text-center">{getLogLevelBadge(log.level)}</td>
                      <td className="py-2.5 px-3 font-bold text-[#172B4D] whitespace-nowrap">{log.service}</td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-gray-500">{log.traceId}</td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-gray-500">{log.ip}</td>
                      <td className="py-2.5 px-3 text-gray-700 max-w-[320px] truncate">{log.msg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: WEBHOOK & INTEGRATION (External Connectors) */}
      {activeTab === 'Webhook & Integration' && (
        <div className="space-y-5">
          <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-xs">
            <div className="pb-4 border-b border-[#F0F4F8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#172B4D] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0284C7]" />
                  Titik Integrasi & Webhook Antar-Kementerian
                </h3>
                <p className="text-xs text-[#526579] mt-0.5">
                  Konektor resmi pertukaran data antara EduAtlas dengan Satu Data Indonesia dan kementerian/lembaga terkait.
                </p>
              </div>

              {testPingSuccess && (
                <div className="px-3 py-1.5 rounded-xl bg-[#DEF7EC] text-[#03543F] text-xs font-bold border border-[#31C48D] animate-in fade-in duration-200">
                  {testPingSuccess}
                </div>
              )}
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#EDF2F7] text-[10px] text-[#526579] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Nama Mitra Integrasi</th>
                    <th className="py-3 px-3">Tipe Koneksi</th>
                    <th className="py-3 px-3">Endpoint URL</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Success Rate</th>
                    <th className="py-3 px-3 text-right">Latensi</th>
                    <th className="py-3 px-3">Event Terlanggan</th>
                    <th className="py-3 px-3 text-center">Uji Ping</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {integrations.map((itg) => (
                    <tr
                      key={itg.id}
                      onClick={() =>
                        setSelectedModal({
                          type: 'webhook',
                          title: itg.name,
                          badge: itg.status,
                          badgeColor: itg.status === 'Aktif' ? '#10B981' : '#F59E0B',
                          description: `Konektor data resmi antara EduAtlas dan ${itg.name}.`,
                          details: [
                            { label: 'Nama Lembaga / Mitra', value: itg.name },
                            { label: 'Tipe Protokol Koneksi', value: itg.type },
                            { label: 'Target Webhook URL', value: itg.endpoint },
                            { label: 'Tingkat Keberhasilan Pengiriman', value: itg.successRate },
                            { label: 'Rata-rata Waktu Latensi', value: itg.latency },
                            { label: 'Payload Events', value: itg.events },
                            { label: 'Metode Enkripsi', value: 'HMAC-SHA256 Secret Signature' },
                          ],
                          codeSnippet: `curl -X POST "${itg.endpoint}" \\\n  -H "Content-Type: application/json" \\\n  -H "X-EduAtlas-Signature: sha256=abc12345" \\\n  -d '{"event":"ping","timestamp":"2026-10-20T10:24:00Z"}'`,
                        })
                      }
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3 font-bold text-[#172B4D]">{itg.name}</td>
                      <td className="py-3 px-3 text-gray-600">{itg.type}</td>
                      <td className="py-3 px-3 font-mono text-[10px] text-gray-500 truncate max-w-[200px]">
                        {itg.endpoint}
                      </td>
                      <td className="py-3 px-3 text-center">{getStatusPill(itg.status)}</td>
                      <td className="py-3 px-3 text-right font-extrabold text-[#10B981]">{itg.successRate}</td>
                      <td className="py-3 px-3 text-right font-semibold text-[#172B4D]">{itg.latency}</td>
                      <td className="py-3 px-3 font-mono text-[10px] text-gray-600">{itg.events}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTestPingSuccess(`Ping ke ${itg.name} berhasil (200 OK - ${itg.latency})`);
                            setTimeout(() => setTestPingSuccess(null), 3500);
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7] rounded-lg hover:bg-[#bae6fd] transition-colors cursor-pointer"
                        >
                          Ping Test
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: ENVIRONMENT (Infrastructure & Server Nodes) */}
      {activeTab === 'Environment' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {envNodes.map((node) => (
              <div
                key={node.name}
                onClick={() =>
                  setSelectedModal({
                    type: 'environment',
                    title: node.name,
                    badge: node.status,
                    badgeColor: '#10B981',
                    description: `Status operasional dan spesifikasi komputasi dari ${node.name}.`,
                    details: [
                      { label: 'Nama Komponen', value: node.name },
                      { label: 'Peran dalam Arsitektur', value: node.role },
                      { label: 'Internal Cluster IP', value: node.ip },
                      { label: 'Utilisasi CPU Saat Ini', value: node.cpu },
                      { label: 'Utilisasi Memori RAM', value: node.memory },
                      { label: 'Region Data Center', value: node.region },
                      { label: 'Status Kesehatan', value: node.status },
                    ],
                  })
                }
                className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-xs hover:border-[#25A9A1] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#F0F4F8]">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#0284C7]" />
                    <span className="text-xs font-bold text-[#172B4D]">{node.name}</span>
                  </div>
                  {getStatusPill(node.status)}
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="text-[11px] text-[#526579]">{node.role}</div>
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-gray-400">Cluster IP:</span>
                    <span className="font-mono text-[11px] text-[#172B4D]">{node.ip}</span>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-gray-400">Region:</span>
                    <span className="font-semibold text-[#0F2942]">{node.region}</span>
                  </div>

                  <div className="pt-2 border-t border-[#F0F4F8] grid grid-cols-2 gap-2 text-center">
                    <div className="bg-[#F8FAFC] rounded-xl p-2 border border-[#EDF2F7]">
                      <span className="text-[10px] text-gray-400 block">CPU Load</span>
                      <span className="font-bold text-[#172B4D] mt-0.5 block">{node.cpu}</span>
                    </div>
                    <div className="bg-[#F8FAFC] rounded-xl p-2 border border-[#EDF2F7]">
                      <span className="text-[10px] text-gray-400 block">RAM Usage</span>
                      <span className="font-bold text-[#172B4D] mt-0.5 block">{node.memory}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Infrastructure Specs Card */}
          <div className="bg-white border border-[#DCE5EF] rounded-2xl p-5 shadow-xs">
            <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-3">
              Spesifikasi Lingkungan Produksi EduAtlas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#EDF2F7]">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Primary Data Center</span>
                <span className="font-bold text-[#172B4D] mt-1 block">Jakarta Tier-3 DC (JKT-DC1)</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#EDF2F7]">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Disaster Recovery (DR)</span>
                <span className="font-bold text-[#172B4D] mt-1 block">Surabaya DC (Hot-Standby)</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#EDF2F7]">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Runtime & Node.js</span>
                <span className="font-bold text-[#172B4D] mt-1 block">Node.js 20.12 LTS & Bun 1.1</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#EDF2F7]">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Keamanan & Enkripsi</span>
                <span className="font-bold text-[#172B4D] mt-1 block">TLS 1.3 / AES-256 at Rest</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL INSPECTION DETAIL */}
      {selectedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#DCE5EF] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: selectedModal.badgeColor || '#0284C7' }}
                />
                <span className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">
                  Detail Entitas Status: {selectedModal.title}
                </span>
              </div>
              <button
                onClick={() => setSelectedModal(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <h3 className="text-base font-bold text-[#172B4D]">{selectedModal.title}</h3>
                {selectedModal.description && (
                  <p className="text-xs text-[#526579] mt-1 leading-relaxed">
                    {selectedModal.description}
                  </p>
                )}
              </div>

              <div className="bg-[#F8FAFC] rounded-xl p-3.5 border border-[#EDF2F7] space-y-2 text-xs">
                {selectedModal.details.map((dt, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1.5 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-400 font-semibold text-[11px]">{dt.label}</span>
                    <span className="font-bold text-[#172B4D] text-right font-mono text-[11px]">{dt.value}</span>
                  </div>
                ))}
              </div>

              {selectedModal.codeSnippet && (
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Contoh Perintah / Payload Cuplikan:
                  </span>
                  <pre className="p-3 bg-[#0F2942] text-teal-300 font-mono text-[11px] rounded-xl overflow-x-auto">
                    <code>{selectedModal.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end gap-2">
              <button
                onClick={() => setSelectedModal(null)}
                className="px-4 py-2 bg-[#0F2942] text-white text-xs font-bold rounded-xl hover:bg-[#1a3a5c] transition-colors cursor-pointer shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
