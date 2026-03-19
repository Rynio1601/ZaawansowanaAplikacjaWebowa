import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientsApi } from "../clients";
import { queryKeys } from "../queryKeys";
import type { CreateClientInput, UpdateClientInput } from "../types";

export function useClients(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.clientsList(params),
    queryFn: () => clientsApi.getAll(params),
  });
}

export function useClient(clientId: string) {
  return useQuery({
    queryKey: queryKeys.clientDetail(clientId),
    queryFn: () => clientsApi.getById(clientId),
    enabled: !!clientId,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClientInput) => clientsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, payload }: { clientId: string; payload: UpdateClientInput }) =>
      clientsApi.update(clientId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients });
      queryClient.invalidateQueries({
        queryKey: queryKeys.clientDetail(variables.clientId),
      });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientId: string) => clientsApi.remove(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients });
    },
  });
}