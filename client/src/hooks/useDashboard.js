import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '../api/dashboard';

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardStats,
  });
