import { apiRequest } from '@/lib/api';
import type {
  CreateProjectInput,
  Project,
  ProjectQuery,
  UpdateProjectInput,
} from '@/types/project';

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

export function getProjectTasks(id: string): Promise<any[]> {
  return apiRequest<any[]>(`/projects/${id}/tasks`);
}
