import type { Task } from '@/types/task';
import type { FieldVisibility } from './TaskFieldsMenu';
import { TaskTableHeader } from './TaskTableHeader';
import { TaskTableRow } from './TaskTableRow';
import { Plus } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  fields: FieldVisibility;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAddTask?: () => void;
}

export function TaskTable({ tasks, fields, onEdit, onDelete, onAddTask }: TaskTableProps) {
  const visibleColumnCount =
    1 +
    (fields.priority ? 1 : 0) +
    (fields.members ? 1 : 0) +
    (fields.dueDate ? 1 : 0) +
    (fields.labels ? 1 : 0) +
    (fields.status ? 1 : 0) +
    (fields.reporter ? 1 : 0) +
    1;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <TaskTableHeader fields={fields} />
        </thead>
        <tbody>
          {tasks.length === 0 && (
            <tr>
              <td
                colSpan={visibleColumnCount}
                className="px-4 py-6 text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-muted-foreground">No tasks</p>
                  {onAddTask && (
                    <button
                      onClick={onAddTask}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                      aria-label="Add task"
                    >
                      <Plus className="h-3 w-3" />
                      Add Task
                    </button>
                  )}
                </div>
              </td>
            </tr>
          )}
          {tasks.map((task) => (
            <TaskTableRow
              key={task.id}
              task={task}
              fields={fields}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}