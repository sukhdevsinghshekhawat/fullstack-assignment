'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, MoreHorizontal } from 'lucide-react';
import type { Task, TaskMember } from '@/types/task';
import { TaskPriority } from './TaskPriority';

interface SubtaskTableProps {
  subtasks: Task[];
  workspaceMembers: TaskMember[];
  onEdit: (subtask: Task) => void;
  onDelete: (subtaskId: string) => void;
}

function SubtaskActions({
  subtask,
  onEdit,
  onDelete,
}: {
  subtask: Task;
  onEdit: (subtask: Task) => void;
  onDelete: (subtaskId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-md p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-opacity"
        aria-label={`Actions for ${subtask.title}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 w-32 rounded-md bg-surface border border-border shadow-dropdown py-1 z-20"
        >
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onEdit(subtask);
            }}
            className="w-full px-3 py-1.5 text-xs text-left text-foreground hover:bg-muted"
          >
            Edit
          </button>
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onDelete(subtask.id);
            }}
            className="w-full px-3 py-1.5 text-xs text-left text-destructive hover:bg-destructive/10"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export function SubtaskTable({ subtasks, workspaceMembers, onEdit, onDelete }: SubtaskTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-border">
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Task</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Priority</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Members</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Due Date</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subtasks.map((subtask) => (
            <tr key={subtask.id} className="group border-b border-border transition-colors hover:bg-muted/30">
              <td className="px-3 py-2.5">
                <span className="text-sm font-medium text-foreground">{subtask.title}</span>
              </td>
              <td className="px-3 py-2.5">
                <TaskPriority priority={subtask.priority} showLabel />
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1">
                  {subtask.members && subtask.members.length > 0 ? (
                    subtask.members.slice(0, 2).map((m, i) => (
                      <div
                        key={i}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent"
                        title={m.user?.name || 'Member'}
                      >
                        {(m.user?.name || '?').charAt(0).toUpperCase()}
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                  {subtask.members && subtask.members.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{subtask.members.length - 2}</span>
                  )}
                </div>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {subtask.dueDate
                      ? new Date(subtask.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '-'}
                  </span>
                </div>
              </td>
              <td className="px-3 py-2.5 text-right">
                <SubtaskActions subtask={subtask} onEdit={onEdit} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}