"""
=============================================================================
Data Pipeline Orchestrator (DE, DA, DS)
EduAtlas Platform - Indonesian Education Data Sourcing & Management
=============================================================================
"""

import sys
import subprocess
from pathlib import Path
import datetime

PIPELINES_DIR = Path(__file__).resolve().parent

def run_step(step_name: str, script_name: str):
    print(f"\n{'='*70}")
    print(f"[*] Menjalankan {step_name} [{script_name}]...")
    print(f"{'='*70}")
    script_path = PIPELINES_DIR / script_name
    result = subprocess.run([sys.executable, str(script_path)], capture_output=True, text=True)
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(f"[!] Warning/Error output:\n{result.stderr}", file=sys.stderr)
    if result.returncode != 0:
        print(f"[X] Gagal mengeksekusi {script_name} (Exit code: {result.returncode})")
        sys.exit(result.returncode)
    print(f"[V] Berhasil menyelesaikan {step_name}")

def main():
    start_time = datetime.datetime.now()
    print("="*70)
    print(f"MEMULAI END-TO-END DATA PIPELINE TIM DATA: DE, DA, DS")
    print(f"Waktu Mulai: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)

    # 1. Ingestion / Raw Generation (DE)
    run_step("Fase 1: Data Ingestion & Raw Sourcing (DE)", "01_generate_raw_synthetic.py")

    # 2. Cleaning & Dimensional Modeling (DE & DA)
    run_step("Fase 2: Data Cleaning & Star-Schema Transformation (DE)", "02_clean_and_transform.py")

    # 3. Feature Engineering & Clustering (DS)
    run_step("Fase 3: Feature Engineering & Clustering Dataset (DS)", "03_generate_features_ds.py")

    # 4. Aggregations & Dashboard Analytics Mart (DA)
    run_step("Fase 4: KPI Aggregations & Analytics Mart (DA)", "04_generate_analytics_da.py")

    duration = (datetime.datetime.now() - start_time).total_seconds()
    print("\n" + "="*70)
    print(f"[DONE] SELURUH PIPELINE SELESAI DALAM {duration:.2f} DETIK!")
    print(f"Seluruh output telah tersusun rapi di dalam folder 'data/'.")
    print("="*70)

if __name__ == "__main__":
    main()
