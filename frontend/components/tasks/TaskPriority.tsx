import { Flag } from 'lucide-react';
import type { TaskPriority as TaskPriorityType } from '@/types/task';

const priorityStyles: Record<TaskPriorityType, { label: string; className: string }> = {
  NO_PRIORITY: { label: 'No Priority', className: 'text-muted-foreground' },
  URGENT: { label: 'Urgent', className: 'text-red-600' },
  HIGH: { label: 'High', className: 'text-orange-500' },
  MEDIUM: { label: 'Medium', className: 'text-yellow-500' },
  LOW: { label: 'Low', className: 'text-blue-500' },
};

interface TaskPriorityProps {
  priority: TaskPriorityType;
  showLabel?: boolean;
}

export function TaskPriority({ priority, showLabel = true }: TaskPriorityProps) {
  const style = priorityStyles[priority];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${style.className}`}>
      <Flag className="h-3.5 w-3.5" />
      {showLabel && <span>{style.label}</span>}
    </span>
  );
}