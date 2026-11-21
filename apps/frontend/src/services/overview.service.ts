import { apiClient } from './api';
import {
  OVERVIEW_KPIS,
  OVERVIEW_TREND_DATA,
  OVERVIEW_DISTRIBUTION_DATA,
  OVERVIEW_TOP_PROVINCES,
  OVERVIEW_SNAPSHOT_META,
} from '../constants/overview.constants';

export interface OverviewApiResponse {
  kpi: typeof OVERVIEW_KPIS;
  trendData: typeof OVERVIEW_TREND_DATA;
  distributionData: typeof OVERVIEW_DISTRIBUTION_DATA;
  topProvinces: typeof OVERVIEW_TOP_PROVINCES;
  snapshotInfo: typeof OVERVIEW_SNAPSHOT_META;
}

export const overviewService = {
  async getOverviewData(period = '2026', regionId?: string): Promise<OverviewApiResponse> {
    try {
      const response = await apiClient.get<any, any>('/overview', {
        params: { period, regionId },
      });
      // If backend returns data wrapped in standard response
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch {
      // Offline / Unreachable backend fallback to constants snapshot
      return {
        kpi: OVERVIEW_KPIS,
        trendData: OVERVIEW_TREND_DATA,
        distributionData: OVERVIEW_DISTRIBUTION_DATA,
        topProvinces: OVERVIEW_TOP_PROVINCES,
        snapshotInfo: OVERVIEW_SNAPSHOT_META,
      };
    }
  },
};
