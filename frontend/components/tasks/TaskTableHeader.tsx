import type { FieldVisibility } from './TaskFieldsMenu';

interface TaskTableHeaderProps {
  fields: FieldVisibility;
}

export function TaskTableHeader({ fields }: TaskTableHeaderProps) {
  return (
    <tr className="border-b border-border bg-muted/40">
      <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Task
      </th>
      {fields.priority && (
        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Priority
        </th>
      )}
      {fields.members && (
        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Members
        </th>
      )}
      {fields.dueDate && (
        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Due Date
        </th>
      )}
      {fields.labels && (
        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Labels
        </th>
      )}
      {fields.status && (
        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Status
        </th>
      )}
      {fields.reporter && (
        <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Reporter
        </th>
      )}
      <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Actions
      </th>
    </tr>
  );
}