"""
=============================================================================
EduAtlas - Sinkronisasi Data Ekspansi 5 Fitur ke Backend & Frontend
=============================================================================
"""

import os
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ANALYTICS_DIR = BASE_DIR / "data" / "05_analytics"
BACKEND_DATA_DIR = BASE_DIR / "apps" / "backend" / "data"
FRONTEND_CONSTANTS_DIR = BASE_DIR / "apps" / "frontend" / "src" / "constants"
FRONTEND_PUBLIC_DATA_DIR = BASE_DIR / "apps" / "frontend" / "public" / "data"

FRONTEND_PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)
BACKEND_DATA_DIR.mkdir(parents=True, exist_ok=True)
FRONTEND_CONSTANTS_DIR.mkdir(parents=True, exist_ok=True)

def sync_expansion():
    print("[SyncExpansion] Membaca data analitik...")

    with open(ANALYTICS_DIR / "disparity_3t.json", "r", encoding="utf-8") as f:
        disparity_data = json.load(f)

    with open(ANALYTICS_DIR / "budget_efficiency.json", "r", encoding="utf-8") as f:
        budget_data = json.load(f)

    with open(ANALYTICS_DIR / "forecasting_baseline.json", "r", encoding="utf-8") as f:
        forecasting_data = json.load(f)

    with open(ANALYTICS_DIR / "policy_brief_templates.json", "r", encoding="utf-8") as f:
        policy_briefs_data = json.load(f)

    # 1. Simpan snapshot ke apps/backend/data/
    print("[SyncExpansion] Menyimpan ke backend/data/...")
    with open(BACKEND_DATA_DIR / "disparity-3t-snapshot.json", "w", encoding="utf-8") as f:
        json.dump(disparity_data, f, indent=2, ensure_ascii=False)

    with open(BACKEND_DATA_DIR / "budget-efficiency-snapshot.json", "w", encoding="utf-8") as f:
        json.dump(budget_data, f, indent=2, ensure_ascii=False)

    with open(BACKEND_DATA_DIR / "forecasting-baseline-snapshot.json", "w", encoding="utf-8") as f:
        json.dump(forecasting_data, f, indent=2, ensure_ascii=False)

    with open(BACKEND_DATA_DIR / "policy-briefs-snapshot.json", "w", encoding="utf-8") as f:
        json.dump(policy_briefs_data, f, indent=2, ensure_ascii=False)

    # 2. Simpan 514 kabupaten ke apps/frontend/public/data/regencies_514.json
    print("[SyncExpansion] Menyimpan GeoJSON/JSON regencies ke frontend/public/data/...")
    with open(FRONTEND_PUBLIC_DATA_DIR / "regencies_514.json", "w", encoding="utf-8") as f:
        json.dump(disparity_data["regencies"], f, indent=2, ensure_ascii=False)

    # 3. Generate TypeScript constants apps/frontend/src/constants/expansion.constants.ts
    print("[SyncExpansion] Menghasilkan expansion.constants.ts...")
    
    # Ambil sample 60 regencies untuk constants offline cepat
    sample_regencies = disparity_data["regencies"][:60]
    
    # Buat copy ringan tanpa 514 array utuh agar size bundle constants pas
    disparity_constants_data = dict(disparity_data)
    disparity_constants_data["regencies"] = sample_regencies

    ts_content = f"""/**
 * EduAtlas v1.2.0 Expansion Constants
 * Fallback Snapshot Data for 5 New Executive Features
 * 1. Simulator Proyeksi Kebijakan (/simulator)
 * 2. Policy Brief & Research Studio (/policy-brief)
 * 3. Studio Disparitas & Intervensi 3T (/equity-studio)
 * 4. Transparansi & Efisiensi Anggaran (/budget-analytics)
 * 5. Komparator Institusi Head-to-Head (/comparator)
 */

export interface RegencyItem {{
  regencyId: string;
  regencyName: string;
  type: string;
  provinceId: string;
  provinceName: string;
  islandGroup: string;
  is3T: boolean;
  ipmScore: number;
  povertyRate: number;
  studentCount: number;
  teacherCount: number;
  studentTeacherRatio: number;
  facilityScore: number;
  annualBudgetPerStudent: number;
  priorityIntervention: string;
}}

export interface Disparity3TSnapshot {{
  generated_at: string;
  summary: {{
    totalRegencies: number;
    total3TRegencies: number;
    totalNon3TRegencies: number;
    percentage3T: number;
    kmeansClusters: Record<string, number>;
  }};
  spm5Pillars: Array<{{
    pillar: string;
    standardMin: number;
    scoreNon3T: number;
    score3T: number;
    gap: number;
  }}>;
  islandComparison: Array<{{
    island: string;
    regencies: number;
    ratio3T: number;
    avgIpm: number;
    avgStr: number;
    facilityIndex: number;
  }}>;
  regencies: RegencyItem[];
}}

export interface ProvinceBudgetItem {{
  provinceId: string;
  provinceName: string;
  islandGroup: string;
  apbdEducationPct: number;
  totalEducationBudgetTrillion: number;
  spendingPerStudent: number;
  bosAbsorptionRate: number;
  dakFisikAbsorptionRate: number;
  ipmEducation: number;
  efficiencyStatus: string;
}}

export interface BudgetEfficiencySnapshot {{
  generated_at: string;
  nationalBudgetSummary: {{
    nationalEducationBudgetTrillion: number;
    avgApbdEducationPct: number;
    avgSpendingPerStudentNational: number;
    nationalBosAbsorptionRate: number;
    nationalDakFisikAbsorptionRate: number;
    fundingComponents: Array<{{
      name: string;
      allocationTrillion: number;
      sharePct: number;
    }}>;
  }};
  provinces: ProvinceBudgetItem[];
}}

export interface ForecastingBaselineSnapshot {{
  generated_at: string;
  baselineYear: number;
  projectionEndYear: number;
  nationalBaseline: {{
    totalStudents: number;
    totalTeachers: number;
    currentStr: number;
    targetStrStandard: number;
    annualRetirementCohortAvg: number;
    annualNewClassroomCostRp: number;
    annualTeacherSalaryStandardRp: number;
  }};
  islandBaselines: Array<{{
    island: string;
    students: number;
    teachers: number;
    str: number;
    annualRetirement: number;
  }}>;
  defaultParameters: {{
    annualTeacherRetirementRate: number;
    annualPppkRecruitmentQuota: number;
    annualStudentGrowthRate: number;
    targetStrNational: number;
    inflationBOSCost: number;
  }};
}}

export interface PolicyBriefItem {{
  id: string;
  slug: string;
  title: string;
  category: string;
  targetAgencies: string[];
  status: string;
  date: string;
  author: string;
  executiveSummary: string;
  keyEvidence: Array<{{ label: string; value: string }}>;
  rootCauses: string[];
  shortTermActions: string[];
  mediumTermActions: string[];
}}

export const DISPARITY_3T_SNAPSHOT: Disparity3TSnapshot = {json.dumps(disparity_constants_data, indent=2, ensure_ascii=False)};

export const BUDGET_EFFICIENCY_SNAPSHOT: BudgetEfficiencySnapshot = {json.dumps(budget_data, indent=2, ensure_ascii=False)};

export const FORECASTING_BASELINE_SNAPSHOT: ForecastingBaselineSnapshot = {json.dumps(forecasting_data, indent=2, ensure_ascii=False)};

export const POLICY_BRIEFS_SNAPSHOT: PolicyBriefItem[] = {json.dumps(policy_briefs_data, indent=2, ensure_ascii=False)};
"""

    with open(FRONTEND_CONSTANTS_DIR / "expansion.constants.ts", "w", encoding="utf-8") as f:
        f.write(ts_content)

    print("[SyncExpansion] Berhasil menyinkronkan seluruh dataset ekspansi!")

if __name__ == "__main__":
    sync_expansion()
