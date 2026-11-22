# EduAtlas — REST API Contracts Specification

**Base URL:** `http://localhost:4000/api/v1`  
**Swagger UI:** `http://localhost:4000/api/docs`  
**Swagger OpenAPI Spec:** `docs/openapi.json`  
**Document Version:** 1.1.0  
**Snapshot Version:** `snp-2026-11-22` (Curated Data Lake Sync)  
**Status:** Implemented & Verified  

---

## Card summary from domain tables

Individual page cards: `GET /api/v1/pages/:page/cards/:cardId`.
Discover IDs, supported filters and expected statuses with `GET /api/v1/pages`
or `GET /api/v1/pages/:page/cards`. These routes query one card at a time and return
their own source/coverage/provenance metadata. See [QA guide](page-card-qa.md)
and [generated endpoint matrix](postman/page-card-endpoints.md).

`GET /api/v1/cards` returns five database aggregates for sources, imports,
timeline programs, partnerships and report templates. It uses the standard
`data`/`meta` envelope; metadata contains `source`, `generatedAt`, and `isDemoData`.
No snapshot id or reporting period is asserted for these current operational counts.
Each card includes `key`, `title`, `value`, `secondaryLabel`, `secondaryValue`, and
`isDemoData`. See [card-data-tables.md](card-data-tables.md) for definitions and demo limits.

## 1. Response Envelope Standard

Every API response emitted by the EduAtlas backend is standardized by the NestJS `TransformInterceptor`:

```json
{
  "data": {},
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

### Error Response Envelope
```json
{
  "statusCode": 404,
  "timestamp": "2026-10-20T10:00:00.000Z",
  "path": "/api/v1/education/schools/invalid-id",
  "message": "School with ID invalid-id not found"
}
```

---

## 2. API Endpoints by Module

### 2.1 System & Health
* **`GET /api/v1/health`**
  * Description: Health check indicator and server status.
  * Response: `{ status: "ok", info: { postgres: { status: "up" } }, details: { ... } }`

---

### 2.2 Snapshots Module (`/education/snapshots`)
* **`GET /api/v1/education/snapshots`**
  * Description: List all historical snapshots.
* **`GET /api/v1/education/snapshots/latest`**
  * Description: Retrieve the latest active data snapshot metadata.
* **`GET /api/v1/education/snapshots/:id`**
  * Description: Retrieve snapshot metadata by identifier.

---

### 2.3 Overview Module (`/education/overview`)
* **`GET /api/v1/education/overview`**
  * Query Parameters:
    * `period` (optional, string, e.g. `'2026'`)
    * `regionId` (optional, string, e.g. `'reg-jawa-barat'`)
  * Response Data:
    ```json
    {
      "kpi": {
        "totalSchools": 12500,
        "totalStudents": 4250000,
        "totalTeachers": 285000,
        "totalUniversities": 320,
        "schoolGrowth": 2.4,
        "studentGrowth": 3.8,
        "teacherGrowth": 1.9,
        "universityGrowth": 1.2
      },
      "enrollmentTrend": [
        { "year": 2021, "students": 3800000 },
        { "year": 2026, "students": 4250000 }
      ],
      "levelDistribution": [
        { "level": "SD", "count": 5200 },
        { "level": "SMP", "count": 3400 },
        { "level": "SMA", "count": 2100 },
        { "level": "SMK", "count": 1800 }
      ],
      "topRegions": [
        { "id": "reg-jawa-barat", "name": "Jawa Barat", "score": 88.5 }
      ]
    }
    ```

---

### 2.4 Schools Module (`/education/schools`)
* **`GET /api/v1/education/schools`**
  * Query Parameters:
    * `page` (optional, default: `1`)
    * `limit` (optional, default: `20`)
    * `search` (optional, string)
    * `regionId` (optional, string)
    * `educationLevel` (optional, enum: `'SD'`, `'SMP'`, `'SMA'`, `'SMK'`)
    * `ownership` (optional, enum: `'Negeri'`, `'Swasta'`)
    * `accreditation` (optional, enum: `'A'`, `'B'`, `'C'`)
  * Response Data: Array of school records with pagination meta.
* **`GET /api/v1/education/schools/:id`**
  * Description: Get comprehensive school detail with associated province.

---

### 2.5 Universities Module (`/education/universities`)
* **`GET /api/v1/education/universities`**
  * Query Parameters:
    * `page` (optional, default: `1`)
    * `limit` (optional, default: `20`)
    * `search` (optional, string)
    * `type` (optional, enum: `'PTN'`, `'PTS'`, `'PTKIN'`, `'Politeknik'`)
    * `accreditation` (optional, enum: `'Unggul'`, `'Baik Sekali'`, `'Baik'`)
  * Response Data: Array of universities with embedded `programs` array.
* **`GET /api/v1/education/universities/:id`**
  * Description: Single university details and full list of academic programs.

---

### 2.6 Students & Teachers Modules
* **`GET /api/v1/education/students`**
  * Query Parameters: `regionId` (optional)
  * Returns: Aggregated student demographics, totals by level, and student-to-school ratios.
* **`GET /api/v1/education/teachers`**
  * Query Parameters: `regionId` (optional)
  * Returns: Aggregated teacher counts, certified teacher percentage, and student-to-teacher ratio (STR).

---

### 2.7 Geography & Maps Module (`/education/regions`)
* **`GET /api/v1/education/regions`**
  * Returns: 38 provinces with island cluster, performance index, and accreditation breakdown.
* **`GET /api/v1/education/regions/map`**
  * Query Parameters: `institutionType` (optional, enum: `'all'`, `'schools'`, `'universities'`)
  * Returns: GeoJSON FeatureCollection and array of institution marker coordinates.
* **`GET /api/v1/education/regions/:id`**
  * Returns: Provincial profile, stats, and top institutions.

---

### 2.8 Analytics Module (`/education/analytics`)
* **`GET /api/v1/education/analytics/enrollment`**
  * Returns: Multi-year enrollment trends (2021–2026) across SD, SMP, SMA, SMK, and Higher Education.
* **`GET /api/v1/education/analytics/graduation`**
  * Returns: National completion rates, dropout rates, and transitional percentages.
* **`GET /api/v1/education/analytics/performance`**
  * Returns: 6-Dimension radar chart scores (Fasilitas, Kurikulum, Guru, Akses Digital, Efisiensi Anggaran, Output Siswa).
* **`GET /api/v1/education/analytics/distribution`**
  * Returns: Island distribution matrix and student-to-teacher density map.

---

### 2.9 Calendar Module (`/education/calendar`)
* **`GET /api/v1/education/calendar`**
  * Query Parameters:
    * `category` (optional, enum: `'Akademik'`, `'Ujian'`, `'Libur'`, `'Pendaftaran'`, `'Milestone'`)
    * `status` (optional, enum: `'Upcoming'`, `'Ongoing'`, `'Completed'`)
    * `targetAudience` (optional)
  * Returns: Array of FullCalendar-compatible academic events.
* **`GET /api/v1/education/calendar/upcoming`**
  * Returns: 10 next upcoming academic milestones.

---

### 2.10 Reports Module (`/education/reports`)
* **`GET /api/v1/education/reports/summary`**
  * Query Parameters: `period` (optional, default: `'2026'`)
  * Returns: Narrative summary, key highlights, literacy metrics, and policy recommendations.
* **`GET /api/v1/education/reports/export-data`**
  * Query Parameters: `type` (optional, enum: `'all'`, `'regions'`, `'schools'`, `'universities'`)
  * Returns: Flattened tabular datasets structured for ExcelJS and jsPDF generation.

---

### 2.11 Domain Cards Module (`/cards`)
* **`GET /api/v1/cards`**
  * Description: Aggregated domain counts across operational tables: Data Sources, Data Imports, Timeline Programs, Institution Links, and Report Definitions.
  * Response Data: Array of card summary objects (`key`, `title`, `value`, `secondaryLabel`, `secondaryValue`, `isDemoData`).

---

### 2.12 Page Cards Module (`/pages`)
* **`GET /api/v1/pages`**
  * Description: Discover all 12 registered dashboard pages and their metadata.
* **`GET /api/v1/pages/:page/cards`**
  * Description: Retrieve all card summaries and configured metrics for a specific dashboard page (e.g., `overview`, `schools`, `universities`, `maps`).
* **`GET /api/v1/pages/:page/cards/:cardId`**
  * Description: Query a single isolated card metric with its specific source provenance and filter options.

---

## 3. OpenAPI 3.0 & Swagger UI Specification

EduAtlas provides an interactive Swagger UI for live API exploration, testing, and contract verification:

* **Interactive Swagger UI:** [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
* **OpenAPI 3.0 JSON Specification:** [`docs/openapi.json`](file:///D:/All%20Coding/05%20-%20Applications/Web%20Applications/EduAtlas/docs/openapi.json)
* **Postman Collection:** [`docs/postman/page-cards.postman_collection.json`](file:///D:/All%20Coding/05%20-%20Applications/Web%20Applications/EduAtlas/docs/postman/page-cards.postman_collection.json)

Semua endpoint dilindungi oleh interceptor standar respons global (`ResponseTransformInterceptor`), menjamin bahwa seluruh data dikemas dalam amplop `{ "data": ..., "meta": ... }` secara konsisten.
