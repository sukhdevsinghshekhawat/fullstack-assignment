import { User } from 'lucide-react';
import type { TaskMember } from '@/types/task';

interface TaskMemberProps {
  member: TaskMember;
}

export function TaskMember({ member }: TaskMemberProps) {
  return (
    <div className="flex items-center gap-2">
      <User
        className="h-5 w-5 rounded-full shrink-0"
        aria-label={`Avatar for ${member.name || 'member'}`}
      />
      <span className="truncate text-sm font-medium text-foreground">
        {member.name || 'Unassigned'}
      </span>
    </div>
  );
}