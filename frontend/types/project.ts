export type ProjectPriority = 'NO_PRIORITY' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ProjectUser {
  id: string;
  name: string | null;
  email: string | null;
}

export interface ProjectTaskSummary {
  id: string;
  title: string;
  status: string;
  priority: ProjectPriority;
  dueDate: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  priority: ProjectPriority;
  dueDate: string | null;
  leadId: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  lead?: ProjectUser | null;
  createdBy?: ProjectUser | null;
  tasks?: ProjectTaskSummary[];
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  priority?: ProjectPriority;
  leadId?: string;
  dueDate?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string | null;
  priority?: ProjectPriority;
  leadId?: string | null;
  dueDate?: string | null;
}

export interface ProjectQuery {
  search?: string;
  priority?: ProjectPriority;
  lead?: string;
  dueDate?: string;
}
