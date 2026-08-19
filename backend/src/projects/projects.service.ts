import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskPriority } from '@prisma/client';
import { ProjectsRepository, ProjectQuery } from './projects.repository';
import { QueryTaskDto } from '../tasks/dto/query-task.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  findAll(userId: string, query: ProjectQuery) {
    return this.projectsRepository.findMany(userId, query);
  }

  async findOne(id: string, userId: string) {
    const project = await this.projectsRepository.findById(id, userId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async create(userId: string, dto: CreateProjectDto) {
    if (dto.leadId) {
      const lead = await this.projectsRepository.findLead(userId, dto.leadId);
      if (!lead) {
        throw new BadRequestException('Selected lead does not belong to the workspace');
      }
    }

    return this.projectsRepository.create(userId, {
      name: dto.name,
      description: dto.description,
      priority: dto.priority ?? TaskPriority.NO_PRIORITY,
      leadId: dto.leadId,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    });
  }

  async update(id: string, userId: string, dto: UpdateProjectDto) {
    if (dto.leadId !== undefined && dto.leadId !== null) {
      const lead = await this.projectsRepository.findLead(userId, dto.leadId);
      if (!lead) {
        throw new BadRequestException('Selected lead does not belong to the workspace');
      }
    }

    const project = await this.projectsRepository.update(id, userId, {
      name: dto.name,
      description: dto.description,
      priority: dto.priority,
      leadId: dto.leadId,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : dto.dueDate === null ? null : undefined,
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async remove(id: string, userId: string) {
    const result = await this.projectsRepository.delete(id, userId);
    if (!result || 'blocked' in result && result.blocked) {
      if (result && 'blocked' in result && result.blocked) {
        throw new BadRequestException('Project contains tasks and cannot be deleted');
      }
      throw new NotFoundException('Project not found');
    }

    return result;
  }

  async findTasks(projectId: string, userId: string, query: QueryTaskDto = {}) {
    const project = await this.projectsRepository.findById(projectId, userId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return this.projectsRepository.findTasks(projectId, userId, query);
  }
}
