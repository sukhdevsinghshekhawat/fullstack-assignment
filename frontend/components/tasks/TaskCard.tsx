import { MoreHorizontal } from 'lucide-react';
import type { Task, TaskStatus } from '@/types/task';
import { TaskPriority } from './TaskPriority';
import { TaskMember } from './TaskMember';
import { TaskLabels } from './TaskLabels';

interface TaskCardProps {
  task: Task;
  onMove?: (newStatus: TaskStatus) => void;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div
      className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-foreground line-clamp-2">
          {task.title}
        </h3>

        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <TaskPriority priority={task.priority} showLabel={false} />
          <TaskMember member={task.members[0].user} />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            <span className="calendar" aria-hidden="true" />
            {new Date(task.dueDate ?? Date.now()).toLocaleDateString()}
          </span>
        </div>

        <TaskLabels labels={task.labels} />
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex gap-2">
          <MoreHorizontal
            className="h-4 w-4 text-muted-foreground hover:text-foreground"
            aria-label="Task actions"
          />
        </div>
      </div>
    </div>
  );
}