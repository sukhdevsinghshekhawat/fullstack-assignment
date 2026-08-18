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
import { CreateTaskDto, QueryTaskDto, UpdateTaskDto } from './dto';
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

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.tasksService.findOne(id, req.user!.id);
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