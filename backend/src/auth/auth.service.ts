import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import { SessionRepository } from './session.repository';
import type { User } from '@prisma/client';

export interface GuestSession {
  user: User;
  sessionToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  /**
   * Create a new guest user and issue a session token,
   * or resume an existing session if a valid token is supplied.
   */
  async loginAsGuest(existingToken?: string): Promise<GuestSession> {
    if (existingToken) {
      const record = await this.sessionRepository.find(existingToken);
      if (record) {
        const user = await this.usersService.findUserById(record.userId);
        if (user) {
          return { user, sessionToken: existingToken };
        }
      }
      // If token presented but no DB record, fall through and create a fresh session.
    }

    const user = await this.usersService.createGuestUser();
    const sessionToken = randomUUID();
    await this.sessionRepository.create(sessionToken, user.id);

    return { user, sessionToken };
  }
}