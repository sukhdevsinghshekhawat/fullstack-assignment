'use client';

import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ProjectDetail } from '@/components/projects/ProjectDetail';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();

  return (
    <AppShell>
      <ProjectDetail projectId={params.id} />
    </AppShell>
  );
}