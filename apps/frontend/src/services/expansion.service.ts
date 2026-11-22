import { apiClient } from './api';
import {
  DISPARITY_3T_SNAPSHOT,
  BUDGET_EFFICIENCY_SNAPSHOT,
  FORECASTING_BASELINE_SNAPSHOT,
  POLICY_BRIEFS_SNAPSHOT,
  Disparity3TSnapshot,
  BudgetEfficiencySnapshot,
  ForecastingBaselineSnapshot,
  PolicyBriefItem,
  RegencyItem,
} from '../constants/expansion.constants';

export const expansionService = {
  async getDisparity3t(): Promise<Disparity3TSnapshot> {
    try {
      const response = await apiClient.get<any, any>('/education/analytics/disparity-3t');
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch {
      return DISPARITY_3T_SNAPSHOT;
    }
  },

  async getBudgetEfficiency(): Promise<BudgetEfficiencySnapshot> {
    try {
      const response = await apiClient.get<any, any>('/education/analytics/budget-efficiency');
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch {
      return BUDGET_EFFICIENCY_SNAPSHOT;
    }
  },

  async getForecastingBaseline(): Promise<ForecastingBaselineSnapshot> {
    try {
      const response = await apiClient.get<any, any>('/education/analytics/forecasting-baseline');
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch {
      return FORECASTING_BASELINE_SNAPSHOT;
    }
  },

  async getPolicyBriefs(): Promise<PolicyBriefItem[]> {
    try {
      const response = await apiClient.get<any, any>('/education/analytics/policy-briefs');
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch {
      return POLICY_BRIEFS_SNAPSHOT;
    }
  },

  async getAll514Regencies(): Promise<RegencyItem[]> {
    try {
      const res = await fetch('/data/regencies_514.json');
      if (res.ok) {
        return await res.json();
      }
      return DISPARITY_3T_SNAPSHOT.regencies;
    } catch {
      return DISPARITY_3T_SNAPSHOT.regencies;
    }
  },
};
