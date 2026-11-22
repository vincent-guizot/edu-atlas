# EduAtlas Documentation Portal

**Welcome to the official EduAtlas technical documentation.**  
EduAtlas is an enterprise-grade education intelligence and data exploration platform tailored for Indonesian educational analytics.

---

## 1. Documentation Index

The documentation in this directory provides a complete, authoritative reference for the architecture, data modeling, API contracts, design system, and product requirements:

| Document | Description |
|---|---|
| [**Portal Data & Analytics Platform**](data/README.md) | Panduan komprehensif arsitektur data lake, pipeline ETL, feature store ML, dan kamus data. |
| [**Data Pipeline & ETL Specification**](data/data-pipeline.md) | Detail teknis ingestion, transformasi star-schema, pemodelan ML, dan sinkronisasi ke aplikasi. |
| [**Kamus Data (Data Dictionary)**](data/data-dictionary.md) | Definisi entitas tabel, kolom, tipe data, dan rentang nilai valid dari raw hingga analytics mart. |
| [**Data Lineage & Silsilah Data**](data/data-lineage.md) | Diagram alur transformasi data mentah ke data warehouse dan feature store ML. |
| [**QA Endpoint per Page dan Card**](page-card-qa.md) | Katalog 12 menu, endpoint per card, filter, kontrak respons, dan collection Postman. |
| [**Lima Tabel Kartu Informasi**](card-data-tables.md) | Sumber data, impor, program kegiatan, kemitraan, definisi laporan, dan API kartu. |
| [**Pemetaan Data per Menu dan Kartu**](page-data-map.md) | Jumlah schema/tabel, sumber setiap kartu, batas data, migration dan seeder lokal. |
| [**Product Requirements Document (PRD)**](product-requirements.md) | Full master specification, product vision, non-functional requirements, detailed breakdown of all 17 dashboard pages, and acceptance criteria. |
| [**System Architecture & Engineering Guide**](architecture.md) | Monorepo topology, high-level architecture diagram (Mermaid), NestJS backend design, React frontend structure, data flow, and export pipelines. |
| [**Design System v1.0**](design-system.md) | Official visual identity standards: brand colors, typography (Plus Jakarta Sans & Inter), spacing scale, single-line header layout, and reusable UI components. |
| [**REST API Contracts Specification**](api-contracts.md) | Comprehensive API endpoints, standard JSON envelope (`data` + `meta`), query parameters, request/response models, and Swagger UI reference. |
| [**Database Schema & Entity Models**](database-schema.md) | PostgreSQL 17 relational database architecture, Sequelize TypeScript entity models, indexes, constraints, and Mermaid ER diagram. |

---

## 2. Platform Architecture At a Glance

```text
EduAtlas/
├── apps/
│   ├── backend/               # NestJS 11 REST API Application (Port 4000)
│   │   ├── data/              # Snapshot JSON Datasets (overview, schools, universities)
│   │   ├── src/
│   │   │   ├── common/        # Uniform response interceptor & exception filters
│   │   │   ├── config/        # Environment and database configurations
│   │   │   ├── database/      # Sequelize connection, models, seeder, and setup scripts
│   │   │   │   ├── models/    # Sequelize TypeScript models
│   │   │   │   └── scripts/   # Scripts: setup, create-database, migrate, seed
│   │   │   ├── health/        # Terminus health checks (/api/v1/health)
│   │   │   ├── modules/       # 10 business domain modules
│   │   │   └── main.ts        # Bootstrap entrypoint
│   │   └── package.json
│   └── frontend/              # React 18 + Vite Single Page Application (Port 5173)
│       ├── src/
│       │   ├── app/           # createBrowserRouter & AppProviders
│       │   ├── services/      # Axios API client & services with offline fallback
│       │   ├── helpers/       # Formatting (id-ID) & CSV export utilities
│       │   ├── hooks/         # Custom React hooks (useOverviewData, useSchoolsData, etc.)
│       │   ├── constants/     # Complete snapshot fallback datasets
│       │   ├── pages/         # 17 interactive dashboard pages
│       │   ├── components/    # AppShell, Sidebar, Topbar, reusable cards & views
│       │   ├── features/      # Deep domain charts, maps, tables, flows
│       │   ├── index.css      # Tailwind CSS v4 design tokens
│       │   └── main.tsx       # Frontend bootstrap
│       └── package.json
├── data/                      # Unified Data Platform (DE, DA, DS)
│   ├── 01_raw/                # Immutable: Raw scraped/ingested snapshot files
│   ├── 02_interim/            # Cleaned & normalized intermediate datasets
│   ├── 03_processed/          # Star-schema tables (dim_regions, dim_schools, fact_*)
│   ├── 04_features/           # Machine learning feature store & K-Means clusters
│   ├── 05_analytics/          # Analytics mart (overview KPI, rankings, disparities)
│   ├── metadata/              # Data dictionary, lineage, and validation contracts
│   └── pipelines/             # Automation scripts (ETL, featurization, and app sync)
├── docs/                      # Technical documentation portal
│   ├── assets/                # Dedicated Documentation Visual Assets Folder
│   │   ├── brands/            # Brand Identity & Design Assets
│   │   └── screenshots/       # 12+ Dashboard full-page screenshots
│   ├── README.md              # This documentation index
│   ├── data/                  # Data engineering & analytics documentation portal
│   │   ├── README.md          # Data platform overview & role breakdown
│   │   ├── data-pipeline.md   # ETL pipeline specifications
│   │   ├── data-dictionary.md # Column and entity definitions
│   │   └── data-lineage.md    # Transformation lineage diagrams
│   ├── openapi.json           # OpenAPI 3.0 REST API specification (v1.1.0)
│   ├── product-requirements.md# Full PRD and feature specs
│   ├── architecture.md        # Monorepo and system architecture
│   ├── design-system.md       # EduAtlas Design System v1.0
│   ├── api-contracts.md       # REST API contracts
│   └── database-schema.md     # PostgreSQL models & ER diagram
├── package.json               # Root monorepo workspace definition
├── .yarnrc                    # Yarn registry & timeout configuration
└── yarn.lock                  # Yarn lockfile
```

---

## 3. The 17 Dashboard Pages (4 Logical Categories)

### A. Ringkasan & Visualisasi (Overview & Visuals)
1. **Overview Dashboard** (`/overview`) — Executive KPI summary, enrollment trends, level distributions, and top regional performance.
2. **Chart Playground** (`/visualizations`) — Interactive Recharts playground (Line, Grouped Bar, Stacked Area, Pie, Donut).
3. **Advanced Visualization** (`/visualizations/advanced`) — Apache ECharts visualizations (6-dimension Radar, Treemap, Sankey diagram, Gauge).

### B. Peta & Direktori (Maps & Directories)
4. **Interactive Maps** (`/maps`) — Leaflet geospatial pin mapping for schools and universities across Indonesia.
5. **Advanced Maps** (`/maps/advanced`) — MapLibre GL vector map with data-driven thematic styling.
6. **Data Table Explorer** (`/data-explorer`) — TanStack Table with multi-column search, sorting, filtering, and CSV export.
7. **Advanced Data Grid** (`/data-grid`) — Master-detail university grid with expandable study program sub-grids.
8. **Flow & Network** (`/flow`) — `@xyflow/react` hierarchical network diagram illustrating governance and institutional pipelines.

### C. Analitik Lanjut & Kebijakan (Executive Analytics & Policy)
9. **Simulator Proyeksi Kebijakan 'What-If'** (`/simulator`) — Interactive multi-variable demographic forecaster for teacher retirement, PPPK quotas, and student growth (2026–2030).
10. **Policy Brief & Research Studio** (`/policy-brief`) — Standardized Bappenas/Kemendikbud policy memorandum builder with automatic snapshot evidence pulling and 2-page PDF export.
11. **Studio Disparitas & Intervensi 3T** (`/equity-studio`) — Regional educational disparity studio featuring K-Means (K=3) clusters, 5-Pillar SPM radar benchmarks, and a directory of 514 regencies/cities.
12. **Transparansi & Efisiensi Anggaran** (`/budget-analytics`) — 20% mandatory spending analytics, spending per student metrics, and fiscal efficiency vs IPM quadrants across 38 provinces.
13. **Komparator Institusi Head-to-Head** (`/comparator`) — Side-by-side comparative matrix and spider radar charts for 2–4 schools (K-12) or universities.

### D. Operasional & Sistem (Operational & System)
14. **Calendar & Scheduling** (`/calendar`) — FullCalendar academic milestones, examinations, and holiday schedules.
15. **Timeline & Gantt** (`/timeline`) — Interactive quarterly roadmap and educational reform project progress.
16. **API & Data Status** (`/data-status`) — Backend diagnostic console, snapshot provenance inspector, and manual refetch controls.
17. **Reports & Export Studio** (`/reports`) — Executive narrative reports with one-click Excel (`.xlsx`) and PDF (`.pdf`) export generators.

---

## 4. Design System Highlights (v1.0)

* **Brand Colors:**
  * **Atlas Navy (`#153B66`):** Primary brand, headings, navigation.
  * **Knowledge Teal (`#25A9A1`):** Primary accent, active states, actions.
  * **Sky Cyan (`#8ED8E4`):** Supporting charts, highlights.
  * **Discovery Gold (`#FFC857`):** Secondary highlights, chart series.
* **Layout Specifications:**
  * **Sidebar:** Floating 180–200 px navigation with stacked icons above labels.
  * **Single-Line Header:** Unified row containing Page Title (left), Global Filters (center), and Account Profile `AD Andi Dharma ⌄` (right).
  * **Fixed Export Button:** Bottom-right floating Knowledge Teal export button.
* **Localization:** Indonesian formatting (`id-ID`) for all numbers, currencies, dates, and times.

---

## 5. Technology Stack Summary

| Layer | Technologies |
|---|---|
| **Backend** | NestJS 11, TypeScript, Express, PostgreSQL 17, Sequelize 6, Swagger OpenAPI, Terminus, Winston |
| **Frontend** | React 18, TypeScript, Vite 6, Tailwind CSS v4, Lucide React, TanStack Query v5, Axios |
| **Data Viz** | Recharts, Apache ECharts, Leaflet, MapLibre GL, FullCalendar, @xyflow/react |
| **Exports** | ExcelJS (multi-sheet spreadsheets), jsPDF (executive print briefs) |
