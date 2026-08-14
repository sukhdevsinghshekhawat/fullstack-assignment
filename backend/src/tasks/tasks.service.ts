import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TasksRepository, TaskQuery } from './tasks.repository';
import { CreateTaskDto, UpdateTaskDto } from './dto';

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

  create(userId: string, dto: CreateTaskDto) {
    return this.tasksRepository.create(userId, {
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      memberIds: dto.memberIds,
      labels: dto.labels,
    });
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    const task = await this.tasksRepository.update(id, userId, {
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      memberIds: dto.memberIds,
      labels: dto.labels,
    });
    if (!task) {
      throw new ForbiddenException('Task not found or not owned by user');
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
}