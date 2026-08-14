import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import type { User } from '@prisma/client';

export interface GuestSession {
  user: User;
  sessionToken: string;
}

/**
 * In-memory session store for guest sessions.
 *
 * For Screen 1 this is sufficient and keeps the deployment
 * dependency-free (no Redis required). Each guest token maps to
 * a user. When real auth (email + Google OAuth) is added, this
 * can be swapped for a Session table or a JWT strategy without
 * changing the controller contract.
 */
const guestSessions = new Map<string, string>(); // sessionToken -> userId

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new guest user and issue a session token,
   * or resume an existing session if a valid token is supplied.
   */
  async loginAsGuest(existingToken?: string): Promise<GuestSession> {
    if (existingToken) {
      const userId = guestSessions.get(existingToken);
      if (userId) {
        const user = await this.usersService.findUserById(userId);
        if (user) {
          return { user, sessionToken: existingToken };
        }
      }
      // Token was presented but is invalid/expired.
      throw new UnauthorizedException('Invalid session token');
    }

    const user = await this.usersService.createGuestUser();
    const sessionToken = randomUUID();
    guestSessions.set(sessionToken, user.id);

    return { user, sessionToken };
  }
}