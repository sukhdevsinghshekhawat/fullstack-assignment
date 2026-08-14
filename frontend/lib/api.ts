import type { ApiError } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * Minimal fetch wrapper for the NestJS REST API.
 * Throws a typed ApiError when the backend responds with an error status.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorBody: Partial<ApiError> = {};
    try {
      errorBody = (await response.json()) as Partial<ApiError>;
    } catch {
      // Non-JSON error response; fall back to the HTTP status text below.
    }

    throw {
      statusCode: response.status,
      message: errorBody.message ?? `Request failed with status ${response.status}`,
      error: errorBody.error,
    } as ApiError;
  }

  return (await response.json()) as T;
}