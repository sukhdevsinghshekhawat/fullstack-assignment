import { apiRequest } from '@/lib/api';
import type { GuestLoginResponse, GuestUser } from '@/types/auth';

/**
 * Calls POST /auth/guest on the NestJS backend.
 * The backend creates/retrieves a guest user and sets an
 * HTTP-only session cookie used on subsequent requests.
 */
export async function loginAsGuest(): Promise<GuestLoginResponse> {
  return apiRequest<GuestLoginResponse>('/auth/guest', {
    method: 'POST',
  });
}

/**
 * Calls GET /auth/me on the NestJS backend.
 * Returns the currently authenticated user from the session cookie.
 */
export async function getCurrentUser(): Promise<GuestUser> {
  return apiRequest<GuestUser>('/auth/me');
}