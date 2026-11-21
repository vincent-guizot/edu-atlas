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
