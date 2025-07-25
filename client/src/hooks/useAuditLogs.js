import { useQuery } from "@tanstack/react-query";
import { fetchAudidLogs } from "../api/auditLogs";

export const useAuditLogs = ({ page, limit }) =>
  useQuery({
    queryKey: ["auditLogs", { page, limit }],
    queryFn: () => fetchAudidLogs(page, limit),
  });
