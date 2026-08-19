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
  team: true,
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.TaskInclude;

const commentInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  replies: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
} satisfies Prisma.TaskCommentInclude;

const activityInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.TaskActivityInclude;

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(userId: string, query: TaskQuery = {}) {
    const where: Prisma.TaskWhereInput = {
      createdById: userId,
      parentTaskId: null,
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

  findSubtasks(parentId: string, userId: string) {
    return this.prisma.task.findMany({
      where: { parentTaskId: parentId, createdById: userId },
      include: taskInclude,
      orderBy: { createdAt: 'asc' },
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
      startDate?: Date;
      endDate?: Date;
      parentTaskId?: string;
      teamId?: string;
      projectId?: string;
      memberIds?: string[];
      labels?: string[];
    },
  ) {
    const createData: Prisma.TaskUncheckedCreateInput = {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      startDate: data.startDate,
      endDate: data.endDate,
      parentTaskId: data.parentTaskId,
      teamId: data.teamId,
      projectId: data.projectId,
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
    };

    return this.prisma.task.create({
      data: createData,
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
      startDate?: Date | null;
      endDate?: Date | null;
      parentTaskId?: string | null;
      teamId?: string | null;
      projectId?: string | null;
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

      const updateData: Prisma.TaskUncheckedUpdateInput = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        startDate: data.startDate,
        endDate: data.endDate,
        parentTaskId: data.parentTaskId ?? undefined,
        teamId: data.teamId ?? undefined,
        projectId: data.projectId ?? undefined,
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

  // ---------- Comments ----------

  findComments(taskId: string, userId: string) {
    return this.prisma.taskComment.findMany({
      where: { taskId, parentCommentId: null },
      include: commentInclude,
      orderBy: { createdAt: 'asc' },
    });
  }

  createComment(
    taskId: string,
    userId: string,
    data: { content: string; parentCommentId?: string },
  ) {
    return this.prisma.taskComment.create({
      data: {
        taskId,
        userId,
        content: data.content,
        parentCommentId: data.parentCommentId,
      },
      include: commentInclude,
    });
  }

  updateComment(
    taskId: string,
    commentId: string,
    userId: string,
    content: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const comment = await tx.taskComment.findFirst({
        where: { id: commentId, taskId, userId },
      });
      if (!comment) {
        return null;
      }
      return tx.taskComment.update({
        where: { id: commentId },
        data: { content },
        include: commentInclude,
      });
    });
  }

  deleteComment(taskId: string, commentId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const comment = await tx.taskComment.findFirst({
        where: { id: commentId, taskId, userId },
      });
      if (!comment) {
        return null;
      }
      await tx.taskComment.delete({ where: { id: commentId } });
      return { id: commentId, deleted: true };
    });
  }

  // ---------- Resources ----------

  findResources(taskId: string, userId: string) {
    return this.prisma.taskResource.findMany({
      where: { taskId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  createResource(
    taskId: string,
    userId: string,
    data: { name: string; url: string; description?: string },
  ) {
    return this.prisma.taskResource.create({
      data: {
        taskId,
        userId,
        name: data.name,
        url: data.url,
        description: data.description,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  deleteResource(taskId: string, resourceId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const resource = await tx.taskResource.findFirst({
        where: { id: resourceId, taskId, userId },
      });
      if (!resource) {
        return null;
      }
      await tx.taskResource.delete({ where: { id: resourceId } });
      return { id: resourceId, deleted: true };
    });
  }

  // ---------- Activity ----------

  findActivity(taskId: string, userId: string) {
    return this.prisma.taskActivity.findMany({
      where: { taskId },
      include: activityInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  createActivity(
    taskId: string,
    userId: string,
    data: { type: string; message: string; metadata?: Prisma.InputJsonValue },
  ) {
    return this.prisma.taskActivity.create({
      data: {
        taskId,
        userId,
        type: data.type,
        message: data.message,
        metadata: data.metadata,
      },
      include: activityInclude,
    });
  }

  // ---------- Teams ----------

  findTeams(userId: string) {
    return this.prisma.team.findMany({
      where: { createdById: userId },
      orderBy: { name: 'asc' },
    });
  }

  createTeam(userId: string, name: string) {
    return this.prisma.team.create({
      data: { name, createdById: userId },
    });
  }

  // ---------- Members ----------

  findWorkspaceMembers(userId: string) {
    // In this single-workspace model, the workspace is the user's own
    // set of users. We return all users that share tasks with the
    // authenticated user, plus the user themselves.
    return this.prisma.user.findMany({
      where: {
        OR: [
          { id: userId },
          {
            taskMembers: {
              some: {
                task: { createdById: userId },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}