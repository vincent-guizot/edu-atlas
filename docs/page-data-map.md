# Pemetaan database per menu dan kartu EduAtlas

Inventaris berdasarkan `Sidebar.tsx`, router, halaman dalam `features/`, model Sequelize,
dan service backend. Pemetaan kartu di bawah adalah **target sumber database**;
belum berarti kartu frontend sudah memanggil API. Banyak halaman masih memakai
array, constants, JSON, dan angka literal. Migration/seeder tidak mengubah koneksi UI.

Backend kini menyediakan [endpoint QA per card](page-card-qa.md) pada 12 menu:
81 card didukung dan 21 card memiliki status 501 dengan alasan yang spesifik.
Katalog runtime: GET /api/v1/pages. Frontend belum dihubungkan ke endpoint tersebut.

## Ringkasan

- Database: `eduatlas_db`.
- Schema aplikasi: **4**: `directory`, `academic`, `analytics`, `system`.
- Tabel data: **12**; tabel teknis: **2**; total **14 tabel**.
- Menu sidebar: **17 Menu** (12 menu dasar + 5 modul analitik & kebijakan baru). Tabel dipakai bersama, tidak dibuat satu tabel per kartu.
- Peta geografis dipakai untuk menu Interactive Maps dan Advanced Maps.
  Overview masih memiliki visual peta di kode lama; penghapusan/pemindahannya belum dilakukan.
- Host Docker lokal: `127.0.0.1:1000`. Antarcontainer: `db:5432`.
  Instalasi PostgreSQL langsung dapat memakai `127.0.0.1:5432`; sesuaikan `.env`.

| Schema | Tabel | Jumlah |
|---|---|---:|
| directory | regions, schools, universities, institution_links | 4 |
| academic | academic_programs, academic_events, timeline_programs | 3 |
| analytics | education_indicators, snapshots, report_definitions | 3 |
| system | schema_migrations, seed_runs, data_sources, data_imports | 4 |

Lima tabel tambahan dan API kartu dijelaskan di [card-data-tables.md](card-data-tables.md).

Nama tabel pendek pada kartu di bawah mengacu pada schema dalam tabel ini.
Overview dan Visualizations menggunakan 2 schema data; Advanced Visualization
menggunakan 3; Maps, Data Explorer, dan Data Grid menggunakan directory;
Calendar menggunakan academic; Flow menggunakan directory dan academic;
Data Status menggunakan analytics dan system; Reports menggunakan directory dan analytics.
Timeline memakai academic. system.data_sources dan system.data_imports menyediakan
informasi operasional; schema_migrations dan seed_runs hanya untuk tooling database.

| Menu sidebar | Tabel yang tersedia untuk kartu dasar | Jumlah tabel unik | Kekurangan untuk kartu lanjutan |
|---|---|---:|---|
| Overview | regions, schools, universities, education_indicators, snapshots | 5 | Histori regional per periode, indikator mutu terverifikasi |
| Visualizations | regions, schools, universities, education_indicators | 4 | Dimensi indikator tertentu belum tersedia |
| Advanced Visualization | regions, schools, universities, academic_programs, education_indicators | 5 | Aliran/transisi dan korelasi tertentu belum tersedia |
| Interactive Maps | regions, schools, universities | 3 | Poligon batas wilayah belum disimpan |
| Advanced Maps | regions, schools, universities | 3 | Poligon, histori spasial, atribut layer lanjutan |
| Data Explorer | regions, schools, universities | 3 | Profil detail siswa/guru bukan bagian schema saat ini |
| Advanced Data Grid | regions, schools, universities | 3 | Master kabupaten/kota: saat ini hanya teks city |
| Calendar & Scheduling | academic_events | 1 | Penyelenggara, lokasi, peserta, relasi institusi |
| Timeline & Gantt | timeline_programs | 1 | Tugas, milestone, dependensi |
| Flow & Network | schools, universities, academic_programs, institution_links | 4 | Aliran siswa dan master mitra |
| API & Data Status | snapshots, data_sources, data_imports | 3 | Monitoring API, log, kualitas data, webhook |
| Reports & Export | snapshots, regions, schools, universities, report_definitions | 5 | Job ekspor, berkas dan histori unduhan |

Jumlah adalah tabel yang **dapat dipakai oleh kartu dasar**, bukan jumlah query
frontend saat ini. Tabel sama yang muncul pada dua menu dihitung sekali dalam total 12.
Timeline tidak sama dengan academic_programs: tabel tersebut berisi program studi.

## 1. Overview — 5 tabel

| Kartu / informasi | Tabel dan perhitungan | Batas data |
|---|---|---|
| Total Sekolah | regions: SUM(totalSchools) | Agregat cakupan dataset |
| Total Siswa | regions: SUM(totalStudents) | Siswa sekolah; jangan otomatis tambah mahasiswa |
| Total Guru | regions: SUM(totalTeachers) | Guru sekolah; dosen terpisah |
| Total Universitas | regions: SUM(totalUniversities) | Bukan jumlah baris direktori contoh |
| Rasio siswa/guru | SUM(totalStudents) / SUM(totalTeachers) | Kosong bila pembagi nol |
| Tren siswa tahunan | education_indicators: year, metricName, value | Filter definisi metrik dan periode |
| Distribusi jenjang | schools: GROUP BY educationLevel, SUM(studentCount) | Hanya cakupan direktori yang dimuat |
| Peringkat provinsi | regions: avgPerformanceScore | Seed skor masih simulasi |
| Sumber / tanggal data | snapshots: source, snapshotDate, period, isDemoData | Metadata tidak memberi histori setiap record |

## 2. Visualizations — 4 tabel

| Kartu / informasi | Sumber database |
|---|---|
| Line / Area / tren | education_indicators, dikelompokkan year dan metricName |
| Bar / perbandingan wilayah | regions.totalSchools, totalStudents, totalTeachers |
| Pie / Donut jenjang | schools.educationLevel dan studentCount |
| Stacked / composition | schools: educationLevel, ownership, accreditation |
| Comparison sekolah dan universitas | schools + universities, dengan definisi metrik sama |
| Kelulusan / indikator persentase | education_indicators kategori graduation; jangan substitusi angka tetap |

## 3. Advanced Visualization — 5 tabel

| Kartu / informasi | Sumber database | Batas data |
|---|---|---|
| Peringkat / heatmap wilayah | regions + education_indicators | Indikator saat ini belum punya regionId terstruktur |
| Treemap hierarki institusi | regions → schools / universities → academic_programs | city masih teks |
| Scatter / bubble | schools.studentCount, teacherCount, facilitiesScore | Skor dan jumlah masih demo |
| Radar kualitas | education_indicators dengan definisi dimensi | Jangan menurunkan dimensi radar dari skor tunggal |
| Sankey / aliran | Memerlukan tabel transisi/aliran tambahan | Belum didukung 7 tabel dasar |

## 4. Interactive Maps — 3 tabel

| Kartu / informasi | Sumber database |
|---|---|
| Marker sekolah | schools.latitude, longitude, educationLevel, name |
| Marker perguruan tinggi | universities.latitude, longitude, type, name |
| Detail institusi | schools / universities JOIN regions |
| Sebaran provinsi / pulau | regions dan agregasi direktori; cakupan ditulis jelas |
| Filter / pencarian | name, city, regionId, educationLevel / type |

## 5. Advanced Maps — 3 tabel

| Kartu / informasi | Sumber database | Batas data |
|---|---|---|
| Layer jumlah sekolah/siswa/guru/PT | regions.totalSchools/totalStudents/totalTeachers/totalUniversities | Satu nilai agregat wilayah |
| Layer rasio | regions.totalStudents / totalTeachers | Periksa pembagi nol |
| Heatmap lokasi institusi | schools + universities, koordinat | Bukan kepadatan populasi umum |
| Perbandingan wilayah | regions, dengan metrik yang sama | Belum ada histori regional |
| Batas provinsi | Memerlukan boundary dataset / tabel tersendiri | latitude/longitude hanya titik, bukan poligon |

## 6. Data Explorer — 3 tabel

| Kartu / informasi | Sumber database |
|---|---|
| KPI sekolah/siswa/guru/universitas | regions: agregat total; beri label cakupan |
| KPI hasil filter | COUNT dan SUM schools / universities sesuai filter, bukan angka nasional tetap |
| Daftar sekolah | schools JOIN regions; pagination, search, filter |
| Daftar perguruan tinggi | universities JOIN regions |
| Distribusi hasil | GROUP BY jenjang, ownership, accreditation pada query terfilter |
| Detail record | schools / universities berdasarkan primary key |

## 7. Advanced Data Grid — 3 tabel

| Kartu / informasi | Sumber database |
|---|---|
| Empat KPI utama | regions untuk cakupan agregat; query direktori untuk hasil filter |
| Group provinsi → kota → institusi | regions JOIN schools / universities; city sebagai kelompok teks |
| Analisis agregasi nasional | SUM metrik sesuai cakupan dan filter |
| Komposisi group | COUNT / SUM menurut jenjang, kepemilikan, akreditasi |
| Komparasi wilayah | regions atau agregat direktori yang sama cakupannya |

## 8. Calendar & Scheduling — 1 tabel

| Kartu / informasi | Sumber database |
|---|---|
| Jumlah agenda | COUNT academic_events pada rentang tanggal |
| Agenda mendatang/berlangsung/selesai | startDate/endDate dibandingkan tanggal saat ini; status seed dapat kedaluwarsa |
| Kalender dan daftar agenda | academic_events: title, description, startDate, endDate |
| Kategori / target jenjang | category, targetAudience |
| Detail kegiatan | academic_events berdasarkan id; lokasi dan organizer belum tersedia |

## 9. Timeline & Gantt — 1 tabel khusus

| Kartu / informasi | Sumber / kebutuhan schema |
|---|---|
| Total program dan status | academic.timeline_programs: id, name, category, owner, regionId, startDate, endDate, status, progress |
| Gantt / subtask / milestone | timeline_tasks: id, programId FK, name, startDate, endDate, progress |
| Dependensi kegiatan | timeline_dependencies: predecessorTaskId FK, successorTaskId FK |
| Progres dan keterlambatan | Hitung dari tugas dengan aturan pembobotan yang disepakati |

## 10. Flow & Network — 4 tabel

| Kartu / informasi | Sumber / kebutuhan |
|---|---|
| Node sekolah / PT / prodi | schools, universities, academic_programs |
| Jaringan kerja sama | directory.institution_links: universitas, nama mitra, jenis, status, jumlah proyek |
| Student pathway / aliran siswa | Usulan education_flows: asal, tujuan, periode, jumlah, jenis aliran |
| Total hubungan / kekuatan relasi | COUNT / SUM dari links atau flows, tidak bisa dari jumlah institusi |
| Detail koneksi | Perlu sumber, periode, jenis, dan bukti hubungan |

## 11. API & Data Status — 3 tabel tersedia

| Kartu / informasi | Sumber / kebutuhan |
|---|---|
| Snapshot terakhir / sumber / demo | snapshots |
| Online API / latency / uptime | Hasil probe terukur; usulan api_health_checks, bukan seed status Online |
| Sumber data / riwayat impor | system.data_sources dan system.data_imports; log demo ditandai simulasi |
| Kualitas data | Hasil validasi impor; usulan data_quality_checks |
| Update history / log | data_imports tersedia; log runtime terpisah belum disimpan |
| Webhook / integrasi | Konfigurasi dan delivery aktual; belum tersedia |
| Environment | Konfigurasi server yang aman ditampilkan; jangan tampilkan password |

## 12. Reports & Export — 5 tabel

| Kartu / informasi | Sumber / kebutuhan |
|---|---|
| Ringkasan eksekutif | regions + snapshots |
| Tabel / CSV / Excel institusi | schools / universities JOIN regions |
| Sumber / periode laporan | snapshots; harus cocok dengan dataset yang diekspor |
| Daftar template | analytics.report_definitions: kategori, format, snapshot opsional, status aktif |
| Job / histori unduhan | export_jobs belum tersedia |
| Highlight dan rekomendasi | Pisahkan narasi editorial dari hasil perhitungan; narasi backend saat ini masih tetap |

## Migration dan seeder yang disediakan

- Migration lama `001-initial-schema.ts` diganti `001-domain-schemas.ts`.
  Seeder lama `seed-demo.ts` diganti `seeders/education-demo.ts`.
- Baseline baru membuat 4 schema dengan FK lintas schema, unique NPSN, dan enum.
  Runner mencatat versi pada system.schema_migrations, mengadopsi history lama bila ada.
- Tabel data lama pada public dipindahkan ke schema domain tanpa menyalin/menghapus baris.
  Jika tabel asal dan tujuan sama-sama ada, transaksi gagal agar konflik tidak tersembunyi.
- CLI dan startup menjalankan migration yang sama; advisory lock mencegah
  dua proses menerapkan versi yang sama bersamaan. Satu transaksi per run.
- `CREATE TABLE IF NOT EXISTS` mempertahankan tabel lama. Baseline tidak
  memperbaiki schema lama yang berbeda; periksa drift sebelum adopsi.
- Seeder demo mengisi ketujuh tabel dari seed.data.ts melalui bulk insert per tabel,
  satu transaksi, dan pencatatan record yang benar-benar masuk melalui RETURNING.
  Record yang terkena konflik unik tidak diubah dan tidak dicatat sebagai milik seed.
- Seed versi selesai dilewati: BEGIN, advisory lock, satu lookup seed_runs, COMMIT.
  Tidak ada validasi ulang seluruh dataset atau INSERT berulang. Perubahan dataset
  membutuhkan versi seed baru; record yang dihapus manual tidak otomatis diisi ulang.
- Manifest pada system.seed_runs memungkinkan undo hanya record milik seed baru.
  Undo ditolak jika record telah diedit atau berpotensi menghapus program studi
  buatan pengguna melalui cascade. Seluruh undo di-rollback jika ada kegagalan.
- Seed ini tetap simulasi. Total regional mewakili agregat demo; direktori institusi
  hanya contoh. Jangan mengklaim total regional sama dengan COUNT direktori.
- DB_AUTO_SEED default false; isi demo secara eksplisit melalui CLI, atau aktifkan
  flag tersebut untuk lingkungan demo. Error migration/seed diteruskan ke pemanggil.

Jalankan dari root setelah mengatur `apps/backend/.env`:

```powershell
yarn db:create
yarn db:migrate
yarn db:seed
# Atau gabungkan ketiganya:
yarn db:setup
```

Untuk kembali ke layout public, hentikan backend lalu jalankan berurutan:

```powershell
yarn db:seed:undo
yarn db:migrate:undo
# Undo membatalkan satu versi: ulangi untuk 001 setelah 002 dibatalkan.
yarn db:migrate:undo
```

Undo migration mempertahankan baris domain dan memindahkannya kembali ke public.
Schema namespace, enum, dan tabel teknis dipertahankan agar dapat dimigrasikan ulang.
Model aplikasi versi baru memakai schema domain: gunakan versi aplikasi lama saat
layout public aktif. Startup versi baru akan menerapkan migration lagi.
Record seed lama tanpa manifest tidak dihapus oleh undo seed baru karena kepemilikannya
tidak dapat dibuktikan. Ini juga berlaku untuk data yang diimpor sebelum perubahan ini.

Uji integrasi membuat database sementara `eduatlas_verify_*` pada server yang
ditentukan `.env`, lalu menghapus database sementara itu. Akun memerlukan CREATEDB.
Pengujian tidak menulis ke eduatlas_db:

```powershell
$env:DB_INTEGRATION_TEST='true'
yarn workspace backend test --runInBand --runTestsByPath src/database/migrations/migration.integration.spec.ts
```

Sebelum migration pada database berisi data: buat backup dengan pg_dump dan
pastikan restore dapat dilakukan di database terpisah. Kegagalan migration baru
di-rollback otomatis. Undo 002 menghapus kelima tabel tambahan hanya bila kosong,
tanpa CASCADE; undo 001 memindahkan tabel domain lama ke public.

Migration 002 menyediakan dasar program timeline, kemitraan, registri sumber,
riwayat impor, dan definisi laporan. Task/dependensi, aliran siswa, monitoring API,
quality checks, dan job ekspor tetap memerlukan alur input serta tabel tambahan.
