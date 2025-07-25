import { useQuery } from '@tanstack/react-query';
import { fetchAudidLogs } from '../api/auditLogs';

export const useAuditLogs = () =>
  useQuery({
    queryKey: ['auditLogs'],
    queryFn: fetchAudidLogs,
  });
