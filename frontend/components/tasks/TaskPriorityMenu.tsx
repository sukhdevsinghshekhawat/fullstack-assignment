'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Flag } from 'lucide-react';
import type { TaskPriority } from '@/types/task';
import { TASK_PRIORITIES } from '@/types/task';

interface TaskPriorityMenuProps {
  priority: TaskPriority;
  onChange: (priority: TaskPriority) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  NO_PRIORITY: 'text-muted-foreground',
  URGENT: 'text-red-600',
  HIGH: 'text-orange-500',
  MEDIUM: 'text-yellow-500',
  LOW: 'text-blue-500',
};

export function TaskPriorityMenu({ priority, onChange }: TaskPriorityMenuProps) {
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

  const current = TASK_PRIORITIES.find((p) => p.value === priority);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-foreground hover:bg-muted transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Flag className={`h-3.5 w-3.5 ${priorityColors[priority]}`} />
        <span>{current?.label ?? priority}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full mt-1 w-44 rounded-md bg-surface border border-border shadow-dropdown py-1 z-20"
        >
          {TASK_PRIORITIES.map((p) => (
            <button
              key={p.value}
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onChange(p.value);
              }}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-muted transition-colors ${
                p.value === priority ? 'text-accent font-medium' : 'text-foreground'
              }`}
            >
              <Flag className={`h-3.5 w-3.5 ${priorityColors[p.value]}`} />
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}