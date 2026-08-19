'use client';

import { Flag } from 'lucide-react';
import type { ProjectPriority as ProjectPriorityType } from '@/types/project';

const priorityStyles: Record<ProjectPriorityType, { label: string; className: string }> = {
  NO_PRIORITY: { label: 'No Priority', className: 'text-muted-foreground' },
  URGENT: { label: 'Urgent', className: 'text-red-600' },
  HIGH: { label: 'High', className: 'text-orange-500' },
  MEDIUM: { label: 'Medium', className: 'text-yellow-500' },
  LOW: { label: 'Low', className: 'text-blue-500' },
};

export function ProjectPriority({ priority }: { priority: ProjectPriorityType }) {
  const style = priorityStyles[priority] ?? priorityStyles.NO_PRIORITY;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${style.className}`}>
      <Flag className="h-3.5 w-3.5" />
      <span>{style.label}</span>
    </span>
  );
}
