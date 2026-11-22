# Data Lineage — Alur Transformasi Data EduAtlas

Dokumen ini memetakan siklus hidup data mulai dari tahap *Ingestion* (Data Engineer), *Transformation & Cleaning* (DE + DA), *Feature Engineering & Clustering* (Data Scientist), hingga *Analytics Mart* (Data Analyst).

---

## Diagram Alur Data Lineage

```mermaid
flowchart TD
    subgraph Ingestion["1. Ingestion Layer (01_raw)"]
        R1["kemdikbud/*_raw_schools_dataset.csv"]
        R2["bps/*_raw_macro_indicators.json"]
        R3["pddikti/*_raw_universities.json"]
    end

    subgraph Cleaning["2. Cleaning & Interim Layer (02_interim)"]
        I1["schools_clean.csv<br/>(Trim whitespace, standardisasi level & koordinat)"]
    end

    subgraph Processed["3. Star Schema Layer (03_processed)"]
        D1["dim_regions.csv"]
        D2["dim_schools.csv"]
        F1["fact_school_academics.csv"]
        F2["fact_universities.csv"]
    end

    subgraph FeatureStore["4. Feature Store Layer (04_features) [DS]"]
        FS1["train_features.csv (80%)"]
        FS2["test_features.csv (20%)"]
        FS3["school_disparity_clusters.csv (K-Means K=3)"]
        FM["feature_metadata.json"]
    end

    subgraph Analytics["5. Analytics Mart Layer (05_analytics) [DA & DS]"]
        A1["overview_kpi.json (Dashboard Snapshot)"]
        A2["regional_performance_ranking.csv (Peringkat Provinsi)"]
        A3["education_level_distribution.json (Statistik per Jenjang)"]
        A4["island_disparity_analysis.csv (Jawa vs Luar Jawa)"]
        A5["disparity_3t.json (Klaster 3T & 514 Kab/Kota)"]
        A6["budget_efficiency.json (Spending per Student)"]
        A7["forecasting_baseline.json (Demografi Guru 2026–2030)"]
        A8["policy_brief_templates.json (5 Memo Kebijakan Bappenas)"]
    end

    R1 --> I1
    I1 --> D2
    I1 --> F1
    R2 --> D1
    R3 --> F2

    D1 & D2 & F1 --> FS1 & FS2 & FS3 & FM
    D1 & D2 & F1 & F2 --> A1 & A2 & A3 & A4
    FS3 & D1 & D2 & F1 --> A5 & A6 & A7 & A8
```

---

## Logika Transformasi Utama

1. **Pembersihan Teks & Imputasi (DE)**:
   * String nama sekolah dan wilayah di-*strip* dari spasi liar dan diubah ke *Title Case*.
   * Nilai akreditasi kosong diimputasi dengan modus (`B`).
   * Skor fasilitas kosong diimputasi dengan median nasional (`75.0`).
2. **Normalisasi & Penskalaan Fitur (DS)**:
   * Skor fasilitas dan rasio guru-murid diskalakan ke rentang `[0.0, 1.0]` menggunakan Min-Max Scaling.
   * Algoritma K-Means ($K=3$) dijalankan pada ruang fitur 2D untuk mengelompokkan sekolah ke dalam 3 klaster disparitas.
   * Dataset diacak secara terkontrol menggunakan seed `1337` dan dipartisi menjadi $80\%$ *train* dan $20\%$ *test*.
3. **Agregasi Metrik Komposit (DA)**:
   * **Skor Komposit Kinerja Wilayah**:
     $$\text{Composite Score} = (0.4 \times \text{IPM}) + (0.4 \times \text{Rata-rata Skor Fasilitas}) + (0.2 \times \text{Persentase Akreditasi A})$$
   * Agregasi disparitas spasial memisahkan provinsi dalam gugus **Pulau Jawa** vs **Luar Pulau Jawa**.
