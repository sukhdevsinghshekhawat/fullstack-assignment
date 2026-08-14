import { apiRequest } from '@/lib/api';
import type {
  CreateTaskInput,
  Task,
  TaskQuery,
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