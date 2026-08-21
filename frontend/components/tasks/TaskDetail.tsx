'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Lock, MoreHorizontal, Share2, Eye, PanelRight } from 'lucide-react';
import type {
  Task,
  TaskActivity as TaskActivityType,
  TaskComment as TaskCommentType,
  TaskMember,
  TaskPriority,
  TaskResource,
  TaskStatus,
  Team,
  UpdateTaskInput,
} from '@/types/task';
import {
  createComment,
  createResource,
  createTask,
  deleteComment,
  deleteResource,
  deleteTask,
  getActivity,
  getComments,
  getResources,
  getSubtasks,
  getTask,
  getTeams,
  getWorkspaceMembers,
  updateComment,
  updateTask,
} from '@/lib/tasks';
import { TaskProperties } from './TaskProperties';
import { TaskResources } from './TaskResources';
import { TaskSubtasks } from './TaskSubtasks';
import { TaskDetailsPanel } from './TaskDetailsPanel';
import { TaskComments } from './TaskComments';
import { TaskActivity } from './TaskActivity';
import { TaskModal } from './TaskModal';

interface TaskDetailProps {
  taskId: string;
  currentUserId: string;
}

export function TaskDetail({ taskId, currentUserId }: TaskDetailProps) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<TaskCommentType[]>([]);
  const [resources, setResources] = useState<TaskResource[]>([]);
  const [activities, setActivities] = useState<TaskActivityType[]>([]);
  const [workspaceMembers, setWorkspaceMembers] = useState<TaskMember[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [editingSubtask, setEditingSubtask] = useState<Task | null>(null);
  const [subtaskModalOpen, setSubtaskModalOpen] = useState(false);
  const [taskLocked, setTaskLocked] = useState(false);
  const [taskWatched, setTaskWatched] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const [shareFeedback, setShareFeedback] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const [taskData, subtaskData, commentData, resourceData, activityData, members, teamData] =
        await Promise.all([
          getTask(taskId),
          getSubtasks(taskId),
          getComments(taskId),
          getResources(taskId),
          getActivity(taskId),
          getWorkspaceMembers(),
          getTeams(),
        ]);
      setTask(taskData);
      setSubtasks(subtaskData);
      setComments(commentData);
      setResources(resourceData);
      setActivities(activityData);
      setWorkspaceMembers(members);
      setTeams(teamData);
    } catch (err: any) {
      if (err?.statusCode === 404) {
        setNotFound(true);
      } else {
        setError('Unable to load task.');
      }
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleUpdate = async (input: UpdateTaskInput) => {
    if (!task) return;
    const prev = task;
    // Optimistic update
    setTask((current) => {
      if (!current) return current;
      const next = { ...current };
      if (input.status) next.status = input.status;
      if (input.priority) next.priority = input.priority;
      if (input.dueDate !== undefined) next.dueDate = input.dueDate;
      if (input.startDate !== undefined) next.startDate = input.startDate;
      if (input.endDate !== undefined) next.endDate = input.endDate;
      if (input.teamId !== undefined) next.teamId = input.teamId;
      if (input.labels) {
        next.labels = input.labels.map((name) => ({
          label: { id: name, name },
        }));
      }
      if (input.memberIds) {
        next.members = input.memberIds.map((id) => {
          const member = workspaceMembers.find((m) => m.id === id);
          return { user: member ?? { id, name: null, email: null } };
        });
      }
      return next;
    });
    try {
      const updated = await updateTask(task.id, input);
      setTask(updated);
      // Refresh activity
      const activityData = await getActivity(task.id);
      setActivities(activityData);
    } catch (err) {
      setTask(prev);
      setError('Failed to update task.');
    }
  };

  const handleStatusChange = (status: TaskStatus) => {
    handleUpdate({ status });
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    handleUpdate({ priority });
  };

  const handleMembersChange = (memberIds: string[]) => {
    handleUpdate({ memberIds });
  };

  const handleDueDateChange = (dueDate: string | null) => {
    handleUpdate({ dueDate });
  };

  const handleStartDateChange = (startDate: string | null) => {
    handleUpdate({ startDate });
  };

  const handleEndDateChange = (endDate: string | null) => {
    handleUpdate({ endDate });
  };

  const handleLabelsChange = (labels: string[]) => {
    handleUpdate({ labels });
  };

  const handleTeamChange = (teamId: string | null) => {
    handleUpdate({ teamId });
  };

  const handleAddSubtask = async (input: {
    title: string;
    priority: TaskPriority;
    memberIds: string[];
    dueDate?: string;
  }) => {
    if (!task) return;
    const newSubtask = await createTask({
      title: input.title,
      priority: input.priority,
      memberIds: input.memberIds,
      dueDate: input.dueDate,
      parentTaskId: task.id,
    });
    setSubtasks((prev) => [...prev, newSubtask]);
    const activityData = await getActivity(task.id);
    setActivities(activityData);
  };

  const handleEditSubtask = (subtask: Task) => {
    setEditingSubtask(subtask);
    setSubtaskModalOpen(true);
  };

  const handleSubtaskModalSubmit = async (input: any) => {
    if (!editingSubtask) return;
    const updated = await updateTask(editingSubtask.id, input);
    setSubtasks((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (task) {
      const activityData = await getActivity(task.id);
      setActivities(activityData);
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    if (!window.confirm('Are you sure you want to delete this subtask?')) return;
    await deleteTask(subtaskId);
    setSubtasks((prev) => prev.filter((s) => s.id !== subtaskId));
    if (task) {
      const activityData = await getActivity(task.id);
      setActivities(activityData);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!task) return;
    const comment = await createComment(task.id, { content });
    setComments((prev) => [...prev, comment]);
    const activityData = await getActivity(task.id);
    setActivities(activityData);
  };

  const handleReplyComment = async (content: string, parentCommentId: string) => {
    if (!task) return;
    const comment = await createComment(task.id, { content, parentCommentId });
    setComments((prev) => {
      const updateReplies = (list: TaskCommentType[]): TaskCommentType[] =>
        list.map((c) => {
          if (c.id === parentCommentId) {
            return { ...c, replies: [...(c.replies || []), comment] };
          }
          return { ...c, replies: updateReplies(c.replies || []) };
        });
      return updateReplies(prev);
    });
    const activityData = await getActivity(task.id);
    setActivities(activityData);
  };

  const handleEditComment = async (commentId: string, content: string) => {
    if (!task) return;
    const updated = await updateComment(task.id, commentId, content);
    setComments((prev) => {
      const updateList = (list: TaskCommentType[]): TaskCommentType[] =>
        list.map((c) => {
          if (c.id === commentId) return updated;
          return { ...c, replies: updateList(c.replies || []) };
        });
      return updateList(prev);
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!task) return;
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    await deleteComment(task.id, commentId);
    setComments((prev) => {
      const filterList = (list: TaskCommentType[]): TaskCommentType[] =>
        list
          .filter((c) => c.id !== commentId)
          .map((c) => ({ ...c, replies: filterList(c.replies || []) }));
      return filterList(prev);
    });
  };

  const handleAddResource = async (input: { name: string; url: string; description?: string }) => {
    if (!task) return;
    const resource = await createResource(task.id, input);
    setResources((prev) => [resource, ...prev]);
    const activityData = await getActivity(task.id);
    setActivities(activityData);
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!task) return;
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    await deleteResource(task.id, resourceId);
    setResources((prev) => prev.filter((r) => r.id !== resourceId));
  };

  const handleToggleLock = () => {
    setTaskLocked((current) => !current);
  };

  const handleToggleWatch = () => {
    setTaskWatched((current) => !current);
  };

  const handleShareTask = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    try {
      if (shareUrl && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setShareFeedback(true);
      window.setTimeout(() => setShareFeedback(false), 1500);
    } catch {
      if (shareUrl && typeof window !== 'undefined') {
        window.prompt('Copy this task link:', shareUrl);
      }
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex min-h-0 flex-1">
        <div className="flex-1 overflow-auto p-6 space-y-6 animate-pulse">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-4 w-96 bg-muted rounded" />
          <div className="h-24 bg-muted rounded-lg" />
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-40 bg-muted rounded-lg" />
        </div>
        <div className="w-72 shrink-0 border-l border-border bg-surface p-4 space-y-4 animate-pulse">
          <div className="h-5 w-20 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground mb-2">Task not found</p>
        <p className="text-sm text-muted-foreground mb-4">The task you are looking for does not exist.</p>
        <button
          onClick={() => router.push('/tasks')}
          className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground mb-2">Unable to load task.</p>
        <button
          onClick={fetchAll}
          className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* Main content */}
      <div className="min-w-0 flex-1 overflow-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 px-6 py-3 border-b border-border">
          <button
            onClick={() => router.push('/tasks')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Tasks
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm text-foreground truncate">{task.title}</span>
        </div>

        <div className="p-6 space-y-6">
          {/* Task header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold text-foreground mb-1">{task.title}</h1>
              {task.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleToggleLock}
                className={`rounded-md p-2 transition-colors ${
                  taskLocked
                    ? 'bg-accent/10 text-accent hover:bg-accent/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                aria-label={taskLocked ? 'Unlock task' : 'Lock task'}
                title={taskLocked ? 'Unlock task' : 'Lock task'}
              >
                <Lock className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleToggleWatch}
                className={`rounded-md p-2 transition-colors ${
                  taskWatched
                    ? 'bg-accent/10 text-accent hover:bg-accent/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                aria-label={taskWatched ? 'Unwatch task' : 'Watch task'}
                title={taskWatched ? 'Unwatch task' : 'Watch task'}
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleShareTask}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={shareFeedback ? 'Link copied' : 'Share task'}
                title={shareFeedback ? 'Link copied' : 'Share task'}
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="More actions"
                title="More actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowDetailsPanel((current) => !current)}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={showDetailsPanel ? 'Hide details panel' : 'Show details panel'}
                title={showDetailsPanel ? 'Hide details panel' : 'Show details panel'}
              >
                <PanelRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Properties */}
          <TaskProperties
            task={task}
            workspaceMembers={workspaceMembers}
            onMembersChange={handleMembersChange}
            onDueDateChange={handleDueDateChange}
          />

          {/* Labels */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-foreground">Labels</h2>
            <div className="flex flex-wrap gap-1.5">
              {task.labels.map((l) => (
                <span
                  key={l.label.id}
                  className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  {l.label.name}
                </span>
              ))}
            </div>
          </div>

          {/* Resources */}
          <TaskResources resources={resources} onAdd={handleAddResource} onDelete={handleDeleteResource} />

          {/* Subtasks */}
          <TaskSubtasks
            subtasks={subtasks}
            workspaceMembers={workspaceMembers}
            onAdd={handleAddSubtask}
            onEdit={handleEditSubtask}
            onDelete={handleDeleteSubtask}
          />

          {/* Comments */}
          <TaskComments
            comments={comments}
            currentUserId={currentUserId}
            onAdd={handleAddComment}
            onReply={handleReplyComment}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
          />
        </div>
      </div>

      {/* Right details panel */}
      {showDetailsPanel && (
        <div className="flex w-full lg:w-72 shrink-0 flex-col border-l border-border bg-surface">
          <TaskDetailsPanel
            task={task}
            workspaceMembers={workspaceMembers}
            teams={teams}
            currentUserId={currentUserId}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            onMembersChange={handleMembersChange}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            onLabelsChange={handleLabelsChange}
            onTeamChange={handleTeamChange}
          />
          <div className="border-t border-border p-4">
            <TaskActivity activities={activities} />
          </div>
        </div>
      )}

      {/* Subtask edit modal */}
      <TaskModal
        visible={subtaskModalOpen}
        onClose={() => setSubtaskModalOpen(false)}
        task={editingSubtask}
        onSubmit={handleSubtaskModalSubmit}
      />
    </div>
  );
}