'use client';

import { MoreHorizontal, Plus } from 'lucide-react';
import type { Project } from '@/types/project';
import { ProjectPriority } from './ProjectPriority';

interface ProjectTableProps {
  projects: Project[];
  onOpenProject: (id: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

function formatDate(date: string | null): string {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ProjectTable({ projects, onOpenProject, onEdit, onDelete }: ProjectTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-4 py-3 font-medium text-foreground">Projects</th>
              <th className="px-4 py-3 font-medium text-foreground">Priority</th>
              <th className="px-4 py-3 font-medium text-foreground">Lead</th>
              <th className="px-4 py-3 font-medium text-foreground">Due Date</th>
              <th className="px-4 py-3 font-medium text-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                <td className="px-4 py-3">
                  <button
                    onClick={() => onOpenProject(project.id)}
                    className="text-left font-medium text-foreground hover:text-accent"
                  >
                    {project.name}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <ProjectPriority priority={project.priority} />
                </td>
                <td className="px-4 py-3">
                  {project.lead ? (
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-[10px] font-semibold text-accent">
                        {(project.lead.name || project.lead.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="text-foreground">{project.lead.name || project.lead.email || 'Unknown'}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-foreground">{formatDate(project.dueDate)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(project)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label={`Edit ${project.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(project)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                      aria-label={`Delete ${project.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => onEdit(null as any)}
        className="flex w-full items-center justify-center gap-1.5 border-t border-border px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/30 hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        Add Projects
      </button>
    </div>
  );
}
