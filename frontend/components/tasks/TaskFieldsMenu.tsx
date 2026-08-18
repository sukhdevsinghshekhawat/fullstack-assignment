'use client';

import { Check, X } from 'lucide-react';

export interface FieldVisibility {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

interface TaskFieldsMenuProps {
  visible: boolean;
  onClose: () => void;
  fields: FieldVisibility;
  onToggle: (field: keyof FieldVisibility) => void;
  view: 'board' | 'list';
  onViewChange: (view: 'board' | 'list') => void;
}

export function TaskFieldsMenu({ visible, onClose, fields, onToggle, view, onViewChange }: TaskFieldsMenuProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fields-menu-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-transform duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id="fields-menu-title" className="text-lg font-semibold text-foreground">
            Fields
          </h3>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground" aria-label="Close fields menu">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">View</label>
            <div className="flex gap-2">
              <button
                onClick={() => onViewChange('list')}
                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                  view === 'list'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={view === 'list'}
              >
                List
              </button>
              <button
                onClick={() => onViewChange('board')}
                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                  view === 'board'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={view === 'board'}
              >
                Board
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Columns</label>
            <div className="space-y-1">
              {([
                { key: 'priority' as const, label: 'Priority' },
                { key: 'members' as const, label: 'Members' },
                { key: 'dueDate' as const, label: 'Due Date' },
                { key: 'labels' as const, label: 'Labels' },
                { key: 'status' as const, label: 'Status' },
                { key: 'reporter' as const, label: 'Reporter' },
              ]).map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                      fields[key]
                        ? 'bg-accent border-accent text-accent-foreground'
                        : 'border-border bg-background'
                    }`}
                  >
                    {fields[key] && <Check className="h-3 w-3" strokeWidth={3} />}
                  </div>
                  <span className="text-sm text-foreground">{label}</span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={fields[key]}
                    onChange={() => onToggle(key)}
                    aria-label={`Toggle ${label} column`}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}