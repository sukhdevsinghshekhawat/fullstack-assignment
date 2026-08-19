import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TasksRepository, TaskQuery } from './tasks.repository';
import {
  CreateCommentDto,
  CreateResourceDto,
  CreateTaskDto,
  UpdateCommentDto,
  UpdateTaskDto,
} from './dto';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  findAll(userId: string, query: TaskQuery) {
    return this.tasksRepository.findMany(userId, query);
  }

  async findOne(id: string, userId: string) {
    const task = await this.tasksRepository.findById(id, userId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async create(userId: string, dto: CreateTaskDto) {
    // Validate endDate >= startDate if both present.
    this.validateDateRange(dto.startDate, dto.endDate);

    // If parentTaskId is provided, verify the parent belongs to the user.
    if (dto.parentTaskId) {
      const parent = await this.tasksRepository.findById(dto.parentTaskId, userId);
      if (!parent) {
        throw new BadRequestException('Parent task not found');
      }
    }

    // If projectId is provided, verify the project belongs to the user.
    if (dto.projectId) {
      await this.verifyProject(userId, dto.projectId);
    }

    // Verify member IDs belong to the workspace.
    await this.verifyMembers(userId, dto.memberIds);

    const task = await this.tasksRepository.create(userId, {
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      parentTaskId: dto.parentTaskId,
      teamId: dto.teamId,
      projectId: dto.projectId,
      memberIds: dto.memberIds,
      labels: dto.labels,
    });

    // Create activity entry.
    await this.tasksRepository.createActivity(task.id, userId, {
      type: 'TASK_CREATED',
      message: 'created this task',
    });

    return task;
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    // Validate date range.
    this.validateDateRange(dto.startDate, dto.endDate);

    // If projectId is provided, verify the project belongs to the user.
    if (dto.projectId) {
      await this.verifyProject(userId, dto.projectId);
    }

    // Verify member IDs belong to the workspace.
    await this.verifyMembers(userId, dto.memberIds);

    const task = await this.tasksRepository.update(id, userId, {
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : dto.dueDate === null ? null : undefined,
      startDate: dto.startDate ? new Date(dto.startDate) : dto.startDate === null ? null : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : dto.endDate === null ? null : undefined,
      parentTaskId: dto.parentTaskId,
      teamId: dto.teamId,
      projectId: dto.projectId,
      memberIds: dto.memberIds,
      labels: dto.labels,
    });
    if (!task) {
      throw new ForbiddenException('Task not found or not owned by user');
    }

    // Create activity entry for the update.
    if (dto.status) {
      await this.tasksRepository.createActivity(task.id, userId, {
        type: 'STATUS_CHANGED',
        message: `changed status to ${dto.status}`,
        metadata: { status: dto.status },
      });
    }
    if (dto.priority) {
      await this.tasksRepository.createActivity(task.id, userId, {
        type: 'PRIORITY_CHANGED',
        message: `changed priority to ${dto.priority}`,
        metadata: { priority: dto.priority },
      });
    }

    return task;
  }

  async remove(id: string, userId: string) {
    const result = await this.tasksRepository.delete(id, userId);
    if (!result) {
      throw new ForbiddenException('Task not found or not owned by user');
    }
    return result;
  }

  // ---------- Subtasks ----------

  async findSubtasks(id: string, userId: string) {
    await this.ensureTaskAccess(id, userId);
    return this.tasksRepository.findSubtasks(id, userId);
  }

  // ---------- Comments ----------

  async findComments(id: string, userId: string) {
    await this.ensureTaskAccess(id, userId);
    return this.tasksRepository.findComments(id, userId);
  }

  async createComment(id: string, userId: string, dto: CreateCommentDto) {
    await this.ensureTaskAccess(id, userId);

    // If replying, verify the parent comment belongs to the same task.
    if (dto.parentCommentId) {
      const comments = await this.tasksRepository.findComments(id, userId);
      const allComments = this.flattenComments(comments);
      const parent = allComments.find((c) => c.id === dto.parentCommentId);
      if (!parent) {
        throw new BadRequestException('Parent comment not found');
      }
    }

    const comment = await this.tasksRepository.createComment(id, userId, {
      content: dto.content,
      parentCommentId: dto.parentCommentId,
    });

    await this.tasksRepository.createActivity(id, userId, {
      type: 'COMMENT_ADDED',
      message: 'posted an update',
    });

    return comment;
  }

  async updateComment(
    taskId: string,
    commentId: string,
    userId: string,
    dto: UpdateCommentDto,
  ) {
    await this.ensureTaskAccess(taskId, userId);
    const comment = await this.tasksRepository.updateComment(
      taskId,
      commentId,
      userId,
      dto.content,
    );
    if (!comment) {
      throw new ForbiddenException('Comment not found or not owned by user');
    }
    return comment;
  }

  async deleteComment(taskId: string, commentId: string, userId: string) {
    await this.ensureTaskAccess(taskId, userId);
    const result = await this.tasksRepository.deleteComment(
      taskId,
      commentId,
      userId,
    );
    if (!result) {
      throw new ForbiddenException('Comment not found or not owned by user');
    }
    return result;
  }

  // ---------- Resources ----------

  async findResources(id: string, userId: string) {
    await this.ensureTaskAccess(id, userId);
    return this.tasksRepository.findResources(id, userId);
  }

  async createResource(id: string, userId: string, dto: CreateResourceDto) {
    await this.ensureTaskAccess(id, userId);
    const resource = await this.tasksRepository.createResource(id, userId, {
      name: dto.name,
      url: dto.url,
      description: dto.description,
    });

    await this.tasksRepository.createActivity(id, userId, {
      type: 'RESOURCE_ADDED',
      message: `added resource ${dto.name}`,
      metadata: { resourceId: resource.id },
    });

    return resource;
  }

  async deleteResource(taskId: string, resourceId: string, userId: string) {
    await this.ensureTaskAccess(taskId, userId);
    const result = await this.tasksRepository.deleteResource(
      taskId,
      resourceId,
      userId,
    );
    if (!result) {
      throw new ForbiddenException('Resource not found or not owned by user');
    }
    return result;
  }

  // ---------- Activity ----------

  async findActivity(id: string, userId: string) {
    await this.ensureTaskAccess(id, userId);
    return this.tasksRepository.findActivity(id, userId);
  }

  // ---------- Teams ----------

  async findTeams(userId: string) {
    return this.tasksRepository.findTeams(userId);
  }

  async createTeam(userId: string, name: string) {
    return this.tasksRepository.createTeam(userId, name);
  }

  // ---------- Members ----------

  async findWorkspaceMembers(userId: string) {
    return this.tasksRepository.findWorkspaceMembers(userId);
  }

  // ---------- Helpers ----------

  private async ensureTaskAccess(taskId: string, userId: string) {
    const task = await this.tasksRepository.findById(taskId, userId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  private validateDateRange(startDate?: string, endDate?: string) {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        throw new BadRequestException('endDate must be greater than or equal to startDate');
      }
    }
  }

  private async verifyProject(userId: string, projectId: string) {
    const project = await this.tasksRepository.findProjectById(projectId, userId);
    if (!project) {
      throw new BadRequestException('Project not found or not owned by user');
    }
  }

  private async verifyMembers(userId: string, memberIds?: string[]) {
    if (!memberIds || memberIds.length === 0) return;
    const members = await this.tasksRepository.findWorkspaceMembers(userId);
    const validIds = new Set(members.map((m) => m.id));
    for (const id of memberIds) {
      if (!validIds.has(id)) {
        throw new BadRequestException(`Member ${id} does not belong to the workspace`);
      }
    }
  }

  private flattenComments(comments: any[]): any[] {
    const result: any[] = [];
    for (const c of comments) {
      result.push(c);
      if (c.replies?.length) {
        result.push(...this.flattenComments(c.replies));
      }
    }
    return result;
  }
}