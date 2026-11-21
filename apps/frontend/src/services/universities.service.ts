import { apiClient } from './api';
import { UNIVERSITIES_SNAPSHOT_DATA, UniversityItem } from '../constants/universities.constants';

export const universitiesService = {
  async getUniversities(params?: {
    type?: string;
    province?: string;
    search?: string;
  }): Promise<{ items: UniversityItem[]; total: number }> {
    try {
      const response = await apiClient.get<any, any>('/universities', { params });
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch {
      let filtered = [...UNIVERSITIES_SNAPSHOT_DATA];
      if (params?.type) {
        filtered = filtered.filter((u) => u.type === params.type);
      }
      if (params?.province) {
        filtered = filtered.filter((u) => u.province === params.province);
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter((u) => {
          const haystack = `${u.name} ${u.shortName} ${u.city}`.toLowerCase();
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
