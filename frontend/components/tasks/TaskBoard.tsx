'use client';

import type { Task, TaskStatus } from '@/types/task';
import { TaskColumn } from './TaskColumn';

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function TaskBoard({ tasks, onStatusChange, onAddTask }: TaskBoardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {(['TODO', 'DOING', 'COMPLETED', 'ON_HOLD'] as const).map((status) => (
        <TaskColumn
          key={status}
          status={status}
          tasks={tasks.filter((t) => t.status === status)}
          onTaskMove={(taskId, newStatus) => onStatusChange(taskId, newStatus)}
          onAddTask={() => onAddTask(status)}
        />
      ))}
    </div>
  );
}