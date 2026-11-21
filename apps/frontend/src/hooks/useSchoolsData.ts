import { useQuery } from '@tanstack/react-query';
import { schoolsService } from '../services/schools.service';

export function useSchoolsData(params?: {
  stage?: string;
  province?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['schools', params],
    queryFn: () => schoolsService.getSchools(params),
    staleTime: 1000 * 60 * 5,
  });
}
