import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateCommentDto,
  CreateResourceDto,
  CreateTaskDto,
  QueryTaskDto,
  UpdateCommentDto,
  UpdateTaskDto,
} from './dto';

import type { AuthenticatedRequest } from '../auth/guards/session.guard';
import { SessionGuard } from '../auth/guards/session.guard';

@Controller('tasks')
@UseGuards(SessionGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest, @Query() query: QueryTaskDto) {
    return this.tasksService.findAll(req.user!.id, query);
  }

  @Get('members')
  findWorkspaceMembers(@Req() req: AuthenticatedRequest) {
    return this.tasksService.findWorkspaceMembers(req.user!.id);
  }

  @Get('teams')
  findTeams(@Req() req: AuthenticatedRequest) {
    return this.tasksService.findTeams(req.user!.id);
  }

  @Post('teams')
  createTeam(
    @Req() req: AuthenticatedRequest,
    @Body('name') name: string,
  ) {
    return this.tasksService.createTeam(req.user!.id, name);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.tasksService.findOne(id, req.user!.id);
  }

  @Get(':id/subtasks')
  findSubtasks(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.tasksService.findSubtasks(id, req.user!.id);
  }

  @Get(':id/comments')
  findComments(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.tasksService.findComments(id, req.user!.id);
  }

  @Post(':id/comments')
  createComment(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.tasksService.createComment(id, req.user!.id, dto);
  }

  @Patch(':id/comments/:commentId')
  updateComment(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.tasksService.updateComment(id, commentId, req.user!.id, dto);
  }

  @Delete(':id/comments/:commentId')
  deleteComment(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('commentId') commentId: string,
  ) {
    return this.tasksService.deleteComment(id, commentId, req.user!.id);
  }

  @Get(':id/resources')
  findResources(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.tasksService.findResources(id, req.user!.id);
  }

  @Post(':id/resources')
  createResource(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: CreateResourceDto,
  ) {
    return this.tasksService.createResource(id, req.user!.id, dto);
  }

  @Delete(':id/resources/:resourceId')
  deleteResource(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.tasksService.deleteResource(id, resourceId, req.user!.id);
  }

  @Get(':id/activity')
  findActivity(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.tasksService.findActivity(id, req.user!.id);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user!.id, dto);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, req.user!.id, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.tasksService.remove(id, req.user!.id);
  }
}
