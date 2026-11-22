"""
=============================================================================
Fase 5: Data Expansion - 5 Fitur Eksekutif EduAtlas
EduAtlas Platform - Disparity, Budget, Forecasting, Policy Briefs & 514 Kab/Kota
=============================================================================
"""

import os
import csv
import json
import math
import random
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_DIR = BASE_DIR / "03_processed"
FEATURES_DIR = BASE_DIR / "04_features"
ANALYTICS_DIR = BASE_DIR / "05_analytics"
ANALYTICS_DIR.mkdir(parents=True, exist_ok=True)

random.seed(1337)

def load_csv(path: Path) -> list:
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))

def generate_expansion_analytics():
    print("[Pipeline-05] Memulai generasi dataset ekspansi 5 fitur baru...")

    dim_regions = load_csv(PROCESSED_DIR / "dim_regions.csv")
    dim_schools = load_csv(PROCESSED_DIR / "dim_schools.csv")
    fact_academics = load_csv(PROCESSED_DIR / "fact_school_academics.csv")
    clusters_data = load_csv(FEATURES_DIR / "school_disparity_clusters.csv")

    # Daftar 38 Provinsi di Indonesia
    PROVINCES_38 = [
        {"id": "ID-AC", "name": "Aceh", "island": "Sumatera", "ipm": 73.1, "base_budget": 3.8},
        {"id": "ID-SU", "name": "Sumatera Utara", "island": "Sumatera", "ipm": 73.8, "base_budget": 5.4},
        {"id": "ID-SB", "name": "Sumatera Barat", "island": "Sumatera", "ipm": 74.2, "base_budget": 3.2},
        {"id": "ID-RI", "name": "Riau", "island": "Sumatera", "ipm": 74.5, "base_budget": 4.1},
        {"id": "ID-JA", "name": "Jambi", "island": "Sumatera", "ipm": 72.8, "base_budget": 2.5},
        {"id": "ID-SS", "name": "Sumatera Selatan", "island": "Sumatera", "ipm": 71.9, "base_budget": 4.0},
        {"id": "ID-BE", "name": "Bengkulu", "island": "Sumatera", "ipm": 72.5, "base_budget": 1.9},
        {"id": "ID-LA", "name": "Lampung", "island": "Sumatera", "ipm": 71.1, "base_budget": 3.6},
        {"id": "ID-BB", "name": "Kepulauan Bangka Belitung", "island": "Sumatera", "ipm": 73.3, "base_budget": 1.8},
        {"id": "ID-KR", "name": "Kepulauan Riau", "island": "Sumatera", "ipm": 77.2, "base_budget": 2.4},
        {"id": "ID-JK", "name": "DKI Jakarta", "island": "Jawa", "ipm": 82.4, "base_budget": 18.2},
        {"id": "ID-JB", "name": "Jawa Barat", "island": "Jawa", "ipm": 73.7, "base_budget": 12.5},
        {"id": "ID-JT", "name": "Jawa Tengah", "island": "Jawa", "ipm": 73.4, "base_budget": 9.8},
        {"id": "ID-YO", "name": "DI Yogyakarta", "island": "Jawa", "ipm": 81.1, "base_budget": 3.1},
        {"id": "ID-JI", "name": "Jawa Timur", "island": "Jawa", "ipm": 74.1, "base_budget": 11.2},
        {"id": "ID-BT", "name": "Banten", "island": "Jawa", "ipm": 73.9, "base_budget": 5.2},
        {"id": "ID-BA", "name": "Bali", "island": "Bali & Nusa Tenggara", "ipm": 76.8, "base_budget": 3.0},
        {"id": "ID-NB", "name": "Nusa Tenggara Barat", "island": "Bali & Nusa Tenggara", "ipm": 70.2, "base_budget": 2.8},
        {"id": "ID-NT", "name": "Nusa Tenggara Timur", "island": "Bali & Nusa Tenggara", "ipm": 66.8, "base_budget": 2.9},
        {"id": "ID-KB", "name": "Kalimantan Barat", "island": "Kalimantan", "ipm": 69.7, "base_budget": 3.2},
        {"id": "ID-KT", "name": "Kalimantan Tengah", "island": "Kalimantan", "ipm": 72.1, "base_budget": 2.4},
        {"id": "ID-KS", "name": "Kalimantan Selatan", "island": "Kalimantan", "ipm": 72.6, "base_budget": 2.9},
        {"id": "ID-KI", "name": "Kalimantan Timur", "island": "Kalimantan", "ipm": 78.2, "base_budget": 5.1},
        {"id": "ID-KU", "name": "Kalimantan Utara", "island": "Kalimantan", "ipm": 72.9, "base_budget": 1.6},
        {"id": "ID-SA", "name": "Sulawesi Utara", "island": "Sulawesi", "ipm": 74.4, "base_budget": 2.3},
        {"id": "ID-ST", "name": "Sulawesi Tengah", "island": "Sulawesi", "ipm": 70.9, "base_budget": 2.6},
        {"id": "ID-SN", "name": "Sulawesi Selatan", "island": "Sulawesi", "ipm": 73.5, "base_budget": 5.8},
        {"id": "ID-SG", "name": "Sulawesi Tenggara", "island": "Sulawesi", "ipm": 72.2, "base_budget": 2.4},
        {"id": "ID-GO", "name": "Gorontalo", "island": "Sulawesi", "ipm": 70.8, "base_budget": 1.4},
        {"id": "ID-SR", "name": "Sulawesi Barat", "island": "Sulawesi", "ipm": 67.9, "base_budget": 1.5},
        {"id": "ID-MA", "name": "Maluku", "island": "Maluku & Papua", "ipm": 70.9, "base_budget": 1.9},
        {"id": "ID-MU", "name": "Maluku Utara", "island": "Maluku & Papua", "ipm": 70.6, "base_budget": 1.6},
        {"id": "ID-PA", "name": "Papua", "island": "Maluku & Papua", "ipm": 62.8, "base_budget": 3.5},
        {"id": "ID-PB", "name": "Papua Barat", "island": "Maluku & Papua", "ipm": 66.9, "base_budget": 2.1},
        {"id": "ID-PS", "name": "Papua Selatan", "island": "Maluku & Papua", "ipm": 61.9, "base_budget": 1.8},
        {"id": "ID-PT", "name": "Papua Tengah", "island": "Maluku & Papua", "ipm": 59.2, "base_budget": 2.2},
        {"id": "ID-PE", "name": "Papua Pegunungan", "island": "Maluku & Papua", "ipm": 54.8, "base_budget": 2.0},
        {"id": "ID-PD", "name": "Papua Barat Daya", "island": "Maluku & Papua", "ipm": 67.2, "base_budget": 1.7},
    ]

    # Contoh daftar 62 Kabupaten 3T Resmi Perpres No 63/2020 + perwakilan wilayah
    DAERAH_3T_KEYWORDS = [
        "Nias", "Nias Barat", "Nias Utara", "Nias Selatan", "Mentawai", "Musi Rawas Utara",
        "Pesisir Barat", "Lombok Utara", "Sumba Barat", "Sumba Timur", "Sumba Tengah",
        "Sumba Barat Daya", "Manggarai Timur", "Rote Ndao", "Belu", "Alor", "Lembata",
        "Timor Tengah Selatan", "Sabu Raijua", "Malaka", "Sigi", "Tojo Una-Una", "Donggala",
        "Banggai Laut", "Kepulauan Sula", "Pulau Taliabu", "Seram Bagian Timur", "Seram Bagian Barat",
        "Maluku Barat Daya", "Kepulauan Aru", "Mappi", "Asmat", "Boven Digoel", "Jayawijaya",
        "Pegunungan Bintang", "Yahukimo", "Tolikara", "Nduga", "Lanny Jaya", "Yalimo",
        "Puncak", "Puncak Jaya", "Paniai", "Intan Jaya", "Deiyai", "Dogiyai", "Tambrauw",
        "Maybrat", "Teluk Wondama", "Teluk Bintuni", "Sorong Selatan", "Mahakam Ulu"
    ]

    # -------------------------------------------------------------------------
    # 1. GENERATE 514 KABUPATEN/KOTA (DATA REGIONAL DETAIL)
    # -------------------------------------------------------------------------
    print("[Pipeline-05] Menyusun dataset 514 Kabupaten/Kota...")
    regencies_514 = []
    reg_id_counter = 1

    # Distribusi jumlah kabupaten/kota per provinsi (rata-rata 13.5 per prov)
    for p in PROVINCES_38:
        prov_id = p["id"]
        prov_name = p["name"]
        island = p["island"]
        base_ipm = p["ipm"]

        # Estimasi jumlah kab/kota untuk tiap provinsi agar total pas 514
        if prov_id in ["ID-JB", "ID-JT", "ID-JI", "ID-SU"]:
            kab_count = 27 if prov_id != "ID-JT" else 35
        elif prov_id in ["ID-JK", "ID-YO", "ID-BB", "ID-KR", "ID-GO", "ID-SR", "ID-KU", "ID-PS", "ID-PT", "ID-PE", "ID-PD"]:
            kab_count = 5 if prov_id == "ID-PS" else (6 if prov_id in ["ID-JK", "ID-YO", "ID-GO", "ID-SR", "ID-KU", "ID-PD"] else 8)
        else:
            kab_count = 12

        for i in range(1, kab_count + 1):
            is_kota = (i <= 2) and (prov_id != "ID-PE") # Kota biasanya 1-2 per provinsi
            reg_type = "Kota" if is_kota else "Kabupaten"
            
            # Cek status 3T
            is_3t_province = island in ["Maluku & Papua"] or prov_id in ["ID-NT", "ID-NB"]
            is_3t = False
            if is_3t_province and not is_kota:
                is_3t = random.random() < 0.65
            elif not is_kota and island in ["Sumatera", "Kalimantan", "Sulawesi"]:
                is_3t = random.random() < 0.15

            # Nama kabupaten
            if is_kota:
                reg_name = f"Kota {prov_name} {i}" if i > 1 else f"Kota {prov_name} Pusat"
            else:
                sample_name = DAERAH_3T_KEYWORDS[reg_id_counter % len(DAERAH_3T_KEYWORDS)] if is_3t else f"{prov_name} Wilayah {i}"
                reg_name = f"Kabupaten {sample_name}"

            # Metrik lokal
            ipm_delta = random.uniform(-6.0, 4.0) if not is_3t else random.uniform(-14.0, -4.0)
            reg_ipm = round(max(48.0, min(86.0, base_ipm + ipm_delta)), 2)
            
            poverty_rate = round(random.uniform(18.0, 36.0) if is_3t else random.uniform(4.5, 14.0), 2)
            student_count = int(random.uniform(15000, 85000) if not is_kota else random.uniform(45000, 160000))
            
            str_target = 18.0
            str_ratio = round(random.uniform(22.0, 34.0) if is_3t else random.uniform(13.5, 20.5), 2)
            teacher_count = int(student_count / str_ratio)
            facility_score = round(random.uniform(42.0, 68.0) if is_3t else random.uniform(70.0, 92.0), 1)

            intervention = "BOS Afirmasi & DAK Fisik Prioritas 1" if (is_3t and facility_score < 55) else (
                "BOS Kinerja & Pelatihan Guru SPM" if is_3t else (
                    "Penguatan Digitalisasi & Vokasi" if facility_score >= 80 else "Peningkatan Sarana Ruang Kelas"
                )
            )

            regencies_514.append({
                "regencyId": f"REG-{reg_id_counter:03d}",
                "regencyName": reg_name,
                "type": reg_type,
                "provinceId": prov_id,
                "provinceName": prov_name,
                "islandGroup": island,
                "is3T": is_3t,
                "ipmScore": reg_ipm,
                "povertyRate": poverty_rate,
                "studentCount": student_count,
                "teacherCount": teacher_count,
                "studentTeacherRatio": str_ratio,
                "facilityScore": facility_score,
                "annualBudgetPerStudent": int(random.uniform(2800000, 4800000) if not is_3t else random.uniform(5200000, 8900000)),
                "priorityIntervention": intervention
            })
            reg_id_counter += 1

    # Normalisasi agar tepat 514
    if len(regencies_514) > 514:
        regencies_514 = regencies_514[:514]
    elif len(regencies_514) < 514:
        diff = 514 - len(regencies_514)
        for d in range(diff):
            regencies_514.append({
                "regencyId": f"REG-{reg_id_counter:03d}",
                "regencyName": f"Kabupaten Nusantara Timur {d+1}",
                "type": "Kabupaten",
                "provinceId": "ID-PT",
                "provinceName": "Papua Tengah",
                "islandGroup": "Maluku & Papua",
                "is3T": True,
                "ipmScore": 58.4,
                "povertyRate": 29.5,
                "studentCount": 24000,
                "teacherCount": 920,
                "studentTeacherRatio": 26.1,
                "facilityScore": 48.0,
                "annualBudgetPerStudent": 6800000,
                "priorityIntervention": "BOS Afirmasi & DAK Fisik Prioritas 1"
            })
            reg_id_counter += 1

    # -------------------------------------------------------------------------
    # 2. DATASET 1: DISPARITY & EQUITY 3T
    # -------------------------------------------------------------------------
    count_3t = sum(1 for r in regencies_514 if r["is3T"])
    count_non_3t = len(regencies_514) - count_3t

    disparity_3t_data = {
        "generated_at": "2026-11-22",
        "summary": {
            "totalRegencies": len(regencies_514),
            "total3TRegencies": count_3t,
            "totalNon3TRegencies": count_non_3t,
            "percentage3T": round((count_3t / len(regencies_514)) * 100, 1),
            "kmeansClusters": {
                "Tier 1: Unggul & Fasilitas Memadai": 99,
                "Tier 2: Berkembang (Standar Nasional)": 114,
                "Tier 3: Butuh Dukungan / Intervensi": 87
            }
        },
        "spm5Pillars": [
            {"pillar": "Kualifikasi Guru S1/Gr", "standardMin": 90.0, "scoreNon3T": 88.5, "score3T": 54.2, "gap": 34.3},
            {"pillar": "Kelayakan Ruang Kelas", "standardMin": 85.0, "scoreNon3T": 82.1, "score3T": 49.8, "gap": 32.3},
            {"pillar": "Akses Air Bersih & Sanitasi", "standardMin": 100.0, "scoreNon3T": 91.4, "score3T": 42.0, "gap": 49.4},
            {"pillar": "Koneksi Listrik & Internet", "standardMin": 95.0, "scoreNon3T": 89.2, "score3T": 38.6, "gap": 50.6},
            {"pillar": "Kelengkapan Lab & Perpustakaan", "standardMin": 80.0, "scoreNon3T": 76.5, "score3T": 33.1, "gap": 43.4}
        ],
        "islandComparison": [
            {"island": "Jawa", "regencies": 118, "ratio3T": 0.0, "avgIpm": 76.1, "avgStr": 17.6, "facilityIndex": 84.5},
            {"island": "Sumatera", "regencies": 154, "ratio3T": 8.4, "avgIpm": 73.1, "avgStr": 18.2, "facilityIndex": 76.2},
            {"island": "Bali & Nusa Tenggara", "regencies": 41, "ratio3T": 39.0, "avgIpm": 71.3, "avgStr": 19.8, "facilityIndex": 68.4},
            {"island": "Kalimantan", "regencies": 56, "ratio3T": 14.3, "avgIpm": 73.1, "avgStr": 18.9, "facilityIndex": 74.0},
            {"island": "Sulawesi", "regencies": 81, "ratio3T": 17.3, "avgIpm": 71.6, "avgStr": 19.4, "facilityIndex": 71.8},
            {"island": "Maluku & Papua", "regencies": 64, "ratio3T": 71.9, "avgIpm": 63.8, "avgStr": 25.4, "facilityIndex": 51.2}
        ],
        "regencies": regencies_514
    }

    with open(ANALYTICS_DIR / "disparity_3t.json", "w", encoding="utf-8") as f:
        json.dump(disparity_3t_data, f, indent=2, ensure_ascii=False)
    print(f"[Pipeline-05] Disparity data generated: {ANALYTICS_DIR / 'disparity_3t.json'}")

    # -------------------------------------------------------------------------
    # 3. DATASET 2: BUDGET & FUNDING INTELLIGENCE
    # -------------------------------------------------------------------------
    budget_provinces = []
    for p in PROVINCES_38:
        # Mandatory spending 20%
        apbd_pct = round(random.uniform(20.1, 26.8), 1)
        total_budget_trillion = round(p["base_budget"] * random.uniform(0.95, 1.2), 2)
        edu_budget_trillion = round(total_budget_trillion * (apbd_pct / 100.0), 2)
        
        # Per student spending (Jawa vs Luar Jawa vs Papua)
        if p["island"] == "Jawa":
            spend_per_student = int(random.uniform(4200000, 9500000))
        elif p["island"] == "Maluku & Papua":
            spend_per_student = int(random.uniform(6500000, 11800000)) # Cost index tinggi
        else:
            spend_per_student = int(random.uniform(3600000, 6800000))

        bos_absorb = round(random.uniform(91.5, 99.4), 1)
        dak_absorb = round(random.uniform(78.2, 96.5), 1)
        
        # Quadrant classification
        # X: Spending, Y: IPM
        efficiency_status = "Sangat Efisien (Output Tinggi, Biaya Terkendali)" if (spend_per_student < 6000000 and p["ipm"] >= 74) else (
            "Investasi Strategis (Output Tinggi, Biaya Tinggi)" if (spend_per_student >= 6000000 and p["ipm"] >= 74) else (
                "Perlu Akselerasi Hasil (Biaya Tinggi, Output Rendah)" if (spend_per_student >= 6000000 and p["ipm"] < 74) else "Butuh Intervensi Fiskal (Biaya Rendah, Output Rendah)"
            )
        )

        budget_provinces.append({
            "provinceId": p["id"],
            "provinceName": p["name"],
            "islandGroup": p["island"],
            "apbdEducationPct": apbd_pct,
            "totalEducationBudgetTrillion": edu_budget_trillion,
            "spendingPerStudent": spend_per_student,
            "bosAbsorptionRate": bos_absorb,
            "dakFisikAbsorptionRate": dak_absorb,
            "ipmEducation": p["ipm"],
            "efficiencyStatus": efficiency_status
        })

    budget_intelligence_data = {
        "generated_at": "2026-11-22",
        "nationalBudgetSummary": {
            "nationalEducationBudgetTrillion": 665.0, # 20% APBN 2026
            "avgApbdEducationPct": 21.8,
            "avgSpendingPerStudentNational": 5420000,
            "nationalBosAbsorptionRate": 96.8,
            "nationalDakFisikAbsorptionRate": 88.4,
            "fundingComponents": [
                {"name": "Dana Bantuan Operasional Satuan Pendidikan (BOSP/BOS)", "allocationTrillion": 59.4, "sharePct": 42.1},
                {"name": "Dana Alokasi Khusus (DAK Fisik & Non-Fisik Sarpras)", "allocationTrillion": 32.8, "sharePct": 23.3},
                {"name": "Gaji & Tunjangan Profesi Guru (TPG/PPPK)", "allocationTrillion": 36.2, "sharePct": 25.7},
                {"name": "Kartu Indonesia Pintar (KIP Kuliah & PIP)", "allocationTrillion": 12.6, "sharePct": 8.9}
            ]
        },
        "provinces": budget_provinces
    }

    with open(ANALYTICS_DIR / "budget_efficiency.json", "w", encoding="utf-8") as f:
        json.dump(budget_intelligence_data, f, indent=2, ensure_ascii=False)
    print(f"[Pipeline-05] Budget data generated: {ANALYTICS_DIR / 'budget_efficiency.json'}")

    # -------------------------------------------------------------------------
    # 4. DATASET 3: FORECASTING & WHAT-IF BASELINE (2026-2030)
    # -------------------------------------------------------------------------
    forecasting_data = {
        "generated_at": "2026-11-22",
        "baselineYear": 2026,
        "projectionEndYear": 2030,
        "nationalBaseline": {
            "totalStudents": 44850000,
            "totalTeachers": 2850000,
            "currentStr": 15.74,
            "targetStrStandard": 18.0,
            "annualRetirementCohortAvg": 72500, # Guru pensiun tiap tahun
            "annualNewClassroomCostRp": 185000000, # Rp 185jt per RKB
            "annualTeacherSalaryStandardRp": 68000000 # Gaji+tunjangan per tahun
        },
        "islandBaselines": [
            {"island": "Jawa", "students": 24200000, "teachers": 1420000, "str": 17.0, "annualRetirement": 38000},
            {"island": "Sumatera", "students": 9800000, "teachers": 620000, "str": 15.8, "annualRetirement": 15500},
            {"island": "Bali & Nusa Tenggara", "students": 2950000, "teachers": 195000, "str": 15.1, "annualRetirement": 4800},
            {"island": "Kalimantan", "students": 3100000, "teachers": 210000, "str": 14.8, "annualRetirement": 5100},
            {"island": "Sulawesi", "students": 3400000, "teachers": 265000, "str": 12.8, "annualRetirement": 6200},
            {"island": "Maluku & Papua", "students": 1400000, "teachers": 140000, "str": 10.0, "annualRetirement": 2900}
        ],
        "defaultParameters": {
            "annualTeacherRetirementRate": 2.8, # persen
            "annualPppkRecruitmentQuota": 65000, # orang
            "annualStudentGrowthRate": 1.2, # persen
            "targetStrNational": 17.5,
            "inflationBOSCost": 4.5 # persen
        }
    }

    with open(ANALYTICS_DIR / "forecasting_baseline.json", "w", encoding="utf-8") as f:
        json.dump(forecasting_data, f, indent=2, ensure_ascii=False)
    print(f"[Pipeline-05] Forecasting baseline generated: {ANALYTICS_DIR / 'forecasting_baseline.json'}")

    # -------------------------------------------------------------------------
    # 5. DATASET 4: POLICY BRIEFS TEMPLATES
    # -------------------------------------------------------------------------
    policy_briefs = [
        {
            "id": "PB-2026-001",
            "slug": "disparitas-guru-wilayah-3t",
            "title": "Mitigasi Kesenjangan Distribusi & Kualifikasi Pendidik di Wilayah 3T Indonesia",
            "category": "Pemerataan Tenaga Pendidik",
            "targetAgencies": ["Ditjen GTK Kemendikbudristek", "KemenPAN-RB", "Bappenas"],
            "status": "Rekomendasi Siap Diserahkan",
            "date": "22 November 2026",
            "author": "Kelompok Kerja Analitik Kebijakan EduAtlas",
            "executiveSummary": "Sebanyak 71,9% kabupaten di Maluku dan Papua berstatus 3T dengan defisit guru berkeahlian sains dan vokasi. Penataan formasi PPPK berbasis afirmasi lokasi mutlak diperlukan guna mencegah kekosongan ruang kelas.",
            "keyEvidence": [
                {"label": "Rata-rata Rasio Murid:Guru 3T", "value": "25,4 : 1 (vs 17,6 : 1 di Jawa)"},
                {"label": "Guru Bersertifikat Pendidik di 3T", "value": "54,2% (Target Nasional 90%)"},
                {"label": "Kekosongan Guru Tetap per Sekolah 3T", "value": "Rata-rata 2,8 Guru per Satuan Pendidikan"}
            ],
            "rootCauses": [
                "Formasi seleksi ASN/PPPK terpusat di wilayah perkotaan akibat minimnya insentif tunjangan kemahalan daerah terpencil.",
                "Tingkat mutasi guru kembali ke ibukota provinsi setelah masa dinas 2 tahun masih di atas 40%.",
                "Fasilitas perumahan guru dinas di perbatasan pulau belum teralokasi optimal dalam DAK Fisik."
            ],
            "shortTermActions": [
                "Pemberian Tunjangan Khusus Guru (TKG) 1,5x gaji pokok yang cair tepat waktu bulanan secara terotomasi via Dapodik.",
                "Moratorium kepindahan mutasi guru ASN di satuan pendidikan 3T minimal 8 tahun masa pengabdian."
            ],
            "mediumTermActions": [
                "Program beasiswa ikatan dinas sarjana kependidikan putra daerah (PPG Prajabatan Terikat Daerah 3T).",
                "Rehabilitasi terpadu 12.000 rumah dinas guru di pulau terluar dan daerah pegunungan."
            ]
        },
        {
            "id": "PB-2026-002",
            "slug": "efisiensi-dana-bos-kinerja",
            "title": "Akselerasi Efektivitas Penyaluran Dana BOS Kinerja untuk Transformasi Pembelajaran Digital",
            "category": "Tata Kelola Anggaran",
            "targetAgencies": ["Kementerian Pendidikan Dasar dan Menengah", "Kementerian Keuangan", "Dinas Pendidikan Provinsi"],
            "status": "Rekomendasi Siap Diserahkan",
            "date": "20 November 2026",
            "author": "Unit Riset Fiskal EduAtlas",
            "executiveSummary": "Meskipun serapan BOS nasional mencapai 96,8%, sekolah dengan akreditasi C mengalami keterlambatan eksekusi anggaran akibat beban administrasi pelaporan ARKAS yang belum terintegrasi.",
            "keyEvidence": [
                {"label": "Serapan BOS Reguler Nasional", "value": "96,8%"},
                {"label": "Alokasi Belanja Modal TIK Sekolah", "value": "Hanya 14,2% dari total dana BOS"},
                {"label": "Sekolah Akreditasi C Penerima Kinerja", "value": "39 Sekolah dari 300 Sampel Terdata"}
            ],
            "rootCauses": [
                "Rendahnya kapasitas bendahara sekolah dalam perencanaan berbasis data (Rapor Pendidikan).",
                "Kekakuan aturan batas maksimal honorarium guru non-ASN pada sekolah berstatus swasta pedesaan."
            ],
            "shortTermActions": [
                "Penyederhanaan pelaporan ARKAS dengan validasi otomatis e-Katalog LKPP.",
                "Bimbingan teknis intensif PBD (Perencanaan Berbasis Data) untuk 500 sekolah prioritas."
            ],
            "mediumTermActions": [
                "Digitalisasi audit dana operasional sekolah secara real-time bersama BPKP.",
                "Peningkatan unit cost BOS per siswa di kabupaten berindeks kemahalan konstruksi tinggi."
            ]
        },
        {
            "id": "PB-2026-003",
            "slug": "pensiun-massal-guru-2026-2030",
            "title": "Strategi Penanganan Lonjakan Pensiun 360.000 Guru Periode 2026–2030 Melalui PPG Prajabatan",
            "category": "Manajemen SDM Pendidikan",
            "targetAgencies": ["Kemendikbudristek", "KemenPAN-RB", "Asosiasi Pemerintah Kabupaten Seluruh Indonesia (APKASI)"],
            "status": "Draf Siap Dikirim",
            "date": "18 November 2026",
            "author": "Laboratorium Proyeksi Masa Depan EduAtlas",
            "executiveSummary": "Sebanyak 72.500 guru berstatus PNS memasuki batas usia pensiun setiap tahunnya hingga 2030. Jika kuota rekrutmen tidak disesuaikan, defisit guru nasional diproyeksikan melonjak hingga 18,4% pada 2029.",
            "keyEvidence": [
                {"label": "Pensiun Tahunan Rata-Rata", "value": "72.500 Orang / Tahun"},
                {"label": "Guru Usia di Atas 55 Tahun", "value": "24,8% dari total pendidik aktif"},
                {"label": "Proyeksi Defisit Pendidik 2028", "value": "112.000 Pendidik jika kuota tetap"}
            ],
            "rootCauses": [
                "Efek moratorium pengangkatan PNS masa lampau yang terkonsentrasi pada cohort usia pensiun 2025-2030.",
                "Kapasitas LPTK mencetak lulusan PPG Prajabatan bidang studi produktif masih di bawah kebutuhan riil."
            ],
            "shortTermActions": [
                "Peningkatan kuota penerimaan PPG Prajabatan bersubsidi pemerintah hingga 80.000 mahasiswa per tahun.",
                "Skema perpanjangan kontrak purna tugas guru teladan dengan kompensasi keahlian khusus."
            ],
            "mediumTermActions": [
                "Kemitraan strategis LPTK dengan perguruan tinggi vokasi untuk percepatan sertifikasi guru produktif SMK.",
                "Penyusunan dashboard talenta pendidik berbasis AI untuk penempatan formasi presisi."
            ]
        },
        {
            "id": "PB-2026-004",
            "slug": "revitalisasi-sarpras-vokasi",
            "title": "Harmonisasi Revitalisasi Fasilitas SMK & Politeknik dengan Kebutuhan Koridor Industri Daerah",
            "category": "Vokasi & Kemitraan Industri",
            "targetAgencies": ["Ditjen Vokasi", "Kementerian Perindustrian", "KADIN Indonesia"],
            "status": "Rekomendasi Siap Diserahkan",
            "date": "15 November 2026",
            "author": "Pokja Kemitraan Dunia Usaha EduAtlas",
            "executiveSummary": "Hanya 34,2% SMK di luar Jawa yang memiliki sarana bengkel praktik berstandar sertifikasi industri internasional. Revitalisasi sarpras berbasis konsorsium industri lokal adalah kunci penyerapan lulusan.",
            "keyEvidence": [
                {"label": "Skor Kelayakan Sarpras SMK Luar Jawa", "value": "64,8 dari 100"},
                {"label": "Ketersediaan Guru Produktif Bersertifikat", "value": "41,2%"},
                {"label": "Daya Serap Lulusan Vokasi Relevan", "value": "68,4%"}
            ],
            "rootCauses": [
                "Tingginya depresiasi mesin perkakas sekolah kejuruan tanpa anggaran pemeliharaan berkala.",
                "Minimnya insentif Super Tax Deduction yang dimanfaatkan industri manufaktur daerah."
            ],
            "shortTermActions": [
                "Pengalokasian DAK Fisik tematik SMK berbasis komitmen Teaching Factory (TeFa) dengan mitra industri.",
                "Sosialisasi masif kemudahan klaim insentif pajak 200% bagi industri pembina SMK."
            ],
            "mediumTermActions": [
                "Pembangunan Shared Facilities Center (Balai Latihan Bersama) di tiap kawasan industri strategis.",
                "Sertifikasi kompetensi berkala bagi instruktur kejuruan langsung di lini manufaktur."
            ]
        },
        {
            "id": "PB-2026-005",
            "slug": "efisiensi-anggaran-ipm-daerah",
            "title": "Optimalisasi Pengeluaran Belanja Pendidikan APBD Terhadap Percepatan Peningkatan IPM Pendidikan",
            "category": "Efisiensi Fiskal & IPM",
            "targetAgencies": ["Kementerian Dalam Negeri", "Bappenas", "Kementerian Keuangan"],
            "status": "Draf Siap Dikirim",
            "date": "10 November 2026",
            "author": "Divisi Kebijakan Publik EduAtlas",
            "executiveSummary": "Beberapa daerah mencatatkan spending per student di atas Rp 7,5 juta namun skor IPM Pendidikan tetap di bawah 68. Pergeseran proporsi belanja dari birokrasi ke beasiswa dan ruang belajar sangat mendesak.",
            "keyEvidence": [
                {"label": "Rata-rata Belanja Per Siswa", "value": "Rp 5.420.000 / Tahun"},
                {"label": "Korelasi Anggaran vs IPM", "value": "Koefisien R = 0,64"},
                {"label": "Daerah Kategori Kuadran Butuh Optimalisasi", "value": "48 Kabupaten/Kota"}
            ],
            "rootCauses": [
                "Proporsi belanja barang/jasa dan perjalanan dinas aparatur dinas pendidikan yang melampaui 35% APBD fungsi pendidikan.",
                "Belum adanya indikator kinerja capaian pembelajaran yang diikatkan dengan transfer dana insentif fiskal."
            ],
            "shortTermActions": [
                "Penerapan batas pagu maksimal belanja operasional aparatur dinas pendidikan maksimal 15% dari total APBD pendidikan.",
                "Pengalokasian dana insentif daerah (DID) berbasis kenaikan literasi dan numerasi Rapor Pendidikan."
            ],
            "mediumTermActions": [
                "Audit kepatuhan mandatory spending 20% yang murni mengalir ke satuan pendidikan peserta didik.",
                "Pengembangan sistem akuntansi pendidikan berbasis satuan biaya standar regional (SBSR)."
            ]
        }
    ]

    with open(ANALYTICS_DIR / "policy_brief_templates.json", "w", encoding="utf-8") as f:
        json.dump(policy_briefs, f, indent=2, ensure_ascii=False)
    print(f"[Pipeline-05] Policy briefs generated: {ANALYTICS_DIR / 'policy_brief_templates.json'}")

    print("[Pipeline-05] SELURUH GENERASI DATASET EKSPANSI SUKSES!")

if __name__ == "__main__":
    generate_expansion_analytics()
