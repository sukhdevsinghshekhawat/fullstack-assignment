'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { getProject } from '@/lib/projects';
import type { Project } from '@/types/project';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProject(params.id)
      .then(setProject)
      .catch(() => router.push('/projects'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) {
    return (
      <AppShell>
        <div className="p-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        </div>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">Project not found</p>
            <button onClick={() => router.push('/projects')} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
              Back to Projects
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => router.push('/projects')} className="hover:text-foreground">Projects</button>
          <span>/</span>
          <span className="text-foreground">{project.name}</span>
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">{project.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{project.description || 'No description provided.'}</p>
      </div>
    </AppShell>
  );
}
