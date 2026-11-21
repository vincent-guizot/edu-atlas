import { CardQuery, cardQueries as q, summaryQueries as summary } from './card-queries';

export interface PageCard {
  id: string;
  title: string;
  query?: CardQuery;
  unavailableReason?: string;
  defaultLimit?: number;
}
export interface CardPage {
  id: string;
  title: string;
  sidebarPath: string;
  cards: PageCard[];
}
const card = (id: string, query: CardQuery, title = query.title, defaultLimit?: number): PageCard =>
  ({ id, title, query, defaultLimit });
const unavailable = (id: string, title: string, reason: string): PageCard =>
  ({ id, title, unavailableReason: reason });
const totals = () => [
  card('total-schools', q.totalSchools), card('total-students', q.totalStudents),
  card('total-teachers', q.totalTeachers), card('total-universities', q.totalUniversities),
];

// IDs remain stable when display labels change. Sidebar paths preserve the actual menu routes.
export const pageCardCatalog: CardPage[] = [
  { id: 'overview', title: 'Overview', sidebarPath: '/overview', cards: [
    ...totals(), card('student-teacher-ratio', q.ratio),
    card('enrollment-trend', q.enrollment), card('level-distribution', q.levels),
    card('school-distribution', q.islands), card('top-provinces', q.regionalStudents, undefined, 10),
    card('snapshot-info', q.snapshots, undefined, 1),
  ] },
  { id: 'visualizations', title: 'Visualizations', sidebarPath: '/visualizations', cards: [
    card('line-chart', q.enrollment, 'Line Chart'), card('bar-chart', q.regionalSchools, 'Bar Chart', 5),
    unavailable('area-chart', 'Area Chart', 'Histori jumlah guru per jenjang belum disimpan.'),
    card('pie-chart', q.levels, 'Pie Chart: jumlah sekolah per jenjang'),
    card('donut-chart', q.levels, 'Donut Chart: jumlah siswa per jenjang'),
    card('stacked-bar-chart', q.regionalLevels, 'Stacked Bar Chart'),
    card('horizontal-bar-chart', q.regionalStudents, 'Horizontal Bar Chart', 10),
    card('grouped-column-chart', q.universityOwnership, 'Column Chart (Grouped)'),
    unavailable('combo-chart', 'Line + Bar (Combo Chart)', 'Histori jumlah sekolah dan pertumbuhan tahunan belum tersedia.'),
  ] },
  { id: 'advanced-visualization', title: 'Advanced Visualization', sidebarPath: '/visualizations/advanced', cards: [
    unavailable('heatmap', 'Heatmap', 'Indikator belum memiliki dimensi wilayah dan tahun yang lengkap.'),
    card('treemap', q.regionalSchools, 'Treemap'),
    unavailable('sankey', 'Sankey Diagram', 'Belum ada tabel transisi atau aliran siswa.'),
    unavailable('radar', 'Radar Chart', 'Dimensi mutu untuk radar belum tersedia sebagai indikator terverifikasi.'),
    unavailable('gauge', 'Gauge Chart', 'Metrik partisipasi untuk gauge belum tersedia.'),
    card('scatter', q.scatter, 'Scatter / Bubble Chart'),
    unavailable('calendar-heatmap', 'Calendar Heatmap', 'Belum ada pengukuran aktivitas harian; agenda akademik bukan pengganti metrik aktivitas.'),
    card('parallel-coordinates', q.regions, 'Parallel Coordinates'),
    unavailable('choropleth', 'Choropleth Map', 'Geometri batas wilayah belum disimpan.'),
  ] },
  { id: 'maps', title: 'Interactive Maps', sidebarPath: '/maps', cards: [
    card('institution-locations', q.points), card('province-distribution', q.regions),
    card('island-distribution', q.islands), card('level-distribution', q.levels),
  ] },
  { id: 'advanced-maps', title: 'Advanced Maps', sidebarPath: '/maps/advanced', cards: [
    ...totals(), card('student-teacher-ratio', q.ratio),
    card('national-summary', q.islands), card('top-provinces', q.regionalSchools, undefined, 5),
    card('institution-locations', q.points), card('province-comparison', q.regions),
    unavailable('density-heatmap', 'Heatmap Kepadatan Sekolah', 'Koordinat institusi tersedia, tetapi definisi kepadatan dan luas wilayah belum tersedia.'),
    unavailable('radius-analysis', 'Analisis Radius', 'Kontrak pusat titik, radius, dan kueri jarak belum diimplementasikan.'),
    unavailable('boundaries', 'Batas Wilayah', 'Dataset poligon wilayah belum tersedia.'),
  ] },
  { id: 'data-explorer', title: 'Data Explorer', sidebarPath: '/data-explorer', cards: [
    ...totals(), card('level-distribution', q.levels), card('schools-table', q.schools),
    card('universities-table', q.universities), card('ownership-distribution', q.ownership),
    card('accreditation-distribution', q.accreditation),
  ] },
  { id: 'data-grid', title: 'Advanced Data Grid', sidebarPath: '/data-grid', cards: [
    ...totals(), card('region-groups', q.regions), card('schools-grid', q.schools),
    card('universities-grid', q.universities), card('national-aggregation', q.islands),
    card('group-composition', q.levels), card('province-comparison', q.regions),
  ] },
  { id: 'calendar', title: 'Calendar & Scheduling', sidebarPath: '/calendar', cards: [
    card('academic-calendar', q.events), card('agenda-today', q.today), card('upcoming-events', q.upcoming),
    card('activity-statistics', q.eventCategories), card('calendar-by-audience', q.eventAudiences),
    card('important-events', q.events),
  ] },
  { id: 'timeline', title: 'Timeline & Gantt', sidebarPath: '/timeline', cards: [
    card('program-summary', summary.programs), card('program-timeline', q.programs),
    card('program-analysis', q.programCategories),
    unavailable('task-hierarchy', 'Hierarki Program dan Kegiatan', 'Tabel tugas dan relasi induk tugas belum tersedia.'),
    unavailable('milestones', 'Milestone Penting', 'Milestone program belum dimodelkan; event akademik belum terhubung ke program.'),
    unavailable('dependencies', 'Dependensi Gantt', 'Relasi dependensi antartugas belum tersedia.'),
  ] },
  { id: 'flow', title: 'Flow & Network', sidebarPath: '/flow', cards: [
    card('partnership-summary', summary.partnerships), card('institution-links', q.links),
    card('schools', q.schools), card('universities', q.universities),
    unavailable('student-pathway', 'Student Pathway', 'Tabel jumlah aliran siswa asal-tujuan per periode belum tersedia.'),
    unavailable('teacher-mobility', 'Teacher Mobility', 'Riwayat perpindahan guru belum tersedia.'),
  ] },
  { id: 'data-status', title: 'API & Data Status', sidebarPath: '/data-status', cards: [
    card('source-summary', summary.sources), card('import-summary', summary.imports),
    card('data-sources', q.sources), card('import-history', q.imports), card('snapshot-info', q.snapshots, undefined, 1),
    unavailable('api-uptime', 'Status API dan Uptime', 'Belum ada hasil probe historis; log seed bukan bukti uptime.'),
    unavailable('data-quality', 'Kualitas Data', 'Belum ada hasil pemeriksaan kualitas tersimpan.'),
    unavailable('system-logs', 'System Logs', 'Penyimpanan dan akses log runtime belum tersedia.'),
    unavailable('webhook-deliveries', 'Webhook dan Integrasi', 'Catatan pengiriman webhook belum tersedia.'),
  ] },
  { id: 'reports', title: 'Reports & Export', sidebarPath: '/reports', cards: [
    ...totals(), card('student-teacher-ratio', q.ratio), card('report-summary', summary.reports),
    card('report-templates', q.reports), card('snapshot-info', q.snapshots, undefined, 1),
    card('regions-export-preview', q.regions), card('schools-export-preview', q.schools),
    card('universities-export-preview', q.universities),
    unavailable('download-history', 'Riwayat Unduhan', 'Job ekspor dan telemetry unduhan belum disimpan.'),
  ] },
];
