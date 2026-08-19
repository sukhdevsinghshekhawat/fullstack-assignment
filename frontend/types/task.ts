export type TaskStatus = 'TODO' | 'DOING' | 'COMPLETED' | 'ON_HOLD';
export type TaskPriority = 'NO_PRIORITY' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface TaskMember {
  id: string;
  name: string | null;
  email: string | null;
}

export interface TaskLabel {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
}

export interface TaskResource {
  id: string;
  taskId: string;
  userId: string;
  name: string;
  url: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  user?: TaskMember;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  parentCommentId: string | null;
  createdAt: string;
  updatedAt: string;
  user: TaskMember;
  replies: TaskComment[];
}

export interface TaskActivity {
  id: string;
  taskId: string;
  userId: string;
  type: string;
  message: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: TaskMember;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  startDate: string | null;
  endDate: string | null;
  parentTaskId: string | null;
  projectId: string | null;
  teamId: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy?: TaskMember;
  team?: Team | null;
  members: { user: TaskMember }[];
  labels: { label: TaskLabel }[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  startDate?: string;
  endDate?: string;
  parentTaskId?: string;
  projectId?: string;
  teamId?: string;
  memberIds?: string[];
  labels?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  parentTaskId?: string | null;
  projectId?: string | null;
  teamId?: string | null;
  memberIds?: string[];
  labels?: string[];
}

export interface TaskQuery {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  member?: string;
  label?: string;
  dueDate?: string;
}

export interface CreateCommentInput {
  content: string;
  parentCommentId?: string;
}

export interface CreateResourceInput {
  name: string;
  url: string;
  description?: string;
}

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'To Do' },
  { value: 'DOING', label: 'Doing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ON_HOLD', label: 'On Hold' },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'NO_PRIORITY', label: 'No Priority' },
  { value: 'URGENT', label: 'Urgent' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];