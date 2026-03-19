import { apiRequest } from "./client";
import type { DemoRequestInput, LeadMagnetInput } from "./types";

export const marketingApi = {
  requestDemo: (payload: DemoRequestInput) =>
    apiRequest<{ success: boolean }>("/marketing/demo-request", {
      method: "POST",
      body: payload,
    }),

  downloadLeadMagnet: (payload: LeadMagnetInput) =>
    apiRequest<{ success: boolean }>("/marketing/lead-magnet", {
      method: "POST",
      body: payload,
    }),
};