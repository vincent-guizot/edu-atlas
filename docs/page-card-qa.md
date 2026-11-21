# QA endpoint per page dan card

Setiap card memiliki URL sendiri. Katalog saat ini berisi **102 card** pada **12 menu**:
**81 didukung database**, **21 belum memiliki sumber atau kontrak query yang cukup**.
Katalog mencakup kelompok metrik, grafik, daftar, dan informasi utama; rincian modal
dan seluruh variasi tab frontend bukan endpoint baru otomatis.

- `GET /api/v1/pages`: semua page, cardId, endpoint, tabel sumber, filter, dan status yang diharapkan.
- `GET /api/v1/pages/overview/cards`: katalog card pada Overview.
- `GET /api/v1/pages/overview/cards/total-schools`: hanya Card Total Sekolah.
- Endpoint lama `GET /api/v1/cards` tetap mengembalikan lima ringkasan operasional.

Nama page mengikuti slug katalog; `sidebarPath` menunjuk URL menu frontend sebenarnya.
Contoh: page `advanced-visualization` berasal dari `/visualizations/advanced`.
Semua URL di atas mengikuti API_PREFIX; default `/api/v1`.

## Contoh per card

| Page | Informasi | GET endpoint |
|---|---|---|
| Overview | Total Sekolah | /api/v1/pages/overview/cards/total-schools |
| Overview | Total Siswa | /api/v1/pages/overview/cards/total-students |
| Overview | Tren Siswa | /api/v1/pages/overview/cards/enrollment-trend?year=2026 |
| Data Explorer | Daftar sekolah | /api/v1/pages/data-explorer/cards/schools-table?limit=10 |
| Calendar | Agenda tanggal tertentu | /api/v1/pages/calendar/cards/agenda-today?date=2026-12-25 |
| Timeline | Ringkasan program | /api/v1/pages/timeline/cards/program-summary |
| Flow | Kemitraan | /api/v1/pages/flow/cards/partnership-summary |
| Data Status | Riwayat impor | /api/v1/pages/data-status/cards/import-history |
| Reports | Template laporan | /api/v1/pages/reports/cards/report-templates |

[Matriks lengkap per page dan card](postman/page-card-endpoints.md) dibuat dari katalog runtime.

## Kontrak respons

```json
{
  "data": {
    "page": "overview",
    "cardId": "total-schools",
    "title": "Total Sekolah",
    "kind": "metric",
    "result": { "value": 1820, "sourceRows": 1 }
  },
  "meta": {
    "tables": ["directory.regions"],
    "coverage": "regional-aggregates",
    "filters": { "regionId": "reg-dki-jakarta" },
    "isDemoData": null,
    "provenance": "unverified",
    "rowCount": 1,
    "generatedAt": "<waktu query>"
  }
}
```

Contoh nilai berlaku pada seed demo dan filter regionId di atas. `result` berbentuk
object pada metric, array pada series/list. Card dihitung langsung melalui query
masing-masing. Memanggil satu card tidak menghitung seluruh dashboard.

`isDemoData=null` berarti tabel asal belum memiliki penanda provenance yang cukup,
bukan berarti data asli. `true` berarti ada record demo pada hasil yang dirangkum;
`false` hanya berarti tidak ada flag demo yang aktif pada hasil tersebut. Flag ini
bukan sertifikasi keaslian. Snapshot/period statis tidak disisipkan pada metadata baru.

## Filter dan kondisi kosong

- Filter diterima hanya jika tercantum pada card di katalog. Filter tak dikenal atau
  tak relevan ditolak dengan `400`; tidak diam-diam diabaikan.
- `regionId`: satu ID, maksimal 100 karakter alfanumerik, underscore, atau tanda minus.
  ID yang valid tetapi tidak memiliki data menghasilkan hasil kosong.
- `year`: integer 1900–2200. Hanya indikator, snapshot, dan kalender yang memang
  menyimpan informasi periode yang menerimanya. Total regional saat ini tidak
  mendukung filter tahun karena tidak ada histori regional.
- `date`: tanggal kalender valid YYYY-MM-DD; card agenda memakai tanggal UTC saat
  ini jika tidak diberikan. Untuk QA deterministik, berikan tanggal eksplisit.
- `limit`: integer 1–100. List default 20, beberapa top-card default 5/10, snapshot
  default 1; series default 100. Default masing-masing tersedia di katalog.
- List mengembalikan `totalRecords` sebelum limit. Series mengembalikan
  `possiblyTruncated=true` jika hasil mencapai limit; flag itu menyatakan kemungkinan,
  bukan bukti ada baris tambahan. Gunakan filter regionId/year untuk mempersempit hasil.
- List merupakan preview terbatas, tanpa offset/search; endpoint direktori lama tetap
  tersedia untuk pagination dan pencarian penuh.
- SUM tanpa record menghasilkan `value=null` dan `sourceRows=0`; rasio dengan jumlah
  guru nol juga null. List/series kosong menghasilkan array kosong. COUNT bisa bernilai 0.

Agregat wilayah berasal dari regions; daftar institusi berasal dari direktori contoh.
COUNT daftar sekolah tidak diharapkan sama dengan total agregat wilayah pada seed demo.
Program mengikuti status tersimpan. Agenda harian/mendatang memakai tanggal mulai/akhir,
sehingga tidak bergantung pada status event seed yang dapat kedaluwarsa.

## Status QA

| HTTP | Arti |
|---:|---|
| 200 | Card didukung; hasil boleh kosong |
| 400 | Filter tidak valid, berulang, atau tidak didukung |
| 404 | Page/cardId tidak dikenal |
| 501 | Card terdaftar, tetapi belum ada sumber atau query yang memadai |

Card 501 mencakup radar, aliran siswa, histori jumlah guru, geometri choropleth,
uptime, dan lainnya. Respons menyebut alasan spesifik. Jangan menandainya sebagai
card yang sudah memenuhi kebutuhan data produk hanya karena sesuai kontrak 501.

## Collection Postman

[Collection QA per page/card](postman/page-cards.postman_collection.json) menyediakan
folder untuk setiap menu, pemeriksaan status dan identitas card, serta kasus negatif.
Variabel `baseUrl` default `http://localhost:4000/api/v1`; untuk port host Docker
di compose proyek ini gunakan `http://localhost:3530/api/v1`.

Collection tidak melakukan perubahan database. Card yang belum didukung memang
memiliki assertion status 501. Ganti baseUrl sesuai environment yang ingin diperiksa.
Untuk membuat ulang collection dan matriks dari kode:

```powershell
yarn qa:cards:export
```

Setup data dan backend memakai perintah proyek yang sudah tersedia (`yarn db:setup`,
`yarn dev:backend`). Endpoint baru tidak membutuhkan migration tambahan pada turn ini.
Halaman frontend belum dihubungkan ke endpoint per card. Database utama tidak diubah
oleh pengujian; regresi HTTP dijalankan pada database sementara eduatlas_verify_*.
