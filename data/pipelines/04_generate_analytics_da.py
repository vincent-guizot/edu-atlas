"""
=============================================================================
Fase 4: Data Analyst - KPI Aggregations, Rankings & Executive Mart
EduAtlas Platform - Business Intelligence & Dashboard Ready Mart
=============================================================================
Membaca dataset dari 03_processed/ dan 04_features/ untuk agregasi analitik:
  - data/05_analytics/overview_kpi.json (KPI Utama Nasional untuk kartu dashboard)
  - data/05_analytics/regional_performance_ranking.csv (Peringkat performa per provinsi)
  - data/05_analytics/education_level_distribution.json (Statistik per jenjang SD/SMP/SMA/SMK)
  - data/05_analytics/island_disparity_analysis.csv (Komparasi Jawa vs Luar Jawa)
"""

import os
import csv
import json
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_DIR = BASE_DIR / "03_processed"
FEATURES_DIR = BASE_DIR / "04_features"
ANALYTICS_DIR = BASE_DIR / "05_analytics"
ANALYTICS_DIR.mkdir(parents=True, exist_ok=True)

def load_csv(path: Path) -> list:
    with open(path, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))

def generate_analytics():
    print("[DA] Memulai perhitungan KPI analitik & ringkasan eksekutif...")

    dim_regions = load_csv(PROCESSED_DIR / "dim_regions.csv")
    dim_schools = load_csv(PROCESSED_DIR / "dim_schools.csv")
    fact_academics = load_csv(PROCESSED_DIR / "fact_school_academics.csv")
    fact_universities = load_csv(PROCESSED_DIR / "fact_universities.csv")
    clusters_data = load_csv(FEATURES_DIR / "school_disparity_clusters.csv")

    school_map = {s["school_id"]: s for s in dim_schools}
    region_map = {r["province_id"]: r for r in dim_regions}

    # -------------------------------------------------------------
    # 1. National Overview KPI
    # -------------------------------------------------------------
    total_schools = len(dim_schools)
    total_students = sum(int(f["student_total"]) for f in fact_academics)
    total_teachers = sum(int(f["teacher_total"]) for f in fact_academics)
    avg_national_str = round(total_students / max(1, total_teachers), 2)
    avg_facility = round(sum(float(f["facility_score"]) for f in fact_academics) / total_schools, 2)

    accred_counts = defaultdict(int)
    for f in fact_academics:
        accred_counts[f["accreditation"]] += 1

    total_univ = len(fact_universities)
    total_mahasiswa = sum(int(u["student_total"]) for u in fact_universities)
    total_dosen = sum(int(u["lecturer_total"]) for u in fact_universities)

    overview_kpi = {
        "generated_at": "2026-11-22",
        "national_summary": {
            "total_provinces": len(dim_regions),
            "total_schools_sample": total_schools,
            "total_students_enrolled": total_students,
            "total_teachers_active": total_teachers,
            "student_teacher_ratio": avg_national_str,
            "average_facility_score": avg_facility,
            "accreditation_breakdown": dict(accred_counts)
        },
        "higher_education_summary": {
            "total_universities": total_univ,
            "total_university_students": total_mahasiswa,
            "total_lecturers": total_dosen,
            "student_lecturer_ratio": round(total_mahasiswa / max(1, total_dosen), 2)
        }
    }

    with open(ANALYTICS_DIR / "overview_kpi.json", "w", encoding="utf-8") as f:
        json.dump(overview_kpi, f, indent=2, ensure_ascii=False)
    print(f"[DA] Output: {ANALYTICS_DIR / 'overview_kpi.json'}")

    # -------------------------------------------------------------
    # 2. Regional Performance Ranking
    # -------------------------------------------------------------
    prov_stats = defaultdict(lambda: {
        "schools_count": 0,
        "total_students": 0,
        "total_teachers": 0,
        "facility_scores": [],
        "accred_a_count": 0
    })

    for f in fact_academics:
        s_id = f["school_id"]
        prov_id = school_map[s_id]["province_id"]
        stat = prov_stats[prov_id]
        stat["schools_count"] += 1
        stat["total_students"] += int(f["student_total"])
        stat["total_teachers"] += int(f["teacher_total"])
        stat["facility_scores"].append(float(f["facility_score"]))
        if f["accreditation"] == "A":
            stat["accred_a_count"] += 1

    regional_ranking = []
    for r in dim_regions:
        p_id = r["province_id"]
        st = prov_stats[p_id]
        sc_cnt = max(1, st["schools_count"])
        avg_fac = round(sum(st["facility_scores"]) / sc_cnt, 2) if st["facility_scores"] else 70.0
        pct_a = round((st["accred_a_count"] / sc_cnt) * 100, 1)
        st_ratio = round(st["total_students"] / max(1, st["total_teachers"]), 2)
        ipm = float(r["ipm"])

        # Composite Performance Score (Weighted: 40% IPM, 40% Facilities, 20% Accred A%)
        composite_score = round((ipm * 0.4) + (avg_fac * 0.4) + (pct_a * 0.2), 2)

        regional_ranking.append({
            "province_id": p_id,
            "province_name": r["province_name"],
            "island": r["island"],
            "composite_score": composite_score,
            "ipm": ipm,
            "average_facility_score": avg_fac,
            "accreditation_a_pct": pct_a,
            "student_teacher_ratio": st_ratio,
            "sample_school_count": st["schools_count"],
            "total_students": st["total_students"]
        })

    regional_ranking.sort(key=lambda x: x["composite_score"], reverse=True)
    for rank, row in enumerate(regional_ranking, 1):
        row["national_rank"] = rank

    with open(ANALYTICS_DIR / "regional_performance_ranking.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(regional_ranking[0].keys()))
        writer.writeheader()
        writer.writerows(regional_ranking)
    print(f"[DA] Output: {ANALYTICS_DIR / 'regional_performance_ranking.csv'}")

    # -------------------------------------------------------------
    # 3. Education Level Distribution (SD, SMP, SMA, SMK)
    # -------------------------------------------------------------
    level_stats = defaultdict(lambda: {
        "school_count": 0,
        "students": 0,
        "teachers": 0,
        "facility_sum": 0.0,
        "accred_counts": defaultdict(int)
    })

    for f in fact_academics:
        s_id = f["school_id"]
        lvl = school_map[s_id]["education_level"]
        st = level_stats[lvl]
        st["school_count"] += 1
        st["students"] += int(f["student_total"])
        st["teachers"] += int(f["teacher_total"])
        st["facility_sum"] += float(f["facility_score"])
        st["accred_counts"][f["accreditation"]] += 1

    level_distribution = {}
    for lvl, st in level_stats.items():
        cnt = max(1, st["school_count"])
        level_distribution[lvl] = {
            "total_schools": st["school_count"],
            "total_students": st["students"],
            "total_teachers": st["teachers"],
            "student_teacher_ratio": round(st["students"] / max(1, st["teachers"]), 2),
            "average_facility_score": round(st["facility_sum"] / cnt, 2),
            "accreditation_breakdown": dict(st["accred_counts"])
        }

    with open(ANALYTICS_DIR / "education_level_distribution.json", "w", encoding="utf-8") as f:
        json.dump(level_distribution, f, indent=2, ensure_ascii=False)
    print(f"[DA] Output: {ANALYTICS_DIR / 'education_level_distribution.json'}")

    # -------------------------------------------------------------
    # 4. Island Disparity Analysis (Jawa vs Luar Jawa)
    # -------------------------------------------------------------
    island_stats = defaultdict(lambda: {
        "province_count": 0,
        "total_schools": 0,
        "total_students": 0,
        "total_teachers": 0,
        "sum_ipm": 0.0,
        "sum_facility": 0.0
    })

    for r in regional_ranking:
        isl = r["island"]
        island_group = "Pulau Jawa" if isl == "Jawa" else "Luar Pulau Jawa"
        st = island_stats[island_group]
        st["province_count"] += 1
        st["total_schools"] += r["sample_school_count"]
        st["total_students"] += r["total_students"]
        st["total_teachers"] += int(r["total_students"] / max(1, r["student_teacher_ratio"]))
        st["sum_ipm"] += r["ipm"]
        st["sum_facility"] += r["average_facility_score"]

    disparity_rows = []
    for grp, st in island_stats.items():
        pc = max(1, st["province_count"])
        disparity_rows.append({
            "region_group": grp,
            "province_count": st["province_count"],
            "total_sample_schools": st["total_schools"],
            "total_students": st["total_students"],
            "average_ipm": round(st["sum_ipm"] / pc, 2),
            "average_facility_score": round(st["sum_facility"] / pc, 2),
            "avg_student_teacher_ratio": round(st["total_students"] / max(1, st["total_teachers"]), 2)
        })

    with open(ANALYTICS_DIR / "island_disparity_analysis.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(disparity_rows[0].keys()))
        writer.writeheader()
        writer.writerows(disparity_rows)
    print(f"[DA] Output: {ANALYTICS_DIR / 'island_disparity_analysis.csv'}")

def main():
    generate_analytics()

if __name__ == "__main__":
    main()
