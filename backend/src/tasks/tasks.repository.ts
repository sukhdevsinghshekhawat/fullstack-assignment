import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TaskPriority, TaskStatus } from '@prisma/client';

export interface TaskQuery {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  member?: string;
  label?: string;
  dueDate?: string;
}

const taskInclude = {
  members: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
  labels: {
    include: {
      label: true,
    },
  },
} satisfies Prisma.TaskInclude;

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(userId: string, query: TaskQuery = {}) {
    const where: Prisma.TaskWhereInput = {
      createdById: userId,
    };

    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }
    if (query.status) {
      where.status = query.status;
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
      include: taskInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string, userId: string) {
    return this.prisma.task.findFirst({
      where: { id, createdById: userId },
      include: taskInclude,
    });
  }

  create(
    userId: string,
    data: {
      title: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date;
      memberIds?: string[];
      labels?: string[];
    },
  ) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        createdById: userId,
        members: data.memberIds?.length
          ? {
              create: data.memberIds.map((memberId) => ({ userId: memberId })),
            }
          : undefined,
        labels: data.labels?.length
          ? {
              create: data.labels.map((name) => ({
                user: { connect: { id: userId } },
                label: {
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
            }
          : undefined,
      },
      include: taskInclude,
    });
  }

  update(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date | null;
      memberIds?: string[];
      labels?: string[];
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Verify ownership first.
      const existing = await tx.task.findFirst({
        where: { id, createdById: userId },
      });
      if (!existing) {
        return null;
      }

      const updateData: Prisma.TaskUpdateInput = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
      };

      if (data.memberIds) {
        await tx.taskMember.deleteMany({ where: { taskId: id } });
        if (data.memberIds.length) {
          await tx.taskMember.createMany({
            data: data.memberIds.map((memberId) => ({
              taskId: id,
              userId: memberId,
            })),
          });
        }
      }

      if (data.labels) {
        await tx.taskLabel.deleteMany({ where: { taskId: id } });
        if (data.labels.length) {
          for (const name of data.labels) {
            const label = await tx.label.upsert({
              where: { name },
              create: { name },
              update: {},
            });
            await tx.taskLabel.create({
              data: {
                taskId: id,
                labelId: label.id,
                userId,
              },
            });
          }
        }
      }

      return tx.task.update({
        where: { id },
        data: updateData,
        include: taskInclude,
      });
    });
  }

  delete(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.task.findFirst({
        where: { id, createdById: userId },
      });
      if (!existing) {
        return null;
      }
      await tx.task.delete({ where: { id } });
      return { id, deleted: true };
    });
  }
}