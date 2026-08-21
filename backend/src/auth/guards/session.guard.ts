import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { guestSessions } from '../session-store';
import { UsersService } from '../../users/users.service';
import { SessionRepository } from '../session.repository';

export const SESSION_COOKIE = 'taskflow_session';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string | null;
    name: string | null;
    fullName: string | null;
    title: string | null;
    username: string | null;
    avatarUrl: string | null;
    isGuest: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

/**
 * Verifies the HTTP-only session cookie and attaches the
 * authenticated user to the request. Every task API must go
 * through this guard so a guest can only access their own data.
 */
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies?.[SESSION_COOKIE] as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Not authenticated');
    }

    // Try DB-backed session first, then fallback to in-memory map.
    let userId: string | undefined;
    const record = await this.sessionRepository.find(token).catch(() => null);
    if (record && (record as any).userId) {
      userId = (record as any).userId;
    } else {
      userId = guestSessions.get(token);
    }

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    request.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      fullName: user.fullName,
      title: user.title,
      username: user.username,
      avatarUrl: user.avatarUrl,
      isGuest: user.isGuest,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return true;
  }
}
