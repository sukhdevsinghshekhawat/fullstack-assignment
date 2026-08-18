'use client';

import { Check, X } from 'lucide-react';
import type { TaskPriority, TaskStatus } from '@/types/task';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/types/task';

interface TaskFilterMenuProps {
  visible: boolean;
  onClose: () => void;
  selected: {
    status?: TaskStatus;
    priority?: TaskPriority;
  };
  onSelect: (field: 'status' | 'priority', value: string) => void;
}

export function TaskFilterMenu({
  visible,
  onClose,
  selected,
  onSelect,
}: TaskFilterMenuProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-menu-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-transform duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id="filter-menu-title" className="text-lg font-semibold text-foreground">
            Filter
          </h3>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground" aria-label="Close filter">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {/* Status filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Status
            </label>
            <div className="flex gap-2 flex-wrap">
              {TASK_STATUSES.map((s) => (
                <button
                  key={s.value}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    selected.status === s.value
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-accent/10 text-accent hover:bg-muted hover:text-foreground'
                  }`}
                  onClick={() => onSelect('status', s.value)}
                  aria-pressed={selected.status === s.value}
                >
                  {selected.status === s.value && <Check className="h-3 w-3" />}
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority filter */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Priority
            </label>
            <div className="flex gap-2 flex-wrap">
              {TASK_PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    selected.priority === p.value
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-accent/10 text-accent hover:bg-muted hover:text-foreground'
                  }`}
                  onClick={() => onSelect('priority', p.value)}
                  aria-pressed={selected.priority === p.value}
                >
                  {selected.priority === p.value && <Check className="h-3 w-3" />}
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground bg-accent">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}