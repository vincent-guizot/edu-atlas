import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports.service';

export function useReportsData() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsService.getReports(),
    staleTime: 1000 * 60 * 5,
  });
}
