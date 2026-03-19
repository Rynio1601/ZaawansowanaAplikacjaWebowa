import { apiRequest } from "./client";
import type {
  Exercise,
  WorkoutPlan,
  CreateWorkoutPlanInput,
  PaginatedResponse,
} from "./types";

export const plansApi = {
  getExercises: () => apiRequest<Exercise[]>("/exercises"),

  getAll: (clientId?: string) => {
    const suffix = clientId ? `?clientId=${clientId}` : "";
    return apiRequest<PaginatedResponse<WorkoutPlan>>(`/plans${suffix}`);
  },

  getById: (planId: string) => apiRequest<WorkoutPlan>(`/plans/${planId}`),

  create: (payload: CreateWorkoutPlanInput) =>
    apiRequest<WorkoutPlan>("/plans", {
      method: "POST",
      body: payload,
    }),

  update: (planId: string, payload: Partial<CreateWorkoutPlanInput>) =>
    apiRequest<WorkoutPlan>(`/plans/${planId}`, {
      method: "PATCH",
      body: payload,
    }),

  assignToClient: (planId: string, clientId: string) =>
    apiRequest<{ success: boolean }>(`/plans/${planId}/assign`, {
      method: "POST",
      body: { clientId },
    }),

  remove: (planId: string) =>
    apiRequest<{ success: boolean }>(`/plans/${planId}`, {
      method: "DELETE",
    }),
};