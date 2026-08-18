'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { TaskStatus } from '@/types/task';
import { TASK_STATUSES } from '@/types/task';

interface TaskStatusMenuProps {
  status: TaskStatus;
  onChange: (status: TaskStatus) => void;
}

const statusDotColors: Record<TaskStatus, string> = {
  TODO: 'bg-muted-foreground',
  DOING: 'bg-blue-500',
  COMPLETED: 'bg-emerald-500',
  ON_HOLD: 'bg-amber-500',
};

export function TaskStatusMenu({ status, onChange }: TaskStatusMenuProps) {
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

  const current = TASK_STATUSES.find((s) => s.value === status);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-foreground hover:bg-muted transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className={`h-2 w-2 rounded-full ${statusDotColors[status]}`} />
        <span>{current?.label ?? status}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full mt-1 w-44 rounded-md bg-surface border border-border shadow-dropdown py-1 z-20"
        >
          {TASK_STATUSES.map((s) => (
            <button
              key={s.value}
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onChange(s.value);
              }}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-muted transition-colors ${
                s.value === status ? 'text-accent font-medium' : 'text-foreground'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${statusDotColors[s.value]}`} />
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}