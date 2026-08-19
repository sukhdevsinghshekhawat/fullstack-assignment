'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { ProjectTable } from '@/components/projects/ProjectTable';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/projects';
import type { Project, ProjectQuery, ProjectPriority } from '@/types/project';
import { getCurrentUser } from '@/lib/auth';
import type { GuestUser } from '@/types/auth';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [currentUser, setCurrentUser] = useState<GuestUser | null>(null);

  const fetchProjects = useCallback(async (nextQuery: ProjectQuery = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects(nextQuery);
      setProjects(data);
    } catch {
      setError('Unable to load projects.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentUser().then(setCurrentUser).catch(() => router.push('/login'));
    fetchProjects();
  }, [fetchProjects, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects({ search: search || undefined });
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchProjects, search]);

  const handleCreateOrUpdate = async (input: {
    name: string;
    description?: string;
    priority?: ProjectPriority;
    leadId?: string;
    dueDate?: string;
  }) => {
    if (editingProject) {
      const updated = await updateProject(editingProject.id, {
        name: input.name,
        description: input.description ?? null,
        priority: input.priority,
        leadId: input.leadId ?? null,
        dueDate: input.dueDate ?? null,
      });
      setProjects((prev) => prev.map((project) => (project.id === updated.id ? updated : project)));
      return;
    }

    const created = await createProject(input);
    setProjects((prev) => [created, ...prev]);
  };

  const handleDelete = async (project: Project) => {
    const confirmed = window.confirm('Delete project?\nThis will not be reversible.');
    if (!confirmed) return;

    try {
      await deleteProject(project.id);
      setProjects((prev) => prev.filter((item) => item.id !== project.id));
    } catch {
      setError('Failed to delete project.');
    }
  };

  const handleEdit = (project: Project | null) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  return (
    <AppShell>
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h1 className="text-lg font-semibold text-foreground">Projects</h1>

          <div className="flex items-center gap-2">
            <button className="flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm text-foreground hover:bg-muted" aria-label="Search projects">
              <Search className="h-4 w-4" />
            </button>
            <button className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground hover:bg-muted">
              Fields
            </button>
            <button className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground hover:bg-muted">
              Filter
            </button>
            <button
              onClick={() => handleEdit(null)}
              className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              + Add Project
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span>{error}</span>
            <button onClick={() => fetchProjects({ search: search || undefined })} className="ml-2 underline hover:no-underline">
              Retry
            </button>
          </div>
        )}

        <div className="p-6">
          {loading && projects.length === 0 ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((row) => (
                <div key={row} className="h-12 rounded-lg bg-muted" />
              ))}
            </div>
          ) : !loading && projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
              <p className="text-base font-medium text-foreground">No projects yet.</p>
              <button
                onClick={() => handleEdit(null)}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Add Project</span>
              </button>
            </div>
          ) : (
            <ProjectTable
              projects={projects}
              onOpenProject={(id) => router.push(`/projects/${id}`)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <ProjectModal
        visible={modalOpen}
        project={editingProject}
        onClose={() => {
          setModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleCreateOrUpdate}
      />
    </AppShell>
  );
}
