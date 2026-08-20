import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';

/**
 * Fields that are safe to return to the client.
 * Passwords / session secrets are never included.
 */
const userSelect = {
  id: true,
  email: true,
  name: true,
  fullName: true,
  title: true,
  username: true,
  avatarUrl: true,
  isGuest: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  createGuestUser(): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: 'Guest',
        isGuest: true,
      },
    });
  }

  /**
   * Returns the full profile (safe fields only) for the given user id.
   */
  findProfileById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  }

  /**
   * Updates the authenticated user's own profile.
   * Only the fields present in the DTO are written.
   */
  async updateProfile(id: string, dto: UpdateProfileDto) {
    const data: Record<string, unknown> = {};
    if (dto.fullName !== undefined) data.fullName = dto.fullName;
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.username !== undefined) data.username = dto.username;
    if (dto.avatarUrl !== undefined) data.avatarUrl = dto.avatarUrl;

    return this.prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });
  }

  /**
   * Returns all workspaces the user belongs to, including the
   * membership role and join date.
   */
  findWorkspaces(userId: string) {
    return this.prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
  }

  /**
   * Removes the user from the given workspace.
   * Returns the deleted membership or null if the user was not a member.
   */
  async leaveWorkspace(userId: string, workspaceId: string) {
    // Verify membership first.
    const membership = await this.prisma.workspaceMember.findFirst({
      where: { userId, workspaceId },
    });
    if (!membership) {
      return null;
    }

    return this.prisma.workspaceMember.delete({
      where: { id: membership.id },
      include: {
        workspace: {
          select: { id: true, name: true },
        },
      },
    });
  }
}
