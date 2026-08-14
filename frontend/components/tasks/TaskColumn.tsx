import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '@/types/task';
import { TaskPriority } from './TaskPriority';

interface TaskColumnProps {
  status: 'TODO' | 'DOING' | 'COMPLETED' | 'ON_HOLD';
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: () => void;
}

export function TaskColumn({ status, tasks, onTaskMove, onAddTask }: TaskColumnProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-medium text-foreground mb-2">
        <span>{status}</span>
        <button
          onClick={onAddTask}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`Add task to ${status}`}
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
