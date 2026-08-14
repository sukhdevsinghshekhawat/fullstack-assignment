import { useState } from 'react';
import type { TaskQuery, TaskStatus, TaskPriority, CreateTaskInput, Task } from '@/types/task';
import { TaskColumn } from './TaskColumn';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/tasks';

interface TaskBoardProps {
  collapsed: boolean;
}

export function TaskBoard({ collapsed }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState<TaskQuery>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (search: string) => {
    setQuery({ ...query, search });
  };

  const handleFilter = (filter: Partial<TaskQuery>) => {
    setQuery({ ...query, ...filter } as TaskQuery);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleCreate = async (input: CreateTaskInput) => {
    await createTask(input);
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {(['TODO', 'DOING', 'COMPLETED', 'ON_HOLD'] as const).map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            onTaskMove={handleStatusChange}
            onAddTask={() => handleCreate({ title: '', status })}
          />
        ))}
      </div>
    </div>
  );
}