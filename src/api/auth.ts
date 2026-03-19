import { apiRequest } from "./client";
import type { AuthResponse, User } from "./types";

export type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export const authApi = {
  register: (payload: RegisterInput) =>
    apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: payload,
    }),

  login: (payload: LoginInput) =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload,
    }),

  logout: () =>
    apiRequest<{ success: boolean }>("/auth/logout", {
      method: "POST",
    }),

  me: () => apiRequest<User>("/auth/me"),

  startTrial: () =>
    apiRequest<{ success: boolean; trialEndsAt: string }>("/auth/start-trial", {
      method: "POST",
    }),
};