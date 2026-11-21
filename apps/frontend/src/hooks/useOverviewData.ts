import { useQuery } from '@tanstack/react-query';
import { overviewService, OverviewApiResponse } from '../services/overview.service';

export function useOverviewData(period = '2026', regionId?: string) {
  return useQuery<OverviewApiResponse>({
    queryKey: ['overview', period, regionId],
    queryFn: () => overviewService.getOverviewData(period, regionId),
    staleTime: 1000 * 60 * 5,
  });
}
