'use client';

import { Plus } from 'lucide-react';
import type { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: () => void;
}

const statusColors: Record<TaskStatus, string> = {
  TODO: 'bg-muted-foreground',
  DOING: 'bg-blue-500',
  COMPLETED: 'bg-emerald-500',
  ON_HOLD: 'bg-amber-500',
};

export function TaskColumn({ status, label, tasks, onTaskMove, onAddTask }: TaskColumnProps) {
  return (
    <div className="flex w-full min-w-[280px] sm:min-w-[320px] flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 shrink-0 rounded-full ${statusColors[status]}`} />
          <h3 className="text-sm font-medium text-foreground">{label}</h3>
          <span className="text-xs text-muted-foreground">({tasks.length})</span>
        </div>
        <button
          onClick={onAddTask}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label={`Add task to ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border px-3 text-center">
              <p className="text-xs text-muted-foreground">No tasks</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onMove={(newStatus) => onTaskMove(task.id, newStatus)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
