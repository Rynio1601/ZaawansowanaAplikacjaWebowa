import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { plansApi } from "../plans";
import { queryKeys } from "../queryKeys";
import type { CreateWorkoutPlanInput } from "../types";

export function useExercises() {
  return useQuery({
    queryKey: queryKeys.exercises,
    queryFn: plansApi.getExercises,
  });
}

export function usePlans(clientId?: string) {
  return useQuery({
    queryKey: queryKeys.plansList(clientId),
    queryFn: () => plansApi.getAll(clientId),
  });
}

export function usePlan(planId: string) {
  return useQuery({
    queryKey: queryKeys.planDetail(planId),
    queryFn: () => plansApi.getById(planId),
    enabled: !!planId,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorkoutPlanInput) => plansApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      planId,
      payload,
    }: {
      planId: string;
      payload: Partial<CreateWorkoutPlanInput>;
    }) => plansApi.update(planId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans });
      queryClient.invalidateQueries({
        queryKey: queryKeys.planDetail(variables.planId),
      });
    },
  });
}

export function useAssignPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, clientId }: { planId: string; clientId: string }) =>
      plansApi.assignToClient(planId, clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients });
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => plansApi.remove(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans });
    },
  });
}