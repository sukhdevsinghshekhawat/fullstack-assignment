import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import { guestSessions } from './session-store';
import type { User } from '@prisma/client';

export interface GuestSession {
  user: User;
  sessionToken: string;
}

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
      // Token was presented but is invalid/expired (e.g. the backend
      // restarted and the in-memory store was cleared). Instead of
      // failing with 401, fall through and create a fresh guest session
      // so the user can continue seamlessly.
    }

    const user = await this.usersService.createGuestUser();
    const sessionToken = randomUUID();
    guestSessions.set(sessionToken, user.id);

    return { user, sessionToken };
  }
}