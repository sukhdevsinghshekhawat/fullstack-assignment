'use client';

import { MoreHorizontal, Calendar } from 'lucide-react';
import Link from 'next/link';
import type { Task, TaskStatus } from '@/types/task';
import { TASK_STATUSES } from '@/types/task';
import { TaskPriority } from './TaskPriority';
import { TaskMember } from './TaskMember';
import { TaskLabels } from './TaskLabels';

interface TaskCardProps {
  task: Task;
  onMove?: (newStatus: TaskStatus) => void;
}

export function TaskCard({ task, onMove }: TaskCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50">
      <div className="flex flex-col gap-2">
        <Link href={`/tasks/${task.id}`} className="font-medium text-foreground line-clamp-2 hover:text-accent transition-colors">
          {task.title}
        </Link>

        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <TaskPriority priority={task.priority} showLabel={false} />
          {task.members && task.members.length > 0 && (
            <TaskMember member={task.members[0].user} />
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {task.dueDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        <TaskLabels labels={task.labels} />
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
        {onMove ? (
          <select
            value={task.status}
            onChange={(e) => onMove(e.target.value as TaskStatus)}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label={`Move task ${task.title} to status`}
          >
            {TASK_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-xs text-muted-foreground">
            {TASK_STATUSES.find((s) => s.value === task.status)?.label ?? task.status}
          </span>
        )}
        <MoreHorizontal
          className="h-4 w-4 text-muted-foreground hover:text-foreground"
          aria-label="Task actions"
        />
      </div>
    </div>
  );
}