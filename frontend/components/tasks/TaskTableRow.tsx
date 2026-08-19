'use client';

import { Calendar, Plus } from 'lucide-react';
import Link from 'next/link';
import type { Task } from '@/types/task';
import type { FieldVisibility } from './TaskFieldsMenu';
import { TaskPriority } from './TaskPriority';
import { TaskActions } from './TaskActions';

interface TaskTableRowProps {
  task: Task;
  fields: FieldVisibility;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskTableRow({ task, fields, onEdit, onDelete }: TaskTableRowProps) {
  return (
    <tr
      className="group border-b border-border transition-colors hover:bg-muted/30"
      data-testid="task-row"
    >
      {/* Task Title */}
      <td className="px-4 py-3">
        <Link
          href={`/tasks/${task.id}`}
          className="flex items-center gap-2 group/task"
          aria-label={`View task: ${task.title}`}
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
          <span className="text-sm font-medium text-foreground group-hover/task:text-accent transition-colors">
            {task.title}
          </span>
        </Link>
      </td>

      {/* Priority */}
      {fields.priority && (
        <td className="px-4 py-3">
          <TaskPriority priority={task.priority} showLabel />
        </td>
      )}

      {/* Members */}
      {fields.members && (
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            {task.members && task.members.length > 0 ? (
              task.members.slice(0, 2).map((m, i) => (
                <div
                  key={i}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent"
                  title={m.user?.name || 'Member'}
                >
                  {(m.user?.name || '?').charAt(0).toUpperCase()}
                </div>
              ))
            ) : (
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                aria-label="Add member"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
            {task.members && task.members.length > 2 && (
              <span className="text-xs text-muted-foreground ml-0.5">
                +{task.members.length - 2}
              </span>
            )}
          </div>
        </td>
      )}

      {/* Due Date */}
      {fields.dueDate && (
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : '-'}
            </span>
          </div>
        </td>
      )}

      {/* Labels */}
      {fields.labels && (
        <td className="px-4 py-3">
          <div className="flex gap-1 flex-wrap">
            {task.labels && task.labels.length > 0 ? (
              task.labels.map((l) => (
                <span
                  key={l.label.id}
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-muted-foreground bg-muted"
                >
                  {l.label.name}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">-</span>
            )}
          </div>
        </td>
      )}

      {/* Status */}
      {fields.status && (
        <td className="px-4 py-3">
          <span className="text-sm text-foreground">{task.status}</span>
        </td>
      )}

      {/* Reporter */}
      {fields.reporter && (
        <td className="px-4 py-3">
          <span className="text-sm text-muted-foreground">-</span>
        </td>
      )}

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}