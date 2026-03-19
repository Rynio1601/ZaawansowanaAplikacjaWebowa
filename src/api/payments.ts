import { apiRequest } from "./client";
import type {
  CreateCheckoutSessionResponse,
  PaginatedResponse,
  Payment,
} from "./types";

export const paymentsApi = {
  getAll: (clientId?: string) => {
    const suffix = clientId ? `?clientId=${clientId}` : "";
    return apiRequest<PaginatedResponse<Payment>>(`/payments${suffix}`);
  },

  createCheckoutSession: (payload: {
    plan: "basic" | "pro" | "studio";
    billingCycle: "monthly" | "yearly";
  }) =>
    apiRequest<CreateCheckoutSessionResponse>("/payments/checkout-session", {
      method: "POST",
      body: payload,
    }),

  createClientPayment: (payload: {
    clientId: string;
    amount: number;
    currency: string;
  }) =>
    apiRequest<Payment>("/payments/client-charge", {
      method: "POST",
      body: payload,
    }),
};