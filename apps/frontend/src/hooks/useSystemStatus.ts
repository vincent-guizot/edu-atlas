import { useQuery } from '@tanstack/react-query';
import { statusService } from '../services/status.service';

export function useSystemStatus() {
  return useQuery({
    queryKey: ['system-status'],
    queryFn: () => statusService.getStatus(),
    staleTime: 1000 * 30, // 30 seconds
  });
}
