'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Project, ProjectPriority } from '@/types/project';
import type { TaskMember } from '@/types/task';

interface ProjectModalProps {
  visible: boolean;
  onClose: () => void;
  project?: Project | null;
  members?: TaskMember[];
  onSubmit: (input: {
    name: string;
    description?: string;
    priority?: ProjectPriority;
    leadId?: string;
    dueDate?: string;
  }) => Promise<void>;
}

const priorities: { value: ProjectPriority; label: string }[] = [
  { value: 'NO_PRIORITY', label: 'No Priority' },
  { value: 'URGENT', label: 'Urgent' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

export function ProjectModal({ visible, onClose, project, members = [], onSubmit }: ProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ProjectPriority>('NO_PRIORITY');
  const [leadId, setLeadId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setName(project?.name ?? '');
    setDescription(project?.description ?? '');
    setPriority(project?.priority ?? 'NO_PRIORITY');
    setLeadId(project?.leadId ?? '');
    setDueDate(project?.dueDate ? project.dueDate.slice(0, 10) : '');
    setError(null);
  }, [visible, project]);

  if (!visible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        priority,
        leadId: leadId || undefined,
        dueDate: dueDate || undefined,
      });
      onClose();
    } catch (err) {
      setError('Failed to save project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 id="project-modal-title" className="text-lg font-semibold text-foreground">
            {project ? 'Edit Project' : 'Add Project'}
          </h3>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="project-name" className="mb-1 block text-sm font-medium text-foreground">
              Project Name
            </label>
            <input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="project-description" className="mb-1 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Project description"
              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="project-priority" className="mb-1 block text-sm font-medium text-foreground">
                Priority
              </label>
              <select
                id="project-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as ProjectPriority)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="project-due-date" className="mb-1 block text-sm font-medium text-foreground">
                Due Date
              </label>
              <input
                id="project-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="project-lead" className="mb-1 block text-sm font-medium text-foreground">
              Project Lead
            </label>
            <select
              id="project-lead"
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">No lead</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email || 'Unknown user'}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
              {submitting ? 'Saving...' : project ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
