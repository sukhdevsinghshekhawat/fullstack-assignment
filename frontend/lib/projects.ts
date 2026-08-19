import { apiRequest } from '@/lib/api';
import type {
  CreateProjectInput,
  Project,
  ProjectQuery,
  UpdateProjectInput,
} from '@/types/project';
import type { Task, TaskQuery } from '@/types/task';

export function getProjects(query: ProjectQuery = {}): Promise<Project[]> {
  const params = new URLSearchParams();
  if (query.search) params.set('search', query.search);
  if (query.priority) params.set('priority', query.priority);
  if (query.lead) params.set('lead', query.lead);
  if (query.dueDate) params.set('dueDate', query.dueDate);

  const qs = params.toString();
  return apiRequest<Project[]>(`/projects${qs ? `?${qs}` : ''}`);
}

export function getProject(id: string): Promise<Project> {
  return apiRequest<Project>(`/projects/${id}`);
}

export function createProject(input: CreateProjectInput): Promise<Project> {
  return apiRequest<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
  return apiRequest<Project>(`/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteProject(id: string): Promise<{ id: string; deleted: boolean }> {
  return apiRequest<{ id: string; deleted: boolean }>(`/projects/${id}`, {
    method: 'DELETE',
  });
}

export function getProjectTasks(id: string, query: TaskQuery = {}): Promise<Task[]> {
  const params = new URLSearchParams();
  if (query.search) params.set('search', query.search);
  if (query.status) params.set('status', query.status);
  if (query.priority) params.set('priority', query.priority);
  if (query.member) params.set('member', query.member);
  if (query.label) params.set('label', query.label);
  if (query.dueDate) params.set('dueDate', query.dueDate);

  const qs = params.toString();
  return apiRequest<Task[]>(`/projects/${id}/tasks${qs ? `?${qs}` : ''}`);
}
