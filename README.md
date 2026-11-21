# EduAtlas

Rancangan platform eksplorasi data pendidikan Indonesia.

Repository ini hanya berisi `README.md`.

## Status repository

Branch `main` menyediakan ringkasan awal. Branch `development` mengembangkan
dokumentasi rancangan secara bertahap. Source code aplikasi, konfigurasi runtime,
database, dan collection pengujian tidak disertakan dalam kedua branch ini.
Dokumen ini menjelaskan arah pengembangan, bukan aplikasi yang sudah bisa dijalankan.

## Tujuan dan cakupan

EduAtlas dirancang untuk membantu pembaca memahami sebaran institusi pendidikan,
jumlah peserta didik dan pendidik, serta informasi program dan kegiatan.
Cakupan awal meliputi sekolah, perguruan tinggi, wilayah, dan indikator pendidikan.
Data pribadi peserta didik bukan bagian dari cakupan dashboard publik ini.

## Menu yang direncanakan

1. Overview.
2. Visualizations.
3. Advanced Visualization.
4. Interactive Maps.
5. Advanced Maps.
6. Data Explorer.
7. Advanced Data Grid.
8. Calendar & Scheduling.
9. Timeline & Gantt.
10. Flow & Network.
11. API & Data Status.
12. Reports & Export.

## Arsitektur acuan

Antarmuka direncanakan menggunakan React dan TypeScript. Backend menggunakan
NestJS untuk menyediakan API, sementara PostgreSQL menjadi penyimpanan data.
Browser mengakses API backend; kredensial database disimpan di server.
Pilihan teknologi ini merupakan acuan untuk implementasi berikutnya.

## Pembagian schema database

| Schema | Tanggung jawab |
|---|---|
| directory | Wilayah dan institusi pendidikan |
| academic | Program studi, agenda, dan program kegiatan |
| analytics | Indikator, snapshot, dan definisi laporan |
| system | Sumber data, impor, dan jurnal perubahan database |

Nama schema membagi domain data, bukan membuat database terpisah untuk setiap halaman.

## Tabel acuan

| Schema | Tabel |
|---|---|
| directory | regions, schools, universities, institution_links |
| academic | academic_programs, academic_events, timeline_programs |
| analytics | education_indicators, snapshots, report_definitions |
| system | data_sources, data_imports, schema_migrations, seed_runs |

Rancangan ini memiliki 12 tabel data dan 2 tabel teknis. Definisi kolom dan constraint
perlu diwujudkan dalam migration ketika source code aplikasi ditambahkan kembali.

## Informasi per card

Satu card menampilkan satu metrik, grafik, daftar, atau kelompok informasi.
Contoh Overview: Total Sekolah, Total Siswa, Total Guru, Total Universitas,
Tren Siswa, dan Distribusi Jenjang. Setiap card perlu mendokumentasikan tabel sumber,
kolom, filter, rumus, periode, dan cakupan datanya.
Satu tabel boleh mendukung beberapa card; satu card boleh menggabungkan beberapa tabel.

## Kontrak API acuan

Endpoint yang diusulkan:

```http
GET /api/v1/pages
GET /api/v1/pages/overview/cards
GET /api/v1/pages/overview/cards/total-schools
GET /api/v1/pages/overview/cards/enrollment-trend?year=2026
```

Katalog perlu menjelaskan cardId, filter yang diterima, tabel sumber, dan status
dukungan. URL tersebut adalah rancangan kontrak; repository ini tidak menjalankan server API.

## Filter dan hasil kosong

Filter harus sesuai dengan data yang benar-benar tersimpan. Angka agregat regional
tanpa histori tidak boleh menerima filter tahun yang diam-diam diabaikan.
Daftar memerlukan batas hasil dan urutan yang stabil. Rasio dengan pembagi nol
sebaiknya menghasilkan null, sedangkan daftar tanpa record menghasilkan array kosong.
Filter yang tidak dikenal atau tidak valid perlu ditolak secara eksplisit.
