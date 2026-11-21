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

## Sumber dan keaslian data

Setiap dataset perlu mencatat penyedia, periode, waktu pengambilan, dan cakupan.
Snapshot adalah salinan data pada waktu tertentu; format snapshot tidak membuktikan
bahwa datanya asli. Dataset simulasi harus diberi penanda demo. Data tanpa bukti
provenance harus ditandai belum terverifikasi, bukan dianggap sebagai data resmi.
Total regional tidak otomatis sama dengan jumlah record pada direktori contoh.

## Rencana migration

Perubahan schema perlu menggunakan migration bernomor dan jurnal versi.
Migration harus menjaga foreign key serta data yang sudah ada. Pemindahan tabel
antar-schema sebaiknya mempertahankan identitas record dan relasinya.
Undo tidak boleh menghapus tabel berisi data pengguna tanpa strategi pemulihan yang jelas.
Belum ada script migration dalam repository README-only ini.

## Rencana seeder

Seeder demo perlu memakai bulk insert, transaksi, serta penanda versi yang selesai.
Menjalankan ulang versi yang sama tidak boleh menggandakan atau menimpa record pengguna.
Manifest seed perlu mencatat hanya record yang benar-benar dibuat oleh seeder.
Undo harus mengikuti urutan dependensi dan menolak penghapusan record yang telah diedit.
Belum ada script seeder yang dapat dijalankan dari repository ini.

## Rencana QA

Pengujian per card perlu mencakup data kosong, data demo, filter valid dan tidak valid,
perhitungan agregat, provenance, serta perubahan nilai sumber database.
Card yang belum memiliki sumber data harus menjelaskan kekurangannya.
Pengujian database sebaiknya menggunakan database sementara yang terpisah dari data utama.
Tidak ada test suite atau hasil eksekusi baru yang disertakan dalam branch dokumentasi ini.

## Tahapan pengembangan berikutnya

1. Sepakati definisi metrik dan sumber data yang diizinkan.
2. Tambahkan kembali fondasi backend, frontend, dan pengelolaan konfigurasi.
3. Implementasikan schema, migration, dan seed demo yang dapat diaudit.
4. Sediakan katalog dan endpoint per card beserta pengujiannya.
5. Hubungkan halaman frontend ke API dan periksa setiap card terhadap data sumber.
6. Tambahkan impor data asli setelah akses, cakupan, dan provenance tersedia.

## Kontribusi dan alur branch

Gunakan `development` untuk perubahan dokumentasi dan implementasi berikutnya.
Setiap commit perlu memiliki perubahan yang dapat ditinjau dan pesan yang menjelaskan
tujuannya. Ajukan perubahan ke `main` melalui pull request setelah cakupan dan
validasinya jelas. Jangan menyimpan kredensial, file environment pribadi, atau data
pribadi dalam commit.

Alamat repository: https://github.com/vincent-guizot/edu-atlas
