'use client';

import { Calendar } from 'lucide-react';
import type { Task, TaskMember } from '@/types/task';
import { TaskMemberSelector } from './TaskMemberSelector';

interface TaskPropertiesProps {
  task: Task;
  workspaceMembers: TaskMember[];
  onMembersChange: (memberIds: string[]) => void;
  onDueDateChange: (date: string | null) => void;
}

export function TaskProperties({
  task,
  workspaceMembers,
  onMembersChange,
  onDueDateChange,
}: TaskPropertiesProps) {
  const selectedMemberIds = task.members.map((m) => m.user.id);

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">Properties</h2>

      <div className="flex items-center gap-2">
        <span className="w-20 text-sm text-muted-foreground">Assignee</span>
        <TaskMemberSelector
          members={workspaceMembers}
          selectedIds={selectedMemberIds}
          onSelect={(id) => onMembersChange([...selectedMemberIds, id])}
          onRemove={(id) => onMembersChange(selectedMemberIds.filter((m) => m !== id))}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-20 text-sm text-muted-foreground">Due Date</span>
        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'date';
            input.value = task.dueDate ? task.dueDate.slice(0, 10) : '';
            input.onchange = () => {
              if (input.value) {
                onDueDateChange(new Date(input.value).toISOString());
              } else {
                onDueDateChange(null);
              }
            };
            input.click();
          }}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-foreground hover:bg-muted transition-colors"
        >
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className={task.dueDate ? 'text-foreground' : 'text-muted-foreground'}>
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'Set due date'}
          </span>
        </button>
      </div>
    </div>
  );
}