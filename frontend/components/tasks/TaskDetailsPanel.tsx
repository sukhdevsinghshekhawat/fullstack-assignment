'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Task, TaskMember, Team } from '@/types/task';
import { TaskStatusMenu } from './TaskStatusMenu';
import { TaskPriorityMenu } from './TaskPriorityMenu';
import { TaskMemberSelector } from './TaskMemberSelector';
import { TaskDatePicker } from './TaskDatePicker';

interface TaskDetailsPanelProps {
  task: Task;
  workspaceMembers: TaskMember[];
  teams: Team[];
  currentUserId: string;
  onStatusChange: (status: Task['status']) => void;
  onPriorityChange: (priority: Task['priority']) => void;
  onMembersChange: (memberIds: string[]) => void;
  onStartDateChange: (date: string | null) => void;
  onEndDateChange: (date: string | null) => void;
  onLabelsChange: (labels: string[]) => void;
  onTeamChange: (teamId: string | null) => void;
}

export function TaskDetailsPanel({
  task,
  workspaceMembers,
  teams,
  currentUserId,
  onStatusChange,
  onPriorityChange,
  onMembersChange,
  onStartDateChange,
  onEndDateChange,
  onLabelsChange,
  onTeamChange,
}: TaskDetailsPanelProps) {
  const [labelInput, setLabelInput] = useState('');
  const [addingLabel, setAddingLabel] = useState(false);

  const selectedMemberIds = task.members.map((m) => m.user.id);
  const currentLabels = task.labels.map((l) => l.label.name);

  const addLabel = () => {
    const name = labelInput.trim();
    if (!name) return;
    if (!currentLabels.includes(name)) {
      onLabelsChange([...currentLabels, name]);
    }
    setLabelInput('');
    setAddingLabel(false);
  };

  const removeLabel = (name: string) => {
    onLabelsChange(currentLabels.filter((l) => l !== name));
  };

  return (
    <div className="w-full lg:w-72 shrink-0 border-l border-border bg-surface p-4 space-y-5">
      <h2 className="text-sm font-semibold text-foreground">Details</h2>

      {/* Status */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Status</p>
        <TaskStatusMenu status={task.status} onChange={onStatusChange} />
      </div>

      {/* Priority */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Priority</p>
        <TaskPriorityMenu priority={task.priority} onChange={onPriorityChange} />
      </div>

      {/* Members */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Members</p>
        <TaskMemberSelector
          members={workspaceMembers}
          selectedIds={selectedMemberIds}
          onSelect={(id) => onMembersChange([...selectedMemberIds, id])}
          onRemove={(id) => onMembersChange(selectedMemberIds.filter((m) => m !== id))}
        />
      </div>

      {/* Dates */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Dates</p>
        <div className="flex items-center gap-1.5">
          <TaskDatePicker value={task.startDate} onChange={onStartDateChange} placeholder="Start" />
          <span className="text-muted-foreground">→</span>
          <TaskDatePicker value={task.endDate} onChange={onEndDateChange} placeholder="End" />
        </div>
      </div>

      {/* Labels */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Labels</p>
        <div className="flex flex-wrap gap-1">
          {currentLabels.map((name) => (
            <span
              key={name}
              className="group inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {name}
              <button
                onClick={() => removeLabel(name)}
                className="text-muted-foreground/60 hover:text-destructive"
                aria-label={`Remove label ${name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {addingLabel ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addLabel();
              }}
              className="inline-flex items-center gap-1"
            >
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="Label name"
                autoFocus
                className="w-24 rounded-full border border-border bg-background px-2 py-0.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                onBlur={addLabel}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setAddingLabel(false);
                    setLabelInput('');
                  }
                }}
              />
            </form>
          ) : (
            <button
              onClick={() => setAddingLabel(true)}
              className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Teams</p>
        <select
          value={task.teamId ?? ''}
          onChange={(e) => onTeamChange(e.target.value || null)}
          className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">No team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Reporter */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Reporter</p>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
            {(task.createdBy?.name || task.createdBy?.email || '?').charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-foreground">
            {task.createdBy?.name || task.createdBy?.email || 'Unknown'}
          </span>
        </div>
      </div>
    </div>
  );
}