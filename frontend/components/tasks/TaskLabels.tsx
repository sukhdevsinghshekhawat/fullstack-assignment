import type { TaskLabel } from '@/types/task';

interface TaskLabelsProps {
  labels: { label: TaskLabel }[];
}

export function TaskLabels({ labels }: TaskLabelsProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {labels.map((label) => (
        <span
          key={label.label.id}
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground bg-muted"
        >
          {label.label.name}
        </span>
      ))}
    </div>
  );
}