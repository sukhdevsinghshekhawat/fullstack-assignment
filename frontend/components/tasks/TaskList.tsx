'use client';

import type { Task, TaskStatus } from '@/types/task';
import type { FieldVisibility } from './TaskFieldsMenu';
import { TaskListGroup } from './TaskListGroup';

interface TaskListProps {
  tasks: Task[];
  fields: FieldVisibility;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

const STATUS_GROUPS: { status: TaskStatus; label: string }[] = [
  { status: 'TODO', label: 'To Do' },
  { status: 'DOING', label: 'Doing' },
  { status: 'COMPLETED', label: 'Completed' },
  { status: 'ON_HOLD', label: 'On Hold' },
];

export function TaskList({ tasks, fields, onEdit, onDelete, onAddTask }: TaskListProps) {
  return (
    <div className="space-y-2">
      {STATUS_GROUPS.map((group) => (
        <TaskListGroup
          key={group.status}
          status={group.status}
          label={group.label}
          tasks={tasks.filter((t) => t.status === group.status)}
          fields={fields}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddTask={onAddTask}
        />
      ))}
    </div>
  );
}