import { apiClient } from './api';
import { REPORTS_SNAPSHOT_DATA, ReportItem } from '../constants/reports.constants';

export const reportsService = {
  async getReports(): Promise<ReportItem[]> {
    try {
      const response = await apiClient.get<any, any>('/reports');
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch {
      return REPORTS_SNAPSHOT_DATA;
    }
  },
};
