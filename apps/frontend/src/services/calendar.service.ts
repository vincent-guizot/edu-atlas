import { apiClient } from './api';
import { CALENDAR_SNAPSHOT_DATA, CalendarEventItem } from '../constants/calendar.constants';

export const calendarService = {
  async getEvents(params?: { category?: string }): Promise<CalendarEventItem[]> {
    try {
      const response = await apiClient.get<any, any>('/calendar', { params });
      if (response && response.data) {
        return response.data;
      }
      return response;
    } catch {
      let filtered = [...CALENDAR_SNAPSHOT_DATA];
      if (params?.category && params.category !== 'all') {
        filtered = filtered.filter((e) => e.category === params.category);
      }
      return filtered;
    }
  },
};
