import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { reportsApi } from "../reports";

export function useRevenueReport(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: queryKeys.revenueReport(params?.from, params?.to),
    queryFn: () => reportsApi.getRevenue(params),
  });
}

export function useExportCsv() {
  return useMutation({
    mutationFn: reportsApi.exportCsv,
  });
}