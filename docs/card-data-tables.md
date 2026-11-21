# Lima tabel untuk kartu informasi

Migration `002-card-data` menambahkan **5 tabel** ke empat schema yang ada.
Total sekarang **14 tabel**: 12 tabel data dan 2 tabel teknis.
Ini tidak menambahkan schema baru atau mengubah halaman frontend.

| Schema | Jumlah tabel setelah migration |
|---|---:|
| directory | 4 |
| academic | 3 |
| analytics | 3 |
| system | 4 |

## Card: Sumber Data Aktif

**Tabel:** `system.data_sources` — menu API & Data Status.

- Kolom: id, name (unik), provider, sourceType (snapshot/file/api), url,
  isEnabled, isDemoData, createdAt, updatedAt.
- Nilai utama: jumlah sumber dengan isEnabled=true.
- Informasi tambahan: total sumber terdaftar dan lembaga penyedia.
- Enabled berarti dikonfigurasi aktif, bukan bukti koneksi API berhasil.

## Card: Impor Selesai

**Tabel:** `system.data_imports` — menu API & Data Status / Update History.

- Kolom: id, sourceId FK, status (queued/running/completed/failed), startedAt,
  finishedAt, rowsRead, rowsAccepted, rowsRejected, errorMessage, isDemoData,
  createdAt, updatedAt.
- Relasi: sourceId → system.data_sources.id, RESTRICT pada delete.
- Nilai utama: jumlah impor dengan status completed.
- Informasi tambahan: total rowsAccepted pada impor completed.
- Constraint: jumlah baris nonnegatif; diterima+ditolak tidak melebihi dibaca;
  waktu selesai tidak mendahului waktu mulai.
- Tabel ini menyimpan catatan pekerjaan. Worker pengimpor data asli belum dibuat.

## Card: Program Berjalan

**Tabel:** `academic.timeline_programs` — menu Timeline & Gantt.

- Kolom: id, name, category, owner, regionId FK opsional, startDate, endDate,
  status (planned/ongoing/completed), progress, isDemoData, createdAt, updatedAt.
- Relasi: regionId → directory.regions.id, RESTRICT pada delete.
- Nilai utama: jumlah program dengan status ongoing.
- Informasi tambahan: jumlah program completed; detail dapat memakai progress.
- Constraint: progress 0–100 dan endDate >= startDate.
- Status mengikuti nilai yang dicatat, tidak otomatis mengikuti tanggal saat ini.
  Task, dependency, dan milestone Gantt tetap membutuhkan tabel tambahan.

## Card: Kemitraan Aktif

**Tabel:** `directory.institution_links` — menu Flow & Network.

- Kolom: id, universityId FK, partnerName, partnerType
  (education/industry/government), status (active/inactive), startDate, endDate,
  projectCount, isDemoData, createdAt, updatedAt.
- Relasi: universityId → directory.universities.id, RESTRICT pada delete.
- Nilai utama: jumlah kemitraan active.
- Informasi tambahan: jumlah projectCount pada kemitraan active.
- Constraint: proyek nonnegatif; tanggal akhir tidak mendahului tanggal awal.
- Ruang lingkup: kemitraan universitas dengan mitra bernama. Partner belum menjadi
  entitas FK, dan tabel ini tidak menyimpan aliran siswa antarsekolah.

## Card: Template Laporan Aktif

**Tabel:** `analytics.report_definitions` — menu Reports & Export.

- Kolom: id, name, category, description, defaultFormat (PDF/XLSX/CSV), snapshotId
  FK opsional, isActive, isDemoData, createdAt, updatedAt.
- Relasi: snapshotId → analytics.snapshots.id, RESTRICT pada delete.
- Nilai utama: jumlah definisi laporan isActive=true.
- Informasi tambahan: jumlah format unik dari definisi aktif.
- Definisi tidak menyatakan berkas sudah dibuat atau pernah diunduh.

## Seeder dan API

`yarn db:migrate` menerapkan migration 002 setelah 001. `yarn db:seed` menjalankan
seed education-demo-v2 lalu card-demo-v1. Masing-masing versi memakai transaksi,
advisory lock, bulk insert, dan manifest kepemilikan sendiri. Seed kartu yang gagal
tidak membatalkan seed pendidikan yang telah selesai; menjalankan ulang akan
melewati versi selesai dan mencoba versi kartu lagi.

Semua contoh kartu adalah **simulasi**, diberi isDemoData=true dan nama Demo.
Contoh log impor bukan hasil menghubungi atau mengimpor sumber eksternal.

Endpoint baca: **GET /api/v1/cards** (sesuaikan API_PREFIX jika diubah).
Lima agregat dihitung dalam satu query PostgreSQL dan diurutkan secara tetap.
Data kosong menghasilkan lima kartu bernilai nol.

```json
{
  "data": [
    {
      "key": "imports",
      "title": "Impor Selesai",
      "value": 1,
      "secondaryLabel": "Baris diterima pada impor selesai",
      "secondaryValue": 24,
      "isDemoData": true
    }
  ],
  "meta": {
    "source": "PostgreSQL domain tables",
    "generatedAt": "<waktu query>",
    "isDemoData": true
  }
}
```

Contoh di atas memperlihatkan satu elemen; respons sebenarnya berisi lima kartu.
isDemoData=true jika ada baris demo pada tabel pendukung kartu. Nilai mencakup semua
baris yang saat ini tersimpan, tanpa filter periode. Halaman frontend belum
diubah untuk memakai endpoint ini.

## Undo

Hentikan backend sebelum undo. `yarn db:seed:undo` membatalkan seed kartu terlebih
dahulu, kemudian seed pendidikan. Record yang sudah ada sebelum seed dipertahankan;
undo ditolak bila record milik seed sudah diedit atau punya referensi yang menghalangi.
Versi seed yang selesai dihapus dari jurnal hanya setelah undo transaksi berhasil.

`yarn db:migrate:undo` sekarang membatalkan **satu versi terakhir**. Untuk versi 002,
kelima tabel hanya boleh dihapus jika kosong; tidak ada CASCADE. Bila ada data pengguna,
undo ditolak dan transaksi di-rollback. Undo sekali lagi mengembalikan layout 001
ke public sambil mempertahankan baris dan tabel teknis. Startup backend akan
menerapkan versi yang belum aktif lagi.

Pengujian memakai database sementara eduatlas_verify_*, bukan database utama.
