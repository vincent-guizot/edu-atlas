"""
=============================================================================
Fase 1: Data Engineer - Ingestion & Raw Sourcing (Synthetic Data Generator)
EduAtlas Platform - Indonesia Education Data Sourcing
=============================================================================
Menghasilkan data mentah realistis (mirip hasil scraping/API) ke folder:
  - data/01_raw/kemdikbud/YYYY-MM-DD_raw_schools_dataset.csv
  - data/01_raw/bps/YYYY-MM-DD_raw_macro_indicators.json
  - data/01_raw/pddikti/YYYY-MM-DD_raw_universities.json
"""

import os
import csv
import json
import random
import datetime
from pathlib import Path

random.seed(42)

TODAY = datetime.date.today().isoformat()
BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "01_raw"

PROVINCES = [
    {"id": "reg-aceh", "name": "Aceh", "island": "Sumatera", "capital": "Banda Aceh", "lat": 5.5483, "lng": 95.3238},
    {"id": "reg-sumut", "name": "Sumatera Utara", "island": "Sumatera", "capital": "Medan", "lat": 3.5952, "lng": 98.6722},
    {"id": "reg-sumbar", "name": "Sumatera Barat", "island": "Sumatera", "capital": "Padang", "lat": -0.9471, "lng": 100.4172},
    {"id": "reg-riau", "name": "Riau", "island": "Sumatera", "capital": "Pekanbaru", "lat": 0.5071, "lng": 101.4478},
    {"id": "reg-sumsel", "name": "Sumatera Selatan", "island": "Sumatera", "capital": "Palembang", "lat": -2.9761, "lng": 104.7754},
    {"id": "reg-lampung", "name": "Lampung", "island": "Sumatera", "capital": "Bandar Lampung", "lat": -5.4500, "lng": 105.2667},
    {"id": "reg-dki-jakarta", "name": "DKI Jakarta", "island": "Jawa", "capital": "Jakarta", "lat": -6.2088, "lng": 106.8456},
    {"id": "reg-jabar", "name": "Jawa Barat", "island": "Jawa", "capital": "Bandung", "lat": -6.9175, "lng": 107.6191},
    {"id": "reg-jateng", "name": "Jawa Tengah", "island": "Jawa", "capital": "Semarang", "lat": -7.1510, "lng": 110.1403},
    {"id": "reg-diy", "name": "DI Yogyakarta", "island": "Jawa", "capital": "Yogyakarta", "lat": -7.7956, "lng": 110.3695},
    {"id": "reg-jatim", "name": "Jawa Timur", "island": "Jawa", "capital": "Surabaya", "lat": -7.2575, "lng": 112.7521},
    {"id": "reg-banten", "name": "Banten", "island": "Jawa", "capital": "Serang", "lat": -6.1200, "lng": 106.1503},
    {"id": "reg-bali", "name": "Bali", "island": "Bali & Nusa Tenggara", "capital": "Denpasar", "lat": -8.6705, "lng": 115.2126},
    {"id": "reg-ntb", "name": "Nusa Tenggara Barat", "island": "Bali & Nusa Tenggara", "capital": "Mataram", "lat": -8.5833, "lng": 116.1167},
    {"id": "reg-ntt", "name": "Nusa Tenggara Timur", "island": "Bali & Nusa Tenggara", "capital": "Kupang", "lat": -10.1772, "lng": 123.6070},
    {"id": "reg-kalbar", "name": "Kalimantan Barat", "island": "Kalimantan", "capital": "Pontianak", "lat": -0.0263, "lng": 109.3425},
    {"id": "reg-kaltim", "name": "Kalimantan Timur", "island": "Kalimantan", "capital": "Samarinda", "lat": -0.5022, "lng": 117.1536},
    {"id": "reg-kalsel", "name": "Kalimantan Selatan", "island": "Kalimantan", "capital": "Banjarmasin", "lat": -3.3194, "lng": 114.5908},
    {"id": "reg-sulsel", "name": "Sulawesi Selatan", "island": "Sulawesi", "capital": "Makassar", "lat": -5.1477, "lng": 119.4327},
    {"id": "reg-sulut", "name": "Sulawesi Utara", "island": "Sulawesi", "capital": "Manado", "lat": 1.4748, "lng": 124.8421},
    {"id": "reg-maluku", "name": "Maluku", "island": "Maluku & Papua", "capital": "Ambon", "lat": -3.6554, "lng": 128.1906},
    {"id": "reg-papua", "name": "Papua", "island": "Maluku & Papua", "capital": "Jayapura", "lat": -2.5916, "lng": 140.6690}
]

SCHOOL_NAMES_PREFIX = [
    "SMA Negeri 1", "SMA Negeri 2", "SMA Negeri 3", "SMA Negeri 5", "SMA Negeri 8",
    "SMK Negeri 1", "SMK Negeri 2", "SMK Negeri 6", "SMK Telkom", "SMK Penerbangan",
    "SMP Negeri 1", "SMP Negeri 2", "SMP Negeri 4", "SMP Negeri 12",
    "SD Negeri 01", "SD Negeri 02 Pagi", "SD Percobaan", "SD IT Al-Hikmah",
    "SMA Kristen Petra", "SMA Kolese Kanisius", "SMA Taruna Nusantara", "SMA Labschool"
]

def generate_raw_kemdikbud():
    out_dir = RAW_DIR / "kemdikbud"
    out_dir.mkdir(parents=True, exist_ok=True)
    file_path = out_dir / f"{TODAY}_raw_schools_dataset.csv"

    rows = []
    npsn_base = 20100000

    for i in range(300):
        prov = random.choice(PROVINCES)
        npsn = str(npsn_base + i + random.randint(10, 99))
        prefix = random.choice(SCHOOL_NAMES_PREFIX)
        city = f"Kota {prov['capital']}" if random.random() > 0.4 else f"Kab. {prov['name']} Barat"
        
        # Raw dirty data simulation: mixed casing, trailing whitespace, occasional missing values
        name_raw = f"{prefix} {prov['capital']}"
        if random.random() < 0.15:
            name_raw = "  " + name_raw.upper() + "  "
        
        level = "SMA"
        if "SMK" in prefix:
            level = "SMK"
        elif "SMP" in prefix:
            level = "SMP"
        elif "SD" in prefix:
            level = "SD"
        
        ownership = "Negeri" if "Negeri" in prefix else "Swasta"
        
        # Student & teacher distribution
        students = random.randint(180, 1400) if level in ["SMA", "SMK"] else random.randint(120, 800)
        teachers = max(10, int(students / random.uniform(12.0, 26.0)))
        
        accreditation = random.choices(["A", "B", "C", ""], weights=[0.45, 0.40, 0.10, 0.05])[0]
        facility_score = round(random.uniform(55.0, 98.5), 1) if accreditation != "" else ""

        # Noise in coordinates
        lat = prov["lat"] + random.uniform(-0.15, 0.15)
        lng = prov["lng"] + random.uniform(-0.15, 0.15)

        rows.append({
            "npsn_code": npsn,
            "school_name": name_raw,
            "education_level": level if random.random() > 0.03 else level.lower(),
            "ownership_type": ownership,
            "province_id": prov["id"],
            "province_name": prov["name"] if random.random() > 0.1 else f"  {prov['name'].lower()}  ",
            "city_district": city,
            "latitude": round(lat, 5),
            "longitude": round(lng, 5),
            "student_total": students,
            "teacher_total": teachers,
            "accreditation_grade": accreditation,
            "facility_score_raw": facility_score
        })

    fieldnames = list(rows[0].keys())
    with open(file_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"[DE] Ingestion Kemendikbud: {len(rows)} baris disimpan ke {file_path}")

def generate_raw_bps():
    out_dir = RAW_DIR / "bps"
    out_dir.mkdir(parents=True, exist_ok=True)
    file_path = out_dir / f"{TODAY}_raw_macro_indicators.json"

    data = []
    for prov in PROVINCES:
        # Realistic Indonesian macro statistics
        ipm = round(random.uniform(68.5, 84.5), 2)
        apm_sd = round(random.uniform(97.0, 99.8), 2)
        apm_smp = round(random.uniform(88.0, 96.5), 2)
        apm_sma = round(random.uniform(65.0, 85.0), 2)
        avg_study_years = round(random.uniform(7.5, 11.8), 2)
        poverty_rate = round(random.uniform(4.5, 18.5), 2)
        budget_allocation_b = round(random.uniform(1200.0, 6800.0), 2) # Dalam Milyar Rupiah

        data.append({
            "kode_provinsi": prov["id"],
            "nama_provinsi": prov["name"],
            "pulau": prov["island"],
            "indeks_pembangunan_manusia": ipm,
            "angka_partisipasi_murni": {
                "sd": apm_sd,
                "smp": apm_smp,
                "sma": apm_sma
            },
            "rata_rata_lama_sekolah_tahun": avg_study_years,
            "persentase_penduduk_miskin": poverty_rate,
            "anggaran_fungsi_pendidikan_milyar": budget_allocation_b,
            "tahun_referensi": 2026
        })

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"[DE] Ingestion BPS: {len(data)} provinsi disimpan ke {file_path}")

def generate_raw_pddikti():
    out_dir = RAW_DIR / "pddikti"
    out_dir.mkdir(parents=True, exist_ok=True)
    file_path = out_dir / f"{TODAY}_raw_universities.json"

    univ_presets = [
        ("Universitas Indonesia", "reg-dki-jakarta", "PTN-BH", "Unggul"),
        ("Institut Teknologi Bandung", "reg-jabar", "PTN-BH", "Unggul"),
        ("Universitas Gadjah Mada", "reg-diy", "PTN-BH", "Unggul"),
        ("Institut Teknologi Sepuluh Nopember", "reg-jatim", "PTN-BH", "Unggul"),
        ("Universitas Airlangga", "reg-jatim", "PTN-BH", "Unggul"),
        ("Universitas Diponegoro", "reg-jateng", "PTN-BH", "Unggul"),
        ("Universitas Padjadjaran", "reg-jabar", "PTN-BH", "Unggul"),
        ("Universitas Brawijaya", "reg-jatim", "PTN-BH", "Unggul"),
        ("Universitas Hasanuddin", "reg-sulsel", "PTN-BH", "Unggul"),
        ("Universitas Sumatera Utara", "reg-sumut", "PTN-BH", "Unggul"),
        ("Universitas Andalas", "reg-sumbar", "PTN-BLU", "A"),
        ("Universitas Syiah Kuala", "reg-aceh", "PTN-BLU", "Unggul"),
        ("Universitas Riau", "reg-riau", "PTN-BLU", "A"),
        ("Universitas Sriwijaya", "reg-sumsel", "PTN-BLU", "A"),
        ("Universitas Udayana", "reg-bali", "PTN-BLU", "Unggul"),
        ("Universitas Mataram", "reg-ntb", "PTN-BLU", "B"),
        ("Universitas Nusa Cendana", "reg-ntt", "PTN-Satker", "B"),
        ("Universitas Tanjungpura", "reg-kalbar", "PTN-BLU", "A"),
        ("Universitas Mulawarman", "reg-kaltim", "PTN-BLU", "A"),
        ("Universitas Lambung Mangkurat", "reg-kalsel", "PTN-BLU", "A"),
        ("Universitas Sam Ratulangi", "reg-sulut", "PTN-BLU", "A"),
        ("Universitas Pattimura", "reg-maluku", "PTN-Satker", "B"),
        ("Universitas Cenderawasih", "reg-papua", "PTN-Satker", "B"),
        ("Universitas Bina Nusantara", "reg-dki-jakarta", "PTS", "Unggul"),
        ("Telkom University", "reg-jabar", "PTS", "Unggul"),
        ("Universitas Islam Indonesia", "reg-diy", "PTS", "Unggul"),
        ("Universitas Muhammadiyah Malang", "reg-jatim", "PTS", "Unggul")
    ]

    data = []
    for i, (name, prov_id, status, akred) in enumerate(univ_presets, 1):
        students = random.randint(12000, 48000)
        dosen = int(students / random.uniform(18.0, 28.0))
        prodi_count = random.randint(45, 175)

        data.append({
            "kode_pt": f"PT-{1000 + i}",
            "nama_perguruan_tinggi": name,
            "region_id": prov_id,
            "status_kelembagaan": status,
            "akreditasi_institusi": akred,
            "jumlah_mahasiswa_aktif": students,
            "jumlah_dosen_tetap": dosen,
            "jumlah_program_studi": prodi_count,
            "publikasi_internasional_tahunan": random.randint(120, 2400)
        })

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"[DE] Ingestion PDDikti: {len(data)} universitas disimpan ke {file_path}")

def main():
    print(f"--- Data Engineer Ingestion Pipeline [{TODAY}] ---")
    generate_raw_kemdikbud()
    generate_raw_bps()
    generate_raw_pddikti()

if __name__ == "__main__":
    main()
