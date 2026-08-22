'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import type { Task, TaskStatus } from '@/types/task';
import type { FieldVisibility } from './TaskFieldsMenu';
import { TaskTable } from './TaskTable';

interface TaskListGroupProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  fields: FieldVisibility;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function TaskListGroup({
  status,
  label,
  tasks,
  fields,
  onEdit,
  onDelete,
  onAddTask,
}: TaskListGroupProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mb-6">
      {/* Group Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 cursor-pointer select-none hover:bg-muted/20 rounded-lg transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(!collapsed);
            }}
            className="rounded-md p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <h3 className="text-sm font-medium text-foreground">{label}</h3>
          <span className="text-xs text-muted-foreground ml-1">({tasks.length})</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddTask(status);
          }}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          aria-label={`Add task to ${label}`}
        >
          <Plus className="h-3 w-3" />
          Add Task
        </button>
      </div>

      {/* Table */}
      {!collapsed && (
        <div className="mt-1">
          <TaskTable
            tasks={tasks}
            fields={fields}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddTask={() => onAddTask(status)}
          />
        </div>
      )}
    </div>
  );
}