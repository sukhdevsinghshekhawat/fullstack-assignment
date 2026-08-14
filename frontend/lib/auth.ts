import { apiRequest } from '@/lib/api';
import type { GuestLoginResponse } from '@/types/auth';

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