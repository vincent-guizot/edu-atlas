# EduAtlas — Product Requirements Document (PRD)

**Product Name:** EduAtlas  
**Tagline:** Explore Education Through Data.  
**Category:** Education Analytics & Data Visualization Platform  
**Domain:** Indonesia National Education Intelligence  
**Document Version:** 1.0.0  
**Status:** Approved & Implemented  

---

## 1. Executive Summary & Vision

EduAtlas is an end-to-end education intelligence and data exploration dashboard designed to provide stakeholders, researchers, educational administrators, and the public with comprehensive insights into Indonesian education.

Through interactive charts, geospatial maps, multi-dimensional grids, academic calendars, timelines, and network relationship diagrams, EduAtlas transforms complex educational metrics into intuitive, actionable visualizations.

### 1.1 Core Principles
* **Data Exploration, Not Administration:** EduAtlas is a data intelligence and analytical exploration platform, not a school information system (SIS) or student grading portal. There is no student authentication, tuition payment, or individual record administration.
* **Deterministic Snapshot Architecture:** All educational indicators, institutional records, and trends are delivered via immutable backend-generated data snapshots.
* **Transparent Demo Provenance:** All simulated metrics are clearly marked with `isDemoData: true` and snapshot metadata to ensure transparency without claiming to be official government census data.
* **High Information Density & Visual Polish:** Complies strictly with the EduAtlas Design System v1.0, utilizing Tailwind CSS v4 design tokens, single-line header alignment, floating sidebar, and accessible color contrasts.

---

## 2. Technology Stack

### 2.1 Backend Architecture
* **Runtime & Framework:** Node.js v20+ / v24+ with NestJS 11 (Express adapter)
* **Language:** TypeScript 5.7+
* **Database & ORM:** PostgreSQL 17 with Sequelize 6 & `sequelize-typescript`
* **Configuration & Validation:** `@nestjs/config` with `class-validator` & `class-transformer`
* **API Documentation:** `@nestjs/swagger` with OpenAPI 3.0 specification
* **Health & Reliability:** `@nestjs/terminus` and `@nestjs/throttler`
* **Logging:** Structured Winston logger

### 2.2 Frontend Architecture
* **Core Framework:** React 18 with TypeScript and Vite 6
* **Styling & Design Tokens:** Tailwind CSS v4 with custom theme tokens (Atlas Navy, Knowledge Teal, Sky Cyan, Discovery Gold)
* **Component Primitives:** shadcn/ui and Lucide React icons
* **Data Fetching & Cache:** TanStack Query v5 with centralized Axios client
* **Visualization Libraries:**
  * **Recharts:** Standard line, bar, area, pie, and donut charts
  * **Apache ECharts (`echarts-for-react`):** Advanced visualizations (Radar, Treemap, Sankey, Gauge)
  * **Leaflet & React Leaflet:** Interactive institutional geospatial pin maps
  * **MapLibre GL JS:** High-performance vector tile maps with data-driven thematic rendering
  * **TanStack Table:** Filterable, sortable, paginated data explorer
  * **FullCalendar:** Academic event schedules and examination calendars
  * **@xyflow/react:** Interactive hierarchical workflow and education governance network graph
  * **ExcelJS & jsPDF:** Client-side multi-sheet Excel spreadsheet generation and printable PDF reports

---

## 3. Monorepo Repository Structure

```text
EduAtlas/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── common/             # Interceptors, exception filters, DTOs
│   │   │   ├── config/             # Database & environment configuration
│   │   │   ├── database/           # Sequelize models & seeders
│   │   │   ├── health/             # Terminus health check endpoint
│   │   │   ├── modules/            # 10 business domain modules
│   │   │   └── main.ts             # Application entrypoint (port 4000)
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/
│       ├── public/                 # Static assets, GeoJSON maps, icons
│       ├── src/
│       │   ├── app/                # Routes & QueryClientProvider
│       │   ├── components/         # Layout (AppShell, Sidebar, PageHeader), UI tokens
│       │   ├── features/           # 12 interactive dashboard feature views
│       │   ├── lib/                # API client, number/date formatters
│       │   ├── types/              # TypeScript interface definitions
│       │   ├── index.css           # Tailwind CSS v4 theme variables
│       │   └── main.tsx            # Application entrypoint (port 5173)
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
├── brand/                          # Brand Identity & Design Assets
├── docs/                           # Official technical documentation
│   ├── README.md                   # Documentation index & guide
│   ├── product-requirements.md     # This Product Requirements Document
│   ├── architecture.md             # System architecture & data flow
│   ├── api-contracts.md            # REST API contracts & Swagger schema
│   ├── database-schema.md          # PostgreSQL tables & Sequelize models
│   └── design-system.md           # EduAtlas Design System v1.0 specifications
├── package.json                    # Root monorepo workspace configuration
├── .yarnrc                         # Yarn registry & timeout configuration
├── yarn.lock                       # Yarn lockfile
└── README.md                       # Repository overview and quickstart guide
```

---

## 4. Backend Domain Modules

The backend API exposes services under the `/api/v1` namespace across 10 functional modules:

| Module | Route Namespace | Primary Responsibility |
|---|---|---|
| **Overview** | `/api/v1/education/overview` | Aggregated national KPIs, metric trends, national grade distribution, and regional summaries. |
| **Schools** | `/api/v1/education/schools` | Primary/secondary school directory, accreditation, ownership, student/teacher counts, facilities index. |
| **Universities** | `/api/v1/education/universities` | Higher education directory, institution types (PTN/PTS/PTKIN/Poltek), faculties, programs, national ranking. |
| **Students** | `/api/v1/education/students` | Regional student counts, demographics, student-to-school ratios. (Excludes PII). |
| **Teachers** | `/api/v1/education/teachers` | Teacher counts, qualification levels, regional student-to-teacher ratio (STR) benchmarks. |
| **Geography** | `/api/v1/education/regions` | 38 Indonesian provinces, coordinate centroids, performance scores, GeoJSON map layers. |
| **Analytics** | `/api/v1/education/analytics` | Analytical aggregations for multi-year enrollment, graduation/dropout rates, 6-dimension radar metrics, and island distributions. |
| **Calendar** | `/api/v1/education/calendar` | Academic schedule, national examination dates, semester breaks, milestone tracking. |
| **Reports** | `/api/v1/education/reports` | Executive summary narratives and formatted datasets for Excel and PDF exports. |
| **Snapshots** | `/api/v1/education/snapshots` | Data snapshot versioning, provenance metadata, and historical retrieval. |

---

## 5. Snapshot Data Architecture

EduAtlas treats the backend database as the single source of truth through immutable data snapshots:

1. **Deterministic Seeding:** The seeders generate realistic, mathematically sound data for Indonesian education:
   * 38 provinces spanning 6 island clusters (Jawa, Sumatera, Kalimantan, Sulawesi, Bali & Nusa Tenggara, Maluku & Papua).
   * Realistic student-to-teacher ratios (typically 14:1 to 22:1).
   * Accurate institutional naming patterns (e.g., SMAN, SMKN, PTN, PTS).
2. **Metadata Envelope:** Every API response wraps data inside a standard envelope:
   ```json
   {
     "data": { ... },
     "meta": {
       "snapshotId": "snp-2026-10-20",
       "snapshotDate": "2026-10-20T00:00:00.000Z",
       "period": "2026",
       "source": "EduAtlas Demo Dataset",
       "isDemoData": true,
       "pagination": {
         "total": 120,
         "page": 1,
         "limit": 20,
         "totalPages": 6
       }
     }
   }
   ```
3. **Data Integrity:** Missing values are represented as `null` or explicit indicators rather than arbitrary zeros.

---

## 6. The 12 Required Dashboard Pages

### 6.1 Overview Dashboard (`/overview`)
* **Purpose:** Executive landing view of Indonesian education.
* **Key Components:**
  * 4 Primary KPI cards: Total Schools, Total Students, Total Teachers, Total Universities.
  * 5-Year Enrollment & Completion Trend line chart (Recharts).
  * Education Level Breakdown (SD, SMP, SMA, SMK, Perguruan Tinggi) donut chart.
  * Top Performing Provinces leaderboard table.
* **Interactions:** Filter by reporting period, geographic scope, and education level.

### 6.2 Chart Playground (`/visualizations`)
* **Purpose:** Interactive exploration of standard chart types.
* **Key Components:**
  * Multi-series line chart (enrollment vs graduation over 2021–2026).
  * Grouped column bar chart (student count by education level and gender).
  * Area chart (cumulative educational budget allocation trend).
  * Proportional donut and pie charts.
* **Interactions:** Toggle metric series, hover tooltips, responsive layout switching.

### 6.3 Advanced Visualization (`/visualizations/advanced`)
* **Purpose:** Deep-dive multi-dimensional statistical charts powered by Apache ECharts.
* **Key Components:**
  * 6-Dimension Radar Chart: Comparing regional education quality (Facilities, Curriculum, Teacher Competence, Digital Access, Budget Efficiency, Student Output).
  * Island Distribution Treemap: Hierarchical visualization of student density across island clusters.
  * Student Progression Sankey Diagram: Transition flows from Primary (SD) &rarr; Junior High (SMP) &rarr; Senior High (SMA/SMK) &rarr; Higher Ed &rarr; Workforce.
  * National Education Quality Index Gauge.

### 6.4 Interactive Maps (`/maps`)
* **Purpose:** Geospatial mapping of educational institutions across the Indonesian archipelago.
* **Key Components:**
  * Leaflet map centered at Indonesian coordinates (`-0.7893, 113.9213`).
  * Custom colored pin markers for schools (Knowledge Teal) and universities (Atlas Navy).
  * Interactive marker popups displaying institution NPSN, address, accreditation, and student count.
  * Map legend and institution type filter.

### 6.5 Advanced Maps (`/maps/advanced`)
* **Purpose:** High-performance vector map rendered with MapLibre GL.
* **Key Components:**
  * Data-driven thematic choropleth/circle layer visualizing provincial performance scores.
  * Dynamic radius scaling based on student enrollment.
  * Interactive province hover cards and island cluster zoom controls.

### 6.6 Data Table Explorer (`/data-explorer`)
* **Purpose:** Searchable and sortable registry of Indonesian schools.
* **Key Components:**
  * TanStack Table implementation with server-compatible client pagination.
  * Multi-column search (name, NPSN, city, province).
  * Filter dropdowns: Education level (SD/SMP/SMA/SMK), Ownership (Negeri/Swasta), Accreditation (A/B/C).
  * Quick CSV export of active filtered dataset.

### 6.7 Advanced Data Grid (`/data-grid`)
* **Purpose:** High-density enterprise grid for universities and higher education programs.
* **Key Components:**
  * Master-detail view: University list with expandable sub-grid of academic programs.
  * Metrics: Lecturer-to-student ratios, accreditation tier, faculty count, national ranking.
  * Column sorting, search filtering, and dense row display.

### 6.8 Calendar & Scheduling (`/calendar`)
* **Purpose:** Academic calendar tracking national educational milestones.
* **Key Components:**
  * FullCalendar integration supporting Month, Week, and Day views.
  * Event categories: National Exams (UTBK/SNBT), Semester Break (Libur Semester), Midterm Exams (PTS/PAS), Academic Milestones.
  * Interactive event click modal showing full description, target audience, and dates.

### 6.9 Timeline & Gantt (`/timeline`)
* **Purpose:** Chronological timeline of educational reform programs and academic year milestones.
* **Key Components:**
  * Quarterly breakdown (Q1–Q4 2026).
  * Visual progress bars, milestone flags, status badges (`Completed`, `Ongoing`, `Upcoming`).
  * Current date indicator ("Hari Ini").

### 6.10 Flow & Network Diagram (`/flow`)
* **Purpose:** Interactive governance and systemic relationship flow diagram.
* **Key Components:**
  * Visualized using `@xyflow/react` with custom styled nodes and smooth bezier edges.
  * Node tiers: Ministry / Regulator (Kemendikbudristek, Kemenag) &rarr; Education Stages (Dasar, Menengah, Tinggi) &rarr; Institutional Types &rarr; Career / Workforce.
  * Zoom, pan, mini-map, and interactive node selection highlighting.

### 6.11 API & Data Integration Status (`/data-status`)
* **Purpose:** Diagnostic health monitor and snapshot synchronization console.
* **Key Components:**
  * Real-time status cards for backend REST endpoints (latency, HTTP status, cache TTL).
  * Active snapshot metadata inspector (date, version, demo flag, provenance).
  * On-demand "Perbarui Data" (manual refetch) trigger.
  * Visual error simulation showcase.

### 6.12 Reports & Export Studio (`/reports`)
* **Purpose:** Executive reporting dashboard and multi-format export center.
* **Key Components:**
  * Narrative executive summary highlighting national literacy rates, accreditation distribution, and teacher welfare.
  * Quick action export cards for Excel (.xlsx) and PDF (.pdf).
  * Dynamic Excel export powered by ExcelJS with multi-sheet formatting and summary headers.
  * Clean, print-ready PDF generation powered by jsPDF.

---

## 7. Global Controls & Application Shell

1. **Floating Sidebar:**
   * Compact 180–200 px width with Atlas Navy styling.
   * Vertical navigation with icons placed prominently above category labels.
   * Active tab highlight using Knowledge Teal.
2. **Unified Single-Line Header:**
   * Left: Page title and breadcrumb.
   * Center: Global filter dropdowns (Scope / Indonesia, Year / 2026, Level / Semua Jenjang, Range / Semester Genap).
   * Right: User account profile card (`[AD] Andi Dharma ⌄`).
   * Clean alignment on a single horizontal row; notifications removed.
3. **Floating Export Button:**
   * Knowledge Teal button fixed at the bottom-right corner (`z-index: 50`).
   * One-click trigger to export the currently active filtered dataset.

---

## 8. Indonesian Localization Standards

* **Locale:** `id-ID`
* **Numbers:** Thousands separated with dots (e.g., `4.250.000`)
* **Percentages:** Decimal separated with commas (e.g., `99,6%`)
* **Dates:** Indonesian month names (e.g., `20 Oktober 2026`)
* **Time:** Indonesian Western Standard Time format (e.g., `10:24 WIB`)

---

## 9. Definition of Done & Quality Standards

- [x] All 12 pages implemented as functional, navigable routes.
- [x] Backend NestJS API with 10 business modules and OpenAPI documentation.
- [x] PostgreSQL database seeded with deterministic Indonesian educational demo data.
- [x] Uniform API response envelope (`data` + `meta`).
- [x] Fully compliant with EduAtlas Design System v1.0.
- [x] Single-line header with centered global filters and right-aligned user profile.
- [x] Zero TypeScript compilation errors (`tsc --noEmit` clean).
- [x] No runtime dependencies on Docker; streamlined local execution.
