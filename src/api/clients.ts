import { apiRequest } from "./client";
import type {
  Client,
  CreateClientInput,
  PaginatedResponse,
  UpdateClientInput,
} from "./types";

export const clientsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiRequest<PaginatedResponse<Client>>(`/clients${suffix}`);
  },

  getById: (clientId: string) => apiRequest<Client>(`/clients/${clientId}`),

  create: (payload: CreateClientInput) =>
    apiRequest<Client>("/clients", {
      method: "POST",
      body: payload,
    }),

  update: (clientId: string, payload: UpdateClientInput) =>
    apiRequest<Client>(`/clients/${clientId}`, {
      method: "PATCH",
      body: payload,
    }),

  remove: (clientId: string) =>
    apiRequest<{ success: boolean }>(`/clients/${clientId}`, {
      method: "DELETE",
    }),
};