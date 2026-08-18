'use client';

import { LayoutGrid, List } from 'lucide-react';

interface TaskViewSwitcherProps {
  view: 'board' | 'list';
  onViewChange: (view: 'board' | 'list') => void;
}

export function TaskViewSwitcher({ view, onViewChange }: TaskViewSwitcherProps) {
  return (
    <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
      <button
        onClick={() => onViewChange('board')}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
          view === 'board'
            ? 'bg-accent text-accent-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="Board view"
        aria-pressed={view === 'board'}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        Board
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
          view === 'list'
            ? 'bg-accent text-accent-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="List view"
        aria-pressed={view === 'list'}
      >
        <List className="h-3.5 w-3.5" />
        List
      </button>
    </div>
  );
}