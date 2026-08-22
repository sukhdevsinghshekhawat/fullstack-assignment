'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Task, TaskMember, TaskPriority } from '@/types/task';
import { TASK_PRIORITIES } from '@/types/task';
import { SubtaskTable } from './SubtaskTable';

interface TaskSubtasksProps {
  subtasks: Task[];
  workspaceMembers: TaskMember[];
  onAdd: (input: {
    title: string;
    priority: TaskPriority;
    memberIds: string[];
    dueDate?: string;
  }) => Promise<void>;
  onEdit: (subtask: Task) => void;
  onDelete: (subtaskId: string) => void;
}

export function TaskSubtasks({
  subtasks,
  workspaceMembers,
  onAdd,
  onEdit,
  onDelete,
}: TaskSubtasksProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('NO_PRIORITY');
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onAdd({
        title: title.trim(),
        priority,
        memberIds,
        dueDate: dueDate || undefined,
      });
      setTitle('');
      setPriority('NO_PRIORITY');
      setMemberIds([]);
      setDueDate('');
      setModalOpen(false);
    } catch (err) {
      setError('Failed to add subtask.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">Subtasks</h2>

      {subtasks.length > 0 ? (
        <SubtaskTable
          subtasks={subtasks}
          workspaceMembers={workspaceMembers}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <p className="text-sm text-muted-foreground">No subtasks yet.</p>
      )}

      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Subtasks
      </button>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="subtask-modal-title"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-surface rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="subtask-modal-title" className="text-lg font-semibold text-foreground">
                Add Subtask
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="subtask-title" className="block text-sm font-medium text-foreground mb-1">
                  Title
                </label>
                <input
                  id="subtask-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Subtask title"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="subtask-priority" className="block text-sm font-medium text-foreground mb-1">
                  Priority
                </label>
                <select
                  id="subtask-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {TASK_PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Members</label>
                <div className="flex flex-wrap gap-1.5">
                  {workspaceMembers.map((m) => {
                    const isSelected = memberIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setMemberIds((prev) =>
                            isSelected
                              ? prev.filter((id) => id !== m.id)
                              : [...prev, m.id],
                          );
                        }}
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                        }`}
                      >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 text-[10px] font-semibold">
                          {(m.name || m.email || '?').charAt(0).toUpperCase()}
                        </span>
                        {m.name || m.email || 'Unnamed'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="subtask-due-date" className="block text-sm font-medium text-foreground mb-1">
                  Due Date
                </label>
                <input
                  id="subtask-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Subtask'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}