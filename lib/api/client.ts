const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:1234/api/v1";

export class ApiError extends Error {
  status: number;
  code: string | undefined;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type ApiEnvelope<T> = { success: true; message?: string; data: T };
type PaginatedEnvelope<T> = {
  success: true;
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

async function parseResponse<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    throw new ApiError(
      json?.error?.message ?? "Something went wrong. Please try again.",
      res.status,
      json?.error?.code,
    );
  }

  return json as T;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; accessToken?: string | null | undefined } = {},
): Promise<ApiEnvelope<T>> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  return parseResponse<ApiEnvelope<T>>(res);
}

export async function apiFetchPaginated<T = unknown>(
  path: string,
  options: { accessToken?: string | null | undefined } = {},
): Promise<PaginatedEnvelope<T>> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {},
  });

  return parseResponse<PaginatedEnvelope<T>>(res);
}

export async function apiUpload<T = unknown>(
  path: string,
  formData: FormData,
  options: { accessToken?: string | null | undefined } = {},
): Promise<ApiEnvelope<T>> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
    },
    body: formData,
  });

  return parseResponse<ApiEnvelope<T>>(res);
}
