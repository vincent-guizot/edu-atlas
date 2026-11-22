# EduAtlas Data Pipeline & ETL Specification

Dokumen ini menjelaskan spesifikasi teknis dari alur kerja ETL (*Extract, Transform, Load*), *Feature Engineering*, *Clustering*, hingga *Analytics Aggregation* pada EduAtlas.

---

## 1. Fase 1: Data Ingestion (`01_generate_raw_synthetic.py`)
* **Tanggung Jawab:** Data Engineer (DE)
* **Sumber Data Domain:**
  1. **Kemendikbud/Dapodik:** 300 data sekolah dari 22 provinsi. Mengandung simulasi *data noise* realistis (casing tidak konsisten, spasi ganda, missing value akreditasi/fasilitas).
  2. **BPS (Badan Pusat Statistik):** 22 provinsi dengan indikator IPM, Angka Partisipasi Murni (APM SD, SMP, SMA), angka putus sekolah, kemiskinan, dan alokasi anggaran fungsi pendidikan.
  3. **PDDikti:** 27 perguruan tinggi terkemuka (PTN-BH, PTN-BLU, PTS) dengan data mahasiswa, dosen tetap, dan publikasi internasional.
* **Output:** Tersimpan di `data/01_raw/` dalam format CSV dan JSON dengan *timestamp snapshot*.

---

## 2. Fase 2: Cleaning & Dimensional Modeling (`02_clean_and_transform.py`)
* **Tanggung Jawab:** Data Engineer (DE) & Data Analyst (DA)
* **Logika Pembersihan Data:**
  * Penghapusan whitespace dan standardisasi ke format *Title Case*.
  * Standardisasi jenjang ke kode baku: `SD`, `SMP`, `SMA`, `SMK`.
  * Imputasi akreditasi kosong dengan nilai modus (`B`).
  * Imputasi nilai fasilitas kosong dengan nilai median nasional (`75.0`).
* **Arsitektur Star Schema Data Warehouse (`data/03_processed/`):**
  * `dim_regions.csv`: Data wilayah dan indikator makro.
  * `dim_schools.csv`: Dimensi entitas sekolah dan geolokasi.
  * `fact_school_academics.csv`: Metrik performa, rasio pengajar, dan akreditasi sekolah.
  * `fact_universities.csv`: Metrik perguruan tinggi.

---

## 3. Fase 3: Feature Engineering & Disparity Clustering (`03_generate_features_ds.py`)
* **Tanggung Jawab:** Data Scientist (DS)
* **Rekayasa Fitur:**
  * $\text{Rasio Siswa-Guru} = \frac{\text{student\_total}}{\max(1, \text{teacher\_total})}$
  * Normalisasi Min-Max Skor Fasilitas: $\text{facility\_norm} = \frac{x - x_{\min}}{x_{\max} - x_{\min}}$
  * Encoding biner status sekolah: $\text{is\_negeri} \in \{0, 1\}$.
  * Bobot Akreditasi: $A = 3.0, B = 2.0, C = 1.0$.
* **Clustering Disparitas (K-Means $K=3$):**
  * Mengelompokkan sekolah berdasarkan fasilitas dan kecukupan guru ke dalam 3 tier:
    * **Tier 1:** Unggul & Fasilitas Memadai
    * **Tier 2:** Berkembang (Standar Nasional)
    * **Tier 3:** Butuh Dukungan / Intervensi Khusus
* **Partisi Data Latih & Uji:**
  * Membagi dataset menjadi 80% *Train* (`train_features.csv`) dan 20% *Test* (`test_features.csv`) dengan *fixed random seed* (`1337`).

---

## 4. Fase 4: Analytics Mart & Business Intelligence (`04_generate_analytics_da.py`)
* **Tanggung Jawab:** Data Analyst (DA)
* **Metrik & Perhitungan:**
  * **Ringkasan Nasional (`overview_kpi.json`):** Total sekolah, siswa, guru aktif, dan rasio guru nasional.
  * **Skor Komposit Kinerja Wilayah (`regional_performance_ranking.csv`):**
    $$\text{Composite Score} = (0.4 \times \text{IPM}) + (0.4 \times \text{Fasilitas}) + (0.2 \times \% \text{Akreditasi A})$$
  * **Analisis Kesenjangan Wilayah (`island_disparity_analysis.csv`):** Komparasi terukur metrik rata-rata provinsi di Pulau Jawa vs Luar Pulau Jawa.

---

## 5. Fase 5: Sinkronisasi ke Aplikasi (`sync_to_application.py`)
* **Mekanisme Integrasi:**
  * Menyinkronkan seluruh output ke format JSON snapshot di `apps/backend/data/`.
  * Memperbarui seeder database di `apps/backend/src/database/seed.data.ts`.
  * Memperbarui konstanta offline fallback frontend di `apps/frontend/src/constants/schools.constants.ts`.
