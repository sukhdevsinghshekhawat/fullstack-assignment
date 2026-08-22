'use client';

import type { Task, TaskStatus } from '@/types/task';
import { TaskColumn } from './TaskColumn';

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onAddTask: (status?: TaskStatus) => void;
}

const STATUS_GROUPS: { status: TaskStatus; label: string }[] = [
  { status: 'TODO', label: 'To Do' },
  { status: 'DOING', label: 'Doing' },
  { status: 'COMPLETED', label: 'Completed' },
  { status: 'ON_HOLD', label: 'On Hold' },
];

export function TaskBoard({ tasks, onStatusChange, onAddTask }: TaskBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STATUS_GROUPS.map((group) => (
        <TaskColumn
          key={group.status}
          status={group.status}
          label={group.label}
          tasks={tasks.filter((t) => t.status === group.status)}
          onTaskMove={(taskId, newStatus) => onStatusChange(taskId, newStatus)}
          onAddTask={() => onAddTask(group.status)}
        />
      ))}
    </div>
  );
}