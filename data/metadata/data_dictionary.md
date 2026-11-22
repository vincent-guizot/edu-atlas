# Data Dictionary — EduAtlas Unified Data Repository

Dokumen ini mendefinisikan seluruh struktur tabel, tipe data, rentang nilai, dan deskripsi kolom di dalam folder `data/` yang dikelola secara kolaboratif oleh tim **Data Engineer (DE)**, **Data Analyst (DA)**, dan **Data Science (DS)**.

---

## 1. Lapisan Data Mentah (`01_raw/`)

| Folder Sumber | File Pattern | Format | Pemilik | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| `kemdikbud/` | `YYYY-MM-DD_raw_schools_dataset.csv` | CSV (Raw) | DE | Snapshot mentah sekolah, guru, siswa, akreditasi (immutable). |
| `bps/` | `YYYY-MM-DD_raw_macro_indicators.json` | JSON | DE | Indikator makro BPS (IPM, APM, pengeluaran pendidikan, kemiskinan). |
| `pddikti/` | `YYYY-MM-DD_raw_universities.json` | JSON | DE | Data perguruan tinggi, mahasiswa aktif, dan publikasi. |

---

## 2. Lapisan Pembersihan Awal (`02_interim/`)

### Tabel: `schools_clean.csv`
* **Deskripsi:** Hasil standarisasi teks, encoding, dan penanganan nilai hilang sebelum dimodelkan ke star schema.
* **Kolom:**
  * `school_id` (String): ID unik sekolah (`sch-0001`).
  * `npsn` (String): Nomor Pokok Sekolah Nasional 8 digit.
  * `school_name` (String): Nama resmi sekolah (Title Case, tanpa spasi ganda).
  * `education_level` (Enum): Jenjang pendidikan (`SD`, `SMP`, `SMA`, `SMK`).
  * `ownership` (Enum): Status kepemilikan (`Negeri`, `Swasta`).
  * `province_id` (String): Foreign key ke provinsi (`reg-dki-jakarta`, `reg-jabar`, dll).
  * `province_name` (String): Nama baku provinsi.
  * `city` (String): Nama kabupaten/kota.
  * `latitude` / `longitude` (Float): Titik koordinat geografis.
  * `student_total` (Integer): Jumlah siswa terdaftar (> 0).
  * `teacher_total` (Integer): Jumlah guru aktif (> 0).
  * `student_teacher_ratio` (Float): Rasio murid terhadap guru (`student_total / teacher_total`).
  * `accreditation` (Enum): Tingkat akreditasi BAN-S/M (`A`, `B`, `C`).
  * `facility_score` (Float): Skor kelayakan sarana & prasarana (skala 0.0 - 100.0).

---

## 3. Lapisan Data Bersih & Berelasi (`03_processed/`)

Model data dimensional (Star Schema) sebagai sumber tunggal kebenaran (*Single Source of Truth*):

### Tabel Dimensi: `dim_regions.csv`
* `province_id` (PK, String): Kode unik wilayah provinsi.
* `province_name` (String): Nama provinsi.
* `island` (String): Gugus pulau utama (Jawa, Sumatera, Kalimantan, Sulawesi, dll).
* `ipm` (Float): Indeks Pembangunan Manusia (0 - 100).
* `apm_sd`, `apm_smp`, `apm_sma` (Float): Angka Partisipasi Murni per jenjang (%).
* `avg_school_years` (Float): Rata-rata lama sekolah dalam tahun.
* `poverty_rate` (Float): Persentase penduduk miskin (%).
* `education_budget_billion` (Float): Anggaran fungsi pendidikan (Milyar IDR).

### Tabel Dimensi: `dim_schools.csv`
* `school_id` (PK, String): Kode identitas sekolah.
* `npsn` (String): Kode unik nasional 8 digit.
* `school_name` (String): Nama entitas sekolah.
* `education_level` (String): Jenjang (`SD`, `SMP`, `SMA`, `SMK`).
* `ownership` (String): `Negeri` / `Swasta`.
* `province_id` (FK, String): Relasi ke `dim_regions.province_id`.
* `city` (String): Kabupaten/Kota.
* `latitude`, `longitude` (Float): Geolokasi.

### Tabel Fakta: `fact_school_academics.csv`
* `fact_id` (PK, String): Identitas record fakta.
* `school_id` (FK, String): Relasi ke `dim_schools.school_id`.
* `student_total` (Integer): Jumlah siswa.
* `teacher_total` (Integer): Jumlah guru.
* `student_teacher_ratio` (Float): Rasio murid per guru.
* `accreditation` (Enum): Nilai akreditasi.
* `facility_score` (Float): Indeks sarana prasarana.

### Tabel Fakta: `fact_universities.csv`
* `univ_id` (PK, String): Kode perguruan tinggi PDDikti.
* `univ_name` (String): Nama universitas/institut.
* `province_id` (FK, String): Relasi ke `dim_regions.province_id`.
* `status` (Enum): `PTN-BH`, `PTN-BLU`, `PTN-Satker`, `PTS`.
* `accreditation` (Enum): `Unggul`, `A`, `B`.
* `student_total` (Integer): Total mahasiswa aktif.
* `lecturer_total` (Integer): Total dosen tetap.
* `student_lecturer_ratio` (Float): Rasio mahasiswa per dosen.
* `study_program_count` (Integer): Jumlah program studi.
* `international_publications` (Integer): Publikasi terindeks Scopus tahunan.

---

## 4. Lapisan Feature Store Data Science (`04_features/`)

Dipersiapkan khusus untuk model *Machine Learning* dan segmentasi disparitas:
* `train_features.csv` (80% partisi pelatihan): Fitur terskala (`facility_norm`, `student_teacher_ratio_norm`, `is_negeri`, `level_code`).
* `test_features.csv` (20% partisi evaluasi).
* `school_disparity_clusters.csv`: Hasil *clustering* K-Means ($K=3$) mengelompokkan sekolah ke dalam:
  * `Tier 1: Unggul & Fasilitas Memadai`
  * `Tier 2: Berkembang (Standar Nasional)`
  * `Tier 3: Butuh Dukungan / Intervensi`
* `feature_metadata.json`: Dokumentasi parameter, seed, dan definisi variabel prediktor.

---

## 5. Lapisan Analitik & Bisnis Data Analyst (`05_analytics/`)

Format siap pakai untuk konsumsi visualisasi dashboard dan pelaporan manajerial:
* `overview_kpi.json`: Ringkasan metrik nasional tingkat makro.
* `regional_performance_ranking.csv`: Pemeringkatan provinsi berbasis skor komposit (IPM, Fasilitas, % Akreditasi A).
* `education_level_distribution.json`: Perbandingan performa per jenjang (SD vs SMP vs SMA vs SMK).
* `island_disparity_analysis.csv`: Analisis kesenjangan pendidikan Pulau Jawa vs Luar Jawa.
