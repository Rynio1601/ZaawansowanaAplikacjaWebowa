import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../dashboard";
import { queryKeys } from "../queryKeys";

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: dashboardApi.getStats,
  });
}