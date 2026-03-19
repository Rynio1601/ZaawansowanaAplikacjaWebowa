import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, type LoginInput, type RegisterInput } from "../auth";
import { queryKeys } from "../queryKeys";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: authApi.me,
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterInput) => authApi.register(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.me, data.user);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginInput) => authApi.login(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.me, data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.auth });
      queryClient.removeQueries({ queryKey: queryKeys.me });
    },
  });
}

export function useStartTrial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.startTrial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}