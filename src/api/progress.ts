import { apiRequest } from "./client";
import type { CreateProgressEntryInput, ProgressEntry } from "./types";

export const progressApi = {
  getByClientId: (clientId: string) =>
    apiRequest<ProgressEntry[]>(`/progress?clientId=${clientId}`),

  create: (payload: CreateProgressEntryInput) =>
    apiRequest<ProgressEntry>("/progress", {
      method: "POST",
      body: payload,
    }),

  remove: (entryId: string) =>
    apiRequest<{ success: boolean }>(`/progress/${entryId}`, {
      method: "DELETE",
    }),
};