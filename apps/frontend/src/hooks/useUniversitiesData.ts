import { useQuery } from '@tanstack/react-query';
import { universitiesService } from '../services/universities.service';

export function useUniversitiesData(params?: {
  type?: string;
  province?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['universities', params],
    queryFn: () => universitiesService.getUniversities(params),
    staleTime: 1000 * 60 * 5,
  });
}
