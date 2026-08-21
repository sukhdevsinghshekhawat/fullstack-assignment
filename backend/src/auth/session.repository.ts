import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { guestSessions } from './session-store';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(token: string, userId: string) {
    const client: any = (this.prisma as any).session;
    if (client && typeof client.create === 'function') {
      return client.create({ data: { token, userId } });
    }

    // Fallback to in-memory store if Prisma client isn't regenerated yet.
    guestSessions.set(token, userId);
    return { token, userId, createdAt: new Date() };
  }

  async find(token: string) {
    const client: any = (this.prisma as any).session;
    if (client && typeof client.findUnique === 'function') {
      return client.findUnique({ where: { token } });
    }

    // Fallback to in-memory store if Prisma client isn't regenerated yet.
    const userId = guestSessions.get(token);
    if (!userId) return null;
    return { token, userId, createdAt: new Date() };
  }

  async delete(token: string) {
    const client: any = (this.prisma as any).session;
    if (client && typeof client.delete === 'function') {
      return client.delete({ where: { token } });
    }

    // Fallback to in-memory store
    const existed = guestSessions.has(token);
    guestSessions.delete(token);
    return existed ? { token, deleted: true } : null;
  }
}
