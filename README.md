<p align="center">
  <img src="brand/EduAtlas_%20Education%20Through%20Data.png" alt="EduAtlas — Explore Education Through Data" width="100%" />
</p>

# EduAtlas — Education Intelligence & Data Visualization Platform

**Version:** 1.1.0  
**Tagline:** Explore Education Through Data.  
**Domain:** Indonesia Education Statistics & Analytics  
**Swagger API Spec:** `http://localhost:4000/api/docs` & `docs/openapi.json`

EduAtlas adalah platform visualisasi data dan kecerdasan analitik pendidikan di Indonesia yang menyajikan snapshot data statistik sekolah, siswa, guru, universitas, mahasiswa, dan performa akademik antar-wilayah secara interaktif.

---

## 1. Arsitektur Proyek Monorepo

```text
EduAtlas/
├── apps/
│   ├── backend/               # NestJS 11 + Express + Sequelize + PostgreSQL
│   │   ├── data/              # Data Snapshots JSON (overview, schools, universities, dsb)
│   │   ├── src/
│   │   │   ├── common/        # Response transformer interceptor & filters
│   │   │   ├── database/      # Models, seeder, dan scripts migrasi/setup DB
│   │   │   │   ├── models/    # Model Sequelize (Snapshot, Region, School, dsb)
│   │   │   │   └── scripts/   # Scripts: setup, create-database, migrate, seed
│   │   │   ├── health/        # Health check endpoint
│   │   │   ├── modules/       # 10 Modul Bisnis (Overview, Schools, Universities, dsb)
│   │   │   └── main.ts
│   │   └── package.json
│   └── frontend/              # React 18 + Vite + Tailwind CSS v4 + TanStack Query
│       ├── src/
│       │   ├── app/           # Router (createBrowserRouter) & AppProviders
│       │   ├── services/      # Axios API Client & Service Modules (dengan offline fallback)
│       │   ├── helpers/       # Helper formatters (id-ID) & Export utilities
│       │   ├── hooks/         # React Custom Hooks (useOverviewData, useSchoolsData, dsb)
│       │   ├── constants/     # Data Snapshot Constants & metadata lengkap
│       │   ├── pages/         # 12 Halaman Dashboard EduAtlas
│       │   ├── components/    # AppShell, Sidebar, Topbar, Reusable Cards & States
│       │   ├── features/      # Implementasi detail visualisasi tiap fitur
│       │   └── main.tsx
│       └── package.json
├── brand/                     # Brand Identity & Aset Desain EduAtlas (Logo, Palet, Banner)
├── data/                      # Unified Data Platform (DE, DA, DS)
│   ├── 01_raw/                # Data mentah orisinal snapshot (Kemdikbud, BPS, PDDikti)
│   ├── 02_interim/            # Data hasil pembersihan awal & standarisasi teks
│   ├── 03_processed/          # Star-Schema Data Warehouse (dim_regions, dim_schools, fact_*)
│   ├── 04_features/           # Feature store ML, normalisasi, dan klaster K-Means (K=3)
│   ├── 05_analytics/          # Analytics mart agregat KPI, pemeringkatan, dan disparitas
│   ├── metadata/              # Kamus data, data lineage, dan kontrak validasi
│   └── pipelines/             # Skrip otomatisasi ETL & sinkronisasi aplikasi
├── docs/                      # Dokumentasi Teknis & Spesifikasi
│   ├── README.md              # Portal Indeks Dokumentasi
│   ├── data/                  # Portal dokumentasi tim data (DE, DA, DS)
│   │   ├── README.md          # Ikhtisar arsitektur data & pembagian peran
│   │   ├── data-pipeline.md   # Spesifikasi teknis alur pipeline ETL
│   │   ├── data-dictionary.md # Kamus data & definisi entitas kolom
│   │   └── data-lineage.md    # Silsilah transformasi data mentah ke analitik
│   ├── openapi.json           # Spesifikasi OpenAPI 3.0 REST API (v1.1.0)
│   ├── product-requirements.md# Product Requirements Document (PRD)
│   ├── architecture.md        # Arsitektur Sistem & Monorepo
│   ├── design-system.md       # EduAtlas Design System v1.0
│   ├── api-contracts.md       # Spesifikasi REST API & Swagger
│   └── database-schema.md     # Skema Database PostgreSQL & ERD
├── screenshots/               # Tangkapan Layar 12 Halaman Dashboard EduAtlas
├── package.json               # Root monorepo workspace scripts
├── .yarnrc                    # Konfigurasi registry Yarn
└── yarn.lock                  # File lock Yarn
```

---

## 2. 12 Halaman EduAtlas yang Diimplementasikan

1. **Overview Dashboard** (`/overview`): Metrik KPI nasional, tren pendaftaran, distribusi jenjang, dan ranking mutu provinsi.
2. **Chart Playground** (`/visualizations`): Eksplorasi Recharts dinamis (Line, Bar, Area, Pie, Donut).
3. **Advanced Visualization** (`/visualizations/advanced`): Apache ECharts (Radar Benchmark 6 dimensi, Treemap sebaran, Sankey alur siswa, Gauge indeks nasional).
4. **Interactive Maps** (`/maps`): Peta Leaflet dengan custom pin marker institusi sekolah & universitas se-Indonesia beserta pop-up detail.
5. **Advanced Maps** (`/maps/advanced`): MapLibre GL Vector map dengan data-driven scaling ukuran lingkaran dan gradasi mutu wilayah.
6. **Data Table** (`/data-explorer`): TanStack Table dengan pencarian multi-kolom, sorting, filter jenjang/status, paginasi, dan ekspor CSV.
7. **Advanced Data Grid** (`/data-grid`): Grid perguruan tinggi berkinerja tinggi dengan sub-grid hierarki program studi dan rasio dosen-mahasiswa.
8. **Calendar & Scheduling** (`/calendar`): FullCalendar agenda akademik nasional (PTS, PAS, UTBK-SNBT, Libur Semester) dengan modal detail event.
9. **Timeline & Gantt** (`/timeline`): Kronologi perjalanan agenda pendidikan tahun 2026 per kuartal dengan penanda durasi dan status capaian.
10. **Flow & Network** (`/flow`): Diagram alur interaktif `@xyflow/react` yang memvisualisasikan hierarki regulator, jenjang sekolah, hingga perguruan tinggi dan dunia industri.
11. **API & Data Status** (`/data-status`): Monitor kesehatan endpoint REST API, latensi server, metadata snapshot, dan kontrol sinkronisasi ulang.
12. **Reports & Export** (`/reports`): Ringkasan eksekutif laporan pendidikan dengan generator ekspor Excel (`.xlsx`) dan dokumen cetak PDF (`.pdf`).

---

## 3. Alur Aplikasi (Application Flow) & Snapshot Architecture

EduAtlas dirancang untuk menyajikan analisis data pendidikan nasional berbasis **data snapshot**:
1. **Penyajian Snapshot:** Karena sistem tidak menggunakan streaming data real-time, backend menyajikan snapshot data teragregasi berkala (`/api/v1/overview`, `/api/v1/schools`, `/api/v1/universities`, dsb) yang bersumber dari tabel database atau berkas snapshot terstruktur di `apps/backend/data/`.
2. **Offline Constants Fallback:** Frontend dilengkapi mekanisme ketahanan (*resilience*). Apabila server backend tidak sedang aktif (offline) atau konfigurasi `VITE_API_URL` tidak disetel, frontend secara otomatis mengalihkan sumber data ke **constants snapshots** di `apps/frontend/src/constants/`. Seluruh visualisasi grafik, peta interaktif, tabel data, kalender, dan diagram alur tetap dapat dioperasikan secara penuh tanpa menghasilkan error layar kosong.

---

## 4. Cara Menjalankan Aplikasi & Pengujian

### A. Prasyarat
* Node.js v20+ atau v24+
* PostgreSQL 17 (port 5432, user: `postgres`, password: `admin`, database: `eduatlas_db`)
* Yarn v1.22+

### B. Setup Database & Migrasi (Backend)
```bash
# Menjalankan seluruh proses: membuat database, migrasi tabel, dan seeder snapshot
yarn db:setup

# Atau eksekusi perintah secara individual:
yarn db:create    # Membuat database eduatlas_db jika belum ada
yarn db:migrate   # Menjalankan sinkronisasi skema & alter tabel Sequelize
yarn db:seed      # Mengisi data snapshot awal ke database
```

### C. Menjalankan Seluruh Pengujian (Testing)
```bash
# Menjalankan pengujian backend (Jest) dan frontend (Vitest)
yarn test

# Atau jalankan per workspace:
yarn test:backend
yarn test:frontend
```

### D. Menjalankan Backend
```bash
cd apps/backend
yarn start:prod
# atau mode development:
# yarn start:dev
```
* Backend API berjalan di: `http://localhost:4000/api/v1`
* Dokumentasi Swagger OpenAPI: `http://localhost:4000/api/docs`

### E. Menjalankan Frontend
```bash
cd apps/frontend
yarn dev
```
* Frontend berjalan di: `http://localhost:5173`

---

## 5. Arsitektur Data Platform & Pipeline (Folder `data/`)

EduAtlas mengadopsi struktur repositori data berlapis (*Medallion Architecture*) yang dikelola bersama oleh **Data Engineer**, **Data Analyst**, dan **Data Science**:

### A. Alur Kerja Data
1. **Ingestion (`01_raw/`):** Mengambil data mentah BPS, Kemendikbud (Dapodik), dan PDDikti.
2. **Transformasi & Dimensi (`02_interim/` & `03_processed/`):** Pembersihan encoding, imputasi, dan pemodelan Star Schema (`dim_regions`, `dim_schools`, `fact_school_academics`, `fact_universities`).
3. **Machine Learning (`04_features/`):** Feature store terskala, pembagian train/test (80:20), dan clustering disparitas K-Means ($K=3$).
4. **Analytics Mart (`05_analytics/`):** Agregasi KPI nasional, pemeringkatan performa regional, dan disparitas Jawa vs Luar Jawa.

### B. Perintah Pipeline Data
```bash
# 1. Menjalankan seluruh pipeline ETL dan analitik
python data/pipelines/run_all_pipelines.py

# 2. Menyinkronkan dataset ke aplikasi (backend data snapshots, database seeder, dan frontend constants)
python data/pipelines/sync_to_application.py

# 3. Memperbarui dokumen spesifikasi Swagger / OpenAPI 3.0
python data/pipelines/generate_openapi_spec.py
```

Seluruh panduan teknis data tersedia di portal dokumentasi: [docs/data/README.md](docs/data/README.md).
