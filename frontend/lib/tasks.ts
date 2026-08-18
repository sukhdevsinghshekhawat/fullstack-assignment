import { apiRequest } from '@/lib/api';
import type {
  CreateCommentInput,
  CreateResourceInput,
  CreateTaskInput,
  Task,
  TaskActivity,
  TaskComment,
  TaskMember,
  TaskQuery,
  TaskResource,
  Team,
  UpdateTaskInput,
} from '@/types/task';

export function getTasks(query: TaskQuery = {}): Promise<Task[]> {
  const params = new URLSearchParams();
  if (query.search) params.set('search', query.search);
  if (query.status) params.set('status', query.status);
  if (query.priority) params.set('priority', query.priority);
  if (query.member) params.set('member', query.member);
  if (query.label) params.set('label', query.label);
  if (query.dueDate) params.set('dueDate', query.dueDate);

  const qs = params.toString();
  return apiRequest<Task[]>(`/tasks${qs ? `?${qs}` : ''}`);
}

export function getTask(id: string): Promise<Task> {
  return apiRequest<Task>(`/tasks/${id}`);
}

export function createTask(input: CreateTaskInput): Promise<Task> {
  return apiRequest<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateTask(
  id: string,
  input: UpdateTaskInput,
): Promise<Task> {
  return apiRequest<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteTask(id: string): Promise<{ id: string; deleted: boolean }> {
  return apiRequest<{ id: string; deleted: boolean }>(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

// ---------- Subtasks ----------

export function getSubtasks(id: string): Promise<Task[]> {
  return apiRequest<Task[]>(`/tasks/${id}/subtasks`);
}

// ---------- Comments ----------

export function getComments(id: string): Promise<TaskComment[]> {
  return apiRequest<TaskComment[]>(`/tasks/${id}/comments`);
}

export function createComment(
  id: string,
  input: CreateCommentInput,
): Promise<TaskComment> {
  return apiRequest<TaskComment>(`/tasks/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateComment(
  taskId: string,
  commentId: string,
  content: string,
): Promise<TaskComment> {
  return apiRequest<TaskComment>(`/tasks/${taskId}/comments/${commentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  });
}

export function deleteComment(
  taskId: string,
  commentId: string,
): Promise<{ id: string; deleted: boolean }> {
  return apiRequest<{ id: string; deleted: boolean }>(
    `/tasks/${taskId}/comments/${commentId}`,
    { method: 'DELETE' },
  );
}

// ---------- Resources ----------

export function getResources(id: string): Promise<TaskResource[]> {
  return apiRequest<TaskResource[]>(`/tasks/${id}/resources`);
}

export function createResource(
  id: string,
  input: CreateResourceInput,
): Promise<TaskResource> {
  return apiRequest<TaskResource>(`/tasks/${id}/resources`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function deleteResource(
  taskId: string,
  resourceId: string,
): Promise<{ id: string; deleted: boolean }> {
  return apiRequest<{ id: string; deleted: boolean }>(
    `/tasks/${taskId}/resources/${resourceId}`,
    { method: 'DELETE' },
  );
}

// ---------- Activity ----------

export function getActivity(id: string): Promise<TaskActivity[]> {
  return apiRequest<TaskActivity[]>(`/tasks/${id}/activity`);
}

// ---------- Members & Teams ----------

export function getWorkspaceMembers(): Promise<TaskMember[]> {
  return apiRequest<TaskMember[]>('/tasks/members');
}

export function getTeams(): Promise<Team[]> {
  return apiRequest<Team[]>('/tasks/teams');
}

export function createTeam(name: string): Promise<Team> {
  return apiRequest<Team>('/tasks/teams', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}