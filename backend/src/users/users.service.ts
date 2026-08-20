import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  createGuestUser() {
    return this.usersRepository.createGuestUser();
  }

  findUserById(id: string) {
    return this.usersRepository.findById(id);
  }

  /**
   * Returns the authenticated user's full profile (safe fields only).
   * The user id comes from the session, never from the client.
   */
  async getProfile(userId: string) {
    const user = await this.usersRepository.findProfileById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Updates the authenticated user's own profile.
   * Validates username uniqueness before writing.
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // If a username is being set, verify it is not already taken
    // by another user.
    if (dto.username) {
      const existing = await this.usersRepository.findByUsername(dto.username);
      if (existing && existing.id !== userId) {
        throw new ConflictException('Username is already taken');
      }
    }

    const updated = await this.usersRepository.updateProfile(userId, dto);
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }

  /**
   * Returns all workspaces the authenticated user belongs to.
   */
  getWorkspaces(userId: string) {
    return this.usersRepository.findWorkspaces(userId);
  }

  /**
   * Removes the authenticated user from the specified workspace.
   * Validates that the user is actually a member before deleting.
   */
  async leaveWorkspace(userId: string, workspaceId: string) {
    const result = await this.usersRepository.leaveWorkspace(userId, workspaceId);
    if (!result) {
      throw new NotFoundException('Workspace membership not found');
    }
    return result;
  }
}
