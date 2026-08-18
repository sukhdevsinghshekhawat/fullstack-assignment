'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { TaskPriority } from '@/components/tasks/TaskPriority';
import { getTask } from '@/lib/tasks';
import type { Task } from '@/types/task';
import { TASK_STATUSES } from '@/types/task';

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = async () => {
    if (!params.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTask(params.id);
      setTask(data);
    } catch (err) {
      setError('Unable to load task.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [params.id]);

  const statusLabel = TASK_STATUSES.find((s) => s.value === task?.status)?.label ?? task?.status;

  return (
    <AppShell>
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="px-6 py-4 border-b border-border">
          <button
            onClick={() => router.push('/tasks')}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </button>
        </div>

        {loading && (
          <div className="p-6 space-y-4 animate-pulse">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-24 bg-muted rounded-lg" />
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span>{error}</span>
            <button onClick={fetchTask} className="ml-2 underline hover:no-underline">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && task && (
          <div className="p-6 max-w-3xl">
            <h1 className="text-2xl font-semibold text-foreground mb-2">{task.title}</h1>

            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" />
                {statusLabel}
              </span>
              <TaskPriority priority={task.priority} showLabel />
              {task.dueDate && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(task.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>

            {task.description && (
              <div className="rounded-lg border border-border bg-card p-4 mb-6">
                <p className="text-sm text-foreground whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            {task.members && task.members.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-medium text-foreground mb-2">Members</h2>
                <div className="flex items-center gap-2">
                  {task.members.map((m, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent"
                      title={m.user?.name || 'Member'}
                    >
                      {(m.user?.name || '?').charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {task.labels && task.labels.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-foreground mb-2">Labels</h2>
                <div className="flex gap-1.5 flex-wrap">
                  {task.labels.map((l) => (
                    <span
                      key={l.label.id}
                      className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-muted-foreground bg-muted"
                    >
                      {l.label.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}