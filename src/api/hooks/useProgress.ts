import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { progressApi } from "../progress";
import { queryKeys } from "../queryKeys";
import type { CreateProgressEntryInput } from "../types";

export function useProgress(clientId: string) {
  return useQuery({
    queryKey: queryKeys.progressList(clientId),
    queryFn: () => progressApi.getByClientId(clientId),
    enabled: !!clientId,
  });
}

export function useCreateProgressEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProgressEntryInput) => progressApi.create(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.progressList(variables.clientId),
      });
    },
  });
}

export function useDeleteProgressEntry(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) => progressApi.remove(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.progressList(clientId),
      });
    },
  });
}