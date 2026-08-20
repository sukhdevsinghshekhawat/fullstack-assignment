import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/guards/session.guard';
import { SessionGuard } from '../auth/guards/session.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

/**
 * Profile / Settings API.
 *
 * All endpoints are protected by the SessionGuard so the current user
 * is always derived from the authenticated session — never from a
 * client-supplied user id.
 */
@Controller()
@UseGuards(SessionGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users/me
   *
   * Returns the authenticated user's full profile.
   */
  @Get('users/me')
  getProfile(@Req() req: AuthenticatedRequest) {
    return this.usersService.getProfile(req.user!.id);
  }

  /**
   * PATCH /users/me
   *
   * Updates the authenticated user's own profile fields.
   */
  @Patch('users/me')
  updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user!.id, dto);
  }

  /**
   * GET /users/me/workspaces
   *
   * Returns all workspaces the authenticated user belongs to.
   */
  @Get('users/me/workspaces')
  getWorkspaces(@Req() req: AuthenticatedRequest) {
    return this.usersService.getWorkspaces(req.user!.id);
  }

  /**
   * POST /workspaces/:id/leave
   *
   * Removes the authenticated user from the specified workspace.
   */
  @Post('workspaces/:id/leave')
  leaveWorkspace(
    @Req() req: AuthenticatedRequest,
    @Param('id') workspaceId: string,
  ) {
    return this.usersService.leaveWorkspace(req.user!.id, workspaceId);
  }
}
