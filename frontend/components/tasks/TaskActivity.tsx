'use client';

import type { TaskActivity as TaskActivityType } from '@/types/task';

interface TaskActivityProps {
  activities: TaskActivityType[];
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function TaskActivity({ activities }: TaskActivityProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-foreground">Updates</h2>

      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">No updates yet.</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-medium text-accent">
                {(activity.user.name || activity.user.email || '?').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">
                    {activity.user.name || activity.user.email || 'Unknown'}
                  </span>{' '}
                  <span className="text-muted-foreground">{activity.message}</span>
                </p>
                <p className="text-xs text-muted-foreground">{timeAgo(activity.createdAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}