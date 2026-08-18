'use client';

import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '@/types/task';
import { TASK_STATUSES } from '@/types/task';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: () => void;
}

export function TaskColumn({ status, tasks, onTaskMove, onAddTask }: TaskColumnProps) {
  const label = TASK_STATUSES.find((s) => s.value === status)?.label ?? status;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-medium text-foreground mb-2">
        <span>{label}</span>
        <button
          onClick={onAddTask}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`Add task to ${label}`}
        >
          + Add Task
        </button>
      </div>

      {tasks.length === 0 && (
        <div className="text-center text-xs text-muted-foreground py-4">
          No tasks
        </div>
      )}

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onMove={(newStatus: TaskStatus) => onTaskMove(task.id, newStatus)}
        />
      ))}
    </div>
  );
}