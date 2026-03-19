import { apiRequest } from "./client";
import type { RevenueReport } from "./types";

export const reportsApi = {
  getRevenue: (params?: { from?: string; to?: string }) => {
    const query = new URLSearchParams();
    if (params?.from) query.set("from", params.from);
    if (params?.to) query.set("to", params.to);

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiRequest<RevenueReport[]>(`/reports/revenue${suffix}`);
  },

  exportCsv: () =>
    apiRequest<{ url: string }>("/reports/export/csv", {
      method: "POST",
    }),
};