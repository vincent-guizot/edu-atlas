"""
=============================================================================
Fase 3: Data Scientist - Feature Engineering & Disparity Clustering
EduAtlas Platform - Machine Learning Feature Store
=============================================================================
Membaca dataset dari 03_processed/ untuk rekayasa fitur dan segmentasi:
  - Ekstraksi fitur terukur (Rasio Siswa-Guru, Normalisasi Fasilitas, Akreditasi bobot)
  - Algoritma Clustering (K-Means K=3) untuk segmentasi disparitas sekolah
  - Pembagian Train-Test Split (80:20)
  - Menyimpan ke data/04_features/
"""

import os
import csv
import json
import math
import random
from pathlib import Path

random.seed(1337)

BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_DIR = BASE_DIR / "03_processed"
FEATURES_DIR = BASE_DIR / "04_features"
FEATURES_DIR.mkdir(parents=True, exist_ok=True)

def load_csv(path: Path) -> list:
    with open(path, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))

def save_csv(path: Path, rows: list):
    if not rows:
        return
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
    print(f"[DS] Feature Store: {len(rows)} baris disimpan ke {path.name}")

def k_means(points, k=3, max_iters=50):
    # Pure Python K-Means for 2D clustering: [facility_norm, ratio_norm]
    centroids = random.sample(points, k)
    assignments = [0] * len(points)

    for _ in range(max_iters):
        changed = False
        # Assign points to closest centroid
        for idx, p in enumerate(points):
            best_dist = float("inf")
            best_cluster = 0
            for c_idx, c in enumerate(centroids):
                dist = math.sqrt((p[0] - c[0])**2 + (p[1] - c[1])**2)
                if dist < best_dist:
                    best_dist = dist
                    best_cluster = c_idx
            if assignments[idx] != best_cluster:
                assignments[idx] = best_cluster
                changed = True

        if not changed:
            break

        # Recompute centroids
        for c_idx in range(k):
            cluster_pts = [points[i] for i in range(len(points)) if assignments[i] == c_idx]
            if cluster_pts:
                avg_x = sum(p[0] for p in cluster_pts) / len(cluster_pts)
                avg_y = sum(p[1] for p in cluster_pts) / len(cluster_pts)
                centroids[c_idx] = [avg_x, avg_y]

    return assignments, centroids

def build_features():
    print("[DS] Memulai Feature Engineering & Segmentasi K-Means...")

    dim_regions = {r["province_id"]: r for r in load_csv(PROCESSED_DIR / "dim_regions.csv")}
    dim_schools = {s["school_id"]: s for s in load_csv(PROCESSED_DIR / "dim_schools.csv")}
    fact_academics = load_csv(PROCESSED_DIR / "fact_school_academics.csv")

    raw_features = []
    all_facilities = []
    all_ratios = []

    for fact in fact_academics:
        s_id = fact["school_id"]
        meta = dim_schools.get(s_id, {})
        reg = dim_regions.get(meta.get("province_id"), {})

        facility = float(fact["facility_score"])
        str_ratio = float(fact["student_teacher_ratio"])
        all_facilities.append(facility)
        all_ratios.append(str_ratio)

        accred = fact["accreditation"]
        accred_weight = 3.0 if accred == "A" else (2.0 if accred == "B" else 1.0)
        is_negeri = 1 if meta.get("ownership") == "Negeri" else 0

        level = meta.get("education_level", "SMA")
        level_code = {"SD": 1, "SMP": 2, "SMA": 3, "SMK": 4}.get(level, 3)

        ipm = float(reg.get("ipm", 70.0))
        poverty = float(reg.get("poverty_rate", 10.0))

        raw_features.append({
            "school_id": s_id,
            "school_name": meta.get("school_name", ""),
            "province_name": reg.get("province_name", ""),
            "island": reg.get("island", ""),
            "education_level": level,
            "level_code": level_code,
            "is_negeri": is_negeri,
            "student_total": int(fact["student_total"]),
            "teacher_total": int(fact["teacher_total"]),
            "student_teacher_ratio": str_ratio,
            "facility_score": facility,
            "accreditation_weight": accred_weight,
            "regional_ipm": ipm,
            "regional_poverty": poverty
        })

    # Min-Max Normalization
    min_fac, max_fac = min(all_facilities), max(all_facilities)
    min_rat, max_rat = min(all_ratios), max(all_ratios)

    points_for_clustering = []
    for item in raw_features:
        fac_norm = (item["facility_score"] - min_fac) / (max_fac - min_fac + 1e-6)
        # Optimal ratio in Indonesia standard is ~15-20:1, so normalize inverse penalty
        rat_norm = (item["student_teacher_ratio"] - min_rat) / (max_rat - min_rat + 1e-6)
        item["facility_norm"] = round(fac_norm, 4)
        item["student_teacher_ratio_norm"] = round(rat_norm, 4)
        points_for_clustering.append([fac_norm, rat_norm])

    # K-Means Disparity Clustering (K=3: Cluster 0, 1, 2)
    clusters, centroids = k_means(points_for_clustering, k=3)

    # Label clusters intuitively based on facility score
    centroid_scores = [(c[0], idx) for idx, c in enumerate(centroids)]
    centroid_scores.sort(reverse=True)
    cluster_labels = {
        centroid_scores[0][1]: "Tier 1: Unggul & Fasilitas Memadai",
        centroid_scores[1][1]: "Tier 2: Berkembang (Standar Nasional)",
        centroid_scores[2][1]: "Tier 3: Butuh Dukungan / Intervensi"
    }

    clustered_records = []
    for idx, item in enumerate(raw_features):
        c_id = clusters[idx]
        item["cluster_id"] = c_id
        item["cluster_label"] = cluster_labels[c_id]
        clustered_records.append(item)

    # Train-Test Split (80% Train, 20% Test)
    random.shuffle(clustered_records)
    split_idx = int(len(clustered_records) * 0.8)
    train_set = clustered_records[:split_idx]
    test_set = clustered_records[split_idx:]

    save_csv(FEATURES_DIR / "train_features.csv", train_set)
    save_csv(FEATURES_DIR / "test_features.csv", test_set)
    save_csv(FEATURES_DIR / "school_disparity_clusters.csv", clustered_records)

    # Save feature metadata
    metadata = {
        "dataset_name": "EduAtlas ML School Performance & Disparity Feature Store",
        "total_records": len(clustered_records),
        "train_records": len(train_set),
        "test_records": len(test_set),
        "split_ratio": "80:20",
        "random_seed": 1337,
        "features": [
            {"name": "level_code", "type": "int", "description": "Encoded school level (1=SD, 2=SMP, 3=SMA, 4=SMK)"},
            {"name": "is_negeri", "type": "binary", "description": "1 if school is public (Negeri), 0 if private"},
            {"name": "student_teacher_ratio", "type": "float", "description": "Raw student count divided by teacher count"},
            {"name": "facility_norm", "type": "float", "description": "MinMax normalized facility score (0.0 to 1.0)"},
            {"name": "accreditation_weight", "type": "float", "description": "3.0 for A, 2.0 for B, 1.0 for C"},
            {"name": "regional_ipm", "type": "float", "description": "Human Development Index of the province"}
        ],
        "clusters_summary": {label: sum(1 for r in clustered_records if r["cluster_label"] == label) for label in cluster_labels.values()}
    }

    with open(FEATURES_DIR / "feature_metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

    print(f"[DS] Feature Store Metadata disimpan ke {FEATURES_DIR / 'feature_metadata.json'}")

def main():
    build_features()

if __name__ == "__main__":
    main()
