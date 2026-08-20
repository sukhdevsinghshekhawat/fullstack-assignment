import { apiRequest } from '@/lib/api';
import type { GuestUser, UpdateProfileInput, WorkspaceMember } from '@/types/auth';

/**
 * GET /users/me
 * Returns the authenticated user's full profile from the session.
 */
export function getProfile(): Promise<GuestUser> {
  return apiRequest<GuestUser>('/users/me');
}

/**
 * PATCH /users/me
 * Updates the authenticated user's own profile fields.
 */
export function updateProfile(input: UpdateProfileInput): Promise<GuestUser> {
  return apiRequest<GuestUser>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

/**
 * GET /users/me/workspaces
 * Returns all workspaces the authenticated user belongs to.
 */
export function getWorkspaces(): Promise<WorkspaceMember[]> {
  return apiRequest<WorkspaceMember[]>('/users/me/workspaces');
}

/**
 * POST /workspaces/:id/leave
 * Removes the authenticated user from the specified workspace.
 */
export function leaveWorkspace(workspaceId: string): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `/workspaces/${workspaceId}/leave`,
    { method: 'POST' },
  );
}
