export type CardFilter = 'regionId' | 'year' | 'limit' | 'date';
export interface CardQuery {
  title: string;
  kind: 'metric' | 'series' | 'list';
  tables: string[];
  coverage: string;
  filters: CardFilter[];
  sql: string;
}

const regionWhere = '($regionId::text IS NULL OR id = $regionId)';
const institutionWhere = '($regionId::text IS NULL OR "regionId" = $regionId)';
const query = (title: string, kind: CardQuery['kind'], tables: string[], coverage: string,
  filters: CardFilter[], sql: string): CardQuery => ({ title, kind, tables, coverage, filters, sql });
const total = (title: string, column: string) => query(title, 'metric', ['directory.regions'],
  'regional-aggregates', ['regionId'],
  `SELECT sum("${column}")::double precision AS value, count(*)::int AS "sourceRows"
   FROM directory.regions WHERE ${regionWhere}`);
const series = (title: string, tables: string[], filters: CardFilter[], sql: string,
  coverage = 'loaded-records') => query(title, 'series', tables, coverage, [...filters, 'limit'], sql);
const list = (title: string, tables: string[], filters: CardFilter[], sql: string,
  coverage = 'loaded-records') => query(title, 'list', tables, coverage, [...filters, 'limit'], sql);

// All identifiers and SQL fragments are application-owned; URL values are bound separately.
export const cardQueries = {
  totalSchools: total('Total Sekolah', 'totalSchools'),
  totalStudents: total('Total Siswa', 'totalStudents'),
  totalTeachers: total('Total Guru', 'totalTeachers'),
  totalUniversities: total('Total Universitas', 'totalUniversities'),
  ratio: query('Rasio Siswa per Guru', 'metric', ['directory.regions'], 'regional-aggregates', ['regionId'],
    `SELECT round(sum("totalStudents")::numeric / nullif(sum("totalTeachers"), 0), 1)::double precision AS value,
     count(*)::int AS "sourceRows" FROM directory.regions WHERE ${regionWhere}`),
  enrollment: series('Tren Jumlah Siswa', ['analytics.education_indicators'], ['year'],
    `SELECT year, "metricName", value FROM analytics.education_indicators
     WHERE category = 'enrollment' AND ($year::int IS NULL OR year = $year)
     ORDER BY year, "metricName", id`),
  graduation: series('Tren Kelulusan', ['analytics.education_indicators'], ['year'],
    `SELECT year, "metricName", value FROM analytics.education_indicators
     WHERE category = 'graduation' AND ($year::int IS NULL OR year = $year)
     ORDER BY year, "metricName", id`),
  levels: series('Distribusi Siswa per Jenjang', ['directory.schools'], ['regionId'],
    `SELECT "educationLevel", count(*)::int AS schools, sum("studentCount")::double precision AS students,
     bool_or("isDemoData") AS "__demo" FROM directory.schools WHERE ${institutionWhere}
     GROUP BY "educationLevel" ORDER BY "educationLevel"`, 'institution-directory-sample'),
  ownership: series('Distribusi Kepemilikan Sekolah', ['directory.schools'], ['regionId'],
    `SELECT ownership, count(*)::int AS schools, bool_or("isDemoData") AS "__demo"
     FROM directory.schools WHERE ${institutionWhere} GROUP BY ownership ORDER BY ownership`, 'institution-directory-sample'),
  accreditation: series('Distribusi Akreditasi Sekolah', ['directory.schools'], ['regionId'],
    `SELECT accreditation, count(*)::int AS schools, bool_or("isDemoData") AS "__demo"
     FROM directory.schools WHERE ${institutionWhere} GROUP BY accreditation ORDER BY accreditation`, 'institution-directory-sample'),
  universityTypes: series('Distribusi Jenis Perguruan Tinggi', ['directory.universities'], ['regionId'],
    `SELECT type, count(*)::int AS universities, bool_or("isDemoData") AS "__demo"
     FROM directory.universities WHERE ${institutionWhere} GROUP BY type ORDER BY type`, 'institution-directory-sample'),
  universityOwnership: series('Universitas Negeri dan Swasta per Provinsi', ['directory.universities'], ['regionId'],
    `SELECT "regionId", type, count(*)::int AS universities, bool_or("isDemoData") AS "__demo"
     FROM directory.universities WHERE ${institutionWhere} AND type IN ('PTN', 'PTS')
     GROUP BY "regionId", type ORDER BY "regionId", type`, 'institution-directory-sample-PTN-PTS-only'),
  regionalStudents: list('Provinsi dengan Siswa Terbanyak', ['directory.regions'], ['regionId'],
    `SELECT id, name, "totalStudents", "totalSchools", count(*) OVER()::int AS "__total"
     FROM directory.regions WHERE ${regionWhere} ORDER BY "totalStudents" DESC, id LIMIT $limit`, 'regional-aggregates'),
  regionalSchools: list('Provinsi dengan Sekolah Terbanyak', ['directory.regions'], ['regionId'],
    `SELECT id, name, "totalSchools", "totalStudents", count(*) OVER()::int AS "__total"
     FROM directory.regions WHERE ${regionWhere} ORDER BY "totalSchools" DESC, id LIMIT $limit`, 'regional-aggregates'),
  regionalScores: list('Skor Mutu Wilayah', ['directory.regions'], ['regionId'],
    `SELECT id, name, "avgPerformanceScore", "accreditationA", "accreditationB", "accreditationC",
     count(*) OVER()::int AS "__total" FROM directory.regions WHERE ${regionWhere}
     ORDER BY "avgPerformanceScore" DESC, id LIMIT $limit`, 'regional-aggregates-unverified-scores'),
  regions: list('Ringkasan Wilayah', ['directory.regions'], ['regionId'],
    `SELECT id, name, island, latitude, longitude, "totalSchools", "totalStudents", "totalTeachers",
     "totalUniversities", round("totalStudents"::numeric / nullif("totalTeachers", 0), 1)::double precision AS ratio,
     count(*) OVER()::int AS "__total" FROM directory.regions WHERE ${regionWhere} ORDER BY name, id LIMIT $limit`, 'regional-aggregates'),
  regionalLevels: series('Siswa per Jenjang dan Provinsi', ['directory.schools', 'directory.regions'], ['regionId'],
    `SELECT s."regionId", r.name, s."educationLevel", sum(s."studentCount")::double precision AS students,
     bool_or(s."isDemoData") AS "__demo" FROM directory.schools s JOIN directory.regions r ON r.id = s."regionId"
     WHERE ($regionId::text IS NULL OR r.id = $regionId)
     GROUP BY s."regionId", r.name, s."educationLevel" ORDER BY r.name, s."educationLevel"`, 'institution-directory-sample'),
  islands: series('Sebaran per Pulau', ['directory.regions'], ['regionId'],
    `SELECT island, sum("totalSchools")::double precision AS schools,
     sum("totalStudents")::double precision AS students, sum("totalTeachers")::double precision AS teachers,
     sum("totalUniversities")::double precision AS universities FROM directory.regions
     WHERE ${regionWhere} GROUP BY island ORDER BY island`, 'regional-aggregates'),
  schools: list('Daftar Sekolah', ['directory.schools'], ['regionId'],
    `SELECT id, name, npsn, "educationLevel", ownership, "regionId", city, "studentCount", "teacherCount",
     accreditation, "isDemoData" AS "__demo", count(*) OVER()::int AS "__total"
     FROM directory.schools WHERE ${institutionWhere} ORDER BY name, id LIMIT $limit`, 'institution-directory-sample'),
  universities: list('Daftar Perguruan Tinggi', ['directory.universities'], ['regionId'],
    `SELECT id, name, type, "regionId", city, "studentCount", "lecturerCount", accreditation,
     "isDemoData" AS "__demo", count(*) OVER()::int AS "__total"
     FROM directory.universities WHERE ${institutionWhere} ORDER BY name, id LIMIT $limit`, 'institution-directory-sample'),
  points: list('Lokasi Institusi', ['directory.schools', 'directory.universities'], ['regionId'],
    `SELECT *, count(*) OVER()::int AS "__total" FROM (
       SELECT 'school' AS kind, id, name, "regionId", latitude, longitude, "isDemoData" AS "__demo"
       FROM directory.schools WHERE ${institutionWhere}
       UNION ALL SELECT 'university', id, name, "regionId", latitude, longitude, "isDemoData"
       FROM directory.universities WHERE ${institutionWhere}
     ) points ORDER BY kind, name, id LIMIT $limit`, 'institution-directory-sample'),
  scatter: list('Siswa, Guru, dan Fasilitas Sekolah', ['directory.schools'], ['regionId'],
    `SELECT id, name, "studentCount", "teacherCount", "facilitiesScore", "isDemoData" AS "__demo",
     count(*) OVER()::int AS "__total" FROM directory.schools WHERE ${institutionWhere} ORDER BY id LIMIT $limit`, 'institution-directory-sample'),
  events: list('Kalender Akademik', ['academic.academic_events'], ['year'],
    `SELECT id, title, "startDate", "endDate", category, status, "targetAudience", count(*) OVER()::int AS "__total"
     FROM academic.academic_events WHERE ($year::int IS NULL OR ("startDate" <= $yearEnd AND "endDate" >= $yearStart))
     ORDER BY "startDate", id LIMIT $limit`),
  upcoming: list('Agenda Mendatang', ['academic.academic_events'], ['date'],
    `SELECT id, title, "startDate", "endDate", category, count(*) OVER()::int AS "__total"
     FROM academic.academic_events WHERE "startDate" > $date ORDER BY "startDate", id LIMIT $limit`),
  today: list('Agenda pada Tanggal Pilihan', ['academic.academic_events'], ['date'],
    `SELECT id, title, "startDate", "endDate", category, count(*) OVER()::int AS "__total"
     FROM academic.academic_events WHERE "startDate" <= $date AND "endDate" >= $date
     ORDER BY "startDate", id LIMIT $limit`),
  eventCategories: series('Statistik Kegiatan per Kategori', ['academic.academic_events'], ['year'],
    `SELECT category, count(*)::int AS events FROM academic.academic_events
     WHERE ($year::int IS NULL OR ("startDate" <= $yearEnd AND "endDate" >= $yearStart)) GROUP BY category ORDER BY category`),
  eventAudiences: series('Kalender per Target Jenjang', ['academic.academic_events'], ['year'],
    `SELECT "targetAudience", count(*)::int AS events FROM academic.academic_events
     WHERE ($year::int IS NULL OR ("startDate" <= $yearEnd AND "endDate" >= $yearStart))
     GROUP BY "targetAudience" ORDER BY "targetAudience"`),
  programs: list('Program Kegiatan', ['academic.timeline_programs'], ['regionId'],
    `SELECT id, name, category, owner, "regionId", "startDate", "endDate", status, progress,
     "isDemoData" AS "__demo", count(*) OVER()::int AS "__total" FROM academic.timeline_programs
     WHERE ${institutionWhere} ORDER BY "startDate", id LIMIT $limit`),
  programCategories: series('Analisis Program', ['academic.timeline_programs'], ['regionId'],
    `SELECT category, status, count(*)::int AS programs, avg(progress)::double precision AS progress,
     bool_or("isDemoData") AS "__demo" FROM academic.timeline_programs WHERE ${institutionWhere}
     GROUP BY category, status ORDER BY category, status`),
  links: list('Kemitraan Institusi', ['directory.institution_links', 'directory.universities'], ['regionId'],
    `SELECT l.id, l."universityId", u.name AS university, l."partnerName", l."partnerType", l.status, l."projectCount",
     (l."isDemoData" OR u."isDemoData") AS "__demo", count(*) OVER()::int AS "__total"
     FROM directory.institution_links l JOIN directory.universities u ON u.id = l."universityId"
     WHERE ($regionId::text IS NULL OR u."regionId" = $regionId) ORDER BY l.id LIMIT $limit`),
  snapshots: list('Metadata Snapshot', ['analytics.snapshots'], ['year'],
    `SELECT id, "snapshotDate", period, source, version, "isDemoData" AS "__demo", count(*) OVER()::int AS "__total"
     FROM analytics.snapshots WHERE ($year::int IS NULL OR period = $year::text)
     ORDER BY "snapshotDate" DESC, id LIMIT $limit`),
  sources: list('Sumber Data Terdaftar', ['system.data_sources'], [],
    `SELECT id, name, provider, "sourceType", "isEnabled", "isDemoData" AS "__demo", count(*) OVER()::int AS "__total"
     FROM system.data_sources ORDER BY name, id LIMIT $limit`),
  imports: list('Riwayat Impor', ['system.data_imports', 'system.data_sources'], [],
    `SELECT i.id, i."sourceId", s.name AS source, i.status, i."startedAt", i."finishedAt",
     i."rowsRead", i."rowsAccepted", i."rowsRejected", i."errorMessage",
     (i."isDemoData" OR s."isDemoData") AS "__demo", count(*) OVER()::int AS "__total"
     FROM system.data_imports i JOIN system.data_sources s ON s.id = i."sourceId"
     ORDER BY i."startedAt" DESC, i.id LIMIT $limit`),
  reports: list('Template Laporan', ['analytics.report_definitions'], [],
    `SELECT id, name, category, description, "defaultFormat", "snapshotId", "isActive",
     "isDemoData" AS "__demo", count(*) OVER()::int AS "__total"
     FROM analytics.report_definitions ORDER BY name, id LIMIT $limit`),
};

// Shared by the original /cards batch route and the independent page-card routes.
export const summaryQueries: Record<string, CardQuery> = {
  sources: query('Sumber Data Aktif', 'metric', ['system.data_sources'], 'loaded-records', [],
    `SELECT 'sources' AS key, 'Sumber Data Aktif' AS title, count(*) FILTER (WHERE "isEnabled")::int AS value,
     'Total sumber terdaftar' AS "secondaryLabel", count(*)::int AS "secondaryValue",
     coalesce(bool_or("isDemoData"), false) AS "isDemoData" FROM system.data_sources`),
  imports: query('Impor Selesai', 'metric', ['system.data_imports'], 'loaded-records', [],
    `SELECT 'imports' AS key, 'Impor Selesai' AS title, count(*) FILTER (WHERE status = 'completed')::int AS value,
     'Baris diterima pada impor selesai' AS "secondaryLabel",
     coalesce(sum("rowsAccepted") FILTER (WHERE status = 'completed'), 0)::double precision AS "secondaryValue",
     coalesce(bool_or("isDemoData"), false) AS "isDemoData" FROM system.data_imports`),
  programs: query('Program Berjalan', 'metric', ['academic.timeline_programs'], 'loaded-records', [],
    `SELECT 'programs' AS key, 'Program Berjalan' AS title, count(*) FILTER (WHERE status = 'ongoing')::int AS value,
     'Program selesai' AS "secondaryLabel", count(*) FILTER (WHERE status = 'completed')::int AS "secondaryValue",
     coalesce(bool_or("isDemoData"), false) AS "isDemoData" FROM academic.timeline_programs`),
  partnerships: query('Kemitraan Aktif', 'metric', ['directory.institution_links'], 'loaded-records', [],
    `SELECT 'partnerships' AS key, 'Kemitraan Aktif' AS title, count(*) FILTER (WHERE status = 'active')::int AS value,
     'Proyek pada kemitraan aktif' AS "secondaryLabel",
     coalesce(sum("projectCount") FILTER (WHERE status = 'active'), 0)::int AS "secondaryValue",
     coalesce(bool_or("isDemoData"), false) AS "isDemoData" FROM directory.institution_links`),
  reports: query('Template Laporan Aktif', 'metric', ['analytics.report_definitions'], 'loaded-records', [],
    `SELECT 'reports' AS key, 'Template Laporan Aktif' AS title, count(*) FILTER (WHERE "isActive")::int AS value,
     'Format tersedia' AS "secondaryLabel", count(DISTINCT "defaultFormat") FILTER (WHERE "isActive")::int AS "secondaryValue",
     coalesce(bool_or("isDemoData"), false) AS "isDemoData" FROM analytics.report_definitions`),
};
