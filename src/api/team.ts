import { apiRequest } from "./client";
import type { InviteTeamMemberInput, TeamMember } from "./types";

export const teamApi = {
  getAll: () => apiRequest<TeamMember[]>("/team"),

  invite: (payload: InviteTeamMemberInput) =>
    apiRequest<TeamMember>("/team/invite", {
      method: "POST",
      body: payload,
    }),

  remove: (memberId: string) =>
    apiRequest<{ success: boolean }>(`/team/${memberId}`, {
      method: "DELETE",
    }),
};