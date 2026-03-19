import { apiRequest } from "./client";
import type { DashboardStats } from "./types";

export const dashboardApi = {
  getStats: () => apiRequest<DashboardStats>("/dashboard/stats"),
};