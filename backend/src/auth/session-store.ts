/**
 * In-memory session store for guest sessions.
 *
 * For Screen 1 this is sufficient and keeps the deployment
 * dependency-free (no Redis required). Each guest token maps to
 * a user. When real auth (email + Google OAuth) is added, this
 * can be swapped for a Session table or a JWT strategy without
 * changing the controller contract.
 */
export const guestSessions = new Map<string, string>(); // sessionToken -> userId