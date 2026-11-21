import { apiClient } from './api';
import { SCHOOLS_SNAPSHOT_DATA, SchoolItem } from '../constants/schools.constants';

export const schoolsService = {
  async getSchools(params?: {
    stage?: string;
    province?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: SchoolItem[]; total: number }> {
    try {
      const response = await apiClient.get<any, any>('/schools', { params });
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch {
      // Offline fallback: filter constants locally if params provided
      let filtered = [...SCHOOLS_SNAPSHOT_DATA];
      if (params?.stage) {
        filtered = filtered.filter((s) => s.stage === params.stage);
      }
      if (params?.province) {
        filtered = filtered.filter((s) => s.province === params.province);
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter((s) => {
          const haystack = `${s.name} ${s.city} ${s.npsn}`.toLowerCase();
          return haystack.includes(query);
        });
      }
      return {
        items: filtered,
        total: filtered.length,
      };
    }
  },
};
