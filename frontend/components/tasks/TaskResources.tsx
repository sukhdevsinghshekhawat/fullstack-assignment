'use client';

import { useState } from 'react';
import { ExternalLink, Link2, Plus, Trash2, X } from 'lucide-react';
import type { TaskResource } from '@/types/task';

interface TaskResourcesProps {
  resources: TaskResource[];
  onAdd: (input: { name: string; url: string; description?: string }) => Promise<void>;
  onDelete: (resourceId: string) => Promise<void>;
}

export function TaskResources({ resources, onAdd, onDelete }: TaskResourcesProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      setError('Name and URL are required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onAdd({
        name: name.trim(),
        url: url.trim(),
        description: description.trim() || undefined,
      });
      setName('');
      setUrl('');
      setDescription('');
      setAdding(false);
    } catch (err) {
      setError('Failed to add resource.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">Resources</h2>

      {resources.length > 0 && (
        <ul className="space-y-1.5">
          {resources.map((r) => (
            <li key={r.id} className="group flex flex-wrap sm:flex-nowrap items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors">
              <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 truncate text-sm text-foreground hover:text-accent transition-colors"
              >
                {r.name}
              </a>
              {r.description && (
                <span className="hidden sm:block truncate text-xs text-muted-foreground max-w-[200px]">
                  {r.description}
                </span>
              )}
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Open ${r.name}`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => onDelete(r.id)}
                className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                aria-label={`Delete ${r.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-2 rounded-md border border-border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Add resource</span>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Resource name"
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add document or link...
        </button>
      )}
    </div>
  );
}