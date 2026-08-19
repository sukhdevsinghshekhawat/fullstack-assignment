import { Injectable } from '@nestjs/common';
import { Prisma, TaskPriority, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryTaskDto } from '../tasks/dto/query-task.dto';

export interface ProjectQuery {
  search?: string;
  priority?: TaskPriority;
  lead?: string;
  dueDate?: string;
}

const projectInclude = {
  lead: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  tasks: {
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      dueDate: true,
    },
    orderBy: { createdAt: 'desc' },
  },
} satisfies Prisma.ProjectInclude;

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findLead(userId: string, leadId: string) {
    return this.prisma.user.findFirst({
      where: {
        id: leadId,
        OR: [{ id: userId }, { taskMembers: { some: { task: { createdById: userId } } } }],
      },
    });
  }

  findMany(userId: string, query: ProjectQuery = {}) {
    const where: Prisma.ProjectWhereInput = {
      createdById: userId,
    };

    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.lead) {
      where.leadId = query.lead;
    }

    if (query.dueDate) {
      const start = new Date(query.dueDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      where.dueDate = { gte: start, lt: end };
    }

    return this.prisma.project.findMany({
      where,
      include: projectInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string, userId: string) {
    return this.prisma.project.findFirst({
      where: { id, createdById: userId },
      include: projectInclude,
    });
  }

  create(userId: string, data: {
    name: string;
    description?: string;
    priority?: TaskPriority;
    leadId?: string;
    dueDate?: Date;
  }) {
    return this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        priority: data.priority,
        leadId: data.leadId,
        dueDate: data.dueDate,
        createdById: userId,
      },
      include: projectInclude,
    });
  }

  update(id: string, userId: string, data: {
    name?: string;
    description?: string;
    priority?: TaskPriority;
    leadId?: string | null;
    dueDate?: Date | null;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.project.findFirst({ where: { id, createdById: userId } });
      if (!existing) return null;

      return tx.project.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          priority: data.priority,
          leadId: data.leadId,
          dueDate: data.dueDate,
        },
        include: projectInclude,
      });
    });
  }

  delete(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.project.findFirst({ where: { id, createdById: userId } });
      if (!existing) return null;

      const taskCount = await tx.task.count({ where: { projectId: id } });
      if (taskCount > 0) {
        return { blocked: true, reason: 'Project contains tasks' } as const;
      }

      await tx.project.delete({ where: { id } });
      return { id, deleted: true };
    });
  }

  findTasks(projectId: string, userId: string, query: QueryTaskDto = {}) {
    const where: Prisma.TaskWhereInput = {
      projectId,
      createdById: userId,
      parentTaskId: null,
    };

    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }
    if (query.status) {
      where.status = query.status as TaskStatus;
    }
    if (query.priority) {
      where.priority = query.priority;
    }
    if (query.member) {
      where.members = { some: { userId: query.member } };
    }
    if (query.label) {
      where.labels = { some: { label: { name: query.label } } };
    }
    if (query.dueDate) {
      const start = new Date(query.dueDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      where.dueDate = { gte: start, lt: end };
    }

    return this.prisma.task.findMany({
      where,
      include: {
        members: { include: { user: true } },
        labels: { include: { label: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
