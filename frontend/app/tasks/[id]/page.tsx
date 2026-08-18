'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { TaskDetail } from '@/components/tasks/TaskDetail';
import { getCurrentUser } from '@/lib/auth';
import type { GuestUser } from '@/types/auth';

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<GuestUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch(() => {
        router.push('/login');
      })
      .finally(() => setAuthLoading(false));
  }, [router]);

  if (authLoading) {
    return (
      <AppShell>
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      </AppShell>
    );
  }

  if (!currentUser) return null;

  return (
    <AppShell>
      <TaskDetail taskId={params.id} currentUserId={currentUser.id} />
    </AppShell>
  );
}