import { apiClient } from './api';
import { SYSTEM_STATUS_SNAPSHOT, ServiceHealthStatus } from '../constants/status.constants';

export const statusService = {
  async getStatus(): Promise<ServiceHealthStatus[]> {
    try {
      const response = await apiClient.get<any, any>('/health');
      if (Array.isArray(response)) {
        return response;
      }
      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      if (response && (response.status === 'ok' || response.data?.status === 'ok')) {
        return SYSTEM_STATUS_SNAPSHOT.map((item) => ({
          ...item,
          status: 'Online',
          lastChecked: new Date().toLocaleTimeString('id-ID'),
        }));
      }
      return SYSTEM_STATUS_SNAPSHOT;
    } catch {
      return SYSTEM_STATUS_SNAPSHOT;
    }
  },
};
