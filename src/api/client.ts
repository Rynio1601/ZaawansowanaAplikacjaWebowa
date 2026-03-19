const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token, signal } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
    credentials: "include",
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const responseData = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(
      responseData?.message || "Wystąpił błąd podczas komunikacji z API.",
      response.status,
      responseData
    );
  }

  return responseData as T;
}