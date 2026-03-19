import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "../payments";
import { queryKeys } from "../queryKeys";

export function usePayments(clientId?: string) {
  return useQuery({
    queryKey: queryKeys.paymentsList(clientId),
    queryFn: () => paymentsApi.getAll(clientId),
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: paymentsApi.createCheckoutSession,
  });
}

export function useCreateClientPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsApi.createClientPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}