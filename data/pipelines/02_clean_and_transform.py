"""
=============================================================================
Fase 2: Data Engineer - Cleaning, Normalization & Dimensional Modeling
EduAtlas Platform - Data Processing & Star-Schema Creation
=============================================================================
Membersihkan data mentah dari 01_raw/, standarisasi, dan menyimpan:
  - data/02_interim/schools_clean.csv
  - data/03_processed/dim_regions.csv
  - data/03_processed/dim_schools.csv
  - data/03_processed/fact_school_academics.csv
  - data/03_processed/fact_universities.csv
"""

import os
import csv
import json
import glob
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "01_raw"
INTERIM_DIR = BASE_DIR / "02_interim"
PROCESSED_DIR = BASE_DIR / "03_processed"

INTERIM_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

def get_latest_file(folder: Path, pattern: str) -> Path:
    files = list(folder.glob(pattern))
    if not files:
        raise FileNotFoundError(f"Tidak ada file dengan pola '{pattern}' di {folder}")
    files.sort(reverse=True)
    return files[0]

def clean_and_build_star_schema():
    print("[DE] Memulai tahap Data Cleaning & Transformasi...")

    # 1. Load Raw Kemdikbud Schools
    schools_file = get_latest_file(RAW_DIR / "kemdikbud", "*_raw_schools_dataset.csv")
    raw_schools = []
    with open(schools_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw_schools.append(row)

    # 2. Load Raw BPS Macro Indicators
    bps_file = get_latest_file(RAW_DIR / "bps", "*_raw_macro_indicators.json")
    with open(bps_file, "r", encoding="utf-8") as f:
        raw_bps = json.load(f)

    # 3. Load Raw PDDikti Universities
    pddikti_file = get_latest_file(RAW_DIR / "pddikti", "*_raw_universities.json")
    with open(pddikti_file, "r", encoding="utf-8") as f:
        raw_univs = json.load(f)

    # Build Map for standard province names
    prov_map = {}
    for prov in raw_bps:
        prov_map[prov["kode_provinsi"]] = prov["nama_provinsi"]

    # -------------------------------------------------------------
    # Transform & Clean Schools
    # -------------------------------------------------------------
    cleaned_schools = []
    dim_schools = []
    fact_academics = []

    for idx, row in enumerate(raw_schools, 1):
        school_id = f"sch-{idx:04d}"
        npsn = row["npsn_code"].strip()
        name = " ".join(row["school_name"].strip().split()).title()
        
        # Standardize level
        level_raw = row["education_level"].strip().upper()
        level = level_raw if level_raw in ["SD", "SMP", "SMA", "SMK"] else "SMA"
        
        ownership = row["ownership_type"].strip().capitalize()
        prov_id = row["province_id"].strip()
        prov_name = prov_map.get(prov_id, row["province_name"].strip().title())
        city = " ".join(row["city_district"].strip().split())

        try:
            lat = float(row["latitude"])
            lng = float(row["longitude"])
        except (ValueError, TypeError):
            lat, lng = 0.0, 0.0

        students = int(row["student_total"])
        teachers = max(1, int(row["teacher_total"]))
        str_ratio = round(students / teachers, 2)

        accred = row["accreditation_grade"].strip().upper()
        if accred not in ["A", "B", "C"]:
            accred = "B" # Median imputation

        try:
            facility = float(row["facility_score_raw"])
        except (ValueError, TypeError):
            facility = 75.0 # Benchmark fallback

        # Store in Interim
        cleaned_schools.append({
            "school_id": school_id,
            "npsn": npsn,
            "school_name": name,
            "education_level": level,
            "ownership": ownership,
            "province_id": prov_id,
            "province_name": prov_name,
            "city": city,
            "latitude": lat,
            "longitude": lng,
            "student_total": students,
            "teacher_total": teachers,
            "student_teacher_ratio": str_ratio,
            "accreditation": accred,
            "facility_score": facility
        })

        # Store in dim_schools
        dim_schools.append({
            "school_id": school_id,
            "npsn": npsn,
            "school_name": name,
            "education_level": level,
            "ownership": ownership,
            "province_id": prov_id,
            "city": city,
            "latitude": lat,
            "longitude": lng
        })

        # Store in fact_school_academics
        fact_academics.append({
            "fact_id": f"fsa-{idx:04d}",
            "school_id": school_id,
            "student_total": students,
            "teacher_total": teachers,
            "student_teacher_ratio": str_ratio,
            "accreditation": accred,
            "facility_score": facility
        })

    # Save to 02_interim
    interim_schools_file = INTERIM_DIR / "schools_clean.csv"
    with open(interim_schools_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(cleaned_schools[0].keys()))
        writer.writeheader()
        writer.writerows(cleaned_schools)
    print(f"[DE] Interim Dataset: {len(cleaned_schools)} baris disimpan ke {interim_schools_file}")

    # -------------------------------------------------------------
    # Transform Dim Regions & Fact Regional Stats
    # -------------------------------------------------------------
    dim_regions = []
    for prov in raw_bps:
        dim_regions.append({
            "province_id": prov["kode_provinsi"],
            "province_name": prov["nama_provinsi"],
            "island": prov["pulau"],
            "ipm": prov["indeks_pembangunan_manusia"],
            "apm_sd": prov["angka_partisipasi_murni"]["sd"],
            "apm_smp": prov["angka_partisipasi_murni"]["smp"],
            "apm_sma": prov["angka_partisipasi_murni"]["sma"],
            "avg_school_years": prov["rata_rata_lama_sekolah_tahun"],
            "poverty_rate": prov["persentase_penduduk_miskin"],
            "education_budget_billion": prov["anggaran_fungsi_pendidikan_milyar"]
        })

    # -------------------------------------------------------------
    # Transform Fact Universities
    # -------------------------------------------------------------
    fact_universities = []
    for u in raw_univs:
        students = u["jumlah_mahasiswa_aktif"]
        dosen = max(1, u["jumlah_dosen_tetap"])
        fact_universities.append({
            "univ_id": u["kode_pt"],
            "univ_name": u["nama_perguruan_tinggi"],
            "province_id": u["region_id"],
            "status": u["status_kelembagaan"],
            "accreditation": u["akreditasi_institusi"],
            "student_total": students,
            "lecturer_total": dosen,
            "student_lecturer_ratio": round(students / dosen, 2),
            "study_program_count": u["jumlah_program_studi"],
            "international_publications": u["publikasi_internasional_tahunan"]
        })

    # -------------------------------------------------------------
    # Save Star-Schema Tables to 03_processed/
    # -------------------------------------------------------------
    def save_csv(path: Path, rows: list):
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
            writer.writeheader()
            writer.writerows(rows)
        print(f"[DE] Processed Star-Schema Table: {len(rows)} baris disimpan ke {path.name}")

    save_csv(PROCESSED_DIR / "dim_regions.csv", dim_regions)
    save_csv(PROCESSED_DIR / "dim_schools.csv", dim_schools)
    save_csv(PROCESSED_DIR / "fact_school_academics.csv", fact_academics)
    save_csv(PROCESSED_DIR / "fact_universities.csv", fact_universities)

def main():
    clean_and_build_star_schema()

if __name__ == "__main__":
    main()
