export const queryKeys = {
  auth: ["auth"] as const,
  me: ["auth", "me"] as const,

  dashboard: ["dashboard"] as const,

  clients: ["clients"] as const,
  clientsList: (params?: Record<string, unknown>) => ["clients", "list", params] as const,
  clientDetail: (clientId: string) => ["clients", clientId] as const,

  exercises: ["exercises"] as const,

  plans: ["plans"] as const,
  plansList: (clientId?: string) => ["plans", "list", { clientId }] as const,
  planDetail: (planId: string) => ["plans", planId] as const,

  progress: ["progress"] as const,
  progressList: (clientId: string) => ["progress", "list", clientId] as const,

  payments: ["payments"] as const,
  paymentsList: (clientId?: string) => ["payments", "list", { clientId }] as const,

  reports: ["reports"] as const,
  revenueReport: (from?: string, to?: string) => ["reports", "revenue", { from, to }] as const,

  team: ["team"] as const,
  teamList: ["team", "list"] as const,
};