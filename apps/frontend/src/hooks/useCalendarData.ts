import { useQuery } from '@tanstack/react-query';
import { calendarService } from '../services/calendar.service';

export function useCalendarData(category?: string) {
  return useQuery({
    queryKey: ['calendar', category],
    queryFn: () => calendarService.getEvents({ category }),
    staleTime: 1000 * 60 * 5,
  });
}
