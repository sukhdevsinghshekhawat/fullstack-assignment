import type { Task } from '@/types/task';
import type { FieldVisibility } from './TaskFieldsMenu';
import { TaskTableHeader } from './TaskTableHeader';
import { TaskTableRow } from './TaskTableRow';

interface TaskTableProps {
  tasks: Task[];
  fields: FieldVisibility;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskTable({ tasks, fields, onEdit, onDelete }: TaskTableProps) {
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
                className="px-4 py-8 text-center text-sm text-muted-foreground"
              >
                No tasks
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