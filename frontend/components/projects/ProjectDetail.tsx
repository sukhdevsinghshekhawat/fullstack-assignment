'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Flag, Plus, User } from 'lucide-react';
import type { Project, ProjectPriority } from '@/types/project';
import type { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/types/task';
import { ProjectPriority as ProjectPriorityBadge } from './ProjectPriority';
import { ProjectModal } from './ProjectModal';
import { TaskModal } from '@/components/tasks/TaskModal';
import { TaskDeleteModal } from '@/components/tasks/TaskDeleteModal';
import { TaskTable } from '@/components/tasks/TaskTable';
import { TaskSearch } from '@/components/tasks/TaskSearch';
import { TaskFilterMenu } from '@/components/tasks/TaskFilterMenu';
import { TaskFieldsMenu, type FieldVisibility } from '@/components/tasks/TaskFieldsMenu';
import { getProject, getProjectTasks, updateProject, deleteProject } from '@/lib/projects';
import { createTask, getWorkspaceMembers, updateTask, deleteTask } from '@/lib/tasks';
import type { TaskMember } from '@/types/task';

interface ProjectDetailProps {
  projectId: string;
}

const DEFAULT_FIELDS: FieldVisibility = {
  priority: true,
  members: true,
  dueDate: true,
  labels: false,
  status: false,
  reporter: false,
};

const STATUS_GROUPS: { status: TaskStatus; label: string }[] = [
  { status: 'TODO', label: 'To Do' },
  { status: 'DOING', label: 'Doing' },
  { status: 'COMPLETED', label: 'Completed' },
  { status: 'ON_HOLD', label: 'On Hold' },
];

function formatDate(date: string | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspaceMembers, setWorkspaceMembers] = useState<TaskMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState<{ search?: string; status?: TaskStatus; priority?: Task['priority']; member?: string; label?: string; dueDate?: string }>({});
  const [fields, setFields] = useState<FieldVisibility>(DEFAULT_FIELDS);
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus | undefined>(undefined);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const [projectModalOpen, setProjectModalOpen] = useState(false);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const data = await getProject(projectId);
      setProject(data);
    } catch (err: any) {
      if (err?.statusCode === 404) {
        setNotFound(true);
      } else {
        setError('Unable to load project.');
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await getProjectTasks(projectId, query);
      setTasks(data);
    } catch {
      setError('Unable to load project tasks.');
    }
  }, [projectId, query]);

  useEffect(() => {
    fetchProject();
    getWorkspaceMembers().then(setWorkspaceMembers).catch(() => setWorkspaceMembers([]));
  }, [fetchProject]);

  useEffect(() => {
    if (!project) return;
    fetchTasks();
  }, [project, fetchTasks, query]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchInput || undefined }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (query.search && !task.title.toLowerCase().includes(query.search.toLowerCase())) return false;
      if (query.status && task.status !== query.status) return false;
      if (query.priority && task.priority !== query.priority) return false;
      if (query.member && !task.members?.some((m) => m.user.id === query.member)) return false;
      if (query.label && !task.labels?.some((l) => l.label.name === query.label)) return false;
      if (query.dueDate) {
        const due = task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '';
        if (due !== query.dueDate) return false;
      }
      return true;
    });
  }, [tasks, query]);

  const handleCreateTask = async (input: CreateTaskInput) => {
    const created = await createTask({ ...input, projectId });
    setTasks((prev) => [created, ...prev]);
  };

  const handleUpdateTask = async (id: string, input: UpdateTaskInput) => {
    const updated = await updateTask(id, input);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setDeleteTaskId(null);
  };

  const handleTaskModalSubmit = async (input: CreateTaskInput | UpdateTaskInput) => {
    if (editingTask) {
      await handleUpdateTask(editingTask.id, input as UpdateTaskInput);
    } else {
      await handleCreateTask(input as CreateTaskInput);
    }
  };

  const handleAddTask = (status?: TaskStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDefaultStatus(undefined);
    setTaskModalOpen(true);
  };

  const handleProjectUpdate = async (input: {
    name: string;
    description?: string;
    priority?: ProjectPriority;
    leadId?: string;
    dueDate?: string;
  }) => {
    const updated = await updateProject(projectId, {
      name: input.name,
      description: input.description ?? null,
      priority: input.priority,
      leadId: input.leadId ?? null,
      dueDate: input.dueDate ?? null,
    });
    setProject(updated);
  };

  const handleProjectDelete = async () => {
    const confirmed = window.confirm('Delete project?\nThis will not be reversible.');
    if (!confirmed) return;
    try {
      await deleteProject(projectId);
      router.push('/projects');
    } catch {
      setError('Failed to delete project.');
    }
  };

  const handleFilter = (field: 'status' | 'priority' | 'member' | 'label' | 'dueDate', value: string) => {
    setQuery((prev) => {
      const next = { ...prev };
      if (field === 'status') {
        if (next.status === value) delete next.status;
        else next.status = value as TaskStatus;
      } else if (field === 'priority') {
        if (next.priority === value) delete next.priority;
        else next.priority = value as Task['priority'];
      } else {
        if (next[field] === value) delete next[field];
        else next[field] = value;
      }
      return next;
    });
  };

  const deleteTaskToDelete = tasks.find((t) => t.id === deleteTaskId);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="border-b border-border px-6 py-4">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
          <div className="mt-4 flex gap-4">
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="p-6 space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="h-10 animate-pulse rounded bg-muted" />
              <div className="h-10 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">Project not found.</p>
          <button
            onClick={() => router.push('/projects')}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !project) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">Unable to load project.</p>
          <button
            onClick={fetchProject}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      {/* Project Header */}
      <div className="border-b border-border px-4 py-4 sm:px-6">
        {/* Breadcrumb / Back */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => router.push('/projects')}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Back to projects"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Projects
          </button>
          <span>/</span>
          <span className="text-foreground">{project.name}</span>
        </div>

        {/* Title + Actions */}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-foreground">{project.name}</h1>
            {project.description && (
              <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setProjectModalOpen(true)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground hover:bg-muted"
            >
              Edit
            </button>
            <button
              onClick={handleProjectDelete}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-destructive hover:bg-destructive/10"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Project Metadata */}
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5">
            <Flag className="h-3.5 w-3.5 text-muted-foreground" />
            <ProjectPriorityBadge priority={project.priority} />
          </div>
          {project.lead && (
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-foreground">{project.lead.name || project.lead.email || 'Unknown'}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-foreground">{formatDate(project.dueDate)}</span>
          </div>
        </div>
      </div>

      {/* Tasks Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <TaskSearch value={searchInput} onChange={setSearchInput} placeholder="Search tasks..." />
          <button
            onClick={() => setFieldsOpen(true)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground hover:bg-muted"
          >
            Fields
          </button>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground hover:bg-muted"
          >
            Filter
          </button>
        </div>
        <button
          onClick={() => handleAddTask()}
          className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <span className="inline-flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            Add Task
          </span>
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-6 mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <button onClick={fetchTasks} className="ml-2 underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Task Groups */}
      <div className="p-4 sm:p-6">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-base font-medium text-foreground">No tasks in this project.</p>
            <button
              onClick={() => handleAddTask()}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <span className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {STATUS_GROUPS.map((group) => {
              const groupTasks = filteredTasks.filter((t) => t.status === group.status);
              return (
                <div key={group.status}>
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-foreground">{group.label}</h3>
                      <span className="text-xs text-muted-foreground">({groupTasks.length})</span>
                    </div>
                    <button
                      onClick={() => handleAddTask(group.status)}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Add task to ${group.label}`}
                    >
                      <Plus className="h-3 w-3" />
                      Add Task
                    </button>
                  </div>
                  <div className="mt-1 overflow-hidden rounded-lg border border-border bg-surface">
                    <TaskTable
                      tasks={groupTasks}
                      fields={fields}
                      onEdit={handleEditTask}
                      onDelete={setDeleteTaskId}
                      onAddTask={() => handleAddTask(group.status)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Edit Modal */}
      <ProjectModal
        visible={projectModalOpen}
        project={project}
        members={workspaceMembers}
        onClose={() => setProjectModalOpen(false)}
        onSubmit={handleProjectUpdate}
      />

      {/* Task Modal (Add/Edit) */}
      <TaskModal
        visible={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        task={editingTask}
        defaultStatus={defaultStatus}
        defaultProjectId={projectId}
        onSubmit={handleTaskModalSubmit}
      />

      {/* Delete Confirmation Modal */}
      <TaskDeleteModal
        visible={deleteTaskId !== null}
        taskTitle={deleteTaskToDelete?.title ?? ''}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={() => deleteTaskId && handleDeleteTask(deleteTaskId)}
      />

      {/* Fields Menu */}
      <TaskFieldsMenu
        visible={fieldsOpen}
        onClose={() => setFieldsOpen(false)}
        fields={fields}
        onToggle={(field) => setFields((prev) => ({ ...prev, [field]: !prev[field] }))}
        view="list"
        onViewChange={() => {}}
      />

      {/* Filter Menu */}
      <TaskFilterMenu
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        selected={{
          status: query.status,
          priority: query.priority,
          member: query.member,
          label: query.label,
          dueDate: query.dueDate,
        }}
        onSelect={handleFilter}
      />
    </div>
  );
}