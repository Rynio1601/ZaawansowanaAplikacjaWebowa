import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teamApi } from "../team";
import { queryKeys } from "../queryKeys";
import type { InviteTeamMemberInput } from "../types";

export function useTeam() {
  return useQuery({
    queryKey: queryKeys.teamList,
    queryFn: teamApi.getAll,
  });
}

export function useInviteTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InviteTeamMemberInput) => teamApi.invite(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team });
    },
  });
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => teamApi.remove(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team });
    },
  });
}